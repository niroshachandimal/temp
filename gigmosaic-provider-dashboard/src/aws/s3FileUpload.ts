import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: import.meta.env.VITE_S3_BUCKET_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_S3_ACCESS_KEY,
    secretAccessKey: import.meta.env.VITE_S3_SECRET_KEY,
  },
});

const S3_BUCKET = import.meta.env.VITE_S3_BUCKET_NAME;
const CDN_URL = import.meta.env.VITE_S3_CDN_URL;
const S3_BASE_URL = `https://${S3_BUCKET}.s3.${
  import.meta.env.VITE_S3_BUCKET_REGION
}.amazonaws.com/`;

export const uploadToS3 = async (file: File, folderName: string) => {
  if (!file) throw new Error("No file provided for upload");

  const key = `${folderName}/${file.name}-${Date.now()}`;

  const params = {
    Bucket: S3_BUCKET,
    Key: key,
    Body: await file.arrayBuffer(),
    ContentType: file.type,
  };

  try {
    const command = new PutObjectCommand(params);
    await s3.send(command);

    const s3Url = `${S3_BASE_URL}${key}`;
    const cdnUrl = s3Url.replace(S3_BASE_URL, CDN_URL);

    console.log("File uploaded successfully:", cdnUrl);
    return cdnUrl;
  } catch (error) {
    console.error("S3 Upload Error: ", error);
    throw error;
  }
};

export const deleteFromS3 = async (fileUrl: string) => {
  if (!fileUrl) throw new Error("No file URL provided for deletion");

  const fileKey = fileUrl.replace(CDN_URL, "");

  const params = {
    Bucket: S3_BUCKET,
    Key: fileKey,
  };

  try {
    const command = new DeleteObjectCommand(params);
    await s3.send(command);

    console.log("File deleted successfully:", fileUrl);
    return true;
  } catch (error) {
    console.error("S3 Delete Error: ", error);
    throw error;
  }
};
