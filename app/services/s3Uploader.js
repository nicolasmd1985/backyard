import AWS from 'aws-sdk';
import { Buffer } from 'buffer';
import fetch from 'node-fetch';

// Configure AWS with environment variables (ensure these are set up in Expo)
AWS.config.update({
  region: process.env.EXPO_PUBLIC_AWS_REGION,
  accessKeyId: process.env.EXPO_PUBLIC_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.EXPO_PUBLIC_AWS_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3();

export const uploadImageToS3 = async (photoUri, fileName) => {
  try {
    const response = await fetch(photoUri);
    if (!response.ok) {
      throw new Error(`Failed to fetch image from URI: ${photoUri}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const params = {
      Bucket: process.env.EXPO_PUBLIC_S3_BUCKET_NAME,
      Key: `uploads/${fileName}`,
      Body: buffer,
      ContentType: 'image/jpeg', // Adjust if you're using different image types
      ACL: 'public-read',
    };

    const upload = await s3.upload(params).promise();
    return upload.Location; // URL of the uploaded image
  } catch (error) {
    console.error("Error uploading image to S3:", error);
    return null;
  }
};
