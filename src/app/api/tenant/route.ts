// File: src/app/api/tenant/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { createAdminUser } from '@/lib/user';

const prisma = new PrismaClient();
export async function GET() {
  try {
    const tenants = await prisma.tenant.findMany({
      include: {
        users: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const transformed = tenants.map((t) => ({
      id: t.id,
      name: t.name,
      code: t.code,
      email: t.email,
      contact: t.contact,
      address: t.address,
      status: t.status || 'pending',
      subscription: t.subscription || 'basic',
      usersCount: t.users.length,
      createdAt: t.createdAt.toISOString(),
    }));

    return NextResponse.json(transformed);
  } catch (error) {
    console.error("GET /api/tenants error:", error);
    return NextResponse.json({ error: 'Failed to fetch tenants' }, { status: 500 });
  }
}
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      name, code, email, contact, address,
      description, subscription, status, domain,
      adminFirstName, adminLastName, adminEmail, adminPassword,
    } = body;

    const existing = await prisma.tenant.findFirst({
      where: { OR: [{ code }, { email }] },
    });

    if (existing) {
      return NextResponse.json({ message: 'Merchant with that code or email already exists' }, { status: 400 });
    }

    const tenant = await prisma.tenant.create({
      data: {
        name, code, email, contact, address,
        description, subscription, status, domain,
      },
    });

    const fullName = `${adminFirstName} ${adminLastName}`;
    const generatedUsername = `${adminFirstName}.${adminLastName}`.toLowerCase().replace(/\s+/g, '');

try {
      await createAdminUser({
        email: adminEmail,
        password: adminPassword,
        firstName: adminFirstName,
        lastName: adminLastName,
        tenantId: tenant.id,
        role: 'USER',
      });
    } catch (userError) {
      console.error('Admin creation failed:', userError);
      return NextResponse.json({ message: 'Tenant created but admin creation failed', error: userError instanceof Error ? userError.message : userError }, { status: 500 });
    }
    return NextResponse.json({ message: 'Tenant and admin created', tenant }, { status: 201 });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
