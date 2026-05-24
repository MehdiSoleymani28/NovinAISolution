import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET all tags
export async function GET() {
  try {
    const tags = await db.tag.findMany({
      include: {
        _count: { select: { articles: true } },
      },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(tags);
  } catch (error) {
    console.error("Get tags error:", error);
    return NextResponse.json(
      { error: "خطا در دریافت برچسب‌ها" },
      { status: 500 }
    );
  }
}

// POST create tag
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, slug } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: "نام و اسلاگ الزامی است" },
        { status: 400 }
      );
    }

    const tag = await db.tag.create({
      data: { name, slug },
    });

    return NextResponse.json(tag, { status: 201 });
  } catch (error) {
    console.error("Create tag error:", error);
    return NextResponse.json(
      { error: "خطا در ایجاد برچسب" },
      { status: 500 }
    );
  }
}
