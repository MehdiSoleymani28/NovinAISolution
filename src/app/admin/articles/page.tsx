"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  Trash2,
  Edit,
  Eye,
  FileText,
  MoreVertical,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  published: boolean;
  featured: boolean;
  createdAt: string;
  category: { id: string; name: string; slug: string; color: string } | null;
  tags: { tag: { id: string; name: string; slug: string } }[];
}

export default function ArticlesListPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/articles?limit=100${search ? `&search=${search}` : ""}`
      );
      const data = await res.json();
      setArticles(data.articles || []);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleDelete = async (slug: string) => {
    if (!confirm("آیا از حذف این مقاله مطمئن هستید؟")) return;

    try {
      await fetch(`/api/articles/${slug}`, { method: "DELETE" });
      fetchArticles();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const togglePublish = async (article: Article) => {
    try {
      await fetch(`/api/articles/${article.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !article.published }),
      });
      fetchArticles();
    } catch (error) {
      console.error("Toggle publish error:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/dashboard">
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">مقالات</h1>
        </div>
        <Link href="/admin/articles/new">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" size="sm">
            <Plus className="w-4 h-4 ml-2" />
            مقاله جدید
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="جستجو در مقالات..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pr-10 bg-background/50"
          onKeyDown={(e) => e.key === "Enter" && fetchArticles()}
        />
      </div>

      {/* Articles List */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">
          در حال بارگذاری...
        </div>
      ) : articles.length === 0 ? (
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-12 text-center">
            <FileText className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-muted-foreground mb-4">هنوز مقاله‌ای ایجاد نشده</p>
            <Link href="/admin/articles/new">
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 ml-2" />
                اولین مقاله را بنویسید
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {articles.map((article) => (
            <Card
              key={article.id}
              className="border-border/50 bg-card/50 hover:border-primary/20 transition-all"
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-sm truncate">
                        {article.title}
                      </h3>
                      {article.featured && (
                        <Badge variant="secondary" className="text-[10px] bg-yellow-500/10 text-yellow-500 shrink-0">
                          ویژه
                        </Badge>
                      )}
                    </div>
                    {article.excerpt && (
                      <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
                        {article.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{new Date(article.createdAt).toLocaleDateString("fa-IR")}</span>
                      {article.category && (
                        <span
                          className="px-1.5 py-0.5 rounded text-[10px]"
                          style={{
                            backgroundColor: article.category.color + "20",
                            color: article.category.color,
                          }}
                        >
                          {article.category.name}
                        </span>
                      )}
                      {article.tags.slice(0, 3).map((t) => (
                        <span key={t.tag.id} className="text-[10px]">
                          #{t.tag.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge
                      variant="secondary"
                      className={`text-[10px] cursor-pointer ${
                        article.published
                          ? "bg-green-500/10 text-green-500"
                          : "bg-yellow-500/10 text-yellow-500"
                      }`}
                      onClick={() => togglePublish(article)}
                    >
                      {article.published ? "منتشر شده" : "پیش‌نویس"}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="w-8 h-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => router.push(`/blog/${article.slug}`)}
                        >
                          <Eye className="w-4 h-4 ml-2" />
                          مشاهده
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => router.push(`/admin/articles/edit/${article.slug}`)}
                        >
                          <Edit className="w-4 h-4 ml-2" />
                          ویرایش
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDelete(article.slug)}
                        >
                          <Trash2 className="w-4 h-4 ml-2" />
                          حذف
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
