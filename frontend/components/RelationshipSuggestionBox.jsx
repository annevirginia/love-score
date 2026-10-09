"use client";

import { useState, useEffect } from "react";
import { Sparkles, Heart, Lightbulb, RefreshCw, Copy, Check, Share2 } from "lucide-react";
import { playOptionClick } from "../lib/audio";

// General pre-quiz relationship suggestions shown before the quiz is taken
export const GENERAL_PRE_QUIZ_SUGGESTIONS = [
  {
    tag: "✨ Couple Bonding",
    text: "Take the quiz together to discover how well you understand each other.",
    detail: "Answer honestly from the heart—it's not about being identical, but about appreciating each other's world.",
  },
  {
    tag: "📸 Cherished Memories",
    text: "Spend some time talking about your favorite memories together.",
    detail: "Revisit how you first met, your favorite trip, and the funniest inside jokes you share.",
  },
  {
    tag: "🫂 Gentle Intimacy",
    text: "A sweet 30-second silent hug before starting calms your nerves and synchronizes your hearts.",
    detail: "Holding each other tightly releases oxytocin and creates emotional presence.",
  },
  {
    tag: "📵 Sacred Attention",
    text: "Turn off phone notifications for 10 minutes to give each other 100% undivided devotion.",
    detail: "Undistracted couple presence is the ultimate modern luxury of romance.",
  },
  {
    tag: "💌 Unspoken Appreciation",
    text: "Whisper an unexpected compliment to your partner before taking the first question.",
    detail: "Remind them of a small, quiet quirk that made you fall in love with them.",
  },
  {
    tag: "🍯 Sweet Habit",
    text: "Healthy relationships thrive on laughter and emotional safety—embrace each other's silly side!",
    detail: "Never be afraid to be a goofy kid with the person who holds your heart.",
  },
];

// Suggestions dynamically tailored to the score
export const SCORE_BASED_SUGGESTIONS = {
  high: [ // score > 70
    {
      tag: "💍 Perfect Match Advice",
      text: "You two have extraordinary chemistry! Keep nurturing your daily emotional rituals.",
      detail: "Set aside a weekly 'Sacred Date Night' without work or screens to keep the electric spark glowing.",
    },
    {
      tag: "🌹 Soulmate Habit",
      text: "Turn your high compatibility into grand shared dreams: start a couple bucket list!",
      detail: "Write down 3 adventures you want to conquer together before the year ends.",
    },
    {
      tag: "✨ Deep Connection",
      text: "Celebrate your connection with a surprise candlelit evening and your favorite dessert.",
      detail: "Your emotional alignment is rare and beautiful—honor it often with words of devotion.",
    },
  ],
  medium: [ // score 40 - 70
    {
      tag: "🌷 Growing Together Advice",
      text: "Good connection! Spend more quality time exploring each other's unspoken thoughts.",
      detail: "Pick one question from this quiz where your answers differed and talk through it with gentle curiosity.",
    },
    {
      tag: "☕ Couple Rhythm",
      text: "Cook a delicious meal or bake something together this weekend with zero rush.",
      detail: "Working collaboratively in the kitchen builds natural teamwork and sweet casual affection.",
    },
    {
      tag: "🫂 Heart-to-Heart",
      text: "Ask each other: 'What is one sweet thing I can do this week to make you feel deeply supported?'",
      detail: "Direct, loving curiosity is the fastest bridge to deeper emotional intimacy.",
    },
  ],
  low: [ // score < 40
    {
      tag: "😂 Playful Advice",
      text: "Get Lost! 😂 Maybe you both need more quality time and fewer everyday distractions!",
      detail: "Different perspectives make life exciting! Put your phones away and do a fun, impulsive activity together.",
    },
    {
      tag: "🍕 Sweet Reconciliation",
      text: "Order your favorite late-night takeout, watch a comedy, and laugh at your differences!",
      detail: "True love isn't about matching on everything—it's about laughing through the chaos side-by-side.",
    },
    {
      tag: "🔥 Spark Reigniter",
      text: "Go on an adventurous 'first date reboot'—act like you just met at a cozy café!",
      detail: "Re-asking early questions and flirting with fresh eyes breathes immediate magic into any bond.",
    },
  ],
};

