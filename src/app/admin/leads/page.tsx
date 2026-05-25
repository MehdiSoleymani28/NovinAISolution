"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowRight,
  UserCheck,
  Loader2,
  MessageSquare,
  Mail,
  Phone,
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface LeadConversation {
  id: string;
  visitorId: string | null;
  visitorName: string | null;
  visitorPhone: string | null;
  status: string;
  createdAt: string;
}

interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  note: string | null;
  status: string;
  conversationId: string;
  createdAt: string;
  updatedAt: string;
  conversation: LeadConversation;
}

const STATUS_OPTIONS = [
  { value: "new", label: "جدید", color: "bg-blue-500/10 text-blue-500" },
  { value: "contacted", label: "تماس گرفته شده", color: "bg-yellow-500/10 text-yellow-500" },
  { value: "converted", label: "تبدیل شده", color: "bg-green-500/10 text-green-500" },
  { value: "lost", label: "از دست رفته", color: "bg-red-500/10 text-red-500" },
];

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchLeads = async (status?: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (status && status !== "all") params.set("status", status);
      const res = await fetch(`/api/leads?${params.toString()}`);
      const data = await res.json();
      setLeads(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    fetchLeads(value);
  };

  const handleUpdateStatus = async (leadId: string, newStatus: string) => {
    setUpdatingId(leadId);
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        toast({
          title: "وضعیت بروزرسانی شد",
          description: "وضعیت لید با موفقیت تغییر کرد.",
        });
        fetchLeads(statusFilter);
      } else {
        const data = await res.json();
        toast({
          title: "خطا",
          description: data.error || "خطا در بروزرسانی وضعیت",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Update error:", error);
      toast({
        title: "خطا",
        description: "خطا در بروزرسانی وضعیت",
        variant: "destructive",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusStyle = (status: string) => {
    const found = STATUS_OPTIONS.find((o) => o.value === status);
    return found?.color || "bg-gray-500/10 text-gray-500";
  };

  const getStatusLabel = (status: string) => {
    const found = STATUS_OPTIONS.find((o) => o.value === status);
    return found?.label || status;
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
            <UserCheck className="w-5 h-5 text-primary" />
            <h1 className="text-xl font-bold">لیدها</h1>
          </div>
        </div>
        <Select value={statusFilter} onValueChange={handleStatusFilter}>
          <SelectTrigger className="w-40 bg-background/50 text-sm">
            <SelectValue placeholder="فیلتر وضعیت" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">همه</SelectItem>
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stats Row */}
      {!loading && leads.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {STATUS_OPTIONS.map((opt) => {
            const count = leads.filter((l) => l.status === opt.value).length;
            return (
              <Card key={opt.value} className="border-border/50 bg-card/50">
                <CardContent className="p-3 text-center">
                  <p className="text-xs text-muted-foreground">{opt.label}</p>
                  <p className="text-lg font-bold mt-1">{count}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Leads Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : leads.length === 0 ? (
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-12 text-center">
            <UserCheck className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-muted-foreground mb-2">هنوز لیدی ثبت نشده</p>
            <p className="text-xs text-muted-foreground">
              وقتی بازدیدکنندگان اطلاعات تماس خود را در چت‌بات وارد کنند، لیدها
              اینجا نمایش داده می‌شود
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-0">
            {/* Desktop Table */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">نام</TableHead>
                    <TableHead className="text-right">تلفن</TableHead>
                    <TableHead className="text-right">ایمیل</TableHead>
                    <TableHead className="text-right">وضعیت</TableHead>
                    <TableHead className="text-right">تاریخ</TableHead>
                    <TableHead className="text-right">مکالمه</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell className="font-medium text-sm">
                        {lead.name}
                      </TableCell>
                      <TableCell className="text-sm" dir="ltr">
                        {lead.phone}
                      </TableCell>
                      <TableCell className="text-sm">
                        {lead.email ? (
                          <span className="flex items-center gap-1" dir="ltr">
                            <Mail className="w-3 h-3" />
                            {lead.email}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={lead.status}
                          onValueChange={(value) =>
                            handleUpdateStatus(lead.id, value)
                          }
                          disabled={updatingId === lead.id}
                        >
                          <SelectTrigger className="w-36 text-xs h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {STATUS_OPTIONS.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(lead.createdAt).toLocaleDateString("fa-IR")}
                      </TableCell>
                      <TableCell>
                        <Link href={`/admin/conversations`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs text-primary hover:text-primary"
                          >
                            <MessageSquare className="w-3.5 h-3.5 ml-1" />
                            مشاهده
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3 p-4">
              {leads.map((lead) => (
                <Card
                  key={lead.id}
                  className="border-border/50 bg-background/50"
                >
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <UserCheck className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{lead.name}</p>
                          <p className="text-xs text-muted-foreground" dir="ltr">
                            <Phone className="w-3 h-3 inline ml-1" />
                            {lead.phone}
                          </p>
                        </div>
                      </div>
                      <Badge className={`text-[10px] ${getStatusStyle(lead.status)}`}>
                        {getStatusLabel(lead.status)}
                      </Badge>
                    </div>
                    {lead.email && (
                      <p className="text-xs text-muted-foreground" dir="ltr">
                        <Mail className="w-3 h-3 inline ml-1" />
                        {lead.email}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <Select
                        value={lead.status}
                        onValueChange={(value) =>
                          handleUpdateStatus(lead.id, value)
                        }
                        disabled={updatingId === lead.id}
                      >
                        <SelectTrigger className="w-36 text-xs h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(lead.createdAt).toLocaleDateString("fa-IR")}
                        </span>
                        <Link href={`/admin/conversations`}>
                          <MessageSquare className="w-4 h-4 text-primary" />
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
