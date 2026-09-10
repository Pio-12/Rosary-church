import { supabase } from "./client";

export async function getMassTimings() {
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

  return data;
}