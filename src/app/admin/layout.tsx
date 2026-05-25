"use client";

import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { useEffect, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { Brain, FileText, LayoutDashboard, LogOut, Plus, ArrowRight, Tags, FolderOpen, Bot, BookOpen, MessageSquare, UserCheck } from "lucide-react";
import Link from "next/link";

function AdminSidebar() {
  const pathname = usePathname();
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  const menuItems = [
    { href: "/admin/dashboard", label: "داشبورد", icon: LayoutDashboard },
    { href: "/admin/articles/new", label: "مقاله جدید", icon: Plus },
    { href: "/admin/articles", label: "مقالات", icon: FileText },
    { href: "/admin/categories", label: "دسته‌بندی‌ها", icon: FolderOpen },
    { href: "/admin/tags", label: "برچسب‌ها", icon: Tags },
    { href: "/admin/chatbot", label: "دستیار هوشمند", icon: Bot },
    { href: "/admin/knowledge", label: "پایگاه دانش", icon: BookOpen },
    { href: "/admin/conversations", label: "مکالمات", icon: MessageSquare },
    { href: "/admin/leads", label: "لیدها", icon: UserCheck },
  ];

  return (
    <aside className="w-64 border-l border-border bg-card/50 backdrop-blur-sm flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-4 border-b border-border">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <Brain className="w-5 h-5 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gradient">NovinAI</span>
            <span className="text-[10px] text-muted-foreground">پنل مدیریت</span>
          </div>
        </Link>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-3 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-border space-y-2">
        <Link href="/">
          <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground">
            <ArrowRight className="w-4 h-4 ml-2" />
            بازگشت به سایت
          </Button>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-destructive hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 ml-2" />
          خروج
        </Button>
      </div>
    </aside>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const router = useRouter();
  const pathname = usePathname();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  useEffect(() => {
    if (mounted && !isAuthenticated && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [mounted, isAuthenticated, pathname, router]);

  if (!mounted) return null;

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (!isAuthenticated) return null;

  return (
    <div className="flex min-h-screen" dir="rtl">
      <AdminSidebar />
      <main className="flex-1 bg-background p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
}
