const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { Buffer } = require('buffer');
const fetch = require('node-fetch');

// Configure AWS with environment variables
const s3Client = new S3Client({
  region: process.env.EXPO_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.EXPO_PUBLIC_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.EXPO_PUBLIC_AWS_SECRET_ACCESS_KEY,
  },
});

const uploadImageToS3 = async (photoUri, fileName) => {
  try {
    const response = await fetch(photoUri);
    if (!response.ok) {
      throw new Error(`Failed to fetch image from URI: ${photoUri}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const command = new PutObjectCommand({
      Bucket: process.env.EXPO_PUBLIC_S3_BUCKET_NAME,
      Key: `uploads/${fileName}`,
      Body: buffer,
      ContentType: 'image/jpeg', // Adjust if you're using different image types
      ACL: 'public-read',
    });

    await s3Client.send(command);
    
    // Construct the URL for the uploaded image
    const imageUrl = `https://${process.env.EXPO_PUBLIC_S3_BUCKET_NAME}.s3.${process.env.EXPO_PUBLIC_AWS_REGION}.amazonaws.com/uploads/${fileName}`;
    return imageUrl;
  } catch (error) {
    console.error("Error uploading image to S3:", error);
    return null;
  }
};

module.exports = { uploadImageToS3 };
