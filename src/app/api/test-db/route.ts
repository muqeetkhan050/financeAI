import { NextResponse } from "next/server";
import { query } from "@/auth/db";

export async function GET() {
  try {
    const result = await query<{ now: Date }>("SELECT NOW() as now");
    return NextResponse.json({
      connected: true,
      time: result[0].now,
      message: "Database connected successfully!",
    });
  } catch (error) {
    return NextResponse.json(
      {
        connected: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}