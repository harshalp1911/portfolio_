/**
 * Creates the admin account (public registration is disabled).
 *
 *   npm run create-admin                 # create the first admin
 *   npm run create-admin -- --force      # add another admin, or reset an existing admin's password
 *
 * Reads ADMIN_EMAIL, ADMIN_USERNAME and ADMIN_PASSWORD from the environment,
 * and prompts for any that are missing. Connects to MONGODB_URI from .env.
 */
import readline from 'readline';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';

dotenv.config();

const MIN_PASSWORD_LENGTH = 8;

const ask = (question: string, hidden = false): Promise<string> => {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
  if (hidden) {
    // Keep the typed password off the screen
    (rl as any)._writeToOutput = (text: string) => {
      if (text.includes(question)) process.stdout.write(text);
    };
  }
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      if (hidden) process.stdout.write('\n');
      rl.close();
      resolve(answer.trim());
    });
  });
};

const main = async (): Promise<void> => {
  const force = process.argv.includes('--force');

  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  await mongoose.connect(mongoURI);

  const existingCount = await User.countDocuments();
  if (existingCount > 0 && !force) {
    console.log(`An admin account already exists (${existingCount} user(s)). Nothing changed.`);
    console.log('Run with --force to add another admin or reset a password.');
    return;
  }

  const email = (process.env.ADMIN_EMAIL || await ask('Admin email: ')).toLowerCase();
  if (!email) {
    throw new Error('Email is required');
  }

  const password = process.env.ADMIN_PASSWORD || await ask('Admin password: ', true);
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    existingUser.password = hashedPassword;
    await existingUser.save();
    console.log(`✅ Password reset for ${email}`);
    return;
  }

  const username = process.env.ADMIN_USERNAME || await ask('Admin username: ');
  if (!username) {
    throw new Error('Username is required');
  }

  await User.create({ username, email, password: hashedPassword, role: 'admin' });
  console.log(`✅ Admin account created for ${email}`);
};

main()
  .catch((error) => {
    console.error('❌', error.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
