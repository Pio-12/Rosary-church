import { getSiteSettings } from "@/lib/supabase/site-settings";
import { getMassTimings } from "@/lib/supabase/mass-timings";

import HomeContent from "./components/HomeContent";
import AnimatedGallery from "./components/AnimatedGallery";

export default async function Home() {
  const siteSettings = await getSiteSettings();
  const massTimings = await getMassTimings();

  return (
    <>
      <AnimatedGallery />

      <HomeContent
        siteSettings={siteSettings}
        massTimings={massTimings}
      />
    </>
  );
}