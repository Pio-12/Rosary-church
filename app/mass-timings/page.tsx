import MassTimingsContent from "../components/MassTimingsContent";
import { getMassTimings } from "@/lib/supabase/mass-timings";

export default async function MassTimings() {
  const massTimings = await getMassTimings();

  return <MassTimingsContent massTimings={massTimings} />;
}