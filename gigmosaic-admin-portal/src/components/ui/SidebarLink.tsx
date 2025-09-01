import { JSX } from "react";
import { NavLink } from "react-router-dom";

interface SidebarLinkProps {
  items: {
    to: string;
    name: string;
    icon?: JSX.Element;
    allowedRoles?: string[];
  }[];
  userRole: string;
}

const SidebarLink = ({ items, userRole }: SidebarLinkProps) => {
  return (
    <ul>
      {items &&
        items.map((item, index) => {
          if (item.allowedRoles && !item.allowedRoles.includes(userRole)) {
            return null;
          }

          return (
            <li key={index} className="my-px">
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex flex-row items-center h-10 px-3 rounded-lg my-1 ${
                    isActive
                      ? "text-primary text-sm  bg-primary bg-opacity-20"
                      : "text-white text-sm hover:bg-gray-500 hover:bg-opacity-10"
                  }`
                }
              >
                {item.icon && <span>{item.icon}</span>}
                <span className="ml-3">{item.name}</span>
              </NavLink>
            </li>
          );
        })}
    </ul>
  );
};

export default SidebarLink;
