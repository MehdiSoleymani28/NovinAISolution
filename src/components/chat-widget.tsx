"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Send, User, Phone, Mail, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// --- Types ---
interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  showLeadForm?: boolean;
}

interface LeadFormData {
  name: string;
  phone: string;
  email: string;
}

// --- Helpers ---
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

function getOrCreateVisitorId(): string {
  if (typeof window === "undefined") return generateId();
  const KEY = "novin_chat_visitor_id";
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = generateId();
    localStorage.setItem(KEY, id);
  }
  return id;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// --- Typing Indicator ---
function TypingIndicator() {
  return (
    <div className="flex items-start gap-2 mb-4">
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
        <Bot className="w-4 h-4 text-primary" />
      </div>
      <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl rounded-tr-sm px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}

// --- Lead Capture Form ---
function LeadForm({
  conversationId,
  onSubmit,
}: {
  conversationId: string;
  onSubmit: () => void;
}) {
  const [form, setForm] = useState<LeadFormData>({ name: "", phone: "", email: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      setError("نام و شماره تلفن الزامی است");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim() || undefined,
          conversationId,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "خطا در ثبت اطلاعات");
      }
      onSubmit();
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در ارتباط");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3 p-3 rounded-xl bg-primary/5 border border-primary/20 space-y-3">
      <p className="text-xs text-muted-foreground">
        برای تماس همکاران ما با شما، اطلاعات خود را وارد کنید:
      </p>
      <Input
        placeholder="نام و نام خانوادگی *"
        value={form.name}
        onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
        className="h-9 text-sm bg-background/50 border-primary/20 focus:border-primary/40"
        disabled={submitting}
      />
      <Input
        placeholder="شماره تلفن *"
        value={form.phone}
        onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
        className="h-9 text-sm bg-background/50 border-primary/20 focus:border-primary/40"
        dir="ltr"
        disabled={submitting}
      />
      <Input
        placeholder="ایمیل (اختیاری)"
        value={form.email}
        onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
        className="h-9 text-sm bg-background/50 border-primary/20 focus:border-primary/40"
        dir="ltr"
        disabled={submitting}
      />
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
      <Button
        type="submit"
        size="sm"
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        disabled={submitting}
      >
        {submitting ? (
          <Loader2 className="w-4 h-4 animate-spin ml-2" />
        ) : (
          <Phone className="w-4 h-4 ml-2" />
        )}
        ارسال برای تماس با شما
      </Button>
    </form>
  );
}

