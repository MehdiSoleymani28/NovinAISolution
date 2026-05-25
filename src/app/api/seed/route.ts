import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Seed database with initial data
export async function POST() {
  try {
    // Create default admin
    const existingAdmin = await db.admin.findUnique({
      where: { email: "admin@novinaisolution.com" },
    });

    if (!existingAdmin) {
      await db.admin.create({
        data: {
          email: "admin@novinaisolution.com",
          password: "admin123",
          name: "مدیر NovinAI",
        },
      });
    }

    // Create default categories - aligned with actual business focus
    const categories = [
      { name: "اتوماسیون و ورکفلو", slug: "automation-workflow", color: "#3B82F6" },
      { name: "دستیارهای هوشمند", slug: "ai-agents", color: "#8B5CF6" },
      { name: "ابزارهای AI", slug: "ai-tools", color: "#10B981" },
      { name: "پرامپت‌نویسی", slug: "prompt-engineering", color: "#F59E0B" },
      { name: "No-Code AI", slug: "no-code-ai", color: "#EF4444" },
      { name: "آموزش عملی", slug: "practical-tutorial", color: "#06B6D4" },
    ];

    for (const cat of categories) {
      const existing = await db.category.findUnique({
        where: { slug: cat.slug },
      });
      if (!existing) {
        await db.category.create({ data: cat });
      }
    }

    // Create default tags - aligned with actual business focus
    const tags = [
      { name: "ChatGPT", slug: "chatgpt" },
      { name: "Claude", slug: "claude" },
      { name: "Make", slug: "make" },
      { name: "n8n", slug: "n8n" },
      { name: "AI Agent", slug: "ai-agent" },
      { name: "RAG", slug: "rag" },
      { name: "LangChain", slug: "langchain" },
      { name: "اتوماسیون", slug: "automation" },
      { name: "ورکفلو", slug: "workflow" },
      { name: "پرامپت", slug: "prompt" },
      { name: "No-Code", slug: "no-code" },
      { name: "دستیار هوشمند", slug: "assistant" },
      { name: "چت‌بات", slug: "chatbot" },
      { name: "کسب‌وکار", slug: "business" },
    ];

    for (const tag of tags) {
      const existing = await db.tag.findUnique({
        where: { slug: tag.slug },
      });
      if (!existing) {
        await db.tag.create({ data: tag });
      }
    }

    return NextResponse.json({
      message: "داده‌های اولیه با موفقیت ایجاد شدند",
      admin: { email: "admin@novinaisolution.com", password: "admin123" },
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "خطا در ایجاد داده‌های اولیه" },
      { status: 500 }
    );
  }
}
