require('dotenv').config();
const { uploadImageToS3 } = require('./s3Uploader');

// Debug environment variables
console.log('Environment Variables:');
console.log('AWS Region:', process.env.EXPO_PUBLIC_AWS_REGION);
console.log('AWS Access Key ID:', process.env.EXPO_PUBLIC_AWS_ACCESS_KEY_ID ? '***exists***' : 'missing');
console.log('AWS Secret Key:', process.env.EXPO_PUBLIC_AWS_SECRET_ACCESS_KEY ? '***exists***' : 'missing');
console.log('S3 Bucket Name:', process.env.EXPO_PUBLIC_S3_BUCKET_NAME);

// Test function
const testS3Upload = async () => {
  try {
    // Test with a sample image URL
    const testImageUrl = 'https://picsum.photos/200/300'; // Using a random image for testing
    const fileName = `test-${Date.now()}.jpg`;
    
    console.log('Starting S3 upload test...');
    const result = await uploadImageToS3(testImageUrl, fileName);
    
    if (result) {
      console.log('Upload successful!');
      console.log('Image URL:', result);
    } else {
      console.error('Upload failed - no URL returned');
    }
  } catch (error) {
    console.error('Test failed with error:', error);
  }
};

// Run the test
testS3Upload(); 