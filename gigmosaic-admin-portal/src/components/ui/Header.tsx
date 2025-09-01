import Breadcrumb from "./Breadcrumb";
import Notification from "./Notification";
import ProfileDropdown from "./ProfileDropdown";
import { TbWorld } from "react-icons/tb";

const Header = () => {
  return (
    <>
      <header className="fixed top-0 right-0 w-full bg-[#ffffff] shadow  px-4 z-30">
        <div className="header-content flex items-center flex-row my-3">
          <div className="hidden md:block md:ml-[250px]">
            <Breadcrumb />
          </div>
          <div className="flex ml-auto mr-3 justify-center items-center">
            <div className="flex flex-initial  justify-center items-center mr-8 cursor-pointer">
              <TbWorld size={25} className="text-gray-500 hover:text-black" />
              <p className="hover:underline hover:text-primary-700 ml-1 cursor-pointe text-sm">
                Visit site
              </p>
            </div>
            <Notification />
            <ProfileDropdown />
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
