"use client";

import { useState } from "react";
import { Check, Sparkles, Heart, ChevronDown, ChevronUp, Shuffle } from "lucide-react";
import { playOptionClick } from "../lib/audio";

export default function QuestionComparisonExplorer({
  questions = [],
  answers1 = [],
  answers2 = [],
  name1 = "Partner 1",
  name2 = "Partner 2",
  avatar1 = "🐱",
  avatar2 = "🐰",
}) {
  const [filter, setFilter] = useState("all"); // 'all', 'matched', 'differed'
  const [expandedId, setExpandedId] = useState(null);

  const total = Math.min(questions.length, answers1.length, answers2.length);

  const items = [];
  let matchCount = 0;
  let differCount = 0;

  for (let i = 0; i < total; i++) {
    const q = questions[i];
    const a1 = answers1[i] !== null && answers1[i] !== undefined ? answers1[i] : 1;
    const a2 = answers2[i] !== null && answers2[i] !== undefined ? answers2[i] : 1;

    let isMatch = false;
    let matchType = "different"; // 'perfect', 'partial', 'different'

    if (q.type === "who_is_more_likely") {
      if (a1 === a2) {
        isMatch = true;
        matchType = "perfect";
      } else if (a1 === 3 || a2 === 3) {
        matchType = "partial";
      }
    } else if (q.type === "this_or_that") {
      isMatch = a1 === a2;
      matchType = isMatch ? "perfect" : "different";
    } else if (q.type === "love_scale") {
      const diff = Math.abs(a1 - a2);
      if (diff === 0) {
        isMatch = true;
        matchType = "perfect";
      } else if (diff === 1) {
        matchType = "partial";
      }
    } else {
      isMatch = a1 === a2;
      matchType = isMatch ? "perfect" : Math.abs(a1 - a2) === 1 ? "partial" : "different";
    }

    if (isMatch) matchCount++;
    else differCount++;

    // Format option text
    let opt1Text = "Choice 1";
    let opt2Text = "Choice 1";

    if (q.options && q.options[a1 - 1]) {
      opt1Text = q.options[a1 - 1].text.replace(/\{name1\}/g, name1).replace(/\{name2\}/g, name2);
    }
    if (q.options && q.options[a2 - 1]) {
      opt2Text = q.options[a2 - 1].text.replace(/\{name1\}/g, name1).replace(/\{name2\}/g, name2);
    }

    items.push({
      index: i + 1,
      q,
      a1,
      a2,
      opt1Text,
      opt2Text,
      isMatch,
      matchType,
    });
  }

  const filteredItems = items.filter((item) => {
    if (filter === "matched") return item.isMatch;
    if (filter === "differed") return !item.isMatch;
    return true;
  });

  return (
    <section
      className="glass-card"
      style={{
        padding: "34px 26px",
        borderRadius: "28px",
        border: "1.5px solid var(--card-border)",
        background: "rgba(255, 255, 255, 0.9)",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "22px" }}>
        <h3
          style={{
            fontSize: "clamp(1.4rem, 3.6vw, 1.95rem)",
            color: "var(--ruby-red)",
            margin: "0 0 6px 0",
            fontFamily: "var(--font-heading)",
          }}
        >
          20 Questions: Where You Matched vs Differed 🎭
        </h3>
        <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", margin: 0 }}>
          Inspect both partners&apos; choices across every question in your journey!
        </p>
      </div>

      {/* Filter Tabs */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "8px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        <button
          type="button"
          onClick={() => {
            playOptionClick();
            setFilter("all");
          }}
          style={{
            padding: "8px 18px",
            borderRadius: "9999px",
            border: filter === "all" ? "2px solid var(--ruby-red)" : "1.5px solid var(--card-border-subtle)",
            background: filter === "all" ? "var(--ruby-red)" : "rgba(255, 255, 255, 0.8)",
            color: filter === "all" ? "#FFF" : "var(--text-dark)",
            fontWeight: 700,
            fontSize: "0.85rem",
            cursor: "pointer",
          }}
        >
          All 20 Questions ({total})
        </button>

        <button
          type="button"
          onClick={() => {
            playOptionClick();
            setFilter("matched");
          }}
          style={{
            padding: "8px 18px",
            borderRadius: "9999px",
            border: filter === "matched" ? "2px solid #00A86B" : "1.5px solid var(--card-border-subtle)",
            background: filter === "matched" ? "#00A86B" : "rgba(255, 255, 255, 0.8)",
            color: filter === "matched" ? "#FFF" : "var(--text-dark)",
            fontWeight: 700,
            fontSize: "0.85rem",
            cursor: "pointer",
          }}
        >
          ✨ Perfect Matches ({matchCount})
        </button>

        <button
          type="button"
          onClick={() => {
            playOptionClick();
            setFilter("differed");
          }}
          style={{
            padding: "8px 18px",
            borderRadius: "9999px",
            border: filter === "differed" ? "2px solid var(--royal-purple)" : "1.5px solid var(--card-border-subtle)",
            background: filter === "differed" ? "var(--royal-purple)" : "rgba(255, 255, 255, 0.8)",
            color: filter === "differed" ? "#FFF" : "var(--text-dark)",
            fontWeight: 700,
            fontSize: "0.85rem",
            cursor: "pointer",
          }}
        >
          💘 Distinct Perspectives ({differCount})
        </button>
      </div>

      {/* Accordion List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {filteredItems.map((item) => {
          const isExpanded = expandedId === item.index;
          return (
            <div
              key={item.index}
              style={{
                borderRadius: "18px",
                border: item.isMatch ? "1.5px solid rgba(0, 168, 107, 0.35)" : "1.5px solid var(--card-border-subtle)",
                background: item.isMatch ? "rgba(240, 255, 245, 0.8)" : "rgba(255, 255, 255, 0.85)",
                overflow: "hidden",
                transition: "all 0.2s ease",
              }}
            >
              {/* Question Row Header */}
              <div
                onClick={() => {
                  playOptionClick();
                  setExpandedId(isExpanded ? null : item.index);
                }}
                style={{
                  padding: "14px 18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  gap: "12px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1 }}>
                  <span
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      background: item.isMatch ? "#00A86B" : "rgba(255, 8, 68, 0.15)",
                      color: item.isMatch ? "#FFF" : "var(--ruby-red)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.78rem",
                      fontWeight: 800,
                      flexShrink: 0,
                    }}
                  >
                    #{item.index}
                  </span>

                  <div>
                    <span style={{ fontSize: "0.94rem", fontWeight: 700, color: "var(--text-dark)" }}>
                      {item.q.prompt_p1.replace(/\{name1\}/g, name1).replace(/\{name2\}/g, name2)}
                    </span>
                    <span style={{ display: "block", fontSize: "0.74rem", color: "var(--text-muted)", marginTop: "2px" }}>
                      {item.q.category} • {item.q.typeLabel || item.q.type}
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
                  {item.isMatch ? (
                    <span
                      style={{
                        fontSize: "0.76rem",
                        fontWeight: 700,
                        background: "rgba(0, 168, 107, 0.14)",
                        color: "#008855",
                        padding: "3px 10px",
                        borderRadius: "9999px",
                      }}
                    >
                      ✨ 100% Match
                    </span>
                  ) : (
                    <span
                      style={{
                        fontSize: "0.76rem",
                        fontWeight: 700,
                        background: "rgba(142, 5, 194, 0.12)",
                        color: "var(--royal-purple)",
                        padding: "3px 10px",
                        borderRadius: "9999px",
                      }}
                    >
                      💘 Different
                    </span>
                  )}
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </div>

              {/* Expanded Comparison Details */}
              {isExpanded && (
                <div
                  style={{
                    padding: "14px 18px 18px 18px",
                    borderTop: "1px dashed var(--card-border-subtle)",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "14px",
                    background: "rgba(255, 255, 255, 0.95)",
                  }}
                >
                  {/* Person 1 Pick */}
                  <div
                    style={{
                      background: "rgba(255, 8, 68, 0.06)",
                      border: "1px solid rgba(255, 8, 68, 0.2)",
                      borderRadius: "14px",
                      padding: "12px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                      <span>{avatar1}</span>
                      <strong style={{ fontSize: "0.85rem", color: "var(--ruby-red)" }}>{name1}&apos;s Pick:</strong>
                    </div>
                    <p style={{ margin: 0, fontSize: "0.86rem", color: "var(--text-dark)", lineHeight: 1.45 }}>
                      {item.opt1Text}
                    </p>
                  </div>

                  {/* Person 2 Pick */}
                  <div
                    style={{
                      background: "rgba(142, 5, 194, 0.06)",
                      border: "1px solid rgba(142, 5, 194, 0.2)",
                      borderRadius: "14px",
                      padding: "12px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                      <span>{avatar2}</span>
                      <strong style={{ fontSize: "0.85rem", color: "var(--royal-purple)" }}>{name2}&apos;s Pick:</strong>
                    </div>
                    <p style={{ margin: 0, fontSize: "0.86rem", color: "var(--text-dark)", lineHeight: 1.45 }}>
                      {item.opt2Text}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
