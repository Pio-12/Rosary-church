"use client";

import Link from "next/link";
import {
  ArrowRight,
  Clock,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { useLanguage } from "./LanguageProvider";
import { translations } from "@/lib/supabase/translations";
import ScrollReveal from "@/app/ScrollReveal";
import AnimatedGallery from "./AnimatedGallery";
import LegacyPersonCard from "./LegacyPersonCard";

type SiteSettings = {
  hero_image_url?: string | null;
  established_year?: number | null;
  church_name?: string | null;
  tagline?: string | null;
} | null;

type MassTiming = {
  id: string | number;
  day_of_week: number;
  time: string;
};

type HomeContentProps = {
  siteSettings: SiteSettings;
  massTimings: MassTiming[];
};

const dayNames = {
  en: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
  ta: [
    "ஞாயிற்றுக்கிழமை",
    "திங்கட்கிழமை",
    "செவ்வாய்க்கிழமை",
    "புதன்கிழமை",
    "வியாழக்கிழமை",
    "வெள்ளிக்கிழமை",
    "சனிக்கிழமை",
  ],
};

export default function HomeContent({
  siteSettings,
  massTimings,
}: HomeContentProps) {
  const { language } = useLanguage();
  const t = translations[language].home;

  const establishedYear =
    siteSettings?.established_year ?? 1592;

  const churchName =
    language === "ta"
      ? "ஜெபமாலை அன்னையின் திருத்தலம்"
      : siteSettings?.church_name ??
        "Our Lady of Holy Rosary Church";

  const churchTagline =
    language === "ta"
      ? t.heroTagline
      : siteSettings?.tagline ?? t.heroTagline;

  const introDescription = t.introDescription.replace(
    "{year}",
    String(establishedYear)
  );

  return (
    <main>
      {/* SCROLL ANIMATIONS */}
      <ScrollReveal />

      {/* =====================================================
          HERO
         ===================================================== */}
<section
  className="hero"
  style={
    siteSettings?.hero_image_url
      ? {
          backgroundImage: `url(${siteSettings.hero_image_url})`,
        }
      : undefined
  }
>
  <div className="hero-glow" />

  <span className="hero-sparkle" aria-hidden="true" />
  <span className="hero-sparkle" aria-hidden="true" />
  <span className="hero-sparkle" aria-hidden="true" />

  <div className="container">
    <div className="hero-inner">
      <div className="eyebrow hero-eyebrow">
        {t.heroEyebrow} {establishedYear}
      </div>

      <h1 className="serif hero-title">
        {churchName}
      </h1>

      <div className="hero-divider" />

      <p className="hero-description">
        {churchTagline}
      </p>

      <div className="hero-actions">
        {/* Explore Our Church */}
        <Link
          className="button hero-button"
          href="/about"
        >
          {t.heroExplore}
          <ArrowRight size={14} />
        </Link>

        {/* Prayer Request */}
        <Link
          className="button outline hero-button"
          href="/prayer-request"
        >
          {t.prayerRequestButton}
        </Link>
      </div>
    </div>
  </div>

  <a
    href="#welcome"
    className="scroll-indicator"
  >
    <span>{t.scrollExplore}</span>
    <ChevronDown size={18} />
  </a>
</section>

      {/* =====================================================
          INTRO
         ===================================================== */}
      <section
        className="section home-intro"
        id="welcome"
      >
        <div className="container intro-grid">
          <div className="intro-image-wrap reveal-image">
            <img
              className="photo intro-photo"
              src={
                siteSettings?.hero_image_url ||
                "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1000&q=85"
              }
              alt={
                language === "ta"
                  ? "வரலாற்றுச் சிறப்புமிக்க ஆலயத்தின் வெளிப்புறம்"
                  : "Historic church exterior"
              }
            />

            <div className="image-frame" />
          </div>

          <div className="intro-copy reveal-up">
            <div className="eyebrow">
              {t.introEyebrow}
            </div>

            <h2 className="section-title">
              {t.introTitleLine1}
              <br />
              {t.introTitleLine2}
            </h2>

            <p>{introDescription}</p>

            <Link className="button" href="/about">
              {t.discoverStory}
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
<AnimatedGallery/> 
      {/* =====================================================
          STATS
         ===================================================== */}
      <section className="container">
        <div className="stats animated-stats">
          <div className="stat">
            <strong>{establishedYear}</strong>
            <span>{t.founded}</span>
          </div>

          <div className="stat">
            <strong>400+</strong>
            <span>{t.heritage}</span>
          </div>

          <div className="stat">
            <strong>380</strong>
            <span>{t.families}</span>
          </div>

          <div className="stat">
            <strong>4</strong>
            <span>{t.chapels}</span>
          </div>
        </div>
      </section>

      {/* =====================================================
          HISTORY
         ===================================================== */}
      <section className="section">
        <div className="container">
          <div className="section-heading reveal-up">
            <div>
              <div className="eyebrow">
                {t.historyEyebrow}
              </div>

              <h2 className="section-title">
                {t.historyTitle}
              </h2>
            </div>

            <Link className="button" href="/about">
              {t.exploreHistory}
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="timeline home-timeline">
            {t.milestones.map((milestone, index) => (
              <div
                className="timeline-item reveal-up"
                key={milestone.year}
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <strong>{milestone.year}</strong>
                <p>{milestone.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

{/* =====================================================
    LEGACY
   ===================================================== */}
<section className="legacy-v2-section">
  <div className="container">
    <div className="legacy-v2-heading">
      <div className="eyebrow">
        {t.legacyEyebrow}
      </div>

      <h2 className="section-title">
        {t.legacyTitle}
      </h2>

      <p>{t.legacyDescription}</p>
    </div>

    <div className="legacy-v2-grid">
      {t.people.map((person, index) => (
        <LegacyPersonCard
          key={person.name}
          person={person}
          index={index}
        />
      ))}
    </div>
  </div>
</section>

      {/* =====================================================
          MASS
         ===================================================== */}
      <section className="section">
        <div className="container mass-strip">
          <div className="mass-image-wrap reveal-image">
            <img
              src="https://images.unsplash.com/photo-1543168256-418811576931?auto=format&fit=crop&w=900&q=85"
              alt={
                language === "ta"
                  ? "புனித திருப்பலிக்காக தயாரிக்கப்பட்ட பாத்திரமும் மெழுகுவர்த்திகளும்"
                  : "Chalice and candles prepared for Holy Mass"
              }
            />

            <div className="mass-image-label">
              <span>{t.comeAndPray}</span>
            </div>
          </div>

          <div className="reveal-up">
            <div className="eyebrow">
              {t.prayerEyebrow}
            </div>

            <h2 className="section-title">
              {t.holyMass}
            </h2>

            <p className="body-copy">
              {t.massDescription}
            </p>

            <div className="mass-list">
              {massTimings.slice(0, 6).map((item) => (
                <div className="mass-card" key={item.id}>
                  <strong>
                    {dayNames[language][item.day_of_week] ??
                      t.specialCelebration}
                  </strong>

                  <span>
                    <Clock size={12} />
                    {item.time}
                  </span>
                </div>
              ))}
            </div>

            <Link
              className="button"
              href="/mass-timings"
              style={{ marginTop: 22 }}
            >
              {t.viewMassTimes}
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================
          FINAL CTA
         ===================================================== */}
      <section className="home-cta">
        <div className="container">
          <div className="home-cta-inner">
            <div className="eyebrow">
              {t.ctaEyebrow}
            </div>

            <h2 className="serif">
              {t.ctaTitleLine1}
              <br />
              {t.ctaTitleLine2}
            </h2>

            <p>{t.ctaDescription}</p>

            <div className="hero-actions">
              <Link className="button" href="/contact">
                {t.visitUs}
                <ArrowRight size={14} />
              </Link>

              <Link
                className="button outline"
                href="/readings"
              >
                {t.todaysReadings}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}