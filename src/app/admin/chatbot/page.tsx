"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowRight, Bot, Save, Loader2, Send, Sparkles } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface ChatbotSettings {
  id: string;
  modelName: string;
  personality: string;
  welcomeMessage: string;
  fallbackMessage: string;
  leadFormEnabled: boolean;
  isActive: boolean;
}

const MODEL_OPTIONS = [
  { value: "gpt-4o", label: "GPT-4o" },
  { value: "gpt-4o-mini", label: "GPT-4o Mini" },
  { value: "gpt-4.1", label: "GPT-4.1" },
  { value: "gpt-4.1-mini", label: "GPT-4.1 Mini" },
  { value: "gpt-4.1-nano", label: "GPT-4.1 Nano" },
  { value: "claude-3.5-sonnet", label: "Claude 3.5 Sonnet" },
  { value: "claude-3.5-haiku", label: "Claude 3.5 Haiku" },
];

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function ChatbotSettingsPage() {
  const [settings, setSettings] = useState<ChatbotSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modelName, setModelName] = useState("gpt-4o-mini");
  const [personality, setPersonality] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [fallbackMessage, setFallbackMessage] = useState("");
  const [leadFormEnabled, setLeadFormEnabled] = useState(true);
  const [isActive, setIsActive] = useState(true);

  // Live chat test state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatSending, setChatSending] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/chatbot/settings");
        const data = await res.json();
        setSettings(data);
        setModelName(data.modelName || "gpt-4o-mini");
        setPersonality(data.personality || "");
        setWelcomeMessage(data.welcomeMessage || "");
        setFallbackMessage(data.fallbackMessage || "");
        setLeadFormEnabled(data.leadFormEnabled ?? true);
        setIsActive(data.isActive ?? true);
      } catch (error) {
        console.error("Fetch settings error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/chatbot/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modelName,
          personality,
          welcomeMessage,
          fallbackMessage,
          leadFormEnabled,
          isActive,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSettings(data);
        toast({
          title: "تنظیمات ذخیره شد",
          description: "تنظیمات چت‌بات با موفقیت بروزرسانی شد.",
        });
      } else {
        toast({
          title: "خطا",
          description: data.error || "خطا در ذخیره تنظیمات",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Save error:", error);
      toast({
        title: "خطا",
        description: "خطا در ذخیره تنظیمات",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleTestChat = async () => {
    if (!chatInput.trim()) return;
    const userMessage = chatInput.trim();
    setChatInput("");
    setChatMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setChatSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await res.json();
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply || data.message || "پاسخی دریافت نشد" },
      ]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: "خطا در دریافت پاسخ" },
      ]);
    } finally {
      setChatSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

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
          <Bot className="w-5 h-5 text-primary" />
          <h1 className="text-xl font-bold">دستیار هوشمند</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Form */}
        <div className="lg:col-span-2 space-y-4">
          {/* Active Toggle */}
          <Card className="border-border/50 bg-card/50">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isActive ? "bg-green-500/10" : "bg-red-500/10"
                    }`}
                  >
                    <Sparkles
                      className={`w-5 h-5 ${
                        isActive ? "text-green-500" : "text-red-500"
                      }`}
                    />
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {isActive ? "چت‌بات فعال است" : "چت‌بات غیرفعال است"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {isActive
                        ? "دستیار هوشمند به بازدیدکنندگان نمایش داده می‌شود"
                        : "دستیار هوشمند نمایش داده نمی‌شود"}
                    </p>
                  </div>
                </div>
                <Switch checked={isActive} onCheckedChange={setIsActive} />
              </div>
            </CardContent>
          </Card>

          {/* Model Selection */}
          <Card className="border-border/50 bg-card/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold">مدل هوش مصنوعی</CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <Select value={modelName} onValueChange={setModelName}>
                <SelectTrigger className="w-full bg-background/50">
                  <SelectValue placeholder="انتخاب مدل" />
                </SelectTrigger>
                <SelectContent>
                  {MODEL_OPTIONS.map((model) => (
                    <SelectItem key={model.value} value={model.value}>
                      {model.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-2">
                مدل‌های قوی‌تر پاسخ دقیق‌تری می‌دهند اما هزینه بیشتری دارند
              </p>
            </CardContent>
          </Card>

          {/* Personality & Messages */}
          <Card className="border-border/50 bg-card/50">
            <CardContent className="p-5 space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">شخصیت و لحن</Label>
                <Input
                  value={personality}
                  onChange={(e) => setPersonality(e.target.value)}
                  placeholder="مثال: دستیار حرفه‌ای و دوستانه"
                  className="bg-background/50 text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  نحوه رفتار و پاسخ‌دهی دستیار را تعریف کنید
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">پیام خوش‌آمدگویی</Label>
                <Textarea
                  value={welcomeMessage}
                  onChange={(e) => setWelcomeMessage(e.target.value)}
                  placeholder="سلام! چطور می‌تونم کمکتون کنم؟"
                  className="bg-background/50 text-sm min-h-20"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">پیام پیش‌فرض</Label>
                <Textarea
                  value={fallbackMessage}
                  onChange={(e) => setFallbackMessage(e.target.value)}
                  placeholder="متأسفانه اطلاعاتی در این مورد ندارم..."
                  className="bg-background/50 text-sm min-h-20"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  وقتی دستیار پاسخی پیدا نکند، این پیام نمایش داده می‌شود
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/50">
                <div>
                  <p className="font-medium text-sm">فرم لید</p>
                  <p className="text-xs text-muted-foreground">
                    نمایش فرم دریافت اطلاعات تماس بازدیدکنندگان
                  </p>
                </div>
                <Switch
                  checked={leadFormEnabled}
                  onCheckedChange={setLeadFormEnabled}
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-primary hover:bg-primary/90 text-primary-foreground w-full"
            size="lg"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin ml-2" />
            ) : (
              <Save className="w-4 h-4 ml-2" />
            )}
            ذخیره تنظیمات
          </Button>
        </div>

        {/* Live Chat Test */}
        <div className="lg:col-span-1">
          <Card className="border-border/50 bg-card/50 h-[600px] flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Send className="w-4 h-4 text-primary" />
                تست زنده چت‌بات
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 flex-1 flex flex-col min-h-0">
              <ScrollArea className="flex-1 -mx-1">
                <div className="space-y-3 px-1">
                  {chatMessages.length === 0 && (
                    <div className="text-center py-8">
                      <Bot className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground">
                        پیامی ارسال کنید تا پاسخ دستیار را ببینید
                      </p>
                    </div>
                  )}
                  {chatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${
                        msg.role === "user" ? "justify-start" : "justify-end"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                          msg.role === "user"
                            ? "bg-primary/10 text-foreground"
                            : "bg-primary text-primary-foreground"
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {chatSending && (
                    <div className="flex justify-end">
                      <div className="bg-primary text-primary-foreground rounded-xl px-3 py-2 text-xs">
                        <Loader2 className="w-3 h-3 animate-spin" />
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
              </ScrollArea>
              <div className="flex gap-2 pt-3 border-t border-border/50 mt-2">
                <Input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleTestChat()}
                  placeholder="پیام تست..."
                  className="bg-background/50 text-xs"
                  disabled={chatSending}
                />
                <Button
                  size="icon"
                  onClick={handleTestChat}
                  disabled={chatSending || !chatInput.trim()}
                  className="shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
