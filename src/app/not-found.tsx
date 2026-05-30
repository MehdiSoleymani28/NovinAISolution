import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Home } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-md mx-auto px-4 text-center">
        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl font-bold text-primary">404</span>
        </div>
        <h1 className="text-2xl font-bold mb-3">صفحه یافت نشد</h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          صفحه‌ای که دنبالش هستید وجود ندارد یا جابه‌جا شده است.
          از طریق لینک‌های زیر به بخش مورد نظر دسترسی پیدا کنید.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            asChild
          >
            <Link href="/">
              <Home className="w-4 h-4 ml-2" />
              صفحه اصلی
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/blog">
              بلاگ
              <ArrowRight className="w-4 h-4 mr-2" />
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
