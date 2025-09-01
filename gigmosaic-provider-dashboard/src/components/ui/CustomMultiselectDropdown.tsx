// import {
//   Chip,
//   Dropdown,
//   DropdownItem,
//   DropdownMenu,
//   DropdownTrigger,
// } from "@heroui/react";
// import { useEffect, useMemo, useState } from "react";
// import CustomButton from "./CustomButton";

// interface CustomMultiselectDropdownProps {
//   label: string;
//   options: { id: string; label: string };
//   value: string[];
//   handleChangevalue: (value: string[]) => void;
// }

// const CustomMultiselectDropdown = ({
//   label,
//   options,
//   value,
//   handleChangevalue,
// }: CustomMultiselectDropdownProps) => {
//   const [selectedids, setSelectedids] = useState<Set<string>>(new Set([...""]));

//   const selectedLabels = useMemo(
//     () =>
//       Array.from(selectedids)
//         .map((id) => options.find((item) => item.id === id)?.label)
//         .filter(Boolean) as string[],
//     [selectedids]
//   );

//   const selectedidArray = useMemo(() => Array.from(selectedids), [selectedids]);

//   useEffect(() => {
//     handleChangevalue(selectedidArray);
//   }, [selectedidArray]);

//   return (
//     <>
//       {selectedLabels.length != 0 ? (
//         <div className="flex gap-2 flex-wrap">
//         {selectedLabels?.map((value, index) => (
//           <Chip color="success" variant="dot" key={index}>
//               {value.split("_").join(" ")}
//             </Chip>
//           ))}
//           </div>
//         ) : (
//         <></>
//       )}

//       {/* Dropdown Menu */}
//       <div className="grid grid-cols-1 md:grid-cols-3">
//         <Dropdown>
//           <DropdownTrigger>
//             <CustomButton className="min-w-[30px]" label={label} />
//           </DropdownTrigger>
//           <DropdownMenu
//             aria-label="Multiple selection example"
//             closeOnSelect={false}
//             selectedKeys={selectedids}
//             selectionMode="multiple"
//             variant="flat"
//             onSelectionChange={(keys) =>
//               setSelectedids(new Set(keys as unknown as string[]))
//             }
//           >
//             {options.map(({ id, label }) => (
//               <DropdownItem key={id}>{label}</DropdownItem>
//             ))}
//           </DropdownMenu>
//         </Dropdown>
//       </div>
//     </>
//   );
// };

// export default CustomMultiselectDropdown;

import {
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { useEffect, useMemo, useState } from "react";
import CustomButton from "./CustomButton";

interface CustomMultiselectDropdownProps {
  label: string;
  options: { id: string; label: string }[];
  value?: string[];
  isUpdate?: boolean;
  handleChangevalue: (value: string[]) => void;
}

const CustomMultiselectDropdown = ({
  isUpdate = false,
  label,
  options,
  value,
  handleChangevalue,
}: CustomMultiselectDropdownProps) => {
  const [selectedids, setSelectedids] = useState<Set<string>>(
    new Set(value?.length ? value : "")
  );

  useEffect(() => {
    if (!isUpdate) return;
    if (selectedids.size === 0) {
      setSelectedids(new Set(value));
    }
  }, [value, selectedids]);

  const selectedLabels = useMemo(
    () =>
      Array.from(selectedids)
        .map((id) => options.find((item) => item.id === id)?.label)
        .filter(Boolean) as string[],
    [selectedids, options]
  );

  const selectedidArray = useMemo(() => Array.from(selectedids), [selectedids]);

  useEffect(() => {
    handleChangevalue(selectedidArray);
  }, [selectedidArray, handleChangevalue]);

  return (
    <>
      {selectedLabels.length > 0 ? (
        <div className="flex gap-2 flex-wrap">
          {selectedLabels.map((value, index) => (
            <Chip color="success" variant="dot" key={index}>
              {value.split("_").join(" ")}
            </Chip>
          ))}
        </div>
      ) : (
        <p>{value?.join(", ")}</p>
      )}

      {/* Dropdown Menu */}
      <div className="grid grid-cols-1 md:grid-cols-3">
        <Dropdown>
          <DropdownTrigger>
            <CustomButton className="min-w-[30px]" label={label} />
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Multiple selection example"
            closeOnSelect={false}
            selectedKeys={selectedids}
            selectionMode="multiple"
            variant="flat"
            onSelectionChange={(keys) =>
              setSelectedids(new Set(keys as unknown as string[]))
            }
          >
            {options?.map(({ id, label }) => (
              <DropdownItem key={id}>{label}</DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </div>
    </>
  );
};

export default CustomMultiselectDropdown;
