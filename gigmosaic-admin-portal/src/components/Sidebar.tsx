import SidebarLink from "./ui/SidebarLink";
import navigation from "../_nav";
import { Link } from "react-router-dom";

const userRole = "Admin";

const Sidebar = () => {
  return (
    <aside className="fixed h-full w-64 z-50 md:shadow transform -translate-x-full md:translate-x-0 transition-transform duration-150 ease-in bg-[#101828] ">
      <div className="sidebar-header flex items-center justify-center py-4">
        <Link to={"/dashboard"}>
          <img src="/src/assets/Logo.png" alt="Logo" />
        </Link>
      </div>
      <div className="sidebar-content px-4 py-2">
        <ul className="flex flex-col w-full">
          <SidebarLink items={navigation} userRole={userRole} />
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
