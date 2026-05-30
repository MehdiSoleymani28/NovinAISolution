"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  GraduationCap,
  Clock,
  Zap,
} from "lucide-react";

interface Course {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string;
  level: string;
  duration: string;
  lessonsCount: number;
  price: string;
  published: boolean;
  featured: boolean;
  order: number;
  createdAt: string;
}

const levelLabels: Record<string, string> = {
  beginner: "مقدماتی",
  intermediate: "متوسط",
  advanced: "پیشرفته",
};

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchCourses = async () => {
    try {
      const res = await fetch("/api/courses");
      if (res.ok) {
        const data = await res.json();
        setCourses(data);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const togglePublish = async (slug: string, published: boolean) => {
    try {
      const res = await fetch(`/api/courses/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !published }),
      });
      if (res.ok) {
        setCourses((prev) =>
          prev.map((c) =>
            c.slug === slug ? { ...c, published: !published } : c
          )
        );
      }
    } catch (error) {
      console.error("Error toggling publish:", error);
    }
  };

  const deleteCourse = async (slug: string) => {
    if (!confirm("آیا مطمئن هستید که می‌خواهید این دوره را حذف کنید؟")) return;
    setDeleting(slug);
    try {
      const res = await fetch(`/api/courses/${slug}`, { method: "DELETE" });
      if (res.ok) {
        setCourses((prev) => prev.filter((c) => c.slug !== slug));
      }
    } catch (error) {
      console.error("Error deleting course:", error);
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-primary" />
            مدیریت دوره‌ها
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            ایجاد، ویرایش و مدیریت دوره‌های آموزشی
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90" asChild>
          <Link href="/admin/courses/new">
            <Plus className="w-4 h-4 ml-2" />
            دوره جدید
          </Link>
        </Button>
      </div>

      {courses.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <GraduationCap className="w-16 h-16 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-semibold mb-2">هنوز دوره‌ای ایجاد نشده</h3>
            <p className="text-muted-foreground text-sm mb-4">
              اولین دوره آموزشی خود را بسازید
            </p>
            <Button className="bg-primary hover:bg-primary/90" asChild>
              <Link href="/admin/courses/new">
                <Plus className="w-4 h-4 ml-2" />
                ایجاد دوره
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {courses.map((course) => (
            <Card
              key={course.id}
              className="border-border/50 hover:border-primary/20 transition-colors"
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold truncate">{course.title}</h3>
                      {course.featured && (
                        <Badge className="text-xs bg-primary/10 text-primary border-0">
                          ویژه
                        </Badge>
                      )}
                      <Badge
                        variant={course.published ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {course.published ? "منتشر شده" : "پیش‌نویس"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{course.category}</span>
                      <span>{levelLabels[course.level] || course.level}</span>
                      <div className="flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        <span>{course.lessonsCount} درس</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{course.duration}</span>
                      </div>
                      <span>ترتیب: {course.order}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => togglePublish(course.slug, course.published)}
                      title={course.published ? "لغو انتشار" : "انتشار"}
                    >
                      {course.published ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                      <Link href={`/admin/courses/edit/${course.slug}`}>
                        <Pencil className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => deleteCourse(course.slug)}
                      disabled={deleting === course.slug}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
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
