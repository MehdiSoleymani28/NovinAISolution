"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Clock,
  Signal,
  Zap,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Users,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";

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
  features: string;
  instructor: string;
  featured: boolean;
  order: number;
}

const levelLabels: Record<string, { label: string; color: string; bgColor: string }> = {
  beginner: { label: "مقدماتی", color: "text-green-500", bgColor: "bg-green-500/10" },
  intermediate: { label: "متوسط", color: "text-blue-500", bgColor: "bg-blue-500/10" },
  advanced: { label: "پیشرفته", color: "text-purple-500", bgColor: "bg-purple-500/10" },
};

const categoryIcons: Record<string, string> = {
  "مقدماتی": "💬",
  "عملی": "⚡",
  "پیشرفته": "🔧",
  "کاربردی": "🚀",
};

export default function TrainingPageClient({ courses }: { courses: Course[] }) {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <GraduationCap className="w-4 h-4" />
              آموزش‌ها
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              ابزارهای AI رو{" "}
              <span className="text-gradient">عملی یاد بگیرید</span>
            </h1>
            <p className="max-w-2xl mx-auto text-muted-foreground text-lg leading-relaxed">
              نه تئوری، نه ریاضیات. آموزش عملی ابزارهایی که همین امروز به درد
              کسب‌وکار شما می‌خورند. هر دوره با پروژه واقعی و پشتیبانی مدرس.
            </p>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-8 mb-16"
          >
            {[
              { icon: BookOpen, value: courses.length.toString(), label: "دوره آموزشی" },
              { icon: Zap, value: courses.reduce((sum, c) => sum + c.lessonsCount, 0).toString(), label: "درس عملی" },
              { icon: Users, value: "۲۴/۷", label: "پشتیبانی" },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-lg font-bold">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {courses.length === 0 ? (
            <div className="text-center py-20">
              <GraduationCap className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                هنوز دوره‌ای منتشر نشده
              </h3>
              <p className="text-muted-foreground">
                به‌زودی دوره‌های جدید اضافه خواهند شد.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.map((course, index) => {
                const levelInfo = levelLabels[course.level] || levelLabels.beginner;
                const features: string[] = JSON.parse(course.features || "[]");
                const categoryIcon = categoryIcons[course.category] || "📚";

                return (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Link href={`/training/${course.slug}`}>
                      <Card className="group h-full border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 cursor-pointer">
                        <CardContent className="p-6 sm:p-8">
                          {/* Header */}
                          <div className="flex items-start gap-4 mb-5">
                            <div
                              className={`w-14 h-14 rounded-xl ${levelInfo.bgColor} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 text-2xl`}
                            >
                              {categoryIcon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge
                                  variant="secondary"
                                  className="text-xs font-medium"
                                >
                                  {course.category}
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${levelInfo.color} border-current/20`}
                                >
                                  {levelInfo.label}
                                </Badge>
                                {course.featured && (
                                  <Badge className="text-xs bg-primary/10 text-primary border-0">
                                    ویژه
                                  </Badge>
                                )}
                              </div>
                              <h3 className="text-lg sm:text-xl font-bold group-hover:text-primary transition-colors">
                                {course.title}
                              </h3>
                            </div>
                          </div>

                          {/* Excerpt */}
                          <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                            {course.excerpt}
                          </p>

                          {/* Features Preview */}
                          {features.length > 0 && (
                            <div className="space-y-2 mb-5">
                              {features.slice(0, 3).map((feature) => (
                                <div
                                  key={feature}
                                  className="flex items-center gap-2 text-sm"
                                >
                                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                                  <span className="text-muted-foreground">
                                    {feature}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Meta & CTA */}
                          <div className="flex items-center justify-between pt-4 border-t border-border/50">
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Zap className="w-3.5 h-3.5" />
                                <span>{course.lessonsCount} درس</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                <span>{course.duration}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="secondary"
                                className="bg-primary/10 text-primary font-semibold"
                              >
                                {course.price}
                              </Badge>
                              <ArrowLeft className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 border-t border-border bg-card/30">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            نیاز به مشاوره دارید؟
          </h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            اگر مطمئن نیستید کدام دوره مناسب شماست، با ما تماس بگیرید. رایگان
            نیازسنجی می‌کنیم و بهترین مسیر یادگیری رو بهتون پیشنهاد می‌دیم.
          </p>
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
            asChild
          >
            <Link href="/#contact">
              نیازسنجی رایگان
              <ArrowLeft className="w-5 h-5 mr-2" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
