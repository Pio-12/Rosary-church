"use client";

import Link from "next/link";
import {
  Menu,
  X,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { useLanguage } from "./LanguageProvider";
import { translations } from "@/lib/supabase/translations";

/* =========================================================
   NAVIGATION LINKS
   ========================================================= */

const links = [
  ["home", "/"],
  ["about", "/about"],
  ["massTimings", "/mass-timings"],
  ["readings", "/readings"],
  ["events", "/events"],
  ["gallery", "/gallery"],
  ["prayerRequest", "/prayer-request"],
  ["contact", "/contact"],
] as const;

/* =========================================================
   LOGO
   ========================================================= */

const logoURL =
  "https://ncedxbcsrcwuoailxsph.supabase.co/storage/v1/object/public/church-images/ChatGPT%20Image%20Sep%2011,%202026,%2009_33_49%20PM.png";

/* =========================================================
   LANGUAGE SWITCHER
   ========================================================= */

function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className="language-switcher"
      aria-label="Language selection"
    >
      <button
        type="button"
        className={language === "en" ? "active" : ""}
        onClick={() => setLanguage("en")}
        aria-pressed={language === "en"}
      >
        English
      </button>

      <button
        type="button"
        className={language === "ta" ? "active" : ""}
        onClick={() => setLanguage("ta")}
        aria-pressed={language === "ta"}
      >
        தமிழ்
      </button>
    </div>
  );
}

/* =========================================================
   HEADER
   ========================================================= */

export function Header() {
  const [open, setOpen] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);

  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  const { language } = useLanguage();
  const t = translations[language];

  /* -------------------------------------------------------
     HIDE HEADER ON SCROLL DOWN
     SHOW HEADER ON SCROLL UP
     ------------------------------------------------------- */

  useEffect(() => {
    const handleScroll = () => {
      if (ticking.current) {
        return;
      }

      ticking.current = true;

      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;

        // Always show the header near the top
        if (currentScrollY <= 80) {
          setHeaderVisible(true);
        }
        // Show the header when scrolling upward
        else if (currentScrollY < lastScrollY.current) {
          setHeaderVisible(true);
        }
        // Hide the header when scrolling downward
        else if (currentScrollY > lastScrollY.current) {
          setHeaderVisible(false);
          setOpen(false);
        }

        lastScrollY.current = currentScrollY;
        ticking.current = false;
      });
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const closeMenu = () => {
    setOpen(false);
  };

  return (
    <>
      {/* =====================================================
          TOPBAR + HEADER WRAPPER
          ===================================================== */}

      <div
        className={`header-scroll-wrapper ${
          headerVisible
            ? "header-scroll-visible"
            : "header-scroll-hidden"
        }`}
      >
        {/* ===================================================
            TOP BAR
            =================================================== */}

        <div className="topbar">
          <div className="container">
            {language === "ta"
              ? "மதுரையின் இதயத்தில் நம்பிக்கை, எதிர்நோக்கு மற்றும் அன்பின் வாழும் பாரம்பரியம்"
              : "A living heritage of faith, hope and love in Madurai"}
          </div>
        </div>

        {/* ===================================================
            MAIN HEADER
            =================================================== */}

        <header className="header">
          <div className="container nav">
            {/* -------------------------------------------------
                LOGO / BRAND
                ------------------------------------------------- */}

            <Link
              className="brand"
              href="/"
              onClick={closeMenu}
            >
              <img
                src={logoURL}
                alt="Our Lady of Holy Rosary Church logo"
                className="brand-logo"
              />

              <span className="brand-copy">
                {t.common.churchName}
                <span>{t.common.city}</span>
              </span>
            </Link>

            {/* -------------------------------------------------
                DESKTOP NAVIGATION
                ------------------------------------------------- */}

            <nav
              className="desktop-nav"
              aria-label="Main navigation"
            >
              {links.map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                >
                  {t.nav[label]}
                </Link>
              ))}
            </nav>

            {/* -------------------------------------------------
                DESKTOP ACTIONS
                ------------------------------------------------- */}

            <div className="desktop-actions">
              <LanguageSwitcher />

              <Link
                className="button desktop-donate"
                href="/donations"
              >
                {t.nav.donate}
              </Link>
            </div>

            {/* -------------------------------------------------
                MOBILE MENU BUTTON
                ------------------------------------------------- */}

            <button
              className="mobile-toggle"
              type="button"
              aria-label={
                open
                  ? "Close navigation"
                  : "Open navigation"
              }
              aria-expanded={open}
              onClick={() => setOpen(!open)}
            >
              {open ? (
                <X size={24} />
              ) : (
                <Menu size={24} />
              )}
            </button>
          </div>
        </header>
      </div>

      {/* =====================================================
          MOBILE BACKDROP
          ===================================================== */}

      <div
        className={`mobile-backdrop ${
          open ? "mobile-backdrop-visible" : ""
        }`}
        onClick={closeMenu}
        aria-hidden={!open}
      />

      {/* =====================================================
          MOBILE SIDE DRAWER
          ===================================================== */}

      <aside
        className={`mobile-drawer ${
          open ? "mobile-drawer-open" : ""
        }`}
        aria-hidden={!open}
      >
        {/* ---------------------------------------------------
            DRAWER HEADER
            --------------------------------------------------- */}

        <div className="mobile-drawer-header">
          <div>
            <span className="mobile-drawer-eyebrow">
              {t.nav.ourChurch}
            </span>

            <span className="mobile-drawer-title">
              {t.nav.navigation}
            </span>
          </div>

          <button
            className="mobile-close"
            type="button"
            onClick={closeMenu}
            aria-label="Close navigation"
          >
            <X size={22} />
          </button>
        </div>

        {/* ---------------------------------------------------
            MOBILE LANGUAGE SWITCHER
            --------------------------------------------------- */}

        <LanguageSwitcher />

        {/* ---------------------------------------------------
            MOBILE LINKS
            --------------------------------------------------- */}

        <nav
          className="mobile-nav"
          aria-label="Mobile navigation"
        >
          {links.map(([label, href], index) => (
            <Link
              key={href}
              href={href}
              onClick={closeMenu}
              style={
                {
                  "--mobile-delay": `${index * 70}ms`,
                } as CSSProperties
              }
            >
              <span>{t.nav[label]}</span>
              <ArrowRight size={17} />
            </Link>
          ))}
        </nav>

        {/* ---------------------------------------------------
            MOBILE DONATE BUTTON
            --------------------------------------------------- */}

        <Link
          className="mobile-donate"
          href="/donations"
          onClick={closeMenu}
        >
          <span>{t.nav.supportChurch}</span>
          <ArrowRight size={16} />
        </Link>

        {/* ---------------------------------------------------
            DECORATIVE CROSS
            --------------------------------------------------- */}

        <div
          className="drawer-cross"
          aria-hidden="true"
        >
          ✝
        </div>
      </aside>
    </>
  );
}

