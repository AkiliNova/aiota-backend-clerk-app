// lib/createAdminUser.ts
import { PrismaClient, UserRole } from '@prisma/client';
import { createClerkClient } from '@clerk/backend';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY!,
});

interface AdminUserParams {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  tenantId: string;
  role?: UserRole;
}

export async function createAdminUser({
  email,
  password,
  firstName,
  lastName,
  tenantId,
  role = UserRole.USER,
}: AdminUserParams) {
  const username = email.split('@')[0];

  const clerkUser = await clerkClient.users.createUser({
    emailAddress: [email],
    password,
    firstName,
    lastName,
    username,
    publicMetadata: {
      role: role.toLowerCase(),
      tenantId,
    },
  });

  const localUser = await prisma.user.create({
    data: {
      clerkUserId: clerkUser.id,
      email,
      name: `${firstName} ${lastName}`,
      password: bcrypt.hashSync(password, 10),
      role,
      tenantId,
    },
  });

  return { clerkUser, localUser };
}
    