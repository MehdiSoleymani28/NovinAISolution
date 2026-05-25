"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { TechBackground } from "@/components/tech-background";
import {
  Search,
  Clock,
  ArrowLeft,
  BookOpen,
  Calendar,
} from "lucide-react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";

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

interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
  _count: { articles: number };
}

export default function BlogPageClient({
  articles,
  categories,
}: {
  articles: Article[];
  categories: Category[];
}) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredArticles = articles.filter((article) => {
    const matchSearch =
      !search ||
      article.title.includes(search) ||
      (article.excerpt && article.excerpt.includes(search));
    const matchCategory =
      !activeCategory || article.category?.slug === activeCategory;
    return matchSearch && matchCategory;
  });

  const featuredArticles = articles.filter((a) => a.featured);
  const regularArticles = filteredArticles.filter((a) => !a.featured);

  return (
    <main className="min-h-screen flex flex-col relative">
      <TechBackground />
      <Header />
      <div className="flex-1 relative z-10 pt-24 sm:pt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <BookOpen className="w-4 h-4 inline-block ml-1" />
              بلاگ
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              مقالات و آموزش‌های <span className="text-gradient">اتوماسیون و ورکفلو</span>
            </h1>
            <p className="max-w-2xl mx-auto text-muted-foreground text-lg">
              از پرامپت‌نویسی تا ساخت ورکفلو، مطالب عملی برای خودکارسازی کسب‌وکار با AI
            </p>
          </motion.div>

          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="جستجو در مقالات..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pr-10 bg-card/50 backdrop-blur-sm"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={!activeCategory ? "default" : "outline"}
                className={`cursor-pointer ${
                  !activeCategory ? "bg-primary text-primary-foreground" : ""
                }`}
                onClick={() => setActiveCategory(null)}
              >
                همه
              </Badge>
              {categories.map((cat) => (
                <Badge
                  key={cat.id}
                  variant={activeCategory === cat.slug ? "default" : "outline"}
                  className={`cursor-pointer ${
                    activeCategory === cat.slug
                      ? "bg-primary text-primary-foreground"
                      : ""
                  }`}
                  onClick={() => setActiveCategory(cat.slug)}
                >
                  {cat.name}
                  <span className="text-[10px] opacity-70 mr-1">
                    ({cat._count.articles})
                  </span>
                </Badge>
              ))}
            </div>
          </div>

          {/* Featured Articles */}
          {featuredArticles.length > 0 && !search && !activeCategory && (
            <div className="mb-12">
              <h2 className="text-xl font-bold mb-4">مقالات ویژه</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featuredArticles.slice(0, 2).map((article) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Link href={`/blog/${article.slug}`}>
                      <Card className="group h-full border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all overflow-hidden">
                        {article.coverImage && (
                          <div className="h-48 overflow-hidden">
                            <img
                              src={article.coverImage}
                              alt={article.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}
                        <CardContent className="p-5">
                          {article.category && (
                            <Badge
                              variant="secondary"
                              className="text-[10px] mb-2"
                              style={{
                                backgroundColor: article.category.color + "20",
                                color: article.category.color,
                              }}
                            >
                              {article.category.name}
                            </Badge>
                          )}
                          <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                            {article.title}
                          </h3>
                          {article.excerpt && (
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                              {article.excerpt}
                            </p>
                          )}
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {article.readTime} دقیقه
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {new Date(article.createdAt).toLocaleDateString("fa-IR")}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Regular Articles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(regularArticles.length > 0 ? regularArticles : filteredArticles).map(
              (article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Link href={`/blog/${article.slug}`}>
                    <Card className="group h-full border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5 overflow-hidden">
                      {article.coverImage && (
                        <div className="h-40 overflow-hidden">
                          <img
                            src={article.coverImage}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <CardContent className="p-5">
                        <div className="flex items-center gap-2 mb-2">
                          {article.category && (
                            <Badge
                              variant="secondary"
                              className="text-[10px]"
                              style={{
                                backgroundColor: article.category.color + "20",
                                color: article.category.color,
                              }}
                            >
                              {article.category.name}
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-bold text-sm mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        {article.excerpt && (
                          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                            {article.excerpt}
                          </p>
                        )}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {article.readTime} دقیقه
                          </div>
                          <div className="flex gap-1">
                            {article.tags.slice(0, 2).map((t) => (
                              <span
                                key={t.tag.id}
                                className="text-[10px] text-muted-foreground"
                              >
                                #{t.tag.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              )
            )}
          </div>

          {/* Empty State */}
          {filteredArticles.length === 0 && (
            <div className="text-center py-16">
              <BookOpen className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-muted-foreground">
                {search ? "مقاله‌ای یافت نشد" : "هنوز مقاله‌ای منتشر نشده"}
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
