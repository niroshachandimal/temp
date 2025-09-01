import { Avatar, Select, SelectItem } from "@heroui/react";
import React, { ReactNode, useEffect, useState } from "react";

interface UserItem {
  staffId: string | number;
  fullName: string;
  avatar?: string;
}

interface CustomSelectorWithUserProps {
  label?: string;
  name?: string;
  placeholder?: string;
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
  defaultValue?: string;
  isReadOnly?: boolean;
  isDisabled?: boolean;
  isRequired?: boolean;
  isInvalid?: boolean;
  endContent?: ReactNode;
  startContent?: ReactNode;
  displayValue?: string | number;
  selectedValue?: (value: string) => void;
  className?: string;
  data?: UserItem[];
  disabledKeys?: string[];
}

const CustomSelectorWithUser = ({
  label = "",
  placeholder = "Enter placeholder",
  size = "md",
  radius = "sm",
  color = "default",
  variant = "bordered",
  labelPlacement = "outside",
  description = "",
  errorMessage = "",
  isDisabled = false,
  isInvalid = false,
  isRequired = false,
  name = "",
  startContent,
  endContent,
  selectedValue,
  displayValue = "",
  className,
  disabledKeys = [],
  data,
  ...props
}: CustomSelectorWithUserProps) => {
  const [value, setValue] = useState<string | number | undefined>(displayValue);

  console.log("data", data);

  useEffect(() => {
    setValue(displayValue);
  }, [displayValue]);

  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue(e.target.value);
    if (selectedValue) {
      return selectedValue(e.target.value);
    }
  };

  return (
    <Select
      classNames={{
        trigger: "h-12",
      }}
      items={data ? data : []}
      disabledKeys={disabledKeys}
      maxListboxHeight={400}
      variant={variant}
      label={label}
      labelPlacement={labelPlacement}
      size={size}
      name={name}
      placeholder={placeholder}
      radius={radius}
      color={color}
      isDisabled={isDisabled}
      description={description}
      errorMessage={errorMessage}
      isInvalid={isInvalid}
      value={value}
      defaultSelectedKeys={
        displayValue !== undefined ? [displayValue] : undefined
      }
      isRequired={isRequired}
      onChange={handleSelectionChange}
      startContent={startContent}
      endContent={endContent}
      className={className}
      {...props}
      renderValue={(items) => {
        return items.map((item) => (
          <div key={item.data?.staffId} className="flex items-center gap-2">
            <Avatar
              alt={item.data?.fullName}
              className="flex-shrink-0"
              size="sm"
              name={item.data?.fullName}
            />
            <div className="flex flex-col">
              <span>{item.data?.fullName}</span>
              <span className="text-default-500 text-tiny">
                ({item.data?.staffId})
              </span>
            </div>
          </div>
        ));
      }}
    >
      {(data) => (
        <SelectItem key={data.staffId} textValue={data.fullName}>
          <div className="flex gap-2 items-center">
            <Avatar
              alt={data.fullName}
              className="flex-shrink-0"
              size="sm"
              name={data.fullName}
              //   src={data.avatar}
            />
            <div className="flex flex-col">
              <span className="text-small">{data.fullName}</span>
              <span className="text-tiny text-default-400">{data.staffId}</span>
            </div>
          </div>
        </SelectItem>
      )}
    </Select>
  );
};

export default CustomSelectorWithUser;
