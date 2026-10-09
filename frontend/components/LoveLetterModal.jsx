"use client";

import { useState } from "react";
import { Heart, Sparkles, Copy, Check, X, Share2, Mail, Gift } from "lucide-react";
import { generateLoveLetter, generateSurpriseNote } from "../lib/gameEngine";

export default function LoveLetterModal({
  isOpen,
  onClose,
  name1 = "Partner 1",
  name2 = "Partner 2",
  score = 85,
  tier = "Perfect Love Birds 💕",
}) {
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState("letter"); // 'letter' or 'surprise'

  if (!isOpen) return null;

  const letterText = generateLoveLetter(name1, name2, score, tier);
  const surpriseNote = generateSurpriseNote(name1, name2);

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (e) {
      alert("Copied to clipboard!");
    }
  };

  const handleShareWhatsApp = (text) => {
    const encoded = encodeURIComponent(text);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, "_blank");
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(30, 5, 20, 0.7)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        animation: "modalFadeIn 0.3s ease-out",
      }}
    >
      <style jsx>{`
        @keyframes modalFadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>

      <div
        className="glass-card glass-card-glow"
        style={{
          width: "100%",
          maxWidth: "580px",
          maxHeight: "90vh",
          overflowY: "auto",
          background: "linear-gradient(135deg, rgba(255, 240, 245, 0.96) 0%, rgba(250, 225, 240, 0.98) 100%)",
          padding: "32px 28px",
          position: "relative",
          borderRadius: "28px",
          border: "2px solid var(--rose-gold)",
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "rgba(255, 8, 68, 0.12)",
            border: "none",
            borderRadius: "50%",
            width: "36px",
            height: "36px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--ruby-red)",
          }}
        >
          <X size={18} />
        </button>

        {/* Tab switch */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            marginBottom: "20px",
          }}
        >
          <button
            onClick={() => setTab("letter")}
            style={{
              padding: "8px 18px",
              borderRadius: "9999px",
              border: tab === "letter" ? "2px solid var(--ruby-red)" : "1.5px solid var(--card-border-subtle)",
              background: tab === "letter" ? "rgba(255, 8, 68, 0.14)" : "rgba(255, 255, 255, 0.6)",
              color: tab === "letter" ? "var(--ruby-red)" : "var(--text-muted)",
              fontWeight: 700,
              fontSize: "0.9rem",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer",
            }}
          >
            <Mail size={16} />
            <span>Love Letter</span>
          </button>

          <button
            onClick={() => setTab("surprise")}
            style={{
              padding: "8px 18px",
              borderRadius: "9999px",
              border: tab === "surprise" ? "2px solid var(--royal-purple)" : "1.5px solid var(--card-border-subtle)",
              background: tab === "surprise" ? "rgba(142, 5, 194, 0.14)" : "rgba(255, 255, 255, 0.6)",
              color: tab === "surprise" ? "var(--royal-purple)" : "var(--text-muted)",
              fontWeight: 700,
              fontSize: "0.9rem",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer",
            }}
          >
            <Gift size={16} />
            <span>Surprise Love Note</span>
          </button>
        </div>

        {/* 1. LOVE LETTER CONTENT */}
        {tab === "letter" && (
          <div>
            <div style={{ textAlign: "center", marginBottom: "16px" }}>
              <div style={{ fontSize: "2rem", marginBottom: "4px" }}>💌</div>
              <h3 style={{ fontSize: "1.7rem", color: "var(--ruby-red)", margin: "0 0 4px" }}>
                A Letter For My Soulmate
              </h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: 0 }}>
                Written for {name1} & {name2} • {score}% Compatibility
              </p>
            </div>

            <div
              style={{
                background: "rgba(255, 255, 255, 0.85)",
                border: "1.5px dashed var(--rose-gold)",
                borderRadius: "20px",
                padding: "24px 20px",
                fontSize: "1rem",
                lineHeight: 1.7,
                color: "var(--text-dark)",
                whiteSpace: "pre-line",
                fontFamily: "var(--font-body)",
                boxShadow: "inset 0 2px 8px rgba(183, 110, 121, 0.1)",
                marginBottom: "20px",
              }}
            >
              {letterText}
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
              <button
                onClick={() => handleCopy(letterText)}
                className="heart-btn heart-btn-secondary"
                style={{ padding: "10px 20px", fontSize: "0.92rem" }}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                <span>{copied ? "Copied! 💕" : "Copy Love Letter"}</span>
              </button>

              <button
                onClick={() => handleShareWhatsApp(letterText)}
                className="heart-btn heart-btn-whatsapp"
                style={{ padding: "10px 20px", fontSize: "0.92rem" }}
              >
                <Share2 size={16} />
                <span>Send to Partner</span>
              </button>
            </div>
          </div>
        )}

        {/* 2. SURPRISE LOVE NOTE */}
        {tab === "surprise" && (
          <div style={{ textAlign: "center", padding: "10px 0" }}>
            <div style={{ fontSize: "3rem", marginBottom: "10px" }} className="beating-heart">
              🎁
            </div>
            <h3 style={{ fontSize: "1.8rem", color: "var(--royal-purple)", marginBottom: "8px" }}>
              Your Secret Love Note ✨
            </h3>
            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "22px" }}>
              A whispered romantic truth unlocked just for the two of you:
            </p>

            <div
              style={{
                background: "linear-gradient(135deg, rgba(255, 8, 68, 0.12) 0%, rgba(142, 5, 194, 0.18) 100%)",
                border: "2px solid var(--ruby-red)",
                borderRadius: "22px",
                padding: "26px 22px",
                fontSize: "1.2rem",
                fontFamily: "var(--font-heading)",
                color: "var(--ruby-red)",
                lineHeight: 1.5,
                boxShadow: "0 8px 24px rgba(255, 8, 68, 0.2)",
                marginBottom: "24px",
              }}
            >
              {surpriseNote}
            </div>

            <button
              onClick={() => handleShareWhatsApp(surpriseNote)}
              className="heart-btn heart-btn-whatsapp"
              style={{ padding: "12px 28px", fontSize: "1rem" }}
            >
              <Share2 size={18} />
              <span>Share Secret Note on WhatsApp</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
