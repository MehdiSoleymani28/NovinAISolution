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

    // Create default categories
    const categories = [
      { name: "یادگیری ماشین", slug: "machine-learning", color: "#3B82F6" },
      { name: "یادگیری عمیق", slug: "deep-learning", color: "#8B5CF6" },
      { name: "پردازش زبان طبیعی", slug: "nlp", color: "#10B981" },
      { name: "بینایی ماشین", slug: "computer-vision", color: "#F59E0B" },
      { name: "AI در کسب‌وکار", slug: "ai-business", color: "#EF4444" },
      { name: "آموزش", slug: "tutorial", color: "#06B6D4" },
    ];

    for (const cat of categories) {
      const existing = await db.category.findUnique({
        where: { slug: cat.slug },
      });
      if (!existing) {
        await db.category.create({ data: cat });
      }
    }

    // Create default tags
    const tags = [
      { name: "پایتون", slug: "python" },
      { name: "TensorFlow", slug: "tensorflow" },
      { name: "PyTorch", slug: "pytorch" },
      { name: "GPT", slug: "gpt" },
      { name: "LLM", slug: "llm" },
      { name: "RAG", slug: "rag" },
      { name: "Transformer", slug: "transformer" },
      { name: "ChatBot", slug: "chatbot" },
      { name: "API", slug: "api" },
      { name: "مقدماتی", slug: "beginner" },
      { name: "پیشرفته", slug: "advanced" },
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
