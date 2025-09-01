import { RiDeleteBin6Line } from "react-icons/ri";
import CustomButton from "./CustomButton";
import { FaRegEdit } from "react-icons/fa";

const ActionButton = ({
  id,
  onEdit,
}: {
  id: string;
  onEdit: (id: string) => void;
}) => {
  return (
    <div className="grid grid-cols-2 -mr-3">
      <CustomButton
        isIconOnly
        className="bg-transparent"
        endContent={<FaRegEdit size={18} className="hover:text-blue-500" />}
        onPress={() => onEdit(id)}
      />
      <CustomButton
        isIconOnly
        className="bg-transparent"
        endContent={
          <RiDeleteBin6Line
            size={18}
            className="text-red-400 hover:text-red-700"
          />
        }
      />
    </div>
  );
};

export default ActionButton;
