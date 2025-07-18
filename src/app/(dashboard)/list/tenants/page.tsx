import prisma from "@/lib/prisma";
import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import React from "react";
import { redirect } from "next/navigation";
import TableSearch from "@/components/TableSearch";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { auth } from "@clerk/nextjs/server";

export default async function TenantListPage({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
  const { sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Code", accessor: "code" },
    { header: "Contact", accessor: "contact", className: "hidden md:table-cell" },
    { header: "Address", accessor: "address", className: "hidden lg:table-cell" },
    { header: "Email", accessor: "email", className: "hidden lg:table-cell" },
    ...(role === "admin" ? [{ header: "Actions", accessor: "action" }] : []),
  ];

  type Tenant = {
    id: string;
    name: string;
    code: string;
    contact?: string;
    address?: string;
    email?: string;
    // Add other fields if needed
  };

  const renderRow = (item: Tenant) => (
    <tr key={item.id} className="border-b even:bg-slate-50 hover:bg-gray-100">
      <td className="p-4">{item.name}</td>
      <td className="p-4">{item.code}</td>
      <td className="hidden md:table-cell p-4">{item.contact}</td>
      <td className="hidden lg:table-cell p-4">{item.address}</td>
      <td className="hidden lg:table-cell p-4">{item.email}</td>
      {role === "admin" && (
        <td className="p-4 flex gap-2">
          <FormContainer table="tenant" type="update" data={item} />
          <FormContainer table="tenant" type="delete" id={item.id} />
        </td>
      )}
    </tr>
  );

  const { page, ...qp } = searchParams;
  const p = page ? parseInt(page) : 1;

  const where: any = {};
  if (qp.search) {
    where.OR = [
      { name: { contains: qp.search, mode: "insensitive" } },
      { code: { contains: qp.search, mode: "insensitive" } },
    ];
  }

const [data, count] = await prisma.$transaction([
  prisma.tenant.findMany({
    where,
    take: ITEM_PER_PAGE,
    skip: ITEM_PER_PAGE * (p - 1),
    orderBy: { name: "asc" },
  }),
  prisma.tenant.count({ where }),
]);


  return (
    <div className="bg-white p-4 rounded-md m-4 flex-1">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">All Tenants</h1>
        <div className="flex items-center gap-4">
          <TableSearch />
          {role === "admin" && (
            <FormContainer table="tenant" type="create" />
          )}
        </div>
      </div>

      <Table columns={columns} renderRow={renderRow} data={data} />

      <Pagination page={p} count={count} />
    </div>
  );
}
