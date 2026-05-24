"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, FolderOpen, Tags, Eye, Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Stats {
  totalArticles: number;
  publishedArticles: number;
  totalCategories: number;
  totalTags: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalArticles: 0,
    publishedArticles: 0,
    totalCategories: 0,
    totalTags: 0,
  });
  const [recentArticles, setRecentArticles] = useState<Array<{
    id: string;
    title: string;
    slug: string;
    published: boolean;
    createdAt: string;
  }>>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [articlesRes, categoriesRes, tagsRes] = await Promise.all([
          fetch("/api/articles?limit=100"),
          fetch("/api/categories"),
          fetch("/api/tags"),
        ]);

        const articlesData = await articlesRes.json();
        const categoriesData = await categoriesRes.json();
        const tagsData = await tagsRes.json();

        setStats({
          totalArticles: articlesData.total || 0,
          publishedArticles: articlesData.articles?.filter((a: { published: boolean }) => a.published).length || 0,
          totalCategories: categoriesData.length || 0,
          totalTags: tagsData.length || 0,
        });

        setRecentArticles(
          (articlesData.articles || []).slice(0, 5).map((a: { id: string; title: string; slug: string; published: boolean; createdAt: string }) => ({
            id: a.id,
            title: a.title,
            slug: a.slug,
            published: a.published,
            createdAt: a.createdAt,
          }))
        );
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    {
      label: "کل مقالات",
      value: stats.totalArticles,
      icon: FileText,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "منتشر شده",
      value: stats.publishedArticles,
      icon: Eye,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      label: "دسته‌بندی‌ها",
      value: stats.totalCategories,
      icon: FolderOpen,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      label: "برچسب‌ها",
      value: stats.totalTags,
      icon: Tags,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">داشبورد</h1>
          <p className="text-muted-foreground text-sm mt-1">
            خوش آمدید! مدیریت بلاگ NovinAISolution
          </p>
        </div>
        <Link href="/admin/articles/new">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="w-4 h-4 ml-2" />
            مقاله جدید
          </Button>
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.label} className="border-border/50 bg-card/50">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Articles */}
      <Card className="border-border/50 bg-card/50">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">آخرین مقالات</h2>
            <Link href="/admin/articles">
              <Button variant="ghost" size="sm" className="text-primary">
                مشاهده همه
                <ArrowLeft className="w-4 h-4 mr-1" />
              </Button>
            </Link>
          </div>

          {recentArticles.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-muted-foreground mb-4">هنوز مقاله‌ای ایجاد نشده</p>
              <Link href="/admin/articles/new">
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 ml-2" />
                  اولین مقاله را بنویسید
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentArticles.map((article) => (
                <div
                  key={article.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/30 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">
                      {article.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(article.createdAt).toLocaleDateString("fa-IR")}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-[10px] font-medium mr-3 ${
                      article.published
                        ? "bg-green-500/10 text-green-500"
                        : "bg-yellow-500/10 text-yellow-500"
                    }`}
                  >
                    {article.published ? "منتشر شده" : "پیش‌نویس"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Setup */}
      {stats.totalArticles === 0 && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-5">
            <h3 className="font-bold mb-2">🚀 شروع سریع</h3>
            <p className="text-sm text-muted-foreground mb-4">
              برای شروع، ابتدا داده‌های اولیه (دسته‌بندی‌ها و برچسب‌ها) را ایجاد کنید:
            </p>
            <Button
              variant="outline"
              size="sm"
              className="border-primary/30"
              onClick={async () => {
                const res = await fetch("/api/seed", { method: "POST" });
                const data = await res.json();
                alert(data.message || "خطا");
                window.location.reload();
              }}
            >
              ایجاد داده‌های اولیه
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
