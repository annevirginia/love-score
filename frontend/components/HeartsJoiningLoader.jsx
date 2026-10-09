"use client";

import { Heart, Sparkles } from "lucide-react";

export default function HeartsJoiningLoader({
  title = "Uniting Your Hearts...",
  subtitle = "Synchronizing your answers in real time ❤️",
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "36px 20px",
        textAlign: "center",
        gap: "16px",
      }}
    >
      {/* Two Hearts Joining Animation */}
      <div className="hearts-joining-container">
        <div className="heart-left-join" style={{ position: "absolute" }}>
          <Heart size={48} fill="var(--ruby-red)" color="var(--ruby-red)" />
        </div>
        <div className="heart-right-join" style={{ position: "absolute" }}>
          <Heart size={48} fill="var(--royal-purple)" color="var(--royal-purple)" />
        </div>
        <div
          style={{
            position: "absolute",
            zIndex: 10,
            animation: "pulseHeart 1.8s infinite ease-in-out",
          }}
        >
          <Sparkles size={24} color="#FFD700" />
        </div>
      </div>

      <div>
        <h3
          style={{
            fontSize: "1.45rem",
            color: "var(--ruby-red)",
            margin: "0 0 6px",
            fontFamily: "var(--font-heading)",
            letterSpacing: "0.5px",
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontSize: "0.95rem",
            color: "var(--text-muted)",
            margin: 0,
            maxWidth: "380px",
            lineHeight: 1.5,
          }}
        >
          {subtitle}
        </p>
      </div>
    </div>
  );
}
