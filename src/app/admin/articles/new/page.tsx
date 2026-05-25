"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
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
  Plus,
  FileText,
  ImageIcon,
  Settings2,
  PenLine,
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

export default function NewArticlePage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isSaving, setIsSaving] = useState(false);
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
    const fetchMeta = async () => {
      try {
        const [catRes, tagRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/tags"),
        ]);
        setCategories(await catRes.json());
        setTags(await tagRes.json());
      } catch (error) {
        console.error("Fetch meta error:", error);
      }
    };
    fetchMeta();
  }, []);

  const generateSlug = useCallback((title: string) => {
    return title
      .toLowerCase()
      .replace(/[\u064B-\u065F\u0670]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^\u0600-\u06FFa-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }, []);

  const handleTitleChange = (title: string) => {
    setForm((prev) => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }));
  };

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
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          published: publish,
          readTime: calculateReadTime(form.content),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "خطا در ذخیره مقاله");
        return;
      }

      router.push("/admin/dashboard");
    } catch {
      alert("خطا در اتصال به سرور");
    } finally {
      setIsSaving(false);
    }
  };

  // Toolbar actions for markdown
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
    { label: "Num", action: () => insertMarkdown("\n1. "), title: "لیست شماره‌ای" },
    { label: "Quote", action: () => insertMarkdown("\n> "), title: "نقل قول" },
    { label: "Code", action: () => insertMarkdown("\n```\n", "\n```\n"), title: "کد" },
    { label: "Link", action: () => insertMarkdown("[", "](url)"), title: "لینک" },
    { label: "Img", action: () => insertMarkdown("![alt](", ")"), title: "تصویر" },
    { label: "---", action: () => insertMarkdown("\n---\n"), title: "جداکننده" },
  ];

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
          <h1 className="text-xl font-bold">مقاله جدید</h1>
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
            ذخیره پیش‌نویس
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
            منتشر کنید
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Title */}
          <Card className="border-border/50 bg-card/50">
            <CardContent className="p-4">
              <Input
                placeholder="عنوان مقاله..."
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="text-2xl font-bold border-0 bg-transparent p-0 h-auto focus-visible:ring-0 placeholder:text-muted-foreground/50"
                style={{ boxShadow: "none" }}
              />
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-muted-foreground">اسلاگ:</span>
                <Input
                  value={form.slug}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, slug: e.target.value }))
                  }
                  className="text-xs h-7 bg-transparent border-0 p-0 focus-visible:ring-0"
                  dir="ltr"
                  placeholder="article-slug"
                />
              </div>
            </CardContent>
          </Card>

          {/* Excerpt */}
          <Card className="border-border/50 bg-card/50">
            <CardContent className="p-4">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                خلاصه مقاله
              </label>
              <Textarea
                placeholder="یک خلاصه کوتاه از مقاله بنویسید (اختیاری)..."
                value={form.excerpt}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, excerpt: e.target.value }))
                }
                rows={2}
                className="resize-none bg-background/50"
              />
            </CardContent>
          </Card>

          {/* Content Editor */}
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
                  {/* Toolbar */}
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
                    placeholder="محتوای مقاله را با Markdown بنویسید..."
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
          {/* Settings Toggle */}
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
              {/* Cover Image */}
              <Card className="border-border/50 bg-card/50">
                <CardContent className="p-4">
                  <Label className="text-sm font-medium mb-2 block">
                    تصویر کاور
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="URL تصویر"
                      value={form.coverImage}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          coverImage: e.target.value,
                        }))
                      }
                      dir="ltr"
                      className="text-xs bg-background/50"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="shrink-0"
                      onClick={async () => {
                        const prompt = prompt("توضیح تصویر کاور:");
                        if (prompt) {
                          try {
                            const res = await fetch(
                              `/api/generate-image?prompt=${encodeURIComponent(prompt)}`,
                              { method: "POST" }
                            );
                            const data = await res.json();
                            if (data.url) {
                              setForm((prev) => ({
                                ...prev,
                                coverImage: data.url,
                              }));
                            }
                          } catch {
                            // Image generation not available
                          }
                        }
                      }}
                    >
                      <ImageIcon className="w-4 h-4" />
                    </Button>
                  </div>
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

              {/* Category */}
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

              {/* Tags */}
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

              {/* Publish Settings */}
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

              {/* SEO */}
              <Card className="border-border/50 bg-card/50">
                <CardContent className="p-4 space-y-3">
                  <Label className="text-sm font-medium block">سئو</Label>
                  <div>
                    <span className="text-xs text-muted-foreground">
                      عنوان سئو
                    </span>
                    <Input
                      placeholder="عنوان متا (اختیاری)"
                      value={form.metaTitle}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          metaTitle: e.target.value,
                        }))
                      }
                      className="text-xs bg-background/50 mt-1"
                    />
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">
                      توضیحات متا
                    </span>
                    <Textarea
                      placeholder="توضیحات متا (اختیاری)"
                      value={form.metaDesc}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          metaDesc: e.target.value,
                        }))
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
