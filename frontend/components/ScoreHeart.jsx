"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

export default function ScoreHeart({
  targetScore = 82,
  tier = "Perfect Match",
  name1 = "",
  name2 = "",
  avatar1 = "🐱",
  avatar2 = "🐰",
}) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000; // ms
    const startTime = performance.now();

    const animateCount = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic curve
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (targetScore - start) * ease);
      setDisplayScore(current);

      if (progress < 1) {
        requestAnimationFrame(animateCount);
      }
    };

    requestAnimationFrame(animateCount);
  }, [targetScore]);

  // Liquid height based on score (0 to 100%)
  const fillHeightPercent = Math.max(10, Math.min(100, targetScore));

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        margin: "16px auto 28px",
      }}
    >
      {/* Outer Radiant Pulsing Aura (Red & Violet) */}
      <div
        style={{
          position: "absolute",
          width: "320px",
          height: "320px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255, 8, 68, 0.5) 0%, rgba(230, 0, 57, 0.3) 45%, rgba(142, 5, 194, 0.2) 75%, transparent 100%)",
          filter: "blur(32px)",
          zIndex: 0,
          animation: "redAuraPulse 3s infinite ease-in-out alternate",
        }}
      />

      <style jsx>{`
        @keyframes redAuraPulse {
          0% {
            transform: scale(0.92);
            opacity: 0.7;
          }
          100% {
            transform: scale(1.15);
            opacity: 1;
          }
        }
        @keyframes liquidRedWave {
          0% {
            transform: translate(-18px, ${90 - (fillHeightPercent * 90) / 100}px);
          }
          100% {
            transform: translate(18px, ${90 - (fillHeightPercent * 90) / 100}px);
          }
        }
      `}</style>

      {/* Couple Tag above Heart if names provided */}
      {name1 && name2 && (
        <div
          style={{
            zIndex: 2,
            marginBottom: "14px",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(255, 255, 255, 0.9)",
            border: "1.5px solid var(--ruby-red)",
            padding: "6px 18px",
            borderRadius: "9999px",
            fontSize: "0.95rem",
            fontWeight: 700,
            color: "var(--ruby-red)",
            boxShadow: "0 4px 16px rgba(255, 8, 68, 0.2)",
          }}
        >
          <span>{avatar1} {name1}</span>
          <span style={{ color: "#E60039" }}>❤️</span>
          <span>{name2} {avatar2}</span>
        </div>
      )}

      {/* Large Glowing Red Heart Display */}
      <div
        className="glowing-red-heart-container"
        style={{
          position: "relative",
          width: "270px",
          height: "250px",
          zIndex: 1,
        }}
      >
        <svg
          viewBox="0 0 100 90"
          style={{
            width: "100%",
            height: "100%",
            overflow: "visible",
          }}
        >
          <defs>
            {/* Smooth SVG Heart Mask */}
            <clipPath id="redHeartMask">
              <path d="M50 88 C20 62 0 45 0 26 C0 11 11 0 26 0 C36 0 45 6 50 15 C55 6 64 0 74 0 C89 0 100 11 100 26 C100 45 80 62 50 88 Z" />
            </clipPath>

            {/* Glowing Liquid Red Gradient */}
            <linearGradient id="liquidRedGrad" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#8A0022" />
              <stop offset="35%" stopColor="#C9002E" />
              <stop offset="70%" stopColor="#FF0844" />
              <stop offset="100%" stopColor="#FF4D79" />
            </linearGradient>

            {/* Heart Background Glow */}
            <linearGradient id="heartBasePinkGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFF0F5" />
              <stop offset="100%" stopColor="#FFE0EB" />
            </linearGradient>
          </defs>

          {/* Background Empty Heart */}
          <path
            d="M50 88 C20 62 0 45 0 26 C0 11 11 0 26 0 C36 0 45 6 50 15 C55 6 64 0 74 0 C89 0 100 11 100 26 C100 45 80 62 50 88 Z"
            fill="url(#heartBasePinkGrad)"
            stroke="#FF85B3"
            strokeWidth="2.5"
          />

          {/* Rising Liquid Red Fill clipped to Heart */}
          <g clipPath="url(#redHeartMask)">
            <rect
              x="-10"
              y={`${90 - (fillHeightPercent * 90) / 100}`}
              width="120"
              height="100"
              fill="url(#liquidRedGrad)"
              style={{
                transition: "y 2s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            />

            {/* Liquid wave surface shimmering line */}
            <path
              d="M-20 0 Q 15 -7, 50 0 T 120 0 V 16 H -20 Z"
              fill="rgba(255, 255, 255, 0.4)"
              transform={`translate(0, ${90 - (fillHeightPercent * 90) / 100})`}
              style={{
                animation: "liquidRedWave 2.8s ease-in-out infinite alternate",
              }}
            />
          </g>

          {/* Vibrant Glowing Crimson Border */}
          <path
            d="M50 88 C20 62 0 45 0 26 C0 11 11 0 26 0 C36 0 45 6 50 15 C55 6 64 0 74 0 C89 0 100 11 100 26 C100 45 80 62 50 88 Z"
            fill="none"
            stroke="#FF0844"
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
        </svg>

        {/* Live Score Counter inside Glowing Red Heart */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: "16px",
            color: fillHeightPercent > 45 ? "#FFFFFF" : "var(--ruby-red)",
            textShadow:
              fillHeightPercent > 45
                ? "0 2px 8px rgba(90, 0, 20, 0.65)"
                : "0 1px 4px rgba(255, 255, 255, 0.9)",
            transition: "color 0.4s ease",
            pointerEvents: "none",
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: "2px" }}>
            <span
              style={{
                fontSize: "3.6rem",
                fontWeight: 800,
                fontFamily: "var(--font-heading)",
                lineHeight: 1,
              }}
            >
              {displayScore}
            </span>
            <span style={{ fontSize: "1.6rem", fontWeight: 700 }}>%</span>
          </div>
          <span
            style={{
              fontSize: "0.85rem",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "1.5px",
              opacity: 0.95,
              marginTop: "2px",
            }}
          >
            Love Score
          </span>
        </div>
      </div>

      {/* Tier Badge Below Heart */}
      <div
        style={{
          marginTop: "18px",
          display: "inline-flex",
          alignItems: "center",
          gap: "10px",
          background: "linear-gradient(135deg, rgba(255, 8, 68, 0.16) 0%, rgba(142, 5, 194, 0.22) 100%)",
          border: "2px solid var(--ruby-red)",
          padding: "10px 26px",
          borderRadius: "9999px",
          fontSize: "1.25rem",
          fontWeight: 700,
          color: "var(--ruby-red)",
          boxShadow: "0 8px 24px rgba(255, 8, 68, 0.28)",
          zIndex: 2,
        }}
      >
        <Sparkles size={20} color="var(--ruby-red)" />
        <span>{tier}</span>
        <Sparkles size={20} color="var(--royal-purple)" />
      </div>
    </div>
  );
}
