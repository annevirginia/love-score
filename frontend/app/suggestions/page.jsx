"use client";

import Link from "next/link";
import { ArrowLeft, Sparkles, Heart } from "lucide-react";
import StandaloneSuggestionBox from "../../components/StandaloneSuggestionBox";

export default function SuggestionsPage() {
  return (
    <div
      style={{
        maxWidth: "840px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      {/* Top Navigation */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link
          href="/"
          className="heart-btn heart-btn-secondary"
          style={{ padding: "8px 18px", fontSize: "0.9rem" }}
        >
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </Link>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            background: "linear-gradient(135deg, rgba(255, 8, 68, 0.1) 0%, rgba(142, 5, 194, 0.1) 100%)",
            border: "1.5px solid var(--ruby-red)",
            padding: "6px 14px",
            borderRadius: "9999px",
            fontSize: "0.82rem",
            fontWeight: 800,
            color: "var(--ruby-red)",
          }}
        >
          <Heart size={14} fill="var(--ruby-red)" />
          <span>No Quiz Required</span>
        </div>
      </div>

      {/* Standalone Couple Suggestion Box */}
      <StandaloneSuggestionBox
        title="Couple Suggestion & Love Advice Box"
        subtitle="Browse expert couple tips, write secret wishes to your partner, and keep a shared love jar — open anytime even without attending the quiz! 💌"
      />
    </div>
  );
}
