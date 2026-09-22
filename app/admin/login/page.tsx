"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/browser";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabaseBrowser.auth.getSession().then(({ data }) => {
      if (data.session) router.replace("/admin/dashboard");
    });
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const { error: signInError } = await supabaseBrowser.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    router.replace("/admin/dashboard");
    router.refresh();
  }

  return (
    <main style={{ minHeight: "70vh", display: "grid", placeItems: "center", padding: "48px 20px" }}>
      <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: 420, padding: 32, border: "1px solid var(--line)", borderRadius: 18, background: "var(--white)", boxShadow: "0 20px 60px rgba(0,0,0,.08)" }}>
        <p className="eyebrow">Parish Administration</p>
        <h1 className="serif" style={{ color: "var(--blue-dark)", margin: "10px 0 8px" }}>Admin Login</h1>
        <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>Sign in to view and manage prayer requests.</p>

        <label style={{ display: "block", marginTop: 24, fontWeight: 600 }}>Email</label>
        <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} style={inputStyle} />

        <label style={{ display: "block", marginTop: 16, fontWeight: 600 }}>Password</label>
        <input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} style={inputStyle} />

        {error && <p role="alert" style={{ color: "#b42318", marginTop: 16 }}>{error}</p>}

        <button type="submit" disabled={loading} style={buttonStyle}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </main>
  );
}

const inputStyle = {
  width: "100%",
  marginTop: 8,
  padding: "12px 14px",
  border: "1px solid var(--line)",
  borderRadius: 10,
  background: "var(--white)",
  color: "var(--blue-dark)",
  outline: "none",
};

const buttonStyle = {
  width: "100%",
  marginTop: 24,
  padding: "13px 16px",
  border: 0,
  borderRadius: 10,
  background: "var(--blue-dark)",
  color: "white",
  fontWeight: 700,
  cursor: "pointer",
};
