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

/* ==========================================================================
   CONFIGURATION CONSTANTS
   Replace these values when your payment link or QR code image is ready.
   ========================================================================== */

/**
 * Replace this with your actual UPI deep link, payment page, or gateway URL:
 * e.g. "upi://pay?pa=arokiyanelsonpio@okaxis&pn=Our+Lady+of+Holy+Rosary+Church&am=150&cu=INR&tn=Mass+Intention"
 */
export const PAYMENT_LINK =
  "upi://pay?pa=arokiyanelsonpio@okaxis&pn=Our%20Lady%20of%20Holy%20Rosary%20Church&cu=INR&tn=Mass%20Intention";
/**
 * Place your QR code image inside the `public/images/` directory:
 * e.g. `public/images/mass-intention-qr.png`
 * The component will automatically display this image, or an elegant
 * placeholder if the file has not been uploaded yet.
 */
// QR code is generated dynamically from PAYMENT_LINK below.

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

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [intentionType, setIntentionType] = useState("General Prayer / பொதுவான கருத்து");
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
      setErrorMsg("Please enter your name / உங்கள் பெயரை உள்ளிடவும்.");
      return;
    }

    // 2. Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setErrorMsg("Please enter a valid email address / சரியான மின்னஞ்சல் முகவரியை உள்ளிடவும்.");
      return;
    }

    // 3. Validate Intention
    if (!intention.trim()) {
      setErrorMsg("Please enter your Mass intention / உங்கள் பூசைக்கருத்தை உள்ளிடவும்.");
      return;
    }

    // 4. Validate Word Count limit (50 words)
    if (wordCount > MAX_WORDS) {
      setErrorMsg(
        `Your intention contains ${wordCount} words. The maximum allowed is ${MAX_WORDS} words / உங்கள் கருத்து ${wordCount} சொற்களைக் கொண்டுள்ளது. அதிகபட்சம் ${MAX_WORDS} சொற்கள் மட்டுமே அனுமதிக்கப்படும்.`
      );
      return;
    }

    // 5. Validate prayer date and time
    if (!prayerDate || !prayerTime) {
      setErrorMsg(
        "Please select your prayer date and time / உங்கள் பிரார்த்தனை தேதியையும் நேரத்தையும் தேர்ந்தெடுக்கவும்."
      );
      return;
    }

    const selectedPrayerDateTime = new Date(`${prayerDate}T${prayerTime}`);
    const minimumAdvanceTime = new Date(Date.now() + 45 * 60 * 1000);

    if (
      Number.isNaN(selectedPrayerDateTime.getTime()) ||
      selectedPrayerDateTime.getTime() < minimumAdvanceTime.getTime()
    ) {
      setErrorMsg(
        "Prayer requests must be submitted at least 45 minutes before the selected prayer time. / தேர்ந்தெடுக்கப்பட்ட பிரார்த்தனை நேரத்திற்கு குறைந்தது 45 நிமிடங்களுக்கு முன்பாக கோரிக்கையைச் சமர்ப்பிக்க வேண்டும்."
      );
      return;
    }

    if (!receipt) {
      setErrorMsg(
        "Please upload your payment receipt / உங்கள் பணம் செலுத்திய ரசீதை பதிவேற்றவும்."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("email", email.trim());
      formData.append("phone", phone.trim());
      formData.append("intentionType", intentionType);
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
        throw new Error(
          result?.error ||
            "Something went wrong. Please try again / ஏதேனும் தவறு ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்."
        );
      }

      setIsSubmitted(true);
      window.scrollTo({ top: 120, behavior: "smooth" });
    } catch (error) {
      setErrorMsg(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again / ஏதேனும் தவறு ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setName("");
    setEmail("");
    setPhone("");
    setIntentionType("General Prayer / பொதுவான கருத்து");
    setIntention("");
    setPaymentRef("");
    setErrorMsg("");
    setIsSubmitted(false);
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  return (
    <main>
      {/* PAGE HERO WITH ADMIN LOGIN INSIDE THE BLUE SECTION */}
      <section className="page-hero">
        <div className="container">
          <div className="eyebrow">Our Lady of Holy Rosary Church</div>

          <h1 className="serif">Mass Intentions</h1>

          <div className="breadcrumbs">
            Home <ArrowRight size={12} style={{ verticalAlign: "middle" }} /> Prayer Request
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
    Admin Login
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
              <Sparkles size={14} /> Sacred Offering &middot; புனித காணிக்கை
              
            </div>
            

            <h1
              className="serif"
              style={{
                fontSize: "clamp(36px, 4.8vw, 56px)",
                color: "var(--blue-dark)",
                margin: "12px 0 6px",
                lineHeight: 1.1,
              }}
            >
              Mass Intentions
            </h1>
            

            <div
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "clamp(20px, 2.8vw, 28px)",
                color: "var(--gold)",
                fontWeight: 600,
                marginBottom: "16px",
                letterSpacing: "0.02em",
              }}
            >
              பூசைக்கருத்து
            </div>

            <p className="body-copy" style={{ fontSize: "16.5px", lineHeight: 1.85, maxWidth: "680px", margin: "0 auto" }}>
              Offer a Mass intention for your loved ones and special intentions.
              Please fill in the details below and complete the offering.
              <br />
              <span style={{ fontSize: "14.5px", color: "var(--muted)", fontStyle: "normal", display: "inline-block", marginTop: "6px" }}>
                உங்கள் அன்புக்குரியவர்களுக்காகவும் தனிப்பட்ட கருத்துக்களுக்காகவும் திருப்பலி நிறைவேற்றக் கீழே உள்ள விவரங்களை நிரப்பி காணிக்கையைச் செலுத்தவும்.
              </span>
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
                Submitted Successfully
              </div>

              <h2
                className="serif"
                style={{
                  fontSize: "clamp(26px, 3.5vw, 34px)",
                  color: "var(--blue-dark)",
                  marginBottom: "8px",
                }}
              >
                Your Mass intention has been submitted successfully. Thank you.
              </h2>

              <p
                style={{
                  fontSize: "18px",
                  fontWeight: 600,
                  color: "var(--gold)",
                  marginBottom: "20px",
                }}
              >
                உங்கள் பூசைக்கருத்து வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது. நன்றி.
              </p>

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
                    Intention Details
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
                    Offering: ₹{MASS_OFFERING_AMOUNT}
                  </span>
                </div>

                <div style={{ display: "grid", gap: "10px", fontSize: "14.5px" }}>
                  <div>
                    <span style={{ color: "var(--muted)" }}>Donor Name: </span>
                    <strong style={{ color: "var(--ink)" }}>{name}</strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--muted)" }}>Email: </span>
                    <span style={{ color: "var(--ink)" }}>{email}</span>
                  </div>
                  {phone && (
                    <div>
                      <span style={{ color: "var(--muted)" }}>Phone: </span>
                      <span style={{ color: "var(--ink)" }}>{phone}</span>
                    </div>
                  )}
                  <div>
                    <span style={{ color: "var(--muted)" }}>Intention Type: </span>
                    <span style={{ color: "var(--blue-deep)", fontWeight: 600 }}>{intentionType}</span>
                  </div>
                  <div style={{ borderTop: "1px dashed var(--line)", paddingTop: "10px" }}>
                    <span style={{ color: "var(--muted)", display: "block", marginBottom: "4px" }}>Intention / பூசைக்கருத்து:</span>
                    <p style={{ margin: 0, fontStyle: "italic", color: "var(--ink)", lineHeight: 1.6 }}>
                      &ldquo;{intention}&rdquo;
                    </p>
                  </div>
                  <div>
                    <span style={{ color: "var(--muted)" }}>Prayer Date / பிரார்த்தனை தேதி: </span>
                    <strong style={{ color: "var(--ink)" }}>{prayerDate}</strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--muted)" }}>Prayer Time / பிரார்த்தனை நேரம்: </span>
                    <strong style={{ color: "var(--ink)" }}>{prayerTime}</strong>
                  </div>
                  {paymentRef && (
                    <div style={{ borderTop: "1px dashed var(--line)", paddingTop: "10px" }}>
                      <span style={{ color: "var(--muted)" }}>Payment Reference / UTR: </span>
                      <code style={{ background: "white", padding: "2px 6px", borderRadius: "4px", border: "1px solid var(--line)" }}>
                        {paymentRef}
                      </code>
                    </div>
                  )}
                </div>
              </div>

              <p style={{ fontSize: "14px", color: "var(--muted)", lineHeight: 1.7, marginBottom: "30px" }}>
                <em>
                  Note: Your prayer intention has been noted and will be placed on the altar.
                  The church will verify the offering reference accordingly.
                </em>
              </p>

              <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                <button type="button" className="button" onClick={handleReset}>
                  Submit Another Intention
                </button>
                <Link href="/mass-timings" className="button outline" style={{ color: "var(--blue-deep)", borderColor: "var(--blue-deep)" }}>
                  View Mass Timings
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
                        Mass Offering &middot; திருப்பலி காணிக்கை
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
                        per Mass Intention
                      </span>
                    </div>

                    <p style={{ margin: 0, fontSize: "14px", color: "var(--muted)", lineHeight: 1.7 }}>
                      One Mass intention offering is ₹200. Your sacred contribution supports
                      the sanctuary, celebrant clergy, and parish mission.
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
                        Intention Information
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
                          Prayer Date / பிரார்த்தனை தேதி *
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
                          Prayer Time / பிரார்த்தனை நேரம் *
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
                          Submit at least 45 minutes before the selected prayer time.
                          <br />
                          தேர்ந்தெடுக்கப்பட்ட பிரார்த்தனை நேரத்திற்கு குறைந்தது 45 நிமிடங்களுக்கு முன்பாக கோரிக்கையைச் சமர்ப்பிக்க வேண்டும்.
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
                          <span>Name / பெயர் *</span>
                        </label>
                        <input
                          id={`${formId}-name`}
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Enter your name"
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

                      {/* FIELD 2: EMAIL */}
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
                          <span>Email / மின்னஞ்சல் *</span>
                        </label>
                        <input
                          id={`${formId}-email`}
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email"
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

                      {/* FIELD 3: PHONE */}
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
                          <span>Phone / தொலைபேசி எண் (Optional)</span>
                        </label>
                        <input
                          id={`${formId}-phone`}
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Enter your phone number (optional)"
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
                          Intention Type / கருத்து வகை
                        </label>
                        <select
                          id={`${formId}-type`}
                          value={intentionType}
                          onChange={(e) => setIntentionType(e.target.value)}
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
                          <option value="General Prayer / பொதுவான கருத்து">General Prayer / பொதுவான கருத்து</option>
                          <option value="Thanksgiving / நன்றி திருப்பலி">Thanksgiving / நன்றி திருப்பலி</option>
                          <option value="Repose of the Soul / ஆன்ம இளைப்பாற்றி">Repose of the Soul / ஆன்ம இளைப்பாற்றி</option>
                          <option value="Good Health & Healing / உடல் நலம் & குணமடைதல்">Good Health & Healing / உடல் நலம் & குணமடைதல்</option>
                          <option value="Birthday / திருமண / பிறந்தநாள் விழா">Birthday / Anniversary / பிறந்தநாள் / திருமண நாள்</option>
                          <option value="Special Family Intention / குடும்ப சிறப்பு கருத்து">Special Family Intention / குடும்ப சிறப்பு கருத்து</option>
                        </select>
                      </div>

                      {/* FIELD 4: MASS INTENTION TEXTAREA WITH LIVE 50-WORD COUNTER */}
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
                            Mass Intention / பூசைக்கருத்து *
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
                            {wordCount} / {MAX_WORDS} words
                          </span>
                        </div>

                        <textarea
                          id={`${formId}-intention`}
                          rows={5}
                          value={intention}
                          onChange={(e) => setIntention(e.target.value)}
                          placeholder="Write your prayer intention here... (Maximum 50 words) / உங்கள் பூசைக்கருத்தை இங்கு எழுதவும்..."
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
                              Word limit exceeded by {wordCount - MAX_WORDS} word(s). Please shorten your intention to 50 words or fewer.
                            </span>
                          </div>
                        ) : (
                          <span style={{ fontSize: "12px", color: "var(--muted)", display: "block", marginTop: "4px" }}>
                            Please keep your intention concise so it can be reverently read during Mass.
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
                      Offering Payment
                    </div>

                    <h2
                      className="serif"
                      style={{
                        margin: "0 0 4px",
                        fontSize: "26px",
                        color: "var(--blue-dark)",
                        lineHeight: 1.15,
                      }}
                    >
                      Complete Your Offering
                    </h2>

                    <div
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "19px",
                        fontWeight: 600,
                        color: "var(--gold)",
                        marginBottom: "16px",
                      }}
                    >
                      காணிக்கை செலுத்த
                    </div>

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

                    {/* QR CODE CONTAINER WITH FALLBACK */}
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
                      Scan the QR code to pay ₹{MASS_OFFERING_AMOUNT}
                    </p>

                    {/* OPTIONAL DIRECT PAYMENT LINK BUTTON */}
                    <div style={{ marginBottom: "24px" }}>
                      {PAYMENT_LINK  ? (
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
                          }}
                        >
                          Pay ₹{MASS_OFFERING_AMOUNT} <ExternalLink size={15} />
                        </a>
                      ) : (
                        <button
                          type="button"
                          className="button outline"
                          onClick={() =>
                            alert(
                              `Please scan the QR code above to make your ₹${MASS_OFFERING_AMOUNT} offering. (Note to administrator: set the PAYMENT_LINK constant in this file to link directly to your UPI app or payment gateway).`
                            )
                          }
                          style={{
                            width: "100%",
                            padding: "12px 18px",
                            fontSize: "13px",
                            color: "var(--blue-deep)",
                            borderColor: "var(--blue-deep)",
                            background: "rgba(4, 95, 128, 0.04)",
                          }}
                        >
                          Pay ₹{MASS_OFFERING_AMOUNT}
                        </button>
                      )}
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
                        Payment Receipt / பணம் செலுத்திய ரசீது *
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
                        Upload the receipt after paying ₹200. Accepted: JPG, PNG, WEBP, or PDF.
                        <br />
                        ₹200 செலுத்திய பிறகு ரசீதைப் பதிவேற்றவும். JPG, PNG, WEBP அல்லது PDF கோப்புகள் ஏற்கப்படும்.
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
                        Payment Reference / பரிவர்த்தனை எண்
                      </label>
                      <input
                        id={`${formId}-ref`}
                        type="text"
                        value={paymentRef}
                        onChange={(e) => setPaymentRef(e.target.value)}
                        placeholder="e.g. UPI Ref / UTR / Transaction No."
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
                        This helps the church identify and link your offering with your intention.
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
                      {isSubmitting ? (
                        "Submitting Intention..."
                      ) : (
                        <>Submit Intention / கருத்தை சமர்ப்பிக்க</>
                      )}
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
                      <span>Offered with reverence at Holy Mass</span>
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
                  Offering of the Holy Sacrifice
                </h3>
                <p style={{ margin: 0, fontSize: "14px", color: "var(--muted)", lineHeight: 1.7 }}>
                  In the Catholic tradition, having the Holy Sacrifice of the Mass offered
                  for someone is the highest form of prayer we can give for the living and
                  the dead.
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
                  Sacred Remembrance
                </h3>
                <p style={{ margin: 0, fontSize: "14px", color: "var(--muted)", lineHeight: 1.7 }}>
                  Your intention will be united with the prayers of the faithful during daily
                  and Sunday celebrations at Our Lady of Holy Rosary Church.
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
                  Parish Office Support
                </h3>
                <p style={{ margin: 0, fontSize: "14px", color: "var(--muted)", lineHeight: 1.7 }}>
                  For special feast date reservations or Gregorian Masses, please visit the parish office
                  at Town Hall Road or call <strong>0452-2343490</strong>.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
