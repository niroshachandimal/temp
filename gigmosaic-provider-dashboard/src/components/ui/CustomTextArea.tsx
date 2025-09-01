import { Textarea } from "@heroui/react";
import { ReactNode } from "react";

interface CustomTextAreaProps {
  label: string;
  placeholder?: string;
  variant?: "flat" | "faded" | "bordered" | "underlined";
  labelPlacement?: "inside" | "outside" | "outside-left";
  minRows?: number;
  maxRows?: number;
  errorMessage?: string;
  description?: string;
  defaultValue?: string;
  isClearable?: boolean;
  isReadOnly?: boolean;
  isDisabled?: boolean;
  isRequired?: boolean;
  isInvalid?: boolean;
  endContent?: ReactNode;
  startContent?: ReactNode;
  onValueChange?: (value: string) => void;
  value?: string;
}

const CustomTextArea = ({
  label = "Enter label",
  placeholder = "Enter placeholder",
  variant = "bordered",
  labelPlacement = "outside",
  description = "",
  errorMessage = "",
  minRows = 4,
  maxRows = 4,
  isClearable = false,
  isDisabled = false,
  isInvalid = false,
  defaultValue = "",
  startContent,
  endContent,
  onValueChange,
  value,
  ...props
}: CustomTextAreaProps) => {
  return (
    <Textarea
      label={label}
      placeholder={placeholder}
      variant={variant}
      defaultValue={defaultValue}
      minRows={minRows}
      maxRows={maxRows}
      labelPlacement={labelPlacement}
      isDisabled={isDisabled}
      description={description}
      errorMessage={errorMessage}
      isClearable={isClearable}
      isInvalid={isInvalid}
      value={value}
      onValueChange={onValueChange}
      startContent={startContent}
      endContent={endContent}
      {...props}
    />
  );
};

export default CustomTextArea;
