import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET: List conversations with last message, ordered by most recent
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    const where: Record<string, unknown> = {};
    if (status) {
      where.status = status;
    }

    const [conversations, total] = await Promise.all([
      db.conversation.findMany({
        where,
        include: {
          messages: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
          lead: true,
        },
        orderBy: { updatedAt: "desc" },
        skip: offset,
        take: limit,
      }),
      db.conversation.count({ where }),
    ]);

    const result = conversations.map((conv) => ({
      id: conv.id,
      visitorId: conv.visitorId,
      visitorName: conv.visitorName,
      visitorPhone: conv.visitorPhone,
      status: conv.status,
      lastMessage: conv.messages[0] || null,
      hasLead: !!conv.lead,
      createdAt: conv.createdAt,
      updatedAt: conv.updatedAt,
    }));

    return NextResponse.json({
      conversations: result,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Get conversations error:", error);
    return NextResponse.json(
      { error: "خطا در دریافت گفتگوها" },
      { status: 500 }
    );
  }
}
