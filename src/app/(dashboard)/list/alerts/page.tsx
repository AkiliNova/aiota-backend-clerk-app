import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { SurveillanceEvent, Camera } from "@prisma/client";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";

type SurveillanceEventList = SurveillanceEvent & {
  camera: {
    name: string;
    location: string;
  };
    flagged: {
        id: string;
        flaggedby: {
        id: string;
        // If using Clerk, get Clerk ID or name if available
        } | null;
    }[];
  reportedBy?: null;
};

const SurveillanceEventsPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { userId, sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const currentUserId = userId;

  const columns = [
    { header: "Event Type", accessor: "eventType" },
    { header: "Camera", accessor: "camera" },
    { header: "Location", accessor: "location", className: "hidden md:table-cell" },
    { header: "Timestamp", accessor: "timestamp", className: "hidden md:table-cell" },
    ...(role === "admin" || role === "security"
      ? [{ header: "Actions", accessor: "action" }]
      : []),
  ];

  const renderRow = (item: SurveillanceEventList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="p-4">{item.eventType}</td>
      <td>{item.camera.name}</td>
      <td className="hidden md:table-cell">{item.camera.location}</td>
      <td className="hidden md:table-cell">
        {new Intl.DateTimeFormat("en-US", {
          dateStyle: "short",
          timeStyle: "short",
        }).format(new Date(item.timestamp))}
      </td>
      <td>
        <div className="flex items-center gap-2">
          {(role === "admin" || role === "security") && (
            <>
              <FormContainer table="event" type="update" data={item} />
              <FormContainer table="event" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  const query: any = {
    camera: {},
  };

  for (const [key, value] of Object.entries(queryParams)) {
    if (!value) continue;
    switch (key) {
      case "cameraId":
        query.cameraId = value;
        break;
      case "eventType":
        query.eventType = { contains: value };
        break;
      case "location":
        query.camera.location = { contains: value };
        break;
      case "search":
        query.eventType = { contains: value };
        break;
    }
  }

  if (role === "security") {
    query.reportedById = currentUserId!;
  }

 const [data, count] = await prisma.$transaction([
  prisma.surveillanceEvent.findMany({
    where: query,
    include: {
      camera: {
        select: {
          id: true,
          ipAddress: true,
          zone: {
            select: {
              name: true,
              location: true,
            },
          },
        },
      },
    },
    orderBy: { timestamp: "desc" },
    take: ITEM_PER_PAGE,
    skip: ITEM_PER_PAGE * (p - 1),
  }),
  prisma.surveillanceEvent.count({ where: query }),
]);

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Surveillance Events</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {(role === "admin" || role === "security") && (
              <FormContainer table="event" type="create" />
            )}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default SurveillanceEventsPage;
