"use client";

import { FormEvent, useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
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
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("contact_messages").insert({
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
      setLoading(false);
      return;
    }

    setSuccess(true);
    setMessage("Thank you. Your message has been sent successfully.");
    form.reset();
    setLoading(false);
  }

  return (
    <main>
      <PageHero title="Contact" crumb="Contact" />

      <section className="section">
        <div className="container contact-grid">
          {/* Contact Information */}
          <div>
            <div className="eyebrow">We are here for you</div>

            <h2 className="section-title">Come visit us</h2>

            <p className="body-copy">
              Whether you have a question, need prayer or simply want to say
              hello, our parish team would be glad to hear from you.
            </p>

            <div className="detail">
              <MapPin size={18} />
              <div>
                <strong>Address</strong>
                <span>
                  Town Hall Road
                  <br />
                  Madurai, Tamil Nadu - 625001
                </span>
              </div>
            </div>

            <div className="detail">
              <Phone size={18} />
              <div>
                <strong>Phone</strong>
                <span>0452-2343490</span>
              </div>
            </div>

            <div className="detail">
              <Mail size={18} />
              <div>
                <strong>Email</strong>
                <span>Contact the parish office</span>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-panel">
            <h2>Send us a message</h2>

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <input
                  className="field"
                  name="name"
                  placeholder="Name*"
                  required
                />

                <input
                  className="field"
                  type="email"
                  name="email"
                  placeholder="Email*"
                  required
                />

                <input
                  className="field"
                  type="tel"
                  name="phone"
                  placeholder="Phone"
                />

                <select
                  className="field"
                  name="subject"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Subject
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

                <textarea
                  className="field textarea full"
                  name="content"
                  placeholder="Your message..."
                  required
                />

                <button
                  type="submit"
                  className="button full"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send message"}
                </button>
              </div>
            </form>

            {message && (
              <p
                style={{
                  marginTop: "16px",
                  color: success ? "green" : "crimson",
                }}
              >
                {message}
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}