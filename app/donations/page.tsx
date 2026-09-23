"use client";

import { useEffect, useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { PageHero } from "../components/site";
import { ArrowLeft, CheckCircle, Heart, Upload, ExternalLink } from "lucide-react";

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
const PAYEE_NAME = "Our Lady of Holy Rosary Church";

type Step = "form" | "pay" | "done";

type DonationForm = {
  name: string;
  email: string;
  phone: string;
  amount: string;
  purpose: string;
};

type Donor = {
  id?: string;
  donor_name?: string;
  name?: string;
  amount: number | string;
  created_at?: string;
  display_publicly?: boolean;
  payment_status?: string;
};

export default function Donations() {
  const [step, setStep] = useState<Step>("form");
  const [form, setForm] = useState<DonationForm>({
    name: "",
    email: "",
    phone: "",
    amount: "",
    purpose: "General Donation",
  });
  const [upiRef, setUpiRef] = useState("");
  const [receipt, setReceipt] = useState<File | null>(null);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const upiUrl = useMemo(() => {
    const params = new URLSearchParams({
      pa: UPI_ID,
      pn: PAYEE_NAME,
      am: form.amount,
      cu: "INR",
      tn: "Church Donation",
    });

    return `upi://pay?${params.toString()}`;
  }, [form.amount]);

  useEffect(() => {
    let active = true;

    async function loadDonors() {
      try {
        const response = await fetch("/api/donate?public=true", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) return;

        const result = await response.json();
        const rows = Array.isArray(result)
          ? result
          : Array.isArray(result.donations)
            ? result.donations
            : Array.isArray(result.data)
              ? result.data
              : [];

        if (active) {
          setDonors(rows);
        }
      } catch (loadError) {
        console.error("Unable to load public donors:", loadError);
      }
    }

    loadDonors();

    return () => {
      active = false;
    };
  }, []);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.amount ||
      Number(form.amount) < 1
    ) {
      setError("Please fill in all required fields with a valid amount.");
      return;
    }

    setError("");
    setStep("pay");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openUpiPayment() {
    window.location.href = upiUrl;
  }

  async function handleConfirmPayment() {
    if (!receipt) {
      setError("Please upload your payment screenshot before submitting.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("name", form.name.trim());
      formData.append("email", form.email.trim());
      formData.append("phone", form.phone.trim());
      formData.append("amount", form.amount);
      formData.append("purpose", form.purpose);
      formData.append("paymentRef", upiRef.trim());
      formData.append("receipt", receipt);
      formData.append("displayPublicly", "true");

      const response = await fetch("/api/donate", {
        method: "POST",
        body: formData,
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.error || "Unable to record your donation.");
      }

      setStep("done");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (submitError: unknown) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to record donation. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setStep("form");
    setForm({
      name: "",
      email: "",
      phone: "",
      amount: "",
      purpose: "General Donation",
    });
    setUpiRef("");
    setReceipt(null);
    setError("");
  }

  // The API already filters records to verified + publicly visible donations.
  // Do not filter again on the client because the GET response intentionally
  // returns only donor_name, amount, and created_at.
  const tickerDonors = donors.filter(
    (donor) =>
      Number.isFinite(Number(donor.amount)) && Number(donor.amount) > 0 &&
      Boolean(donor.donor_name || donor.name)
  );

  // Do not show a generic fallback. Show the ticker only when the API
  // returns verified donations with a donor name and valid amount.
  const tickerItems = tickerDonors.length > 0
    ? tickerDonors
    : [{
        id: "fallback-message",
        donor_name: "Thank you to everyone who supports our church",
        amount: 0,
        created_at: new Date().toISOString(),
      }];

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
            <div className="eyebrow">Donation Submitted</div>
            <h2 className="section-title">God Bless You, {form.name}!</h2>
            <p className="body-copy">
              Your donation of{" "}
              <strong style={{ color: "#2d7a2d", fontSize: "1.15em" }}>
                ₹{form.amount}
              </strong>{" "}
              for <strong>{form.purpose}</strong> has been submitted successfully.
              <br />Our team will verify your payment and update the donation status.
            </p>
            <button className="button" style={{ marginTop: 32 }} onClick={handleReset}>
              Make Another Donation
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="donation-page">
      <PageHero title="Support Our Mission" crumb="Donations" />
{/* Donor Acknowledgement Ticker */}
<section
  className="donor-ticker-section"
  aria-label="Donor acknowledgements"
>
  <div className="donor-ticker-wrapper">
    <div className="donor-ticker-track">
      {/* First scrolling set */}
      <div className="donor-ticker-content">
        <span className="donor-ticker-item thank-you-item">
          <span className="donor-heart">♥</span>
          Thank you for your support
        </span>

        {donors.map((donor, index) => (
          <span
            className="donor-ticker-item"
            key={`first-${donor.id ?? index}`}
          >
            <span className="donor-heart">♥</span>
            {donor.donor_name} donated ₹
            {Number(donor.amount).toLocaleString("en-IN")}
            <span className="donor-separator">|</span>
          </span>
        ))}
      </div>

      {/* Duplicate set for continuous scrolling */}
      <div className="donor-ticker-content" aria-hidden="true">
        <span className="donor-ticker-item thank-you-item">
          <span className="donor-heart">♥</span>
          Thank you for your support
        </span>

        {donors.map((donor, index) => (
          <span
            className="donor-ticker-item"
            key={`second-${donor.id ?? index}`}
          >
            <span className="donor-heart">♥</span>
            {donor.donor_name} donated ₹
            {Number(donor.amount).toLocaleString("en-IN")}
            <span className="donor-separator">|</span>
          </span>
        ))}
      </div>
    </div>
  </div>
</section>
      <section className="section">
        <div className="container">
          {/* Intro */}
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
              Your generous support helps sustain parish life, worship, education,
              church maintenance and practical care for our community.
            </p>
          </div>

          {/* Purpose cards */}
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
                onClick={() => setForm((previous) => ({ ...previous, purpose: item.title }))}
              >
                <div className="card-body">
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </div>
            ))}
          </div>

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
              <div className="donation-heading">
                <div className="donation-heading-icon">
                  <Heart size={23} strokeWidth={1.8} />
                </div>
                <div>
                  <h2>Donate via GPay / UPI</h2>
                  <p>Your contribution helps support our parish ministry.</p>
                </div>
              </div>

              {error && <div className="donation-error">{error}</div>}

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
                  <select className="field" name="purpose" value={form.purpose} onChange={handleChange}>
                    {PURPOSES.map((purpose) => (
                      <option key={purpose} value={purpose}>
                        {purpose}
                      </option>
                    ))}
                  </select>

                  <div style={{ gridColumn: "1 / -1", marginTop: 8 }}>
                    <p className="amount-label">Quick select amount</p>
                    <div className="quick-amounts">
                      {QUICK_AMOUNTS.map((amount) => {
                        const selected = form.amount === String(amount);
                        return (
                          <button
                            key={amount}
                            type="button"
                            className={`quick-amount ${selected ? "selected" : ""}`}
                            onClick={() => setForm((previous) => ({ ...previous, amount: String(amount) }))}
                          >
                            ₹{amount}
                          </button>
                        );
                      })}
                    </div>
                    <input
                      className="field"
                      type="number"
                      name="amount"
                      placeholder="Or enter amount (₹) *"
                      value={form.amount}
                      onChange={handleChange}
                      min={1}
                      step="0.01"
                      required
                    />
                  </div>

                  <button type="submit" className="button full" style={{ marginTop: 8 }}>
                    Proceed to Pay →
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === "pay" && (
            <div className="payment-card">
              <div className="eyebrow">Step 2 — Pay & Upload Receipt</div>
              <h2 style={{ margin: "4px 0 6px", fontSize: "1.6rem" }}>₹{form.amount}</h2>
              <p className="payment-help">
                Use the button below to open GPay or another supported UPI app. You can also scan the QR code.
              </p>

              <div className="qr-wrapper">
                <QRCodeSVG value={upiUrl} size={210} includeMargin />
              </div>

              <button type="button" className="button full gpay-button" onClick={openUpiPayment}>
                <ExternalLink size={17} /> Open GPay / UPI App
              </button>

              <div className="upi-box">
                <span>UPI ID: </span>
                <strong>{UPI_ID}</strong>
              </div>

              <div className="payment-summary">
                <div><strong>Name:</strong> {form.name}</div>
                <div><strong>Purpose:</strong> {form.purpose}</div>
                <div><strong>Amount:</strong> <span className="amount-highlight">₹{form.amount}</span></div>
              </div>

              <input
                className="field"
                placeholder="UPI Transaction ID / Reference (optional)"
                value={upiRef}
                onChange={(event) => setUpiRef(event.target.value)}
              />

              <label className="receipt-label" htmlFor="donation-receipt">
                <Upload size={17} /> Payment screenshot *
              </label>
              <input
                id="donation-receipt"
                className="field receipt-input"
                type="file"
                accept="image/png,image/jpeg,image/webp,application/pdf"
                onChange={(event) => setReceipt(event.target.files?.[0] ?? null)}
              />
              {receipt && <p className="file-name">Selected: {receipt.name}</p>}

              {error && <p className="payment-error">{error}</p>}

              <button type="button" className="button full" onClick={handleConfirmPayment} disabled={loading}>
                {loading ? "Submitting donation…" : "✓ I have completed the payment"}
              </button>

              <button type="button" className="back-button" onClick={() => setStep("form")}>
                <ArrowLeft size={14} /> Go back
              </button>
            </div>
          )}

          <div style={{ textAlign: "center", margin: "60px auto 0", maxWidth: 600 }}>
            <div className="eyebrow">Thank you</div>
            <h2 className="section-title">Every contribution matters</h2>
            <p className="body-copy">
              Your support, whether large or small, helps our parish continue its mission of faith, service and community.
            </p>
          </div>
        </div>
      </section>

      <style jsx global>{`
        /* Ensure the hero title remains readable over the blue background. */
        .donation-page .page-hero h1 {
          color: #ffffff !important;
          opacity: 1 !important;
          text-shadow: 0 2px 18px rgba(0, 0, 0, 0.16);
        }

        .donation-page .page-hero .eyebrow {
          color: #f2b84b !important;
        }

        .donor-ticker-section {
          width: 100%;
          padding: 12px 0 18px;
          background: transparent;
          overflow: hidden;
        }

        .donor-ticker-viewport {
          width: 100%;
          overflow: hidden;
          border-top: 1px solid rgba(181, 138, 58, 0.38);
          border-bottom: 1px solid rgba(181, 138, 58, 0.38);
          padding: 16px 0;
          background: transparent;
        }

        .donor-ticker-track {
          display: flex;
          width: max-content;
          animation: donorTickerRightToLeft 35s linear infinite;
          will-change: transform;
        }

        .donor-ticker-item,
        .donor-ticker-static {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
          color: #b58a3a;
          font-size: 0.96rem;
          font-weight: 600;
        }

        .donor-ticker-item {
          margin-right: 78px;
        }

        .donor-heart {
          color: #b58a3a;
          font-size: 1.15rem;
        }

        @keyframes donorTickerRightToLeft {
          from { transform: translateX(0); }
          to { transform: translateX(-33.333%); }
        }

        .donor-ticker-viewport:hover .donor-ticker-track {
          animation-play-state: paused;
        }

        .donation-heading {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 28px;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(13, 91, 115, 0.12);
        }

        .donation-heading-icon {
          width: 46px;
          height: 46px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: rgba(13, 91, 115, 0.1);
          color: #0d5b73;
          flex-shrink: 0;
        }

        .donation-heading h2 { margin: 0; color: #0d5b73; font-size: clamp(1.25rem, 2vw, 1.6rem); }
        .donation-heading p { margin: 5px 0 0; color: #6d777b; font-size: 0.9rem; }
        .donation-error { margin-bottom: 20px; padding: 12px 15px; border-radius: 10px; background: #fff1f1; border: 1px solid #f0caca; color: #a33a3a; font-size: 0.9rem; }
        .amount-label { margin: 0 0 12px; color: #52666d; font-size: 0.95rem; font-weight: 600; }
        .quick-amounts { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 16px; }
        .quick-amount { min-width: 82px; padding: 10px 18px; border-radius: 999px; border: 1.5px solid rgba(13, 91, 115, 0.35); background: #fff; color: #0d5b73; cursor: pointer; font-weight: 700; transition: 0.2s ease; }
        .quick-amount:hover, .quick-amount.selected { background: #0d5b73; color: #fff; border-color: #0d5b73; transform: translateY(-2px); }
        .payment-card { max-width: 500px; margin: 50px auto 0; background: var(--warm-white, #fffaf7); border-radius: 16px; padding: 40px 36px; box-shadow: 0 4px 32px rgba(0,0,0,0.08); text-align: center; }
        .payment-help { color: #666; margin-bottom: 24px; font-size: 0.95rem; }
        .qr-wrapper { display: inline-block; padding: 14px; background: #fff; border-radius: 14px; border: 1.5px solid #e2d9cf; margin-bottom: 18px; }
        .gpay-button { display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 16px; }
        .upi-box { background: #f5ede6; border-radius: 10px; padding: 12px 20px; margin-bottom: 20px; font-size: 0.9rem; color: #666; }
        .upi-box strong { color: #8b1c1c; font-family: monospace; }
        .payment-summary { text-align: left; background: #fff; border: 1px solid #e2d9cf; border-radius: 10px; padding: 14px 18px; margin-bottom: 16px; font-size: 0.9rem; color: #555; line-height: 1.9; }
        .amount-highlight { color: #2d7a2d; font-weight: 700; }
        .receipt-label { display: flex; align-items: center; gap: 8px; text-align: left; margin: 18px 0 8px; color: #174b5c; font-weight: 700; font-size: 0.9rem; }
        .receipt-input { padding: 10px; text-align: left; }
        .file-name { text-align: left; color: #2d7a2d; font-size: 0.82rem; overflow-wrap: anywhere; }
        .payment-error { color: crimson; margin: 12px 0; font-size: 0.9rem; }
        .back-button { display: flex; align-items: center; gap: 4px; margin: 16px auto 0; background: none; border: none; color: #666; cursor: pointer; font-size: 0.9rem; text-decoration: underline; }

        @media (max-width: 640px) {
          .payment-card { padding: 28px 18px; }
          .donor-ticker-item, .donor-ticker-static { font-size: 0.88rem; }
        }

        @media (prefers-reduced-motion: reduce) {
          .donor-ticker-track { animation: none; }
        }
      `}</style>
    </main>
  );
}
