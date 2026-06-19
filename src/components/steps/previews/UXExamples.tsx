"use client";

import type { UXPatternsData } from "@/types";

interface Props {
  uxPatterns: UXPatternsData;
}

// ── Loading examples ────────────────────────────────────────────────────────

function SkeletonLoading() {
  return (
    <>
      <style>{`
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        .ux-shimmer { background: linear-gradient(90deg,#f4f4f5 25%,#e4e4e7 50%,#f4f4f5 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; }
      `}</style>
      <div style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start" }}>
        <div className="ux-shimmer" style={{ width: 36, height: 36, borderRadius: "50%", flexShrink: 0 }} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <div className="ux-shimmer" style={{ height: 12, borderRadius: 4, width: "70%" }} />
          <div className="ux-shimmer" style={{ height: 10, borderRadius: 4, width: "90%" }} />
          <div className="ux-shimmer" style={{ height: 10, borderRadius: 4, width: "55%" }} />
        </div>
      </div>
    </>
  );
}

function SpinnerLoading() {
  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .ux-spin { animation: spin 0.8s linear infinite; }
      `}</style>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
        <svg className="ux-spin" width="32" height="32" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="13" stroke="#e4e4e7" strokeWidth="3" />
          <path d="M16 3 A13 13 0 0 1 29 16" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
        </svg>
        <span style={{ fontSize: "0.78rem", color: "#71717a" }}>Loading…</span>
      </div>
    </>
  );
}

function ProgressBarLoading() {
  return (
    <>
      <style>{`
        @keyframes progress { 0%{width:0%} 50%{width:70%} 100%{width:95%} }
        .ux-progress { animation: progress 2s ease-out infinite; }
      `}</style>
      <div style={{ position: "relative", background: "#f4f4f5", borderRadius: 4, height: 4, overflow: "hidden" }}>
        <div className="ux-progress" style={{ position: "absolute", top: 0, left: 0, height: "100%", background: "#3b82f6", borderRadius: 4 }} />
      </div>
      <span style={{ fontSize: "0.78rem", color: "#71717a", display: "block", marginTop: "0.4rem" }}>
        Top-of-page NProgress-style bar
      </span>
    </>
  );
}

// ── Empty state examples ─────────────────────────────────────────────────────

function IllustrationEmpty() {
  return (
    <div style={{ textAlign: "center", padding: "0.75rem", border: "1px dashed #d4d4d8", borderRadius: 8 }}>
      <div style={{ fontSize: "2rem", marginBottom: "0.4rem" }}>🗂️</div>
      <p style={{ fontWeight: 600, fontSize: "0.82rem", color: "#18181b", margin: "0 0 0.2rem" }}>Nothing here yet</p>
      <p style={{ fontSize: "0.75rem", color: "#71717a", margin: "0 0 0.6rem" }}>Add your first item to get started.</p>
      <button style={{ background: "#3b82f6", color: "#fff", border: "none", borderRadius: 6, padding: "0.3rem 0.75rem", fontSize: "0.78rem", cursor: "default" }}>
        Create item
      </button>
    </div>
  );
}

function IconTextEmpty() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.75rem", border: "1px dashed #d4d4d8", borderRadius: 8 }}>
      <span style={{ fontSize: "1.5rem", flexShrink: 0 }}>📭</span>
      <div>
        <p style={{ fontWeight: 600, fontSize: "0.82rem", color: "#18181b", margin: "0 0 0.1rem" }}>No results found</p>
        <p style={{ fontSize: "0.75rem", color: "#71717a", margin: 0 }}>Try adjusting your filters.</p>
      </div>
    </div>
  );
}

function TextOnlyEmpty() {
  return (
    <div style={{ padding: "0.75rem", border: "1px dashed #d4d4d8", borderRadius: 8, textAlign: "center" }}>
      <p style={{ fontSize: "0.82rem", color: "#71717a", margin: 0 }}>No items to display.</p>
    </div>
  );
}

// ── Success feedback examples ────────────────────────────────────────────────

function ToastFeedback() {
  return (
    <div style={{
      background: "#18181b", color: "#fff", borderRadius: 8, padding: "0.55rem 0.85rem",
      display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.82rem", width: "fit-content",
    }}>
      <span style={{ color: "#22c55e" }}>✓</span>
      Changes saved successfully
    </div>
  );
}

function SnackbarFeedback() {
  return (
    <div style={{
      background: "#18181b", color: "#fff", borderRadius: 8, padding: "0.55rem 0.85rem",
      display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", fontSize: "0.82rem",
    }}>
      <span>Item deleted</span>
      <button style={{ color: "#60a5fa", background: "none", border: "none", fontSize: "0.78rem", fontWeight: 600, cursor: "default" }}>
        UNDO
      </button>
    </div>
  );
}

function RedirectFeedback() {
  return (
    <div style={{
      background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 8, padding: "0.6rem 0.85rem",
      display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.82rem", color: "#15803d",
    }}>
      <span style={{ fontWeight: 600 }}>✓ Success!</span>
      <span style={{ color: "#4ade80" }}>→</span>
      <span>Redirecting to dashboard…</span>
    </div>
  );
}

// ── Confirmation examples ────────────────────────────────────────────────────

function ModalConfirmation() {
  return (
    <div style={{ position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.25)", borderRadius: 6 }} />
      <div style={{
        position: "relative", background: "#fff", borderRadius: 8, padding: "0.85rem", margin: "0.5rem",
        boxShadow: "0 10px 25px -5px rgb(0 0 0/0.2)",
      }}>
        <p style={{ fontWeight: 600, fontSize: "0.82rem", color: "#18181b", margin: "0 0 0.3rem" }}>Delete item?</p>
        <p style={{ fontSize: "0.75rem", color: "#71717a", margin: "0 0 0.7rem" }}>This action cannot be undone.</p>
        <div style={{ display: "flex", gap: "0.4rem", justifyContent: "flex-end" }}>
          <button style={{ background: "#f4f4f5", border: "none", borderRadius: 5, padding: "0.3rem 0.65rem", fontSize: "0.75rem", cursor: "default" }}>Cancel</button>
          <button style={{ background: "#ef4444", color: "#fff", border: "none", borderRadius: 5, padding: "0.3rem 0.65rem", fontSize: "0.75rem", cursor: "default" }}>Delete</button>
        </div>
      </div>
    </div>
  );
}

function InlineConfirmation() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <span style={{ fontSize: "0.78rem", color: "#52525b" }}>Delete?</span>
      <button style={{ background: "#ef4444", color: "#fff", border: "none", borderRadius: 5, padding: "0.25rem 0.6rem", fontSize: "0.75rem", cursor: "default" }}>Confirm</button>
      <button style={{ background: "#f4f4f5", border: "none", borderRadius: 5, padding: "0.25rem 0.6rem", fontSize: "0.75rem", cursor: "default" }}>Cancel</button>
    </div>
  );
}

function NoConfirmation() {
  return (
    <div style={{ fontSize: "0.78rem", color: "#71717a", padding: "0.4rem 0" }}>
      Destructive actions execute immediately — no prompt.
    </div>
  );
}

// ── Error state examples ─────────────────────────────────────────────────────

function ToastError() {
  return (
    <div style={{
      background: "#7f1d1d", color: "#fff", borderRadius: 8, padding: "0.55rem 0.85rem",
      display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.82rem", width: "fit-content",
    }}>
      <span style={{ color: "#fca5a5" }}>✕</span>
      Something went wrong. Please try again.
    </div>
  );
}

function InlineError() {
  return (
    <div>
      <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 500, color: "#3f3f46", marginBottom: "0.3rem" }}>
        Email address
      </label>
      <input
        readOnly
        value="not-an-email"
        style={{ width: "100%", padding: "0.4rem 0.65rem", borderRadius: 6, border: "1px solid #ef4444", fontSize: "0.82rem", boxSizing: "border-box", outline: "none", color: "#18181b", background: "#fff" }}
      />
      <p style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.72rem", color: "#dc2626", margin: "0.3rem 0 0" }}>
        <span>⚠</span> Enter a valid email address.
      </p>
    </div>
  );
}

function FullPageError() {
  return (
    <div style={{ textAlign: "center", padding: "1rem 0.75rem", border: "1px dashed #fca5a5", borderRadius: 8, background: "#fef2f2" }}>
      <div style={{ fontSize: "1.6rem", marginBottom: "0.3rem" }}>😵</div>
      <p style={{ fontWeight: 700, fontSize: "0.95rem", color: "#991b1b", margin: "0 0 0.15rem" }}>500 — Something broke</p>
      <p style={{ fontSize: "0.75rem", color: "#b91c1c", margin: "0 0 0.6rem" }}>We hit an unexpected error. Try reloading the page.</p>
      <button style={{ background: "#dc2626", color: "#fff", border: "none", borderRadius: 6, padding: "0.3rem 0.85rem", fontSize: "0.78rem", cursor: "default" }}>
        Reload
      </button>
    </div>
  );
}

// ── Section wrapper ──────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p style={{ fontSize: "0.7rem", fontWeight: 600, color: "#a1a1aa", textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 0.5rem" }}>
        {title}
      </p>
      {children}
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

export function UXExamples({ uxPatterns }: Props) {
  return (
    <div className="space-y-5">
      <Section title="Loading State">
        {uxPatterns.loadingPattern === "skeleton"    && <SkeletonLoading />}
        {uxPatterns.loadingPattern === "spinner"     && <SpinnerLoading />}
        {uxPatterns.loadingPattern === "progress-bar"&& <ProgressBarLoading />}
      </Section>

      <Section title="Empty State">
        {uxPatterns.emptyStateStyle === "illustration" && <IllustrationEmpty />}
        {uxPatterns.emptyStateStyle === "icon-text"    && <IconTextEmpty />}
        {uxPatterns.emptyStateStyle === "text-only"    && <TextOnlyEmpty />}
      </Section>

      <Section title="Success Feedback">
        {uxPatterns.successFeedback === "toast"    && <ToastFeedback />}
        {uxPatterns.successFeedback === "snackbar" && <SnackbarFeedback />}
        {uxPatterns.successFeedback === "redirect" && <RedirectFeedback />}
      </Section>

      <Section title="Destructive Confirmation">
        {uxPatterns.confirmationPattern === "modal"  && <ModalConfirmation />}
        {uxPatterns.confirmationPattern === "inline" && <InlineConfirmation />}
        {uxPatterns.confirmationPattern === "none"   && <NoConfirmation />}
      </Section>

      <Section title="Error State">
        {uxPatterns.errorState === "toast"     && <ToastError />}
        {uxPatterns.errorState === "inline"    && <InlineError />}
        {uxPatterns.errorState === "full-page" && <FullPageError />}
        {!uxPatterns.errorState && (
          <p style={{ fontSize: "0.78rem", color: "#a1a1aa", fontStyle: "italic", margin: 0 }}>
            Choose an error display in Frontend Conventions to preview it here.
          </p>
        )}
      </Section>
    </div>
  );
}
