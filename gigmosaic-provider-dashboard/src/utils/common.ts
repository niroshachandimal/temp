import { addToast } from "@heroui/react";
import {
  CommonSubfolder,
  CustomerSubfolder,
  EntityType,
  ExtSubfolder,
  ProviderSubfolder,
  uploadFileToS3,
} from "./s3FileUploader";

interface IMultiFileUploadprops {
  files: FileList;
  baseFolder: EntityType;
  mainFolder:
    | CustomerSubfolder
    | ProviderSubfolder
    | CommonSubfolder
    | ExtSubfolder;
  subFolder: string;
  nestedPath?: string;
  errorMessageType?: "File" | "Image" | "Document" | "Video" | "Audio";
  callback: (res: string[]) => void;
}

//MULTIPLE FILE UPLOAD
export const multipleFileUplaodHelper = async ({
  files,
  baseFolder,
  mainFolder,
  nestedPath,
  subFolder,
  errorMessageType = "File",
}: IMultiFileUploadprops) => {
  if (!files || files.length === 0) {
    addToast({
      title: `${errorMessageType} not found`,
      description: `No ${errorMessageType} found to upload. Please try again`,
      radius: "md",
      color: "danger",
    });
    console.error("No files found to upload");
    return [];
  }

  if (!baseFolder || !mainFolder) {
    addToast({
      title: `${errorMessageType} Upload`,
      description:
        "Required parameters are missing or invalid. Please contact support if the issue persists.",
      radius: "md",
      color: "danger",
    });
    console.error(
      "Required parameters are missing or invalid : Base Folder and main folder"
    );
    return [];
  }
  const urlArry: string[] = [];
  console.log("File: ", files);

  for (const file of files) {
    try {
      const { url } = await uploadFileToS3(file, {
        baseFolder: baseFolder,
        mainFolder: mainFolder,
        subFolder: subFolder,
        nestedPath: nestedPath,
        fileName: file.name,
      });
      urlArry.push(url);
    } catch (err) {
      console.error(
        `Failed to upload ${file.name ? file.name : "(File Name is empty)"}:`,
        err
      );
      addToast({
        title: "Upload Failed",
        description: `Could not upload ${file.name ? file.name : "file"}`,
        radius: "md",
        color: "danger",
      });
    }
  }
  return urlArry;
};

//FIRST LETTER UPPER CASE
export const firstLetterUpperCase = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
