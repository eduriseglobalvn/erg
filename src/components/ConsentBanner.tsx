"use client";

import { useState, useEffect } from "react";
import { devLog } from "@/lib/dev-logger";

const CONSENT_KEY = "analytics_consent";

export type ConsentStatus = "accepted" | "declined" | null;

/**
 * Returns the current consent status from localStorage.
 * Call this in any component that needs to check consent.
 */
export function getConsentStatus(): ConsentStatus {
  if (typeof window === "undefined") return null;
  const val = localStorage.getItem(CONSENT_KEY);
  if (val === "accepted") return "accepted";
  if (val === "declined") return "declined";
  return null;
}

/**
 * Stores the consent choice in localStorage.
 */
export function setConsent(status: "accepted" | "declined"): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CONSENT_KEY, status);

  if (status === "accepted") {
    // Activate Firebase after consent
    import("@/lib/firebase")
      .then(({ initFirebase, fbLogEvent }) => initFirebase()
      .then(({ analytics }) => {
        if (analytics) {
          void fbLogEvent("consent_accepted", {
            timestamp: Date.now(),
            locale: document.documentElement.lang || "vi",
          });
          devLog("%c[Consent] ✅ Firebase activated after consent", "color: #4caf50");
        }
      }))
      .catch(() => {});
  } else {
    devLog("%c[Consent] ❌ Analytics declined", "color: #f44336");
  }
}

export function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Show banner only if no consent decision has been made.
    const existing = localStorage.getItem(CONSENT_KEY);
    if (!existing) {
      // Small delay so it doesn't flash on initial load.
      const t = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(t);
    }
  }, []);

  const handleAccept = () => {
    setConsent("accepted");
    setVisible(false);
  };

  const handleDecline = () => {
    setConsent("declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: "linear-gradient(135deg, #1e3a5f 0%, #0f2137 100%)",
        color: "#fff",
        padding: "20px 24px",
        boxShadow: "0 -4px 20px rgba(0,0,0,0.25)",
        fontFamily: "var(--font-inter, system-ui, sans-serif)",
        fontSize: "14px",
        lineHeight: 1.6,
      }}
      role="dialog"
      aria-label="Cookie consent"
    >
      <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
        {/* Icon */}
        <div style={{ fontSize: 28, lineHeight: 1, flexShrink: 0 }}>🍪</div>

        {/* Text */}
        <div style={{ flex: 1, minWidth: 240 }}>
          <strong style={{ fontSize: 15, display: "block", marginBottom: 4 }}>
            Chúng tôi sử dụng dữ liệu để cải thiện trải nghiệm của bạn
          </strong>
          <p style={{ margin: "0 0 4px", color: "#cbd5e1", fontSize: 13 }}>
            Chúng tôi thu thập dữ liệu ẩn danh qua Firebase Analytics để phân tích
            lưu lượng truy cập, cải thiện nội dung và tối ưu trải nghiệm người dùng.
            Dữ liệu được lưu trong 90 ngày và không bao giờ chia sẻ với bên thứ ba.
            {" "}
            <a
              href="/privacy-policy"
              style={{ color: "#93c5fd", textDecoration: "underline" }}
              target="_blank"
              rel="noopener noreferrer"
            >
              Chính sách bảo mật
            </a>
          </p>
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 10, flexShrink: 0, alignItems: "center" }}>
          <button
            onClick={handleDecline}
            style={{
              padding: "8px 16px",
              borderRadius: 6,
              border: "1px solid rgba(255,255,255,0.2)",
              background: "transparent",
              color: "#94a3b8",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 500,
              transition: "all 0.2s",
            }}
            onMouseOver={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.4)";
              (e.currentTarget as HTMLButtonElement).style.color = "#fff";
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.2)";
              (e.currentTarget as HTMLButtonElement).style.color = "#94a3b8";
            }}
          >
            Từ chối
          </button>
          <button
            onClick={handleAccept}
            style={{
              padding: "8px 20px",
              borderRadius: 6,
              border: "none",
              background: "#22c55e",
              color: "#fff",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              transition: "all 0.2s",
              boxShadow: "0 2px 8px rgba(34,197,94,0.3)",
            }}
            onMouseOver={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "#16a34a";
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "#22c55e";
            }}
          >
            Đồng ý
          </button>
        </div>
      </div>
    </div>
  );
}
