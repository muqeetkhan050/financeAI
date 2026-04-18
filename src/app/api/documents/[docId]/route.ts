import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/auth";
import { queryOne, execute } from "@/auth/db";


export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ docId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { docId } = await params;

  const doc = await queryOne<{
    id: string;
    file_name: string;
    created_at: Date;
    insights: object | null;
  }>(
    `SELECT id, file_name, created_at, insights
     FROM documents
     WHERE id = $1 AND user_id = $2`,
    [docId, session.user.id]
  );

  if (!doc) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(doc);
}


export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ docId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { docId } = await params;

  const count = await execute(
    "DELETE FROM documents WHERE id = $1 AND user_id = $2",
    [docId, session.user.id]
  );

  if (count === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ deleted: true });
}