import prisma from "@/lib/prisma";
import Image from "next/image";

const UserCard = async ({
  type,
}: {
  type: "users" | "tenants" | "cameras" | "zones" | "security";
}) => {
  const modelMap: Record<
    "users" | "tenants" | "cameras" | "zones" | "security",
    any
  > = {
    users: prisma.user,
    tenants: prisma.tenant,
    cameras: prisma.camera,
    zones: prisma.zone,
    security: prisma.security,
  };

  const model = modelMap[type];

if (!model) {
  console.error(`Invalid model for type: ${type}`);
  return null;
}

const data = await model.count();


  return (
    <div className="rounded-2xl odd:bg-black even:bg-red-600 text-white p-4 flex-1 min-w-[130px] shadow-md">
      <div className="flex justify-between items-center">
        <span className="text-[10px] bg-white px-2 py-1 rounded-full text-red-600 font-semibold">
          {new Date().toLocaleString()}
        </span>
        <Image src="/more.png" alt="" width={20} height={20} />
      </div>
      <h1 className="text-2xl font-semibold my-4">{data}</h1>
      <h2 className="capitalize text-sm font-medium text-white/80">
        {type}s
      </h2>
    </div>
  );
};

export default UserCard;
