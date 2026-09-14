"use client";

import { FormEvent, useState } from "react";
import { Mail, MapPin, Phone, CheckCircle, AlertCircle } from "lucide-react";
import { PageHero } from "../components/site";
import { supabase } from "../../lib/supabase/client";

export default function Contact() {
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
      setMessage("Please fill in all required fields.");
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
      setMessage("Unable to send your message. Please try again.");
      setSuccess(false);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setMessage("Thank you. Your message has been sent successfully.");
    form.reset();
    setLoading(false);
  }

  return (
    <main className="contact-page">
      <PageHero
        title="Contact"
        crumb="Contact"
      />

      <section className="section contact-section">
        <div className="container">
          <div className="contact-grid">
            {/* LEFT: CONTACT INFORMATION */}
            <div className="contact-information">
              <div className="eyebrow">WE ARE HERE FOR YOU</div>

              <h2 className="section-title">
                Come visit us
              </h2>

              <p className="body-copy contact-intro">
                Whether you have a question, need prayer, or simply want to
                say hello, our parish team would be glad to hear from you.
              </p>

              <div className="contact-details">
                <div className="detail">
                  <div className="detail-icon">
                    <MapPin size={20} strokeWidth={1.8} />
                  </div>

                  <div className="detail-content">
                    <strong>Address</strong>
                    <span>
                      Town Hall Road
                      <br />
                      Madurai, Tamil Nadu - 625001
                    </span>
                  </div>
                </div>

                <div className="detail">
                  <div className="detail-icon">
                    <Phone size={20} strokeWidth={1.8} />
                  </div>

                  <div className="detail-content">
                    <strong>Phone</strong>
                    <span>0452-2343490</span>
                  </div>
                </div>

                <div className="detail">
                  <div className="detail-icon">
                    <Mail size={20} strokeWidth={1.8} />
                  </div>

                  <div className="detail-content">
                    <strong>Email</strong>
                    <span>Contact the parish office</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: CONTACT FORM */}
            <div className="contact-panel">
              <div className="contact-panel-heading">
                <div className="eyebrow">GET IN TOUCH</div>

                <h2>Send us a message</h2>

                <p>
                  We would be happy to hear from you. Please complete the form
                  below and our parish team will get back to you.
                </p>
              </div>

              <form
                className="contact-form"
                onSubmit={handleSubmit}
              >
                <div className="form-grid">
                  <div className="form-field">
                    <label htmlFor="name">
                      Name <span>*</span>
                    </label>

                    <input
                      id="name"
                      className="field"
                      name="name"
                      type="text"
                      placeholder="Enter your name"
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="email">
                      Email <span>*</span>
                    </label>

                    <input
                      id="email"
                      className="field"
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="phone">Phone</label>

                    <input
                      id="phone"
                      className="field"
                      type="tel"
                      name="phone"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="subject">Subject</label>

                    <select
                      id="subject"
                      className="field"
                      name="subject"
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Select a subject
                      </option>

                      <option value="General enquiry">
                        General enquiry
                      </option>

                      <option value="Prayer request">
                        Prayer request
                      </option>

                      <option value="Mass enquiry">
                        Mass enquiry
                      </option>

                      <option value="Other">
                        Other
                      </option>
                    </select>
                  </div>

                  <div className="form-field form-field-full">
                    <label htmlFor="content">
                      Message <span>*</span>
                    </label>

                    <textarea
                      id="content"
                      className="field textarea"
                      name="content"
                      placeholder="Write your message here..."
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
                      {loading ? "Sending..." : "Send message"}
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