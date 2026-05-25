"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  Workflow,
  Settings,
  Zap,
  ArrowLeft,
  Clock,
  Signal,
} from "lucide-react";
import { motion } from "framer-motion";

const tutorials = [
  {
    category: "مقدماتی",
    icon: MessageSquare,
    title: "کار حرفه‌ای با ChatGPT و Claude",
    description:
      "یادگیری پرامپت‌نویسی حرفه‌ای و استفاده مؤثر از مدل‌های زبانی. از نوشتن پرامپت‌های دقیق تا ساخت سیستم‌های پرامپت زنجیره‌ای برای خودکارسازی وظایف روزانه.",
    lessons: 18,
    duration: "۸ ساعت",
    level: "مقدماتی",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    category: "عملی",
    icon: Workflow,
    title: "ساخت ورکفلو با Make و n8n",
    description:
      "آموزش عملی ساخت جریان‌های کاری خودکار. از اتصال Gmail به Slack تا ساخت پایپ‌لاین‌های پیچیده پردازش داده، هر ورکفلی که نیاز دارید رو خودتان بسازید.",
    lessons: 24,
    duration: "۱۲ ساعت",
    level: "عملی",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    category: "پیشرفته",
    icon: Settings,
    title: "ساخت AI Agent سفارشی",
    description:
      "طراحی و پیاده‌سازی دستیارهای هوشمند اختصاصی. از ساخت Agent با LangChain تا پیاده‌سازی RAG و ابزارهای اختصاصی، دستیار AI متناسب با کسب‌وکار خود بسازید.",
    lessons: 30,
    duration: "۱۸ ساعت",
    level: "پیشرفته",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    category: "کاربردی",
    icon: Zap,
    title: "اتوماسیون کسب‌وکار عملی",
    description:
      "پیاده‌سازی واقعی اتوماسیون در سناریوهای مختلف: تولید خودکار محتوا، پاسخگویی هوشمند مشتری، گزارش‌دهی خودکار و مدیریت هوشمند ایمیل‌ها و اسناد.",
    lessons: 20,
    duration: "۱۰ ساعت",
    level: "کاربردی",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
];

export function TutorialsSection() {
  return (
    <section id="tutorials" className="relative py-20 sm:py-28">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-l from-transparent via-primary/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-l from-transparent via-primary/20 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            آموزش‌ها
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            ابزارهای AI رو <span className="text-gradient">عملی یاد بگیرید</span>
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground text-lg">
            نه تئوری، نه ریاضیات. آموزش عملی ابزارهایی که همین امروز به درد کسب‌وکار شما می‌خورند
          </p>
        </motion.div>

        {/* Tutorials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tutorials.map((tutorial, index) => (
            <motion.div
              key={tutorial.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="group h-full border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className={`w-14 h-14 rounded-xl ${tutorial.bgColor} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <tutorial.icon
                        className={`w-7 h-7 ${tutorial.color}`}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge
                          variant="secondary"
                          className="text-xs font-medium"
                        >
                          {tutorial.category}
                        </Badge>
                      </div>
                      <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                        {tutorial.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                        {tutorial.description}
                      </p>

                      {/* Meta */}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Zap className="w-3.5 h-3.5" />
                          <span>{tutorial.lessons} درس</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{tutorial.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Signal className="w-3.5 h-3.5" />
                          <span>{tutorial.level}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Button
            variant="outline"
            size="lg"
            className="border-primary/30 hover:bg-primary/5 px-8"
          >
            مشاهده همه آموزش‌ها
            <ArrowLeft className="w-4 h-4 mr-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
