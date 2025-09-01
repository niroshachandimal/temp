import { Alert } from "@heroui/react";

interface CustomAlertProps {
  title: string;
  description: string;
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
  variant?: "bordered" | "flat" | "faded" | "solid";
}

const CustomAlert = ({
  title = "Enter title",
  description = "",
  variant = "faded",
  color = "primary",
}: CustomAlertProps) => {
  return (
    <Alert
      variant={variant}
      color={color}
      description={description}
      title={title}
    />
  );
};

export default CustomAlert;
