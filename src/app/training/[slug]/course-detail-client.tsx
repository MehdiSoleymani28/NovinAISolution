"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Zap,
  CheckCircle2,
  BookOpen,
  GraduationCap,
  User,
  Home,
  ChevronLeft,
} from "lucide-react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";

interface SyllabusSection {
  title: string;
  lessons: number;
}

interface Course {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  category: string;
  level: string;
  duration: string;
  lessonsCount: number;
  price: string;
  features: string;
  syllabus: string;
  instructor: string;
  featured: boolean;
  order: number;
  createdAt: string;
}

const levelLabels: Record<string, { label: string; color: string }> = {
  beginner: { label: "مقدماتی", color: "text-green-500" },
  intermediate: { label: "متوسط", color: "text-blue-500" },
  advanced: { label: "پیشرفته", color: "text-purple-500" },
};

export default function CourseDetailClient({
  course,
  otherCourses,
}: {
  course: Course;
  otherCourses: Course[];
}) {
  const features: string[] = JSON.parse(course.features || "[]");
  const syllabus: SyllabusSection[] = JSON.parse(course.syllabus || "[]");
  const levelInfo = levelLabels[course.level] || levelLabels.beginner;

  return (
    <main className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="pt-24 pb-4 border-b border-border/50 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link
              href="/"
              className="hover:text-foreground transition-colors flex items-center gap-1"
            >
              <Home className="w-4 h-4" />
              خانه
            </Link>
            <ChevronLeft className="w-4 h-4" />
            <Link
              href="/training"
              className="hover:text-foreground transition-colors"
            >
              آموزش‌ها
            </Link>
            <ChevronLeft className="w-4 h-4" />
            <span className="text-foreground font-medium truncate">
              {course.title}
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Course Header */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="secondary" className="text-xs font-medium">
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
                <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                  {course.title}
                </h1>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {course.excerpt}
                </p>

                {/* Quick Stats */}
                <div className="flex flex-wrap items-center gap-6 mt-6 pt-6 border-t border-border/50">
                  <div className="flex items-center gap-2 text-sm">
                    <Zap className="w-4 h-4 text-primary" />
                    <span>{course.lessonsCount} درس</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <GraduationCap className="w-4 h-4 text-primary" />
                    <span>سطح {levelInfo.label}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-primary" />
                    <span>{course.instructor}</span>
                  </div>
                </div>
              </div>

              {/* Course Content (Markdown) */}
              <div className="prose prose-sm dark:prose-invert max-w-none mb-8">
                <ReactMarkdown>{course.content}</ReactMarkdown>
              </div>

              {/* Syllabus */}
              {syllabus.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-primary" />
                    سرفصل‌ها
                  </h2>
                  <div className="space-y-3">
                    {syllabus.map((section, index) => (
                      <div
                        key={section.title}
                        className="flex items-center gap-4 p-4 rounded-xl bg-card/50 border border-border/50 hover:border-primary/20 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <span className="text-primary font-bold text-sm">
                            {index + 1}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm">
                            {section.title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Zap className="w-3.5 h-3.5" />
                          <span>{section.lessons} درس</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="sticky top-24"
            >
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  {/* Price */}
                  <div className="text-center mb-6">
                    <Badge
                      className="text-lg px-4 py-1 bg-primary/10 text-primary border-0 font-bold"
                    >
                      {course.price}
                    </Badge>
                  </div>

                  {/* CTA */}
                  <Button
                    size="lg"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mb-4"
                    asChild
                  >
                    <Link href="/#contact">
                      ثبت‌نام در دوره
                      <ArrowLeft className="w-5 h-5 mr-2" />
                    </Link>
                  </Button>

                  <p className="text-center text-xs text-muted-foreground mb-6">
                    برای ثبت‌نام با ما تماس بگیرید
                  </p>

                  {/* Course Info */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-sm py-2 border-b border-border/50">
                      <span className="text-muted-foreground">تعداد درس</span>
                      <span className="font-medium">{course.lessonsCount} درس</span>
                    </div>
                    <div className="flex items-center justify-between text-sm py-2 border-b border-border/50">
                      <span className="text-muted-foreground">مدت دوره</span>
                      <span className="font-medium">{course.duration}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm py-2 border-b border-border/50">
                      <span className="text-muted-foreground">سطح</span>
                      <span className="font-medium">{levelInfo.label}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm py-2 border-b border-border/50">
                      <span className="text-muted-foreground">مدرس</span>
                      <span className="font-medium">{course.instructor}</span>
                    </div>
                  </div>

                  {/* Features */}
                  {features.length > 0 && (
                    <div>
                      <h3 className="font-bold text-sm mb-3">
                        ویژگی‌های دوره
                      </h3>
                      <div className="space-y-2">
                        {features.map((feature) => (
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
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Need Help */}
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm mt-4">
                <CardContent className="p-6 text-center">
                  <h3 className="font-bold text-sm mb-2">
                    سؤالی دارید؟
                  </h3>
                  <p className="text-xs text-muted-foreground mb-4">
                    با ما تماس بگیرید تا راهنماییتون کنیم
                  </p>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link href="/#contact">تماس با ما</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Other Courses */}
        {otherCourses.length > 0 && (
          <section className="mt-16 pt-16 border-t border-border/50">
            <h2 className="text-2xl font-bold mb-8">سایر دوره‌ها</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {otherCourses.map((other) => {
                const otherLevel = levelLabels[other.level] || levelLabels.beginner;
                return (
                  <Link key={other.id} href={`/training/${other.slug}`}>
                    <Card className="group h-full border-border/50 bg-card/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 cursor-pointer">
                      <CardContent className="p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge
                            variant="secondary"
                            className="text-xs"
                          >
                            {other.category}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={`text-xs ${otherLevel.color}`}
                          >
                            {otherLevel.label}
                          </Badge>
                        </div>
                        <h3 className="font-bold mb-2 group-hover:text-primary transition-colors">
                          {other.title}
                        </h3>
                        <p className="text-muted-foreground text-xs line-clamp-2 mb-3">
                          {other.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Zap className="w-3.5 h-3.5" />
                            <span>{other.lessonsCount} درس</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{other.duration}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
