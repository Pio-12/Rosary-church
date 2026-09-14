import { PageHero } from "../components/site";
import MassTimingsContent from "../components/MassTimingsContent";
import { getMassTimings } from "@/lib/supabase/mass-timings";

export default async function MassTimings() {
  const massTimings = await getMassTimings();

  return (
    <main>
      <PageHero
        title="Mass Timings"
        crumb="Mass Timings"
      />

      <MassTimingsContent massTimings={massTimings} />
    </main>
  );
}