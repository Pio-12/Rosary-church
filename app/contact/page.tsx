"use client";

import { FormEvent, useState } from "react";
import { Mail, MapPin, Phone, CheckCircle, AlertCircle } from "lucide-react";
import { PageHero } from "../components/site";
import { supabase } from "../../lib/supabase/client";
import { useLanguage } from "../components/LanguageProvider";
import { translations } from "@/lib/supabase/translations";

export default function Contact() {
  const { language } = useLanguage();
  const t = translations[language].contact;

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setSuccess(false);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const subject = String(formData.get("subject") || "").trim();
    const content = String(formData.get("content") || "").trim();

    if (!name || !email || !content) {
      setMessage(t.validationRequired);
      setSuccess(false);
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from("contact_messages")
      .insert({
        name,
        email,
        phone: phone || null,
        subject: subject || null,
        message: content,
        is_read: false,
      });

    if (error) {
      console.error("Contact form error:", error);
      setMessage(t.errorSending);
      setSuccess(false);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setMessage(t.successSending);
    form.reset();
    setLoading(false);
  }

  return (
    <main className="contact-page">
      <PageHero
        title={t.pageTitle}
        crumb={t.crumb}
      />

      <section className="section contact-section">
        <div className="container">
          <div className="contact-grid">
            {/* LEFT: CONTACT INFORMATION */}
            <div className="contact-information">
              <div className="eyebrow">{t.eyebrow}</div>

              <h2 className="section-title">
                {t.title}
              </h2>

              <p className="body-copy contact-intro">
                {t.intro}
              </p>

              <div className="contact-details">
                <div className="detail">
                  <div className="detail-icon">
                    <MapPin size={20} strokeWidth={1.8} />
                  </div>

                  <div className="detail-content">
                    <strong>{t.addressLabel}</strong>
                    <span style={{ whiteSpace: "pre-line" }}>
                      {t.addressText}
                    </span>
                  </div>
                </div>

                <div className="detail">
                  <div className="detail-icon">
                    <Phone size={20} strokeWidth={1.8} />
                  </div>

                  <div className="detail-content">
                    <strong>{t.phoneLabel}</strong>
                    <span>{t.phoneText}</span>
                  </div>
                </div>

                <div className="detail">
                  <div className="detail-icon">
                    <Mail size={20} strokeWidth={1.8} />
                  </div>

                  <div className="detail-content">
                    <strong>{t.emailLabel}</strong>
                    <span>{t.emailText}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: CONTACT FORM */}
            <div className="contact-panel">
              <div className="contact-panel-heading">
                <div className="eyebrow">{t.formEyebrow}</div>

                <h2>{t.formTitle}</h2>

                <p>
                  {t.formDesc}
                </p>
              </div>

              <form
                className="contact-form"
                onSubmit={handleSubmit}
              >
                <div className="form-grid">
                  <div className="form-field">
                    <label htmlFor="name">
                      {t.nameLabel} <span>*</span>
                    </label>

                    <input
                      id="name"
                      className="field"
                      name="name"
                      type="text"
                      placeholder={t.namePlaceholder}
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="email">
                      {t.emailInputLabel} <span>*</span>
                    </label>

                    <input
                      id="email"
                      className="field"
                      name="email"
                      type="email"
                      placeholder={t.emailPlaceholder}
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="phone">{t.phoneInputLabel}</label>

                    <input
                      id="phone"
                      className="field"
                      name="phone"
                      type="tel"
                      placeholder={t.phonePlaceholder}
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="subject">{t.subjectLabel}</label>

                    <select
                      id="subject"
                      className="field"
                      name="subject"
                      defaultValue=""
                    >
                      <option value="" disabled>
                        {t.subjectPlaceholder}
                      </option>

                      <option value="General enquiry">
                        {t.subjects.general}
                      </option>

                      <option value="Prayer request">
                        {t.subjects.prayer}
                      </option>

                      <option value="Mass enquiry">
                        {t.subjects.mass}
                      </option>

                      <option value="Other">
                        {t.subjects.other}
                      </option>
                    </select>
                  </div>

                  <div className="form-field form-field-full">
                    <label htmlFor="content">
                      {t.messageLabel} <span>*</span>
                    </label>

                    <textarea
                      id="content"
                      className="field textarea"
                      name="content"
                      placeholder={t.messagePlaceholder}
                      rows={6}
                      required
                    />
                  </div>

                  <div className="form-field-full">
                    <button
                      type="submit"
                      className="button contact-submit"
                      disabled={loading}
                    >
                      {loading ? t.sendingButton : t.sendButton}
                      {!loading && <span aria-hidden="true">→</span>}
                    </button>
                  </div>
                </div>
              </form>

              {message && (
                <div
                  className={`form-message ${
                    success ? "form-message-success" : "form-message-error"
                  }`}
                  role="status"
                  aria-live="polite"
                >
                  {success ? (
                    <CheckCircle size={18} />
                  ) : (
                    <AlertCircle size={18} />
                  )}

                  <span>{message}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}