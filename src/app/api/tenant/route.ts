// app/api/tenant/route.ts
import prisma from "@/lib/prisma";

import {
  dynamicGetMany,
  dynamicGetById,
  dynamicCreate,
  dynamicUpdate,
  dynamicDelete,
} from "@/lib/dynamicCrud";

// List Tenants
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const take = 50;
  const skip = take * (page - 1);

  const filters: any = {};
  if (searchParams.get("search")) {
    filters.OR = [
      { name: { contains: searchParams.get("search"), mode: "insensitive" } },
      { code: { contains: searchParams.get("search"), mode: "insensitive" } },
    ];
  }

  const data = await dynamicGetMany({
    model: prisma.tenant,
    tenantId: "root", // Tenants do not belong to another tenant
    filters,
    options: { skip, take },
  });

  return Response.json(data);
}

// Create Tenant
export async function POST(req: Request) {
  const body = await req.json();

  const data = await dynamicCreate({
    model: prisma.tenant,
    tenantId: "root", // Tenants do not belong to another tenant
    data: body,
  });

  return Response.json(data);
}

// Update Tenant
export async function PUT(req: Request) {
  const body = await req.json();

  const data = await dynamicUpdate({
    model: prisma.tenant,
    tenantId: "root",
    id: body.id,
    data: body,
  });

  return Response.json(data);
}

// Delete Tenant
export async function DELETE(req: Request) {
  const body = await req.json();

  const data = await dynamicDelete({
    model: prisma.tenant,
    tenantId: "root",
    id: body.id,
  });

  return Response.json(data);
}
