import { Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import CustomButton from "./CustomButton";
import { ReactNode } from "react";
import { IoMdHelpCircle } from "react-icons/io";

interface PopoverProps {
  showArrow?: boolean;
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
  buttonColor?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
  placements?:
    | "top-start"
    | "top"
    | "top-end"
    | "bottom-start"
    | "bottom"
    | "bottom-end"
    | "right-start"
    | "right"
    | "right-end"
    | "left-start"
    | "left"
    | "left-end";
  icon?: ReactNode;
  buttonVariant?:
    | "solid"
    | "bordered"
    | "light"
    | "flat"
    | "faded"
    | "shadow"
    | "ghost";
  content?: () => ReactNode;
}

const CustomPoporver = ({
  showArrow = true,
  color = "default",
  placements = "bottom",
  buttonColor = "primary",
  buttonVariant = "light",
  icon = <IoMdHelpCircle size={22} />,
  content = () => (
    <>
      <div className="text-small font-bold">Default Content</div>
      <div className="text-tiny">This is the default popover content</div>
    </>
  ),
}: PopoverProps) => {
  return (
    <Popover
      placement={placements}
      color={color}
      showArrow={showArrow}
      radius="sm"
      classNames={{
        base: " rounded-md border border-gray-200 bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700",
      }}
    >
      <PopoverTrigger>
        <CustomButton
          color={buttonColor}
          isIconOnly={true}
          startContent={icon}
          variant={buttonVariant}
        ></CustomButton>
      </PopoverTrigger>
      <PopoverContent>
        <div className="px-1 py-2"> {content()}</div>
      </PopoverContent>
    </Popover>
  );
};

export default CustomPoporver;
