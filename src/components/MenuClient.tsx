'use client';

import Link from "next/link";
import { 
  MdDashboard, 
  MdOutlineSettings,
  MdLogout,
  MdMessage,
  MdAnnouncement,
  MdPerson
} from "react-icons/md";
import { 
  BsCameraVideoFill, 
  BsShieldCheck, 
  BsExclamationTriangleFill,
  BsCameraReelsFill,
  BsPersonBadge,
  BsGearFill,
  BsCashCoin
} from "react-icons/bs";
import { 
  RiParentFill, 
  RiUserSettingsFill,
  RiBuilding2Fill,
  RiTeamFill
} from "react-icons/ri";
import { FaUserGraduate, FaChalkboardTeacher } from "react-icons/fa";
import { IoMdAlert } from "react-icons/io";
import { TbDeviceCctv } from "react-icons/tb";
import { GiCctvCamera } from "react-icons/gi";

const menuItems = [
  {
    title: "SURVEILLANCE",
    items: [
      { 
        icon: <MdDashboard className="w-5 h-5" />, 
        label: "Dashboard", 
        href: "/dashboard", 
        visible: ["admin", "security", "teacher"] 
      },
      { 
        icon: <TbDeviceCctv className="w-5 h-5" />, 
        label: "Live Feeds", 
        href: "/feeds/live", 
        visible: ["admin", "security"] 
      },
      { 
        icon: <IoMdAlert className="w-5 h-5 text-red-600" />, 
        label: "Video Alerts", 
        href: "/list/alerts", 
        visible: ["admin", "teacher", "security"] 
      },
      { 
        icon: <BsExclamationTriangleFill className="w-5 h-5 text-yellow-500" />, 
        label: "Object Detections", 
        href: "/list/objects", 
        visible: ["admin", "security"] 
      },
      { 
        icon: <BsShieldCheck className="w-5 h-5 text-blue-500" />, 
        label: "Behavior Alerts", 
        href: "/list/actions", 
        visible: ["admin", "teacher", "security"] 
      },
      { 
        icon: <BsCameraReelsFill className="w-5 h-5 text-green-500" />, 
        label: "Gate Access Logs", 
        href: "/list/access-logs", 
        visible: ["admin", "security"] 
      },
      { 
        icon: <GiCctvCamera className="w-5 h-5 text-purple-500" />, 
        label: "Truancy Reports", 
        href: "/list/truancy", 
        visible: ["admin", "teacher"] 
      },
    ],
  },
  {
    title: "MANAGEMENT",
    items: [
      // { 
      //   icon: <FaChalkboardTeacher className="w-5 h-5 text-blue-600" />, 
      //   label: "Teachers", 
      //   href: "/list/teachers", 
      //   visible: ["admin"] 
      // },
      // { 
      //   icon: <FaUserGraduate className="w-5 h-5 text-green-600" />, 
      //   label: "Students", 
      //   href: "/list/students", 
      //   visible: ["admin", "teacher"] 
      // },
      // { 
      //   icon: <RiParentFill className="w-5 h-5 text-purple-600" />, 
      //   label: "Parents", 
      //   href: "/list/parents", 
      //   visible: ["admin"] 
      // },
      { 
        icon: <BsPersonBadge className="w-5 h-5 text-yellow-600" />, 
        label: "Security Staff", 
        href: "/list/security", 
        visible: ["admin"] 
      },
      { 
        icon: <RiUserSettingsFill className="w-5 h-5 text-indigo-600" />, 
        label: "Users Management", 
        href: "/list/users", 
        visible: ["admin"] 
      },
      { 
        icon: <RiBuilding2Fill className="w-5 h-5 text-red-600" />, 
        label: "Merchant Management", 
        href: "/list/tenants", 
        visible: ["admin"] 
      },
    ],
  },
  {
    title: "OTHER",
    items: [
      { 
        icon: <MdMessage className="w-5 h-5 text-blue-500" />, 
        label: "Messages", 
        href: "/list/messages", 
        visible: ["admin", "teacher", "security"] 
      },
      { 
        icon: <MdAnnouncement className="w-5 h-5 text-yellow-500" />, 
        label: "Announcements", 
        href: "/list/announcements", 
        visible: ["admin", "teacher", "student"] 
      },
      { 
        icon: <MdPerson className="w-5 h-5 text-gray-600" />, 
        label: "Profile", 
        href: "/profile", 
        visible: ["admin", "teacher", "student", "security"] 
      },
      { 
        icon: <BsGearFill className="w-5 h-5 text-gray-600" />, 
        label: "Settings", 
        href: "/settings", 
        visible: ["admin"] 
      },
      { 
        icon: <BsCashCoin className="w-5 h-5 text-green-600" />, 
        label: "Revenue", 
        href: "/list/clients-revenue", 
        visible: ["admin"] 
      },
      { 
        icon: <MdLogout className="w-5 h-5 text-red-600" />, 
        label: "Logout", 
        href: "/logout", 
        visible: ["admin", "teacher", "student", "security"] 
      },
    ],
  },
];

interface MenuClientProps {
  role?: string;
}

export const MenuClient = ({ role = 'user' }: MenuClientProps) => {
  return (
    <div className="mt-4 text-sm">
      {menuItems.map((section) => (
        <div className="flex flex-col gap-2" key={section.title}>
          <span className="hidden lg:block text-red-700 font-semibold uppercase tracking-widest text-xs my-4">
            {section.title}
          </span>

          {section.items.map((item) => {
            if (item.visible.includes(role)) {
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center justify-center lg:justify-start gap-4 text-black py-2 px-2 rounded-lg hover:bg-red-100 hover:text-red-700 transition-all group"
                >
                  <div className="group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <span className="hidden lg:block">{item.label}</span>
                </Link>
              );
            }
            return null;
          })}
        </div>
      ))}
    </div>
  );
}; 