import Logo from "../assets/Logo.png";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  FaBookmark,
  FaBookOpen,
  FaCalendarAlt,
  FaLayerGroup,
  FaUsers,
  FaUsersCog,
} from "react-icons/fa";
import ROLE from "../Role";
import { IoIosArrowDown, IoIosArrowUp, IoMdChatbubbles } from "react-icons/io";
import { Card, Divider } from "@heroui/react";

import {
  MdAccountCircle,
  MdDiscount,
  MdEditSquare,
  MdManageAccounts,
  MdSecurity,
  MdSpaceDashboard,
} from "react-icons/md";
import { version } from "../../package.json";
import { IoBagHandle, IoWalletSharp } from "react-icons/io5";

const Sidebar = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleDropdown = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  // console.log("fefeuhfueh: ", userRole);
  const navigation = [
    {
      path: "/dashboard",
      name: "Dashboard",
      icon: <MdSpaceDashboard size={17} />,
      allowedRoles: [ROLE.PROVIDER],
    },
    // SERVICE
    {
      name: "Services",
      icon: <IoBagHandle size={17} />,
      allowedRoles: [ROLE.PROVIDER],
      children: [
        {
          path: "/service/all-service",
          name: "All Services",
          allowedRoles: [ROLE.PROVIDER],
          icon: <FaLayerGroup />,
        },
        {
          path: "/service/add-service",
          name: "Add Service",
          allowedRoles: [ROLE.PROVIDER],
          icon: <MdEditSquare size={17} />,
        },
      ],
    },
    // BOOKING
    {
      // path: "/booking",
      name: "Booking",
      icon: <FaBookmark size={15} />,
      allowedRoles: [ROLE.PROVIDER],
      children: [
        {
          path: "booking/all",
          name: "All Bookings",
          allowedRoles: [ROLE.PROVIDER],
          icon: <FaBookOpen />,
        },
        {
          path: "booking/add",
          name: "Add Booking",
          allowedRoles: [ROLE.PROVIDER],
          icon: <MdEditSquare size={17} />,
        },
        {
          path: "booking/calendar",
          name: "Booking Calendar",
          allowedRoles: [ROLE.PROVIDER],
          icon: <FaCalendarAlt />,
        },
      ],
    },

    {
      path: "/discount/all",
      name: "Discount",
      icon: <MdDiscount size={17} />,
      allowedRoles: [ROLE.PROVIDER],
    },

    // {
    //   name: "Discount",
    //   icon: <MdDiscount size={17} />,
    //   allowedRoles: [ROLE.PROVIDER],
    //   children: [
    //     {
    //       path: "/discount/all",
    //       name: "All Discount",
    //       allowedRoles: [ROLE.PROVIDER],
    //       icon: <FaLayerGroup />,
    //     },
    //   ],
    // },

    // STAFF
    {
      name: "Staffs",
      icon: <FaUsers size={17} />,
      allowedRoles: [ROLE.PROVIDER],
      children: [
        {
          path: "staff/all",
          name: "All Staffs",
          allowedRoles: [ROLE.PROVIDER],
          icon: <FaLayerGroup />,
        },
        {
          path: "staff/leave",
          name: "Staff Leave",
          allowedRoles: [ROLE.PROVIDER],
          icon: <FaCalendarAlt />,
        },
      ],
    },

    // ACCOUNT
    {
      name: "Account",
      icon: <MdManageAccounts size={20} />,
      allowedRoles: [ROLE.PROVIDER],
      children: [
        {
          path: "account/profile/profile-setting",
          name: "Profile Settings",
          allowedRoles: [ROLE.PROVIDER],
          icon: <MdAccountCircle size={18} />,
        },
        {
          path: "account/profile/security",
          name: "Security",
          allowedRoles: [ROLE.PROVIDER],
          icon: <MdSecurity size={18} />,
        },
        {
          path: "account/profile/plan",
          name: "Plan & Billing",
          allowedRoles: [ROLE.PROVIDER],
          icon: <IoWalletSharp size={18} />,
        },
      ],
    },
    // CHAT
    {
      path: "/chat",
      name: "Chat",
      icon: <IoMdChatbubbles size={17} />,
      allowedRoles: [ROLE.PROVIDER],
    },
    {
      path: "/membership",
      name: "Membership",
      icon: <FaUsersCog size={17} />,
      allowedRoles: [ROLE.PROVIDER],
    },
  ];

  return (
    <Card
      radius="none"
      className="fixed h-full w-64 z-50  md:shadow transform -translate-x-full md:translate-x-0 transition-transform duration-150 ease-in flex flex-col "
      classNames={{
        base: "bg-[#11151a]  dark:bg-[#11151a] ",
      }}
    >
      <div className="sidebar-header flex items-center justify-center py-4">
        <Link to={"/dashboard"}>
          <img src={Logo} alt="Logo" />
        </Link>
      </div>
      {/* <Divider className="my-2 bg-white bg-opacity-100" /> */}
      <ul className="px-2 mt-2">
        {navigation.map((item, index) => {
          const hasAccess =
            !item.allowedRoles || item.allowedRoles.includes(ROLE.PROVIDER);

          if (!hasAccess) return null;

          if (item.children && item.children.length > 0) {
            return (
              <li key={index}>
                <button
                  onClick={() => toggleDropdown(index)}
                  className="flex items-center text-body1 w-full text-left text-white p-[10px] rounded-md my-1 hover:hover:bg-gray-600"
                >
                  {item.icon && <span className="mr-2">{item.icon}</span>}
                  <span>{item.name}</span>
                  <span className="ml-auto">
                    {openIndex === index ? (
                      <IoIosArrowUp />
                    ) : (
                      <IoIosArrowDown />
                    )}
                  </span>
                </button>
                {openIndex !== index && (
                  <Divider className="my-1 bg-white bg-opacity-20" />
                )}

                {openIndex === index && (
                  <>
                    <ul className="ml-3 px-[10px] pt-[5px] mb-5 rounded-md transition-all duration-300 ease-in-out">
                      {item.children.map((child, childIndex) => {
                        const childAccess =
                          !child.allowedRoles ||
                          child.allowedRoles.includes(ROLE.PROVIDER);

                        if (!childAccess) return null;

                        return (
                          <li key={childIndex}>
                            <NavLink
                              to={child.path}
                              className={({ isActive }) =>
                                `flex items-center text-body1 w-full p-[8px] rounded-md mb-2 ${
                                  isActive
                                    ? "bg-primary bg-opacity-40 text-white"
                                    : "text-white hover:bg-gray-600"
                                }`
                              }
                            >
                              {child.icon && (
                                <span className="mr-3">{child.icon}</span>
                              )}
                              <span>{child.name}</span>
                            </NavLink>
                          </li>
                        );
                      })}
                    </ul>
                    <Divider className="my-1  bg-white bg-opacity-20" />
                  </>
                )}
              </li>
            );
          }

          return (
            <li key={index}>
              <NavLink
                to={item.path || ""}
                className={({ isActive }) =>
                  `flex items-center text-body1 w-full px-[10px] py-[10px]  rounded-md ${
                    isActive
                      ? "bg-primary bg-opacity-40 text-white"
                      : "text-white hover:bg-gray-600"
                  }`
                }
              >
                {item.icon && <span className="mr-2">{item.icon}</span>}
                <span>{item.name}</span>
              </NavLink>

              <Divider className="my-1  bg-white bg-opacity-20" />
            </li>
          );
        })}
      </ul>

      <div className="absolute inset-x-0 bottom-0 text-gray-400 p-4 text-xs flex justify-between">
        <div>
          Copyright &copy; 2025{" "}
          <a href="#" className="underline">
            Gigmosaic
          </a>
        </div>
        <p className="text-gray-400 text-xs">v {version}</p>
      </div>
    </Card>
  );
};

export default Sidebar;
