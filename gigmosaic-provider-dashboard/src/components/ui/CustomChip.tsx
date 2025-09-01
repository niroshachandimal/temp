import { Chip } from "@heroui/react";

interface IChipProps {
  label: string;
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning";
  variant?:
    | "solid"
    | "bordered"
    | "light"
    | "flat"
    | "faded"
    | "shadow"
    | "dot";
  size?: "sm" | "md" | "lg";
  className?: string;
  radius?: "sm" | "md" | "lg" | "full";
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
}

const CustomChip = ({
  label = "lable",
  radius = "full",
  color = "primary",
  variant = "flat",
  size = "sm",
  startContent,
  endContent,
  className = "",
}: IChipProps) => {
  return (
    <>
      <Chip
        size={size}
        color={color}
        variant={variant}
        radius={radius}
        startContent={startContent}
        endContent={endContent}
        className={className}
      >
        {label}
      </Chip>
    </>
  );
};

export default CustomChip;
