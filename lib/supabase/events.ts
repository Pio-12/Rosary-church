import { supabase } from "./client";

export type Event = {
  id: string;
  title: string;
  description: string | null;
  event_date: string | null;
  start_time: string | null;
  end_time: string | null;
  location: string | null;
  category: string | null;
  image_url: string | null;
  is_featured: boolean;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
};

export async function getEvents(): Promise<Event[]> {
  const { data, error } = await supabase
    .from("events")
    .select(`
      id,
      title,
      description,
      event_date,
      start_time,
      end_time,
      location,
      category,
      image_url,
      is_featured,
      is_published,
      created_at,
      updated_at
    `)
    .eq("is_published", true)
    .order("event_date", { ascending: true })
    .order("start_time", { ascending: true });

  if (error) {
    console.error("Events fetch error:", error);
    return [];
  }

  return (data ?? []) as Event[];
}

export async function getEventById(
  id: string
): Promise<Event | null> {
  const { data, error } = await supabase
    .from("events")
    .select(`
      id,
      title,
      description,
      event_date,
      start_time,
      end_time,
      location,
      category,
      image_url,
      is_featured,
      is_published,
      created_at,
      updated_at
    `)
    .eq("id", id)
    .eq("is_published", true)
    .maybeSingle();

  if (error) {
    console.error("Event fetch error:", error);
    return null;
  }

  return data as Event | null;
}