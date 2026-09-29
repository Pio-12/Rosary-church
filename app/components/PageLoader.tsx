"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useLanguage } from "./LanguageProvider";
import { translations } from "@/lib/supabase/translations";

const logoUrl =
  "https://ncedxbcsrcwuoailxsph.supabase.co/storage/v1/object/public/church-images/ChatGPT%20Image%20Sep%2011,%202026,%2009_33_49%20PM.png";

export default function PageLoader() {
  const pathname = usePathname();
  const { language } = useLanguage();
  const churchName = translations[language].common.churchName;

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial page loading
    const initialTimer = window.setTimeout(() => {
      setIsLoading(false);
    }, 900);

    return () => {
      window.clearTimeout(initialTimer);
    };
  }, []);

  useEffect(() => {
    // Show loader whenever the route changes
    setIsLoading(true);

    const navigationTimer = window.setTimeout(() => {
      setIsLoading(false);
    }, 650);

    return () => {
      window.clearTimeout(navigationTimer);
    };
  }, [pathname]);

  return (
    <div
      className={`page-loader ${
        isLoading ? "page-loader-visible" : "page-loader-hidden"
      }`}
      aria-hidden={!isLoading}
    >
      <div className="page-loader-content">
        <div className="page-loader-logo-wrapper">
          <div className="page-loader-ring" />

          <img
            src={logoUrl}
            alt={churchName}
            className="page-loader-logo"
          />
        </div>

        <p className="page-loader-title">
          {churchName}
        </p>

        <div className="page-loader-dots">
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}
