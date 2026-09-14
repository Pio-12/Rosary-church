import { supabase } from "./client";

export type MassTiming = {
  id: string;
  day_of_week: number;
  title: string;
  time: string;
  language: string | null;
  description: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

export async function getMassTimings(): Promise<MassTiming[]> {
  const { data, error } = await supabase
    .from("mass_timings")
    .select("*")
    .eq("is_active", true)
    .order("day_of_week", { ascending: true })
    .order("time", { ascending: true });

  if (error) {
    console.error("Supabase mass timings error:", error);
    return [];
  }

  return (data ?? []) as MassTiming[];
}