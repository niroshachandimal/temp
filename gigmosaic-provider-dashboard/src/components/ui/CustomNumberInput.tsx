import { NumberInput } from "@heroui/react";
import { ReactNode } from "react";
import { boolean } from "yup";

interface CustomInputProps {
  label: string;
  placeholder?: string;
  name?: string;
  size?: "sm" | "md" | "lg";
  radius?: "none" | "sm" | "md" | "lg" | "full";
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
  variant?: "flat" | "bordered" | "underlined" | "faded";
  labelPlacement?: "inside" | "outside" | "outside-left";
  errorMessage?: string;
  description?: string;
  className?: string;
  defaultValue?: number;
  minValue?: number;
  maxValue?: number;
  isReadOnly?: boolean;
  isWheelDisabled?: boolean;
  isRequired?: boolean;
  isInvalid?: boolean;
  isDisabled?: boolean;
  isRequireField?: boolean;
  endContent?: ReactNode;
  startContent?: ReactNode;
  formatOptions?: Intl.NumberFormatOptions;
  onValueChange?: (value: number) => void;
  value?: number;
}

const CustomNumberInput = ({
  label = "Enter label",
  placeholder = "Enter placeholder",
  size = "md",
  radius = "md",
  color = "default",
  variant = "bordered",
  labelPlacement = "outside",
  description = "",
  errorMessage = "",
  name = "",
  className = "",
  isWheelDisabled = false,
  isInvalid = false,
  isDisabled = false,
  isRequireField = false,
  defaultValue = 0,
  minValue = 0,
  maxValue = 999999999,
  formatOptions,
  startContent,
  endContent,
  onValueChange,
  value,
  ...props
}: CustomInputProps) => {
  return (
    <NumberInput
      label={label}
      placeholder={placeholder}
      size={size}
      name={name}
      radius={radius}
      color={color}
      variant={variant}
      className={className}
      defaultValue={defaultValue}
      labelPlacement={labelPlacement}
      isWheelDisabled={isWheelDisabled}
      description={description}
      errorMessage={errorMessage}
      isInvalid={isInvalid}
      value={value}
      minValue={minValue}
      maxValue={maxValue}
      formatOptions={formatOptions}
      onValueChange={onValueChange}
      startContent={startContent}
      endContent={endContent}
      isDisabled={isDisabled}
      classNames={{
        label: `${
          isRequireField
            ? "after:content-['*'] after:text-red-500 after:ml-1"
            : ""
        }  `,
      }}
      {...props}
    />
  );
};

export default CustomNumberInput;
