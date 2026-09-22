"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/browser";

type PrayerRequest = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  intention_type: string | null;
  intention: string;
  payment_ref: string | null;
  prayer_date_time: string;
  amount: number;
  receipt_path: string | null;
  status: "new" | "reviewed" | "completed" | "rejected";
};

export default function AdminDashboard() {
  const router = useRouter();
  const [requests, setRequests] = useState<PrayerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadRequests() {
    setLoading(true);
    setError("");

    const { data: sessionData } = await supabaseBrowser.auth.getSession();
    if (!sessionData.session) {
      router.replace("/admin/login");
      return;
    }

    const { data, error: queryError } = await supabaseBrowser
      .from("prayer_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (queryError) setError(queryError.message);
    else setRequests((data ?? []) as PrayerRequest[]);

    setLoading(false);
  }

  useEffect(() => {
    loadRequests();

    const channel = supabaseBrowser
      .channel("prayer-request-updates")
      .on("postgres_changes", { event: "*", schema: "public", table: "prayer_requests" }, loadRequests)
      .subscribe();

    return () => {
      supabaseBrowser.removeChannel(channel);
    };
  }, []);

  async function logout() {
    await supabaseBrowser.auth.signOut();
    router.replace("/admin/login");
  }

  async function updateStatus(id: string, status: PrayerRequest["status"]) {
    const { error: updateError } = await supabaseBrowser
      .from("prayer_requests")
      .update({ status })
      .eq("id", id);

    if (updateError) setError(updateError.message);
    else setRequests((current) => current.map((item) => item.id === id ? { ...item, status } : item));
  }

  async function openReceipt(path: string | null) {
    if (!path) return;

    const { data: sessionData } = await supabaseBrowser.auth.getSession();
    const accessToken = sessionData.session?.access_token;
    if (!accessToken) {
      router.replace("/admin/login");
      return;
    }

    const response = await fetch("/api/admin/receipt-url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ path }),
    });

    const result = await response.json();
    if (!response.ok) {
      setError(result.error || "Unable to open receipt.");
      return;
    }

    window.open(result.url, "_blank", "noopener,noreferrer");
  }

  return (
    <main style={{ padding: "40px 20px 90px" }}>
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
          <div>
            <p className="eyebrow">Parish Administration</p>
            <h1 className="serif" style={{ color: "var(--blue-dark)", margin: "8px 0" }}>Prayer Requests</h1>
            <p style={{ color: "var(--muted)" }}>View submitted requests, receipts and processing status.</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={loadRequests} style={secondaryButton}>Refresh</button>
            <button onClick={logout} style={primaryButton}>Sign out</button>
          </div>
        </div>

        {error && <p role="alert" style={{ color: "#b42318", marginTop: 20 }}>{error}</p>}

        {loading ? <p style={{ marginTop: 30 }}>Loading requests...</p> : requests.length === 0 ? <p style={{ marginTop: 30 }}>No prayer requests found.</p> : (
          <div style={{ display: "grid", gap: 18, marginTop: 30 }}>
            {requests.map((request) => (
              <article key={request.id} style={{ padding: 24, border: "1px solid var(--line)", borderRadius: 16, background: "var(--white)", boxShadow: "0 10px 30px rgba(0,0,0,.05)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                  <div>
                    <h2 style={{ margin: 0, color: "var(--blue-dark)", fontSize: 21 }}>{request.name}</h2>
                    <p style={{ margin: "6px 0 0", color: "var(--muted)", fontSize: 14 }}>{new Date(request.created_at).toLocaleString("en-IN")}</p>
                  </div>
                  <select value={request.status} onChange={(event) => updateStatus(request.id, event.target.value as PrayerRequest["status"])} style={selectStyle}>
                    <option value="new">New</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="completed">Completed</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div style={detailsGrid}>
                  <Detail label="Email" value={request.email} />
                  <Detail label="Phone" value={request.phone || "Not provided"} />
                  <Detail label="Prayer date" value={new Date(request.prayer_date_time).toLocaleString("en-IN")} />
                  <Detail label="Amount" value={`₹${request.amount}`} />
                  <Detail label="Intention type" value={request.intention_type || "Not provided"} />
                  <Detail label="Payment reference" value={request.payment_ref || "Not provided"} />
                </div>

                <div style={{ marginTop: 20, padding: 16, borderRadius: 12, background: "var(--surface, #f7f8fa)" }}>
                  <strong>Prayer intention</strong>
                  <p style={{ whiteSpace: "pre-wrap", margin: "8px 0 0", lineHeight: 1.7 }}>{request.intention}</p>
                </div>

                <button disabled={!request.receipt_path} onClick={() => openReceipt(request.receipt_path)} style={{ ...secondaryButton, marginTop: 16 }}>
                  View payment receipt
                </button>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div><small style={{ color: "var(--muted)" }}>{label}</small><div style={{ marginTop: 4, fontWeight: 600 }}>{value}</div></div>;
}

const detailsGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 18, marginTop: 22 };
const selectStyle = { padding: "9px 12px", border: "1px solid var(--line)", borderRadius: 9, background: "var(--white)" };
const primaryButton = { border: 0, borderRadius: 9, padding: "11px 16px", background: "var(--blue-dark)", color: "white", cursor: "pointer", fontWeight: 700 };
const secondaryButton = { border: "1px solid var(--line)", borderRadius: 9, padding: "10px 14px", background: "var(--white)", color: "var(--blue-dark)", cursor: "pointer", fontWeight: 700 };
