import { Select, SelectItem } from "@heroui/react";
import { ReactNode } from "react";

interface CustomSelectProps {
  label?: string;
  placeholder?: string;
  selectedKeys?: any;
  onSelectionChange?: (keys: any) => void;
  children?: ReactNode;
  isRequired?: boolean;
  isDisabled?: boolean;
  isInvalid?: boolean;
  errorMessage?: string;
  description?: string;
  size?: "sm" | "md" | "lg";
  radius?: "none" | "sm" | "md" | "lg" | "full";
  variant?: "flat" | "bordered" | "underlined" | "faded";
  labelPlacement?: "inside" | "outside" | "outside-left";
  className?: string;
}

const CustomSelect = ({
  label = "",
  placeholder = "Select an option",
  selectedKeys,
  onSelectionChange,
  children,
  isRequired = false,
  isDisabled = false,
  isInvalid = false,
  errorMessage = "",
  description = "",
  size = "md",
  radius = "sm",
  variant = "bordered",
  labelPlacement = "outside",
  className,
  ...props
}: CustomSelectProps) => {
  return (
    <Select
      label={label}
      placeholder={placeholder}
      selectedKeys={selectedKeys}
      onSelectionChange={onSelectionChange}
      isRequired={isRequired}
      isDisabled={isDisabled}
      isInvalid={isInvalid}
      errorMessage={errorMessage}
      description={description}
      size={size}
      radius={radius}
      variant={variant}
      labelPlacement={labelPlacement}
      className={className}
      classNames={{
        base: "w-full",
        trigger: "min-h-12",
        listbox: "max-h-60",
        popover: "w-full",
        selectorIcon: "text-default-400",
        value: "text-default-900",
        label: "text-default-700 font-medium",
      }}
      {...props}
    >
      {children}
    </Select>
  );
};

export { CustomSelect, SelectItem };
