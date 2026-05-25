import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET all categories
export async function GET() {
  try {
    const categories = await db.category.findMany({
      include: {
        _count: { select: { articles: true } },
      },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Get categories error:", error);
    return NextResponse.json(
      { error: "خطا در دریافت دسته‌بندی‌ها" },
      { status: 500 }
    );
  }
}

// POST create category
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, slug, color } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: "نام و اسلاگ الزامی است" },
        { status: 400 }
      );
    }

    const category = await db.category.create({
      data: { name, slug, color },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Create category error:", error);
    return NextResponse.json(
      { error: "خطا در ایجاد دسته‌بندی" },
      { status: 500 }
    );
  }
}
