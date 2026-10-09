"use client";

import { useState } from "react";
import { Heart, Send, Sparkles, Lightbulb, Check, Feather } from "lucide-react";
import { SUGGESTION_TAGS, SUGGESTION_PROMPTS } from "../lib/gameEngine";
import { playOptionClick, playCelebration } from "../lib/audio";

export default function PartnerPassageBox({
  authorName = "Partner 1",
  recipientName = "Partner 2",
  authorAvatar = "🐱",
  recipientAvatar = "🐰",
  onSubmitPassage,
  initialPassage = "",
  initialTag = "wish",
  isLastStep = false,
}) {
  const [passageText, setPassageText] = useState(initialPassage);
  const [selectedTag, setSelectedTag] = useState(initialTag);
  const [showInspirations, setShowInspirations] = useState(false);
  const [isSealed, setIsSealed] = useState(false);

  const EMOJI_STICKERS = ["💌", "🌹", "💍", "🍫", "🥂", "🧸", "✨", "💖", "🥰", "🕊️"];

  const handleSelectTag = (tagId) => {
    playOptionClick();
    setSelectedTag(tagId);
  };

  const handleInsertPrompt = (promptText) => {
    playOptionClick();
    if (passageText.trim().length === 0) {
      setPassageText(promptText);
    } else {
      setPassageText((prev) => `${prev}\n\n${promptText}`);
    }
  };

  const handleInsertEmoji = (emoji) => {
    playOptionClick();
    setPassageText((prev) => `${prev} ${emoji}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!passageText.trim()) return;

    playCelebration();
    setIsSealed(true);

    setTimeout(() => {
      onSubmitPassage({
        text: passageText.trim(),
        tag: selectedTag,
        date: new Date().toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      });
    }, 600);
  };

  const charCount = passageText.length;
  const maxChars = 800;

  return (
    <div
      className="glass-card glass-card-glow"
      style={{
        width: "100%",
        maxWidth: "720px",
        margin: "0 auto",
        padding: "36px 30px",
        boxSizing: "border-box",
        animation: "cardFloatIn 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
        position: "relative",
      }}
    >
      <style jsx>{`
        @keyframes cardFloatIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes waxPop {
          0% { transform: scale(0.8); opacity: 0; }
          60% { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(1); }
        }
      `}</style>

      {/* Header Banner */}
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "linear-gradient(135deg, rgba(255, 8, 68, 0.12) 0%, rgba(142, 5, 194, 0.16) 100%)",
            border: "1.5px solid var(--ruby-red)",
            padding: "6px 20px",
            borderRadius: "9999px",
            fontSize: "0.85rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "1px",
            color: "var(--ruby-red)",
            marginBottom: "12px",
          }}
        >
          <Feather size={15} />
          <span>Special Step: Partner Suggestions Passage</span>
          <Sparkles size={15} />
        </div>

        <h2
          style={{
            fontSize: "clamp(1.5rem, 4vw, 2.05rem)",
            color: "var(--ruby-red)",
            margin: "0 0 8px 0",
            fontFamily: "var(--font-heading)",
            lineHeight: 1.25,
          }}
        >
          A Secret Passage for {recipientName} {recipientAvatar}
        </h2>

        <p
          style={{
            fontSize: "0.95rem",
            color: "var(--text-muted)",
            maxWidth: "560px",
            margin: "0 auto",
            lineHeight: 1.5,
          }}
        >
          Write your heartfelt love message, sweet date ideas, or suggestions to make your bond even stronger.
          <strong style={{ color: "var(--royal-purple)" }}> It remains secretly sealed until your final results are revealed! 💌</strong>
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
        {/* Theme / Tag Selector Pills */}
        <div>
          <label
            style={{
              display: "block",
              fontSize: "0.86rem",
              fontWeight: 700,
              color: "var(--text-dark)",
              marginBottom: "8px",
            }}
          >
            Choose a Theme for Your Suggestions:
          </label>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
            }}
          >
            {SUGGESTION_TAGS.map((tag) => {
              const isSelected = selectedTag === tag.id;
              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => handleSelectTag(tag.id)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "9999px",
                    border: isSelected ? "2px solid var(--ruby-red)" : "1.5px solid var(--card-border-subtle)",
                    background: isSelected
                      ? "linear-gradient(135deg, rgba(255, 8, 68, 0.16) 0%, rgba(255, 133, 179, 0.22) 100%)"
                      : "rgba(255, 255, 255, 0.8)",
                    color: isSelected ? "var(--ruby-red)" : "var(--text-dark)",
                    fontWeight: isSelected ? 700 : 500,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    transition: "all 0.2s ease",
                  }}
                >
                  <span>{tag.emoji}</span>
                  <span>{tag.label}</span>
                  {isSelected && <Check size={14} strokeWidth={3} />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Inspiration Button Toggle */}
        <div>
          <button
            type="button"
            onClick={() => {
              playOptionClick();
              setShowInspirations(!showInspirations);
            }}
            style={{
              background: "none",
              border: "none",
              color: "var(--royal-purple)",
              fontSize: "0.86rem",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer",
              padding: "4px 0",
            }}
          >
            <Lightbulb size={16} />
            <span>{showInspirations ? "Hide Inspiration Starters ▲" : "Need Inspiration? Click for Sweet Starters ▼"}</span>
          </button>

          {showInspirations && (
            <div
              style={{
                marginTop: "8px",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                background: "rgba(255, 255, 255, 0.75)",
                padding: "12px",
                borderRadius: "16px",
                border: "1px dashed var(--main-pink)",
              }}
            >
              {SUGGESTION_PROMPTS.map((prompt, pIdx) => (
                <button
                  key={pIdx}
                  type="button"
                  onClick={() => handleInsertPrompt(prompt)}
                  style={{
                    background: "none",
                    border: "none",
                    textAlign: "left",
                    padding: "6px 10px",
                    fontSize: "0.83rem",
                    color: "var(--text-dark)",
                    cursor: "pointer",
                    borderRadius: "8px",
                    transition: "background 0.15s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255, 8, 68, 0.08)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                >
                  + {prompt}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Passage Textarea Box */}
        <div style={{ position: "relative" }}>
          <textarea
            value={passageText}
            onChange={(e) => {
              if (e.target.value.length <= maxChars) {
                setPassageText(e.target.value);
              }
            }}
            placeholder={`Dear ${recipientName} ❤️,\n\nI want to suggest that we...\nOne thing I cherish about you is...\nMy dream date with you would be...`}
            rows={7}
            style={{
              width: "100%",
              padding: "18px 20px",
              borderRadius: "20px",
              border: "2px solid rgba(255, 8, 68, 0.35)",
              background: "rgba(255, 255, 255, 0.95)",
              fontSize: "1rem",
              lineHeight: 1.6,
              color: "var(--text-dark)",
              fontFamily: "inherit",
              boxSizing: "border-box",
              resize: "vertical",
              outline: "none",
              boxShadow: "inset 0 2px 8px rgba(0, 0, 0, 0.04)",
              transition: "border-color 0.2s ease, box-shadow 0.2s ease",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "var(--ruby-red)";
              e.currentTarget.style.boxShadow = "0 0 16px rgba(255, 8, 68, 0.25)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "rgba(255, 8, 68, 0.35)";
              e.currentTarget.style.boxShadow = "none";
            }}
          />

          {/* Character counter */}
          <div
            style={{
              position: "absolute",
              bottom: "12px",
              right: "16px",
              fontSize: "0.78rem",
              color: charCount >= maxChars ? "var(--ruby-red)" : "var(--text-subtle)",
              fontWeight: 600,
              background: "rgba(255, 255, 255, 0.85)",
              padding: "2px 8px",
              borderRadius: "9999px",
            }}
          >
            {charCount}/{maxChars}
          </div>
        </div>

        {/* Emoji Sticker Toolbar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            flexWrap: "wrap",
            padding: "8px 12px",
            background: "rgba(255, 255, 255, 0.7)",
            borderRadius: "14px",
            border: "1px solid var(--card-border-subtle)",
          }}
        >
          <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)" }}>
            Add Stickers:
          </span>
          {EMOJI_STICKERS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => handleInsertEmoji(emoji)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "1.2rem",
                padding: "2px 4px",
                transition: "transform 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.3)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* Submit & Wax Seal Action Button */}
        <div style={{ textAlign: "center", marginTop: "10px" }}>
          <button
            type="submit"
            disabled={!passageText.trim() || isSealed}
            className={`heart-btn ${passageText.trim() ? "pulse-heart" : ""}`}
            style={{
              width: "100%",
              maxWidth: "420px",
              padding: "16px 28px",
              fontSize: "1.05rem",
              opacity: !passageText.trim() ? 0.5 : 1,
              cursor: !passageText.trim() ? "not-allowed" : "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            <Heart size={20} fill="#FFF" />
            <span>
              {isLastStep
                ? "Seal with Wax & Reveal Love Score ❤️"
                : `Seal with Wax & Pass to ${recipientName} 💌`}
            </span>
          </button>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "8px" }}>
            🔒 Sealed with love. Cannot be peeked until both of you complete your turns!
          </div>
        </div>
      </form>
    </div>
  );
}
