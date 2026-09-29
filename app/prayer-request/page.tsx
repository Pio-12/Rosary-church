"use client";

import { useState, useId } from "react";
import Link from "next/link";
import {
  CheckCircle,
  ExternalLink,
  Heart,
  Calendar,
  AlertCircle,
  FileText,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useLanguage } from "../components/LanguageProvider";
import { translations } from "@/lib/supabase/translations";

/* ==========================================================================
   CONFIGURATION CONSTANTS
   ========================================================================== */

export const PAYMENT_LINK =
  "upi://pay?pa=martinlikesyou3@oksbi&pn=Our%20Lady%20of%20Holy%20Rosary%20Church&cu=INR&tn=Mass%20Intention";

/** Fixed offering amount per Mass intention */
export const MASS_OFFERING_AMOUNT = 200;

/** Maximum words allowed in the intention text */
export const MAX_WORDS = 50;

/* Helper function to count words */
function countWords(str: string): number {
  const trimmed = str.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).filter(Boolean).length;
}

export default function PrayerRequestPage() {
  const formId = useId();
  const { language } = useLanguage();
  const t = translations[language].prayerRequest;
  const tCommon = translations[language].common;
  const tNav = translations[language].nav;

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [intentionTypeKey, setIntentionTypeKey] = useState<
    "general" | "thanksgiving" | "soul" | "healing" | "birthday" | "wedding" | "special"
  >("general");
  const [intention, setIntention] = useState("");
  const [paymentRef, setPaymentRef] = useState("");
  const [prayerDate, setPrayerDate] = useState("");
  const [prayerTime, setPrayerTime] = useState("");
  const [receipt, setReceipt] = useState<File | null>(null);

  // UI State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Word count computation
  const wordCount = countWords(intention);
  const isOverWordLimit = wordCount > MAX_WORDS;

  // Validation & Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    // 1. Validate Name
    if (!name.trim()) {
      setErrorMsg(t.validationName);
      return;
    }

    // 2. Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setErrorMsg(t.validationEmail);
      return;
    }

    // 3. Validate Intention
    if (!intention.trim()) {
      setErrorMsg(t.validationIntention);
      return;
    }

    // 4. Validate Word Count limit (50 words)
    if (wordCount > MAX_WORDS) {
      setErrorMsg(t.validationWords.replace("{count}", String(wordCount)));
      return;
    }

    // 5. Validate prayer date and time
    if (!prayerDate || !prayerTime) {
      setErrorMsg(t.validationDateTime);
      return;
    }

    const selectedPrayerDateTime = new Date(`${prayerDate}T${prayerTime}`);
    const minimumAdvanceTime = new Date(Date.now() + 45 * 60 * 1000);

    if (
      Number.isNaN(selectedPrayerDateTime.getTime()) ||
      selectedPrayerDateTime.getTime() < minimumAdvanceTime.getTime()
    ) {
      setErrorMsg(t.validationAdvance);
      return;
    }

    if (!receipt) {
      setErrorMsg(t.validationReceipt);
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("email", email.trim());
      formData.append("phone", phone.trim());
      formData.append("intentionType", t.types[intentionTypeKey]);
      formData.append("intention", intention.trim());
      formData.append("paymentRef", paymentRef.trim());
      formData.append("prayerDateTime", selectedPrayerDateTime.toISOString());
      formData.append("amount", String(MASS_OFFERING_AMOUNT));
      formData.append("receipt", receipt);

      const response = await fetch("/api/prayer-request", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || t.validationGeneric);
      }

      setIsSubmitted(true);
      window.scrollTo({ top: 120, behavior: "smooth" });
    } catch (error) {
      setErrorMsg(
        error instanceof Error ? error.message : t.validationGeneric
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setName("");
    setEmail("");
    setPhone("");
    setIntentionTypeKey("general");
    setIntention("");
    setPaymentRef("");
    setReceipt(null);
    setErrorMsg("");
    setIsSubmitted(false);
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  return (
    <main>
      {/* PAGE HERO WITH ADMIN LOGIN INSIDE THE HERO SECTION */}
      <section className="page-hero">
        <div className="container">
          <div className="eyebrow">{tCommon.churchName}</div>

          <h1 className="serif">{t.pageTitle}</h1>

          <div className="breadcrumbs">
            {tNav.home} <ArrowRight size={12} style={{ verticalAlign: "middle" }} /> {t.crumb}
          </div>

          {/* ADMIN LOGIN BUTTON */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "30px",
              position: "relative",
              zIndex: 10,
            }}
          >
            <Link
              href="/admin/login"
              style={{
                position: "relative",
                zIndex: 11,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "13px 26px",
                borderRadius: "10px",
                background: "#ffffff",
                color: "#075f80",
                border: "1px solid rgba(255, 255, 255, 0.85)",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "14px",
                fontWeight: 700,
                letterSpacing: "0.02em",
                textDecoration: "none",
                boxShadow: "0 6px 18px rgba(0, 0, 0, 0.14)",
                transition: "all 0.3s ease",
                cursor: "pointer",
                pointerEvents: "auto",
              }}
            >
              {t.adminLogin}
            </Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: "60px", paddingBottom: "100px" }}>
        <div className="container">

          {/* WELCOME / HEADING AREA */}
          <div
            style={{
              textAlign: "center",
              maxWidth: 780,
              margin: "0 auto 50px",
            }}
          >
            <div className="eyebrow" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <Sparkles size={14} /> {t.sacredOffering}
            </div>

            <h1
              className="serif"
              style={{
                fontSize: "clamp(36px, 4.8vw, 56px)",
                color: "var(--blue-dark)",
                margin: "12px 0 16px",
                lineHeight: 1.1,
              }}
            >
              {t.title}
            </h1>

            <p className="body-copy" style={{ fontSize: "16.5px", lineHeight: 1.85, maxWidth: "680px", margin: "0 auto" }}>
              {t.subtitle} {t.instruction}
            </p>
          </div>

          {/* ══════════════════════════════════════════════════════
              SUCCESS STATE
          ══════════════════════════════════════════════════════ */}
          {isSubmitted ? (
            <div
              style={{
                maxWidth: 680,
                margin: "0 auto",
                background: "var(--white)",
                border: "1px solid var(--line)",
                borderRadius: "16px",
                padding: "48px 36px",
                textAlign: "center",
                boxShadow: "0 18px 50px rgba(4, 95, 128, 0.08)",
              }}
            >
              <div
                style={{
                  width: "72px",
                  height: "72px",
                  borderRadius: "50%",
                  background: "rgba(45, 122, 45, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                }}
              >
                <CheckCircle size={44} color="#2d7a2d" />
              </div>

              <div
                className="eyebrow"
                style={{
                  color: "#2d7a2d",
                  marginBottom: "8px",
                  fontSize: "12px",
                }}
              >
                {t.successBadge}
              </div>

              <h2
                className="serif"
                style={{
                  fontSize: "clamp(26px, 3.5vw, 34px)",
                  color: "var(--blue-dark)",
                  marginBottom: "16px",
                }}
              >
                {t.successTitle}
              </h2>

              {/* SUMMARY RECEIPT */}
              <div
                style={{
                  background: "var(--paper)",
                  border: "1px solid var(--line)",
                  borderRadius: "12px",
                  padding: "24px 28px",
                  textAlign: "left",
                  margin: "28px 0",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid var(--line)",
                    paddingBottom: "12px",
                    marginBottom: "14px",
                  }}
                >
                  <span style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--blue-deep)", fontWeight: 700 }}>
                    {t.summaryTitle}
                  </span>
                  <span
                    style={{
                      background: "rgba(4, 95, 128, 0.08)",
                      color: "var(--blue-deep)",
                      padding: "4px 10px",
                      borderRadius: "12px",
                      fontSize: "12px",
                      fontWeight: 600,
                    }}
                  >
                    {t.summaryOffering} ₹{MASS_OFFERING_AMOUNT}
                  </span>
                </div>

                <div style={{ display: "grid", gap: "10px", fontSize: "14.5px" }}>
                  <div>
                    <span style={{ color: "var(--muted)" }}>{t.summaryDonor} </span>
                    <strong style={{ color: "var(--ink)" }}>{name}</strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--muted)" }}>{t.summaryEmail} </span>
                    <span style={{ color: "var(--ink)" }}>{email}</span>
                  </div>
                  {phone && (
                    <div>
                      <span style={{ color: "var(--muted)" }}>{t.summaryPhone} </span>
                      <span style={{ color: "var(--ink)" }}>{phone}</span>
                    </div>
                  )}
                  <div>
                    <span style={{ color: "var(--muted)" }}>{t.summaryType} </span>
                    <span style={{ color: "var(--blue-deep)", fontWeight: 600 }}>{t.types[intentionTypeKey]}</span>
                  </div>
                  <div style={{ borderTop: "1px dashed var(--line)", paddingTop: "10px" }}>
                    <span style={{ color: "var(--muted)", display: "block", marginBottom: "4px" }}>{t.summaryIntention}</span>
                    <p style={{ margin: 0, fontStyle: "italic", color: "var(--ink)", lineHeight: 1.6 }}>
                      &ldquo;{intention}&rdquo;
                    </p>
                  </div>
                  <div>
                    <span style={{ color: "var(--muted)" }}>{t.summaryDate} </span>
                    <strong style={{ color: "var(--ink)" }}>{prayerDate}</strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--muted)" }}>{t.summaryTime} </span>
                    <strong style={{ color: "var(--ink)" }}>{prayerTime}</strong>
                  </div>
                  {paymentRef && (
                    <div style={{ borderTop: "1px dashed var(--line)", paddingTop: "10px" }}>
                      <span style={{ color: "var(--muted)" }}>{t.summaryRef} </span>
                      <code style={{ background: "white", padding: "2px 6px", borderRadius: "4px", border: "1px solid var(--line)" }}>
                        {paymentRef}
                      </code>
                    </div>
                  )}
                </div>
              </div>

              <p style={{ fontSize: "14px", color: "var(--muted)", lineHeight: 1.7, marginBottom: "30px" }}>
                <em>{t.successNote}</em>
              </p>

              <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                <button type="button" className="button" onClick={handleReset}>
                  {t.submitAnother}
                </button>
                <Link href="/mass-timings" className="button outline" style={{ color: "var(--blue-deep)", borderColor: "var(--blue-deep)" }}>
                  {t.viewMassTimings}
                </Link>
              </div>
            </div>
          ) : (
            /* ══════════════════════════════════════════════════════
               TWO-COLUMN CARD LAYOUT (LEFT: FORM & INFO, RIGHT: PAYMENT & QR)
            ══════════════════════════════════════════════════════ */
            <form onSubmit={handleSubmit}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                  gap: "36px",
                  alignItems: "start",
                }}
              >

                {/* ──────────────────────────────────────────────────
                    LEFT COLUMN: MASS INTENTION DETAILS & OFFERING INFO
                ────────────────────────────────────────────────── */}
                <div style={{ display: "grid", gap: "28px" }}>

                  {/* 1. MASS OFFERING INFO CALLOUT */}
                  <div
                    style={{
                      background: "linear-gradient(135deg, rgba(7, 137, 181, 0.07), rgba(196, 154, 58, 0.10))",
                      border: "1.5px solid rgba(196, 154, 58, 0.35)",
                      borderRadius: "14px",
                      padding: "24px 28px",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        right: "-10px",
                        bottom: "-15px",
                        fontSize: "90px",
                        color: "rgba(196, 154, 58, 0.08)",
                        fontFamily: "Georgia, serif",
                        pointerEvents: "none",
                        lineHeight: 1,
                      }}
                    >
                      ✝
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                      <Calendar size={18} color="var(--gold)" />
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: 700,
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          color: "var(--blue-deep)",
                        }}
                      >
                        {t.offeringCalloutBadge}
                      </span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: "10px",
                        margin: "10px 0 6px",
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        className="serif"
                        style={{
                          fontSize: "36px",
                          fontWeight: 600,
                          color: "var(--blue-dark)",
                          lineHeight: 1,
                        }}
                      >
                        ₹{MASS_OFFERING_AMOUNT}
                      </span>
                      <span
                        style={{
                          fontSize: "16px",
                          fontWeight: 600,
                          color: "var(--gold)",
                        }}
                      >
                        {t.offeringAmountText}
                      </span>
                    </div>

                    <p style={{ margin: 0, fontSize: "14px", color: "var(--muted)", lineHeight: 1.7 }}>
                      {t.offeringDesc}
                    </p>
                  </div>

                  {/* 2. INTENTION FORM CARD */}
                  <div
                    style={{
                      background: "var(--white)",
                      border: "1px solid var(--line)",
                      borderRadius: "16px",
                      padding: "36px 32px",
                      boxShadow: "0 10px 35px rgba(4, 95, 128, 0.05)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                      <FileText size={20} color="var(--blue)" />
                      <h2
                        className="serif"
                        style={{
                          margin: 0,
                          fontSize: "24px",
                          color: "var(--blue-deep)",
                        }}
                      >
                        {t.formCardTitle}
                      </h2>
                    </div>

                    <div style={{ display: "grid", gap: "20px" }}>

                      {/* FIELD 1: PRAYER DATE */}
                      <div className="form-group">
                        <label
                          htmlFor={`${formId}-prayer-date`}
                          style={{
                            display: "block",
                            color: "var(--blue-deep)",
                            fontSize: "12px",
                            fontWeight: 600,
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            marginBottom: "6px",
                          }}
                        >
                          {t.prayerDateLabel} *
                        </label>
                        <input
                          id={`${formId}-prayer-date`}
                          type="date"
                          value={prayerDate}
                          min={new Date().toLocaleDateString("en-CA")}
                          onChange={(e) => setPrayerDate(e.target.value)}
                          required
                          style={{
                            border: "1px solid var(--line)",
                            borderRadius: "8px",
                            padding: "14px 16px",
                            fontSize: "15px",
                            outline: "none",
                            width: "100%",
                            background: "white",
                          }}
                        />
                      </div>

                      {/* FIELD 2: PRAYER TIME */}
                      <div className="form-group">
                        <label
                          htmlFor={`${formId}-prayer-time`}
                          style={{
                            display: "block",
                            color: "var(--blue-deep)",
                            fontSize: "12px",
                            fontWeight: 600,
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            marginBottom: "6px",
                          }}
                        >
                          {t.prayerTimeLabel} *
                        </label>
                        <input
                          id={`${formId}-prayer-time`}
                          type="time"
                          value={prayerTime}
                          onChange={(e) => setPrayerTime(e.target.value)}
                          required
                          style={{
                            border: "1px solid var(--line)",
                            borderRadius: "8px",
                            padding: "14px 16px",
                            fontSize: "15px",
                            outline: "none",
                            width: "100%",
                            background: "white",
                          }}
                        />
                        <p
                          style={{
                            fontSize: "12px",
                            color: "var(--muted)",
                            lineHeight: 1.6,
                            marginTop: "7px",
                            marginBottom: 0,
                          }}
                        >
                          {t.validationAdvance}
                        </p>
                      </div>

                      {/* FIELD 3: NAME */}
                      <div className="form-group">
                        <label
                          htmlFor={`${formId}-name`}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            color: "var(--blue-deep)",
                            fontSize: "12px",
                            fontWeight: 600,
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                          }}
                        >
                          <span>{t.fullNameLabel} *</span>
                        </label>
                        <input
                          id={`${formId}-name`}
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder={t.fullNamePlaceholder}
                          required
                          style={{
                            border: "1px solid var(--line)",
                            borderRadius: "8px",
                            padding: "14px 16px",
                            fontSize: "15px",
                            outline: "none",
                            width: "100%",
                            background: "white",
                          }}
                        />
                      </div>

                      {/* FIELD 4: EMAIL */}
                      <div className="form-group">
                        <label
                          htmlFor={`${formId}-email`}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            color: "var(--blue-deep)",
                            fontSize: "12px",
                            fontWeight: 600,
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                          }}
                        >
                          <span>{t.emailLabel} *</span>
                        </label>
                        <input
                          id={`${formId}-email`}
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder={t.emailPlaceholder}
                          required
                          style={{
                            border: "1px solid var(--line)",
                            borderRadius: "8px",
                            padding: "14px 16px",
                            fontSize: "15px",
                            outline: "none",
                            width: "100%",
                            background: "white",
                          }}
                        />
                      </div>

                      {/* FIELD 5: PHONE */}
                      <div className="form-group">
                        <label
                          htmlFor={`${formId}-phone`}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            color: "var(--blue-deep)",
                            fontSize: "12px",
                            fontWeight: 600,
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                          }}
                        >
                          <span>{t.phoneLabel}</span>
                        </label>
                        <input
                          id={`${formId}-phone`}
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder={t.phonePlaceholder}
                          style={{
                            border: "1px solid var(--line)",
                            borderRadius: "8px",
                            padding: "14px 16px",
                            fontSize: "15px",
                            outline: "none",
                            width: "100%",
                            background: "white",
                          }}
                        />
                      </div>

                      {/* INTENTION CATEGORY */}
                      <div className="form-group">
                        <label
                          htmlFor={`${formId}-type`}
                          style={{
                            color: "var(--blue-deep)",
                            fontSize: "12px",
                            fontWeight: 600,
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                          }}
                        >
                          {t.intentionTypeLabel}
                        </label>
                        <select
                          id={`${formId}-type`}
                          value={intentionTypeKey}
                          onChange={(e) =>
                            setIntentionTypeKey(
                              e.target.value as "general" | "thanksgiving" | "soul" | "healing" | "birthday" | "wedding" | "special"
                            )
                          }
                          style={{
                            border: "1px solid var(--line)",
                            borderRadius: "8px",
                            padding: "14px 16px",
                            fontSize: "14.5px",
                            outline: "none",
                            width: "100%",
                            background: "white",
                          }}
                        >
                          <option value="general">{t.types.general}</option>
                          <option value="thanksgiving">{t.types.thanksgiving}</option>
                          <option value="soul">{t.types.soul}</option>
                          <option value="healing">{t.types.healing}</option>
                          <option value="birthday">{t.types.birthday}</option>
                          <option value="wedding">{t.types.wedding}</option>
                          <option value="special">{t.types.special}</option>
                        </select>
                      </div>

                      {/* FIELD 6: MASS INTENTION TEXTAREA WITH LIVE 50-WORD COUNTER */}
                      <div className="form-group">
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "4px",
                          }}
                        >
                          <label
                            htmlFor={`${formId}-intention`}
                            style={{
                              color: "var(--blue-deep)",
                              fontSize: "12px",
                              fontWeight: 600,
                              letterSpacing: "0.06em",
                              textTransform: "uppercase",
                            }}
                          >
                            {t.intentionDetailsLabel} *
                          </label>

                          {/* LIVE WORD COUNTER */}
                          <span
                            style={{
                              fontSize: "12.5px",
                              fontWeight: 700,
                              fontFamily: "monospace",
                              padding: "2px 8px",
                              borderRadius: "6px",
                              background: isOverWordLimit
                                ? "rgba(220, 38, 38, 0.12)"
                                : wordCount >= 40
                                ? "rgba(217, 119, 6, 0.12)"
                                : "rgba(4, 95, 128, 0.08)",
                              color: isOverWordLimit
                                ? "#dc2626"
                                : wordCount >= 40
                                ? "#b45309"
                                : "var(--blue-deep)",
                              transition: "all 0.2s ease",
                            }}
                          >
                            {wordCount} / {MAX_WORDS} {t.wordCount}
                          </span>
                        </div>

                        <textarea
                          id={`${formId}-intention`}
                          rows={5}
                          value={intention}
                          onChange={(e) => setIntention(e.target.value)}
                          placeholder={t.intentionPlaceholder}
                          required
                          style={{
                            border: `1.5px solid ${isOverWordLimit ? "#dc2626" : "var(--line)"}`,
                            borderRadius: "8px",
                            padding: "16px",
                            fontSize: "15px",
                            lineHeight: 1.6,
                            outline: "none",
                            width: "100%",
                            minHeight: "135px",
                            resize: "vertical",
                            background: isOverWordLimit ? "#fff8f8" : "white",
                            transition: "border-color 0.2s ease, background 0.2s ease",
                          }}
                        />

                        {/* HELPER & WARNING TEXT */}
                        {isOverWordLimit ? (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                              color: "#dc2626",
                              fontSize: "13px",
                              marginTop: "6px",
                            }}
                          >
                            <AlertCircle size={15} />
                            <span>
                              {t.validationWords.replace("{count}", String(wordCount))}
                            </span>
                          </div>
                        ) : (
                          <span style={{ fontSize: "12px", color: "var(--muted)", display: "block", marginTop: "4px" }}>
                            {t.maxWordsNote}
                          </span>
                        )}
                      </div>

                    </div>
                  </div>

                </div>

                {/* ──────────────────────────────────────────────────
                    RIGHT COLUMN: DEDICATED PAYMENT & QR CODE CARD
                ────────────────────────────────────────────────── */}
                <div style={{ display: "grid", gap: "24px" }}>

                  <div
                    style={{
                      background: "var(--white)",
                      border: "1.5px solid var(--line)",
                      borderRadius: "16px",
                      padding: "36px 30px",
                      boxShadow: "0 12px 40px rgba(4, 95, 128, 0.08)",
                      textAlign: "center",
                      position: "sticky",
                      top: "95px",
                    }}
                  >

                    {/* CARD HEADER */}
                    <div className="eyebrow" style={{ marginBottom: "6px" }}>
                      {t.paymentCardTitle}
                    </div>

                    <h2
                      className="serif"
                      style={{
                        margin: "0 0 16px",
                        fontSize: "26px",
                        color: "var(--blue-dark)",
                        lineHeight: 1.15,
                      }}
                    >
                      {t.completeOffering}
                    </h2>

                    {/* PROMINENT AMOUNT BADGE */}
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "baseline",
                        justifyContent: "center",
                        gap: "6px",
                        background: "rgba(4, 95, 128, 0.06)",
                        border: "1px solid rgba(4, 95, 128, 0.15)",
                        borderRadius: "12px",
                        padding: "10px 24px",
                        margin: "0 auto 20px",
                      }}
                    >
                      <span
                        className="serif"
                        style={{
                          fontSize: "38px",
                          fontWeight: 600,
                          color: "var(--blue-deep)",
                          lineHeight: 1,
                        }}
                      >
                        ₹{MASS_OFFERING_AMOUNT}
                      </span>
                      <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--muted)" }}>
                        INR
                      </span>
                    </div>

                    {/* QR CODE CONTAINER */}
                    <div
                      style={{
                        position: "relative",
                        margin: "0 auto 16px",
                        width: "220px",
                        height: "220px",
                        background: "var(--paper)",
                        border: "2px dashed var(--line)",
                        borderRadius: "14px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "16px",
                        boxSizing: "border-box",
                        overflow: "hidden",
                      }}
                    >
                      <QRCodeSVG
                        value={PAYMENT_LINK}
                        size={188}
                        bgColor="#ffffff"
                        fgColor="#000000"
                        level="H"
                      />
                    </div>

                    {/* TEXT UNDER QR */}
                    <p
                      style={{
                        fontSize: "14.5px",
                        fontWeight: 600,
                        color: "var(--blue-deep)",
                        margin: "0 0 16px",
                      }}
                    >
                      {t.scanToPay.replace("{amount}", String(MASS_OFFERING_AMOUNT))}
                    </p>

                    {/* DIRECT PAYMENT LINK BUTTON */}
                    <div style={{ marginBottom: "24px" }}>
                      <a
                        href={PAYMENT_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="button"
                        style={{
                          width: "100%",
                          padding: "13px 20px",
                          fontSize: "13px",
                          display: "inline-flex",
                          gap: "8px",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {t.payAmount.replace("{amount}", String(MASS_OFFERING_AMOUNT))} <ExternalLink size={15} />
                      </a>
                    </div>

                    {/* PAYMENT RECEIPT UPLOAD */}
                    <div
                      style={{
                        borderTop: "1px solid var(--line)",
                        paddingTop: "20px",
                        marginTop: "20px",
                        textAlign: "left",
                      }}
                    >
                      <label
                        htmlFor={`${formId}-receipt`}
                        style={{
                          display: "block",
                          color: "var(--blue-deep)",
                          fontSize: "11.5px",
                          fontWeight: 700,
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          marginBottom: "6px",
                        }}
                      >
                        {t.receiptUploadLabel} *
                      </label>
                      <input
                        id={`${formId}-receipt`}
                        type="file"
                        accept="image/*,.pdf,application/pdf"
                        required
                        onChange={(e) => setReceipt(e.target.files?.[0] ?? null)}
                        style={{
                          border: "1px solid var(--line)",
                          borderRadius: "8px",
                          padding: "12px 14px",
                          fontSize: "14px",
                          outline: "none",
                          width: "100%",
                          background: "white",
                        }}
                      />
                      <span
                        style={{
                          display: "block",
                          fontSize: "11.5px",
                          color: "var(--muted)",
                          marginTop: "6px",
                          lineHeight: 1.4,
                        }}
                      >
                        {t.receiptNote}
                      </span>
                    </div>

                    {/* PAYMENT CONFIRMATION SECTION */}
                    <div
                      style={{
                        borderTop: "1px solid var(--line)",
                        paddingTop: "20px",
                        textAlign: "left",
                      }}
                    >
                      <label
                        htmlFor={`${formId}-ref`}
                        style={{
                          display: "block",
                          color: "var(--blue-deep)",
                          fontSize: "11.5px",
                          fontWeight: 700,
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          marginBottom: "6px",
                        }}
                      >
                        {t.paymentRefLabel}
                      </label>
                      <input
                        id={`${formId}-ref`}
                        type="text"
                        value={paymentRef}
                        onChange={(e) => setPaymentRef(e.target.value)}
                        placeholder={t.paymentRefPlaceholder}
                        style={{
                          border: "1px solid var(--line)",
                          borderRadius: "8px",
                          padding: "12px 14px",
                          fontSize: "14px",
                          outline: "none",
                          width: "100%",
                          background: "white",
                        }}
                      />
                      <span
                        style={{
                          display: "block",
                          fontSize: "11.5px",
                          color: "var(--muted)",
                          marginTop: "6px",
                          lineHeight: 1.4,
                        }}
                      >
                        {t.paymentRefDesc}
                      </span>
                    </div>

                    {/* ERROR MESSAGE DISPLAY */}
                    {errorMsg && (
                      <div
                        style={{
                          background: "rgba(220, 38, 38, 0.08)",
                          border: "1px solid rgba(220, 38, 38, 0.25)",
                          borderRadius: "8px",
                          padding: "12px 14px",
                          color: "#b91c1c",
                          fontSize: "13px",
                          marginTop: "18px",
                          textAlign: "left",
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "8px",
                        }}
                      >
                        <AlertCircle size={16} style={{ flexShrink: 0, marginTop: "2px" }} />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    {/* SUBMIT BUTTON */}
                    <button
                      type="submit"
                      disabled={isSubmitting || isOverWordLimit}
                      className="button full"
                      style={{
                        marginTop: "22px",
                        padding: "16px",
                        fontSize: "14px",
                        fontWeight: 700,
                        letterSpacing: "0.05em",
                        opacity: isSubmitting || isOverWordLimit ? 0.65 : 1,
                        cursor: isSubmitting || isOverWordLimit ? "not-allowed" : "pointer",
                      }}
                    >
                      {isSubmitting ? t.submittingButton : t.submitButton}
                    </button>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                        marginTop: "14px",
                        fontSize: "11.5px",
                        color: "var(--muted)",
                      }}
                    >
                      <Heart size={12} color="var(--gold)" />
                      <span>{t.reverenceNote}</span>
                    </div>

                  </div>

                </div>

              </div>
            </form>
          )}

          {/* ══════════════════════════════════════════════════════
              DEVOTIONAL INSTRUCTION & SCRIPTURE SECTION
          ══════════════════════════════════════════════════════ */}
          <div
            style={{
              marginTop: "70px",
              borderTop: "1px solid var(--line)",
              paddingTop: "50px",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "28px",
              }}
            >
              <div
                style={{
                  background: "var(--white)",
                  border: "1px solid var(--line)",
                  borderRadius: "12px",
                  padding: "26px",
                }}
              >
                <div style={{ fontSize: "20px", color: "var(--gold)", marginBottom: "8px" }}>✝</div>
                <h3
                  className="serif"
                  style={{
                    margin: "0 0 8px",
                    fontSize: "20px",
                    color: "var(--blue-deep)",
                  }}
                >
                  {t.card1Title}
                </h3>
                <p style={{ margin: 0, fontSize: "14px", color: "var(--muted)", lineHeight: 1.7 }}>
                  {t.card1Desc}
                </p>
              </div>

              <div
                style={{
                  background: "var(--white)",
                  border: "1px solid var(--line)",
                  borderRadius: "12px",
                  padding: "26px",
                }}
              >
                <div style={{ fontSize: "20px", color: "var(--gold)", marginBottom: "8px" }}>🕊️</div>
                <h3
                  className="serif"
                  style={{
                    margin: "0 0 8px",
                    fontSize: "20px",
                    color: "var(--blue-deep)",
                  }}
                >
                  {t.card2Title}
                </h3>
                <p style={{ margin: 0, fontSize: "14px", color: "var(--muted)", lineHeight: 1.7 }}>
                  {t.card2Desc}
                </p>
              </div>

              <div
                style={{
                  background: "var(--white)",
                  border: "1px solid var(--line)",
                  borderRadius: "12px",
                  padding: "26px",
                }}
              >
                <div style={{ fontSize: "20px", color: "var(--gold)", marginBottom: "8px" }}>🏛️</div>
                <h3
                  className="serif"
                  style={{
                    margin: "0 0 8px",
                    fontSize: "20px",
                    color: "var(--blue-deep)",
                  }}
                >
                  {t.card3Title}
                </h3>
                <p style={{ margin: 0, fontSize: "14px", color: "var(--muted)", lineHeight: 1.7 }}>
                  {t.card3Desc}
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
