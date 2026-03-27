// Fix SSL certificate issue
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

require('dotenv').config();
const cloudinary = require('cloudinary').v2;

console.log('=== Cloudinary Debug ===');
console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('API Key:', process.env.CLOUDINARY_API_KEY);
console.log('API Secret:', process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Not Set');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Test connection
console.log('\n=== Testing Connection ===');
cloudinary.api.ping()
  .then(result => {
    console.log('✅ SUCCESS: Cloudinary connection works!');
    console.log('Response:', result);
  })
  .catch(error => {
    console.log('❌ ERROR: Cloudinary connection failed');
    console.log('Error:', error.message);
    console.log('Full error:', error);
  });
