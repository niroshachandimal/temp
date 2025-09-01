import ThemeSwitcher from "../ThemeSwitcher";
import Breadcrumb from "./Breadcrumb";
import LanguageSelect from "./LanguageSelect";
import ProfileDropdown from "./ProfileDropdown";
import { TbWorld } from "react-icons/tb";
import NotificationDrawer from "./NotificationDrawer";

const Header = () => {
  return (
    <>
      <header className="fixed top-0 right-0 w-full shadow-sm dark:bg-[#161a20] bg-[#ffffff]  px-4 z-30">
        <div className="header-content flex items-center flex-row my-3">
          <div className="hidden md:block md:ml-[250px]">
            <Breadcrumb />
          </div>
          <div className="flex ml-auto mr-3 justify-center items-center">
            <div className="flex flex-initial justify-center items-center mr-4">
              <ThemeSwitcher />
            </div>
            <a
              href="https://www.int.gigmosaic.ca/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="flex flex-initial  justify-center items-center mr-3 cursor-pointer">
                <TbWorld
                  size={25}
                  className="text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors duration-300"
                />
                <p className="hover:underline hover:text-primary-700 ml-1 cursor-pointe text-sm">
                  Visit site
                </p>
              </div>
            </a>

            <div className=" mr-3">
              <LanguageSelect />
            </div>
            {/* <div className=" mr-3"></div> */}
            {/* <Notification /> */}
            <NotificationDrawer />
            <ProfileDropdown />
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
