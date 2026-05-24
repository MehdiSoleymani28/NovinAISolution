"use client";

import {
  Brain,
  Cpu,
  BarChart3,
  Workflow,
  ShieldCheck,
  Lightbulb,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const services = [
  {
    icon: Brain,
    title: "مشاوره استراتژیک AI",
    description:
      "تحلیل نیازهای کسب‌وکار شما و تدوین استراتژی هوش مصنوعی سفارشی. ما به شما کمک می‌کنیم بهترین مسیر را برای پیاده‌سازی AI در سازمان خود پیدا کنید و از سرمایه‌گذاری هوشمند اطمینان حاصل نمایید.",
    features: ["تحلیل نیازسنجی", "نقشه راه AI", "ارزیابی ROI"],
  },
  {
    icon: Cpu,
    title: "زیرساخت هوش مصنوعی",
    description:
      "طراحی و پیاده‌سازی زیرساخت‌های مقیاس‌پذیر AI شامل سرورها، پایگاه‌داده‌ها، خطوط لوله داده و سیستم‌های استقرار مدل. زیرساختی که با رشد کسب‌وکار شما رشد می‌کند.",
    features: ["معماری ابری", "ML Pipeline", "MLOps"],
  },
  {
    icon: Workflow,
    title: "اتوماسیون فرآیندها",
    description:
      "خودکارسازی فرآیندهای تکراری و زمان‌بر با استفاده از هوش مصنوعی. از پردازش اسناد گرفته تا تصمیم‌گیری خودکار، فرآیندهای شما هوشمند و کارآمد می‌شوند.",
    features: ["RPA هوشمند", "پردازش NLP", "تصمیم‌گیری خودکار"],
  },
  {
    icon: BarChart3,
    title: "تحلیل داده و بینش",
    description:
      "تبدیل داده‌های خام شما به بینش‌های عملیاتی با استفاده از یادگیری ماشین و تحلیل پیشرفته. داشبوردهای هوشمند و گزارش‌های تحلیلی برای تصمیم‌گیری بهتر.",
    features: ["داشبورد هوشمند", "پیش‌بینی ترندها", "تحلیل رفتار"],
  },
  {
    icon: ShieldCheck,
    title: "امنیت و حاکمیت AI",
    description:
      "تضمین امنیت، حریم خصوصی و انطباق مقرراتی سیستم‌های هوش مصنوعی شما. پیاده‌سازی چارچوب‌های حاکمیت AI برای استفاده مسئولانه و مطمئن از فناوری.",
    features: ["AI Governance", "حریم خصوصی", "انطباق مقررات"],
  },
  {
    icon: Lightbulb,
    title: "پروتوتایپ و MVP",
    description:
      "ساخت سریع نمونه اولیه و MVP محصول هوش مصنوعی شما. از ایده تا محصول قابل عرضه در کوتاه‌ترین زمان ممکن، با تمرکز بر ارزش‌آفرینی سریع.",
    features: ["Fast MVP", "آزمون A/B", "بهینه‌سازی"],
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
            راهکارهای <span className="text-gradient">هوش مصنوعی</span> برای کسب‌وکار شما
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground text-lg">
            مجموعه‌ای کامل از خدمات مشاوره، زیرساخت‌سازی و آموزش برای تحول دیجیتال سازمان شما
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
