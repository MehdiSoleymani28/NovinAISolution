"use client";

import {
  Workflow,
  Bot,
  Settings2,
  BarChart3,
  Wrench,
  GraduationCap,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const services = [
  {
    icon: Workflow,
    title: "طراحی ورکفلو هوشمند",
    description:
      "طراحی و پیاده‌سازی جریان‌های کاری خودکار با ابزارهای AI. از اتصال اپلیکیشن‌ها تا ایجاد پایپ‌لاین‌های کاری هوشمند که کارهای تکراری را خودکار و سرعت عمل سازمان را افزایش می‌دهند.",
    features: ["اتوماسیون فرآیندها", "اتصال اپلیکیشن‌ها", "پایپ‌لاین هوشمند"],
  },
  {
    icon: Bot,
    title: "ساخت دستیار هوشمند",
    description:
      "طراحی و پیاده‌سازی دستیارهای AI سفارشی برای کسب‌وکار شما. از چت‌بات پشتیبانی مشتری تا دستیار تولید محتوا و تحلیل داده، دستیار هوشمند متناسب با نیاز شما طراحی و پیاده‌سازی می‌کنیم.",
    features: ["AI Agent", "چت‌بات سفارشی", "دستیار تولید محتوا"],
  },
  {
    icon: Settings2,
    title: "پیاده‌سازی ابزارهای AI",
    description:
      "استقرار و تنظیم ابزارهای هوش مصنوعی موجود در سازمان شما. از ChatGPT و Claude تا Make و n8n، مناسب‌ترین ابزارها را انتخاب و متناسب با نیاز شما پیکربندی می‌کنیم.",
    features: ["انتخاب ابزار", "پیکربندی", "یکپارچه‌سازی"],
  },
  {
    icon: BarChart3,
    title: "اتوماسیون گزارش‌دهی",
    description:
      "خودکارسازی تولید گزارش‌ها، داشبوردها و تحلیل‌ها با AI. داده‌های سازمان خود را به بینش‌های عملیاتی تبدیل کنید بدون نیاز به تحلیلگر دستی و ساعت‌ها کار تکراری.",
    features: ["داشبورد خودکار", "گزارش AI", "هشدار هوشمند"],
  },
  {
    icon: Wrench,
    title: "مشاوره و نیازسنجی",
    description:
      "تحلیل دقیق فرآیندهای فعلی سازمان شما و شناسایی نقاط قابل اتوماسیون. نقشه راه عملی و مرحله‌به‌مرحله برای پیاده‌سازی AI با کمترین ریسک و بازگشت سرمایه مناسب.",
    features: ["تحلیل فرآیندها", "نقشه راه AI", "محاسبه ROI"],
  },
  {
    icon: GraduationCap,
    title: "آموزش عملی ابزارهای AI",
    description:
      "آموزش کاربردی ابزارهای هوش مصنوعی به تیم شما. از کار با ChatGPT و Claude تا ساخت ورکفلو در Make و n8n، تیم شما را برای استفاده حرفه‌ای از AI آماده می‌کنیم.",
    features: ["آموزش تیم", "ورکشاپ عملی", "پشتیبانی مستمر"],
  },
];

export function ServicesSection() {
  return (
    <section id="services" className="relative py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            خدمات ما
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            از <span className="text-gradient">کار دستی</span> تا اتوماسیون هوشمند
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground text-lg">
            با ابزارهای هوش مصنوعی، فرآیندهای سازمان خود را خودکار کنید و زمان بیشتری برای کارهای مهم‌تر داشته باشید
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="group h-full border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 overflow-hidden">
                <CardContent className="p-6">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                    <service.icon className="w-6 h-6 text-primary" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {service.description}
                  </p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2">
                    {service.features.map((feature) => (
                      <span
                        key={feature}
                        className="px-2.5 py-1 rounded-md bg-primary/5 text-primary text-xs font-medium"
                      >
                        {feature}
                      </span>
                    ))}
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
