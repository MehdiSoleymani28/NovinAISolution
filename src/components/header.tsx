"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Menu, X, Brain, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "#home", label: "خانه" },
  { href: "#services", label: "خدمات" },
  { href: "#tutorials", label: "آموزش‌ها" },
  { href: "#tools", label: "ابزارها" },
  { href: "/blog", label: "بلاگ" },
  { href: "#about", label: "درباره ما" },
  { href: "#contact", label: "تماس" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-lg"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              <div className="absolute inset-0 rounded-xl bg-primary/5 blur-xl group-hover:bg-primary/10 transition-colors" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-bold text-gradient leading-tight">
                NovinAI
              </span>
              <span className="text-[10px] sm:text-xs text-muted-foreground leading-tight -mt-0.5">
                Solution
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-accent/50"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              className="hidden sm:flex text-muted-foreground hover:text-foreground"
              asChild
            >
              <Link href="/admin/login">
                <LogIn className="w-4 h-4 ml-1" />
                ورود
              </Link>
            </Button>
            <Button
              size="sm"
              className="hidden sm:flex bg-primary hover:bg-primary/90 text-primary-foreground"
              asChild
            >
              <Link href="#contact">مشاوره رایگان</Link>
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden w-9 h-9"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="منو"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl">
            <nav className="flex flex-col py-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="px-4 pt-2 space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  asChild
                >
                  <Link
                    href="/admin/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <LogIn className="w-4 h-4 ml-1" />
                    ورود به پنل
                  </Link>
                </Button>
                <Button
                  size="sm"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  asChild
                >
                  <Link
                    href="#contact"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    مشاوره رایگان
                  </Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
