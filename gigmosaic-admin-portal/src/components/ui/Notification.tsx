import { MdLocalPostOffice } from "react-icons/md";

const Notification = () => {
  const count = 10;
  return (
    <>
      <div className="relative flex items-center justify-center mr-10 cursor-pointer">
        <MdLocalPostOffice
          size={25}
          className="text-gray-500 hover:text-gray-800"
        />

        {count > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
            {count}
          </span>
        )}
      </div>
    </>
  );
};

export default Notification;
