"use client";

import { useState, useEffect } from "react";
import {
  Heart,
  Sparkles,
  Lightbulb,
  RefreshCw,
  Copy,
  Check,
  Share2,
  Send,
  Feather,
  PlusCircle,
  Trash2,
  CheckCircle2,
  MessageSquare,
  ArrowRight,
  Smile,
  Flame,
  Calendar,
} from "lucide-react";
import {
  getCoupleProfile,
  getCoupleSuggestions,
  saveCoupleSuggestion,
  deleteCoupleSuggestion,
  toggleCoupleSuggestionStatus,
} from "../lib/profileStorage";
import { SUGGESTION_TAGS, SUGGESTION_PROMPTS } from "../lib/gameEngine";
import { playOptionClick, playCelebration } from "../lib/audio";

// Curated advice pool categorized for couples without requiring any quiz
export const EXPLORE_ADVICE_CATEGORIES = {
  all: "🌟 All Love Tips",
  romance: "🌹 Romantic Gestures",
  habits: "☕ Sweet Daily Habits",
  dates: "✨ Dream Date Ideas",
  comfort: "🫂 Comfort & Care",
  devotion: "💌 Deep Appreciation",
  conversations: "💬 Heart-to-Heart",
};

export const STANDALONE_ADVICE_POOL = [
  {
    category: "romance",
    tag: "🌹 Romantic Gestures",
    text: "Leave an unexpected handwritten love note in your partner's coat pocket or bag.",
    detail: "A tangible, quiet message discovered during a busy workday reminds them they are treasured above everything else.",
  },
  {
    category: "habits",
    tag: "☕ Sweet Daily Habits",
    text: "Practice a 30-second silent embrace every morning or when you reunite after work.",
    detail: "Holding each other tightly without words or phones lowers cortisol levels and re-synchronizes your breathing.",
  },
  {
    category: "dates",
    tag: "✨ Dream Date Ideas",
    text: "Host a 'Living Room Stargazing' night with fairy lights, cozy blankets, and your first-date playlist.",
    detail: "Turn off all overhead lighting, put phones on airplane mode, and just talk softly about your happiest memories.",
  },
  {
    category: "comfort",
    tag: "🫂 Comfort & Care",
    text: "When your partner has had a rough day, ask: 'Do you want advice, a listening ear, or just a long hug?'",
    detail: "Giving them emotional space to express their exact need prevents misunderstandings and deepens trust.",
  },
  {
    category: "devotion",
    tag: "💌 Deep Appreciation",
    text: "Compliment a specific small quirk or habit you love about them, not just their appearance.",
    detail: "Noticing how they make their tea or how their eyes crinkle when laughing makes them feel truly seen and cherished.",
  },
  {
    category: "conversations",
    tag: "💬 Heart-to-Heart",
    text: "Ask each other tonight: 'What is one sweet thing I did this month that made you feel deeply loved?'",
    detail: "Sharing positive emotional reinforcement helps both partners know which gestures mean the most.",
  },
  {
    category: "romance",
    tag: "🌹 Romantic Gestures",
    text: "Steal an impromptu slow dance in the kitchen while dinner is simmering on the stove.",
    detail: "Spontaneous physical affection in ordinary everyday moments is the secret fuel of lifelong passion.",
  },
  {
    category: "dates",
    tag: "✨ Dream Date Ideas",
    text: "Do a 'Budget Supermarket Mystery Challenge'—buy $10 of surprise snacks for each other.",
    detail: "Laugh at what treats you picked and rate how well you guessed each other's secret guilty-pleasure cravings.",
  },
  {
    category: "comfort",
    tag: "🫂 Comfort & Care",
    text: "Give each other an unconditional 10-minute foot or shoulder massage with zero expectation in return.",
    detail: "Selfless physical touch releases oxytocin and melts away daily fatigue in seconds.",
  },
  {
    category: "habits",
    tag: "☕ Sweet Daily Habits",
    text: "Never go to bed without whispering three sweet words and touching foreheads.",
    detail: "Ending the day connected dissolves petty grievances and cements emotional security before sleep.",
  },
];

