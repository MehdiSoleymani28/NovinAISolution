import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const VALID_MODELS = [
  "gpt-4o",
  "gpt-4o-mini",
  "gpt-4.1",
  "gpt-4.1-mini",
  "gpt-4.1-nano",
  "claude-3.5-sonnet",
  "claude-3.5-haiku",
];

const DEFAULT_SETTINGS = {
  modelName: "gpt-4o-mini",
  personality: "دستیار حرفه‌ای و دوستانه شرکت نوین ای‌آی سولوشن",
  welcomeMessage:
    "سلام! 👋 من دستیار هوشمند نوین ای‌آی سولوشن هستم. چطور می‌تونم کمکتون کنم؟",
  fallbackMessage:
    "متأسفانه اطلاعاتی در این مورد ندارم. می‌تونم شمارتون رو بذارم تا همکارام باهاتون تماس بگیرن؟",
  leadFormEnabled: true,
  isActive: true,
};

// GET: Return the single ChatbotSettings record (create default if not exists)
export async function GET() {
  try {
    let settings = await db.chatbotSettings.findFirst();

    if (!settings) {
      settings = await db.chatbotSettings.create({
        data: DEFAULT_SETTINGS,
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Get chatbot settings error:", error);
    return NextResponse.json(
      { error: "خطا در دریافت تنظیمات چت‌بات" },
      { status: 500 }
    );
  }
}

// PUT: Update chatbot settings
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      modelName,
      personality,
      welcomeMessage,
      fallbackMessage,
      leadFormEnabled,
      isActive,
    } = body;

    // Validate model name if provided
    if (modelName !== undefined && !VALID_MODELS.includes(modelName)) {
      return NextResponse.json(
        { error: `مدل نامعتبر. مدل‌های مجاز: ${VALID_MODELS.join(", ")}` },
        { status: 400 }
      );
    }

    // Get or create settings
    let settings = await db.chatbotSettings.findFirst();

    if (!settings) {
      settings = await db.chatbotSettings.create({
        data: DEFAULT_SETTINGS,
      });
    }

    // Build update data
    const updateData: Record<string, unknown> = {};
    if (modelName !== undefined) updateData.modelName = modelName;
    if (personality !== undefined) updateData.personality = personality;
    if (welcomeMessage !== undefined)
      updateData.welcomeMessage = welcomeMessage;
    if (fallbackMessage !== undefined)
      updateData.fallbackMessage = fallbackMessage;
    if (leadFormEnabled !== undefined)
      updateData.leadFormEnabled = leadFormEnabled;
    if (isActive !== undefined) updateData.isActive = isActive;

    const updated = await db.chatbotSettings.update({
      where: { id: settings.id },
      data: updateData,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update chatbot settings error:", error);
    return NextResponse.json(
      { error: "خطا در بروزرسانی تنظیمات چت‌بات" },
      { status: 500 }
    );
  }
}
