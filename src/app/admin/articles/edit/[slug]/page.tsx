"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowRight,
  Save,
  Eye,
  Loader2,
  X,
  Settings2,
  PenLine,
  FileText,
} from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
}

interface Tag {
  id: string;
  name: string;
  slug: string;
}

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [showSettings, setShowSettings] = useState(true);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
    published: false,
    featured: false,
    readTime: 5,
    metaTitle: "",
    metaDesc: "",
    categoryId: "",
    tagIds: [] as string[],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [articleRes, catRes, tagRes] = await Promise.all([
          fetch(`/api/articles/${slug}`),
          fetch("/api/categories"),
          fetch("/api/tags"),
        ]);

        const article = await articleRes.json();
        setCategories(await catRes.json());
        setTags(await tagRes.json());

        setForm({
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt || "",
          content: article.content,
          coverImage: article.coverImage || "",
          published: article.published,
          featured: article.featured,
          readTime: article.readTime,
          metaTitle: article.metaTitle || "",
          metaDesc: article.metaDesc || "",
          categoryId: article.categoryId || "",
          tagIds: article.tags?.map((t: { tag: { id: string } }) => t.tag.id) || [],
        });
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  const toggleTag = (tagId: string) => {
    setForm((prev) => ({
      ...prev,
      tagIds: prev.tagIds.includes(tagId)
        ? prev.tagIds.filter((id) => id !== tagId)
        : [...prev.tagIds, tagId],
    }));
  };

  const calculateReadTime = (text: string) => {
    const words = text.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
  };

  const handleSave = async (publish: boolean = false) => {
    if (!form.title || !form.content) {
      alert("عنوان و محتوا الزامی است");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch(`/api/articles/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          published: publish || form.published,
          readTime: calculateReadTime(form.content),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "خطا در بروزرسانی مقاله");
        return;
      }

      router.push("/admin/dashboard");
    } catch {
      alert("خطا در اتصال به سرور");
    } finally {
      setIsSaving(false);
    }
  };

  const insertMarkdown = (prefix: string, suffix: string = "") => {
    const textarea = document.querySelector("textarea[name='content']") as HTMLTextAreaElement;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = form.content.substring(start, end);
    const newContent =
      form.content.substring(0, start) +
      prefix +
      (selected || "متن") +
      suffix +
      form.content.substring(end);
    setForm((prev) => ({ ...prev, content: newContent }));
  };

  const toolbarButtons = [
    { label: "B", action: () => insertMarkdown("**", "**"), title: "پررنگ" },
    { label: "I", action: () => insertMarkdown("*", "*"), title: "کج" },
    { label: "H2", action: () => insertMarkdown("\n## "), title: "تیتر ۲" },
    { label: "H3", action: () => insertMarkdown("\n### "), title: "تیتر ۳" },
    { label: "List", action: () => insertMarkdown("\n- "), title: "لیست" },
    { label: "Quote", action: () => insertMarkdown("\n> "), title: "نقل قول" },
    { label: "Code", action: () => insertMarkdown("\n```\n", "\n```\n"), title: "کد" },
    { label: "Link", action: () => insertMarkdown("[", "](url)"), title: "لینک" },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/articles">
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">ویرایش مقاله</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
          >
            <Eye className="w-4 h-4 ml-1" />
            {showPreview ? "ویرایش" : "پیش‌نمایش"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSave(false)}
            disabled={isSaving}
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 ml-1 animate-spin" />
            ) : (
              <Save className="w-4 h-4 ml-1" />
            )}
            ذخیره
          </Button>
          <Button
            size="sm"
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={() => handleSave(true)}
            disabled={isSaving}
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 ml-1 animate-spin" />
            ) : (
              <FileText className="w-4 h-4 ml-1" />
            )}
            {form.published ? "بروزرسانی" : "منتشر کنید"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-border/50 bg-card/50">
            <CardContent className="p-4">
              <Input
                placeholder="عنوان مقاله..."
                value={form.title}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, title: e.target.value }))
                }
                className="text-2xl font-bold border-0 bg-transparent p-0 h-auto focus-visible:ring-0"
                style={{ boxShadow: "none" }}
              />
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50">
            <CardContent className="p-4">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                خلاصه مقاله
              </label>
              <Textarea
                value={form.excerpt}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, excerpt: e.target.value }))
                }
                rows={2}
                className="resize-none bg-background/50"
              />
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50">
            <CardHeader className="p-4 pb-0">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <PenLine className="w-4 h-4" />
                  محتوای مقاله (Markdown)
                </CardTitle>
                <span className="text-xs text-muted-foreground">
                  زمان مطالعه: {calculateReadTime(form.content)} دقیقه
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              {showPreview ? (
                <div className="prose prose-sm dark:prose-invert max-w-none min-h-[400px] p-4 rounded-lg bg-background/50">
                  <ReactMarkdown>{form.content}</ReactMarkdown>
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap gap-1 mb-3 p-2 rounded-lg bg-background/50 border border-border/50">
                    {toolbarButtons.map((btn) => (
                      <button
                        key={btn.label}
                        type="button"
                        onClick={btn.action}
                        title={btn.title}
                        className="px-2.5 py-1.5 text-xs font-mono rounded hover:bg-accent/50 transition-colors text-muted-foreground hover:text-foreground"
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                  <Textarea
                    name="content"
                    value={form.content}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, content: e.target.value }))
                    }
                    rows={20}
                    className="resize-none bg-background/50 font-mono text-sm leading-relaxed"
                    dir="auto"
                  />
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings2 className="w-4 h-4 ml-2" />
            تنظیمات مقاله
          </Button>

          {showSettings && (
            <>
              <Card className="border-border/50 bg-card/50">
                <CardContent className="p-4">
                  <Label className="text-sm font-medium mb-2 block">
                    تصویر کاور
                  </Label>
                  <Input
                    placeholder="URL تصویر"
                    value={form.coverImage}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, coverImage: e.target.value }))
                    }
                    dir="ltr"
                    className="text-xs bg-background/50"
                  />
                  {form.coverImage && (
                    <div className="mt-3 rounded-lg overflow-hidden border border-border/50">
                      <img
                        src={form.coverImage}
                        alt="کاور"
                        className="w-full h-32 object-cover"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/50">
                <CardContent className="p-4">
                  <Label className="text-sm font-medium mb-2 block">
                    دسته‌بندی
                  </Label>
                  <Select
                    value={form.categoryId}
                    onValueChange={(value) =>
                      setForm((prev) => ({ ...prev, categoryId: value }))
                    }
                  >
                    <SelectTrigger className="bg-background/50">
                      <SelectValue placeholder="انتخاب دسته‌بندی" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/50">
                <CardContent className="p-4">
                  <Label className="text-sm font-medium mb-2 block">
                    برچسب‌ها
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge
                        key={tag.id}
                        variant={
                          form.tagIds.includes(tag.id) ? "default" : "outline"
                        }
                        className={`cursor-pointer text-xs ${
                          form.tagIds.includes(tag.id)
                            ? "bg-primary text-primary-foreground"
                            : ""
                        }`}
                        onClick={() => toggleTag(tag.id)}
                      >
                        {tag.name}
                        {form.tagIds.includes(tag.id) && (
                          <X className="w-3 h-3 mr-1" />
                        )}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/50">
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">منتشر شود</Label>
                    <Switch
                      checked={form.published}
                      onCheckedChange={(checked) =>
                        setForm((prev) => ({ ...prev, published: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">مقاله ویژه</Label>
                    <Switch
                      checked={form.featured}
                      onCheckedChange={(checked) =>
                        setForm((prev) => ({ ...prev, featured: checked }))
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/50">
                <CardContent className="p-4 space-y-3">
                  <Label className="text-sm font-medium block">سئو</Label>
                  <div>
                    <span className="text-xs text-muted-foreground">عنوان سئو</span>
                    <Input
                      value={form.metaTitle}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, metaTitle: e.target.value }))
                      }
                      className="text-xs bg-background/50 mt-1"
                    />
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">توضیحات متا</span>
                    <Textarea
                      value={form.metaDesc}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, metaDesc: e.target.value }))
                      }
                      rows={2}
                      className="text-xs bg-background/50 resize-none mt-1"
                    />
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
