"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowRight,
  MessageSquare,
  Loader2,
  ChevronDown,
  ChevronUp,
  User,
  Bot,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface LastMessage {
  id: string;
  role: string;
  content: string;
  createdAt: string;
}

interface ConversationSummary {
  id: string;
  visitorId: string | null;
  visitorName: string | null;
  visitorPhone: string | null;
  status: string;
  lastMessage: LastMessage | null;
  hasLead: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ConversationDetail {
  id: string;
  visitorId: string | null;
  visitorName: string | null;
  visitorPhone: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  messages: Array<{
    id: string;
    role: string;
    content: string;
    createdAt: string;
  }>;
  lead: Array<{
    id: string;
    name: string;
    phone: string;
    email: string | null;
    status: string;
  }> | null;
}

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [expandedData, setExpandedData] = useState<ConversationDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const fetchConversations = async (status?: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (status && status !== "all") params.set("status", status);
      params.set("limit", "50");
      const res = await fetch(`/api/conversations?${params.toString()}`);
      const data = await res.json();
      setConversations(data.conversations || []);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    fetchConversations(value);
  };

  const handleExpand = async (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
      setExpandedData(null);
      return;
    }
    setExpandedId(id);
    setLoadingDetail(true);
    try {
      const res = await fetch(`/api/conversations/${id}`);
      const data = await res.json();
      setExpandedData(data);
    } catch (error) {
      console.error("Fetch conversation detail error:", error);
    } finally {
      setLoadingDetail(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="text-[10px] bg-green-500/10 text-green-500 hover:bg-green-500/20">
            فعال
          </Badge>
        );
      case "closed":
        return (
          <Badge className="text-[10px] bg-gray-500/10 text-gray-500 hover:bg-gray-500/20">
            بسته شده
          </Badge>
        );
      default:
        return <Badge className="text-[10px]">{status}</Badge>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/dashboard">
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            <h1 className="text-xl font-bold">مکالمات</h1>
          </div>
        </div>
        <Select value={statusFilter} onValueChange={handleStatusFilter}>
          <SelectTrigger className="w-36 bg-background/50 text-sm">
            <SelectValue placeholder="فیلتر وضعیت" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">همه</SelectItem>
            <SelectItem value="active">فعال</SelectItem>
            <SelectItem value="closed">بسته شده</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Conversations List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : conversations.length === 0 ? (
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-12 text-center">
            <MessageSquare className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-muted-foreground mb-2">هنوز مکالمه‌ای ثبت نشده</p>
            <p className="text-xs text-muted-foreground">
              وقتی بازدیدکنندگان با چت‌بات صحبت کنند، مکالمات اینجا نمایش داده
              می‌شود
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {conversations.map((conv) => (
            <div key={conv.id}>
              <Card
                className={`border-border/50 bg-card/50 hover:border-primary/20 transition-all cursor-pointer ${
                  expandedId === conv.id ? "border-primary/30" : ""
                }`}
                onClick={() => handleExpand(conv.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-sm">
                          {conv.visitorName || "بازدیدکننده ناشناس"}
                        </h3>
                        {getStatusBadge(conv.status)}
                        {conv.hasLead && (
                          <Badge className="text-[10px] bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20">
                            لید
                          </Badge>
                        )}
                      </div>
                      {conv.visitorPhone && (
                        <p className="text-xs text-muted-foreground mb-1" dir="ltr">
                          {conv.visitorPhone}
                        </p>
                      )}
                      {conv.lastMessage && (
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {conv.lastMessage.role === "assistant" ? "🤖 " : "👤 "}
                          {conv.lastMessage.content.slice(0, 100)}
                        </p>
                      )}
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="text-left">
                        <p className="text-[10px] text-muted-foreground">
                          {new Date(conv.updatedAt).toLocaleDateString("fa-IR")}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {new Date(conv.updatedAt).toLocaleTimeString("fa-IR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      {expandedId === conv.id ? (
                        <ChevronUp className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Expanded Detail */}
              <AnimatePresence>
                {expandedId === conv.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="border-primary/20 bg-card/30 mt-2">
                      <CardContent className="p-4">
                        {loadingDetail ? (
                          <div className="flex items-center justify-center py-6">
                            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                          </div>
                        ) : expandedData ? (
                          <ScrollArea className="max-h-96">
                            <div className="space-y-3">
                              {expandedData.messages.map((msg) => (
                                <div
                                  key={msg.id}
                                  className={`flex ${
                                    msg.role === "user"
                                      ? "justify-start"
                                      : "justify-end"
                                  }`}
                                >
                                  <div
                                    className={`flex items-start gap-2 max-w-[85%] ${
                                      msg.role === "user" ? "" : "flex-row-reverse"
                                    }`}
                                  >
                                    <div
                                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                                        msg.role === "user"
                                          ? "bg-blue-500/10 text-blue-500"
                                          : "bg-primary/10 text-primary"
                                      }`}
                                    >
                                      {msg.role === "user" ? (
                                        <User className="w-3 h-3" />
                                      ) : (
                                        <Bot className="w-3 h-3" />
                                      )}
                                    </div>
                                    <div>
                                      <div
                                        className={`rounded-xl px-3 py-2 text-xs leading-relaxed ${
                                          msg.role === "user"
                                            ? "bg-muted text-foreground"
                                            : "bg-primary text-primary-foreground"
                                        }`}
                                      >
                                        {msg.content}
                                      </div>
                                      <p className="text-[10px] text-muted-foreground mt-1 px-1">
                                        {new Date(
                                          msg.createdAt
                                        ).toLocaleTimeString("fa-IR", {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                        ) : (
                          <p className="text-xs text-muted-foreground text-center py-4">
                            خطا در بارگذاری جزئیات
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
