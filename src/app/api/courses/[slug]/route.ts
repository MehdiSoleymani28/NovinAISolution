import { NextResponse } from "next/server";
import { db } from "@/lib/db";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const course = await db.course.findUnique({
      where: { slug },
    });

    if (!course) {
      return NextResponse.json(
        { error: "دوره یافت نشد" },
        { status: 404 }
      );
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error("Error fetching course:", error);
    return NextResponse.json(
      { error: "خطا در دریافت دوره" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const body = await request.json();

    const course = await db.course.update({
      where: { slug },
      data: {
        ...(body.title && { title: body.title }),
        ...(body.excerpt !== undefined && { excerpt: body.excerpt || null }),
        ...(body.content && { content: body.content }),
        ...(body.coverImage !== undefined && { coverImage: body.coverImage || null }),
        ...(body.category && { category: body.category }),
        ...(body.level && { level: body.level }),
        ...(body.duration && { duration: body.duration }),
        ...(body.lessonsCount !== undefined && { lessonsCount: body.lessonsCount }),
        ...(body.price && { price: body.price }),
        ...(body.features && { features: JSON.stringify(body.features) }),
        ...(body.syllabus && { syllabus: JSON.stringify(body.syllabus) }),
        ...(body.instructor && { instructor: body.instructor }),
        ...(body.published !== undefined && { published: body.published }),
        ...(body.featured !== undefined && { featured: body.featured }),
        ...(body.order !== undefined && { order: body.order }),
        ...(body.metaTitle !== undefined && { metaTitle: body.metaTitle || null }),
        ...(body.metaDesc !== undefined && { metaDesc: body.metaDesc || null }),
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error("Error updating course:", error);
    return NextResponse.json(
      { error: "خطا در به‌روزرسانی دوره" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { slug } = await params;
    await db.course.delete({
      where: { slug },
    });

    return NextResponse.json({ message: "دوره حذف شد" });
  } catch (error) {
    console.error("Error deleting course:", error);
    return NextResponse.json(
      { error: "خطا در حذف دوره" },
      { status: 500 }
    );
  }
}
