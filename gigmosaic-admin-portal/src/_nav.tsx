import { RxDashboard } from "react-icons/rx";
import { LuList, LuListTree } from "react-icons/lu";
import { FaQuestionCircle } from "react-icons/fa";

const _nav = [
  {
    name: "Dashboard",
    to: "/dashboard",
    icon: <RxDashboard size={18} />,
    allowedRoles: ["Admin"],
  },
  {
    name: "All Categories",
    to: "/category/all",
    icon: <LuList size={18} />,
    allowedRoles: ["Admin"],
  },
  {
    name: "All Subcategories",
    to: "/subcategory/all",
    icon: <LuListTree size={18} />,
    allowedRoles: ["Admin"],
  },
  {
    name: "FAQ Manager",
    to: "/faq-manager",
    icon: <FaQuestionCircle size={18} />,
    allowedRoles: ["Admin"],
  },
];

export default _nav;