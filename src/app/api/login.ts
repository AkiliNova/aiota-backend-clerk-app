// pages/api/login.ts
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { email, password } = req.body;

  try {
    // STEP 1: Create a sign-in attempt
    const signInRes = await fetch("https://api.clerk.com/v1/sign_ins", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.CLERK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ identifier: email }),
    });

    const signIn = await signInRes.json();

    if (!signIn?.id) {
      return res.status(400).json({ error: "Invalid identifier" });
    }

    // STEP 2: Attempt sign-in with password
    const attemptRes = await fetch(`https://api.clerk.com/v1/sign_ins/${signIn.id}/attempt`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.CLERK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });

    const attempt = await attemptRes.json();

    if (!attempt?.status || attempt.status !== "complete") {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // STEP 3: Return session token to mobile client
    return res.status(200).json({
      session_token: attempt.session.session_token, // <- this is your Bearer token
      user_id: attempt.session.user_id,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal error" });
  }
}
