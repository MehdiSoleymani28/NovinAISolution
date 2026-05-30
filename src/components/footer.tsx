"use client";

import Link from "next/link";
import { Brain, Github, Linkedin, Twitter } from "lucide-react";

const footerLinks = {
  services: {
    title: "خدمات",
    links: [
      { label: "ورکفلو هوشمند", href: "/#services" },
      { label: "دستیار هوشمند", href: "/#services" },
      { label: "پیاده‌سازی ابزارهای AI", href: "/#services" },
      { label: "مشاوره و نیازسنجی", href: "/#contact" },
    ],
  },
  tutorials: {
    title: "آموزش‌ها",
    links: [
      { label: "ChatGPT و Claude", href: "/training/chatgpt-claude-professional" },
      { label: "Make و n8n", href: "/training/make-n8n-workflow" },
      { label: "ساخت AI Agent", href: "/training/custom-ai-agent" },
      { label: "اتوماسیون عملی", href: "/training/business-automation-practical" },
    ],
  },
  company: {
    title: "شرکت",
    links: [
      { label: "درباره ما", href: "/#about" },
      { label: "تماس با ما", href: "/#contact" },
      { label: "بلاگ", href: "/blog" },
      { label: "آموزش‌ها", href: "/training" },
    ],
  },
};

export function Footer() {
  return (
    <footer className="relative border-t border-border bg-card/30 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-gradient leading-tight">
                  NovinAI
                </span>
                <span className="text-xs text-muted-foreground leading-tight -mt-0.5">
                  Solution
                </span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mb-6">
              ورکفلوهای هوشمند و دستیارهای AI برای خودکارسازی فرآیندهای دستی کسب‌وکار.
              با ابزارهای آماده، سریع و مقرون‌به‌صرفه.
            </p>
            <div className="flex items-center gap-3">
              <Link
                href="https://github.com/MehdiSoleymani28/NovinAISolution"
                className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4 text-primary" />
              </Link>
            </div>
          </div>

          {/* Links */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h3 className="font-bold text-sm mb-4">{section.title}</h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} NovinAISolution. تمامی حقوق محفوظ است.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link href="/blog" className="hover:text-foreground transition-colors">
              بلاگ
            </Link>
            <Link href="/#contact" className="hover:text-foreground transition-colors">
              تماس با ما
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
