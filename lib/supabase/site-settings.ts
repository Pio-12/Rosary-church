import { supabase } from "./client";

export async function getSiteSettings() {
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .limit(1);

  if (error) {
    console.error("Supabase site settings error:", error.message);
    console.error("Details:", error.details);
    console.error("Hint:", error.hint);
    return null;
  }

  return data?.[0] ?? null;
}