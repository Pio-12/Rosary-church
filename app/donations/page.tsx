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
      <main>
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
                maxWidth: 560,
                margin: "50px auto 0",
                background: "var(--warm-white, #fffaf7)",
                borderRadius: 16,
                padding: "40px 36px",
                boxShadow: "0 4px 32px rgba(0,0,0,0.08)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 24,
                }}
              >
                <Heart size={22} color="#8b1c1c" />
                <h2 style={{ margin: 0, fontSize: "1.35rem" }}>
                  Donate via GPay / UPI
                </h2>
              </div>

              {error && (
                <p style={{ color: "crimson", marginBottom: 16 }}>{error}</p>
              )}

              <form onSubmit={handleFormSubmit}>
                <div className="form-grid">
                  <input
                    className="field"
                    name="name"
                    placeholder="Full Name *"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                  <input
                    className="field"
                    type="email"
                    name="email"
                    placeholder="Email Address *"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                  <input
                    className="field"
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={form.phone}
                    onChange={handleChange}
                  />
                  <select
                    className="field"
                    name="purpose"
                    value={form.purpose}
                    onChange={handleChange}
                  >
                    {PURPOSES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>

                  {/* Quick amounts */}
                  <div style={{ gridColumn: "1 / -1" }}>
                    <p
                      style={{
                        margin: "0 0 8px",
                        fontSize: "0.85rem",
                        color: "#666",
                      }}
                    >
                      Quick select amount
                    </p>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 8,
                        marginBottom: 12,
                      }}
                    >
                      {QUICK_AMOUNTS.map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() =>
                            setForm((p) => ({ ...p, amount: String(amt) }))
                          }
                          style={{
                            padding: "6px 16px",
                            borderRadius: 20,
                            border: "1.5px solid #8b1c1c",
                            background:
                              form.amount === String(amt)
                                ? "#8b1c1c"
                                : "transparent",
                            color:
                              form.amount === String(amt) ? "white" : "#8b1c1c",
                            cursor: "pointer",
                            fontWeight: 600,
                            fontSize: "0.9rem",
                            transition: "all 0.15s",
                          }}
                        >
                          ₹{amt}
                        </button>
                      ))}
                    </div>
                    <input
                      className="field"
                      type="number"
                      name="amount"
                      placeholder="Or enter amount (₹) *"
                      value={form.amount}
                      onChange={handleChange}
                      min={1}
                      required
                    />
                  </div>

                  <button type="submit" className="button full">
                    Proceed to Pay →
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
