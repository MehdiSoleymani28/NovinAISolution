"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Wrench,
  MessageSquare,
  FileText,
  Image,
  Search,
  BarChart3,
  ArrowLeft,
  Star,
} from "lucide-react";
import { motion } from "framer-motion";

const tools = [
  {
    icon: MessageSquare,
    name: "چت‌بات هوشمند",
    description:
      "ساخت چت‌بات‌های سفارشی با قابلیت درک زبان طبیعی فارسی. پاسخگویی خودکار به مشتریان و پشتیبانی ۲۴ ساعته.",
    tag: "پرطرفدار",
    tagColor: "bg-orange-500/10 text-orange-500",
    category: "NLP",
  },
  {
    icon: FileText,
    name: "تحلیل‌گر اسناد",
    description:
      "استخراج خودکار اطلاعات از اسناد، فاکتورها و قراردادها. پردازش هوشمند متن با دقت بالا و سرعت بالا.",
    tag: "جدید",
    tagColor: "bg-green-500/10 text-green-500",
    category: "Document AI",
  },
  {
    icon: Image,
    name: "بینایی ماشین",
    description:
      "تشخیص اشیاء، طبقه‌بندی تصاویر و تحلیل ویدیو. کاربرد در صنایع تولید، امنیت و پزشکی.",
    tag: "حرفه‌ای",
    tagColor: "bg-purple-500/10 text-purple-500",
    category: "Computer Vision",
  },
  {
    icon: Search,
    name: "موتور جستجوی هوشمند",
    description:
      "جستجوی معنایی و تلفیقی در پایگاه دانش سازمان. یافتن سریع و دقیق اطلاعات از میان هزاران سند.",
    tag: "سازمانی",
    tagColor: "bg-blue-500/10 text-blue-500",
    category: "Search",
  },
  {
    icon: BarChart3,
    name: "داشبورد تحلیلی",
    description:
      "تحلیل پیش‌بینی‌کننده داده‌های کسب‌وکار با نمایش بصری جذاب. پیش‌بینی فروش، رفتار مشتری و ترندهای بازار.",
    tag: "کاربردی",
    tagColor: "bg-teal-500/10 text-teal-500",
    category: "Analytics",
  },
  {
    icon: Wrench,
    name: "API Builder",
    description:
      "ساخت API هوش مصنوعی بدون کدنویسی. اتصال آسان مدل‌های AI به نرم‌افزارها و سرویس‌های موجود.",
    tag: "بدون کد",
    tagColor: "bg-pink-500/10 text-pink-500",
    category: "No-Code",
  },
];

export function ToolsSection() {
  return (
    <section id="tools" className="relative py-20 sm:py-28">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/3 rounded-full blur-3xl" />
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
            ابزارها
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            ابزارهای <span className="text-gradient">هوشمند AI</span>
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground text-lg">
            ابزارهای آماده و قابل سفارشی‌سازی برای هوشمندسازی سریع کسب‌وکار شما
          </p>
        </motion.div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              <Card className="group h-full border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                      <tool.icon className="w-5 h-5 text-primary" />
                    </div>
                    <Badge
                      variant="secondary"
                      className={`text-[10px] font-medium ${tool.tagColor}`}
                    >
                      {tool.tag}
                    </Badge>
                  </div>

                  {/* Name & Category */}
                  <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">
                    {tool.name}
                  </h3>
                  <span className="text-xs text-muted-foreground font-medium">
                    {tool.category}
                  </span>

                  {/* Description */}
                  <p className="text-muted-foreground text-sm leading-relaxed mt-3 mb-4">
                    {tool.description}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500"
                        />
                      ))}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary hover:text-primary hover:bg-primary/5 text-xs"
                    >
                      بیشتر بدانید
                      <ArrowLeft className="w-3 h-3 mr-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
