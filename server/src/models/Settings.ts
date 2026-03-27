import mongoose, { Document, Schema } from 'mongoose';

export interface ISettings extends Document {
  email: string;
  phone: string;
  address: string;
  linkedIn: string;
  github: string;
  twitter?: string;
  instagram?: string;
  updatedAt: Date;
}

const SettingsSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  linkedIn: {
    type: String,
    required: true,
  },
  github: {
    type: String,
    required: true,
  },
  twitter: {
    type: String,
  },
  instagram: {
    type: String,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<ISettings>('Settings', SettingsSchema);