// --- Main Chat Widget ---
export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [visitorId, setVisitorId] = useState<string>("");
  const [isInitialized, setIsInitialized] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [showLeadFormForMsg, setShowLeadFormForMsg] = useState<string | null>(null);
  const [widgetEnabled, setWidgetEnabled] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize visitor ID on mount
  useEffect(() => {
    setVisitorId(getOrCreateVisitorId());
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Fetch welcome message on first open
  const initializeChat = useCallback(async () => {
    if (isInitialized) return;
    try {
      const res = await fetch("/api/chatbot/settings");
      if (!res.ok) throw new Error("Failed to fetch settings");
      const data = await res.json();

      if (!data.isActive) {
        setWidgetEnabled(false);
        return;
      }

      const welcomeMsg: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content: data.welcomeMessage || "سلام! چطور می‌تونم کمکتون کنم؟",
        timestamp: new Date(),
      };
      setMessages([welcomeMsg]);
      setIsInitialized(true);
    } catch {
      // Even on error, show a default welcome so the widget is usable
      const fallbackMsg: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content: "سلام! من دستیار هوشمند نوین ای‌آی سولوشن هستم. چطور می‌تونم کمکتون کنم؟",
        timestamp: new Date(),
      };
      setMessages([fallbackMsg]);
      setIsInitialized(true);
    }
  }, [isInitialized]);

  const handleToggle = () => {
    if (!isOpen) {
      setIsOpen(true);
      initializeChat();
    } else {
      setIsOpen(false);
    }
  };

  const sendMessage = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed || isLoading) return;

    const userMsg: ChatMessage = {
      id: generateId(),
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          conversationId,
          visitorId,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "خطا در ارتباط");
      }

      const data = await res.json();

      const botMsg: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content: data.response || "متأسفانه مشکلی پیش آمد.",
        timestamp: new Date(),
        showLeadForm: data.showLeadForm || false,
      };

      setMessages((prev) => [...prev, botMsg]);
      if (data.conversationId) {
        setConversationId(data.conversationId);
      }
      if (data.showLeadForm) {
        setShowLeadFormForMsg(botMsg.id);
      }
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content: err instanceof Error ? err.message : "خطا در ارتباط با سرور",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleLeadSubmitted = () => {
    setLeadSubmitted(true);
    setShowLeadFormForMsg(null);
    const thankYouMsg: ChatMessage = {
      id: generateId(),
      role: "assistant",
      content: "✅ اطلاعات شما با موفقیت ثبت شد. همکاران ما به زودی با شما تماس خواهند گرفت.",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, thankYouMsg]);
  };

  // Don't render if widget is disabled
  if (!widgetEnabled) return null;

  return (
    <>
      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-20 left-4 z-50 flex flex-col w-[calc(100vw-2rem)] sm:w-[380px] h-[500px] max-h-[70vh] rounded-2xl border border-border/50 bg-card/70 backdrop-blur-xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-primary/5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">دستیار هوشمند</h3>
                  <p className="text-[10px] text-muted-foreground">NovinAI Solution</p>
                </div>
              </div>
              <button
                onClick={handleToggle}
                className="w-8 h-8 rounded-lg hover:bg-primary/10 flex items-center justify-center transition-colors"
                aria-label="بستن چت"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              {messages.map((msg) => (
                <div key={msg.id}>
                  {msg.role === "assistant" ? (
                    /* Bot message */
                    <div className="flex items-start gap-2 mb-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl rounded-tr-sm px-4 py-3 inline-block max-w-[90%]">
                          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                            {msg.content}
                          </p>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1 px-1">
                          {formatTime(msg.timestamp)}
                        </p>
                        {/* Lead Form */}
                        {msg.showLeadForm && showLeadFormForMsg === msg.id && !leadSubmitted && (
                          <LeadForm
                            conversationId={conversationId || ""}
                            onSubmit={handleLeadSubmitted}
                          />
                        )}
                        {msg.showLeadForm && leadSubmitted && (
                          <p className="text-xs text-green-500 mt-2">✅ اطلاعات شما ثبت شد</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* User message */
                    <div className="flex items-start gap-2 mb-4 flex-row-reverse">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col items-end">
                        <div className="bg-primary/15 border border-primary/20 rounded-2xl rounded-tl-sm px-4 py-3 inline-block max-w-[90%]">
                          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                            {msg.content}
                          </p>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1 px-1">
                          {formatTime(msg.timestamp)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Typing indicator */}
              {isLoading && <TypingIndicator />}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 border-t border-border/50 bg-card/30">
              <div className="flex items-center gap-2">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="پیام خود را بنویسید..."
                  className="flex-1 h-10 text-sm bg-background/50 border-border/50 focus:border-primary/40"
                  disabled={isLoading}
                  dir="rtl"
                />
                <Button
                  onClick={sendMessage}
                  size="icon"
                  className="h-10 w-10 bg-primary hover:bg-primary/90 text-primary-foreground flex-shrink-0"
                  disabled={isLoading || !inputValue.trim()}
                  aria-label="ارسال پیام"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        onClick={handleToggle}
        className="fixed bottom-4 left-4 z-50 w-14 h-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg blue-glow flex items-center justify-center transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isOpen ? "بستن چت" : "باز کردن چت"}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Mail className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}
