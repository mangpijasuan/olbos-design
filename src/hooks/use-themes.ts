"use client";

import { useQuery } from "@tanstack/react-query";
import type { ThemeTokens } from "@/validations/theme";

export interface ThemeOption {
  id: string;
  key: string;
  name: string;
  description: string;
  category: string;
  tokens: ThemeTokens;
  swatch: string;
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Request failed");
  return res.json();
}

export function useThemes() {
  return useQuery({
    queryKey: ["themes"],
    queryFn: () => fetchJson<{ themes: ThemeOption[] }>("/api/themes"),
    staleTime: 5 * 60 * 1000,
  });
}
