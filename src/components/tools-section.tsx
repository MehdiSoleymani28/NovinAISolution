"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Workflow,
  MessageSquare,
  FileText,
  Mail,
  BarChart3,
  Bot,
  ArrowLeft,
  Star,
} from "lucide-react";
import { motion } from "framer-motion";

const tools = [
  {
    icon: Workflow,
    name: "ورکفلو اتوماسیون ایمیل",
    description:
      "دریافت ایمیل‌ها رو خودکار монитор کنید، با AI طبقه‌بندی و پاسخ اولیه بدهید. اتصال Gmail به CRM و ایجاد تیکت خودکار برای تیم پشتیبانی.",
    tag: "پرطرفدار",
    tagColor: "bg-orange-500/10 text-orange-500",
    category: "Make / n8n",
  },
  {
    icon: MessageSquare,
    name: "چت‌بات پشتیبانی هوشمند",
    description:
      "چت‌باتی که با دانش محصولات شما آموزش دیده و ۲۴ ساعته به مشتریان پاسخ می‌دهد. اتصال به واتساپ، تلگرام و وب‌سایت با یک دستیار یکپارچه.",
    tag: "پرطرفدار",
    tagColor: "bg-orange-500/10 text-orange-500",
    category: "AI Agent",
  },
  {
    icon: FileText,
    name: "تولید خودکار محتوا",
    description:
      "از ایده تا محتوای نهایی. تولید خودکار پست شبکه‌های اجتماعی، مقالات بلاگ، خبرنامه و کپشن محصول با تنظیمات لحن و سبک سفارشی.",
    tag: "کاربردی",
    tagColor: "bg-green-500/10 text-green-500",
    category: "GPT / Claude",
  },
  {
    icon: Mail,
    name: "دستیار ایمیل هوشمند",
    description:
      "خواندن خودکار ایمیل‌های دریافتی، خلاصه‌سازی، اولویت‌بندی و پیشنهاد پاسخ. صرفه‌جویی ساعت‌ها در روز برای مدیریت صندوق ورودی.",
    tag: "جدید",
    tagColor: "bg-blue-500/10 text-blue-500",
    category: "AI Workflow",
  },
  {
    icon: BarChart3,
    name: "داشبورد گزارش‌دهی خودکار",
    description:
      "جمع‌آوری خودکار داده‌ها از منابع مختلف و تولید گزارش‌های روزانه، هفتگی و ماهانه. تحلیل ترندها و ارسال هشدارهای هوشمند.",
    tag: "سازمانی",
    tagColor: "bg-purple-500/10 text-purple-500",
    category: "Analytics",
  },
  {
    icon: Bot,
    name: "دستیار اسناد هوشمند",
    description:
      "آپلود قراردادها، فاکتورها و اسناد سازمانی و سوال‌وجواب از روی آنها. جستجوی معنایی در هزاران سند و استخراج خودکار اطلاعات کلیدی.",
    tag: "حرفه‌ای",
    tagColor: "bg-teal-500/10 text-teal-500",
    category: "RAG System",
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
            ورکفلوهای آماده
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            ورکفلوهای <span className="text-gradient">آماده اتوماسیون</span>
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground text-lg">
            راهکارهای آماده و قابل سفارشی‌سازی برای خودکارسازی سریع فرآیندهای کسب‌وکار شما
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
                      جزئیات بیشتر
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
