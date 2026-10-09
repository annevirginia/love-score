"use client";

import { useState } from "react";
import { Heart, Sparkles, Mail, Copy, Check, Share2, Feather, Eye } from "lucide-react";
import { SUGGESTION_TAGS } from "../lib/gameEngine";
import { playOptionClick, playCelebration } from "../lib/audio";

export default function SealedPassageReveal({
  name1 = "Partner 1",
  name2 = "Partner 2",
  avatar1 = "🐱",
  avatar2 = "🐰",
  passage1 = null, // passage written by Partner 1 for Partner 2
  passage2 = null, // passage written by Partner 2 for Partner 1
}) {
  const [activeTab, setActiveTab] = useState("p2_read"); // 'p2_read' (Partner 2 reads what Partner 1 wrote) or 'p1_read'
  const [unsealedP1, setUnsealedP1] = useState(false);
  const [unsealedP2, setUnsealedP2] = useState(false);
  const [copied, setCopied] = useState(false);

  // Normalize passage objects
  const p1Obj = typeof passage1 === "string" ? { text: passage1, tag: "wish", date: "Today" } : (passage1 || {
    text: `My sweetest ${name2},\n\nI want to suggest that we keep our sacred weekly date nights, hold each other's hands whenever we walk, and never stop laughing at silly inside jokes. Thank you for making my everyday life so magical. I love you endlessly! ❤️`,
    tag: "wish",
    date: "Today",
  });

  const p2Obj = typeof passage2 === "string" ? { text: passage2, tag: "date", date: "Today" } : (passage2 || {
    text: `Dearest ${name1},\n\nMy suggestion for us: let's plan that spontaneous weekend getaway we keep talking about! And whenever life gets stressful, remember you can always rest your head on my shoulder. You are my greatest home. 💕`,
    tag: "date",
    date: "Today",
  });

  const currentPassage = activeTab === "p2_read" ? p1Obj : p2Obj;
  const authorName = activeTab === "p2_read" ? name1 : name2;
  const authorAvatar = activeTab === "p2_read" ? avatar1 : avatar2;
  const recipientName = activeTab === "p2_read" ? name2 : name1;
  const recipientAvatar = activeTab === "p2_read" ? avatar2 : avatar1;
  const isCurrentlyUnsealed = activeTab === "p2_read" ? unsealedP1 : unsealedP2;

  const currentTagInfo = SUGGESTION_TAGS.find((t) => t.id === currentPassage.tag) || SUGGESTION_TAGS[0];

  const handleBreakSeal = () => {
    playCelebration();
    if (activeTab === "p2_read") {
      setUnsealedP1(true);
    } else {
      setUnsealedP2(true);
    }
  };

  const handleCopy = async () => {
    playOptionClick();
    const copyText = `💌 Special Suggestions from ${authorName} to ${recipientName}:\n\n"${currentPassage.text}"\n\n— Forever Us ❤️`;
    try {
      await navigator.clipboard.writeText(copyText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (e) {
      alert("Suggestions copied to clipboard!");
    }
  };

  const handleShareWhatsApp = () => {
    playOptionClick();
    const shareText = `💌 ${authorName}'s romantic suggestions for ${recipientName}:\n\n"${currentPassage.text}"\n\nForever Us Love Score Quiz ❤️`;
    const encoded = encodeURIComponent(shareText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, "_blank");
  };

  return (
    <section
      className="glass-card glass-card-glow"
      style={{
        padding: "36px 28px",
        borderRadius: "28px",
        border: "2px solid var(--rose-gold)",
        position: "relative",
        background: "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 240, 245, 0.96) 100%)",
        boxShadow: "0 12px 36px rgba(183, 110, 121, 0.18)",
      }}
    >
      <style jsx>{`
        @keyframes waxMelt {
          0% { transform: scale(1); filter: drop-shadow(0 0 0 rgba(255, 8, 68, 0)); }
          50% { transform: scale(1.18); filter: drop-shadow(0 0 20px rgba(255, 8, 68, 0.8)); }
          100% { transform: scale(1); }
        }
        @keyframes letterUnfold {
          from { opacity: 0; transform: translateY(16px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      {/* Section Header */}
      <div style={{ textAlign: "center", marginBottom: "26px" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "linear-gradient(135deg, rgba(255, 8, 68, 0.12) 0%, rgba(142, 5, 194, 0.16) 100%)",
            border: "1.5px solid var(--ruby-red)",
            padding: "6px 22px",
            borderRadius: "9999px",
            fontSize: "0.85rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "1px",
            color: "var(--ruby-red)",
            marginBottom: "10px",
          }}
        >
          <Mail size={15} />
          <span>Exchanged Partner Passages & Suggestions</span>
          <Sparkles size={15} />
        </div>

        <h3
          style={{
            fontSize: "clamp(1.5rem, 3.8vw, 2.1rem)",
            color: "var(--ruby-red)",
            margin: "0 0 6px 0",
            fontFamily: "var(--font-heading)",
          }}
        >
          Secret Love Letters & Suggestions 💌
        </h3>

        <p style={{ fontSize: "0.92rem", color: "var(--text-muted)", margin: 0 }}>
          Break the wax seal to read the romantic suggestions and sweet words you wrote for each other!
        </p>
      </div>

      {/* Switch Tabs: Who is reading what */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          marginBottom: "24px",
          flexWrap: "wrap",
        }}
      >
        <button
          type="button"
          onClick={() => {
            playOptionClick();
            setActiveTab("p2_read");
          }}
          style={{
            padding: "10px 20px",
            borderRadius: "9999px",
            border: activeTab === "p2_read" ? "2px solid var(--ruby-red)" : "1.5px solid var(--card-border-subtle)",
            background: activeTab === "p2_read"
              ? "linear-gradient(135deg, var(--ruby-red) 0%, var(--royal-purple) 100%)"
              : "rgba(255, 255, 255, 0.85)",
            color: activeTab === "p2_read" ? "#FFF" : "var(--text-dark)",
            fontWeight: 700,
            fontSize: "0.9rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "all 0.2s ease",
            boxShadow: activeTab === "p2_read" ? "0 4px 16px rgba(255, 8, 68, 0.3)" : "none",
          }}
        >
          <span>{avatar1}</span>
          <span>From {name1} for {name2}</span>
          {unsealedP1 && <Check size={14} />}
        </button>

        <button
          type="button"
          onClick={() => {
            playOptionClick();
            setActiveTab("p1_read");
          }}
          style={{
            padding: "10px 20px",
            borderRadius: "9999px",
            border: activeTab === "p1_read" ? "2px solid var(--royal-purple)" : "1.5px solid var(--card-border-subtle)",
            background: activeTab === "p1_read"
              ? "linear-gradient(135deg, var(--royal-purple) 0%, var(--ruby-red) 100%)"
              : "rgba(255, 255, 255, 0.85)",
            color: activeTab === "p1_read" ? "#FFF" : "var(--text-dark)",
            fontWeight: 700,
            fontSize: "0.9rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "all 0.2s ease",
            boxShadow: activeTab === "p1_read" ? "0 4px 16px rgba(142, 5, 194, 0.3)" : "none",
          }}
        >
          <span>{avatar2}</span>
          <span>From {name2} for {name1}</span>
          {unsealedP2 && <Check size={14} />}
        </button>
      </div>

      {/* ---------------- 1. SEALED ENVELOPE STATE ---------------- */}
      {!isCurrentlyUnsealed ? (
        <div
          style={{
            background: "linear-gradient(135deg, rgba(255, 245, 248, 0.9) 0%, rgba(248, 230, 240, 0.9) 100%)",
            border: "2px dashed var(--rose-gold)",
            borderRadius: "24px",
            padding: "44px 20px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
          }}
        >
          {/* Animated Wax Seal Stamp */}
          <button
            type="button"
            onClick={handleBreakSeal}
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              background: "radial-gradient(circle at 35% 35%, #FF2E74 0%, #D80032 60%, #8A0020 100%)",
              border: "4px solid #FFE4E8",
              boxShadow: "0 10px 28px rgba(216, 0, 50, 0.45), inset 0 2px 6px rgba(255, 255, 255, 0.6)",
              color: "#FFF",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              animation: "waxMelt 3s infinite ease-in-out",
              transition: "transform 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            title="Click to break wax seal!"
          >
            <Heart size={32} fill="#FFF" />
            <span style={{ fontSize: "0.72rem", fontWeight: 800, letterSpacing: "1px", marginTop: "2px" }}>
              WAX SEAL
            </span>
          </button>

          <div>
            <h4 style={{ margin: "0 0 6px 0", fontSize: "1.25rem", color: "var(--text-dark)", fontWeight: 700 }}>
              Wax-Sealed Letter from {authorName} {authorAvatar}
            </h4>
            <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--text-muted)" }}>
              Addressed with affection to {recipientName} {recipientAvatar}
            </p>
          </div>

          <button
            type="button"
            onClick={handleBreakSeal}
            className="heart-btn pulse-heart"
            style={{ padding: "12px 28px", fontSize: "0.95rem" }}
          >
            <span>Break Seal & Read Suggestions 🌹</span>
          </button>
        </div>
      ) : (
        /* ---------------- 2. UNSEALED PARCHMENT LETTER STATE ---------------- */
        <div
          style={{
            animation: "letterUnfold 0.45s ease-out",
            background: "linear-gradient(135deg, #FFFDF9 0%, #FFF8F0 100%)",
            border: "2px solid #E8C39E",
            borderRadius: "22px",
            padding: "30px 24px",
            boxShadow: "0 10px 30px rgba(183, 110, 121, 0.15), inset 0 0 40px rgba(255, 240, 220, 0.6)",
            position: "relative",
          }}
        >
          {/* Top Stamp & Tag */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "18px",
              flexWrap: "wrap",
              gap: "8px",
              borderBottom: "1px dashed #E0BA90",
              paddingBottom: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "1.4rem" }}>{authorAvatar}</span>
              <div>
                <span style={{ fontWeight: 700, fontSize: "0.98rem", color: "var(--ruby-red)" }}>
                  {authorName}&apos;s Passage for {recipientName}
                </span>
                <span style={{ display: "block", fontSize: "0.76rem", color: "var(--text-muted)" }}>
                  Sealed with love • {currentPassage.date || "Today"}
                </span>
              </div>
            </div>

            <span
              style={{
                fontSize: "0.82rem",
                fontWeight: 700,
                background: "rgba(255, 8, 68, 0.1)",
                color: "var(--ruby-red)",
                padding: "4px 14px",
                borderRadius: "9999px",
                border: "1px solid rgba(255, 8, 68, 0.2)",
              }}
            >
              {currentTagInfo.emoji} {currentTagInfo.label}
            </span>
          </div>

          {/* Letter Body Text */}
          <div
            style={{
              fontSize: "1.05rem",
              lineHeight: 1.75,
              color: "#3C2A30",
              fontFamily: "Georgia, serif",
              fontStyle: "italic",
              whiteSpace: "pre-wrap",
              padding: "10px 6px",
              minHeight: "100px",
            }}
          >
            &ldquo;{currentPassage.text}&rdquo;
          </div>

          {/* Bottom Actions */}
          <div
            style={{
              marginTop: "20px",
              paddingTop: "16px",
              borderTop: "1px dashed #E0BA90",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                type="button"
                onClick={handleCopy}
                style={{
                  background: "rgba(255, 255, 255, 0.9)",
                  border: "1px solid var(--rose-gold)",
                  borderRadius: "9999px",
                  padding: "7px 16px",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  color: "var(--ruby-red)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span>{copied ? "Copied! 💕" : "Copy Suggestions"}</span>
              </button>

              <button
                type="button"
                onClick={handleShareWhatsApp}
                style={{
                  background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
                  border: "none",
                  borderRadius: "9999px",
                  padding: "7px 16px",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  color: "#FFF",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <Share2 size={14} />
                <span>WhatsApp</span>
              </button>
            </div>

            <span style={{ fontSize: "0.78rem", color: "var(--text-subtle)", fontStyle: "italic" }}>
              Saved to your Relationship Memory Wall 🌹
            </span>
          </div>
        </div>
      )}
    </section>
  );
}
