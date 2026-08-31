"use client";

import { useQuery } from "@tanstack/react-query";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  platformRole: string;
  createdAt: string;
  _count: { hostedEvents: number };
}

interface AdminEvent {
  id: string;
  title: string;
  eventType: { key: string; label: string; category: string };
  status: string;
  startAt: string;
  host: { name: string; email: string };
  _count: { guests: number };
}

interface AdminPayment {
  id: string;
  amountCents: number;
  currency: string;
  status: string;
  provider: string;
  createdAt: string;
  event: { title: string } | null;
}

interface AdminStats {
  users: number;
  events: number;
  publishedEvents: number;
  activeSubscriptions: number;
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Request failed");
  return res.json();
}

export function useAdminStats() {
  return useQuery({ queryKey: ["admin", "stats"], queryFn: () => fetchJson<AdminStats>("/api/admin/stats") });
}

export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => fetchJson<{ users: AdminUser[] }>("/api/admin/users"),
  });
}

export function useAdminEvents() {
  return useQuery({
    queryKey: ["admin", "events"],
    queryFn: () => fetchJson<{ events: AdminEvent[] }>("/api/admin/events"),
  });
}

export function useAdminPayments() {
  return useQuery({
    queryKey: ["admin", "payments"],
    queryFn: () => fetchJson<{ payments: AdminPayment[] }>("/api/admin/payments"),
  });
}
