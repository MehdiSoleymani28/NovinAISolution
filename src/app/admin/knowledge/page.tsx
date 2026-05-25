"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowRight,
  BookOpen,
  Plus,
  Trash2,
  Loader2,
  FileText,
  Link as LinkIcon,
  Type,
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface KnowledgeEntry {
  id: string;
  title: string;
  content: string;
  source: string | null;
  sourceType: string;
  chunkCount: number;
  createdAt: string;
  updatedAt: string;
}

const SOURCE_TYPE_OPTIONS = [
  { value: "text", label: "متن", icon: Type },
  { value: "pdf", label: "فایل PDF", icon: FileText },
  { value: "url", label: "آدرس اینترنتی", icon: LinkIcon },
];

export default function KnowledgePage() {
  const [entries, setEntries] = useState<KnowledgeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  // Form state
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newSourceType, setNewSourceType] = useState("text");
  const [newSourceName, setNewSourceName] = useState("");

  const { toast } = useToast();

  const fetchEntries = async () => {
    try {
      const res = await fetch("/api/knowledge");
      const data = await res.json();
      setEntries(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      toast({
        title: "خطا",
        description: "عنوان و محتوا الزامی است",
        variant: "destructive",
      });
      return;
    }
    setIsCreating(true);
    try {
      const res = await fetch("/api/knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          content: newContent,
          sourceType: newSourceType,
          source: newSourceName || undefined,
        }),
      });
      if (res.ok) {
        toast({
          title: "اطلاعات دانش اضافه شد",
          description: "محتوا با موفقیت به پایگاه دانش اضافه و بخش‌بندی شد.",
        });
        setNewTitle("");
        setNewContent("");
        setNewSourceName("");
        setNewSourceType("text");
        fetchEntries();
      } else {
        const data = await res.json();
        toast({
          title: "خطا",
          description: data.error || "خطا در ایجاد اطلاعات دانش",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Create error:", error);
      toast({
        title: "خطا",
        description: "خطا در ایجاد اطلاعات دانش",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("آیا از حذف این اطلاعات دانش مطمئن هستید؟")) return;
    try {
      const res = await fetch(`/api/knowledge?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast({
          title: "حذف شد",
          description: "اطلاعات دانش با موفقیت حذف شد.",
        });
        fetchEntries();
      } else {
        const data = await res.json();
        toast({
          title: "خطا",
          description: data.error || "خطا در حذف اطلاعات دانش",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "خطا",
        description: "خطا در حذف اطلاعات دانش",
        variant: "destructive",
      });
    }
  };

  const getSourceTypeIcon = (sourceType: string) => {
    const found = SOURCE_TYPE_OPTIONS.find((o) => o.value === sourceType);
    return found ? found.icon : Type;
  };

  const getSourceTypeLabel = (sourceType: string) => {
    const found = SOURCE_TYPE_OPTIONS.find((o) => o.value === sourceType);
    return found ? found.label : sourceType;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/admin/dashboard">
          <Button variant="ghost" size="icon" className="w-8 h-8">
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          <h1 className="text-xl font-bold">پایگاه دانش</h1>
        </div>
      </div>

      {/* Add Knowledge Form */}
      <Card className="border-border/50 bg-card/50">
        <CardContent className="p-5">
          <h2 className="text-sm font-bold mb-4 flex items-center gap-2">
            <Plus className="w-4 h-4 text-primary" />
            افزودن اطلاعات دانش
          </h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-1 space-y-1">
                <label className="text-xs text-muted-foreground block">
                  عنوان
                </label>
                <Input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="عنوان اطلاعات دانش"
                  className="bg-background/50 text-sm"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground block">
                  نوع منبع
                </label>
                <Select value={newSourceType} onValueChange={setNewSourceType}>
                  <SelectTrigger className="w-full bg-background/50 text-sm">
                    <SelectValue placeholder="نوع منبع" />
                  </SelectTrigger>
                  <SelectContent>
                    {SOURCE_TYPE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground block">
                  نام منبع
                </label>
                <Input
                  value={newSourceName}
                  onChange={(e) => setNewSourceName(e.target.value)}
                  placeholder="مثال: مستندات شرکت"
                  className="bg-background/50 text-sm"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground block">
                محتوا
              </label>
              <Textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="محتوای اطلاعات دانش را وارد کنید..."
                className="bg-background/50 text-sm min-h-32"
                rows={6}
                required
              />
            </div>
            <Button
              type="submit"
              disabled={isCreating}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              size="sm"
            >
              {isCreating ? (
                <Loader2 className="w-4 h-4 animate-spin ml-2" />
              ) : (
                <Plus className="w-4 h-4 ml-2" />
              )}
              افزودن به پایگاه دانش
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Entries List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : entries.length === 0 ? (
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-12 text-center">
            <BookOpen className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-muted-foreground mb-4">
              هنوز اطلاعات دانشی ثبت نشده
            </p>
            <p className="text-xs text-muted-foreground">
              با افزودن اطلاعات دانش، دستیار هوشمند می‌تواند پاسخ دقیق‌تری به
              سوالات بازدیدکنندگان بدهد
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => {
            const SourceIcon = getSourceTypeIcon(entry.sourceType);
            return (
              <Card
                key={entry.id}
                className="border-border/50 bg-card/50 hover:border-primary/20 transition-all"
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <SourceIcon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        <h3 className="font-bold text-sm truncate">
                          {entry.title}
                        </h3>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                        {entry.content.slice(0, 200)}
                        {entry.content.length > 200 ? "..." : ""}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <Badge
                          variant="secondary"
                          className="text-[10px] bg-primary/10 text-primary"
                        >
                          {getSourceTypeLabel(entry.sourceType)}
                        </Badge>
                        <Badge variant="secondary" className="text-[10px]">
                          {entry.chunkCount} بخش
                        </Badge>
                        <span>
                          {new Date(entry.createdAt).toLocaleDateString("fa-IR")}
                        </span>
                        {entry.source && (
                          <span className="truncate">منبع: {entry.source}</span>
                        )}
                      </div>
                    </div>

                    {/* Delete */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 text-destructive hover:text-destructive shrink-0"
                      onClick={() => handleDelete(entry.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
