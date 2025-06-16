import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";

const menuItems = [
  {
    title: "SURVEILLANCE",
    items: [
      { icon: "/home.png", label: "Dashboard", href: "/dashboard", visible: ["admin", "security", "teacher"] },
      { icon: "/camera.png", label: "Live Feeds", href: "/feeds/live", visible: ["admin", "security"] },
      { icon: "/alert.png", label: "Video Alerts", href: "/list/alerts", visible: ["admin", "teacher", "security"] },
      { icon: "/object-detect.png", label: "Object Detections", href: "/list/objects", visible: ["admin", "security"] },
      { icon: "/human-action.png", label: "Behavior Alerts", href: "/list/actions", visible: ["admin", "teacher", "security"] },
      { icon: "/gate.png", label: "Gate Access Logs", href: "/list/access-logs", visible: ["admin", "security"] },
      { icon: "/truancy.png", label: "Truancy Reports", href: "/list/truancy", visible: ["admin", "teacher"] },
    ],
  },
  {
    title: "MANAGEMENT",
    items: [
      { icon: "/teacher.png", label: "Teachers", href: "/list/teachers", visible: ["admin"] },
      { icon: "/student.png", label: "Students", href: "/list/students", visible: ["admin", "teacher"] },
      { icon: "/parent.png", label: "Parents", href: "/list/parents", visible: ["admin"] },
      { icon: "/staff.png", label: "Security Staff", href: "/list/security", visible: ["admin"] },
      { icon: "/staff.png", label: "Users Management", href: "/list/users", visible: ["admin"] },
    ],
  },
  {
    title: "OTHER",
    items: [
      { icon: "/message.png", label: "Messages", href: "/list/messages", visible: ["admin", "teacher", "security"] },
      { icon: "/announcement.png", label: "Announcements", href: "/list/announcements", visible: ["admin", "teacher", "student"] },
      { icon: "/profile.png", label: "Profile", href: "/profile", visible: ["admin", "teacher", "student", "security"] },
      { icon: "/setting.png", label: "Settings", href: "/settings", visible: ["admin"] },
      { icon: "/logout.png", label: "Logout", href: "/logout", visible: ["admin", "teacher", "student", "security"] },
    ],
  },
];

const Menu = async () => {
  const user = await currentUser();
  const role = user?.publicMetadata.role as string;

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
                  className="flex items-center justify-center lg:justify-start gap-4 text-black py-2 px-2 rounded-lg hover:bg-red-100 hover:text-red-700 transition-all"
                >
                  <Image src={item.icon} alt={item.label} width={20} height={20} />
                  <span className="hidden lg:block">{item.label}</span>
                </Link>
              );
            }
          })}
        </div>
      ))}
    </div>
  );
};

export default Menu;
