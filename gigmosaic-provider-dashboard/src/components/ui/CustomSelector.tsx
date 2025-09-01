// import { Select, SelectItem } from "@heroui/react";
// import { Key, ReactNode } from "react";

// export const animals = [
//   { key: "cat", label: "Cat" },
//   { key: "dog", label: "Dog" },
//   { key: "elephant", label: "Elephant" },
//   { key: "lion", label: "Lion" },
//   { key: "tiger", label: "Tiger" },
//   { key: "giraffe", label: "Giraffe" },
//   { key: "dolphin", label: "Dolphin" },
//   { key: "penguin", label: "Penguin" },
//   { key: "zebra", label: "Zebra" },
//   { key: "shark", label: "Shark" },
//   { key: "whale", label: "Whale" },
//   { key: "otter", label: "Otter" },
//   { key: "crocodile", label: "Crocodile" },
// ];

// interface ISelectorProps {
//   label: string;
//   placeholder: string;
//   selectionMode: "single" | "multiple";
//   size?: "sm" | "md" | "lg";
//   variant?: "flat" | "bordered" | "underlined" | "faded";
//   labelPlacement?: "inside" | "outside" | "outside-left";
//   errorMessage?: string;
//   description?: string;
//   defaultSelectedKey?: string;
//   selectedKey?: string | string[];
//   defaultItems: { label: string; id: string }[];
//   disabledKeys?: string[] | number[];
//   isDisabled?: boolean;
//   isRequired?: boolean;
//   isInvalid?: boolean;
//   className?: string;
//   width?: "sm" | "none";
//   endContent?: ReactNode;
//   startContent?: ReactNode;
//   onInputChange?: (value: string) => void;
//   onSelectionChange?: (selectedId: string | null) => void;
// }

// const CustomSelector = ({
//   label = "",
//   placeholder = "Enter placeholder",
//   size = "md",
//   variant = "bordered",
//   labelPlacement = "outside",
//   description = "",
//   errorMessage = "",
//   isDisabled = false,
//   isInvalid = false,
//   isRequired = false,
//   width = "sm",
//   defaultItems = [],
//   defaultSelectedKey = "",
//   disabledKeys = [],
//   selectedKey = undefined,
//   onInputChange,
//   onSelectionChange,
//   selectionMode = "single",
//   ...props
// }: ISelectorProps) => {

//       const handleSelectionChange = (keys: any) => {
//         if (onSelectionChange) {
//           // For single selection, get the first key; for multiple, pass all as array
//           if (selectionMode === "single") {
//             const selectedKey = keys ? Array.from(keys)[0] as string : null;
//             onSelectionChange(selectedKey);
//           } else {
//             const selectedKeys = keys ? Array.from(keys) as string[] : [];
//             onSelectionChange(selectedKeys.length > 0 ? selectedKeys[0] : null);
//           }
//         }
//       };

//   return (
//     <Select
//       selectionMode={selectionMode}
//       label={label}
//       size={size}
//       defaultSelectedKeys={defaultSelectedKeys}
//       selectedKeys={selectedKey}
//       placeholder={placeholder}
//       disabledKeys={disabledKeys}
//       isDisabled={isDisabled}
//       isRequired={isRequired}
//       variant={variant}
//       labelPlacement={labelPlacement}
//       allowsCustomValue={false}
//       description={description}
//       errorMessage={errorMessage}
//       isInvalid={isInvalid}
//       onInputChange={onInputChange}
//       onSelectionChange={handleSelectionChange}
//       className={`${width === "sm" ? "max-w-xs" : ""} ${
//         width === "none" ? "w-full" : ""
//       }`}
//       {...props}
//     >
//       {animals.map((animal) => (
//         <SelectItem key={animal.key}>{animal.label}</SelectItem>
//       ))}
//     </Select>
//   );
// };

// export default CustomSelector;
