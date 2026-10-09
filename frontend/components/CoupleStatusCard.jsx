"use client";

import Link from "next/link";
import { Heart, Sparkles, ArrowRight, Flame, RotateCcw } from "lucide-react";
import CoupleAvatars, { getCoupleStatusData } from "./CoupleAvatars";
import RelationshipSuggestionBox from "./RelationshipSuggestionBox";
import { playOptionClick } from "../lib/audio";

export default function CoupleStatusCard({
  score = null,
  name1 = "Partner 1",
  name2 = "Partner 2",
  avatar1 = "🐱",
  avatar2 = "🐰",
  quizHref = "/quiz",
  onStartQuiz = null,
  showQuizButton = true,
  quizButtonText = "Take Couple Quiz ❤️",
  compact = false,
  className = "",
  style = {},
}) {
  const isScored = score !== null && score !== undefined && !isNaN(score);
  const statusData = getCoupleStatusData(score);

  return (
    <div
      className={`couple-status-card glass-card ${className}`}
      style={{
        width: "100%",
        maxWidth: compact ? "620px" : "720px",
        margin: "0 auto 28px auto",
        padding: compact ? "24px 20px" : "34px 28px",
        background:
          "linear-gradient(135deg, rgba(255, 255, 255, 0.94) 0%, rgba(255, 242, 247, 0.92) 50%, rgba(248, 235, 255, 0.9) 100%)",
        border: "2px solid rgba(255, 46, 116, 0.28)",
        borderRadius: "32px",
        boxShadow:
          "0 20px 50px rgba(255, 8, 68, 0.12), 0 8px 24px rgba(142, 5, 194, 0.08)",
        position: "relative",
        overflow: "hidden",
        boxSizing: "border-box",
        ...style,
      }}
    >
      {/* Ambient background glow element */}
      <div
        style={{
          position: "absolute",
          top: "-60px",
          right: "-60px",
          width: "200px",
          height: "200px",
          background: "radial-gradient(circle, rgba(255, 8, 68, 0.14) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-60px",
          left: "-60px",
          width: "200px",
          height: "200px",
          background: "radial-gradient(circle, rgba(142, 5, 194, 0.1) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />

      {/* 1. Header: "Your Couple Status" */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "7px",
            background: "linear-gradient(135deg, rgba(255, 8, 68, 0.1) 0%, rgba(142, 5, 194, 0.1) 100%)",
            border: "1px solid rgba(255, 46, 116, 0.25)",
            padding: "5px 16px",
            borderRadius: "999px",
            fontSize: "0.82rem",
            fontWeight: 700,
            color: "#FF0844",
            letterSpacing: "0.5px",
            marginBottom: "8px",
          }}
        >
          <Sparkles size={14} color="#FF0844" />
          <span>COUPLE COMPATIBILITY & HARMONY</span>
        </div>

        <h2
          style={{
            margin: "0 0 6px 0",
            fontSize: compact ? "1.6rem" : "2rem",
            fontWeight: 800,
            fontFamily: "var(--font-heading, inherit)",
            background: "linear-gradient(135deg, #FF0844 0%, #FF2E74 50%, #8E05C2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "0.3px",
          }}
        >
          Your Couple Status
        </h2>

        <p
          style={{
            margin: 0,
            fontSize: "0.92rem",
            color: "#7E3E5B",
            fontWeight: 500,
          }}
        >
          {name1} & {name2}
        </p>
      </div>

      {/* 2. Couple Avatars (Boy & Girl with dynamic reaction) */}
      <div style={{ marginBottom: "24px" }}>
        <CoupleAvatars
          score={score}
          name1={name1}
          name2={name2}
          avatar1={avatar1}
          avatar2={avatar2}
          size={compact ? "medium" : "large"}
        />
      </div>

      {/* 3. Love Score Banner */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "22px",
          padding: "16px 20px",
          borderRadius: "22px",
          background: isScored
            ? "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 240, 245, 0.95) 100%)"
            : "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(245, 235, 255, 0.95) 100%)",
          border: isScored
            ? score > 70
              ? "2px solid rgba(255, 8, 68, 0.35)"
              : score >= 40
              ? "2px solid rgba(255, 101, 132, 0.35)"
              : "2px solid rgba(255, 138, 0, 0.35)"
            : "1.5px solid rgba(142, 5, 194, 0.25)",
          boxShadow: isScored
            ? `0 10px 28px ${statusData.glowColor}`
            : "0 8px 24px rgba(142, 5, 194, 0.08)",
        }}
      >
        <span
          style={{
            fontSize: "0.82rem",
            fontWeight: 700,
            color: "#7E3E5B",
            textTransform: "uppercase",
            letterSpacing: "0.8px",
            marginBottom: "4px",
          }}
        >
          Compatibility Meter
        </span>

        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "8px",
          }}
        >
          <span
            style={{
              fontSize: "1.1rem",
              fontWeight: 700,
              color: "#421028",
            }}
          >
            Love Score:
          </span>
          <span
            style={{
              fontSize: compact ? "1.85rem" : "2.2rem",
              fontWeight: 900,
              background: statusData.gradient,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-0.5px",
            }}
          >
            {isScored ? `${score}%` : "Ready to Reveal ❤️"}
          </span>
        </div>

        {/* Status Title Callout */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            marginTop: "6px",
            padding: "4px 14px",
            borderRadius: "999px",
            background: statusData.gradient,
            color: "#ffffff",
            fontSize: "0.86rem",
            fontWeight: 800,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
        >
          <Heart size={14} fill="#ffffff" />
          <span>{statusData.title}</span>
        </div>
      </div>

      {/* 4. Suggestion Box */}
      <div style={{ marginBottom: showQuizButton ? "22px" : "0" }}>
        <RelationshipSuggestionBox
          score={score}
          name1={name1}
          name2={name2}
          compact={compact}
        />
      </div>

      {/* 5. Quiz Button */}
      {showQuizButton && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "16px",
          }}
        >
          {onStartQuiz ? (
            <button
              onClick={() => {
                try {
                  playOptionClick();
                } catch (e) {}
                onStartQuiz();
              }}
              style={{
                width: "100%",
                maxWidth: "380px",
                padding: "16px 28px",
                borderRadius: "999px",
                border: "none",
                background: "linear-gradient(135deg, #FF0844 0%, #FF2E74 50%, #8E05C2 100%)",
                color: "#ffffff",
                fontSize: "1.05rem",
                fontWeight: 800,
                cursor: "pointer",
                boxShadow: "0 10px 28px rgba(255, 8, 68, 0.45)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                transition: "all 0.25s ease",
              }}
            >
              <span>{quizButtonText}</span>
              <ArrowRight size={18} />
            </button>
          ) : (
            <Link
              href={quizHref}
              onClick={() => {
                try {
                  playOptionClick();
                } catch (e) {}
              }}
              style={{
                width: "100%",
                maxWidth: "380px",
                padding: "16px 28px",
                borderRadius: "999px",
                background: "linear-gradient(135deg, #FF0844 0%, #FF2E74 50%, #8E05C2 100%)",
                color: "#ffffff",
                fontSize: "1.05rem",
                fontWeight: 800,
                textAlign: "center",
                boxShadow: "0 10px 28px rgba(255, 8, 68, 0.45)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                transition: "all 0.25s ease",
              }}
            >
              <span>{quizButtonText}</span>
              <ArrowRight size={18} />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
