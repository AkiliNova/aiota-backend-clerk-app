// /app/api/admin/users/route.ts
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { createClerkClient } from "@clerk/backend";
// Update the import path below if your prisma client is located elsewhere, e.g. "../../../lib/db"
import { PrismaClient } from "@prisma/client"; // Adjust the import path as necessary
import { User } from "@prisma/client";
import { UserRole } from "@prisma/client"; // Adjust the import path as necessary
import { getAuth } from "@clerk/nextjs/server";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY!,
});

export async function GET() {
  try {
    // Step 1: Fetch from local DB
    const localUsers = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });

    // Step 2: For each user, fetch extra details from Clerk
    const enrichedUsers = await Promise.all(
      localUsers.map(async (user) => {
        try {
          if (!user.clerkUserId) {
            throw new Error("Missing clerkUserId");
          }
          const clerkUser = await clerkClient.users.getUser(user.clerkUserId);
          return {
            ...user,
            firstName: clerkUser.firstName,
            lastName: clerkUser.lastName,
            clerkEmail: clerkUser.emailAddresses[0]?.emailAddress,
            createdAtClerk: clerkUser.createdAt,
            lastSignInAt: clerkUser.lastSignInAt,
          };
        } catch (err) {
          // Fallback if Clerk user no longer exists or error happens
          return {
            ...user,
            error: "User not found in Clerk",
          };
        }
      })
    );

    return NextResponse.json(enrichedUsers);
  } catch (err) {
    console.error("GET /admin/users failed", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
export async function POST(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const currentUser = await clerkClient.users.getUser(userId);
  const role = currentUser?.publicMetadata?.role;
  const roleMap: Record<string, UserRole> = {
  admin: UserRole.ADMIN,
  teacher: UserRole.STAFF,
  security: UserRole.STAFF,
  student: UserRole.USER,
};



  if (role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
   const { email, firstName, lastName, role: newUserRole, password } = await req.json();
    const prismaRole = roleMap[newUserRole];
  // Optional: Basic validation
  if (!email || !firstName || !lastName || !newUserRole || !password) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Create user in Clerk
  const newUser = await clerkClient.users.createUser({
    emailAddress: [email],
    password,
    firstName,
    lastName,
    username: email.split('@')[0], // or generate a custom one
    publicMetadata: {
      role: newUserRole,
    },
  });

    // Persist to local DB
    await prisma.user.create({
      data: {
        clerkUserId: newUser.id,
        email,
        name: `${firstName} ${lastName}`,
        role: prismaRole as UserRole,
        password: bcrypt.hashSync(password, 10), // Store hashed password
      },
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
  console.error("User creation error:", err);

  if (err?.clerkError && Array.isArray(err.errors)) {
    const messages = err.errors.map((e: any) => e.longMessage || e.message);
    return NextResponse.json({ error: messages.join(" | ") }, { status: 400 });
  }

  return NextResponse.json(
    { error: err.message || "Something went wrong" },
    { status: 500 }
  );
}

}
