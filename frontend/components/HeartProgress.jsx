"use client";

import { Heart, Sparkles } from "lucide-react";

export default function HeartProgress({
  total = 20,
  current = 0,
  category = "💖 Love",
  categoryIcon = "💖",
  personName = "Partner 1",
  personNumber = 1,
}) {
  const percent = Math.min(100, Math.max(5, Math.round(((current + 1) / total) * 100)));

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "700px",
        margin: "0 auto 20px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      {/* Top Status Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        {/* Active Partner Tag */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background:
              personNumber === 1
                ? "linear-gradient(135deg, rgba(255, 8, 68, 0.14) 0%, rgba(255, 133, 179, 0.22) 100%)"
                : "linear-gradient(135deg, rgba(142, 5, 194, 0.14) 0%, rgba(255, 8, 68, 0.18) 100%)",
            border: personNumber === 1 ? "1.5px solid var(--ruby-red)" : "1.5px solid var(--royal-purple)",
            padding: "6px 16px",
            borderRadius: "9999px",
            fontSize: "0.88rem",
            fontWeight: 700,
            color: personNumber === 1 ? "var(--ruby-red)" : "var(--royal-purple)",
            boxShadow: "0 2px 10px rgba(255, 8, 68, 0.12)",
          }}
        >
          <span style={{ fontSize: "1.1rem" }}>{personNumber === 1 ? "👑" : "💎"}</span>
          <span>
            Partner {personNumber}: <strong>{personName}</strong>
          </span>
          <span
            style={{
              fontSize: "0.72rem",
              background: personNumber === 1 ? "var(--ruby-red)" : "var(--royal-purple)",
              color: "#FFF",
              padding: "2px 8px",
              borderRadius: "10px",
              fontWeight: 800,
            }}
          >
            Turn {personNumber} of 2
          </span>
        </div>

        {/* Category & Question Counter Pill */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(255, 255, 255, 0.9)",
            border: "1.5px solid var(--card-border)",
            padding: "6px 16px",
            borderRadius: "9999px",
            fontSize: "0.88rem",
            fontWeight: 700,
            color: "var(--text-dark)",
            boxShadow: "0 2px 8px rgba(90, 42, 58, 0.05)",
          }}
        >
          <span>{categoryIcon}</span>
          <span style={{ color: "var(--ruby-red)" }}>{category}</span>
          <span
            style={{
              background: "rgba(255, 8, 68, 0.12)",
              color: "var(--ruby-red)",
              padding: "2px 8px",
              borderRadius: "8px",
              fontSize: "0.78rem",
              fontWeight: 800,
            }}
          >
            {current + 1} / {total}
          </span>
        </div>
      </div>

      {/* Smooth Continuous Glowing Progress Bar */}
      <div
        style={{
          width: "100%",
          height: "12px",
          background: "rgba(255, 225, 235, 0.8)",
          borderRadius: "9999px",
          overflow: "hidden",
          position: "relative",
          border: "1px solid rgba(255, 133, 179, 0.4)",
          boxShadow: "inset 0 1px 3px rgba(255, 8, 68, 0.15)",
        }}
        role="progressbar"
        aria-valuenow={current + 1}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-label={`Question ${current + 1} of ${total}`}
      >
        <div
          style={{
            height: "100%",
            width: `${percent}%`,
            background: "linear-gradient(90deg, #FF0844 0%, #FF2E74 50%, #B800FF 100%)",
            borderRadius: "9999px",
            transition: "width 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
            boxShadow: "0 0 12px rgba(255, 8, 68, 0.6)",
          }}
        />
      </div>

      {/* 20 Micro-Hearts Progress Icons for all 20 questions */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "2px",
          padding: "8px 12px",
          background: "rgba(255, 240, 246, 0.88)",
          borderRadius: "18px",
          border: "1px solid var(--card-border-subtle)",
          boxShadow: "inset 0 1px 4px rgba(255, 182, 201, 0.18)",
          overflowX: "auto",
        }}
      >
        {Array.from({ length: total }, (_, i) => {
          const isCompleted = i < current;
          const isCurrent = i === current;

          return (
            <div
              key={i}
              title={`Question ${i + 1} of ${total}`}
              style={{
                flex: 1,
                minWidth: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
                transform: isCurrent ? "scale(1.3)" : "scale(1)",
              }}
            >
              <Heart
                size={isCurrent ? 18 : 14}
                fill={isCompleted ? "var(--ruby-red)" : isCurrent ? "#FF4D79" : "none"}
                color={
                  isCompleted
                    ? "var(--ruby-red)"
                    : isCurrent
                    ? "#FF0844"
                    : "rgba(255, 133, 179, 0.6)"
                }
                strokeWidth={isCompleted || isCurrent ? 2.4 : 1.8}
                className={isCurrent ? "beating-heart" : ""}
                style={{
                  filter: isCurrent
                    ? "drop-shadow(0 0 6px rgba(255, 8, 68, 0.8))"
                    : isCompleted
                    ? "drop-shadow(0 1px 2px rgba(255, 8, 68, 0.3))"
                    : "none",
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
