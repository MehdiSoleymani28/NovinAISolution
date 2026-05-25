import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET: List all leads with conversation info, filter by status
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const where: Record<string, unknown> = {};
    if (status) {
      where.status = status;
    }

    const leads = await db.lead.findMany({
      where,
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
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(leads);
  } catch (error) {
    console.error("Get leads error:", error);
    return NextResponse.json(
      { error: "خطا در دریافت سرنخ‌ها" },
      { status: 500 }
    );
  }
}

// POST: Create a lead from chat widget
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, conversationId, note } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: "نام و شماره تلفن الزامی است" },
        { status: 400 }
      );
    }

    if (!conversationId) {
      return NextResponse.json(
        { error: "شناسه گفتگو الزامی است" },
        { status: 400 }
      );
    }

    // Check if conversation exists
    const conversation = await db.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "گفتگو یافت نشد" },
        { status: 404 }
      );
    }

    // Check if lead already exists for this conversation
    const existingLead = await db.lead.findUnique({
      where: { conversationId },
    });

    if (existingLead) {
      return NextResponse.json(
        { error: "برای این گفتگو قبلاً سرنخ ثبت شده است" },
        { status: 400 }
      );
    }

    // Create lead
    const lead = await db.lead.create({
      data: {
        name,
        phone,
        email: email || null,
        note: note || null,
        conversationId,
        status: "new",
      },
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

    // Update conversation visitor info
    await db.conversation.update({
      where: { id: conversationId },
      data: {
        visitorName: name,
        visitorPhone: phone,
      },
    });

    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    console.error("Create lead error:", error);
    return NextResponse.json(
      { error: "خطا در ایجاد سرنخ" },
      { status: 500 }
    );
  }
}
