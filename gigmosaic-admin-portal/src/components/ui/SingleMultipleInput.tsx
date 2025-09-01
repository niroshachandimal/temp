import { useEffect, useState } from "react";
import CustomInput from "./CustomInput";
import CustomButton from "./CustomButton";
import { IoTrashBin } from "react-icons/io5";
import { IoIosAddCircleOutline } from "react-icons/io";

interface SingleMultipleInputProps {
  onChangeValude: (values: string[]) => void;
}

const SingleMultipleInput = ({ onChangeValude }: SingleMultipleInputProps) => {
  const [fields, setFields] = useState([{ id: Date.now(), value: "" }]);

  const handleAddField = () => {
    setFields([...fields, { id: Date.now(), value: "" }]);
  };

  const handleRemoveField = (id: number) => {
    setFields(fields.filter((field) => field.id !== id));
  };

  const handleValueChange = (id: number, newValue: string) => {
    setFields((prevFields) =>
      prevFields.map((field) =>
        field.id === id ? { ...field, value: newValue } : field
      )
    );
  };

  useEffect(() => {
    const filteredFields = fields.filter((field) => field.value !== "");
    if (filteredFields.length > 0) {
      onChangeValude(filteredFields.map((field) => field.value));
    } else {
      onChangeValude([]);
    }
  }, [fields, onChangeValude]);

  return (
    <>
      {fields.map((field) => (
        <div
          key={field.id}
          className="flex gap-5 flex-inline justify-center items-center"
        >
          <CustomInput
            label="Title"
            type="text"
            placeholder="Enter include title"
            value={field.value}
            onValueChange={(newValue) => handleValueChange(field.id, newValue)}
          />
          {fields.length > 1 && ( // Hide the trash button if only one input field remains
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

export default SingleMultipleInput;
