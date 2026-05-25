"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Target, Users, Lightbulb, Cpu } from "lucide-react";
import { motion } from "framer-motion";

const values = [
  {
    icon: Target,
    title: "عملی، نه تئوری",
    description:
      "ما به جای صحبت درباره مفاهیم پیچیده AI، روی نتیجه واقعی تمرکز می‌کنیم. هر راهکاری که ارائه می‌دهیم قابل اجراست و تأثیر ملموسی روی بهره‌وری سازمان شما دارد.",
  },
  {
    icon: Users,
    title: "ابزارمحور، نه کدمحور",
    description:
      "نیازی نیست برنامه‌نویس باشید. ما از ابزارهای آماده و پلتفرم‌های بدون کد استفاده می‌کنیم تا سریع‌ترین و مقرون‌به‌صرفه‌ترین راهکار رو به شما ارائه دهیم.",
  },
  {
    icon: Lightbulb,
    title: "راهکار سفارشی",
    description:
      "هر کسب‌وکاری فرآیندهای منحصربه‌فرد خودش رو دارد. ما صرفاً یک ابزار نمی‌فروشیم، بلکه راهکاری متناسب با نیاز دقیق شما طراحی و پیاده‌سازی می‌کنیم.",
  },
  {
    icon: Cpu,
    title: "به‌روز و کارآمد",
    description:
      "دنیای AI هر روز تغییر می‌کند و ما همیشه جدیدترین ابزارها و تکنیک‌ها رو آزمایش می‌کنیم. فقط راهکارهایی رو پیشنهاد می‌دهیم که خودمان تست و تأیید کرده‌ایم.",
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
              ما در NovinAISolution باور داریم هر کسب‌وکاری، حتی بدون دانش
              برنامه‌نویسی و تیم فنی، می‌تونه از قدرت هوش مصنوعی بهره ببره.
              تمرکز ما روی استفاده عملی از ابزارهای آماده‌ست، نه ساخت مدل‌های
              پیچیده از صفر.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              ما کمک می‌کنیم فرآیندهای دستی و تکراری سازمانتون رو با ابزارهایی
              مثل Make، n8n، ChatGPT و Claude خودکار کنید. از طراحی ورکفلوهای
              کاری هوشمند تا ساخت دستیارهای AI سفارشی، هر جا کار تکراری هست،
              ما اون رو خودکار می‌کنیم.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "ابزارمحور", label: "استفاده از ابزارهای آماده" },
                { value: "No-Code", label: "بدون نیاز به برنامه‌نویسی" },
                { value: "عملی", label: "نتایج ملموس و سریع" },
                { value: "سفارشی", label: "متناسب با نیاز شما" },
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
