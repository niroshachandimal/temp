import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

// AWS Configuration
const S3_BUCKET = import.meta.env.VITE_S3_BUCKET_NAME;
const REGION = import.meta.env.VITE_S3_BUCKET_REGION;

console.log("S3_BUCKET: ", import.meta.env.VITE_S3_BUCKET_NAME);
console.log("REGION: ", import.meta.env.VITE_S3_BUCKET_REGION);
console.log("ACCESS_KEY: ", import.meta.env.VITE_S3_ACCESS_KEY);
console.log("SECRET_KEY: ", import.meta.env.VITE_S3_SECRET_KEY);

// Initialize S3 Client
const s3Client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_S3_ACCESS_KEY,
    secretAccessKey: import.meta.env.VITE_S3_SECRET_KEY,
  },
});

export const uploadToS3 = async (file: File) => {
  try {
    console.log("Starting file upload process...");
    console.log("File details:", {
      name: file.name,
      type: file.type,
      size: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
    });

    if (!file) {
      throw new Error("No file provided for upload");
    }
    if (file.size > 5242880) {
      throw new Error("File size should be less than 5MB");
    }

    // Convert File to ArrayBuffer
    const fileBuffer = await file.arrayBuffer();
    const key = `my-folder/${file.name}-${new Date().getTime().toString()}`;

    console.log("Generated S3 key:", key);

    const command = new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
      Body: new Uint8Array(fileBuffer),
      ContentType: file.type,
      // Removed ACL parameter
    });

    console.log("Sending upload command to S3...");
    const result = await s3Client.send(command);
    console.log("S3 upload response:", result);

    const fileUrl = `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/${key}`;
    console.log("Generated file URL:", fileUrl);

    return fileUrl;
  } catch (err) {
    console.error("Detailed upload error:", {
      error: err,
      message: err instanceof Error ? err.message : "Unknown error",
      stack: err instanceof Error ? err.stack : undefined,
    });
    throw new Error(
      err instanceof Error ? err.message : "Failed to upload file",
    );
  }
};

export const deleteFromS3 = async (fileKey: string) => {
  try {
    if (!fileKey) {
      throw new Error("No file key provided for deletion");
    }

    const command = new DeleteObjectCommand({
      Bucket: S3_BUCKET,
      Key: fileKey,
    });

    await s3Client.send(command);
    return true;
  } catch (err) {
    console.error("Error deleting file from S3:", err);
    throw err;
  }
};
