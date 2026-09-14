"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { PageHero } from "../components/site";
import { CheckCircle, Heart, ArrowLeft } from "lucide-react";

const donationOptions = [
  {
    title: "Church Maintenance",
    text: "Help us preserve and maintain our historic church and its sacred spaces.",
  },
  {
    title: "Charity",
    text: "Support families, individuals and neighbours in need within our community.",
  },
  {
    title: "Education",
    text: "Support educational activities and help children grow in knowledge and faith.",
  },
  {
    title: "Feast Celebrations",
    text: "Help make our parish feasts and community celebrations possible.",
  },
];

const PURPOSES = [
  "General Donation",
  "Church Maintenance",
  "Charity",
  "Education",
  "Feast Celebrations",
];

const QUICK_AMOUNTS = [100, 200, 500, 1000, 2000, 5000];

const UPI_ID = "arokiyanelsonpio@okaxis";
const PAYEE_NAME = "Our+Lady+of+Holy+Rosary+Church";

type Step = "form" | "pay" | "done";

interface FormState {
  name: string;
  email: string;
  phone: string;
  amount: string;
  purpose: string;
}

export default function Donations() {
  const [step, setStep] = useState<Step>("form");
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    amount: "",
    purpose: "General Donation",
  });
  const [upiRef, setUpiRef] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const upiUrl = `upi://pay?pa=${UPI_ID}&pn=${PAYEE_NAME}&am=${form.amount}&cu=INR&tn=Church+Donation`;

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.amount || Number(form.amount) < 1) {
      setError("Please fill in all required fields with a valid amount.");
      return;
    }
    setError("");
    setStep("pay");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleConfirmPayment() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/donate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, upiRef }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setStep("done");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to record donation. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setStep("form");
    setForm({ name: "", email: "", phone: "", amount: "", purpose: "General Donation" });
    setUpiRef("");
    setError("");
  }

  // ── DONE ─────────────────────────────────────────────────────────────────
  if (step === "done") {
    return (
<main className="donation-page">
          <PageHero title="Thank You" crumb="Donations" />
        <section className="section">
          <div
            className="container"
            style={{ textAlign: "center", maxWidth: 560, margin: "0 auto" }}
          >
            <CheckCircle
              size={72}
              color="#2d7a2d"
              style={{ margin: "0 auto 24px", display: "block" }}
            />
            <div className="eyebrow">Donation Confirmed</div>
            <h2 className="section-title">God Bless You, {form.name}!</h2>
            <p className="body-copy">
              Your generous donation of{" "}
              <strong style={{ color: "#2d7a2d", fontSize: "1.15em" }}>
                ₹{form.amount}
              </strong>{" "}
              for <strong>{form.purpose}</strong> has been recorded.
              <br />A confirmation email has been sent to{" "}
              <strong>{form.email}</strong>.
            </p>
            <button
              className="button"
              style={{ marginTop: 32 }}
              onClick={handleReset}
            >
              Make Another Donation
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <PageHero title="Support Our Mission" crumb="Donations" />

      <section className="section">
        <div className="container">
          {/* ── Intro ── */}
          <div
            style={{
              textAlign: "center",
              maxWidth: 650,
              margin: "0 auto 42px",
            }}
          >
            <div className="eyebrow">Your generosity helps us continue</div>
            <h2 className="section-title">Give with a faithful heart</h2>
            <p className="body-copy">
              Your generous support helps sustain parish life, worship,
              education, church maintenance and practical care for our community.
            </p>
          </div>

          {/* ── Purpose Cards ── */}
          <div className="cards-grid">
            {donationOptions.map((item) => (
              <div
                className="card"
                key={item.title}
                style={{
                  cursor: "pointer",
                  outline:
                    form.purpose === item.title ? "2px solid #8b1c1c" : "none",
                  transition: "outline 0.2s",
                }}
                onClick={() =>
                  setForm((p) => ({ ...p, purpose: item.title }))
                }
              >
                <div className="card-body">
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ══════════════════════════════════════════
    STEP 1 — DONATION FORM
══════════════════════════════════════════ */}
{step === "form" && (
  <div
    style={{
      maxWidth: 720,
      width: "100%",
      margin: "50px auto 0",
      background: "#fffdf9",
      border: "1px solid rgba(13, 91, 115, 0.12)",
      borderRadius: 24,
      padding: "40px",
      boxShadow: "0 18px 50px rgba(13, 91, 115, 0.10)",
    }}
  >
    {/* FORM HEADING */}
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 28,
        paddingBottom: 20,
        borderBottom: "1px solid rgba(13, 91, 115, 0.12)",
      }}
    >
      <div
        style={{
          width: 46,
          height: 46,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          background: "rgba(13, 91, 115, 0.10)",
          color: "#0d5b73",
          flexShrink: 0,
        }}
      >
        <Heart size={23} strokeWidth={1.8} />
      </div>

      <div>
        <h2
          style={{
            margin: 0,
            color: "#0d5b73",
            fontSize: "clamp(1.25rem, 2vw, 1.6rem)",
            fontWeight: 700,
            lineHeight: 1.3,
          }}
        >
          Donate via GPay / UPI
        </h2>

        <p
          style={{
            margin: "5px 0 0",
            color: "#6d777b",
            fontSize: "0.9rem",
          }}
        >
          Your contribution helps support our parish ministry.
        </p>
      </div>
    </div>

    {/* ERROR MESSAGE */}
    {error && (
      <div
        style={{
          marginBottom: 20,
          padding: "12px 15px",
          borderRadius: 10,
          background: "#fff1f1",
          border: "1px solid #f0caca",
          color: "#a33a3a",
          fontSize: "0.9rem",
        }}
      >
        {error}
      </div>
    )}

    <form onSubmit={handleFormSubmit}>
      <div className="form-grid">
        {/* NAME */}
        <input
          className="field"
          name="name"
          placeholder="Full Name *"
          value={form.name}
          onChange={handleChange}
          required
          style={{
            color: "#174b5c",
            background: "#ffffff",
            borderColor: "rgba(13, 91, 115, 0.20)",
          }}
        />

        {/* EMAIL */}
        <input
          className="field"
          type="email"
          name="email"
          placeholder="Email Address *"
          value={form.email}
          onChange={handleChange}
          required
          style={{
            color: "#174b5c",
            background: "#ffffff",
            borderColor: "rgba(13, 91, 115, 0.20)",
          }}
        />

        {/* PHONE */}
        <input
          className="field"
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          style={{
            color: "#174b5c",
            background: "#ffffff",
            borderColor: "rgba(13, 91, 115, 0.20)",
          }}
        />

        {/* PURPOSE */}
        <select
          className="field"
          name="purpose"
          value={form.purpose}
          onChange={handleChange}
          style={{
            color: "#174b5c",
            background: "#ffffff",
            borderColor: "rgba(13, 91, 115, 0.20)",
          }}
        >
          {PURPOSES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        {/* QUICK AMOUNTS */}
        <div
          style={{
            gridColumn: "1 / -1",
            marginTop: 8,
          }}
        >
          <p
            style={{
              margin: "0 0 12px",
              color: "#52666d",
              fontSize: "0.95rem",
              fontWeight: 600,
            }}
          >
            Quick select amount
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              marginBottom: 16,
            }}
          >
            {QUICK_AMOUNTS.map((amt) => {
              const isSelected = form.amount === String(amt);

              return (
                <button
                  key={amt}
                  type="button"
                  onClick={() =>
                    setForm((p) => ({
                      ...p,
                      amount: String(amt),
                    }))
                  }
                  style={{
                    minWidth: 82,
                    padding: "10px 18px",
                    borderRadius: 999,
                    border: isSelected
                      ? "1.5px solid #0d5b73"
                      : "1.5px solid rgba(13, 91, 115, 0.35)",
                    background: isSelected
                      ? "#0d5b73"
                      : "#ffffff",
                    color: isSelected
                      ? "#ffffff"
                      : "#0d5b73",
                    cursor: "pointer",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    transition:
                      "background 0.2s ease, color 0.2s ease, transform 0.2s ease, border-color 0.2s ease",
                  }}
                  onMouseEnter={(event) => {
                    event.currentTarget.style.background = "#0d5b73";
                    event.currentTarget.style.color = "#ffffff";
                    event.currentTarget.style.borderColor = "#0d5b73";
                    event.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(event) => {
                    event.currentTarget.style.background = isSelected
                      ? "#0d5b73"
                      : "#ffffff";
                    event.currentTarget.style.color = isSelected
                      ? "#ffffff"
                      : "#0d5b73";
                    event.currentTarget.style.borderColor = isSelected
                      ? "#0d5b73"
                      : "rgba(13, 91, 115, 0.35)";
                    event.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  ₹{amt}
                </button>
              );
            })}
          </div>

          {/* CUSTOM AMOUNT */}
          <input
            className="field"
            type="number"
            name="amount"
            placeholder="Or enter amount (₹) *"
            value={form.amount}
            onChange={handleChange}
            min={1}
            required
            style={{
              color: "#174b5c",
              background: "#ffffff",
              borderColor: "rgba(13, 91, 115, 0.20)",
            }}
          />
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          className="button full"
          disabled={loading}
          style={{
            background: loading ? "#7c9ba5" : "#0d5b73",
            color: "#ffffff",
            border: "none",
            marginTop: 8,
            transition:
              "background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease",
          }}
          onMouseEnter={(event) => {
            if (!loading) {
              event.currentTarget.style.background = "#08465a";
              event.currentTarget.style.transform = "translateY(-2px)";
              event.currentTarget.style.boxShadow =
                "0 8px 20px rgba(13, 91, 115, 0.22)";
            }
          }}
          onMouseLeave={(event) => {
            event.currentTarget.style.background = loading
              ? "#7c9ba5"
              : "#0d5b73";
            event.currentTarget.style.transform = "translateY(0)";
            event.currentTarget.style.boxShadow = "none";
          }}
        >
          {loading ? "Sending..." : "Proceed to Pay →"}
        </button>
      </div>
    </form>
  </div>
)}

          {/* ══════════════════════════════════════════
              STEP 2 — QR CODE PAYMENT
          ══════════════════════════════════════════ */}
          {step === "pay" && (
            <div
              style={{
                maxWidth: 480,
                margin: "50px auto 0",
                background: "var(--warm-white, #fffaf7)",
                borderRadius: 16,
                padding: "40px 36px",
                boxShadow: "0 4px 32px rgba(0,0,0,0.08)",
                textAlign: "center",
              }}
            >
              <div className="eyebrow">Step 2 — Scan &amp; Pay</div>
              <h2 style={{ margin: "4px 0 6px", fontSize: "1.6rem" }}>
                ₹{form.amount}
              </h2>
              <p style={{ color: "#666", marginBottom: 28, fontSize: "0.95rem" }}>
                Open GPay, PhonePe, Paytm or any UPI app and scan the QR code
                below
              </p>

              {/* QR Code */}
              <div
                style={{
                  display: "inline-block",
                  padding: 18,
                  background: "white",
                  borderRadius: 14,
                  border: "1.5px solid #e2d9cf",
                  marginBottom: 24,
                }}
              >
                <QRCodeSVG value={upiUrl} size={210} />
              </div>

              {/* UPI ID display */}
              <div
                style={{
                  background: "#f5ede6",
                  borderRadius: 10,
                  padding: "12px 20px",
                  marginBottom: 24,
                  fontSize: "0.9rem",
                }}
              >
                <span style={{ color: "#666" }}>UPI ID: </span>
                <strong style={{ fontFamily: "monospace", color: "#8b1c1c" }}>
                  {UPI_ID}
                </strong>
              </div>

              {/* Summary */}
              <div
                style={{
                  textAlign: "left",
                  background: "white",
                  border: "1px solid #e2d9cf",
                  borderRadius: 10,
                  padding: "14px 18px",
                  marginBottom: 20,
                  fontSize: "0.9rem",
                  color: "#555",
                }}
              >
                <div>
                  <strong>Name:</strong> {form.name}
                </div>
                <div style={{ marginTop: 4 }}>
                  <strong>Purpose:</strong> {form.purpose}
                </div>
                <div style={{ marginTop: 4 }}>
                  <strong>Amount:</strong>{" "}
                  <span style={{ color: "#2d7a2d", fontWeight: 700 }}>
                    ₹{form.amount}
                  </span>
                </div>
              </div>

              {/* UPI Ref input */}
              <input
                className="field"
                placeholder="UPI Transaction ID / Reference (optional)"
                value={upiRef}
                onChange={(e) => setUpiRef(e.target.value)}
                style={{ marginBottom: 16, textAlign: "left" }}
              />

              {error && (
                <p style={{ color: "crimson", marginBottom: 12 }}>{error}</p>
              )}

              <button
                className="button full"
                onClick={handleConfirmPayment}
                disabled={loading}
              >
                {loading ? "Recording donation…" : "✓  I have completed the payment"}
              </button>

              <button
                type="button"
                onClick={() => setStep("form")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  margin: "16px auto 0",
                  background: "none",
                  border: "none",
                  color: "#666",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  textDecoration: "underline",
                }}
              >
                <ArrowLeft size={14} /> Go back
              </button>
            </div>
          )}

          {/* Bottom copy */}
          <div
            style={{
              textAlign: "center",
              marginTop: 60,
              maxWidth: 600,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <div className="eyebrow">Thank you</div>
            <h2 className="section-title">Every contribution matters</h2>
            <p className="body-copy">
              Your support, whether large or small, helps our parish continue its
              mission of faith, service and community.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
