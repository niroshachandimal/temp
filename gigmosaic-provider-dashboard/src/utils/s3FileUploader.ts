import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const S3_BUCKET = import.meta.env.VITE_S3_BUCKET_NAME;
const CDN_URL = import.meta.env.VITE_S3_CDN_URL;
const S3_BASE_URL = `https://${S3_BUCKET}.s3.${
  import.meta.env.VITE_S3_BUCKET_REGION
}.amazonaws.com/`;

const s3 = new S3Client({
  region: import.meta.env.VITE_S3_BUCKET_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_S3_ACCESS_KEY,
    secretAccessKey: import.meta.env.VITE_S3_SECRET_KEY,
  },
});

//Base Folder Types
export type EntityType = "company" | "customer" | "provider" | "common" | "ext";

//Subfolder Types
export type CompanySubfolder = "profile" | "logo" | "documents" | "tax";
export type CustomerSubfolder =
  | "profile-picture"
  | "invoices"
  | "bookings"
  | "common";
export type ProviderSubfolder =
  | "service"
  | "payment"
  | "invoice"
  | "profile-picture"
  | "common"
  | "ext";
export type CommonSubfolder = "terms" | "marketing" | "faqs";
export type ExtSubfolder = "analytics" | "logs";

type SubfolderMap = {
  company: CompanySubfolder;
  customer: CustomerSubfolder;
  provider: ProviderSubfolder;
  common: CommonSubfolder;
  ext: ExtSubfolder;
};

export interface GeneratePathOptions<T extends EntityType> {
  baseFolder: T; // 1st level folder
  mainFolder: SubfolderMap[T]; // 2nd level folder
  subFolder?: string; // 3rd Level folder - companyId, providerId, etc. — required for some folders
  nestedPath?: string; // optional nested structure
  fileName: string;
}

/**
 * S3 Folder Structure (Strictly Typed)
 *
 * /company/
 *       ├── profile/
 *       ├── logo/
 *       ├── tax/
 *       └── documents/
 *
 *
 * /customer/
 *   └── {customerId}-{customername}/
 *       ├── profile-picture/
 *       ├── invoices/
 *       ├── bookings/
 *       └── common/
 *
 * /provider/
 *   └── {providerId}-{providerName}/
 *       ├── service/
 *       |   └── {serviceName-timestamp}/            → each service folder or file
 *       ├── payment/                                  → receipts, confirmations
 *       ├── invoice/                                  → invoice documents
 *       ├── profile-picture/                          → profile images
 *       ├── common/                                   → reusable or shared docs
 *       └── ext/                                      → integrations, logs, etc.
 *
 * /common/
 *   ├── terms/        → company-wide terms & conditions
 *   ├── marketing/    → banners, PDFs, etc.
 *   └── faqs/         → global FAQs
 *
 * /ext/
 *   ├── analytics/    → 3rd-party analytic exports
 *   └── logs/         → external logs, audits
 */

//Strongly Typed Key Generator
export function generateS3Key<T extends EntityType>({
  baseFolder,
  subFolder,
  mainFolder,
  nestedPath,
  fileName,
}: GeneratePathOptions<T>): string {
  let path = `${baseFolder}/`;
  if (subFolder) path += `${subFolder}/`;
  path += `${mainFolder}/`;
  if (nestedPath) path += `${nestedPath}/`;
  const uniqueName = `${Date.now()}-${fileName}`;
  return `${path}${uniqueName}`;
}

// Upload File to S3
export async function uploadFileToS3<T extends EntityType>(
  file: File,
  options: GeneratePathOptions<T>,
  contentType = file.type
): Promise<{ key: string; url: string }> {
  console.log("uploadFileToS3 file ", file);
  console.log("uploadFileToS3 oprions ", options);
  console.log("uploadFileToS3 contentType ", contentType);
  const key = generateS3Key(options);
  const arrayBuffer = await file.arrayBuffer();

  console.log("uploadFileToS3 key: ", key);

  const params = {
    Bucket: S3_BUCKET,
    Key: key,
    Body: arrayBuffer,
    ContentType: contentType,
    // ACL: "private",
  };

  const command = new PutObjectCommand(params);
  await s3.send(command);

  const s3Url = `${S3_BASE_URL}${key}`;
  const url = s3Url.replace(S3_BASE_URL, CDN_URL);

  return {
    key,
    url: url,
  };
}