/* =========================================================
   FOOTER
   ========================================================= */

export function Footer() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* -------------------------------------------------
              FOOTER BRAND
              ------------------------------------------------- */}

          <div>
            <div className="brand">
              <span className="brand-mark">✝</span>

              <span
                className="brand-copy"
                style={{ color: "#f8eadf" }}
              >
                {t.common.churchName}
                <span>{t.common.city}</span>
              </span>
            </div>

            <p>{t.footer.description}</p>
          </div>

          {/* -------------------------------------------------
              QUICK LINKS
              ------------------------------------------------- */}

          <div>
            <h3>{t.footer.quickLinks}</h3>

            <div className="footer-links">
              {links.slice(1).map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                >
                  {t.nav[label]}
                </Link>
              ))}
            </div>
          </div>

          {/* -------------------------------------------------
              VISIT US
              ------------------------------------------------- */}

          <div>
            <h3>{t.footer.visitUs}</h3>

            <div className="visit-item">
              <MapPin size={13} />

              <p>
                {t.footer.addressLine1}
                <br />
                {t.footer.addressLine2}
              </p>
            </div>

            <div className="visit-item">
              <Phone size={13} />

              <p>{t.footer.phone}</p>
            </div>

            <div className="visit-item">
              <Mail size={13} />

              <p>{t.footer.email}</p>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------
            COPYRIGHT
            --------------------------------------------------- */}

        <div className="copyright">
          {t.footer.copyright}
        </div>
      </div>
    </footer>
  );
}

/* =========================================================
   PAGE HERO
   ========================================================= */

export function PageHero({
  title,
  crumb,
}: {
  title: string;
  crumb: string;
}) {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <section className="page-hero">
      <div className="container">
        <div className="eyebrow">
          {t.pageHero.eyebrow}
        </div>

        <h1 className="serif">{title}</h1>

        <div className="breadcrumbs">
          {t.pageHero.home}
          <ArrowRight size={12} />
          {crumb}
        </div>
      </div>
    </section>
  );
}