"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Mail,
  MapPin,
  Send,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";

const contactInfo = [
  {
    icon: Mail,
    title: "ایمیل",
    value: "info@novinaisolution.com",
    description: "پاسخگویی در اسرع وقت",
  },
  {
    icon: MapPin,
    title: "آدرس",
    value: "تهران، ایران",
    description: "مشاوره آنلاین و حضوری با هماهنگی قبلی",
  },
];

export function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <section id="contact" className="relative py-20 sm:py-28">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-l from-transparent via-primary/20 to-transparent" />
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
            تماس با ما
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            نیازسنجی رایگان <span className="text-gradient">اتوماسیون</span>
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground text-lg">
            بگویید کدام فرآیندهای سازمانتان دستی و تکراری است، تا راهکار اتوماسیون را با هم بررسی کنیم
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-3"
          >
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6 sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        نام و نام خانوادگی
                      </label>
                      <Input
                        placeholder="نام شما"
                        required
                        className="bg-background/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        ایمیل
                      </label>
                      <Input
                        type="email"
                        placeholder="email@example.com"
                        dir="ltr"
                        required
                        className="bg-background/50 text-left"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        شماره تماس
                      </label>
                      <Input
                        type="tel"
                        placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                        required
                        className="bg-background/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        نام شرکت
                      </label>
                      <Input
                        placeholder="نام شرکت شما"
                        className="bg-background/50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      توضیحات پروژه
                    </label>
                    <Textarea
                      placeholder="کدام فرآیندهای سازمانتان دستی و تکراری است؟ چه کارهایی دوست دارید خودکار شوند؟"
                      rows={5}
                      required
                      className="bg-background/50 resize-none"
                    />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground blue-glow"
                    disabled={isSubmitting || isSubmitted}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                        در حال ارسال...
                      </>
                    ) : isSubmitted ? (
                      <>
                        <CheckCircle className="w-4 h-4 ml-2" />
                        پیام شما ارسال شد!
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 ml-2" />
                        ارسال درخواست نیازسنجی
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2 space-y-4"
          >
            {contactInfo.map((info) => (
              <Card
                key={info.title}
                className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/20 transition-all duration-300"
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <info.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm">{info.title}</h3>
                      <p className="text-foreground font-medium mt-1" dir="rtl">
                        {info.value}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {info.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* CTA Card */}
            <Card className="border-primary/20 bg-primary/5 backdrop-blur-sm">
              <CardContent className="p-5">
                <h3 className="font-bold mb-2">نیازسنجی رایگان اتوماسیون</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  فرآیندهای دستی سازمانتان را به ما بگویید تا در یک جلسه آنلاین،
                  راهکار عملی و هزینه تقریبی اتوماسیون را بررسی کنیم. بدون هیچ تعهدی.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