export default function StandaloneSuggestionBox({
  initialTab = "browse", // 'browse' | 'write' | 'jar'
  title = "Couple Suggestion & Love Box",
  subtitle = "Share suggestions, secret wishes & romantic advice anytime — no quiz required! ❤️",
  compact = false,
  className = "",
  style = {},
}) {
  const [activeTab, setActiveTab] = useState(initialTab); // 'browse', 'write', 'jar'
  const [profile, setProfile] = useState({
    name1: "Partner 1",
    name2: "Partner 2",
    avatar1: "🐱",
    avatar2: "🐰",
  });

  // Suggestion jar items
  const [savedSuggestions, setSavedSuggestions] = useState([]);

  // Active advice browsing state
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [adviceIndex, setAdviceIndex] = useState(0);
  const [isAdviceFlipping, setIsAdviceFlipping] = useState(false);
  const [copiedAdvice, setCopiedAdvice] = useState(false);

  // Write suggestion form state
  const [authorChoice, setAuthorChoice] = useState("player1"); // 'player1' or 'player2'
  const [selectedTag, setSelectedTag] = useState("wish");
  const [suggestionText, setSuggestionText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [copiedShareLink, setCopiedShareLink] = useState(false);

  // Filter for jar
  const [jarFilter, setJarFilter] = useState("all");

  useEffect(() => {
    const prof = getCoupleProfile();
    setProfile(prof);
    setSavedSuggestions(getCoupleSuggestions());
  }, []);

  // Filtered advice pool
  const filteredAdvice =
    selectedCategory === "all"
      ? STANDALONE_ADVICE_POOL
      : STANDALONE_ADVICE_POOL.filter((a) => a.category === selectedCategory);

  const currentAdvice =
    filteredAdvice[adviceIndex % filteredAdvice.length] || STANDALONE_ADVICE_POOL[0];

  const handleNextAdvice = () => {
    playOptionClick();
    setIsAdviceFlipping(true);
    setTimeout(() => {
      setAdviceIndex((prev) => (prev + 1) % filteredAdvice.length);
      setIsAdviceFlipping(false);
    }, 180);
  };

  const handleCopyAdvice = async () => {
    playOptionClick();
    const textToCopy = `💡 Couple Love Advice for ${profile.name1} & ${profile.name2}:\n\n"${currentAdvice.text}"\n${currentAdvice.detail}\n\nShared with love from Forever Us ❤️`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedAdvice(true);
      setTimeout(() => setCopiedAdvice(false), 2200);
    } catch (e) {
      alert("Advice copied to clipboard!");
    }
  };

  const handleShareWhatsApp = (text, detail) => {
    playOptionClick();
    const msg = encodeURIComponent(
      `Hey my love 💕 Here's a sweet couple advice for us:\n\n"${text}"\n${detail}\n\nForever Us ❤️`
    );
    window.open(`https://api.whatsapp.com/send?text=${msg}`, "_blank");
  };

  // Writing suggestion handlers
  const handleInsertPrompt = (promptText) => {
    playOptionClick();
    if (suggestionText.trim().length === 0) {
      setSuggestionText(promptText);
    } else {
      setSuggestionText((prev) => `${prev}\n\n${promptText}`);
    }
  };

  const handleInsertEmoji = (emoji) => {
    playOptionClick();
    setSuggestionText((prev) => `${prev} ${emoji}`);
  };

  const handleSaveSuggestion = (e) => {
    e.preventDefault();
    if (!suggestionText.trim()) return;

    playCelebration();
    setIsSubmitting(true);

    const isAuthorP1 = authorChoice === "player1";
    const authorName = isAuthorP1 ? profile.name1 || "Partner 1" : profile.name2 || "Partner 2";
    const authorAvatar = isAuthorP1 ? profile.avatar1 || "🐱" : profile.avatar2 || "🐰";
    const recipientName = isAuthorP1 ? profile.name2 || "Partner 2" : profile.name1 || "Partner 1";
    const recipientAvatar = isAuthorP1 ? profile.avatar2 || "🐰" : profile.avatar1 || "🐱";

    const newSug = saveCoupleSuggestion({
      authorName,
      recipientName,
      authorAvatar,
      recipientAvatar,
      tag: selectedTag,
      text: suggestionText.trim(),
    });

    setTimeout(() => {
      setIsSubmitting(false);
      setSavedSuggestions(getCoupleSuggestions());
      setSuggestionText("");
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
      setActiveTab("jar");
    }, 400);
  };

  const handleDeleteSuggestion = (id) => {
    playOptionClick();
    deleteCoupleSuggestion(id);
    setSavedSuggestions(getCoupleSuggestions());
  };

  const handleToggleCompleted = (id) => {
    playOptionClick();
    toggleCoupleSuggestionStatus(id);
    setSavedSuggestions(getCoupleSuggestions());
  };

  const filteredJar = savedSuggestions.filter((s) => {
    if (jarFilter === "done") return s.completed;
    if (jarFilter === "pending") return !s.completed;
    return true;
  });

  return (
    <div
      className={`standalone-suggestion-box glass-card ${className}`}
      style={{
        width: "100%",
        maxWidth: compact ? "640px" : "780px",
        margin: "0 auto",
        padding: compact ? "20px 18px" : "32px 28px",
        background:
          "linear-gradient(135deg, rgba(255, 255, 255, 0.96) 0%, rgba(255, 242, 247, 0.94) 50%, rgba(248, 235, 255, 0.92) 100%)",
        border: "2px solid rgba(255, 46, 116, 0.28)",
        borderRadius: "30px",
        boxShadow:
          "0 18px 48px rgba(255, 8, 68, 0.1), 0 8px 24px rgba(142, 5, 194, 0.06)",
        position: "relative",
        overflow: "hidden",
        boxSizing: "border-box",
        ...style,
      }}
    >
      {/* Decorative ambient background glows */}
      <div
        style={{
          position: "absolute",
          top: "-50px",
          right: "-50px",
          width: "180px",
          height: "180px",
          background: "radial-gradient(circle, rgba(255, 8, 68, 0.12) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-50px",
          left: "-50px",
          width: "180px",
          height: "180px",
          background: "radial-gradient(circle, rgba(142, 5, 194, 0.1) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />

      {/* Header Banner */}
      <div style={{ textAlign: "center", marginBottom: "22px" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "7px",
            background: "linear-gradient(135deg, rgba(255, 8, 68, 0.1) 0%, rgba(142, 5, 194, 0.1) 100%)",
            border: "1px solid rgba(255, 46, 116, 0.28)",
            padding: "5px 16px",
            borderRadius: "999px",
            fontSize: "0.82rem",
            fontWeight: 800,
            color: "var(--ruby-red)",
            letterSpacing: "0.5px",
            marginBottom: "8px",
          }}
        >
          <Sparkles size={14} color="#FF0844" />
          <span>STANDALONE COUPLE SUGGESTION BOX</span>
          <Feather size={14} color="#8E05C2" />
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
          {title}
        </h2>

        <p
          style={{
            margin: 0,
            fontSize: "0.92rem",
            color: "#7E3E5B",
            fontWeight: 500,
            maxWidth: "580px",
            marginInline: "auto",
          }}
        >
          {subtitle}
        </p>
      </div>

      {/* 3 Main Tabs: 💡 Daily Advice | ✍️ Write Suggestion | 📬 Our Suggestion Jar */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "8px",
          background: "rgba(255, 255, 255, 0.75)",
          padding: "6px",
          borderRadius: "9999px",
          border: "1.5px solid rgba(255, 46, 116, 0.22)",
          marginBottom: "24px",
          boxShadow: "0 4px 14px rgba(255, 8, 68, 0.06)",
        }}
      >
        <button
          type="button"
          onClick={() => {
            playOptionClick();
            setActiveTab("browse");
          }}
          style={{
            flex: 1,
            padding: "10px 14px",
            borderRadius: "9999px",
            border: "none",
            background:
              activeTab === "browse"
                ? "linear-gradient(135deg, #FF0844 0%, #FF2E74 100%)"
                : "transparent",
            color: activeTab === "browse" ? "#FFFFFF" : "var(--text-dark)",
            fontWeight: 700,
            fontSize: "0.86rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            transition: "all 0.25s ease",
            boxShadow:
              activeTab === "browse" ? "0 4px 14px rgba(255, 8, 68, 0.35)" : "none",
          }}
        >
          <Lightbulb size={16} />
          <span>💡 Love Advice</span>
        </button>

        <button
          type="button"
          onClick={() => {
            playOptionClick();
            setActiveTab("write");
          }}
          style={{
            flex: 1,
            padding: "10px 14px",
            borderRadius: "9999px",
            border: "none",
            background:
              activeTab === "write"
                ? "linear-gradient(135deg, #FF0844 0%, #FF2E74 100%)"
                : "transparent",
            color: activeTab === "write" ? "#FFFFFF" : "var(--text-dark)",
            fontWeight: 700,
            fontSize: "0.86rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            transition: "all 0.25s ease",
            boxShadow:
              activeTab === "write" ? "0 4px 14px rgba(255, 8, 68, 0.35)" : "none",
          }}
        >
          <Feather size={16} />
          <span>✍️ Drop Suggestion</span>
        </button>

        <button
          type="button"
          onClick={() => {
            playOptionClick();
            setActiveTab("jar");
          }}
          style={{
            flex: 1,
            padding: "10px 14px",
            borderRadius: "9999px",
            border: "none",
            background:
              activeTab === "jar"
                ? "linear-gradient(135deg, #FF0844 0%, #FF2E74 100%)"
                : "transparent",
            color: activeTab === "jar" ? "#FFFFFF" : "var(--text-dark)",
            fontWeight: 700,
            fontSize: "0.86rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            transition: "all 0.25s ease",
            boxShadow:
              activeTab === "jar" ? "0 4px 14px rgba(255, 8, 68, 0.35)" : "none",
          }}
        >
          <MessageSquare size={16} />
          <span>📬 Our Jar ({savedSuggestions.length})</span>
        </button>
      </div>

      {/* ---------------- TAB 1: 💡 LOVE ADVICE & RELATIONSHIP TIPS ---------------- */}
      {activeTab === "browse" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Category Filter Chips */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              overflowX: "auto",
              paddingBottom: "4px",
              scrollbarWidth: "none",
            }}
          >
            {Object.entries(EXPLORE_ADVICE_CATEGORIES).map(([catKey, catLabel]) => {
              const isSelected = selectedCategory === catKey;
              return (
                <button
                  key={catKey}
                  type="button"
                  onClick={() => {
                    playOptionClick();
                    setSelectedCategory(catKey);
                    setAdviceIndex(0);
                  }}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "9999px",
                    border: isSelected ? "1.5px solid var(--ruby-red)" : "1px solid rgba(255, 46, 116, 0.2)",
                    background: isSelected
                      ? "linear-gradient(135deg, rgba(255, 8, 68, 0.14) 0%, rgba(142, 5, 194, 0.14) 100%)"
                      : "rgba(255, 255, 255, 0.75)",
                    color: isSelected ? "var(--ruby-red)" : "var(--text-muted)",
                    fontWeight: isSelected ? 800 : 600,
                    fontSize: "0.8rem",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    transition: "all 0.2s ease",
                  }}
                >
                  {catLabel}
                </button>
              );
            })}
          </div>

          {/* Active Advice Display Box */}
          <div
            className="glass-card"
            style={{
              padding: "24px 22px",
              borderRadius: "22px",
              background: "rgba(255, 255, 255, 0.92)",
              border: "1.5px solid rgba(255, 46, 116, 0.3)",
              boxShadow: "0 10px 28px rgba(255, 8, 68, 0.08)",
              transition: "transform 0.25s ease, opacity 0.25s ease",
              transform: isAdviceFlipping ? "scale(0.97)" : "scale(1)",
              opacity: isAdviceFlipping ? 0.6 : 1,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "14px",
                flexWrap: "wrap",
                gap: "8px",
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "linear-gradient(135deg, #FF0844 0%, #FF2E74 100%)",
                  color: "#FFFFFF",
                  fontSize: "0.78rem",
                  fontWeight: 800,
                  padding: "4px 14px",
                  borderRadius: "9999px",
                  boxShadow: "0 4px 12px rgba(255, 8, 68, 0.3)",
                }}
              >
                <Sparkles size={12} />
                <span>{currentAdvice.tag}</span>
              </span>

              <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                Tip {((adviceIndex % filteredAdvice.length) + 1)} of {filteredAdvice.length}
              </span>
            </div>

            <h3
              style={{
                fontSize: "1.22rem",
                fontWeight: 800,
                color: "#421028",
                lineHeight: 1.4,
                margin: "0 0 10px 0",
              }}
            >
              &ldquo;{currentAdvice.text}&rdquo;
            </h3>

            <p
              style={{
                fontSize: "0.93rem",
                color: "#7E3E5B",
                lineHeight: 1.55,
                margin: 0,
              }}
            >
              {currentAdvice.detail}
            </p>

            {/* Quick Actions for this advice */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: "20px",
                paddingTop: "14px",
                borderTop: "1px dashed rgba(255, 46, 116, 0.25)",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              <button
                type="button"
                onClick={handleNextAdvice}
                className="heart-btn heart-btn-secondary"
                style={{
                  padding: "8px 18px",
                  fontSize: "0.85rem",
                  borderRadius: "9999px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <RefreshCw size={14} />
                <span>Next Advice</span>
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <button
                  type="button"
                  onClick={handleCopyAdvice}
                  title="Copy advice to clipboard"
                  style={{
                    background: "rgba(255, 255, 255, 0.9)",
                    border: "1px solid rgba(255, 46, 116, 0.3)",
                    color: "var(--ruby-red)",
                    borderRadius: "9999px",
                    padding: "8px 14px",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    transition: "all 0.2s ease",
                  }}
                >
                  {copiedAdvice ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
                  <span>{copiedAdvice ? "Copied!" : "Copy"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleShareWhatsApp(currentAdvice.text, currentAdvice.detail)}
                  title="Share advice with partner on WhatsApp"
                  style={{
                    background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
                    border: "none",
                    color: "#FFFFFF",
                    borderRadius: "9999px",
                    padding: "8px 16px",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    boxShadow: "0 4px 12px rgba(37, 211, 102, 0.3)",
                  }}
                >
                  <Share2 size={13} />
                  <span>Send to Partner</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- TAB 2: ✍️ WRITE & DROP SUGGESTION TO PARTNER ---------------- */}
      {activeTab === "write" && (
        <form onSubmit={handleSaveSuggestion} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* 1. Pick Who is Writing */}
          <div
            style={{
              background: "rgba(255, 255, 255, 0.8)",
              border: "1px solid rgba(255, 46, 116, 0.2)",
              borderRadius: "18px",
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <span style={{ fontSize: "0.86rem", fontWeight: 700, color: "var(--text-dark)" }}>
              ✍️ Who is writing this suggestion?
            </span>

            <div style={{ display: "flex", gap: "8px" }}>
              <button
                type="button"
                onClick={() => {
                  playOptionClick();
                  setAuthorChoice("player1");
                }}
                style={{
                  padding: "6px 14px",
                  borderRadius: "9999px",
                  border: authorChoice === "player1" ? "1.5px solid var(--ruby-red)" : "1px solid #E5E7EB",
                  background: authorChoice === "player1" ? "rgba(255, 8, 68, 0.12)" : "#FFFFFF",
                  color: authorChoice === "player1" ? "var(--ruby-red)" : "var(--text-muted)",
                  fontWeight: 700,
                  fontSize: "0.82rem",
                  cursor: "pointer",
                }}
              >
                {profile.avatar1} {profile.name1 || "Partner 1"}
              </button>

              <button
                type="button"
                onClick={() => {
                  playOptionClick();
                  setAuthorChoice("player2");
                }}
                style={{
                  padding: "6px 14px",
                  borderRadius: "9999px",
                  border: authorChoice === "player2" ? "1.5px solid var(--ruby-red)" : "1px solid #E5E7EB",
                  background: authorChoice === "player2" ? "rgba(255, 8, 68, 0.12)" : "#FFFFFF",
                  color: authorChoice === "player2" ? "var(--ruby-red)" : "var(--text-muted)",
                  fontWeight: 700,
                  fontSize: "0.82rem",
                  cursor: "pointer",
                }}
              >
                {profile.avatar2} {profile.name2 || "Partner 2"}
              </button>
            </div>
          </div>

          {/* 2. Pick Category Tag */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.84rem",
                fontWeight: 700,
                color: "var(--text-dark)",
                marginBottom: "8px",
              }}
            >
              🏷️ Choose Suggestion Theme:
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "8px" }}>
              {SUGGESTION_TAGS.map((tag) => {
                const isSelected = selectedTag === tag.id;
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => {
                      playOptionClick();
                      setSelectedTag(tag.id);
                    }}
                    style={{
                      padding: "8px 10px",
                      borderRadius: "14px",
                      border: isSelected ? "2px solid var(--ruby-red)" : "1px solid rgba(255, 46, 116, 0.2)",
                      background: isSelected
                        ? "linear-gradient(135deg, rgba(255, 8, 68, 0.12) 0%, rgba(142, 5, 194, 0.14) 100%)"
                        : "rgba(255, 255, 255, 0.8)",
                      color: isSelected ? "var(--ruby-red)" : "var(--text-dark)",
                      fontWeight: isSelected ? 800 : 600,
                      fontSize: "0.8rem",
                      cursor: "pointer",
                      textAlign: "center",
                      transition: "all 0.2s ease",
                      boxShadow: isSelected ? "0 4px 12px rgba(255, 8, 68, 0.15)" : "none",
                    }}
                  >
                    {tag.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Starter Inspiration Chips */}
          <div>
            <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>
              💡 Tap a romantic prompt to auto-insert:
            </span>
            <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "4px", scrollbarWidth: "none" }}>
              {SUGGESTION_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleInsertPrompt(prompt)}
                  style={{
                    background: "rgba(255, 255, 255, 0.85)",
                    border: "1px dashed rgba(255, 46, 116, 0.3)",
                    borderRadius: "9999px",
                    padding: "4px 12px",
                    fontSize: "0.76rem",
                    color: "var(--text-dark)",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  {prompt.slice(0, 32)}...
                </button>
              ))}
            </div>
          </div>

          {/* Textarea for writing suggestion */}
          <div style={{ position: "relative" }}>
            <textarea
              value={suggestionText}
              onChange={(e) => setSuggestionText(e.target.value)}
              placeholder={`Write your heartfelt suggestion or wish for ${authorChoice === "player1" ? profile.name2 || "your partner" : profile.name1 || "your partner"}... (e.g., "Let's do a quiet weekend trip without work emails" or "Hug me tighter when I'm stressed") 💌`}
              rows={4}
              maxLength={800}
              required
              style={{
                width: "100%",
                padding: "16px 18px",
                borderRadius: "18px",
                border: "1.5px solid rgba(255, 46, 116, 0.35)",
                background: "rgba(255, 255, 255, 0.95)",
                fontSize: "0.95rem",
                color: "#421028",
                lineHeight: 1.5,
                outline: "none",
                boxSizing: "border-box",
                fontFamily: "inherit",
                resize: "vertical",
                minHeight: "120px",
                boxShadow: "inset 0 2px 8px rgba(0,0,0,0.03)",
              }}
            />

            {/* Character count */}
            <div
              style={{
                position: "absolute",
                bottom: "10px",
                right: "14px",
                fontSize: "0.74rem",
                color: "var(--text-muted)",
              }}
            >
              {suggestionText.length}/800
            </div>
          </div>

          {/* Emoji Stickers Bar */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)" }}>
              Add cute stickers:
            </span>
            {["💌", "🌹", "💍", "🍫", "🥂", "✨", "🧸", "🥰", "☕", "🕊️"].map((emoji, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleInsertEmoji(emoji)}
                style={{
                  background: "rgba(255, 255, 255, 0.9)",
                  border: "1px solid rgba(255, 46, 116, 0.2)",
                  borderRadius: "8px",
                  padding: "4px 8px",
                  fontSize: "1rem",
                  cursor: "pointer",
                  transition: "transform 0.15s ease",
                }}
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!suggestionText.trim() || isSubmitting}
            className={`heart-btn ${suggestionText.trim() ? "pulse-heart" : ""}`}
            style={{
              padding: "14px 28px",
              fontSize: "1rem",
              borderRadius: "9999px",
              width: "100%",
              opacity: suggestionText.trim() ? 1 : 0.6,
              cursor: suggestionText.trim() ? "pointer" : "not-allowed",
              marginTop: "4px",
            }}
          >
            <Send size={18} />
            <span>{isSubmitting ? "Wax-Sealing..." : "💌 Wax-Seal & Drop Into Our Couple Jar"}</span>
          </button>
        </form>
      )}

      {/* ---------------- TAB 3: 📬 OUR SHARED SUGGESTION JAR ---------------- */}
      {activeTab === "jar" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Success toast if just submitted */}
          {showSuccessToast && (
            <div
              style={{
                background: "linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.15) 100%)",
                border: "1.5px solid #10B981",
                borderRadius: "16px",
                padding: "12px 18px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                color: "#065F46",
                fontWeight: 700,
                fontSize: "0.88rem",
              }}
            >
              <CheckCircle2 size={18} color="#10B981" />
              <span>Your sweet suggestion was wax-sealed into your couple jar! 💌</span>
            </div>
          )}

          {/* Jar Filters & Status */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "8px",
            }}
          >
            <div style={{ display: "flex", gap: "6px" }}>
              <button
                type="button"
                onClick={() => setJarFilter("all")}
                style={{
                  padding: "5px 12px",
                  borderRadius: "9999px",
                  border: jarFilter === "all" ? "1.5px solid var(--ruby-red)" : "1px solid #E5E7EB",
                  background: jarFilter === "all" ? "rgba(255, 8, 68, 0.12)" : "rgba(255, 255, 255, 0.8)",
                  color: jarFilter === "all" ? "var(--ruby-red)" : "var(--text-muted)",
                  fontWeight: 700,
                  fontSize: "0.78rem",
                  cursor: "pointer",
                }}
              >
                All ({savedSuggestions.length})
              </button>
              <button
                type="button"
                onClick={() => setJarFilter("pending")}
                style={{
                  padding: "5px 12px",
                  borderRadius: "9999px",
                  border: jarFilter === "pending" ? "1.5px solid var(--ruby-red)" : "1px solid #E5E7EB",
                  background: jarFilter === "pending" ? "rgba(255, 8, 68, 0.12)" : "rgba(255, 255, 255, 0.8)",
                  color: jarFilter === "pending" ? "var(--ruby-red)" : "var(--text-muted)",
                  fontWeight: 700,
                  fontSize: "0.78rem",
                  cursor: "pointer",
                }}
              >
                Active Wishes ({savedSuggestions.filter((s) => !s.completed).length})
              </button>
              <button
                type="button"
                onClick={() => setJarFilter("done")}
                style={{
                  padding: "5px 12px",
                  borderRadius: "9999px",
                  border: jarFilter === "done" ? "1.5px solid #10B981" : "1px solid #E5E7EB",
                  background: jarFilter === "done" ? "rgba(16, 185, 129, 0.12)" : "rgba(255, 255, 255, 0.8)",
                  color: jarFilter === "done" ? "#065F46" : "var(--text-muted)",
                  fontWeight: 700,
                  fontSize: "0.78rem",
                  cursor: "pointer",
                }}
              >
                Cherished ❤️ ({savedSuggestions.filter((s) => s.completed).length})
              </button>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab("write")}
              style={{
                background: "linear-gradient(135deg, rgba(255, 8, 68, 0.1) 0%, rgba(142, 5, 194, 0.1) 100%)",
                border: "1px dashed var(--ruby-red)",
                color: "var(--ruby-red)",
                borderRadius: "9999px",
                padding: "5px 14px",
                fontWeight: 800,
                fontSize: "0.78rem",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <PlusCircle size={13} />
              <span>Add New Suggestion</span>
            </button>
          </div>

          {/* List of Saved Suggestions */}
          {filteredJar.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "36px 20px",
                background: "rgba(255, 255, 255, 0.6)",
                borderRadius: "20px",
                border: "1px dashed rgba(255, 46, 116, 0.3)",
              }}
            >
              <span style={{ fontSize: "2.2rem" }}>💌</span>
              <h4 style={{ margin: "8px 0 4px 0", color: "#421028" }}>No suggestions in this view</h4>
              <p style={{ margin: 0, fontSize: "0.86rem", color: "var(--text-muted)" }}>
                Click &ldquo;Add New Suggestion&rdquo; to drop your very first romantic note or secret wish!
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {filteredJar.map((item) => {
                const tagObj =
                  SUGGESTION_TAGS.find((t) => t.id === item.tag) || {
                    label: "🌹 Romantic Suggestion",
                    emoji: "🌹",
                  };

                return (
                  <div
                    key={item.id}
                    className="glass-card"
                    style={{
                      padding: "18px 20px",
                      borderRadius: "18px",
                      background: item.completed
                        ? "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 253, 244, 0.95) 100%)"
                        : "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 245, 248, 0.95) 100%)",
                      border: item.completed
                        ? "1.5px solid rgba(16, 185, 129, 0.35)"
                        : "1.5px solid rgba(255, 46, 116, 0.28)",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    {/* Item Header */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: "8px",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span
                          style={{
                            background: "rgba(255, 8, 68, 0.12)",
                            color: "var(--ruby-red)",
                            padding: "3px 10px",
                            borderRadius: "9999px",
                            fontSize: "0.75rem",
                            fontWeight: 800,
                          }}
                        >
                          {tagObj.emoji} {tagObj.label}
                        </span>

                        <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                          From: <strong>{item.authorAvatar} {item.authorName}</strong> ➔ <strong>{item.recipientAvatar} {item.recipientName}</strong>
                        </span>
                      </div>

                      <span style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>
                        {item.date || "Recent"}
                      </span>
                    </div>

                    {/* Message Body */}
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.96rem",
                        color: "#421028",
                        lineHeight: 1.5,
                        textDecoration: item.completed ? "line-through" : "none",
                        opacity: item.completed ? 0.75 : 1,
                      }}
                    >
                      {item.text}
                    </p>

                    {/* Item Actions */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginTop: "4px",
                        paddingTop: "10px",
                        borderTop: "1px dashed rgba(255, 46, 116, 0.2)",
                        flexWrap: "wrap",
                        gap: "8px",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => handleToggleCompleted(item.id)}
                        style={{
                          background: item.completed ? "rgba(16, 185, 129, 0.15)" : "transparent",
                          border: item.completed ? "1px solid #10B981" : "1px solid rgba(255, 46, 116, 0.3)",
                          color: item.completed ? "#065F46" : "var(--ruby-red)",
                          borderRadius: "9999px",
                          padding: "4px 12px",
                          fontSize: "0.76rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        <Heart size={13} fill={item.completed ? "#10B981" : "none"} />
                        <span>{item.completed ? "Cherished ❤️" : "Mark Cherished"}</span>
                      </button>

                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <button
                          type="button"
                          onClick={() => handleShareWhatsApp(item.text, `Written by ${item.authorName} for ${item.recipientName}`)}
                          title="Share this note on WhatsApp"
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "#128C7E",
                            cursor: "pointer",
                            padding: "4px 8px",
                            fontSize: "0.76rem",
                            fontWeight: 700,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <Share2 size={13} />
                          <span>WhatsApp</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteSuggestion(item.id)}
                          title="Remove from jar"
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "var(--text-subtle)",
                            cursor: "pointer",
                            padding: "4px",
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
