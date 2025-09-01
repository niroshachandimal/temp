import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { ReactNode, Key } from "react";

interface CustomInputProps {
  label?: string;
  placeholder: string;
  size?: "sm" | "md" | "lg";
  variant?: "flat" | "bordered" | "underlined" | "faded";
  labelPlacement?: "inside" | "outside" | "outside-left";
  errorMessage?: string;
  description?: string;
  defaultSelectedKey?: string;
  // selectedKey?: string;
  selectedKey?: string | undefined;
  defaultItems: { label: string; id: string }[];
  disabledKeys?: string[] | number[];
  isDisabled?: boolean;
  isRequired?: boolean;
  isInvalid?: boolean;
  className?: string;
  width?: "sm" | "none";
  endContent?: ReactNode;
  startContent?: ReactNode;
  onInputChange?: (value: string) => void;
  onSelectionChange?: (selectedId: string | null) => void;
}

const CustomAutocomplete = ({
  label = "",
  placeholder = "Enter placeholder",
  size = "md",
  variant = "bordered",
  labelPlacement = "outside",
  description = "",
  errorMessage = "",
  isDisabled = false,
  isInvalid = false,
  isRequired = false,
  width = "sm",
  defaultItems = [],
  defaultSelectedKey = "",
  disabledKeys = [],
  selectedKey = undefined,
  onInputChange,
  onSelectionChange,
  ...props
}: CustomInputProps) => {
  const handleSelectionChange = (key: Key | null) => {
    if (onSelectionChange) {
      onSelectionChange(key as string | null);
    }
  };
  return (
    <>
      <Autocomplete
        className={`${width === "sm" ? "max-w-xs" : ""} ${
          width === "none" ? "w-full" : ""
        }`}
        label={label}
        size={size}
        defaultItems={defaultItems}
        defaultSelectedKey={defaultSelectedKey}
        selectedKey={selectedKey}
        placeholder={placeholder}
        disabledKeys={disabledKeys}
        isDisabled={isDisabled}
        isRequired={isRequired}
        variant={variant}
        labelPlacement={labelPlacement}
        allowsCustomValue={false}
        description={description}
        errorMessage={errorMessage}
        isInvalid={isInvalid}
        onInputChange={onInputChange}
        onSelectionChange={handleSelectionChange}
        {...props}
      >
        {(item) => (
          <AutocompleteItem key={item.id}>{item.label}</AutocompleteItem>
        )}
      </Autocomplete>
    </>
  );
};

export default CustomAutocomplete;
