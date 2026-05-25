import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import ZAI from "z-ai-web-dev-sdk";

// Persian stop words to exclude from keyword search
const PERSIAN_STOP_WORDS = new Set([
  "و",
  "در",
  "به",
  "از",
  "که",
  "این",
  "آن",
  "است",
  "برای",
  "با",
  "هم",
  "می",
  "را",
  "نه",
  "یا",
  "هر",
  "چه",
  "چرا",
  "کی",
  "کجا",
  "چطور",
  "آیا",
  "بسیار",
  "خیلی",
  "همه",
  "خود",
  "شما",
  "ما",
  "من",
  "تو",
  "او",
  "انها",
  "آن‌ها",
  "ایشان",
  "همین",
  "بود",
  "شد",
  "است",
  "هست",
  "باشد",
  "نیست",
  "ندارد",
  "دارد",
  "می‌شود",
  "می‌تواند",
  "خواهد",
  "کرد",
  "کند",
  "گفت",
  "دهد",
  "برد",
  "رفت",
  "آمد",
  "اگر",
  "تا",
  "ولی",
  "اما",
  "زیرا",
  "چون",
  "پس",
  "سپس",
  "فقط",
  "حتی",
  "البته",
  "همچنین",
  "مثل",
  "مانند",
  "حدود",
  "بیشتر",
  "کمتر",
  "دیگر",
  "همان",
  "چیست",
]);

// Phrases indicating uncertainty/ignorance
const UNCERTAINTY_PHRASES = [
  "اطلاعی ندارم",
  "نمی‌دانم",
  "متأسفم",
  "اطلاعی نداریم",
  "نمی‌دانیم",
  "متأسفانه",
  "نمی‌تونم",
  "نمیدونم",
  "اطلاعی ندارم",
  "سر در نمی‌آورم",
  "نمی‌شناسم",
  "آگاهی ندارم",
];

/**
 * Extract meaningful keywords from user message
 */
function extractKeywords(message: string): string[] {
  // Split by spaces, punctuation, and common delimiters
  const words = message
    .split(/[\s،؟!.؛:٬‌\-\(\)\[\]{}\"\'\/\\]+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 1) // skip single-char words
    .filter((w) => !PERSIAN_STOP_WORDS.has(w));

  return words;
}

/**
 * Search knowledge chunks using keyword matching with SQLite LIKE
 */
async function searchKnowledgeChunks(
  keywords: string[],
  limit = 5
): Promise<string[]> {
  if (keywords.length === 0) return [];

  // Use parameterized query for safety
  const likeParams = keywords.map((k) => `%${k}%`);

  const chunks = await db.$queryRawUnsafe(
    `SELECT kc.content, kc.entryId
     FROM KnowledgeChunk kc
     WHERE ${keywords.map(() => "kc.content LIKE ?").join(" OR ")}
     ORDER BY kc.chunkIndex ASC
     LIMIT ?`,
    ...likeParams,
    limit
  );

  return (chunks as { content: string; entryId: string }[]).map((c) => c.content);
}

/**
 * Build system prompt using settings personality + relevant chunks
 */
function buildSystemPrompt(personality: string, chunks: string[]): string {
  const chunksText =
    chunks.length > 0
      ? chunks.join("\n\n---\n\n")
      : "(هیچ اطلاعات مرجعی در دسترس نیست)";

  return `تو ${personality} هستی. فقط بر اساس اطلاعات زیر به سوالات پاسخ بده. اگر اطلاعات کافی نداری، صادقانه بگو که اطلاعی نداری.

اطلاعات مرجع:
${chunksText}

قوانین:
- فقط از اطلاعات مرجع بالا استفاده کن
- اگر اطلاعی نداری، صادقانه بگو
- به فارسی پاسخ بده
- مودب و حرفه‌ای باش`;
}

/**
 * Check if response indicates uncertainty
 */
function checkUncertainty(response: string): boolean {
  return UNCERTAINTY_PHRASES.some((phrase) => response.includes(phrase));
}

// POST: Main chat API
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, conversationId, visitorId } = body;

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        { error: "پیام الزامی است" },
        { status: 400 }
      );
    }

    // 1. Get chatbot settings
    let settings = await db.chatbotSettings.findFirst();
    if (!settings) {
      settings = await db.chatbotSettings.create({ data: {} });
    }

    if (!settings.isActive) {
      return NextResponse.json(
        { error: "چت‌بات غیرفعال است" },
        { status: 403 }
      );
    }

    // 2. Get or create conversation
    let conversation;
    if (conversationId) {
      conversation = await db.conversation.findUnique({
        where: { id: conversationId },
        include: {
          messages: {
            orderBy: { createdAt: "desc" },
            take: 10,
          },
        },
      });

      if (!conversation) {
        return NextResponse.json(
          { error: "گفتگو یافت نشد" },
          { status: 404 }
        );
      }
    } else {
      conversation = await db.conversation.create({
        data: {
          visitorId: visitorId || undefined,
          status: "active",
        },
        include: {
          messages: true,
        },
      });
    }

    // 3. Save user message
    await db.message.create({
      data: {
        conversationId: conversation.id,
        role: "user",
        content: message.trim(),
      },
    });

    // 4. RAG Search: Extract keywords and search knowledge chunks
    const keywords = extractKeywords(message);
    const relevantChunks = await searchKnowledgeChunks(keywords);

    // 5. Build system prompt
    const systemPrompt = buildSystemPrompt(
      settings.personality,
      relevantChunks
    );

    // 6. Build conversation history (last 10 messages, oldest first)
    const historyMessages = conversation.messages
      .slice()
      .reverse()
      .map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      }));

    // 7. Call LLM using z-ai-web-dev-sdk
    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        ...historyMessages,
        { role: "user", content: message.trim() },
      ],
      model: settings.modelName,
    });

    const assistantResponse =
      completion.choices?.[0]?.message?.content ||
      settings.fallbackMessage;

    // 8. Save assistant message
    await db.message.create({
      data: {
        conversationId: conversation.id,
        role: "assistant",
        content: assistantResponse,
      },
    });

    // 9. Check if response indicates uncertainty
    const showLeadForm =
      settings.leadFormEnabled && checkUncertainty(assistantResponse);

    // 10. Return response
    return NextResponse.json({
      response: assistantResponse,
      conversationId: conversation.id,
      showLeadForm,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "خطا در پردازش پیام" },
      { status: 500 }
    );
  }
}
