import { Button } from "@heroui/react";
import { ReactNode } from "react";

interface CustomButtonProps {
  label?: string;
  size?: "sm" | "md" | "lg";
  type?: "button" | "submit" | "reset";
  radius?: "none" | "sm" | "md" | "lg" | "full";
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
  variant?:
    | "solid"
    | "bordered"
    | "light"
    | "flat"
    | "faded"
    | "shadow"
    | "ghost";
  className?: string;
  isLoading?: boolean;
  isDisabled?: boolean;
  isIconOnly?: boolean;
  endContent?: ReactNode;
  startContent?: ReactNode;
  fullWidth?: boolean;
  onPress?: () => void;
}

const CustomButton = ({
  label = "Button",
  size = "sm",
  type = "button",
  radius = "sm",
  color = "default",
  variant = "solid",
  isLoading = false,
  isDisabled = false,
  fullWidth = false,
  isIconOnly,
  endContent,
  startContent,
  onPress,
  className,
  children,
  ...props
}: CustomButtonProps & { children?: ReactNode }) => {
  return (
    <>
      <Button
        size={size}
        radius={radius}
        color={color}
        type={type}
        variant={variant}
        fullWidth={fullWidth}
        isLoading={isLoading}
        isDisabled={isDisabled}
        isIconOnly={isIconOnly}
        startContent={startContent}
        endContent={endContent}
        onPress={onPress}
        className={className}
        {...props}
      >
        {isIconOnly ? children : label}
      </Button>
    </>
  );
};

export default CustomButton;
