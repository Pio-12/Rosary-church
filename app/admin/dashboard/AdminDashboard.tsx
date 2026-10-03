"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  Filter,
  LogOut,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle,
  FileText,
  Copy,
  Check,
  CalendarDays,
} from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase/browser";

export type PrayerRequest = {
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

export type DateFilterType =
  | "this_week"
  | "this_month"
  | "this_year"
  | "all"
  | "custom";

export type DateBasisType = "created_at" | "prayer_date_time";

/**
 * Returns YYYY-MM-DD in Asia/Kolkata timezone (UTC+05:30)
 * Ensures midnight-boundary accuracy regardless of server/browser timezone.
 */
function getKolkataDateString(dateInput?: string | Date): string {
  const d = dateInput
    ? typeof dateInput === "string"
      ? new Date(dateInput)
      : dateInput
    : new Date();
  if (Number.isNaN(d.getTime())) return "";

  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

/**
 * Calculates start (Monday) and end (Sunday) YYYY-MM-DD for current week in Asia/Kolkata
 */
function getThisWeekBounds(): { start: string; end: string } {
  const todayStr = getKolkataDateString();
  const [y, m, d] = todayStr.split("-").map(Number);
  const localNoon = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  const dayOfWeek = localNoon.getUTCDay(); // 0 is Sun, 1 is Mon...
  const diffToMon = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const mon = new Date(localNoon.getTime() + diffToMon * 86400000);
  const sun = new Date(mon.getTime() + 6 * 86400000);

  return {
    start: mon.toISOString().slice(0, 10),
    end: sun.toISOString().slice(0, 10),
  };
}

/**
 * Calculates start and end YYYY-MM-DD for current month in Asia/Kolkata
 */
function getThisMonthBounds(): { start: string; end: string } {
  const todayStr = getKolkataDateString();
  const [y, m] = todayStr.split("-").map(Number);
  const start = `${y}-${String(m).padStart(2, "0")}-01`;
  const lastDay = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const end = `${y}-${String(m).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;

  return { start, end };
}

/**
 * Calculates start and end YYYY-MM-DD for current year in Asia/Kolkata
 */
function getThisYearBounds(): { start: string; end: string } {
  const todayStr = getKolkataDateString();
  const y = todayStr.slice(0, 4);
  return {
    start: `${y}-01-01`,
    end: `${y}-12-31`,
  };
}

/**
 * Formats YYYY-MM-DD into a human-readable date (e.g., "Oct 4, 2026")
 */
function formatNiceDate(isoDateString: string): string {
  if (!isoDateString) return "";
  const parts = isoDateString.split("-").map(Number);
  if (parts.length < 3) return isoDateString;
  const d = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2], 12, 0, 0));
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default function AdminDashboard() {
  const router = useRouter();
  const [requests, setRequests] = useState<PrayerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filters state - DEFAULT is "this_week" as required
  const [dateFilter, setDateFilter] = useState<DateFilterType>("this_week");
  const [dateBasis, setDateBasis] = useState<DateBasisType>("created_at");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  async function loadRequests(isManualRefresh = false) {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);
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

    if (queryError) {
      setError(queryError.message);
    } else {
      setRequests((data ?? []) as PrayerRequest[]);
    }

    setLoading(false);
    setRefreshing(false);
  }

  useEffect(() => {
    loadRequests();

    const channel = supabaseBrowser
      .channel("prayer-request-updates")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "prayer_requests" },
        () => loadRequests()
      )
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

    if (updateError) {
      setError(updateError.message);
    } else {
      setRequests((current) =>
        current.map((item) => (item.id === id ? { ...item, status } : item))
      );
    }
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

  function handleCopy(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  // Active date bounds description
  const activeDateRange = useMemo(() => {
    if (dateFilter === "this_week") {
      const bounds = getThisWeekBounds();
      return {
        ...bounds,
        label: `This Week (${formatNiceDate(bounds.start)} – ${formatNiceDate(bounds.end)})`,
      };
    }
    if (dateFilter === "this_month") {
      const bounds = getThisMonthBounds();
      return {
        ...bounds,
        label: `This Month (${formatNiceDate(bounds.start)} – ${formatNiceDate(bounds.end)})`,
      };
    }
    if (dateFilter === "this_year") {
      const bounds = getThisYearBounds();
      return {
        ...bounds,
        label: `This Year (${bounds.start.slice(0, 4)})`,
      };
    }
    if (dateFilter === "custom") {
      if (customStart && customEnd) {
        return {
          start: customStart,
          end: customEnd,
          label: `Custom (${formatNiceDate(customStart)} – ${formatNiceDate(customEnd)})`,
        };
      }
      if (customStart) {
        return {
          start: customStart,
          end: "9999-12-31",
          label: `From ${formatNiceDate(customStart)} onwards`,
        };
      }
      if (customEnd) {
        return {
          start: "1970-01-01",
          end: customEnd,
          label: `Up to ${formatNiceDate(customEnd)}`,
        };
      }
      return { start: "", end: "", label: "Custom Range (Select dates)" };
    }
    return { start: "", end: "", label: "All Time (All records)" };
  }, [dateFilter, customStart, customEnd]);

  // Filter records based on Date Filter, Status, and Search Query
  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      // 1. Date filter matching
      if (dateFilter !== "all") {
        const rawTargetDate =
          dateBasis === "created_at" ? req.created_at : req.prayer_date_time;
        const targetDateStr = getKolkataDateString(rawTargetDate);

        if (dateFilter === "custom") {
          if (customStart && targetDateStr < customStart) return false;
          if (customEnd && targetDateStr > customEnd) return false;
        } else if (activeDateRange.start && activeDateRange.end) {
          if (
            targetDateStr < activeDateRange.start ||
            targetDateStr > activeDateRange.end
          ) {
            return false;
          }
        }
      }

      // 2. Status filter
      if (statusFilter !== "all" && req.status !== statusFilter) {
        return false;
      }

      // 3. Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const searchable = `
          ${req.name} 
          ${req.email} 
          ${req.phone || ""} 
          ${req.intention} 
          ${req.intention_type || ""} 
          ${req.payment_ref || ""}
        `.toLowerCase();
        if (!searchable.includes(query)) return false;
      }

      return true;
    });
  }, [
    requests,
    dateFilter,
    dateBasis,
    activeDateRange,
    customStart,
    customEnd,
    statusFilter,
    searchQuery,
  ]);

  // KPI Statistics calculations
  const totalAmount = useMemo(() => {
    return filteredRequests.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  }, [filteredRequests]);

  const newCount = useMemo(() => {
    return filteredRequests.filter((item) => item.status === "new").length;
  }, [filteredRequests]);

  const completedCount = useMemo(() => {
    return filteredRequests.filter((item) => item.status === "completed").length;
  }, [filteredRequests]);

  return (
    <main className="admin-page-root">
      <div className="admin-container">
        {/* ================= HEADER SECTION ================= */}
        <header className="admin-header">
          <div className="admin-title-group">
            <span className="admin-eyebrow">Parish Administration</span>
            <h1 className="admin-main-title">Prayer Requests</h1>
            <p className="admin-subtitle">
              Manage online prayer intentions, donation records and payment receipts.
            </p>
          </div>

          <div className="admin-header-actions">
            <button
              type="button"
              onClick={() => loadRequests(true)}
              disabled={refreshing || loading}
              className="admin-btn admin-btn-secondary"
              aria-label="Refresh data"
            >
              <RefreshCw
                size={16}
                className={refreshing ? "admin-spin" : ""}
                aria-hidden="true"
              />
              <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
            </button>

            <button
              type="button"
              onClick={logout}
              className="admin-btn admin-btn-danger"
              aria-label="Sign out"
            >
              <LogOut size={16} aria-hidden="true" />
              <span>Sign out</span>
            </button>
          </div>
        </header>

        {error && (
          <div role="alert" className="admin-alert">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* ================= STATISTICS ROW ================= */}
        <section className="admin-stats-grid" aria-label="Dashboard statistics">
          <div className="admin-stat-card">
            <span className="stat-label">Displayed Requests</span>
            <div className="stat-value-row">
              <span className="stat-number">{filteredRequests.length}</span>
              <span className="stat-sub">of {requests.length} total</span>
            </div>
          </div>

          <div className="admin-stat-card">
            <span className="stat-label">Total Amount</span>
            <div className="stat-value-row">
              <span className="stat-number stat-gold">₹{totalAmount.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <div className="admin-stat-card">
            <span className="stat-label">New / Pending</span>
            <div className="stat-value-row">
              <span className="stat-number stat-amber">{newCount}</span>
              <span className="stat-sub">need review</span>
            </div>
          </div>

          <div className="admin-stat-card">
            <span className="stat-label">Completed</span>
            <div className="stat-value-row">
              <span className="stat-number stat-emerald">{completedCount}</span>
              <span className="stat-sub">fulfilled</span>
            </div>
          </div>
        </section>

        {/* ================= FILTER CONTROLS PANEL ================= */}
        <section className="admin-filter-panel" aria-label="Date and status filters">
          {/* Top row: Date Filter Options */}
          <div className="filter-row">
            <div className="filter-label-group">
              <Calendar size={18} className="filter-icon" />
              <span className="filter-section-title">Date Filter:</span>
            </div>

            <div className="date-pills-group" role="tablist" aria-label="Date range presets">
              <button
                type="button"
                role="tab"
                aria-selected={dateFilter === "this_week"}
                className={`date-pill ${dateFilter === "this_week" ? "active" : ""}`}
                onClick={() => setDateFilter("this_week")}
              >
                This Week
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={dateFilter === "this_month"}
                className={`date-pill ${dateFilter === "this_month" ? "active" : ""}`}
                onClick={() => setDateFilter("this_month")}
              >
                This Month
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={dateFilter === "this_year"}
                className={`date-pill ${dateFilter === "this_year" ? "active" : ""}`}
                onClick={() => setDateFilter("this_year")}
              >
                This Year
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={dateFilter === "all"}
                className={`date-pill ${dateFilter === "all" ? "active" : ""}`}
                onClick={() => setDateFilter("all")}
              >
                All
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={dateFilter === "custom"}
                className={`date-pill ${dateFilter === "custom" ? "active" : ""}`}
                onClick={() => setDateFilter("custom")}
              >
                Custom Date Range
              </button>
            </div>
          </div>

          {/* Custom Date Pickers (visible when "custom" is selected) */}
          {dateFilter === "custom" && (
            <div className="custom-date-container">
              <div className="custom-date-field">
                <label htmlFor="custom-from-date">From Date:</label>
                <input
                  id="custom-from-date"
                  type="date"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                  className="admin-input-date"
                />
              </div>

              <div className="custom-date-field">
                <label htmlFor="custom-to-date">To Date:</label>
                <input
                  id="custom-to-date"
                  type="date"
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                  className="admin-input-date"
                />
              </div>

              {(customStart || customEnd) && (
                <button
                  type="button"
                  onClick={() => {
                    setCustomStart("");
                    setCustomEnd("");
                  }}
                  className="admin-btn admin-btn-small"
                >
                  Clear dates
                </button>
              )}
            </div>
          )}

          {/* Secondary Controls: Date Basis, Status, Search */}
          <div className="secondary-filters-row">
            {/* Date Basis toggle */}
            <div className="control-group">
              <label htmlFor="date-basis-select">Filter by Date:</label>
              <select
                id="date-basis-select"
                value={dateBasis}
                onChange={(e) => setDateBasis(e.target.value as DateBasisType)}
                className="admin-select"
              >
                <option value="created_at">Submission Date (created)</option>
                <option value="prayer_date_time">Scheduled Prayer Date</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="control-group">
              <label htmlFor="status-filter-select">Status:</label>
              <select
                id="status-filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="admin-select"
              >
                <option value="all">All Statuses</option>
                <option value="new">New</option>
                <option value="reviewed">Reviewed</option>
                <option value="completed">Completed</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Search Input */}
            <div className="search-group">
              <label htmlFor="admin-search-input">Search:</label>
              <div className="search-input-wrapper">
                <Search size={15} className="search-icon" aria-hidden="true" />
                <input
                  id="admin-search-input"
                  type="text"
                  placeholder="Search name, email, phone, intention..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="admin-input-text"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="clear-search-btn"
                    aria-label="Clear search query"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Active Filter Indicator Banner */}
          <div className="active-filter-indicator">
            <span className="indicator-dot" aria-hidden="true" />
            <span className="indicator-text">
              Active Filter: <strong>{activeDateRange.label}</strong>
              {dateFilter !== "all" && (
                <span className="basis-indicator">
                  {" "}(based on {dateBasis === "created_at" ? "Submission Date" : "Scheduled Prayer Date"})
                </span>
              )}
              {statusFilter !== "all" && (
                <span> • Status: <strong className="capitalize">{statusFilter}</strong></span>
              )}
              {searchQuery.trim() && (
                <span> • Matching: &ldquo;{searchQuery.trim()}&rdquo;</span>
              )}
            </span>
          </div>
        </section>

        {/* ================= REQUESTS LIST ================= */}
        <section className="admin-content-section">
          {loading ? (
            <div className="admin-loading-state">
              <RefreshCw size={28} className="admin-spin admin-spin-icon" />
              <p>Loading prayer requests...</p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="admin-empty-state">
              <CalendarDays size={42} className="empty-icon" />
              <h2>No prayer requests found</h2>
              <p>
                {requests.length === 0
                  ? "No prayer requests have been submitted yet."
                  : "No requests match the selected date or status filters."}
              </p>
              {requests.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setDateFilter("all");
                    setStatusFilter("all");
                    setSearchQuery("");
                  }}
                  className="admin-btn admin-btn-secondary"
                  style={{ marginTop: 16 }}
                >
                  Show all records ({requests.length})
                </button>
              )}
            </div>
          ) : (
            <div className="requests-grid">
              {filteredRequests.map((request) => {
                const isNew = request.status === "new";
                const isReviewed = request.status === "reviewed";
                const isCompleted = request.status === "completed";
                const isRejected = request.status === "rejected";

                return (
                  <article
                    key={request.id}
                    className={`request-card status-${request.status}`}
                  >
                    {/* Top Row: Requester Name, Submission Date, Status Selector */}
                    <div className="card-header-row">
                      <div className="card-title-group">
                        <div className="card-name-line">
                          <h2 className="requester-name">{request.name}</h2>
                          <span className={`status-pill status-${request.status}`}>
                            {request.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="card-created-time">
                          <Clock size={13} aria-hidden="true" />
                          <span>
                            Submitted: {new Date(request.created_at).toLocaleString("en-IN", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}
                          </span>
                        </div>
                      </div>

                      <div className="card-status-control">
                        <label htmlFor={`status-select-${request.id}`} className="sr-only">
                          Change status for {request.name}
                        </label>
                        <select
                          id={`status-select-${request.id}`}
                          value={request.status}
                          onChange={(e) =>
                            updateStatus(
                              request.id,
                              e.target.value as PrayerRequest["status"]
                            )
                          }
                          className={`status-dropdown dropdown-${request.status}`}
                        >
                          <option value="new">Status: New</option>
                          <option value="reviewed">Status: Reviewed</option>
                          <option value="completed">Status: Completed</option>
                          <option value="rejected">Status: Rejected</option>
                        </select>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="card-details-grid">
                      <div className="detail-item">
                        <span className="detail-label">Email</span>
                        <a href={`mailto:${request.email}`} className="detail-link">
                          {request.email}
                        </a>
                      </div>

                      <div className="detail-item">
                        <span className="detail-label">Phone</span>
                        {request.phone ? (
                          <a href={`tel:${request.phone}`} className="detail-link">
                            {request.phone}
                          </a>
                        ) : (
                          <span className="detail-value text-muted">Not provided</span>
                        )}
                      </div>

                      <div className="detail-item">
                        <span className="detail-label">Scheduled Prayer Date</span>
                        <span className="detail-value font-highlight">
                          {new Date(request.prayer_date_time).toLocaleString("en-IN", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </span>
                      </div>

                      <div className="detail-item">
                        <span className="detail-label">Offering Amount</span>
                        <span className="detail-amount-badge">
                          ₹{request.amount}
                        </span>
                      </div>

                      <div className="detail-item">
                        <span className="detail-label">Intention Type</span>
                        <span className="detail-value">
                          {request.intention_type || "General Intention"}
                        </span>
                      </div>

                      <div className="detail-item">
                        <span className="detail-label">Payment Reference</span>
                        {request.payment_ref ? (
                          <div className="copy-ref-group">
                            <span className="detail-value code-font">
                              {request.payment_ref}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopy(request.payment_ref!, request.id)}
                              className="copy-btn"
                              title="Copy payment reference"
                              aria-label="Copy payment reference"
                            >
                              {copiedId === request.id ? (
                                <Check size={14} className="copied-icon" />
                              ) : (
                                <Copy size={14} />
                              )}
                            </button>
                          </div>
                        ) : (
                          <span className="detail-value text-muted">Not provided</span>
                        )}
                      </div>
                    </div>

                    {/* Prayer Intention Text */}
                    <div className="intention-box">
                      <span className="intention-label">Prayer Intention</span>
                      <p className="intention-text">{request.intention}</p>
                    </div>

                    {/* Card Footer: Receipt Action */}
                    <div className="card-footer-row">
                      <button
                        type="button"
                        disabled={!request.receipt_path}
                        onClick={() => openReceipt(request.receipt_path)}
                        className={`receipt-btn ${!request.receipt_path ? "disabled" : ""}`}
                        title={request.receipt_path ? "View uploaded receipt screenshot" : "No receipt attached"}
                      >
                        <FileText size={15} />
                        <span>
                          {request.receipt_path
                            ? "View payment receipt screenshot"
                            : "No receipt uploaded"}
                        </span>
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* ================= COMPONENT STYLING ================= */}
      <style jsx>{`
        .admin-page-root {
          min-height: 85vh;
          background: #f7fafb;
          color: #0c3345;
          padding: 40px 20px 90px;
          display: flex;
          justify-content: center;
        }

        .admin-container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
        }

        /* HEADER */
        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
          padding-bottom: 24px;
          border-bottom: 1px solid #dce7eb;
        }

        .admin-title-group {
          max-width: 700px;
        }

        .admin-eyebrow {
          display: inline-block;
          color: #b58a36;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          margin-bottom: 6px;
        }

        .admin-main-title {
          margin: 0 0 6px;
          color: #07455d;
          font-family: Georgia, serif;
          font-size: clamp(28px, 4vw, 38px);
          font-weight: 500;
          line-height: 1.2;
        }

        .admin-subtitle {
          margin: 0;
          color: #64748b;
          font-size: 14.5px;
          line-height: 1.5;
        }

        .admin-header-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        /* BUTTONS */
        .admin-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px 18px;
          border-radius: 10px;
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid transparent;
          white-space: nowrap;
          min-height: 42px;
          box-sizing: border-box;
        }

        .admin-btn-secondary {
          background: #ffffff;
          color: #07516b;
          border-color: #cbdde3;
        }

        .admin-btn-secondary:hover:not(:disabled) {
          background: #f0f6f8;
          border-color: #07516b;
        }

        .admin-btn-danger {
          background: #ffffff;
          color: #b91c1c;
          border-color: #fecaca;
        }

        .admin-btn-danger:hover {
          background: #fef2f2;
          border-color: #b91c1c;
        }

        .admin-btn-small {
          padding: 6px 12px;
          font-size: 12px;
          min-height: 34px;
          background: #e2eef2;
          color: #07516b;
        }

        .admin-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .admin-alert {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 18px;
          margin-top: 20px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 12px;
          color: #b91c1c;
          font-size: 14px;
        }

        /* STATS GRID */
        .admin-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
          margin-top: 28px;
        }

        .admin-stat-card {
          background: #ffffff;
          border: 1px solid #dce7eb;
          border-radius: 14px;
          padding: 18px 20px;
          box-shadow: 0 4px 14px rgba(0, 30, 45, 0.04);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .stat-label {
          color: #64748b;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .stat-value-row {
          display: flex;
          align-items: baseline;
          gap: 8px;
          flex-wrap: wrap;
        }

        .stat-number {
          font-size: 26px;
          font-weight: 700;
          color: #07455d;
          line-height: 1.1;
        }

        .stat-gold {
          color: #b58a36;
        }

        .stat-amber {
          color: #d97706;
        }

        .stat-emerald {
          color: #059669;
        }

        .stat-sub {
          color: #94a3b8;
          font-size: 12px;
        }

        /* FILTER PANEL */
        .admin-filter-panel {
          margin-top: 24px;
          background: #ffffff;
          border: 1px solid #dce7eb;
          border-radius: 16px;
          padding: 22px 24px;
          box-shadow: 0 6px 20px rgba(0, 30, 45, 0.04);
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .filter-row {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .filter-label-group {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #07516b;
          flex-shrink: 0;
        }

        .filter-icon {
          color: #b58a36;
        }

        .filter-section-title {
          font-size: 13.5px;
          font-weight: 700;
          letter-spacing: 0.04em;
        }

        .date-pills-group {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .date-pill {
          padding: 8px 16px;
          border-radius: 30px;
          border: 1px solid #cbdde3;
          background: #ffffff;
          color: #0b4f69;
          font-size: 12.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
          min-height: 38px;
        }

        .date-pill:hover {
          border-color: #0b617f;
          background: #f2f8fa;
        }

        .date-pill.active {
          border-color: #07516b;
          background: #07516b;
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(7, 81, 107, 0.25);
        }

        /* Custom Date Picker Inputs */
        .custom-date-container {
          display: flex;
          align-items: flex-end;
          gap: 16px;
          flex-wrap: wrap;
          padding: 14px 18px;
          background: #f5f9fa;
          border: 1px solid #dce7eb;
          border-radius: 12px;
        }

        .custom-date-field {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .custom-date-field label {
          font-size: 11.5px;
          font-weight: 600;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .admin-input-date {
          padding: 8px 12px;
          border: 1px solid #cbdde3;
          border-radius: 8px;
          background: #ffffff;
          color: #07516b;
          font-size: 13px;
          font-weight: 600;
          outline: none;
        }

        .admin-input-date:focus {
          border-color: #07516b;
          box-shadow: 0 0 0 3px rgba(7, 81, 107, 0.12);
        }

        /* Secondary Filters: Date basis, status, search */
        .secondary-filters-row {
          display: flex;
          align-items: flex-end;
          gap: 16px;
          flex-wrap: wrap;
          padding-top: 14px;
          border-top: 1px solid #edf3f5;
        }

        .control-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
          min-width: 170px;
        }

        .control-group label {
          font-size: 11.5px;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .admin-select {
          padding: 9px 12px;
          border: 1px solid #cbdde3;
          border-radius: 9px;
          background: #ffffff;
          color: #07516b;
          font-size: 13px;
          font-weight: 600;
          outline: none;
          min-height: 40px;
        }

        .admin-select:focus {
          border-color: #07516b;
          box-shadow: 0 0 0 3px rgba(7, 81, 107, 0.12);
        }

        .search-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
          flex: 1;
          min-width: 240px;
        }

        .search-group label {
          font-size: 11.5px;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .search-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          color: #94a3b8;
          pointer-events: none;
        }

        .admin-input-text {
          width: 100%;
          padding: 9px 34px 9px 34px;
          border: 1px solid #cbdde3;
          border-radius: 9px;
          background: #ffffff;
          color: #07516b;
          font-size: 13px;
          outline: none;
          min-height: 40px;
          box-sizing: border-box;
        }

        .admin-input-text:focus {
          border-color: #07516b;
          box-shadow: 0 0 0 3px rgba(7, 81, 107, 0.12);
        }

        .clear-search-btn {
          position: absolute;
          right: 10px;
          background: none;
          border: none;
          font-size: 16px;
          color: #94a3b8;
          cursor: pointer;
          padding: 2px 6px;
        }

        /* Active Filter Indicator */
        .active-filter-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: #f1f7f9;
          border-radius: 8px;
          font-size: 12.5px;
          color: #07516b;
        }

        .indicator-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #059669;
          flex-shrink: 0;
        }

        .basis-indicator {
          color: #64748b;
          font-size: 11.5px;
        }

        .capitalize {
          text-transform: capitalize;
        }

        /* CONTENT SECTION & CARDS */
        .admin-content-section {
          margin-top: 24px;
        }

        .admin-loading-state,
        .admin-empty-state {
          padding: 60px 20px;
          text-align: center;
          background: #ffffff;
          border: 1px solid #dce7eb;
          border-radius: 16px;
        }

        .admin-spin {
          animation: spin 1s linear infinite;
        }

        .admin-spin-icon {
          color: #07516b;
          margin-bottom: 12px;
        }

        .empty-icon {
          color: #b58a36;
          margin-bottom: 12px;
        }

        .admin-empty-state h2 {
          margin: 0 0 8px;
          color: #07455d;
          font-size: 20px;
          font-family: Georgia, serif;
        }

        .admin-empty-state p {
          margin: 0;
          color: #64748b;
          font-size: 14px;
        }

        .requests-grid {
          display: grid;
          gap: 18px;
        }

        /* REQUEST CARD */
        .request-card {
          padding: 24px;
          border: 1px solid #dce7eb;
          border-radius: 16px;
          background: #ffffff;
          box-shadow: 0 6px 22px rgba(0, 30, 45, 0.04);
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .request-card:hover {
          border-color: #cbdde3;
          box-shadow: 0 10px 30px rgba(0, 30, 45, 0.07);
        }

        .request-card.status-new {
          border-left: 4px solid #d97706;
        }

        .request-card.status-reviewed {
          border-left: 4px solid #0284c7;
        }

        .request-card.status-completed {
          border-left: 4px solid #059669;
        }

        .request-card.status-rejected {
          border-left: 4px solid #dc2626;
        }

        .card-header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          flex-wrap: wrap;
          padding-bottom: 18px;
          border-bottom: 1px solid #edf3f5;
        }

        .card-title-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .card-name-line {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .requester-name {
          margin: 0;
          color: #07455d;
          font-size: 20px;
          font-weight: 700;
          letter-spacing: -0.01em;
        }

        .status-pill {
          padding: 2px 8px;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .status-pill.status-new {
          background: #fef3c7;
          color: #92400e;
        }

        .status-pill.status-reviewed {
          background: #e0f2fe;
          color: #0369a1;
        }

        .status-pill.status-completed {
          background: #d1fae5;
          color: #065f46;
        }

        .status-pill.status-rejected {
          background: #fee2e2;
          color: #991b1b;
        }

        .card-created-time {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #64748b;
          font-size: 12.5px;
        }

        .card-status-control {
          display: flex;
          align-items: center;
        }

        .status-dropdown {
          padding: 8px 12px;
          border: 1px solid #cbdde3;
          border-radius: 8px;
          background: #ffffff;
          font-size: 12.5px;
          font-weight: 600;
          cursor: pointer;
          outline: none;
        }

        .status-dropdown:focus {
          box-shadow: 0 0 0 2px rgba(7, 81, 107, 0.2);
        }

        /* DETAILS GRID */
        .card-details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 16px;
          margin-top: 18px;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .detail-label {
          color: #64748b;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .detail-value {
          font-size: 13.5px;
          font-weight: 600;
          color: #07455d;
          word-break: break-word;
        }

        .detail-link {
          font-size: 13.5px;
          font-weight: 600;
          color: #0b617f;
          text-decoration: none;
          word-break: break-all;
        }

        .detail-link:hover {
          text-decoration: underline;
        }

        .detail-amount-badge {
          display: inline-block;
          font-size: 14px;
          font-weight: 700;
          color: #92400e;
          background: #fef3c7;
          padding: 2px 8px;
          border-radius: 6px;
          width: fit-content;
        }

        .font-highlight {
          color: #07516b;
        }

        .code-font {
          font-family: monospace;
          background: #f1f5f9;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 12px;
        }

        .text-muted {
          color: #94a3b8;
          font-style: italic;
        }

        .copy-ref-group {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }

        .copy-btn {
          border: 1px solid #cbdde3;
          background: #ffffff;
          color: #64748b;
          border-radius: 6px;
          padding: 3px 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .copy-btn:hover {
          background: #f1f5f9;
          color: #07516b;
        }

        .copied-icon {
          color: #059669;
        }

        /* INTENTION CALLOUT */
        .intention-box {
          margin-top: 18px;
          padding: 16px;
          border-radius: 12px;
          background: #f7f9fa;
          border: 1px solid #eef3f5;
        }

        .intention-label {
          display: block;
          color: #64748b;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 6px;
        }

        .intention-text {
          white-space: pre-wrap;
          margin: 0;
          font-size: 13.5px;
          line-height: 1.65;
          color: #1e293b;
        }

        /* FOOTER ACTIONS */
        .card-footer-row {
          margin-top: 18px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: 12px;
          flex-wrap: wrap;
        }

        .receipt-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 9px 14px;
          border: 1px solid #cbdde3;
          border-radius: 8px;
          background: #ffffff;
          color: #07516b;
          font-size: 12.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .receipt-btn:hover:not(.disabled) {
          background: #f0f6f8;
          border-color: #07516b;
        }

        .receipt-btn.disabled {
          opacity: 0.5;
          cursor: not-allowed;
          color: #94a3b8;
          border-color: #e2e8f0;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        /* ================= RESPONSIVE ================= */
        @media (max-width: 768px) {
          .admin-page-root {
            padding: 24px 14px 60px;
          }

          .admin-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 14px;
          }

          .admin-header-actions {
            width: 100%;
            justify-content: flex-start;
          }

          .admin-filter-panel {
            padding: 16px;
          }

          .date-pills-group {
            width: 100%;
          }

          .date-pill {
            flex: 1 1 auto;
            text-align: center;
          }

          .secondary-filters-row {
            flex-direction: column;
            align-items: stretch;
          }

          .control-group,
          .search-group {
            width: 100%;
          }

          .request-card {
            padding: 18px 16px;
          }

          .card-header-row {
            flex-direction: column;
            align-items: flex-start;
          }

          .card-status-control {
            width: 100%;
          }

          .status-dropdown {
            width: 100%;
          }

          .card-details-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .receipt-btn {
            width: 100%;
            justify-content: center;
          }
        }

        /* Screen-reader only utility */
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
      `}</style>
    </main>
  );
}
