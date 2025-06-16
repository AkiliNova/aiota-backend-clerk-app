import prisma from "@/lib/prisma";
import Image from "next/image";

const UserCard = async ({
  type,
}: {
  type: "admin" | "teacher" | "student" | "parent" | "security";
}) => {
  const modelMap: Record<typeof type, any> = {
    admin: prisma.user,
    teacher: prisma.teacher,
    student: prisma.student,
    parent: prisma.parent,
    security: prisma.security,
  };

  const data = await modelMap[type].count();

 return (
  <div className="rounded-2xl odd:bg-black even:bg-red-600 text-white p-4 flex-1 min-w-[130px] shadow-md">
    <div className="flex justify-between items-center">
      <span className="text-[10px] bg-white px-2 py-1 rounded-full text-red-600 font-semibold">
        {new Date().toLocaleString()}
      </span>
      <Image src="/more.png" alt="" width={20} height={20} />
    </div>
    <h1 className="text-2xl font-semibold my-4">{data}</h1>
    <h2 className="capitalize text-sm font-medium text-white/80">{type}s</h2>
  </div>
);

}

export default UserCard;
