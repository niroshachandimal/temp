import { useState, useEffect } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { addToast } from "@heroui/react";

interface GallaryInputProps {
  onChangeValue: (value: { images: (string | File)[] }) => void;
  value?: string[];
  error?: string;
}

const GallaryInput = ({ onChangeValue, value, error }: GallaryInputProps) => {
  const [images, setImages] = useState<(string | File)[]>(value || []);

  useEffect(() => {
    if (!images.length && value?.length) {
      setImages(value);
    }
  }, [value]);

  useEffect(() => {
    onChangeValue({ images });
  }, [images]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);

    selectedFiles.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        console.error("File size should be less than 5mb.");
        addToast({
          title: "Validation Error",
          description: "File size should be less than 5mb.",
          radius: "md",
          color: "danger",
        });
        return;
      }

      if (!["image/jpeg", "image/png"].includes(file.type)) {
        addToast({
          title: "Validation Error",
          description: "Only JPEG and PNG formats are supported.",
          radius: "md",
          color: "danger",
        });
        console.error("Only JPEG and PNG formats are supported.");
        return;
      }

      // Check image dimensions (500px by 300px)
      const image = new Image();
      const objectUrl = URL.createObjectURL(file);
      image.src = objectUrl;

      image.onload = () => {
        if (image.width < 500 || image.height < 300) {
          addToast({
            title: "Validation Error",
            description: "Minimum image size is 500px x 300px.",
            radius: "md",
            color: "danger",
          });
          console.error("Minimum image size is 500px x 300px.");
          return;
        }

        // If all validations pass, add the file to images
        setImages((prevImages) => [...prevImages, file]);
      };

      // Handle image load error
      image.onerror = () => {
        addToast({
          title: "Validation Error",
          description: "Invalid image file.",
          radius: "md",
          color: "danger",
        });
      };
    });
  };

  const deleteImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  return (
    <>
      {/* Image Upload Section */}
      <ul className="list-disc pl-4">
        <li className="text-gray-400 text-xs">First image is a main image</li>
        <li className="text-gray-400 text-xs">Maximum 5 images allowed</li>
        <li className="text-gray-400 text-xs">
          Minimum image size is 500px x 300px and maximum file size is 5mb.
        </li>
      </ul>

      <div className="flex flex-initial gap-5 relative">
        {images?.map((item, index) => (
          <div
            className="rounded-lg bg-gray-200 dark:bg-gray-800 flex justify-center items-center cursor-pointer aspect-square max-w-[120px] max-h-[120px] relative"
            key={index}
          >
            <img
              rel="preload"
              src={typeof item === "string" ? item : URL.createObjectURL(item)}
              alt="Preview"
              className="rounded-lg object-contain aspect-square max-w-[120px] max-h-[120px] relative"
            />
            <span
              onClick={() => deleteImage(index)}
              className="absolute -top-2 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex justify-center items-center cursor-pointer"
            >
              <IoMdClose />
            </span>
          </div>
        ))}

        {/* Upload Button */}
        {images?.length < 5 && (
          <label
            htmlFor="file-input"
            className="flex flex-col justify-center items-center hover:bg-gray-200 bg-gray-100 dark:bg-gray-800 min-w-[120px] min-h-[120px] rounded-lg cursor-pointer border border-dashed border-gray-400 dark:border-gray-600"
          >
            <IoCloudUploadOutline size={24} />
            <input
              type="file"
              accept="image/jpeg, image/png"
              multiple
              onChange={handleFileChange}
              className="hidden"
              id="file-input"
            />
            <small className="text-xs mt-2">JPEG, PNG</small>
          </label>
        )}
      </div>

      {error && <small className="text-error -mt-5">{error}</small>}
    </>
  );
};

export default GallaryInput;
