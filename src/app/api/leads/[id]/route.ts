import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const VALID_STATUSES = ["new", "contacted", "converted", "lost"];

// PUT: Update lead status (new → contacted → converted / lost)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: "وضعیت الزامی است" },
        { status: 400 }
      );
    }

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: `وضعیت نامعتبر. وضعیت‌های مجاز: ${VALID_STATUSES.join(", ")}` },
        { status: 400 }
      );
    }

    const existing = await db.lead.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json(
        { error: "سرنخ یافت نشد" },
        { status: 404 }
      );
    }

    const updated = await db.lead.update({
      where: { id },
      data: { status },
      include: {
        conversation: {
          select: {
            id: true,
            visitorId: true,
            visitorName: true,
            visitorPhone: true,
            status: true,
            createdAt: true,
          },
        },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update lead error:", error);
    return NextResponse.json(
      { error: "خطا در بروزرسانی سرنخ" },
      { status: 500 }
    );
  }
}
