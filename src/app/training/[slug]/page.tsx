import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import CourseDetailClient from "./course-detail-client";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = await db.course.findUnique({
    where: { slug },
  });

  if (!course) return { title: "دوره یافت نشد" };

  return {
    title: course.metaTitle || `${course.title} | آموزش NovinAISolution`,
    description: course.metaDesc || course.excerpt || undefined,
    openGraph: {
      title: course.metaTitle || course.title,
      description: course.metaDesc || course.excerpt || undefined,
      type: "article",
    },
  };
}

export default async function CoursePage({ params }: PageProps) {
  const { slug } = await params;
  const course = await db.course.findUnique({
    where: { slug, published: true },
  });

  if (!course) notFound();

  // Get other courses (excluding current)
  const otherCourses = await db.course.findMany({
    where: { published: true, slug: { not: slug } },
    orderBy: { order: "asc" },
    take: 3,
  });

  return (
    <CourseDetailClient
      course={JSON.parse(JSON.stringify(course))}
      otherCourses={JSON.parse(JSON.stringify(otherCourses))}
    />
  );
}
