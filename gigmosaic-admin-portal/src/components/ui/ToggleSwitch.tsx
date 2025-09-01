import React from "react";
import { Switch } from "@heroui/react";

interface ToggleSwitchProps {
  isSelected: boolean;
  onValueChange: (value: boolean) => void;
  size?: "sm" | "md" | "lg";
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
  isDisabled?: boolean;
  className?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  isSelected,
  onValueChange,
  size = "md",
  color = "success",
  isDisabled = false,
  className = "",
}) => {
  return (
    <Switch
      isSelected={isSelected}
      onValueChange={onValueChange}
      size={size}
      color={color}
      isDisabled={isDisabled}
      className={className}
    />
  );
};

export default ToggleSwitch;
