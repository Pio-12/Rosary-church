import { supabase } from "./client";

export async function getGalleryCategories() {
  const { data, error } = await supabase
    .from("gallery_categories")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("Supabase gallery categories error:", error);
    return [];
  }

  return data;
}

export async function getGalleryItems() {
  const { data, error } = await supabase
    .from("gallery_items")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase gallery items error:", error);
    return [];
  }

  return data;
}