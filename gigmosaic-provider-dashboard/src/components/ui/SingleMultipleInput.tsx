import { useEffect, useState } from "react";
import CustomInput from "./CustomInput";
import CustomButton from "./CustomButton";
import { RiDeleteBin4Line } from "react-icons/ri";
import { IoIosAddCircleOutline } from "react-icons/io";

interface SingleMultipleInputProps {
  onChangeValude: (values: string[]) => void;
  value: string[];
  error?: { [key: string]: string };
}

const SingleMultipleInput = ({
  onChangeValude,
  value,
  error,
}: SingleMultipleInputProps) => {
  const [fields, setFields] = useState([{ id: Date.now(), value: "" }]);

  useEffect(() => {
    if (value?.length && fields[0]?.value === "") {
      setFields(
        value.map((item, index) => ({ id: Date.now() + index, value: item }))
      );
    }
  }, [value]);

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
          {fields.length > 1 && (
            <div className="mt-6 cursor-pointer">
              <CustomButton
                isIconOnly={true}
                variant="light"
                onPress={() => handleRemoveField(field.id)}
              >
                <RiDeleteBin4Line size={20} className="text-red-400" />
              </CustomButton>
            </div>
          )}
        </div>
      ))}
      {error && (
        <>
          {Object?.keys(error)
            .map((key) => {
              if (key.startsWith("include")) {
                return (
                  <small key={key} className="text-red-500 -my-2">
                    {error[key]}
                  </small>
                );
              }
              return null;
            })
            .find(Boolean)}{" "}
        </>
      )}

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
