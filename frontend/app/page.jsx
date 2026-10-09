"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Heart,
  Sparkles,
  ArrowRight,
  Smartphone,
  Users,
  Calendar,
  Flame,
  MessageCircle,
  Award,
  BookOpen,
  Share2,
  Edit3,
} from "lucide-react";
import { createRoom, joinRoom } from "../lib/multiplayer";
import { GAME_MODES, UNIFIED_MODULE } from "../lib/gameEngine";
import {
  getCoupleProfile,
  getDaysUntilAnniversary,
  getCoupleStreak,
  getGameHistory,
} from "../lib/profileStorage";
import { playOptionClick, playCelebration } from "../lib/audio";
import CoupleStatusCard from "../components/CoupleStatusCard";
import StandaloneSuggestionBox from "../components/StandaloneSuggestionBox";
import QuestionCustomizerModal from "../components/QuestionCustomizerModal";

const AVATARS = ["🐱", "🐰", "🐼", "🦊", "🐶", "🐻", "🐨", "🦄", "🐧", "🐯"];

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Mode: 'multiplayer' or 'samedevice'
  const [activeTab, setActiveTab] = useState("multiplayer");
  // Sub-tab in multiplayer: 'create' or 'join'
  const [multiTab, setMultiTab] = useState("create");
  // Unified 20-Question Single Module
  const selectedGameMode = "forever_us_20";

  // Multiplayer inputs
  const [myName, setMyName] = useState("");
  const [myAvatar, setMyAvatar] = useState("🐱");
  const [roomCodeInput, setRoomCodeInput] = useState("");

  // Same phone inputs
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [avatar1, setAvatar1] = useState("🐱");
  const [avatar2, setAvatar2] = useState("🐰");

  // Couple Profile & Anniversary status
  const [anniversaryDays, setAnniversaryDays] = useState(null);
  const [coupleNickname, setCoupleNickname] = useState("");
  const [streakCount, setStreakCount] = useState(1);
  const [latestScore, setLatestScore] = useState(null);

  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);

  // Load profile and URL params on mount
  useEffect(() => {
    const history = getGameHistory();
    if (history && history.length > 0 && history[0].score !== undefined) {
      setLatestScore(history[0].score);
    }

    const roomParam = searchParams.get("room");
    if (roomParam) {
      setRoomCodeInput(roomParam.toUpperCase());
      setActiveTab("multiplayer");
      setMultiTab("join");
    }

    const profile = getCoupleProfile();
    if (profile.nickname) setCoupleNickname(profile.nickname);
    if (profile.name1) setName1(profile.name1);
    if (profile.name2) setName2(profile.name2);
    if (profile.avatar1) setAvatar1(profile.avatar1);
    if (profile.avatar2) setAvatar2(profile.avatar2);

    const savedName = localStorage.getItem("love-score-myname") || profile.name1;
    const savedAvatar = localStorage.getItem("love-score-myavatar") || profile.avatar1;
    if (savedName) setMyName(savedName);
    if (savedAvatar) setMyAvatar(savedAvatar);

    if (profile.anniversary) {
      const days = getDaysUntilAnniversary(profile.anniversary);
      setAnniversaryDays(days);
    }

    const streak = getCoupleStreak();
    if (streak && streak.count) {
      setStreakCount(streak.count);
    }
  }, [searchParams]);

  // 1. Create Room (Multiplayer)
  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!myName.trim()) {
      setErrorMsg("Please enter your name to create your love room! 🌸");
      return;
    }

    setErrorMsg("");
    setLoading(true);
    playOptionClick();

    try {
      localStorage.setItem("love-score-myname", myName.trim());
      localStorage.setItem("love-score-myavatar", myAvatar);
      localStorage.setItem("love-score-mode", selectedGameMode);

      const res = await createRoom(myName.trim(), myAvatar, selectedGameMode);
      const code = res.room.code;
      playCelebration();
      router.push(`/multiplayer?room=${code}&role=player1`);
    } catch (err) {
      setErrorMsg(err.message || "Failed to create room. Please try again! 💕");
      setLoading(false);
    }
  };

  // 2. Join Room (Multiplayer)
  const handleJoinRoom = async (e) => {
    e.preventDefault();
    const cleanCode = roomCodeInput.trim().toUpperCase();

    if (!cleanCode) {
      setErrorMsg("Please enter the 6-character room code from your partner! 🔍");
      return;
    }

    if (!myName.trim()) {
      setErrorMsg("Please enter your name to join! 💕");
      return;
    }

    setErrorMsg("");
    setLoading(true);
    playOptionClick();

    try {
      localStorage.setItem("love-score-myname", myName.trim());
      localStorage.setItem("love-score-myavatar", myAvatar);

      await joinRoom(cleanCode, myName.trim(), myAvatar);
      playCelebration();
      router.push(`/multiplayer?room=${cleanCode}&role=player2`);
    } catch (err) {
      setErrorMsg(err.message || "Room not found. Please check the code! 🔍");
      setLoading(false);
    }
  };

  // 3. Same Phone 2-Player Quiz
  const handleSamePhoneStart = (e) => {
    e.preventDefault();
    const clean1 = name1.trim();
    const clean2 = name2.trim();

    if (!clean1 || !clean2) {
      setErrorMsg("Please enter both partners' names to begin! 🌸");
      return;
    }

    if (clean1.toLowerCase() === clean2.toLowerCase()) {
      setErrorMsg("Please enter two different names or cute nicknames! 💕");
      return;
    }

    setErrorMsg("");
    playOptionClick();

    localStorage.setItem("love-score-name1", clean1);
    localStorage.setItem("love-score-name2", clean2);
    localStorage.setItem("love-score-avatar1", avatar1);
    localStorage.setItem("love-score-avatar2", avatar2);
    localStorage.setItem("love-score-mode", selectedGameMode);
    localStorage.removeItem("love-score-answers1");
    localStorage.removeItem("love-score-answers2");
    localStorage.removeItem("love-score-result");

    router.push("/quiz");
  };

  const activeModeDetails = UNIFIED_MODULE;

  return (
    <div
      style={{
        maxWidth: "840px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "32px",
      }}
    >
      {/* Anniversary & Streak Alert Banner */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          background: "linear-gradient(135deg, rgba(255, 8, 68, 0.1) 0%, rgba(183, 110, 121, 0.18) 100%)",
          border: "1.5px solid var(--rose-gold)",
          borderRadius: "20px",
          padding: "10px 20px",
          boxShadow: "0 4px 18px rgba(183, 110, 121, 0.15)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "1.3rem" }}>🔥</span>
          <span style={{ fontSize: "0.92rem", fontWeight: 700, color: "var(--ruby-red)" }}>
            Couple Streak: {streakCount} {streakCount === 1 ? "day" : "days"} alive!
          </span>
        </div>

        {anniversaryDays !== null ? (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.9rem", color: "var(--royal-purple)", fontWeight: 700 }}>
            <Calendar size={16} />
            <span>
              {anniversaryDays === 0
                ? "🎉 Today is your Anniversary! Happy celebration! 💍"
                : `💍 ${anniversaryDays} days until your next anniversary!`}
            </span>
          </div>
        ) : (
          <Link
            href="/profile"
            style={{
              fontSize: "0.85rem",
              color: "var(--royal-purple)",
              fontWeight: 600,
              textDecoration: "underline",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <span>Set your relationship anniversary</span>
            <ArrowRight size={14} />
          </Link>
        )}
      </div>

      {/* Romantic Welcome Header */}
      <section style={{ textAlign: "center", paddingTop: "4px" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "linear-gradient(135deg, rgba(255, 8, 68, 0.14) 0%, rgba(142, 5, 194, 0.16) 100%)",
            border: "1.5px solid var(--ruby-red)",
            padding: "8px 22px",
            borderRadius: "9999px",
            color: "var(--ruby-red)",
            fontSize: "0.95rem",
            fontWeight: 700,
            marginBottom: "16px",
            boxShadow: "0 4px 16px rgba(255, 8, 68, 0.2)",
          }}
        >
          <Sparkles size={16} />
          <span>Real-Time Couple Multiplayer Experience</span>
          <Sparkles size={16} color="var(--royal-purple)" />
        </div>

        <h1
          style={{
            fontSize: "clamp(2.8rem, 7vw, 4.4rem)",
            color: "var(--ruby-red)",
            marginBottom: "12px",
            lineHeight: 1.12,
            textShadow: "0 4px 28px rgba(255, 8, 68, 0.35)",
            fontFamily: "var(--font-heading)",
          }}
        >
          Forever Us ❤️
        </h1>

        <p
          style={{
            fontSize: "clamp(1.05rem, 2.5vw, 1.25rem)",
            color: "var(--text-muted)",
            maxWidth: "620px",
            margin: "0 auto",
            lineHeight: 1.6,
          }}
        >
          {coupleNickname ? `"${coupleNickname}" — ` : ""}
          Connect from <strong>different phones anywhere in the world</strong>, answer brand-new romantic & funny questions, and discover your true compatibility!
        </p>
      </section>

      {/* ---------------- YOUR COUPLE STATUS CARD ---------------- */}
      <CoupleStatusCard
        score={latestScore}
        name1={name1 || "Partner 1"}
        name2={name2 || "Partner 2"}
        avatar1={avatar1}
        avatar2={avatar2}
        onStartQuiz={() => {
          const tabSection = document.getElementById("game-tabs-section");
          if (tabSection) {
            tabSection.scrollIntoView({ behavior: "smooth" });
          }
        }}
        quizButtonText={
          latestScore !== null ? "Retake Couple Quiz ❤️" : "Take Couple Quiz ❤️"
        }
      />

      {/* ---------------- SINGLE UNIFIED MODULE SHOWCASE ---------------- */}
      <section
        className="glass-card glass-card-glow"
        style={{
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.94) 0%, rgba(255, 240, 245, 0.95) 100%)",
          border: "2px solid var(--ruby-red)",
          borderRadius: "28px",
          padding: "28px 24px",
          boxShadow: "0 10px 32px rgba(255, 8, 68, 0.16)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "2rem" }}>💍</span>
            <div>
              <h3 style={{ fontSize: "1.45rem", color: "var(--ruby-red)", margin: 0, fontWeight: 800 }}>
                Forever Us: The 20-Question Experience ❤️
              </h3>
              <span style={{ fontSize: "0.86rem", color: "var(--text-muted)" }}>
                Single Master Module • Multi-Format Couple Compatibility &amp; Secret Suggestions
              </span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => {
                playOptionClick();
                setIsQuestionModalOpen(true);
              }}
              className="heart-btn heart-btn-secondary"
              style={{
                padding: "6px 14px",
                borderRadius: "9999px",
                fontSize: "0.82rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                fontWeight: 700,
              }}
            >
              <Edit3 size={13} />
              <span>Customize Questions &amp; Answers</span>
            </button>

            <div
              style={{
                fontSize: "0.82rem",
                background: "linear-gradient(135deg, var(--ruby-red) 0%, var(--royal-purple) 100%)",
                color: "#FFF",
                padding: "6px 16px",
                borderRadius: "9999px",
                fontWeight: 800,
                boxShadow: "0 4px 12px rgba(255, 8, 68, 0.3)",
              }}
            >
              20 Brand-New Questions ✨
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "12px",
            marginTop: "16px",
          }}
        >
          <div style={{ background: "rgba(255, 255, 255, 0.8)", border: "1.5px solid var(--card-border-subtle)", borderRadius: "16px", padding: "14px 12px", textAlign: "center" }}>
            <span style={{ fontSize: "1.5rem" }}>🌹</span>
            <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-dark)", marginTop: "4px" }}>
              Romantic Scenarios
            </div>
            <div style={{ fontSize: "0.76rem", color: "var(--text-muted)", marginTop: "2px" }}>
              Dream home, moments &amp; future plans
            </div>
          </div>

          <div style={{ background: "rgba(255, 255, 255, 0.8)", border: "1.5px solid var(--card-border-subtle)", borderRadius: "16px", padding: "14px 12px", textAlign: "center" }}>
            <span style={{ fontSize: "1.5rem" }}>⚡</span>
            <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-dark)", marginTop: "4px" }}>
              This or That
            </div>
            <div style={{ fontSize: "0.76rem", color: "var(--text-muted)", marginTop: "2px" }}>
              Rapid romantic dilemma choices
            </div>
          </div>

          <div style={{ background: "rgba(255, 255, 255, 0.8)", border: "1.5px solid var(--card-border-subtle)", borderRadius: "16px", padding: "14px 12px", textAlign: "center" }}>
            <span style={{ fontSize: "1.5rem" }}>⭐</span>
            <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-dark)", marginTop: "4px" }}>
              1–5 Love Scales
            </div>
            <div style={{ fontSize: "0.76rem", color: "var(--text-muted)", marginTop: "2px" }}>
              Rate destiny, intimacy &amp; silliness
            </div>
          </div>

          <div style={{ background: "rgba(255, 255, 255, 0.8)", border: "1.5px solid var(--card-border-subtle)", borderRadius: "16px", padding: "14px 12px", textAlign: "center" }}>
            <span style={{ fontSize: "1.5rem" }}>🎭</span>
            <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-dark)", marginTop: "4px" }}>
              Who&apos;s More Likely?
            </div>
            <div style={{ fontSize: "0.76rem", color: "var(--text-muted)", marginTop: "2px" }}>
              Playful couple dynamics &amp; quirks
            </div>
          </div>

          <div style={{ background: "rgba(255, 240, 245, 0.9)", border: "1.5px solid var(--ruby-red)", borderRadius: "16px", padding: "14px 12px", textAlign: "center" }}>
            <span style={{ fontSize: "1.5rem" }}>💌</span>
            <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--ruby-red)", marginTop: "4px" }}>
              Partner Passage Box
            </div>
            <div style={{ fontSize: "0.76rem", color: "var(--text-muted)", marginTop: "2px" }}>
              Secret suggestions &amp; wax-sealed love letters
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- STANDALONE COUPLE SUGGESTION BOX (NO QUIZ REQUIRED) ---------------- */}
      <section id="couple-suggestion-box-section">
        <StandaloneSuggestionBox
          title="💌 Couple Suggestion &amp; Love Advice Box"
          subtitle="Explore daily romantic advice, drop secret suggestions to each other, and keep a shared love jar — open anytime even without attending the quiz!"
        />
      </section>

      {/* Main Game Selector Tabs (Different Phones vs Same Phone) */}
      <div
        id="game-tabs-section"
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "12px",
          background: "rgba(255, 255, 255, 0.8)",
          padding: "8px",
          borderRadius: "9999px",
          border: "2px solid var(--card-border)",
          boxShadow: "0 6px 20px rgba(230, 0, 57, 0.1)",
        }}
      >
        <button
          type="button"
          onClick={() => {
            playOptionClick();
            setActiveTab("multiplayer");
            setErrorMsg("");
          }}
          style={{
            flex: 1,
            maxWidth: "340px",
            padding: "12px 18px",
            borderRadius: "9999px",
            border: "none",
            cursor: "pointer",
            fontWeight: 700,
            fontSize: "0.98rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            background:
              activeTab === "multiplayer"
                ? "linear-gradient(135deg, var(--ruby-red) 0%, var(--royal-purple) 100%)"
                : "transparent",
            color: activeTab === "multiplayer" ? "#FFF" : "var(--text-dark)",
            boxShadow:
              activeTab === "multiplayer" ? "0 6px 18px rgba(255, 8, 68, 0.4)" : "none",
            transition: "all 0.25s ease",
          }}
        >
          <Smartphone size={18} />
          <span>Play from Different Phones</span>
        </button>

        <button
          type="button"
          onClick={() => {
            playOptionClick();
            setActiveTab("samedevice");
            setErrorMsg("");
          }}
          style={{
            flex: 1,
            maxWidth: "320px",
            padding: "12px 18px",
            borderRadius: "9999px",
            border: "none",
            cursor: "pointer",
            fontWeight: 700,
            fontSize: "0.98rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            background:
              activeTab === "samedevice"
                ? "linear-gradient(135deg, var(--ruby-red) 0%, var(--royal-purple) 100%)"
                : "transparent",
            color: activeTab === "samedevice" ? "#FFF" : "var(--text-dark)",
            boxShadow:
              activeTab === "samedevice" ? "0 6px 18px rgba(255, 8, 68, 0.4)" : "none",
            transition: "all 0.25s ease",
          }}
        >
          <Users size={18} />
          <span>Play on Same Phone</span>
        </button>
      </div>

      {/* Main Interactive Card */}
      <div className="glass-card glass-card-glow" style={{ padding: "36px 30px" }}>
        {/* Error Banner */}
        {errorMsg && (
          <div
            role="alert"
            style={{
              marginBottom: "20px",
              padding: "12px 18px",
              background: "rgba(255, 8, 68, 0.14)",
              border: "1.5px solid var(--ruby-red)",
              borderRadius: "16px",
              color: "var(--ruby-red)",
              fontSize: "0.94rem",
              fontWeight: 600,
              textAlign: "center",
            }}
          >
            {errorMsg}
          </div>
        )}

        {/* ---------------- MODE 1: MULTIPLAYER (DIFFERENT PHONES) ---------------- */}
        {activeTab === "multiplayer" && (
          <div>
            {/* Create vs Join Sub-tabs */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "10px",
                marginBottom: "28px",
              }}
            >
              <button
                type="button"
                onClick={() => {
                  playOptionClick();
                  setMultiTab("create");
                  setErrorMsg("");
                }}
                style={{
                  padding: "10px 24px",
                  borderRadius: "9999px",
                  border:
                    multiTab === "create"
                      ? "2px solid var(--ruby-red)"
                      : "1.5px solid var(--card-border-subtle)",
                  background:
                    multiTab === "create"
                      ? "rgba(255, 8, 68, 0.12)"
                      : "rgba(255, 255, 255, 0.6)",
                  color: multiTab === "create" ? "var(--ruby-red)" : "var(--text-muted)",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                ✨ Create Couple Room
              </button>

              <button
                type="button"
                onClick={() => {
                  playOptionClick();
                  setMultiTab("join");
                  setErrorMsg("");
                }}
                style={{
                  padding: "10px 24px",
                  borderRadius: "9999px",
                  border:
                    multiTab === "join"
                      ? "2px solid var(--royal-purple)"
                      : "1.5px solid var(--card-border-subtle)",
                  background:
                    multiTab === "join"
                      ? "rgba(142, 5, 194, 0.14)"
                      : "rgba(255, 255, 255, 0.6)",
                  color:
                    multiTab === "join" ? "var(--royal-purple)" : "var(--text-muted)",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                💌 Join Partner's Room
              </button>
            </div>

            {/* TAB A: CREATE ROOM */}
            {multiTab === "create" && (
              <form onSubmit={handleCreateRoom} style={{ textAlign: "center" }}>
                <div style={{ maxWidth: "440px", margin: "0 auto 24px" }}>
                  <label
                    htmlFor="create-name-input"
                    style={{
                      display: "block",
                      fontSize: "0.92rem",
                      fontWeight: 600,
                      color: "var(--text-dark)",
                      marginBottom: "8px",
                      textAlign: "left",
                    }}
                  >
                    Your Name or Nickname
                  </label>
                  <input
                    id="create-name-input"
                    type="text"
                    className="romantic-input"
                    placeholder="e.g. Romeo or My Love"
                    value={myName}
                    maxLength={30}
                    onChange={(e) => setMyName(e.target.value)}
                    autoComplete="off"
                  />
                </div>

                {/* Avatar Picker */}
                <div style={{ marginBottom: "26px" }}>
                  <span
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      color: "var(--text-muted)",
                      display: "block",
                      marginBottom: "8px",
                    }}
                  >
                    Choose your mascot avatar:
                  </span>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "8px",
                      flexWrap: "wrap",
                    }}
                  >
                    {AVATARS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => {
                          playOptionClick();
                          setMyAvatar(emoji);
                        }}
                        style={{
                          background:
                            myAvatar === emoji
                              ? "var(--ruby-red)"
                              : "rgba(255, 255, 255, 0.7)",
                          border:
                            myAvatar === emoji
                              ? "2px solid #FFF"
                              : "1px solid var(--card-border-subtle)",
                          borderRadius: "50%",
                          width: "40px",
                          height: "40px",
                          cursor: "pointer",
                          fontSize: "1.25rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow:
                            myAvatar === emoji
                              ? "0 4px 12px rgba(255, 8, 68, 0.4)"
                              : "none",
                          transition: "all 0.2s ease",
                        }}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mode Confirmation Chip */}
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "6px 18px",
                    borderRadius: "9999px",
                    background: "rgba(255, 8, 68, 0.08)",
                    border: "1px solid rgba(255, 8, 68, 0.25)",
                    marginBottom: "26px",
                    fontSize: "0.88rem",
                    color: "var(--ruby-red)",
                    fontWeight: 600,
                  }}
                >
                  <span>Selected Mode:</span>
                  <strong>{activeModeDetails.icon} {activeModeDetails.title}</strong>
                </div>

                {/* Action CTA */}
                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="heart-btn pulse-heart"
                    style={{
                      fontSize: "1.2rem",
                      padding: "16px 44px",
                      minWidth: "280px",
                    }}
                  >
                    <Heart size={22} fill="#FFF" className="beating-heart" />
                    <span>{loading ? "Creating Room..." : "Start Love Game ❤️"}</span>
                    <ArrowRight size={22} />
                  </button>
                </div>

                <p
                  style={{
                    marginTop: "16px",
                    fontSize: "0.85rem",
                    color: "var(--text-subtle)",
                  }}
                >
                  You will get a unique 6-character room code & instant WhatsApp invite link to send your partner!
                </p>
              </form>
            )}

            {/* TAB B: JOIN ROOM */}
            {multiTab === "join" && (
              <form onSubmit={handleJoinRoom} style={{ textAlign: "center" }}>
                <div style={{ maxWidth: "440px", margin: "0 auto 20px" }}>
                  <label
                    htmlFor="join-code-input"
                    style={{
                      display: "block",
                      fontSize: "0.92rem",
                      fontWeight: 600,
                      color: "var(--royal-purple)",
                      marginBottom: "8px",
                      textAlign: "left",
                    }}
                  >
                    6-Character Room Code
                  </label>
                  <input
                    id="join-code-input"
                    type="text"
                    className="romantic-input"
                    placeholder="e.g. LOVE88"
                    value={roomCodeInput}
                    maxLength={10}
                    onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
                    style={{
                      fontFamily: "monospace",
                      fontSize: "1.4rem",
                      textAlign: "center",
                      letterSpacing: "4px",
                      fontWeight: 700,
                    }}
                    autoComplete="off"
                  />
                </div>

                <div style={{ maxWidth: "440px", margin: "0 auto 24px" }}>
                  <label
                    htmlFor="join-name-input"
                    style={{
                      display: "block",
                      fontSize: "0.92rem",
                      fontWeight: 600,
                      color: "var(--text-dark)",
                      marginBottom: "8px",
                      textAlign: "left",
                    }}
                  >
                    Your Name or Nickname
                  </label>
                  <input
                    id="join-name-input"
                    type="text"
                    className="romantic-input"
                    placeholder="e.g. Juliet or Sweetheart"
                    value={myName}
                    maxLength={30}
                    onChange={(e) => setMyName(e.target.value)}
                    autoComplete="off"
                  />
                </div>

                {/* Avatar Picker */}
                <div style={{ marginBottom: "28px" }}>
                  <span
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      color: "var(--text-muted)",
                      display: "block",
                      marginBottom: "8px",
                    }}
                  >
                    Choose your mascot avatar:
                  </span>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "8px",
                      flexWrap: "wrap",
                    }}
                  >
                    {AVATARS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => {
                          playOptionClick();
                          setMyAvatar(emoji);
                        }}
                        style={{
                          background:
                            myAvatar === emoji
                              ? "var(--royal-purple)"
                              : "rgba(255, 255, 255, 0.7)",
                          border:
                            myAvatar === emoji
                              ? "2px solid #FFF"
                              : "1px solid var(--card-border-subtle)",
                          borderRadius: "50%",
                          width: "40px",
                          height: "40px",
                          cursor: "pointer",
                          fontSize: "1.25rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow:
                            myAvatar === emoji
                              ? "0 4px 12px rgba(142, 5, 194, 0.4)"
                              : "none",
                          transition: "all 0.2s ease",
                        }}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="heart-btn heart-btn-purple pulse-heart"
                  style={{
                    fontSize: "1.2rem",
                    padding: "16px 44px",
                    minWidth: "280px",
                  }}
                >
                  <Heart size={22} fill="#FFF" className="beating-heart" />
                  <span>{loading ? "Connecting..." : "Join Partner's Room 💕"}</span>
                  <ArrowRight size={22} />
                </button>
              </form>
            )}
          </div>
        )}

        {/* ---------------- MODE 2: SAME PHONE (PASS THE DEVICE) ---------------- */}
        {activeTab === "samedevice" && (
          <form onSubmit={handleSamePhoneStart}>
            <div style={{ textAlign: "center", marginBottom: "26px" }}>
              <h2 style={{ fontSize: "1.7rem", color: "var(--text-dark)", marginBottom: "4px" }}>
                Play Together on One Phone
              </h2>
              <p style={{ fontSize: "0.95rem", color: "var(--text-muted)" }}>
                Person 1 answers secretly, then hands the device to Person 2!
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "20px",
                marginBottom: "26px",
              }}
            >
              {/* Partner 1 */}
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.8)",
                  borderRadius: "20px",
                  padding: "20px",
                  border: "1.5px solid var(--card-border-subtle)",
                }}
              >
                <span
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    color: "var(--ruby-red)",
                    display: "block",
                    marginBottom: "8px",
                  }}
                >
                  👑 PERSON 1
                </span>
                <input
                  type="text"
                  className="romantic-input"
                  placeholder="e.g. Romeo"
                  value={name1}
                  maxLength={30}
                  onChange={(e) => setName1(e.target.value)}
                  autoComplete="off"
                />
              </div>

              {/* Partner 2 */}
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.8)",
                  borderRadius: "20px",
                  padding: "20px",
                  border: "1.5px solid var(--card-border-subtle)",
                }}
              >
                <span
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    color: "var(--royal-purple)",
                    display: "block",
                    marginBottom: "8px",
                  }}
                >
                  💎 PERSON 2
                </span>
                <input
                  type="text"
                  className="romantic-input"
                  placeholder="e.g. Juliet"
                  value={name2}
                  maxLength={30}
                  onChange={(e) => setName2(e.target.value)}
                  autoComplete="off"
                />
              </div>
            </div>

            {/* Mode Confirmation */}
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "6px 18px",
                  borderRadius: "9999px",
                  background: "rgba(255, 8, 68, 0.08)",
                  border: "1px solid rgba(255, 8, 68, 0.25)",
                  fontSize: "0.88rem",
                  color: "var(--ruby-red)",
                  fontWeight: 600,
                }}
              >
                <span>Game Mode:</span>
                <strong>{activeModeDetails.icon} {activeModeDetails.title}</strong>
              </div>
            </div>

            <div style={{ textAlign: "center" }}>
              <button
                type="submit"
                className="heart-btn pulse-heart"
                style={{ fontSize: "1.15rem", padding: "16px 42px" }}
              >
                <Heart size={20} fill="#FFF" className="beating-heart" />
                <span>Start Quiz on This Device 💕</span>
                <ArrowRight size={20} />
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Profile & Memory Wall Quick Access Cards */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "16px",
        }}
      >
        <Link
          href="/profile"
          style={{ textDecoration: "none" }}
          className="glass-card"
        >
          <div style={{ padding: "20px", display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, var(--rose-gold) 0%, #FF85B3 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.4rem",
              }}
            >
              💌
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: "1.05rem", color: "var(--text-dark)" }}>
                Couple Profile & Anniversary
              </h4>
              <span style={{ fontSize: "0.84rem", color: "var(--text-muted)" }}>
                Edit nicknames, avatars & track special dates
              </span>
            </div>
          </div>
        </Link>

        <Link
          href="/profile#memory-wall"
          style={{ textDecoration: "none" }}
          className="glass-card"
        >
          <div style={{ padding: "20px", display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, var(--royal-purple) 0%, #FF0844 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.4rem",
              }}
            >
              🌹
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: "1.05rem", color: "var(--text-dark)" }}>
                Relationship Memory Wall
              </h4>
              <span style={{ fontSize: "0.84rem", color: "var(--text-muted)" }}>
                View past game scores, badges & love milestones
              </span>
            </div>
          </div>
        </Link>
      </section>

      {/* Feature Highlights (Rose-Gold, Red, Pink, Purple) */}
      <section>
        <h3
          style={{
            textAlign: "center",
            fontSize: "1.8rem",
            color: "var(--ruby-red)",
            marginBottom: "20px",
          }}
        >
          Why Couples Love "Forever Us" ❤️
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "18px",
          }}
        >
          {[
            {
              icon: "📱",
              title: "Play From Different Phones",
              desc: "Generate a room code or WhatsApp invite link and play simultaneously anywhere over the internet.",
            },
            {
              icon: "❤️",
              title: "Glowing Red Score Heart",
              desc: "Both partners see their final compatibility percentage inside an animated, glowing red liquid heart.",
            },
            {
              icon: "🎮",
              title: "6 Unique Game Modes",
              desc: "From Truth or Love to Who Knows Whom Better and Dream Dates, enjoy fresh questions every time.",
            },
            {
              icon: "💌",
              title: "Love Letter & Surprise Notes",
              desc: "Unlock dynamic romantic letters, surprise secrets, and certificates to share on WhatsApp.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="glass-card"
              style={{
                padding: "24px 20px",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div style={{ fontSize: "2.2rem", marginBottom: "10px", lineHeight: 1 }}>
                {item.icon}
              </div>
              <h4
                style={{
                  fontFamily: "var(--font-body)",
                  fontWeight: 700,
                  fontSize: "1.08rem",
                  color: "var(--text-dark)",
                  marginBottom: "8px",
                }}
              >
                {item.title}
              </h4>
              <p
                style={{
                  fontSize: "0.88rem",
                  color: "var(--text-muted)",
                  lineHeight: 1.45,
                  margin: 0,
                }}
              >
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Question Customizer & Editor Modal */}
      <QuestionCustomizerModal
        isOpen={isQuestionModalOpen}
        onClose={() => setIsQuestionModalOpen(false)}
      />
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div style={{ textAlign: "center", padding: "40px" }}>
          Loading Forever Us ❤️...
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
