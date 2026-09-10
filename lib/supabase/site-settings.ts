import { supabase } from "./client";

export async function getSiteSettings() {
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .limit(1)
    .single();

  if (error) {
    console.error("Supabase site settings error:", error);
    return null;
  }

  return data;
}