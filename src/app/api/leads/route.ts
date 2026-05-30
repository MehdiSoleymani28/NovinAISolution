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

// POST: Create a lead from chat widget or contact form
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, conversationId, note, message, company } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: "نام و شماره تلفن الزامی است" },
        { status: 400 }
      );
    }

    let convId = conversationId;

    // If no conversationId (e.g. from contact form), create a new conversation
    if (!convId) {
      const conversation = await db.conversation.create({
        data: {
          visitorName: name,
          visitorPhone: phone,
          status: "active",
        },
      });
      convId = conversation.id;

      // If there's a message (from contact form), add it as a conversation message
      if (message) {
        await db.message.create({
          data: {
            conversationId: convId,
            role: "user",
            content: message,
          },
        });
      }
    } else {
      // Check if conversation exists (for chat widget leads)
      const conversation = await db.conversation.findUnique({
        where: { id: convId },
      });

      if (!conversation) {
        return NextResponse.json(
          { error: "گفتگو یافت نشد" },
          { status: 404 }
        );
      }

      // Check if lead already exists for this conversation
      const existingLead = await db.lead.findUnique({
        where: { conversationId: convId },
      });

      if (existingLead) {
        return NextResponse.json(
          { error: "برای این گفتگو قبلاً سرنخ ثبت شده است" },
          { status: 400 }
        );
      }

      // Update conversation visitor info
      await db.conversation.update({
        where: { id: convId },
        data: {
          visitorName: name,
          visitorPhone: phone,
        },
      });
    }

    // Build the note field with company and message info
    const noteParts: string[] = [];
    if (company) noteParts.push(`شرکت: ${company}`);
    if (note) noteParts.push(note);
    if (message && !note) noteParts.push(message);

    // Create lead
    const lead = await db.lead.create({
      data: {
        name,
        phone,
        email: email || null,
        note: noteParts.length > 0 ? noteParts.join(" | ") : null,
        conversationId: convId,
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

    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    console.error("Create lead error:", error);
    return NextResponse.json(
      { error: "خطا در ایجاد سرنخ" },
      { status: 500 }
    );
  }
}
