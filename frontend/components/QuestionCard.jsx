"use client";

import { useState } from "react";
import { Heart, Check, ArrowRight, ArrowLeft, Sparkles, UserCheck, RefreshCw, RotateCcw, Edit2 } from "lucide-react";
import { playSelectSound, playNextSound, playOptionClick } from "../lib/audio";

export default function QuestionCard({
  questionData,
  selectedOption,
  onSelectOption,
  onNext,
  onPrev,
  onSwapQuestion = null,
  onChangeAnswer = null,
  isFirstQuestion = false,
  isLastQuestion = false,
  name1 = "Partner 1",
  name2 = "Partner 2",
  avatar1 = "🐱",
  avatar2 = "🐰",
  activePlayer = 1, // 1 or 2
}) {
  const optionLetters = ["A", "B", "C", "D"];
  const [hoveredScale, setHoveredScale] = useState(null);
  const [isSwapping, setIsSwapping] = useState(false);

  // Pick prompt based on active player turn
  const rawPrompt =
    activePlayer === 1
      ? questionData.prompt_p1 || questionData.question
      : questionData.prompt_p2 || questionData.question;

  // Substitute {name1} and {name2}
  const formattedPrompt = rawPrompt
    .replace(/\{name1\}/g, name1)
    .replace(/\{name2\}/g, name2);

  const formattedDescription = (questionData.description || "")
    .replace(/\{name1\}/g, name1)
    .replace(/\{name2\}/g, name2);

  const handleOptionClick = (val) => {
    playSelectSound();
    onSelectOption(val);
  };

  const handleNextClick = () => {
    playNextSound();
    onNext();
  };

  const qType = questionData.type || "multiple_choice";

  return (
    <div
      className="glass-card glass-card-glow"
      style={{
        width: "100%",
        maxWidth: "700px",
        margin: "0 auto",
        padding: "36px 30px",
        boxSizing: "border-box",
        animation: "cardFloatIn 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
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
        @keyframes heartPulseScale {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.18); }
        }
      `}</style>

      {/* Header: Question Badge & Category */}
      <div style={{ marginBottom: "26px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "10px",
            marginBottom: "12px",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "linear-gradient(135deg, rgba(255, 8, 68, 0.12) 0%, rgba(142, 5, 194, 0.16) 100%)",
              border: "1.5px solid var(--ruby-red)",
              padding: "5px 16px",
              borderRadius: "9999px",
              fontSize: "0.85rem",
              fontWeight: 700,
              color: "var(--ruby-red)",
              flexWrap: "wrap",
            }}
          >
            <span>{questionData.categoryIcon}</span>
            <span>{questionData.category} • #{questionData.id}</span>
            {questionData.typeLabel && (
              <span
                style={{
                  marginLeft: "4px",
                  background: "rgba(255, 8, 68, 0.18)",
                  padding: "2px 10px",
                  borderRadius: "9999px",
                  fontSize: "0.76rem",
                  color: "var(--royal-purple)",
                  fontWeight: 800,
                }}
              >
                {questionData.typeLabel}
              </span>
            )}
          </div>

          {onSwapQuestion && (
            <button
              type="button"
              onClick={() => {
                setIsSwapping(true);
                try {
                  playOptionClick();
                } catch (e) {}
                setTimeout(() => {
                  onSwapQuestion();
                  setIsSwapping(false);
                }, 200);
              }}
              title="Don't like this question? Swap it for another romantic question from the bank!"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: "rgba(255, 255, 255, 0.95)",
                border: "1.5px dashed var(--ruby-red)",
                color: "var(--ruby-red)",
                padding: "6px 14px",
                borderRadius: "9999px",
                fontSize: "0.82rem",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow: "0 2px 8px rgba(255, 8, 68, 0.12)",
              }}
            >
              <RefreshCw
                size={13}
                style={{
                  transition: "transform 0.4s ease",
                  transform: isSwapping ? "rotate(180deg)" : "none",
                }}
              />
              <span>Change Question</span>
            </button>
          )}
        </div>

        <h2
          style={{
            fontSize: "clamp(1.4rem, 4vw, 1.85rem)",
            color: "var(--text-dark)",
            lineHeight: 1.3,
            marginBottom: "8px",
            textAlign: "center",
          }}
        >
          {formattedPrompt}
        </h2>

        {formattedDescription && (
          <p
            style={{
              fontSize: "0.95rem",
              color: "var(--text-muted)",
              maxWidth: "540px",
              margin: "0 auto",
              lineHeight: 1.45,
              textAlign: "center",
            }}
          >
            {formattedDescription}
          </p>
        )}
      </div>

      {/* ---------------- 1. "WHO IS MORE LIKELY TO?" DUAL CARDS ---------------- */}
      {qType === "who_is_more_likely" && (
        <div style={{ marginBottom: "32px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
              marginBottom: "14px",
            }}
          >
            {/* Person 1 Card */}
            <button
              type="button"
              onClick={() => handleOptionClick(1)}
              style={{
                background:
                  selectedOption === 1
                    ? "linear-gradient(135deg, rgba(255, 8, 68, 0.18) 0%, rgba(255, 133, 179, 0.3) 100%)"
                    : "rgba(255, 255, 255, 0.85)",
                border:
                  selectedOption === 1
                    ? "2.5px solid var(--ruby-red)"
                    : "1.5px solid var(--card-border-subtle)",
                borderRadius: "22px",
                padding: "24px 16px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
                cursor: "pointer",
                boxShadow:
                  selectedOption === 1
                    ? "0 10px 28px rgba(255, 8, 68, 0.35)"
                    : "0 4px 12px rgba(90, 42, 58, 0.05)",
                transform: selectedOption === 1 ? "scale(1.03)" : "scale(1)",
                transition: "all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
            >
              <div
                style={{
                  fontSize: "2.8rem",
                  lineHeight: 1,
                  filter: "drop-shadow(0 4px 8px rgba(255, 8, 68, 0.25))",
                }}
              >
                {avatar1}
              </div>
              <span
                style={{
                  fontSize: "1.15rem",
                  fontWeight: 700,
                  color: selectedOption === 1 ? "var(--ruby-red)" : "var(--text-dark)",
                }}
              >
                {name1}
              </span>
              <span
                style={{
                  fontSize: "0.8rem",
                  padding: "4px 12px",
                  borderRadius: "9999px",
                  background: selectedOption === 1 ? "var(--ruby-red)" : "rgba(255, 8, 68, 0.1)",
                  color: selectedOption === 1 ? "#FFF" : "var(--ruby-red)",
                  fontWeight: 600,
                }}
              >
                {selectedOption === 1 ? "✓ Selected" : "Tap to choose"}
              </span>
            </button>

            {/* Person 2 Card */}
            <button
              type="button"
              onClick={() => handleOptionClick(2)}
              style={{
                background:
                  selectedOption === 2
                    ? "linear-gradient(135deg, rgba(142, 5, 194, 0.18) 0%, rgba(235, 211, 248, 0.3) 100%)"
                    : "rgba(255, 255, 255, 0.85)",
                border:
                  selectedOption === 2
                    ? "2.5px solid var(--royal-purple)"
                    : "1.5px solid var(--card-border-subtle)",
                borderRadius: "22px",
                padding: "24px 16px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
                cursor: "pointer",
                boxShadow:
                  selectedOption === 2
                    ? "0 10px 28px rgba(142, 5, 194, 0.35)"
                    : "0 4px 12px rgba(90, 42, 58, 0.05)",
                transform: selectedOption === 2 ? "scale(1.03)" : "scale(1)",
                transition: "all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
            >
              <div
                style={{
                  fontSize: "2.8rem",
                  lineHeight: 1,
                  filter: "drop-shadow(0 4px 8px rgba(142, 5, 194, 0.25))",
                }}
              >
                {avatar2}
              </div>
              <span
                style={{
                  fontSize: "1.15rem",
                  fontWeight: 700,
                  color: selectedOption === 2 ? "var(--royal-purple)" : "var(--text-dark)",
                }}
              >
                {name2}
              </span>
              <span
                style={{
                  fontSize: "0.8rem",
                  padding: "4px 12px",
                  borderRadius: "9999px",
                  background: selectedOption === 2 ? "var(--royal-purple)" : "rgba(142, 5, 194, 0.1)",
                  color: selectedOption === 2 ? "#FFF" : "var(--royal-purple)",
                  fontWeight: 600,
                }}
              >
                {selectedOption === 2 ? "✓ Selected" : "Tap to choose"}
              </span>
            </button>
          </div>

          {/* Option 3: "Both of us equally! 💕" */}
          <button
            type="button"
            onClick={() => handleOptionClick(3)}
            style={{
              width: "100%",
              padding: "14px 20px",
              borderRadius: "18px",
              background:
                selectedOption === 3
                  ? "linear-gradient(135deg, rgba(255, 8, 68, 0.16) 0%, rgba(142, 5, 194, 0.22) 100%)"
                  : "rgba(255, 255, 255, 0.75)",
              border:
                selectedOption === 3
                  ? "2px solid var(--ruby-red)"
                  : "1.5px dashed var(--main-pink)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: "1rem",
              color: selectedOption === 3 ? "var(--ruby-red)" : "var(--text-dark)",
              transition: "all 0.2s ease",
            }}
          >
            <span>💕 Both of us equally!</span>
            {selectedOption === 3 && <Check size={18} />}
          </button>
        </div>
      )}

      {/* ---------------- 2. "LOVE SCALE" (1 TO 5 HEARTS RATING) ---------------- */}
      {qType === "love_scale" && (
        <div style={{ marginBottom: "32px", textAlign: "center" }}>
          {/* Hearts Bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "14px",
              padding: "20px 10px",
              background: "rgba(255, 255, 255, 0.8)",
              borderRadius: "24px",
              border: "1.5px solid var(--card-border-subtle)",
              marginBottom: "14px",
            }}
          >
            {[1, 2, 3, 4, 5].map((level) => {
              const activeLevel = hoveredScale !== null ? hoveredScale : selectedOption || 0;
              const isFilled = level <= activeLevel;
              const isSelected = selectedOption === level;

              return (
                <button
                  key={level}
                  type="button"
                  onClick={() => handleOptionClick(level)}
                  onMouseEnter={() => setHoveredScale(level)}
                  onMouseLeave={() => setHoveredScale(null)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "8px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "6px",
                    transform: isSelected ? "scale(1.28)" : isFilled ? "scale(1.15)" : "scale(1)",
                    transition: "transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  }}
                  title={`${level} Hearts`}
                >
                  <Heart
                    size={38}
                    fill={isFilled ? "var(--ruby-red)" : "none"}
                    color={isFilled ? "var(--ruby-red)" : "rgba(255, 133, 179, 0.6)"}
                    strokeWidth={isFilled ? 2.5 : 2}
                    style={{
                      filter: isFilled ? "drop-shadow(0 0 10px rgba(255, 8, 68, 0.65))" : "none",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      color: isFilled ? "var(--ruby-red)" : "var(--text-subtle)",
                    }}
                  >
                    {level}★
                  </span>
                </button>
              );
            })}
          </div>

          {/* Scale Selected Description */}
          {selectedOption && questionData.options && questionData.options[selectedOption - 1] && (
            <div
              style={{
                fontSize: "1rem",
                fontWeight: 600,
                color: "var(--ruby-red)",
                background: "rgba(255, 8, 68, 0.1)",
                padding: "8px 18px",
                borderRadius: "9999px",
                display: "inline-block",
              }}
            >
              ✨ {questionData.options[selectedOption - 1].text}
            </div>
          )}

          {/* Min & Max Labels */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "0.82rem",
              color: "var(--text-muted)",
              marginTop: "10px",
              padding: "0 10px",
            }}
          >
            <span>{questionData.scaleMinLabel || "1: Subtle"}</span>
            <span>{questionData.scaleMaxLabel || "5: Essential ❤️"}</span>
          </div>
        </div>
      )}

      {/* ---------------- 3. "THIS OR THAT" 2-CHOICE CARDS ---------------- */}
      {qType === "this_or_that" && questionData.options && (
        <div style={{ marginBottom: "32px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "18px",
            }}
          >
            {questionData.options.map((opt, idx) => {
              const isSelected = selectedOption === opt.value;
              const optText = opt.text
                .replace(/\{name1\}/g, name1)
                .replace(/\{name2\}/g, name2);

              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleOptionClick(opt.value)}
                  style={{
                    padding: "24px 20px",
                    background: isSelected
                      ? "linear-gradient(135deg, rgba(255, 8, 68, 0.18) 0%, rgba(142, 5, 194, 0.22) 100%)"
                      : "rgba(255, 255, 255, 0.88)",
                    border: isSelected
                      ? "2.5px solid var(--ruby-red)"
                      : "1.5px solid var(--card-border-subtle)",
                    borderRadius: "22px",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    gap: "12px",
                    minHeight: "120px",
                    boxShadow: isSelected
                      ? "0 10px 28px rgba(255, 8, 68, 0.35)"
                      : "0 4px 12px rgba(90, 42, 58, 0.05)",
                    transform: isSelected ? "scale(1.03)" : "scale(1)",
                    transition: "all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  }}
                >
                  <span
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: isSelected ? 700 : 500,
                      color: isSelected ? "var(--ruby-red)" : "var(--text-dark)",
                      lineHeight: 1.45,
                    }}
                  >
                    {optText}
                  </span>
                  <span
                    style={{
                      fontSize: "0.82rem",
                      padding: "4px 14px",
                      borderRadius: "9999px",
                      background: isSelected ? "var(--ruby-red)" : "rgba(255, 8, 68, 0.1)",
                      color: isSelected ? "#FFF" : "var(--ruby-red)",
                      fontWeight: 700,
                    }}
                  >
                    {isSelected ? "✓ Selected Choice" : `Option ${idx === 0 ? "A" : "B"}`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ---------------- 4. STANDARD & COMPLEMENTARY MULTIPLE CHOICE CARDS ---------------- */}
      {qType !== "who_is_more_likely" && qType !== "love_scale" && qType !== "this_or_that" && questionData.options && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            marginBottom: "32px",
          }}
          role="radiogroup"
          aria-label={formattedPrompt}
        >
          {questionData.options.map((opt, idx) => {
            const isSelected = selectedOption === opt.value;
            const letter = optionLetters[idx] || `${idx + 1}`;
            const optText = opt.text
              .replace(/\{name1\}/g, name1)
              .replace(/\{name2\}/g, name2);

            return (
              <button
                key={opt.value}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => handleOptionClick(opt.value)}
                style={{
                  width: "100%",
                  padding: "16px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  textAlign: "left",
                  background: isSelected
                    ? "linear-gradient(135deg, rgba(255, 8, 68, 0.16) 0%, rgba(142, 5, 194, 0.22) 100%)"
                    : "rgba(255, 255, 255, 0.82)",
                  border: isSelected
                    ? "2.5px solid var(--ruby-red)"
                    : "1.5px solid var(--card-border-subtle)",
                  borderRadius: "20px",
                  cursor: "pointer",
                  transition: "all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  transform: isSelected ? "scale(1.02) translateY(-2px)" : "scale(1)",
                  boxShadow: isSelected
                    ? "0 10px 28px rgba(255, 8, 68, 0.3)"
                    : "0 2px 8px rgba(90, 42, 58, 0.04)",
                  color: "var(--text-dark)",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.borderColor = "var(--main-pink)";
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.95)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.borderColor = "var(--card-border-subtle)";
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.82)";
                  }
                }}
              >
                {/* Bullet */}
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    minWidth: "40px",
                    borderRadius: "50%",
                    backgroundColor: isSelected ? "var(--ruby-red)" : "rgba(255, 133, 179, 0.35)",
                    color: isSelected ? "#FFFFFF" : "var(--ruby-red)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    transition: "all 0.2s ease",
                    boxShadow: isSelected ? "0 4px 12px rgba(255, 8, 68, 0.45)" : "none",
                  }}
                >
                  {isSelected ? <Check size={18} strokeWidth={3} /> : letter}
                </div>

                <span
                  style={{
                    flex: 1,
                    fontSize: "1.02rem",
                    fontWeight: isSelected ? 600 : 400,
                    lineHeight: 1.4,
                  }}
                >
                  {optText}
                </span>

                <Heart
                  size={18}
                  fill={isSelected ? "var(--ruby-red)" : "none"}
                  color={isSelected ? "var(--ruby-red)" : "rgba(255, 133, 179, 0.5)"}
                  style={{
                    opacity: isSelected ? 1 : 0.4,
                    transition: "all 0.2s ease",
                  }}
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Answer Selected Status / Change Answer Notification */}
      {selectedOption && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "linear-gradient(135deg, rgba(255, 8, 68, 0.08) 0%, rgba(142, 5, 194, 0.08) 100%)",
            border: "1px dashed var(--ruby-red)",
            borderRadius: "16px",
            padding: "10px 18px",
            marginTop: "16px",
            marginBottom: "20px",
            fontSize: "0.88rem",
            color: "var(--text-dark)",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "1.1rem" }}>✨</span>
            <span>
              <strong>Answer recorded!</strong> Tap any other choice above anytime to change it.
            </span>
          </div>

          {onChangeAnswer && (
            <button
              type="button"
              onClick={onChangeAnswer}
              style={{
                background: "rgba(255, 255, 255, 0.8)",
                border: "1px solid var(--ruby-red)",
                color: "var(--ruby-red)",
                borderRadius: "9999px",
                padding: "4px 12px",
                fontWeight: 700,
                fontSize: "0.8rem",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                transition: "all 0.2s ease",
              }}
            >
              <RotateCcw size={12} /> Clear Selection
            </button>
          )}
        </div>
      )}

      {/* Footer Navigation Buttons */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: isFirstQuestion ? "flex-end" : "space-between",
          gap: "14px",
          flexWrap: "wrap",
        }}
      >
        {!isFirstQuestion && (
          <button
            type="button"
            onClick={onPrev}
            className="heart-btn heart-btn-secondary"
            style={{ padding: "12px 24px", fontSize: "0.95rem" }}
          >
            <ArrowLeft size={16} /> <span>Previous</span>
          </button>
        )}

        {/* Center Swap Question Shortcut */}
        {onSwapQuestion && (
          <button
            type="button"
            onClick={() => {
              setIsSwapping(true);
              try { playOptionClick(); } catch(e){}
              setTimeout(() => {
                onSwapQuestion();
                setIsSwapping(false);
              }, 200);
            }}
            title="Swap this question for another romantic challenge"
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-muted)",
              cursor: "pointer",
              fontSize: "0.82rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 12px",
              borderRadius: "9999px",
              textDecoration: "underline",
              transition: "color 0.2s ease",
            }}
          >
            <RefreshCw size={13} style={{ transform: isSwapping ? "rotate(180deg)" : "none", transition: "transform 0.4s ease" }} />
            <span>Swap Question</span>
          </button>
        )}

        <button
          type="button"
          onClick={handleNextClick}
          disabled={!selectedOption}
          className={`heart-btn ${selectedOption ? "pulse-heart" : ""}`}
          style={{
            opacity: selectedOption ? 1 : 0.5,
            cursor: selectedOption ? "pointer" : "not-allowed",
            padding: "14px 36px",
            background: isLastQuestion
              ? "linear-gradient(135deg, #FF0844 0%, #D80032 100%)"
              : undefined,
            boxShadow: isLastQuestion && selectedOption
              ? "0 8px 24px rgba(255, 8, 68, 0.45)"
              : undefined,
          }}
        >
          <span>
            {isLastQuestion
              ? activePlayer === 1
                ? "Submit Turn 1 💕"
                : "Submit Quiz & Reveal Love Score ❤️"
              : "Next Question"}
          </span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
