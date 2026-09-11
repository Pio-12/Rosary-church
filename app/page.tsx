import { getSiteSettings } from "@/lib/supabase/site-settings";
import { getMassTimings } from "@/lib/supabase/mass-timings";

import HomeContent from "./components/HomeContent";

export default async function Home() {
  const siteSettings = await getSiteSettings();
  const massTimings = await getMassTimings();

  return (
    <HomeContent
      siteSettings={siteSettings}
      massTimings={massTimings}
    />
  );
}