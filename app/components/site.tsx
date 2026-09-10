"use client";

import Link from "next/link";
import {
  Menu,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  X,
} from "lucide-react";
import { useState } from "react";

const links = [
  ["Home", "/"],
  ["About", "/about"],
  ["History", "/history"],
  ["Mass Timings", "/mass-timings"],
  ["Readings", "/readings"],
  ["Events", "/events"],
  ["Gallery", "/gallery"],
  ["Virtual Tour", "/virtual-tour"],
  ["Contact", "/contact"],
];

/* =====================================================
   HEADER
===================================================== */

export function Header() {
  const [open, setOpen] = useState(false);

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

          {/* BRAND */}

          <Link
            className="brand"
            href="/"
            onClick={() => setOpen(false)}
          >
            <span className="brand-mark">
              ✝
            </span>

            <span className="brand-copy">
              Our Lady of Holy Rosary Church
              <span>Madurai</span>
            </span>
          </Link>

          {/* DESKTOP NAVIGATION */}

          <nav
            className={`desktop-links ${
              open ? "open" : ""
            }`}
          >

            {links.map(
              ([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() =>
                    setOpen(false)
                  }
                >
                  {label}
                </Link>
              )
            )}

          </nav>

          {/* DONATE */}

          <Link
            className="button nav-donate"
            href="/donations"
            onClick={() =>
              setOpen(false)
            }
          >
            Donate
          </Link>

          {/* MOBILE MENU */}

          <button
            className="mobile-toggle"
            aria-label={
              open
                ? "Close navigation"
                : "Open navigation"
            }
            aria-expanded={open}
            onClick={() =>
              setOpen(!open)
            }
          >
            {open ? (
              <X size={23} />
            ) : (
              <Menu size={23} />
            )}
          </button>

        </div>

      </header>
    </>
  );
}

/* =====================================================
   FOOTER
===================================================== */

export function Footer() {
  return (
    <footer className="footer">

      <div className="container">

        <div className="footer-grid">

          {/* CHURCH */}

          <div>

            <div className="brand">

              <span className="brand-mark">
                ✝
              </span>

              <span
                className="brand-copy"
                style={{
                  color: "#f8eadf",
                }}
              >
                Our Lady of Holy Rosary Church
                <span>Madurai</span>
              </span>

            </div>

            <p>
              For more than four centuries,
              a place of prayer, community and
              enduring faith.
            </p>

          </div>

          {/* QUICK LINKS */}

          <div>

            <h3>
              Quick Links
            </h3>

            <div className="footer-links">

              {links
                .slice(1)
                .map(
                  ([label, href]) => (
                    <Link
                      key={href}
                      href={href}
                    >
                      {label}
                    </Link>
                  )
                )}

            </div>

          </div>

          {/* VISIT US */}

          <div>

            <h3>
              Visit Us
            </h3>

            <p>
              <MapPin size={13} />
              Town Hall Road
              <br />
              Madurai, Tamil Nadu
              <br />
              625 001
            </p>

            <p>
              <Phone size={13} />
              0452-2343490
            </p>

            <p>
              <Mail size={13} />
              Holy Rosary Church
            </p>

          </div>

        </div>

        {/* COPYRIGHT */}

        <div className="copyright">
          © 2026 Our Lady of Holy Rosary Church,
          Madurai. All rights reserved.
        </div>

      </div>

    </footer>
  );
}

/* =====================================================
   PAGE HERO
===================================================== */

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

          <Link href="/">
            Home
          </Link>

          <ArrowRight
            size={12}
            style={{
              verticalAlign:
                "middle",
              margin:
                "0 6px",
            }}
          />

          {crumb}

        </div>

      </div>

    </section>
  );
}