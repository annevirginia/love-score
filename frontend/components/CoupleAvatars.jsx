"use client";

import { useState } from "react";
import { Heart, Sparkles } from "lucide-react";

export function getCoupleStatusData(score) {
  if (score === null || score === undefined || isNaN(score)) {
    return {
      tierKey: "unscored",
      title: "Ready for Love Quiz",
      badgeText: "✨ Take Quiz Together",
      message: "Take the quiz together to discover how well you understand each other.",
      imageSrc: "/images/avatars/couple_ready_waiting.jpg",
      gradient: "linear-gradient(135deg, #FF2E74 0%, #8E05C2 100%)",
      glowColor: "rgba(255, 46, 116, 0.4)",
      boyPose: "waiting",
      girlPose: "waiting",
      heartEmoji: "💖",
    };
  }

  const numScore = Number(score);

  if (numScore > 70) {
    return {
      tierKey: "high",
      title: "Perfect Match!",
      badgeText: "💍 Soulmate Resonance",
      message: "Perfect Match! You two are amazing together!",
      imageSrc: "/images/avatars/couple_match_hugging.jpg",
      gradient: "linear-gradient(135deg, #FF0844 0%, #FF2E74 100%)",
      glowColor: "rgba(255, 8, 68, 0.55)",
      boyPose: "hugging",
      girlPose: "hugging",
      heartEmoji: "❤️",
    };
  }

  if (numScore >= 40) {
    return {
      tierKey: "medium",
      title: "Good Connection!",
      badgeText: "🌷 Growing Love",
      message: "Good Connection! Keep understanding each other.",
      imageSrc: "/images/avatars/couple_good_connection.jpg",
      gradient: "linear-gradient(135deg, #FF6584 0%, #E60039 100%)",
      glowColor: "rgba(255, 101, 132, 0.45)",
      boyPose: "standing",
      girlPose: "standing",
      heartEmoji: "💕",
    };
  }

  return {
    tierKey: "low",
    title: "Get Lost! 😂",
    badgeText: "⚡ Playful Spark",
    message: "Get Lost! 😂 Maybe you both need more quality time!",
    imageSrc: "/images/avatars/couple_get_lost.jpg",
    gradient: "linear-gradient(135deg, #FF8A00 0%, #FF0844 100%)",
    glowColor: "rgba(255, 138, 0, 0.45)",
    boyPose: "sulking",
    girlPose: "sulking",
    heartEmoji: "💔",
  };
}

/**
 * High-detail animated SVG vector fallback that renders instantly
 * if offline or if images fail to load.
 */
