import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface DynamicOptions {
  skip?: number;
  take?: number;
  orderBy?: Record<string, "asc" | "desc">;
  include?: Record<string, boolean>;
}

export async function dynamicGetMany<T>({
  model,
  tenantId,
  filters = {},
  options = {}
}: {
  model: any;
  tenantId: string;
  filters?: Record<string, any>;
  options?: DynamicOptions;
}): Promise<T[]> {
  if (!tenantId) throw new Error("Missing tenantId");

  return await model.findMany({
    where: {
      tenantId,
      ...filters
    },
    skip: options.skip || 0,
    take: options.take || 50,
    orderBy: options.orderBy || { id: "desc" },
    include: options.include || undefined
  });
}

export async function dynamicGetById<T>({
  model,
  tenantId,
  id,
  include = {}
}: {
  model: any;
  tenantId: string;
  id: number;
  include?: Record<string, boolean>;
}): Promise<T | null> {
  if (!tenantId) throw new Error("Missing tenantId");

  return await model.findFirst({
    where: { id, tenantId },
    include
  });
}

export async function dynamicCreate<T>({
  model,
  tenantId,
  data
}: {
  model: any;
  tenantId: string;
  data: Record<string, any>;
}): Promise<T> {
  if (!tenantId) throw new Error("Missing tenantId");

  return await model.create({
    data: {
      tenantId,
      ...data
    }
  });
}

export async function dynamicUpdate<T>({
  model,
  tenantId,
  id,
  data
}: {
  model: any;
  tenantId: string;
  id: number;
  data: Record<string, any>;
}): Promise<T> {
  if (!tenantId) throw new Error("Missing tenantId");

  return await model.updateMany({
    where: { id, tenantId },
    data
  });
}

export async function dynamicDelete<T>({
  model,
  tenantId,
  id
}: {
  model: any;
  tenantId: string;
  id: number;
}): Promise<T> {
  if (!tenantId) throw new Error("Missing tenantId");

  return await model.deleteMany({
    where: { id, tenantId }
  });
}
