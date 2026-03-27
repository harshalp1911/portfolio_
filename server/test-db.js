const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    
    // Test Experience
    const Experience = mongoose.model('Experience', new mongoose.Schema({
      position: String,
      company: String,
      period: String,
      description: String,
      order: Number
    }));
    
    const experiences = await Experience.find();
    console.log('\n📋 EXPERIENCES IN DATABASE:', experiences.length);
    console.log(JSON.stringify(experiences, null, 2));
    
    // Test Education
    const Education = mongoose.model('Education', new mongoose.Schema({
      degree: String,
      institution: String,
      period: String,
      description: String,
      order: Number
    }));
    
    const education = await Education.find();
    console.log('\n🎓 EDUCATION IN DATABASE:', education.length);
    console.log(JSON.stringify(education, null, 2));
    
    // Test Content
    const Content = mongoose.model('Content', new mongoose.Schema({
      type: String,
      hero: Object,
      about: Object
    }));
    
    const content = await Content.find();
    console.log('\n📰 CONTENT IN DATABASE:', content.length);
    console.log(JSON.stringify(content, null, 2));
    
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
