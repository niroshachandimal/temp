import { AiOutlineSlack } from "react-icons/ai";
import { BsFillPeopleFill } from "react-icons/bs";
import { RiDashboardHorizontalFill } from "react-icons/ri";
import ROLE from "./Role";

const _nav = [
  {
    name: "Dashboard",
    to: "/dashboard",
    icon: <RiDashboardHorizontalFill size={19} />,
    allowedRoles: [ROLE.PROVIDER],
  },
  {
    name: "Service",
    to: "/service/all-service",
    icon: <AiOutlineSlack size={19} />,
    allowedRoles: [ROLE.PROVIDER],
  },
  {
    name: "Staff",
    to: "/staff/all-staff",
    icon: <BsFillPeopleFill size={18} />,
    allowedRoles: [ROLE.PROVIDER],
  },
  {
    name: "Chat",
    to: "/chat",
    icon: <BsFillPeopleFill size={18} />,
    // allowedRoles: [ROLE.PROVIDER],
  },
];

export default _nav;
