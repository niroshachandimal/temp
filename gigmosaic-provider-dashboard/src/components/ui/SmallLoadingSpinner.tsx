import { Spinner } from "@heroui/react";

interface ISmallSpinnerProps {
  label?: string;
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning";
  labelColor?:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "foreground";
  size?: "sm" | "md" | "lg";
  variant?: "default" | "simple" | "gradient" | "spinner" | "wave" | "dots";
}

const SmallLoadingSpinner = ({
  label = "",
  color = "primary",
  size = "sm",
  variant = "default",
  labelColor = "foreground",
}: ISmallSpinnerProps) => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <Spinner
        label={label}
        color={color}
        size={size}
        variant={variant}
        labelColor={labelColor}
      />
    </div>
  );
};

export default SmallLoadingSpinner;
