import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const published = searchParams.get("published");

    const courses = await db.course.findMany({
      where: published === "true" ? { published: true } : undefined,
      orderBy: { order: "asc" },
    });

    return NextResponse.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "خطا در دریافت دوره‌ها" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const course = await db.course.create({
      data: {
        title: body.title,
        slug: body.slug,
        excerpt: body.excerpt || null,
        content: body.content,
        coverImage: body.coverImage || null,
        category: body.category || "مقدماتی",
        level: body.level || "beginner",
        duration: body.duration || "۸ ساعت",
        lessonsCount: body.lessonsCount || 0,
        price: body.price || "رایگان",
        features: JSON.stringify(body.features || []),
        syllabus: JSON.stringify(body.syllabus || []),
        instructor: body.instructor || "تیم نوین ای‌آی سولوشن",
        published: body.published || false,
        featured: body.featured || false,
        order: body.order || 0,
        metaTitle: body.metaTitle || null,
        metaDesc: body.metaDesc || null,
      },
    });

    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    console.error("Error creating course:", error);
    return NextResponse.json(
      { error: "خطا در ایجاد دوره" },
      { status: 500 }
    );
  }
}
