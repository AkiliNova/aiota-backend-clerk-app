import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { User } from "@prisma/client";
import { createClerkClient } from "@clerk/backend";

const prisma = new PrismaClient();

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { identifier, password } = body;

    if (!identifier || !password) {
      return NextResponse.json({ error: "Missing identifier or password" }, { status: 400 });
    }

    // STEP 1: Lookup user in your local DB
    const dbUser = await prisma.user.findUnique({
      where: { email: identifier },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // STEP 2: Verify password
    if (!dbUser.password) {
      return NextResponse.json({ error: "Invalid credentials null passord" }, { status: 401 });
    }
   
   const isPasswordValid = await bcrypt.compare(password, dbUser.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid credentials password is wrong" }, { status: 401 });
    }

    // STEP 3: Create Clerk Sign-in Token
    if (!dbUser.clerkUserId) {
      return NextResponse.json({ error: "User does not have a Clerk user ID" }, { status: 500 });
    }
    const tokenRes = await clerkClient.signInTokens.createSignInToken({
      userId: dbUser.clerkUserId,
      expiresInSeconds: 60 * 60, // 1 hour
    });

    return NextResponse.json({
      token: tokenRes.token,
      userId: dbUser.clerkUserId,
    });
  } catch (err: any) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
