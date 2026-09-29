import { getSiteSettings } from "@/lib/supabase/site-settings";
import AboutContent from "../components/AboutContent";

export default async function About() {
  const siteSettings = await getSiteSettings();

  return <AboutContent siteSettings={siteSettings} />;
}