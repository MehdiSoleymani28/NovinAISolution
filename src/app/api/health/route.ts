import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const [courseCount, articleCount, adminCount] = await Promise.all([
      db.course.count(),
      db.article.count(),
      db.admin.count(),
    ]);

    const isHealthy = courseCount > 0 || articleCount > 0 || adminCount > 0;

    return NextResponse.json({
      status: isHealthy ? "healthy" : "empty",
      database: "connected",
      counts: {
        courses: courseCount,
        articles: articleCount,
        admins: adminCount,
      },
      message: isHealthy
        ? "دیتابیس فعال است"
        : "دیتابیس خالی است. لطفاً API /api/seed را فراخوانی کنید.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        database: "disconnected",
        message: "خطا در اتصال به دیتابیس",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
