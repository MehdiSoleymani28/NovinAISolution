"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Target, Users, Award, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const values = [
  {
    icon: Target,
    title: "تمرکز بر نتیجه",
    description:
      "هدف ما ارائه راهکارهایی است که واقعاً تفاوت ایجاد کنند. هر پروژه با شاخص‌های مشخص و نتایج قابل اندازه‌گیری تعریف می‌شود تا اثربخشی سرمایه‌گذاری شما تضمین شود.",
  },
  {
    icon: Users,
    title: "همراهی مستمر",
    description:
      "ما فقط مشاور نمی‌دهیم، بلکه در تمام مراحل پیاده‌سازی همراه شما هستیم. از طراحی اولیه تا استقرار نهایی و پشتیبانی بلندمدت، تیم ما کنار شماست.",
  },
  {
    icon: Award,
    title: "تخصص و تجربه",
    description:
      "تیم ما متشکل از متخصصان با تجربه در حوزه‌های مختلف هوش مصنوعی است. ترکیب دانش آکادمیک و تجربه صنعتی، راهکارهایی عملی و نوآورانه خلق می‌کند.",
  },
  {
    icon: TrendingUp,
    title: "نوآوری مداوم",
    description:
      "دنیای AI به سرعت تغییر می‌کند و ما همیشه در خط مقدم فناوری هستیم. به‌روزرسانی مداوم دانش و ابزارها، بهترین راهکارهای روز را به شما ارائه می‌دهیم.",
  },
];

export function AboutSection() {
  return (
    <section id="about" className="relative py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Right Content - Text */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              درباره ما
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              چرا <span className="text-gradient">NovinAISolution</span>؟
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              NovinAISolution با مأموریت دموکراتیزه کردن هوش مصنوعی برای کسب‌وکارهای
              ایرانی تأسیس شده است. ما معتقدیم هر سازمانی، بدون توجه به اندازه، باید
              بتواند از قدرت AI بهره‌مند شود.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              تیم ما ترکیبی از مهندسان هوش مصنوعی، مشاوران کسب‌وکار و طراحان
              سیستم است که با درک عمیق از چالش‌های بازار ایران، راهکارهایی عملی و
              قابل اجرا ارائه می‌دهند. رویکرد ما مبتنی بر ایجاد ارزش واقعی و
              نتایج قابل اندازه‌گیری است.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "۵+ سال", label: "تجربه در صنعت AI" },
                { value: "۵۰+", label: "پروژه موفق" },
                { value: "۹۸٪", label: "رضایت مشتریان" },
                { value: "۱۵+", label: "متخصص AI" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="p-4 rounded-xl bg-primary/5 border border-primary/10"
                >
                  <div className="text-xl font-bold text-primary">
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Left Content - Values */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/20 transition-all duration-300">
                  <CardContent className="p-5">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <value.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold mb-1">{value.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
