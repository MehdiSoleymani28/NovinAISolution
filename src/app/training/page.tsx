import { db } from "@/lib/db";
import { Metadata } from "next";
import TrainingPageClient from "./training-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "آموزش‌های NovinAISolution | یادگیری عملی ابزارهای AI",
  description:
    "دوره‌های آموزشی عملی هوش مصنوعی: از پرامپت‌نویسی حرفه‌ای تا ساخت AI Agent و اتوماسیون کسب‌وکار. بدون تئوری اضافه، فقط کار عملی.",
  openGraph: {
    title: "آموزش‌های NovinAISolution | یادگیری عملی ابزارهای AI",
    description:
      "دوره‌های آموزشی عملی هوش مصنوعی: از پرامپت‌نویسی حرفه‌ای تا ساخت AI Agent و اتوماسیون کسب‌وکار.",
  },
};

export default async function TrainingPage() {
  const courses = await db.course.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  });

  return <TrainingPageClient courses={JSON.parse(JSON.stringify(courses))} />;
}
