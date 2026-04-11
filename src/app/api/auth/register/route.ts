

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { queryOne, execute } from "@/auth/db";

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json();

  if (!email || !password || password.length < 8) {
    return NextResponse.json(
      { error: "Email and password (8+ chars) required" },
      { status: 400 }
    );
  }

  // Check if email already exists
  const existing = await queryOne(
    "SELECT id FROM users WHERE email = $1",
    [email]
  );
  if (existing) {
    return NextResponse.json(
      { error: "Email already registered" },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await execute(
    "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3)",
    [name || null, email, passwordHash]
  );

  return NextResponse.json({ success: true });
}