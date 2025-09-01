import { Pagination, Select, SelectItem } from "@heroui/react";

interface PaginationProps {
  initialPage: number;
  total: number;
  page: number;
  size?: "sm" | "md" | "lg";
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
  variant?: "bordered" | "light" | "flat" | "faded";
  className?: string;
  showControls?: boolean;
  loop?: boolean;
  showShadow?: boolean;
  itemPerPage?: number;

  onChange?: (page: number) => void;
}

const CustomPagination = ({
  size = "sm",
  color = "primary",
  variant = "bordered",
  showControls = true,
  loop = false,
  showShadow = false,
  className,
  onChange,
  page,
  ...props
}: PaginationProps) => {
  const pageCount = [
    { key: "10", label: "10" },
    { key: "15", label: "15" },
    { key: "20", label: "20" },
    { key: "50", label: "50" },
    { key: "100", label: "100" },
  ];
  return (
    <>
      <Select className="max-w-[100px]">
        {pageCount.map((p) => (
          <SelectItem key={p.key}>{p.label}</SelectItem>
        ))}
      </Select>
      <Pagination
        size={size}
        loop={loop}
        page={page}
        color={color}
        showShadow={showShadow}
        variant={variant}
        showControls={showControls}
        className={className}
        siblings={2}
        onChange={onChange}
        {...props}
      ></Pagination>
    </>
  );
};

export default CustomPagination;