function FallbackVectorCouple({ statusData, name1, name2 }) {
  const { tierKey } = statusData;

  return (
    <svg
      viewBox="0 0 360 260"
      style={{
        width: "100%",
        maxWidth: "320px",
        height: "auto",
        filter: "drop-shadow(0 12px 24px rgba(255, 8, 68, 0.15))",
      }}
    >
      <defs>
        <linearGradient id="bgGlow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFF0F5" />
          <stop offset="100%" stopColor="#FFE4EC" />
        </linearGradient>
        <linearGradient id="roseSkin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFDFC4" />
          <stop offset="100%" stopColor="#F5CBA7" />
        </linearGradient>
        <linearGradient id="boyHairGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#5D4037" />
          <stop offset="100%" stopColor="#3E2723" />
        </linearGradient>
        <linearGradient id="girlHairGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6D4C41" />
          <stop offset="100%" stopColor="#4E342E" />
        </linearGradient>
        <linearGradient id="boyShirtGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E57373" />
          <stop offset="100%" stopColor="#D32F2F" />
        </linearGradient>
        <linearGradient id="girlDressGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFF9C4" />
          <stop offset="100%" stopColor="#FFE082" />
        </linearGradient>
      </defs>

      {/* Backdrop */}
      <rect x="10" y="10" width="340" height="240" rx="28" fill="url(#bgGlow)" />
      <circle cx="180" cy="130" r="85" fill="#FFFFFF" opacity="0.65" />

      {/* TIER 1: HIGH SCORE (> 70) -> Hugging lovingly */}
      {tierKey === "high" && (
        <g>
          {/* Floating Hearts */}
          <path d="M180,45 C175,35 160,35 160,50 C160,65 180,80 180,80 C180,80 200,65 200,50 C200,35 185,35 180,45 Z" fill="#FF0844" />
          <path d="M125,75 C121,68 110,68 110,78 C110,88 125,98 125,98 C125,98 140,88 140,78 C140,68 129,68 125,75 Z" fill="#FF4D8D" opacity="0.8" />
          <path d="M235,75 C231,68 220,68 220,78 C220,88 235,98 235,98 C235,98 250,88 250,78 C250,68 239,68 235,75 Z" fill="#FF4D8D" opacity="0.8" />

          {/* Boy Body & Hugging Arms */}
          <path d="M130,150 Q160,140 180,150 L170,225 L125,225 Z" fill="url(#boyShirtGrad)" />
          {/* Girl Body */}
          <path d="M175,155 Q205,145 225,160 L240,225 L175,225 Z" fill="url(#girlDressGrad)" />
          {/* Wrapped Arms */}
          <path d="M135,165 Q175,185 210,165" stroke="#D32F2F" strokeWidth="12" strokeLinecap="round" fill="none" />
          <path d="M220,170 Q180,185 145,170" stroke="#FFE082" strokeWidth="10" strokeLinecap="round" fill="none" />

          {/* Boy Head */}
          <circle cx="150" cy="115" r="32" fill="url(#roseSkin)" />
          <path d="M120,115 C120,80 175,80 178,105 C165,100 135,100 120,115 Z" fill="url(#boyHairGrad)" />
          {/* Boy Happy Face */}
          <path d="M140,118 Q145,123 150,118" stroke="#3E2723" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <circle cx="138" cy="124" r="4.5" fill="#FF85B3" opacity="0.75" />
          <path d="M142,128 Q148,135 154,128" stroke="#3E2723" strokeWidth="2" fill="none" strokeLinecap="round" />

          {/* Girl Head */}
          <circle cx="195" cy="115" r="30" fill="url(#roseSkin)" />
          {/* Girl Hair */}
          <path d="M170,110 C170,75 228,75 228,110 C232,135 220,150 215,155 C205,140 215,120 190,105 Z" fill="url(#girlHairGrad)" />
          {/* Flower in Girl's Hair */}
          <circle cx="218" cy="98" r="6" fill="#FFFFFF" />
          <circle cx="218" cy="98" r="2.5" fill="#FF0844" />
          {/* Girl Happy Face */}
          <path d="M190,118 Q195,123 200,118" stroke="#3E2723" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <circle cx="202" cy="124" r="4.5" fill="#FF85B3" opacity="0.75" />
          <path d="M190,128 Q196,136 202,128" stroke="#3E2723" strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>
      )}

      {/* TIER 2: MEDIUM SCORE (40-70) -> Standing together holding hands */}
      {tierKey === "medium" && (
        <g>
          {/* Center Sweet Heart */}
          <path d="M180,140 C176,132 166,132 166,142 C166,152 180,162 180,162 C180,162 194,152 194,142 C194,132 184,132 180,140 Z" fill="#FF2E74" />

          {/* Boy Body */}
          <rect x="110" y="150" width="46" height="75" rx="14" fill="url(#boyShirtGrad)" />
          {/* Boy Head */}
          <circle cx="133" cy="112" r="30" fill="url(#roseSkin)" />
          <path d="M105,110 C105,75 160,75 160,105 C145,100 120,100 105,110 Z" fill="url(#boyHairGrad)" />
          <circle cx="125" cy="114" r="2.5" fill="#3E2723" />
          <circle cx="140" cy="114" r="2.5" fill="#3E2723" />
          <path d="M128,124 Q133,130 138,124" stroke="#3E2723" strokeWidth="2" fill="none" strokeLinecap="round" />
          <circle cx="121" cy="121" r="3.5" fill="#FF85B3" opacity="0.6" />

          {/* Girl Body */}
          <path d="M198,150 L242,150 L252,225 L190,225 Z" fill="url(#girlDressGrad)" />
          {/* Girl Head */}
          <circle cx="222" cy="112" r="30" fill="url(#roseSkin)" />
          <path d="M196,110 C196,75 252,75 252,110 C254,140 242,150 238,155 C230,135 240,115 215,105 Z" fill="url(#girlHairGrad)" />
          <circle cx="244" cy="98" r="5" fill="#FFFFFF" />
          <circle cx="244" cy="98" r="2" fill="#FF0844" />
          <circle cx="214" cy="114" r="2.5" fill="#3E2723" />
          <circle cx="229" cy="114" r="2.5" fill="#3E2723" />
          <path d="M217,124 Q222,130 227,124" stroke="#3E2723" strokeWidth="2" fill="none" strokeLinecap="round" />
          <circle cx="233" cy="121" r="3.5" fill="#FF85B3" opacity="0.6" />

          {/* Holding Hands */}
          <path d="M152,175 Q180,185 200,175" stroke="url(#roseSkin)" strokeWidth="8" strokeLinecap="round" fill="none" />
        </g>
      )}

      {/* TIER 3: LOW SCORE (< 40) -> Get Lost! Facing away playfully with arms crossed */}
      {tierKey === "low" && (
        <g>
          {/* Funny Broken Cartoon Heart */}
          <g transform="translate(162, 105)">
            <path d="M18,12 L8,0 C2,0 0,6 0,11 C0,20 18,32 18,32 L14,21 L22,16 Z" fill="#FF0844" />
            <path d="M18,12 L28,0 C34,0 36,6 36,11 C36,20 18,32 18,32 L22,21 L14,16 Z" fill="#FF4D8D" />
            <text x="13" y="24" fontSize="14" fill="#FFFFFF" fontWeight="bold">?</text>
          </g>

          {/* Boy on Left - Facing Away to Left with Arms Crossed */}
          <g transform="translate(-10, 0)">
            <rect x="75" y="150" width="46" height="75" rx="14" fill="url(#boyShirtGrad)" />
            {/* Arms crossed */}
            <path d="M72,170 Q95,185 120,170" stroke="#B71C1C" strokeWidth="8" strokeLinecap="round" fill="none" />
            {/* Boy Head looking left */}
            <circle cx="95" cy="112" r="30" fill="url(#roseSkin)" />
            <path d="M68,110 C68,75 124,75 124,105 C110,100 85,100 68,110 Z" fill="url(#boyHairGrad)" />
            {/* Playful pouting eyebrow & eye */}
            <line x1="82" y1="108" x2="92" y2="112" stroke="#3E2723" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="86" cy="115" r="2.5" fill="#3E2723" />
            {/* Sulking pout */}
            <path d="M82,126 Q86,122 92,126" stroke="#3E2723" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            {/* Playful cartoon puff / sweat */}
            <text x="65" y="95" fontSize="14">😤</text>
          </g>

          {/* Girl on Right - Facing Away to Right with Arms Crossed */}
          <g transform="translate(15, 0)">
            <path d="M235,150 L275,150 L285,225 L225,225 Z" fill="url(#girlDressGrad)" />
            {/* Arms crossed */}
            <path d="M230,170 Q255,185 280,170" stroke="#F57F17" strokeWidth="8" strokeLinecap="round" fill="none" />
            {/* Girl Head looking right */}
            <circle cx="255" cy="112" r="30" fill="url(#roseSkin)" />
            <path d="M230,110 C230,75 285,75 285,110 C290,140 275,150 270,155 C260,135 270,115 245,105 Z" fill="url(#girlHairGrad)" />
            <circle cx="280" cy="98" r="5" fill="#FFFFFF" />
            <circle cx="280" cy="98" r="2" fill="#FF0844" />
            {/* Sassy eyebrow & eye */}
            <line x1="262" y1="112" x2="272" y2="108" stroke="#3E2723" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="266" cy="115" r="2.5" fill="#3E2723" />
            {/* Comical pout */}
            <path d="M260,126 Q266,122 272,126" stroke="#3E2723" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <text x="278" y="95" fontSize="14">💨</text>
          </g>
        </g>
      )}

      {/* UNSCORED / PRE-QUIZ -> Eagerly ready */}
      {tierKey === "unscored" && (
        <g>
          {/* Big Pulsing Center Rose/Heart */}
          <path d="M180,135 C174,125 160,125 160,137 C160,150 180,163 180,163 C180,163 200,150 200,137 C200,125 186,125 180,135 Z" fill="#FF0844" />
          <text x="174" y="95" fontSize="18">🌹</text>

          {/* Boy Body */}
          <rect x="110" y="150" width="46" height="75" rx="14" fill="url(#boyShirtGrad)" />
          <circle cx="133" cy="112" r="30" fill="url(#roseSkin)" />
          <path d="M105,110 C105,75 160,75 160,105 C145,100 120,100 105,110 Z" fill="url(#boyHairGrad)" />
          <circle cx="127" cy="114" r="2.5" fill="#3E2723" />
          <circle cx="141" cy="114" r="2.5" fill="#3E2723" />
          <path d="M130,124 Q135,130 140,124" stroke="#3E2723" strokeWidth="2" fill="none" strokeLinecap="round" />

          {/* Girl Body */}
          <path d="M198,150 L242,150 L252,225 L190,225 Z" fill="url(#girlDressGrad)" />
          <circle cx="222" cy="112" r="30" fill="url(#roseSkin)" />
          <path d="M196,110 C196,75 252,75 252,110 C254,140 242,150 238,155 C230,135 240,115 215,105 Z" fill="url(#girlHairGrad)" />
          <circle cx="244" cy="98" r="5" fill="#FFFFFF" />
          <circle cx="244" cy="98" r="2" fill="#FF0844" />
          <circle cx="214" cy="114" r="2.5" fill="#3E2723" />
          <circle cx="228" cy="114" r="2.5" fill="#3E2723" />
          <path d="M217,124 Q222,130 227,124" stroke="#3E2723" strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
}

export default function CoupleAvatars({
  score = null,
  name1 = "Partner 1",
  name2 = "Partner 2",
  avatar1 = "🐱",
  avatar2 = "🐰",
  size = "medium", // 'small', 'medium', 'large'
}) {
  const statusData = getCoupleStatusData(score);
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  // Avatar dimension styling
  const maxWidth = size === "large" ? "340px" : size === "small" ? "200px" : "270px";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        position: "relative",
      }}
    >
      {/* 1. Twin Avatar Header: [Boy Avatar] ❤️ [Girl Avatar] */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "14px",
          marginBottom: "14px",
        }}
      >
        {/* Boy Avatar Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(255, 255, 255, 0.92)",
            border: "1.5px solid rgba(255, 46, 116, 0.3)",
            padding: "6px 14px",
            borderRadius: "999px",
            boxShadow: "0 4px 14px rgba(255, 8, 68, 0.1)",
          }}
        >
          <span style={{ fontSize: "1.25rem" }}>👦</span>
          <span
            style={{
              fontSize: "0.85rem",
              fontWeight: 700,
              color: "#421028",
              maxWidth: "100px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {name1}
          </span>
        </div>

        {/* Pulsing Love Connection Heart */}
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #FF0844 0%, #FF2E74 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
            boxShadow: "0 4px 14px rgba(255, 8, 68, 0.4)",
            animation: "pulseHeart 2s infinite ease-in-out",
          }}
        >
          <Heart size={18} fill="#ffffff" />
        </div>

        {/* Girl Avatar Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(255, 255, 255, 0.92)",
            border: "1.5px solid rgba(255, 46, 116, 0.3)",
            padding: "6px 14px",
            borderRadius: "999px",
            boxShadow: "0 4px 14px rgba(255, 8, 68, 0.1)",
          }}
        >
          <span style={{ fontSize: "1.25rem" }}>👧</span>
          <span
            style={{
              fontSize: "0.85rem",
              fontWeight: 700,
              color: "#421028",
              maxWidth: "100px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {name2}
          </span>
        </div>
      </div>

      {/* 2. Central Illustrated Couple Avatar Card */}
      <div
        style={{
          width: "100%",
          maxWidth,
          borderRadius: "26px",
          padding: "10px",
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 240, 246, 0.9) 100%)",
          border: "2px solid rgba(255, 46, 116, 0.28)",
          boxShadow: `0 16px 40px ${statusData.glowColor}, 0 2px 10px rgba(0,0,0,0.05)`,
          position: "relative",
          overflow: "hidden",
          transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            borderRadius: "20px",
            overflow: "hidden",
            aspectRatio: "1/1",
            background: "#FFF0F5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {!imgError ? (
            <img
              src={statusData.imageSrc}
              alt={`${name1} and ${name2} couple avatar - ${statusData.title}`}
              key={statusData.imageSrc} // triggers smooth re-render on score change
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                transition: "opacity 0.35s ease, transform 0.35s ease",
                opacity: imgLoaded ? 1 : 0.85,
              }}
            />
          ) : (
            <FallbackVectorCouple
              statusData={statusData}
              name1={name1}
              name2={name2}
            />
          )}

          {/* Floating Tier Stamp Badge */}
          <div
            style={{
              position: "absolute",
              bottom: "10px",
              left: "50%",
              transform: "translateX(-50%)",
              background: statusData.gradient,
              color: "#ffffff",
              padding: "5px 14px",
              borderRadius: "999px",
              fontSize: "0.78rem",
              fontWeight: 800,
              letterSpacing: "0.4px",
              boxShadow: "0 6px 18px rgba(0, 0, 0, 0.25)",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              whiteSpace: "nowrap",
            }}
          >
            <Sparkles size={12} />
            {statusData.badgeText}
          </div>
        </div>
      </div>

      {/* 3. Status Message Banner */}
      <div
        style={{
          marginTop: "14px",
          textAlign: "center",
          maxWidth: "420px",
        }}
      >
        <h3
          style={{
            margin: "0 0 4px 0",
            fontSize: "1.18rem",
            fontWeight: 800,
            color: "#421028",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
          }}
        >
          <span>{statusData.heartEmoji}</span>
          <span>{statusData.title}</span>
        </h3>
        <p
          style={{
            margin: 0,
            fontSize: "0.92rem",
            fontWeight: 600,
            color: "#7E3E5B",
            lineHeight: 1.45,
          }}
        >
          {statusData.message}
        </p>
      </div>

      <style jsx>{`
        @keyframes pulseHeart {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.14);
          }
        }
      `}</style>
    </div>
  );
}
