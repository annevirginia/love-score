"use client";

import { useState, useEffect } from "react";
import {
  X,
  Edit3,
  Plus,
  Save,
  RotateCcw,
  Search,
  Check,
  Trash2,
  Sparkles,
  HelpCircle,
  Heart,
} from "lucide-react";
import fallbackQuestions from "../data/questions.json";
import {
  getCustomQuestions,
  saveCustomQuestions,
  addCustomQuestion,
  deleteCustomQuestion,
  resetCustomQuestions,
} from "../lib/profileStorage";
import { playOptionClick, playCelebration } from "../lib/audio";

export default function QuestionCustomizerModal({ isOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [customQuestions, setCustomQuestions] = useState([]);
  const [activeEditingQ, setActiveEditingQ] = useState(null);

  // New question form state
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newPrompt, setNewPrompt] = useState("");
  const [newCategory, setNewCategory] = useState("💖 Love and Relationship");
  const [newOptions, setNewOptions] = useState([
    "Option A ❤️",
    "Option B 🌸",
    "Option C ✨",
    "Option D 🍯",
  ]);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    if (isOpen) {
      setCustomQuestions(getCustomQuestions());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 2800);
  };

  // Combine default questions and custom questions
  const allMergedQuestions = [...customQuestions, ...fallbackQuestions];

  const categories = [
    "all",
    "💖 Love and Relationship",
    "💍 Deep Future & Values",
    "✨ Romance & Magic",
    "🎭 Who Knows Better?",
    "☕ Daily Life & Habits",
    "⚡ This or That",
  ];

  const filteredQuestions = allMergedQuestions.filter((q) => {
    const matchesCategory =
      selectedCategory === "all" || q.category === selectedCategory;
    const promptText = (q.prompt_p1 || q.question || "").toLowerCase();
    const matchesSearch = promptText.includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!activeEditingQ) return;

    playCelebration();
    const existing = getCustomQuestions();
    const index = existing.findIndex((q) => q.id === activeEditingQ.id);

    let updated;
    if (index >= 0) {
      updated = [...existing];
      updated[index] = activeEditingQ;
    } else {
      // Overriding a default question by saving it into custom questions
      updated = [activeEditingQ, ...existing];
    }

    saveCustomQuestions(updated);
    setCustomQuestions(updated);
    setActiveEditingQ(null);
    showToast("Question & answers saved successfully! 💕");
  };

  const handleAddNewSubmit = (e) => {
    e.preventDefault();
    if (!newPrompt.trim()) return;

    playCelebration();
    const created = addCustomQuestion({
      category: newCategory,
      categoryIcon: newCategory.slice(0, 2),
      prompt_p1: newPrompt.trim(),
      prompt_p2: newPrompt.trim(),
      options: newOptions.map((opt, i) => ({
        value: i + 1,
        text: opt.trim() || `Option ${i + 1}`,
      })),
    });

    setCustomQuestions(getCustomQuestions());
    setIsAddingNew(false);
    setNewPrompt("");
    showToast("New romantic question added to your quiz! ✨");
  };

  const handleDelete = (id) => {
    playOptionClick();
    deleteCustomQuestion(id);
    setCustomQuestions(getCustomQuestions());
    showToast("Custom question deleted.");
  };

  const handleResetDefaults = () => {
    if (confirm("Reset all customized questions back to original defaults? 🔄")) {
      playOptionClick();
      resetCustomQuestions();
      setCustomQuestions([]);
      showToast("Questions reset to default bank!");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.65)",
        backdropFilter: "blur(8px)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      <div
        className="glass-card"
        style={{
          width: "100%",
          maxWidth: "760px",
          maxHeight: "90vh",
          overflowY: "auto",
          background:
            "linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 242, 247, 0.96) 100%)",
          borderRadius: "28px",
          padding: "28px 24px",
          boxShadow: "0 24px 60px rgba(0, 0, 0, 0.3)",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: "18px",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1.5px solid rgba(255, 46, 116, 0.2)",
            paddingBottom: "14px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "1.8rem" }}>✏️</span>
            <div>
              <h2
                style={{
                  fontSize: "1.35rem",
                  margin: 0,
                  fontWeight: 800,
                  color: "var(--ruby-red)",
                }}
              >
                Customize Questions &amp; Answers
              </h2>
              <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                Edit existing questions, change answer options, or write your own couple questions!
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              background: "rgba(255, 255, 255, 0.9)",
              border: "1px solid rgba(255, 46, 116, 0.25)",
              borderRadius: "50%",
              width: "36px",
              height: "36px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--ruby-red)",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Toast Alert */}
        {toastMessage && (
          <div
            style={{
              background: "linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.15) 100%)",
              border: "1.5px solid #10B981",
              borderRadius: "14px",
              padding: "10px 16px",
              color: "#065F46",
              fontWeight: 700,
              fontSize: "0.86rem",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Check size={16} />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Action bar: Add Question / Reset defaults */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
          <button
            type="button"
            onClick={() => {
              playOptionClick();
              setIsAddingNew(!isAddingNew);
              setActiveEditingQ(null);
            }}
            className="heart-btn"
            style={{
              padding: "8px 18px",
              fontSize: "0.86rem",
              borderRadius: "9999px",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Plus size={16} />
            <span>{isAddingNew ? "Cancel" : "Add Custom Question"}</span>
          </button>

          {customQuestions.length > 0 && (
            <button
              type="button"
              onClick={handleResetDefaults}
              style={{
                background: "transparent",
                border: "1px solid rgba(255, 46, 116, 0.3)",
                color: "var(--ruby-red)",
                borderRadius: "9999px",
                padding: "6px 14px",
                fontSize: "0.8rem",
                fontWeight: 700,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <RotateCcw size={13} />
              <span>Reset Defaults</span>
            </button>
          )}
        </div>

        {/* Form: Add New Question */}
        {isAddingNew && (
          <form
            onSubmit={handleAddNewSubmit}
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              border: "2px solid var(--ruby-red)",
              borderRadius: "20px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <h3 style={{ margin: 0, fontSize: "1.1rem", color: "var(--ruby-red)", fontWeight: 800 }}>
              ✨ Create a Brand-New Couple Question
            </h3>

            <div>
              <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-dark)", display: "block", marginBottom: "4px" }}>
                Question Prompt:
              </label>
              <input
                type="text"
                value={newPrompt}
                onChange={(e) => setNewPrompt(e.target.value)}
                placeholder="e.g. Where is our dream honeymoon destination?"
                required
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "12px",
                  border: "1px solid rgba(255, 46, 116, 0.3)",
                  fontSize: "0.92rem",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-dark)", display: "block", marginBottom: "6px" }}>
                Answer Choices:
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                {newOptions.map((opt, i) => (
                  <input
                    key={i}
                    type="text"
                    value={opt}
                    onChange={(e) => {
                      const updated = [...newOptions];
                      updated[i] = e.target.value;
                      setNewOptions(updated);
                    }}
                    placeholder={`Option ${["A", "B", "C", "D"][i]}`}
                    style={{
                      padding: "8px 12px",
                      borderRadius: "10px",
                      border: "1px solid #E5E7EB",
                      fontSize: "0.86rem",
                    }}
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="heart-btn"
              style={{
                padding: "10px 20px",
                fontSize: "0.9rem",
                borderRadius: "9999px",
                alignSelf: "flex-end",
              }}
            >
              <Save size={15} /> Save Question
            </button>
          </form>
        )}

        {/* Form: Active Question Editor Modal */}
        {activeEditingQ && (
          <form
            onSubmit={handleSaveEdit}
            style={{
              background: "rgba(255, 255, 255, 0.98)",
              border: "2px solid var(--royal-purple)",
              borderRadius: "20px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              boxShadow: "0 8px 24px rgba(142, 5, 194, 0.15)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: "1.1rem", color: "var(--royal-purple)", fontWeight: 800 }}>
                ✏️ Edit Question #{activeEditingQ.id}
              </h3>
              <button
                type="button"
                onClick={() => setActiveEditingQ(null)}
                style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
              >
                <X size={16} />
              </button>
            </div>

            <div>
              <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-dark)", display: "block", marginBottom: "4px" }}>
                Question Prompt:
              </label>
              <input
                type="text"
                value={activeEditingQ.prompt_p1 || activeEditingQ.question || ""}
                onChange={(e) =>
                  setActiveEditingQ({
                    ...activeEditingQ,
                    prompt_p1: e.target.value,
                    prompt_p2: e.target.value,
                    question: e.target.value,
                  })
                }
                required
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "12px",
                  border: "1px solid rgba(142, 5, 194, 0.3)",
                  fontSize: "0.92rem",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-dark)", display: "block", marginBottom: "6px" }}>
                Answer Options:
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {(activeEditingQ.options || []).map((opt, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--ruby-red)", width: "24px" }}>
                      {["A", "B", "C", "D"][i] || i + 1}:
                    </span>
                    <input
                      type="text"
                      value={opt.text}
                      onChange={(e) => {
                        const updatedOptions = [...activeEditingQ.options];
                        updatedOptions[i] = { ...opt, text: e.target.value };
                        setActiveEditingQ({ ...activeEditingQ, options: updatedOptions });
                      }}
                      style={{
                        flex: 1,
                        padding: "8px 12px",
                        borderRadius: "10px",
                        border: "1px solid #E5E7EB",
                        fontSize: "0.86rem",
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "4px" }}>
              <button
                type="button"
                onClick={() => setActiveEditingQ(null)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "9999px",
                  border: "1px solid #E5E7EB",
                  background: "#FFF",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="heart-btn"
                style={{
                  padding: "8px 20px",
                  fontSize: "0.88rem",
                  borderRadius: "9999px",
                }}
              >
                <Save size={15} /> Save Changes
              </button>
            </div>
          </form>
        )}

        {/* Search & Filter */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
            <Search size={16} color="var(--text-muted)" style={{ position: "absolute", left: "12px", top: "12px" }} />
            <input
              type="text"
              placeholder="Search questions by keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px 10px 36px",
                borderRadius: "12px",
                border: "1px solid rgba(255, 46, 116, 0.25)",
                fontSize: "0.88rem",
                boxSizing: "border-box",
                background: "#FFFFFF",
              }}
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: "10px 14px",
              borderRadius: "12px",
              border: "1px solid rgba(255, 46, 116, 0.25)",
              fontSize: "0.85rem",
              background: "#FFFFFF",
              color: "var(--text-dark)",
              fontWeight: 600,
            }}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === "all" ? "All Categories" : c}
              </option>
            ))}
          </select>
        </div>

        {/* Questions List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "380px", overflowY: "auto" }}>
          {filteredQuestions.slice(0, 40).map((q) => {
            const isCustom = String(q.id).startsWith("custom-");
            return (
              <div
                key={q.id}
                style={{
                  background: isCustom ? "rgba(255, 240, 246, 0.85)" : "rgba(255, 255, 255, 0.85)",
                  border: isCustom ? "1.5px solid var(--ruby-red)" : "1px solid rgba(255, 46, 116, 0.2)",
                  borderRadius: "16px",
                  padding: "14px 18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "12px",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--ruby-red)" }}>
                      {q.categoryIcon} #{q.id}
                    </span>
                    {isCustom && (
                      <span
                        style={{
                          background: "var(--ruby-red)",
                          color: "#FFF",
                          fontSize: "0.68rem",
                          padding: "2px 8px",
                          borderRadius: "9999px",
                          fontWeight: 700,
                        }}
                      >
                        Custom ✨
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: "0.92rem", fontWeight: 600, color: "#421028" }}>
                    {q.prompt_p1 || q.question}
                  </div>
                  <div style={{ fontSize: "0.76rem", color: "var(--text-muted)", marginTop: "4px" }}>
                    {(q.options || []).map((opt) => opt.text).slice(0, 2).join(" • ")}...
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <button
                    type="button"
                    onClick={() => {
                      playOptionClick();
                      setActiveEditingQ(q);
                      setIsAddingNew(false);
                    }}
                    title="Edit question text and answers"
                    style={{
                      background: "rgba(255, 8, 68, 0.1)",
                      border: "none",
                      color: "var(--ruby-red)",
                      borderRadius: "8px",
                      padding: "6px 12px",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <Edit3 size={13} />
                    <span>Edit</span>
                  </button>

                  {isCustom && (
                    <button
                      type="button"
                      onClick={() => handleDelete(q.id)}
                      title="Delete custom question"
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "var(--text-subtle)",
                        cursor: "pointer",
                        padding: "6px",
                      }}
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