export default function RelationshipSuggestionBox({
  score = null,
  name1 = "Partner 1",
  name2 = "Partner 2",
  compact = false,
  showRefresh = true,
  className = "",
  style = {},
}) {
  const isScored = score !== null && score !== undefined && !isNaN(score);

  // Determine which suggestions array to use
  let pool = GENERAL_PRE_QUIZ_SUGGESTIONS;
  let statusBadge = "💡 Relationship Advice";

  if (isScored) {
    if (score > 70) {
      pool = SCORE_BASED_SUGGESTIONS.high;
      statusBadge = "💍 Soulmate Suggestion";
    } else if (score >= 40) {
      pool = SCORE_BASED_SUGGESTIONS.medium;
      statusBadge = "🌷 Sweet Growth Suggestion";
    } else {
      pool = SCORE_BASED_SUGGESTIONS.low;
      statusBadge = "😂 Playful Couple Advice";
    }
  } else {
    statusBadge = "✨ Pre-Quiz Love Tip";
  }

  const [index, setIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Keep index within bounds if pool changes
  useEffect(() => {
    setIndex(0);
  }, [isScored, score]);

  const currentSuggestion = pool[index % pool.length];

  const handleNextSuggestion = () => {
    try {
      playOptionClick();
    } catch (e) {}
    setIsAnimating(true);
    setTimeout(() => {
      setIndex((prev) => (prev + 1) % pool.length);
      setIsAnimating(false);
    }, 180);
  };

  const handleCopy = async () => {
    try {
      playOptionClick();
      const textToCopy = `💡 Couple Advice for ${name1} & ${name2}:\n"${currentSuggestion.text}"\n${currentSuggestion.detail}`;
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (e) {}
  };

  return (
    <div
      className={`relationship-suggestion-box ${className}`}
      style={{
        background: "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 240, 246, 0.92) 100%)",
        border: "1.5px solid rgba(255, 46, 116, 0.28)",
        borderRadius: compact ? "18px" : "24px",
        padding: compact ? "16px 20px" : "24px 28px",
        boxShadow: "0 12px 32px rgba(255, 8, 68, 0.08), 0 2px 10px rgba(142, 5, 194, 0.05)",
        position: "relative",
        overflow: "hidden",
        transition: "all 0.3s ease",
        ...style,
      }}
    >
      {/* Decorative background glow */}
      <div
        style={{
          position: "absolute",
          top: "-30px",
          right: "-30px",
          width: "120px",
          height: "120px",
          background: "radial-gradient(circle, rgba(255, 8, 68, 0.12) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />

      {/* Header bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "12px",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 12px",
              borderRadius: "999px",
              background: isScored
                ? score > 70
                  ? "linear-gradient(135deg, #FF0844 0%, #FF2E74 100%)"
                  : score >= 40
                  ? "linear-gradient(135deg, #FF6584 0%, #E60039 100%)"
                  : "linear-gradient(135deg, #FF8A00 0%, #FF0844 100%)"
                : "linear-gradient(135deg, #FF2E74 0%, #8E05C2 100%)",
              color: "#ffffff",
              fontSize: "0.78rem",
              fontWeight: 700,
              letterSpacing: "0.4px",
              boxShadow: "0 4px 12px rgba(255, 46, 116, 0.3)",
            }}
          >
            <Lightbulb size={13} />
            {currentSuggestion.tag || statusBadge}
          </span>

          {!isScored && (
            <span
              style={{
                fontSize: "0.76rem",
                color: "#9C4164",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <Sparkles size={12} color="#FF0844" />
              Visible Before Quiz
            </span>
          )}
        </div>

        {/* Action icons */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {showRefresh && pool.length > 1 && (
            <button
              onClick={handleNextSuggestion}
              title="See another advice"
              aria-label="Refresh suggestion"
              style={{
                background: "rgba(255, 255, 255, 0.85)",
                border: "1px solid rgba(255, 46, 116, 0.25)",
                borderRadius: "999px",
                padding: "5px 12px",
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                cursor: "pointer",
                fontSize: "0.76rem",
                color: "#7E3E5B",
                fontWeight: 600,
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#FFF0F5";
                e.currentTarget.style.borderColor = "#FF0844";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.85)";
                e.currentTarget.style.borderColor = "rgba(255, 46, 116, 0.25)";
              }}
            >
              <RefreshCw
                size={12}
                style={{
                  transform: isAnimating ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.3s ease",
                }}
              />
              New Advice
            </button>
          )}

          <button
            onClick={handleCopy}
            title="Copy suggestion"
            aria-label="Copy advice"
            style={{
              background: "rgba(255, 255, 255, 0.85)",
              border: "1px solid rgba(255, 46, 116, 0.25)",
              borderRadius: "999px",
              padding: "5px 10px",
              display: "inline-flex",
              alignItems: "center",
              cursor: "pointer",
              color: "#7E3E5B",
              fontSize: "0.76rem",
              transition: "all 0.2s ease",
            }}
          >
            {copied ? <Check size={13} color="#10B981" /> : <Copy size={13} />}
          </button>
        </div>
      </div>

      {/* Suggestion Text Content */}
      <div
        style={{
          opacity: isAnimating ? 0.3 : 1,
          transform: isAnimating ? "translateY(4px)" : "translateY(0)",
          transition: "opacity 0.2s ease, transform 0.2s ease",
        }}
      >
        <p
          style={{
            margin: "0 0 6px 0",
            fontSize: compact ? "0.96rem" : "1.08rem",
            fontWeight: 700,
            color: "#421028",
            lineHeight: 1.45,
            fontFamily: "var(--font-body, inherit)",
          }}
        >
          &ldquo;{currentSuggestion.text}&rdquo;
        </p>

        {currentSuggestion.detail && (
          <p
            style={{
              margin: 0,
              fontSize: compact ? "0.82rem" : "0.88rem",
              color: "#7E3E5B",
              lineHeight: 1.5,
            }}
          >
            {currentSuggestion.detail}
          </p>
        )}
      </div>

      {/* Active suggestion index indicator */}
      {pool.length > 1 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            marginTop: "12px",
            justifyContent: "flex-end",
          }}
        >
          {pool.map((_, i) => (
            <span
              key={i}
              onClick={() => {
                try {
                  playOptionClick();
                } catch (e) {}
                setIndex(i);
              }}
              style={{
                width: i === index % pool.length ? "18px" : "6px",
                height: "6px",
                borderRadius: "999px",
                background:
                  i === index % pool.length ? "#FF0844" : "rgba(255, 46, 116, 0.25)",
                cursor: "pointer",
                transition: "all 0.25s ease",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
