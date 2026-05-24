import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.tag.delete({ where: { id } });
    return NextResponse.json({ message: "برچسب حذف شد" });
  } catch (error) {
    console.error("Delete tag error:", error);
    return NextResponse.json(
      { error: "خطا در حذف برچسب" },
      { status: 500 }
    );
  }
}
