"use client";

import { Sparkles, Compass, Heart, Calendar, Flame, Check } from "lucide-react";
import { generateCoupleCoachInsights } from "../lib/gameEngine";

export default function CoupleCoachInsights({
  answers1 = [],
  answers2 = [],
  score = 80,
  questions = [],
  name1 = "Partner 1",
  name2 = "Partner 2",
}) {
  const insights = generateCoupleCoachInsights(
    answers1,
    answers2,
    score,
    questions,
    name1,
    name2
  );

  return (
    <section
      className="glass-card"
      style={{
        padding: "34px 28px",
        borderRadius: "28px",
        border: "1.5px solid var(--card-border)",
        background: "rgba(255, 255, 255, 0.88)",
        boxShadow: "0 10px 30px rgba(255, 133, 179, 0.12)",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "linear-gradient(135deg, rgba(255, 8, 68, 0.12) 0%, rgba(142, 5, 194, 0.14) 100%)",
            border: "1.5px solid var(--ruby-red)",
            padding: "5px 20px",
            borderRadius: "9999px",
            fontSize: "0.82rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "1px",
            color: "var(--ruby-red)",
            marginBottom: "10px",
          }}
        >
          <Sparkles size={14} />
          <span>Personalized Couple Insights</span>
          <Sparkles size={14} />
        </div>

        <h3
          style={{
            fontSize: "clamp(1.4rem, 3.5vw, 1.95rem)",
            color: "var(--ruby-red)",
            margin: "0 0 6px 0",
            fontFamily: "var(--font-heading)",
          }}
        >
          Couple Insights & Relationship Advice 💫
        </h3>

        <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", margin: 0 }}>
          Tailored growth tips and romantic date ideas based on your 20 answers!
        </p>
      </div>

      {/* Grid of 4 Insight Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "18px",
        }}
      >
        {/* 1. Superpower */}
        <div
          style={{
            background: "linear-gradient(135deg, rgba(255, 240, 245, 0.9) 0%, rgba(255, 255, 255, 0.95) 100%)",
            border: "1.5px solid rgba(255, 8, 68, 0.25)",
            borderRadius: "20px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            boxShadow: "0 4px 14px rgba(255, 8, 68, 0.08)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "1.4rem" }}>🌟</span>
            <span style={{ fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", color: "var(--ruby-red)" }}>
              Your Couple Superpower
            </span>
          </div>
          <h4 style={{ margin: "2px 0", fontSize: "1.08rem", color: "var(--text-dark)", fontWeight: 700 }}>
            {insights.superpower.title}
          </h4>
          <p style={{ margin: 0, fontSize: "0.86rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
            {insights.superpower.desc}
          </p>
        </div>

        {/* 2. Custom Date Night Idea */}
        <div
          style={{
            background: "linear-gradient(135deg, rgba(248, 235, 255, 0.9) 0%, rgba(255, 255, 255, 0.95) 100%)",
            border: "1.5px solid rgba(142, 5, 194, 0.25)",
            borderRadius: "20px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            boxShadow: "0 4px 14px rgba(142, 5, 194, 0.08)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "1.4rem" }}>🌹</span>
            <span style={{ fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", color: "var(--royal-purple)" }}>
              Tailored Date Night
            </span>
          </div>
          <h4 style={{ margin: "2px 0", fontSize: "1.08rem", color: "var(--text-dark)", fontWeight: 700 }}>
            {insights.dateIdea.title}
          </h4>
          <p style={{ margin: 0, fontSize: "0.86rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
            {insights.dateIdea.desc}
          </p>
        </div>

        {/* 3. Intimacy Spark */}
        <div
          style={{
            background: "linear-gradient(135deg, rgba(255, 248, 235, 0.9) 0%, rgba(255, 255, 255, 0.95) 100%)",
            border: "1.5px solid rgba(255, 122, 0, 0.25)",
            borderRadius: "20px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            boxShadow: "0 4px 14px rgba(255, 122, 0, 0.08)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "1.4rem" }}>💬</span>
            <span style={{ fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", color: "#D96800" }}>
              Intimacy & Connection Spark
            </span>
          </div>
          <h4 style={{ margin: "2px 0", fontSize: "1.08rem", color: "var(--text-dark)", fontWeight: 700 }}>
            {insights.intimacyAdvice.title}
          </h4>
          <p style={{ margin: 0, fontSize: "0.86rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
            {insights.intimacyAdvice.desc}
          </p>
        </div>

        {/* 4. Weekend Challenge */}
        <div
          style={{
            background: "linear-gradient(135deg, rgba(235, 255, 245, 0.9) 0%, rgba(255, 255, 255, 0.95) 100%)",
            border: "1.5px solid rgba(0, 168, 107, 0.25)",
            borderRadius: "20px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            boxShadow: "0 4px 14px rgba(0, 168, 107, 0.08)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "1.4rem" }}>🎯</span>
            <span style={{ fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", color: "#008855" }}>
              Weekend Couple Challenge
            </span>
          </div>
          <h4 style={{ margin: "2px 0", fontSize: "1.08rem", color: "var(--text-dark)", fontWeight: 700 }}>
            {insights.weekendChallenge.title}
          </h4>
          <p style={{ margin: 0, fontSize: "0.86rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
            {insights.weekendChallenge.desc}
          </p>
        </div>
      </div>
    </section>
  );
}
