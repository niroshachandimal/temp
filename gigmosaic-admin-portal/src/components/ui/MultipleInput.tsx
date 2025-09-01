import { useEffect, useState } from "react";
import CustomInput from "./CustomInput";
import CustomButton from "./CustomButton";
import { IoTrashBin } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { IoIosAddCircleOutline } from "react-icons/io";
import CustomNumberInput from "./CustomNumberInput";

interface MultipleInputProps {
  onChangeValude: (
    values: { name: string; price: number; image: File | null }[]
  ) => void;
}

const MultipleInput = ({ onChangeValude }: MultipleInputProps) => {
  const [fields, setFields] = useState<
    { id: number; name: string; price: number; image: File | null }[]
  >([{ id: Date.now(), name: "", price: 0, image: null }]);

  const handleAddField = () => {
    setFields([...fields, { id: Date.now(), name: "", price: 0, image: null }]);
  };

  const handleRemoveField = (id: number) => {
    setFields(fields.filter((field) => field.id !== id));
  };

  const handleValueChange = (
    id: number,
    key: "name" | "price",
    newValue: string
  ) => {
    setFields((prevFields) =>
      prevFields.map((field) =>
        field.id === id
          ? {
              ...field,
              [key]: key === "price" ? Number(newValue) || 0 : newValue,
            }
          : field
      )
    );
  };

  const handleImageChange = (id: number, file: File | null) => {
    setFields((prevFields) =>
      prevFields.map((field) =>
        field.id === id ? { ...field, image: file } : field
      )
    );
  };

  const handleRemoveImage = (id: number) => {
    setFields((prevFields) =>
      prevFields.map((field) =>
        field.id === id ? { ...field, image: null } : field
      )
    );
  };

  useEffect(() => {
    const filteredFields = fields.filter(
      (field) =>
        field?.name?.trim() !== "" ||
        (field?.price !== null && field?.price !== 0) ||
        field?.image !== null
    );
    onChangeValude(filteredFields?.length > 0 ? filteredFields : []);
  }, [fields, onChangeValude]);

  return (
    <>
      {fields.map((field) => (
        <div
          key={field.id}
          className="flex gap-5 flex-inline justify-center items-center"
        >
          <div className="relative">
            <label
              className="rounded-lg bg-gray-200 flex justify-center items-center cursor-pointer aspect-square w-[60px] h-[60px] "
              htmlFor={`image-upload-${field.id}`}
            >
              {field.image ? (
                <>
                  <img
                    src={URL.createObjectURL(field.image)}
                    alt="Preview"
                    className="rounded-lg object-contain aspect-square w-full h-full relative"
                  />
                  <span
                    onClick={() => handleRemoveImage(field.id)}
                    className="absolute -top-2 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex justify-center items-center cursor-pointer"
                  >
                    <IoMdClose />
                  </span>
                </>
              ) : (
                <span className="text-gray-500">+</span>
              )}
            </label>
          </div>

          {/* Hidden File Input */}
          <input
            id={`image-upload-${field.id}`}
            type="file"
            accept="image/*"
            className="hidden "
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleImageChange(field.id, e.target.files[0]);
              }
            }}
          />

          {/* Name Input */}
          <CustomInput
            label="Name"
            type="text"
            placeholder="Enter title"
            value={field.name}
            onValueChange={(newValue) =>
              handleValueChange(field.id, "name", newValue as string)
            }
          />

          {/* Price Input */}
          <CustomNumberInput
            label="Price"
            placeholder="Enter Price"
            value={field.price}
            onValueChange={(newValue) =>
              handleValueChange(field.id, "price", newValue.toString())
            }
          />

          {/* Remove Button */}
          {fields.length > 1 && (
            <div className="mt-6 cursor-pointer">
              <CustomButton
                isIconOnly={true}
                variant="light"
                onPress={() => handleRemoveField(field.id)}
              >
                <IoTrashBin size={20} className="text-red-400" />
              </CustomButton>
            </div>
          )}
        </div>
      ))}

      {/* Add New Button */}
      <div className="-mt-3">
        <CustomButton
          label="Add New"
          className="text-green-600"
          startContent={
            <IoIosAddCircleOutline
              size={20}
              className="text-green-600 cursor-pointer"
            />
          }
          variant="light"
          onPress={handleAddField}
        />
      </div>
    </>
  );
};

export default MultipleInput;
