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
import { useState } from "react";

const links = [
  ["Home", "/"],
  ["About", "/about"],
  ["Mass Timings", "/mass-timings"],
  ["Readings", "/readings"],
  ["Events", "/events"],
  ["Gallery", "/gallery"],
  ["Contact", "/contact"],
];

export function Header() {
  const [open, setOpen] = useState(false);

  const closeMenu = () => {
    setOpen(false);
  };

  return (
    <>
      {/* TOP BAR */}
      <div className="topbar">
        <div className="container">
          A living heritage of faith, hope and love in Madurai
        </div>
      </div>

      {/* HEADER */}
      <header className="header">
        <div className="container nav">

          {/* LOGO */}
          <Link
            className="brand"
            href="/"
            onClick={closeMenu}
          >
            <span className="brand-mark">✝</span>

            <span className="brand-copy">
              Our Lady of Holy Rosary Church
              <span>Madurai</span>
            </span>
          </Link>

          {/* =========================
              DESKTOP NAVIGATION
             ========================= */}
          <nav className="desktop-nav">
            {links.map(([label, href]) => (
              <Link key={href} href={href}>
                {label}
              </Link>
            ))}
          </nav>

          {/* DESKTOP DONATE */}
          <Link
            className="button desktop-donate"
            href="/donations"
          >
            Donate
          </Link>

          {/* =========================
              MOBILE MENU BUTTON
             ========================= */}
          <button
            className="mobile-toggle"
            type="button"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* =========================
          MOBILE BACKDROP
         ========================= */}
      <div
        className={`mobile-backdrop ${
          open ? "mobile-backdrop-visible" : ""
        }`}
        onClick={closeMenu}
      />

      {/* =========================
          MOBILE SIDE DRAWER
         ========================= */}
      <aside
        className={`mobile-drawer ${
          open ? "mobile-drawer-open" : ""
        }`}
      >
        {/* DRAWER HEADER */}
        <div className="mobile-drawer-header">
          <div>
            <span className="mobile-drawer-eyebrow">
              Our Church
            </span>

            <span className="mobile-drawer-title">
              Navigation
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

        {/* LINKS */}
        <nav className="mobile-nav">
          {links.map(([label, href], index) => (
            <Link
              key={href}
              href={href}
              onClick={closeMenu}
              style={
                {
                  "--mobile-delay": `${index * 70}ms`,
                } as React.CSSProperties
              }
            >
              <span>{label}</span>

              <ArrowRight size={17} />
            </Link>
          ))}
        </nav>

        {/* DONATE */}
        <Link
          className="mobile-donate"
          href="/donations"
          onClick={closeMenu}
        >
          <span>Support Our Church</span>
          <ArrowRight size={16} />
        </Link>

        {/* DECORATIVE CROSS */}
        <div className="drawer-cross">✝</div>
      </aside>
    </>
  );
}

/* =========================================================
   FOOTER
   ========================================================= */

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">

          <div>
            <div className="brand">
              <span className="brand-mark">✝</span>

              <span
                className="brand-copy"
                style={{ color: "#f8eadf" }}
              >
                Our Lady of Holy Rosary Church
                <span>Madurai</span>
              </span>
            </div>

            <p>
              For more than four centuries, a place of prayer,
              community and enduring faith.
            </p>
          </div>

          <div>
            <h3>Quick Links</h3>

            <div className="footer-links">
              {links.slice(1).map(([label, href]) => (
                <Link key={href} href={href}>
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3>Visit Us</h3>

            <div className="visit-item">
              <MapPin size={13} />

              <p>
                Town Hall Road
                <br />
                Madurai, Tamil Nadu
              </p>
            </div>

            <div className="visit-item">
              <Phone size={13} />

              <p>0452-2343490</p>
            </div>

            <div className="visit-item">
              <Mail size={13} />

              <p>Contact the parish</p>
            </div>
          </div>

        </div>

        <div className="copyright">
          © 2026 Our Lady of Holy Rosary Church, Madurai.
          All rights reserved.
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
  return (
    <section className="page-hero">
      <div className="container">

        <div className="eyebrow">
          Our Lady of Holy Rosary Church
        </div>

        <h1 className="serif">
          {title}
        </h1>

        <div className="breadcrumbs">
          Home

          <ArrowRight
            size={12}
          />

          {crumb}
        </div>

      </div>
    </section>
  );
}