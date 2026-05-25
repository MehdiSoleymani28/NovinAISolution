import { db } from "@/lib/db";
import { Metadata } from "next";
import BlogPageClient from "./blog-client";

// Force dynamic rendering - don't try to pre-render at build time
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "بلاگ NovinAISolution | مقالات و آموزش‌های هوش مصنوعی",
  description:
    "آخرین مقالات، آموزش‌ها و اخبار هوش مصنوعی. از مفاهیم پایه تا پیاده‌سازی عملی AI در کسب‌وکار.",
  openGraph: {
    title: "بلاگ NovinAISolution | مقالات هوش مصنوعی",
    description: "آخرین مقالات و آموزش‌های هوش مصنوعی",
  },
};

export default async function BlogPage() {
  const [articles, categories] = await Promise.all([
    db.article.findMany({
      where: { published: true },
      include: {
        category: true,
        tags: { include: { tag: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    db.category.findMany({
      include: { _count: { select: { articles: { where: { published: true } } } } },
    }),
  ]);

  return <BlogPageClient articles={JSON.parse(JSON.stringify(articles))} categories={JSON.parse(JSON.stringify(categories))} />;
}
