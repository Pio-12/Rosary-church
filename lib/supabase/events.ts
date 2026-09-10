import { supabase } from "./client";

export async function getEvents() {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("is_published", true)
    .order("event_date", { ascending: true });

  if (error) {
    console.error("Supabase events error:", error);
    return [];
  }

  return data;
}

export async function getEventById(id: string) {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .eq("is_published", true)
    .single();

  if (error) {
    console.error("Supabase event details error:", error);
    return null;
  }

  return data;
}