import { Checkbox } from "@heroui/react";

interface CustomInputProps {
  label: string;
  size?: "sm" | "md" | "lg";
  radius?: "none" | "sm" | "md" | "lg" | "full";
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
  isDisabled?: boolean;
  className?: string;
  onValueChange?: (value: boolean) => void;
  isSelected?: boolean;
  // defaultSelected?: boolean;
}

const CustomCheckbox = ({
  label = "Enter label",
  size = "md",
  radius = "md",
  color = "primary",
  isDisabled = false,
  onValueChange,
  isSelected,
  className,
  // defaultSelected = false,
  ...props
}: CustomInputProps) => {
  return (
    <Checkbox
      size={size}
      radius={radius}
      color={color}
      className={className}
      isDisabled={isDisabled}
      // defaultSelected={defaultSelected}
      isSelected={isSelected}
      onValueChange={onValueChange}
      {...props}
    >
      {label}
    </Checkbox>
  );
};

export default CustomCheckbox;
