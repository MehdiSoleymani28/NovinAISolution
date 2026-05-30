"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Save, Plus, X, GraduationCap } from "lucide-react";

export default function NewCoursePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "مقدماتی",
    level: "beginner",
    duration: "۸ ساعت",
    lessonsCount: 0,
    price: "رایگان",
    instructor: "تیم نوین ای‌آی سولوشن",
    published: false,
    featured: false,
    order: 0,
    metaTitle: "",
    metaDesc: "",
  });
  const [features, setFeatures] = useState<string[]>([]);
  const [syllabus, setSyllabus] = useState<{ title: string; lessons: number }[]>([]);
  const [newFeature, setNewFeature] = useState("");
  const [newSyllabusTitle, setNewSyllabusTitle] = useState("");
  const [newSyllabusLessons, setNewSyllabusLessons] = useState(1);

  const generateSlug = (title: string) => {
    return title
      .replace(/\s+/g, "-")
      .replace(/[^\u0600-\u06FFa-zA-Z0-9-]/g, "")
      .toLowerCase();
  };

  const handleTitleChange = (title: string) => {
    setForm((prev) => ({ ...prev, title, slug: generateSlug(title) }));
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFeatures((prev) => [...prev, newFeature.trim()]);
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setFeatures((prev) => prev.filter((_, i) => i !== index));
  };

  const addSyllabus = () => {
    if (newSyllabusTitle.trim()) {
      setSyllabus((prev) => [
        ...prev,
        { title: newSyllabusTitle.trim(), lessons: newSyllabusLessons },
      ]);
      setNewSyllabusTitle("");
      setNewSyllabusLessons(1);
    }
  };

  const removeSyllabus = (index: number) => {
    setSyllabus((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.content) {
      alert("عنوان و محتوای دوره الزامی است");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          features,
          syllabus,
        }),
      });

      if (res.ok) {
        router.push("/admin/courses");
      } else {
        const data = await res.json();
        alert(data.error || "خطا در ایجاد دوره");
      }
    } catch (error) {
      console.error("Error creating course:", error);
      alert("خطا در ایجاد دوره");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/courses">
            <ArrowRight className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-primary" />
            دوره جدید
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            ایجاد دوره آموزشی جدید
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">اطلاعات پایه</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">عنوان دوره *</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="مثلاً: کار حرفه‌ای با ChatGPT"
                />
              </div>
              <div>
                <Label htmlFor="slug">نامک (Slug)</Label>
                <Input
                  id="slug"
                  value={form.slug}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, slug: e.target.value }))
                  }
                  placeholder="chatgpt-professional"
                  dir="ltr"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="excerpt">خلاصه دوره</Label>
              <Textarea
                id="excerpt"
                value={form.excerpt}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, excerpt: e.target.value }))
                }
                placeholder="یک خلاصه کوتاه از دوره..."
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="content">محتوای دوره (Markdown) *</Label>
              <Textarea
                id="content"
                value={form.content}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, content: e.target.value }))
                }
                placeholder="محتوای کامل دوره با فرمت Markdown..."
                rows={15}
                dir="ltr"
              />
            </div>
          </CardContent>
        </Card>

        {/* Course Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">جزئیات دوره</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <Label>دسته‌بندی</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) =>
                    setForm((prev) => ({ ...prev, category: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="مقدماتی">مقدماتی</SelectItem>
                    <SelectItem value="عملی">عملی</SelectItem>
                    <SelectItem value="پیشرفته">پیشرفته</SelectItem>
                    <SelectItem value="کاربردی">کاربردی</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>سطح</Label>
                <Select
                  value={form.level}
                  onValueChange={(v) =>
                    setForm((prev) => ({ ...prev, level: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">مقدماتی</SelectItem>
                    <SelectItem value="intermediate">متوسط</SelectItem>
                    <SelectItem value="advanced">پیشرفته</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="duration">مدت دوره</Label>
                <Input
                  id="duration"
                  value={form.duration}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, duration: e.target.value }))
                  }
                  placeholder="۸ ساعت"
                />
              </div>
              <div>
                <Label htmlFor="lessonsCount">تعداد درس</Label>
                <Input
                  id="lessonsCount"
                  type="number"
                  value={form.lessonsCount}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      lessonsCount: parseInt(e.target.value) || 0,
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="price">قیمت</Label>
                <Input
                  id="price"
                  value={form.price}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, price: e.target.value }))
                  }
                  placeholder="رایگان"
                />
              </div>
              <div>
                <Label htmlFor="order">ترتیب نمایش</Label>
                <Input
                  id="order"
                  type="number"
                  value={form.order}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      order: parseInt(e.target.value) || 0,
                    }))
                  }
                />
              </div>
            </div>
            <div>
              <Label htmlFor="instructor">مدرس</Label>
              <Input
                id="instructor"
                value={form.instructor}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, instructor: e.target.value }))
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">ویژگی‌های دوره</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input value={feature} readOnly className="flex-1" />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFeature(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="مثلاً: دسترسی مادام‌العمر"
                className="flex-1"
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
              />
              <Button type="button" variant="outline" size="icon" onClick={addFeature}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Syllabus */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">سرفصل‌ها</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {syllabus.map((section, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input value={section.title} readOnly className="flex-1" />
                <Input
                  value={`${section.lessons} درس`}
                  readOnly
                  className="w-24"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeSyllabus(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <Input
                value={newSyllabusTitle}
                onChange={(e) => setNewSyllabusTitle(e.target.value)}
                placeholder="عنوان بخش"
                className="flex-1"
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addSyllabus())
                }
              />
              <Input
                type="number"
                value={newSyllabusLessons}
                onChange={(e) =>
                  setNewSyllabusLessons(parseInt(e.target.value) || 1)
                }
                className="w-20"
                min={1}
              />
              <Button type="button" variant="outline" size="icon" onClick={addSyllabus}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* SEO & Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">SEO و تنظیمات</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="metaTitle">عنوان SEO</Label>
              <Input
                id="metaTitle"
                value={form.metaTitle}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, metaTitle: e.target.value }))
                }
                placeholder="عنوان برای موتورهای جستجو"
              />
            </div>
            <div>
              <Label htmlFor="metaDesc">توضیحات SEO</Label>
              <Textarea
                id="metaDesc"
                value={form.metaDesc}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, metaDesc: e.target.value }))
                }
                placeholder="توضیحات برای موتورهای جستجو"
                rows={2}
              />
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch
                  checked={form.published}
                  onCheckedChange={(v) =>
                    setForm((prev) => ({ ...prev, published: v }))
                  }
                />
                <Label>منتشر شده</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={form.featured}
                  onCheckedChange={(v) =>
                    setForm((prev) => ({ ...prev, featured: v }))
                  }
                />
                <Label>ویژه</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex items-center gap-3">
          <Button
            type="submit"
            className="bg-primary hover:bg-primary/90"
            disabled={saving}
          >
            <Save className="w-4 h-4 ml-2" />
            {saving ? "در حال ذخیره..." : "ذخیره دوره"}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/courses">انصراف</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
