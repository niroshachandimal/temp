import React, { useState, useCallback, useEffect } from "react";
import CustomButton from "./CustomButton";
import { FiTrash, FiUploadCloud } from "react-icons/fi";

interface FileInputProps {
  onChange: (file: File) => void;
  onDelete: () => void;
  accept: string;
  required?: boolean;
  title: string;
  description: string;
  initialPreview?: string | null;
  isUploading?: boolean;
}

const FileInput: React.FC<FileInputProps> = ({
  onChange,
  accept,
  required,
  title,
  description,
  initialPreview,
  isUploading = false,
  onDelete,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialPreview || null,
  );

  // Add effect to update preview when initialPreview changes
  useEffect(() => {
    setPreviewUrl(initialPreview || null);
  }, [initialPreview]);

  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      if (file && file.type.startsWith("image/")) {
        const previewUrl = URL.createObjectURL(file);
        setPreviewUrl(previewUrl);
        onChange(file);
        return () => URL.revokeObjectURL(previewUrl);
      }
    },
    [onChange],
  );

  // Cleanup preview URL on unmount or when preview changes
  useEffect(() => {
    return () => {
      if (previewUrl && !previewUrl.includes("http")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDeleteImage = () => {
    setPreviewUrl(null);
    onDelete?.(); // Call onDelete callback if provided
  };

  return (
    <div
      className={`
        file-input border-2 border-dashed rounded-sm
        ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"}
        ${previewUrl ? "p-0" : "p-4"}
        h-[200px] w-full relative
      `}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {isUploading && (
        <div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-center rounded-sm">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-4 border-t-primary border-r-primary border-b-primary/30 border-l-primary/30 rounded-full animate-spin" />
            <p className="text-white text-sm">Uploading...</p>
          </div>
        </div>
      )}
      {!previewUrl ? (
        <>
          <input
            type="file"
            onChange={handleFileChange}
            accept={accept}
            required={required}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center justify-center h-full"
          >
            <FiUploadCloud size={40} className="text-gray-400 mb-2" />
            <p className="text-sm font-medium text-gray-700 mb-1">{title}</p>
            <p className="text-sm text-gray-500">{description}</p>
          </label>
        </>
      ) : (
        <div className="relative h-full w-full flex items-center justify-center bg-gray-100">
          <img
            src={previewUrl}
            alt="Preview"
            className="rounded-lg max-h-full max-w-full object-contain p-2"
          />
          <CustomButton
            isIconOnly
            variant="light"
            color="danger"
            className="absolute top-2 right-2"
            onPress={handleDeleteImage}
          >
            <FiTrash size={20} className="text-red-400" />
          </CustomButton>
        </div>
      )}
    </div>
  );
};

export default FileInput;
