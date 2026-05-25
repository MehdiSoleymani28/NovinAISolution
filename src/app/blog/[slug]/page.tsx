import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import ArticlePageClient from "./article-client";

// Force dynamic rendering - don't try to pre-render at build time
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await db.article.findUnique({
    where: { slug },
    include: { category: true, tags: { include: { tag: true } } },
  });

  if (!article) return { title: "مقاله یافت نشد" };

  return {
    title: article.metaTitle || `${article.title} | NovinAISolution Blog`,
    description: article.metaDesc || article.excerpt || undefined,
    openGraph: {
      title: article.metaTitle || article.title,
      description: article.metaDesc || article.excerpt || undefined,
      type: "article",
      publishedTime: article.createdAt.toISOString(),
      images: article.coverImage ? [{ url: article.coverImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: article.metaTitle || article.title,
      description: article.metaDesc || article.excerpt || undefined,
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await db.article.findUnique({
    where: { slug, published: true },
    include: { category: true, tags: { include: { tag: true } } },
  });

  if (!article) notFound();

  // JSON-LD for Article
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.metaDesc || article.excerpt,
    image: article.coverImage,
    datePublished: article.createdAt.toISOString(),
    author: {
      "@type": "Organization",
      name: "NovinAISolution",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArticlePageClient article={JSON.parse(JSON.stringify(article))} />
    </>
  );
}
