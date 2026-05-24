"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { TechBackground } from "@/components/tech-background";
import { ArrowRight, Calendar, Clock, Share2, BookOpen } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  readTime: number;
  createdAt: string;
  category: { id: string; name: string; slug: string; color: string } | null;
  tags: { tag: { id: string; name: string; slug: string } }[];
}

export default function ArticlePageClient({ article }: { article: Article }) {
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <main className="min-h-screen flex flex-col relative">
      <TechBackground />
      <Header />
      <div className="flex-1 relative z-10 pt-24 sm:pt-28">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-muted-foreground mb-8"
          >
            <Link href="/" className="hover:text-foreground transition-colors">
              خانه
            </Link>
            <span>/</span>
            <Link
              href="/blog"
              className="hover:text-foreground transition-colors"
            >
              بلاگ
            </Link>
            {article.category && (
              <>
                <span>/</span>
                <span className="text-foreground">{article.category.name}</span>
              </>
            )}
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {article.category && (
              <Badge
                variant="secondary"
                className="mb-4"
                style={{
                  backgroundColor: article.category.color + "20",
                  color: article.category.color,
                }}
              >
                {article.category.name}
              </Badge>
            )}

            <h1 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">
              {article.title}
            </h1>

            {article.excerpt && (
              <p className="text-lg text-muted-foreground mb-6">
                {article.excerpt}
              </p>
            )}

            <div className="flex items-center gap-4 mb-8 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(article.createdAt).toLocaleDateString("fa-IR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {article.readTime} دقیقه مطالعه
              </span>
              <button
                className="flex items-center gap-1 hover:text-primary transition-colors"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: article.title, url: shareUrl });
                  } else {
                    navigator.clipboard.writeText(shareUrl);
                    alert("لینک کپی شد!");
                  }
                }}
              >
                <Share2 className="w-4 h-4" />
                اشتراک‌گذاری
              </button>
            </div>
          </motion.div>

          {/* Cover Image */}
          {article.coverImage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-xl overflow-hidden mb-10 border border-border/50"
            >
              <img
                src={article.coverImage}
                alt={article.title}
                className="w-full h-64 sm:h-80 object-cover"
              />
            </motion.div>
          )}

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h3:text-xl prose-a:text-primary prose-img:rounded-xl prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-pre:bg-card prose-pre:border prose-pre:border-border/50"
          >
            <ReactMarkdown>{article.content}</ReactMarkdown>
          </motion.div>

          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="mt-10 pt-8 border-t border-border">
              <div className="flex flex-wrap gap-2">
                {article.tags.map((t) => (
                  <Badge
                    key={t.tag.id}
                    variant="outline"
                    className="text-xs cursor-pointer hover:bg-primary/10"
                  >
                    #{t.tag.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Back Button */}
          <div className="mt-10">
            <Link href="/blog">
              <Button variant="outline" size="sm">
                <ArrowRight className="w-4 h-4 ml-2" />
                بازگشت به بلاگ
              </Button>
            </Link>
          </div>
        </article>
      </div>
      <Footer />
    </main>
  );
}
