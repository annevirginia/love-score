"use client";

import { Heart } from "lucide-react";

export default function HeartProgress({
  total = 15,
  current = 0,
  category = "Communication",
  categoryIcon = "💬",
  personName = "Person 1",
  personNumber = 1,
}) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "680px",
        margin: "0 auto 24px",
      }}
    >
      {/* Top status info bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px",
          marginBottom: "12px",
        }}
      >
        {/* Person tag */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: personNumber === 1 ? "rgba(255, 111, 145, 0.15)" : "rgba(242, 80, 120, 0.2)",
            border: "1.5px solid var(--deep-rose)",
            padding: "6px 14px",
            borderRadius: "9999px",
            fontSize: "0.88rem",
            fontWeight: 600,
            color: "var(--deep-rose)",
          }}
        >
          <span style={{ fontSize: "1rem" }}>{personNumber === 1 ? "👑" : "💎"}</span>
          <span>Turn: <strong>{personName}</strong></span>
          <span
            style={{
              fontSize: "0.72rem",
              background: "var(--deep-rose)",
              color: "#FFF",
              padding: "2px 8px",
              borderRadius: "10px",
            }}
          >
            Person {personNumber} of 2
          </span>
        </div>

        {/* Category tag */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            background: "rgba(255, 255, 255, 0.8)",
            border: "1px solid var(--main-pink)",
            padding: "6px 14px",
            borderRadius: "9999px",
            fontSize: "0.85rem",
            fontWeight: 500,
            color: "var(--text-dark)",
          }}
        >
          <span>{categoryIcon}</span>
          <span>{category}</span>
          <span style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginLeft: "4px" }}>
            ({current + 1}/{total})
          </span>
        </div>
      </div>

      {/* 15 Heart progress icons */}
      <div
        role="progressbar"
        aria-valuenow={current + 1}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-label={`Question ${current + 1} of ${total}`}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "4px",
          padding: "10px 14px",
          background: "rgba(255, 240, 245, 0.85)",
          borderRadius: "20px",
          border: "1px solid var(--card-border-subtle)",
          boxShadow: "inset 0 2px 6px rgba(255, 182, 201, 0.2)",
        }}
      >
        {Array.from({ length: total }, (_, i) => {
          const isCompleted = i < current;
          const isCurrent = i === current;

          return (
            <div
              key={i}
              title={`Question ${i + 1}`}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                transform: isCurrent ? "scale(1.25)" : "scale(1)",
              }}
            >
              <Heart
                size={isCurrent ? 20 : 16}
                fill={isCompleted ? "var(--deep-rose)" : isCurrent ? "var(--rose-hover)" : "none"}
                color={
                  isCompleted
                    ? "var(--deep-rose)"
                    : isCurrent
                    ? "var(--deep-rose)"
                    : "rgba(255, 182, 201, 0.9)"
                }
                strokeWidth={isCompleted || isCurrent ? 2.2 : 1.8}
                className={isCurrent ? "beating-heart" : ""}
                style={{
                  filter: isCurrent
                    ? "drop-shadow(0 0 6px rgba(255, 111, 145, 0.8))"
                    : isCompleted
                    ? "drop-shadow(0 1px 3px rgba(255, 111, 145, 0.4))"
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
