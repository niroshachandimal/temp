import { JSX, useState } from "react";
import { NavLink } from "react-router-dom";

interface SidebarItem {
  path?: string;
  name: string;
  icon?: JSX.Element;
  allowedRoles?: string[];
  children?: SidebarItem[];
}

interface SidebarLinkProps {
  items: SidebarItem[];
  userRole: string;
  isProviderPending?: boolean;
}

const SidebarLink = ({
  items,
  userRole,
  isProviderPending,
}: SidebarLinkProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleDropdown = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <ul className="space-y-1">
      {items.map((item, index) => {
        const hasAccess =
          !item.allowedRoles ||
          item.allowedRoles.includes(userRole) ||
          (userRole === "customer" && isProviderPending);

        console.log("hasAccess: ", hasAccess);

        if (!hasAccess) return null;

        const hasChildren = item.children && item.children.length > 0;
        console.log("hasChildren: ", hasChildren);

        return (
          <li key={index}>
            {hasChildren ? (
              <>
                <button
                  onClick={() => toggleDropdown(index)}
                  className="flex w-full items-center justify-between px-4 py-2 text-white hover:bg-gray-700 focus:outline-none"
                >
                  <span className="flex items-center gap-2">
                    {item.icon}
                    {item.name}
                  </span>
                  <span>{openIndex === index ? "▲" : "▼"}</span>
                </button>

                {openIndex === index && (
                  <ul className="ml-6 mt-1 space-y-1">
                    {item.children!.map((child, cIdx) => {
                      const childAccess =
                        !child.allowedRoles ||
                        child.allowedRoles.includes(userRole) ||
                        (userRole === "customer" && isProviderPending);

                      if (!childAccess) return null;

                      return (
                        <li key={cIdx}>
                          <NavLink
                            to={child.path!}
                            className={({ isActive }) =>
                              `block px-4 py-2 rounded text-sm ${
                                isActive
                                  ? "bg-primary text-white"
                                  : "text-white hover:bg-gray-600"
                              }`
                            }
                          >
                            <span className="flex items-center gap-2">
                              {child.icon}
                              {child.name}
                            </span>
                          </NavLink>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </>
            ) : (
              <NavLink
                to={item.path!}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-white hover:bg-gray-700"
                  }`
                }
              >
                {item.icon}
                {item.name}
              </NavLink>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default SidebarLink;
