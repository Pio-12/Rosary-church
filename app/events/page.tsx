import { getEvents } from "@/lib/supabase/events";
import EventsContent from "./EventsContent";

export const revalidate = 60;

export default async function EventsPage() {
  const events = await getEvents();

  return <EventsContent events={events} />;
}