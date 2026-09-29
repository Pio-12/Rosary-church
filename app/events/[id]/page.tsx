import { getEventById } from "@/lib/supabase/events";
import EventDetailContent from "./EventDetailContent";

export default async function EventDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getEventById(id);

  return <EventDetailContent event={event} />;
}