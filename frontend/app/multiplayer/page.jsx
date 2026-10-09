"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Heart,
  Share2,
  Copy,
  Check,
  Smartphone,
  Users,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Download,
  AlertCircle,
  MessageCircle,
  Mail,
  Gift,
} from "lucide-react";
import fallbackQuestions from "../../data/questions.json";
import HeartProgress from "../../components/HeartProgress";
import QuestionCard from "../../components/QuestionCard";
import ScoreHeart from "../../components/ScoreHeart";
import ConfettiHearts from "../../components/ConfettiHearts";
import CategoryBreakdown from "../../components/CategoryBreakdown";
import HeartsJoiningLoader from "../../components/HeartsJoiningLoader";
import LoveLetterModal from "../../components/LoveLetterModal";
import PartnerPassageBox from "../../components/PartnerPassageBox";
import SealedPassageReveal from "../../components/SealedPassageReveal";
import CoupleCoachInsights from "../../components/CoupleCoachInsights";
import QuestionComparisonExplorer from "../../components/QuestionComparisonExplorer";
import CoupleStatusCard from "../../components/CoupleStatusCard";
import RelationshipSuggestionBox from "../../components/RelationshipSuggestionBox";
import {
  subscribeToRoom,
  updatePlayerProgress,
  completePlayerQuiz,
  replayRoom,
  updateRoomQuestions,
} from "../../lib/multiplayer";
import { GAME_MODES, UNIFIED_MODULE, swapQuestionInSet } from "../../lib/gameEngine";
import { saveGameHistory } from "../../lib/profileStorage";
import {
  playOptionClick,
  playNextQuestion,
  playCelebration,
} from "../../lib/audio";

function MultiplayerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const roomCodeParam = searchParams.get("room") || "";
  const roleParam = searchParams.get("role") || ""; // 'player1' or 'player2'

  const [roomCode, setRoomCode] = useState(roomCodeParam.toUpperCase());
  const [playerRole, setPlayerRole] = useState(roleParam || "player1");
  const [room, setRoom] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Local player quiz state
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [localAnswers, setLocalAnswers] = useState(Array(20).fill(null));
  const [isWritingPassage, setIsWritingPassage] = useState(false);
  const [myPassage, setMyPassage] = useState(null);
  const [isSubmittedLocally, setIsSubmittedLocally] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [showBreakdownDetails, setShowBreakdownDetails] = useState(false);
  const [hasSavedHistory, setHasSavedHistory] = useState(false);

  // Love Letter modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("letter"); // 'letter' or 'surprise'

  // Sync with localStorage profile
  const [myProfile, setMyProfile] = useState({ name: "Player", avatar: "🐱" });

  useEffect(() => {
    const savedName =
      localStorage.getItem("love-score-myname") ||
      (playerRole === "player1" ? "Partner 1" : "Partner 2");
    const savedAvatar =
      localStorage.getItem("love-score-myavatar") ||
      (playerRole === "player1" ? "🐱" : "🐰");
    setMyProfile({ name: savedName, avatar: savedAvatar });
  }, [playerRole]);

  // Subscribe to real-time updates for this room
  useEffect(() => {
    if (!roomCode) return;

    const unsubscribe = subscribeToRoom(
      roomCode,
      (updatedRoom) => {
        setRoom(updatedRoom);
        setErrorMsg("");

        // Check if role was inferred
        if (!roleParam && updatedRoom) {
          const myName = localStorage.getItem("love-score-myname");
          if (updatedRoom.player2?.name === myName) {
            setPlayerRole("player2");
          } else {
            setPlayerRole("player1");
          }
        }

        // If room was reset by replay action, reset local quiz state
        if (updatedRoom && updatedRoom.status === "ready" && !updatedRoom.result) {
          const myKey = playerRole === "player2" ? "player2" : "player1";
          if (!updatedRoom[myKey]?.completed && isSubmittedLocally) {
            setCurrentQIndex(0);
            setLocalAnswers(Array(20).fill(null));
            setIsSubmittedLocally(false);
            setHasSavedHistory(false);
          }
        }
      },
      (err) => {
        setErrorMsg(err.message || "Connection issue. Retrying in background... 💕");
      }
    );

    return () => {
      unsubscribe && unsubscribe();
    };
  }, [roomCode, roleParam, playerRole, isSubmittedLocally]);

  // Save result to History / Memory Wall when final score is computed
  useEffect(() => {
    if (room?.result && !hasSavedHistory) {
      setHasSavedHistory(true);
      playCelebration();

      saveGameHistory({
        mode: room.mode || "compatibility",
        score: room.result.score,
        tier: room.result.tier,
        name1: room.player1?.name || "Partner 1",
        name2: room.player2?.name || "Partner 2",
        avatar1: room.player1?.avatar || "🐱",
        avatar2: room.player2?.avatar || "🐰",
        roomCode,
      });
    }
  }, [room?.result, hasSavedHistory, roomCode]);

  // Active player and partner objects
  const myKey = playerRole === "player2" ? "player2" : "player1";
  const partnerKey = playerRole === "player2" ? "player1" : "player2";

  const me = room ? room[myKey] : null;
  const partner = room ? room[partnerKey] : null;
  const isPartnerConnected = Boolean(partner && partner.name);

  // Active question set: prioritize synchronized questions in room
  const activeQuestions =
    room?.questions && room.questions.length > 0
      ? room.questions
      : fallbackQuestions.slice(0, 20);
  const totalQuestions = activeQuestions.length;

  const activeModeObj = UNIFIED_MODULE;

  // Invite Links
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const inviteLink = `${origin}/multiplayer?room=${roomCode}&role=player2`;

  const handleCopyLink = async () => {
    try {
      playOptionClick();
      await navigator.clipboard.writeText(inviteLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
    } catch (e) {
      alert("Invitation link copied!");
    }
  };

  const handleCopyCode = async () => {
    try {
      playOptionClick();
      await navigator.clipboard.writeText(roomCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2200);
    } catch (e) {
      alert(`Room code: ${roomCode}`);
    }
  };

  const handleWhatsAppShare = () => {
    playOptionClick();
    const text = encodeURIComponent(
      `Hey my love 💕 Let's find our Love Score in "Forever Us ❤️"! Play with me from your phone here:\n${inviteLink}\n\n(Room Code: ${roomCode}) 🌹`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  // Option selection
  const currentQ = activeQuestions[currentQIndex] || activeQuestions[0];
  const selectedOption = localAnswers[currentQIndex];

  const handleSelectOption = (val) => {
    playOptionClick();
    const nextAnswers = [...localAnswers];
    nextAnswers[currentQIndex] = val;
    setLocalAnswers(nextAnswers);

    // Push real-time progress update so partner sees it
    if (roomCode) {
      updatePlayerProgress(roomCode, myKey, currentQIndex + 1, nextAnswers);
    }
  };

  const handleNext = async () => {
    if (!selectedOption) return;

    if (currentQIndex < totalQuestions - 1) {
      playNextQuestion();
      const nextIndex = currentQIndex + 1;
      setCurrentQIndex(nextIndex);
      updatePlayerProgress(roomCode, myKey, nextIndex, localAnswers);
    } else {
      // 20 questions completed! Transition to Partner Passage step
      playCelebration();
      setIsWritingPassage(true);
    }
  };

  const handlePassageSubmit = async (passageObj) => {
    setMyPassage(passageObj);
    setIsWritingPassage(false);
    setIsSubmittedLocally(true);
    const cleanAnswers = localAnswers
      .slice(0, totalQuestions)
      .map((a) => (a === null ? 1 : a));
    await completePlayerQuiz(roomCode, myKey, cleanAnswers, room, passageObj);
  };

  const handlePrev = () => {
    if (currentQIndex > 0) {
      playOptionClick();
      setCurrentQIndex((prev) => prev - 1);
    }
  };

  // Allow player to swap current question in multiplayer session
  const handleSwapQuestion = async () => {
    playCelebration();
    const updatedQs = swapQuestionInSet(activeQuestions, currentQIndex);
    const nextAnswers = [...localAnswers];
    nextAnswers[currentQIndex] = null;
    setLocalAnswers(nextAnswers);

    if (roomCode) {
      await updateRoomQuestions(roomCode, updatedQs);
      updatePlayerProgress(roomCode, myKey, currentQIndex, nextAnswers);
    }
  };

  // Allow player to clear / change active answer
  const handleChangeAnswer = () => {
    playOptionClick();
    const nextAnswers = [...localAnswers];
    nextAnswers[currentQIndex] = null;
    setLocalAnswers(nextAnswers);
    if (roomCode) {
      updatePlayerProgress(roomCode, myKey, currentQIndex, nextAnswers);
    }
  };

  // Jump to any question to review or change answer
  const handleJumpToQuestion = (targetIndex) => {
    playOptionClick();
    setCurrentQIndex(targetIndex);
    if (roomCode) {
      updatePlayerProgress(roomCode, myKey, targetIndex, localAnswers);
    }
  };

  const handleReplay = async () => {
    if (!roomCode) return;
    playOptionClick();
    await replayRoom(roomCode);
    setCurrentQIndex(0);
    setLocalAnswers(Array(20).fill(null));
    setIsSubmittedLocally(false);
    setHasSavedHistory(false);
  };

  const handleDownloadCard = () => {
    if (!room?.result) return;
    setDownloading(true);
    playOptionClick();

    try {
      const p1Name = room.player1?.name || "Partner 1";
      const p2Name = room.player2?.name || "Partner 2";
      const p1Avatar = room.player1?.avatar || "🐱";
      const p2Avatar = room.player2?.avatar || "🐰";
      const finalScore = room.result.score;
      const finalTier = room.result.tier;
      const finalMsg = room.result.message;

      const canvas = document.createElement("canvas");
      canvas.width = 800;
      canvas.height = 1000;
      const ctx = canvas.getContext("2d");

      // Pink-Red-Purple background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 800, 1000);
      bgGrad.addColorStop(0, "#FFE4EC");
      bgGrad.addColorStop(0.4, "#FFF0F5");
      bgGrad.addColorStop(0.8, "#F5D9FF");
      bgGrad.addColorStop(1, "#FFE5EE");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 800, 1000);

      // Crimson & Purple Border
      ctx.strokeStyle = "#FF0844";
      ctx.lineWidth = 10;
      ctx.strokeRect(30, 30, 740, 940);

      ctx.strokeStyle = "rgba(142, 5, 194, 0.4)";
      ctx.lineWidth = 3;
      ctx.strokeRect(45, 45, 710, 910);

      // Title
      ctx.textAlign = "center";
      ctx.fillStyle = "#FF0844";
      ctx.font = "bold 38px 'Segoe UI', Arial, sans-serif";
      ctx.fillText("💖 FOREVER US ❤️", 400, 120);

      // Names
      ctx.fillStyle = "#421028";
      ctx.font = "bold 44px 'Segoe UI', Arial, sans-serif";
      ctx.fillText(`${p1Name} ${p1Avatar}  ❤️  ${p2Name} ${p2Avatar}`, 400, 200);

      // Glowing Red Circle
      ctx.fillStyle = "#FF0844";
      ctx.beginPath();
      ctx.arc(400, 380, 120, 0, Math.PI * 2);
      ctx.fill();

      // Score
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 84px 'Segoe UI', Arial, sans-serif";
      ctx.fillText(`${finalScore}%`, 400, 410);

      // Tier
      ctx.fillStyle = "#421028";
      ctx.font = "bold 36px 'Segoe UI', Arial, sans-serif";
      ctx.fillText(finalTier, 400, 560);

      // Message
      ctx.fillStyle = "#7E3E5B";
      ctx.font = "italic 24px 'Segoe UI', Arial, sans-serif";
      ctx.fillText(`"${finalMsg}"`, 400, 620);

      // Categories
      ctx.textAlign = "left";
      ctx.font = "24px 'Segoe UI', Arial, sans-serif";
      ctx.fillStyle = "#421028";
      const entries = Object.entries(room.result.categories || {});
      entries.forEach(([cat, val], i) => {
        const y = 690 + i * 38;
        ctx.fillText(`${cat}:`, 130, y);
        ctx.textAlign = "right";
        ctx.fillStyle = "#FF0844";
        ctx.fillText(`${val}%`, 670, y);
        ctx.textAlign = "left";
        ctx.fillStyle = "#421028";
      });

      // Footer
      ctx.textAlign = "center";
      ctx.fillStyle = "#8E05C2";
      ctx.font = "bold 20px 'Segoe UI', Arial, sans-serif";
      ctx.fillText("Official Couple Compatibility Certificate 💕", 400, 930);

      const link = document.createElement("a");
      link.download = `ForeverUs-${p1Name}-${p2Name}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error(err);
    } finally {
      setDownloading(false);
    }
  };

  // 1. Invalid or Missing Room Code State
  if (!roomCode) {
    return (
      <div style={{ maxWidth: "560px", margin: "40px auto", textAlign: "center" }}>
        <div className="glass-card" style={{ padding: "40px 28px" }}>
          <AlertCircle size={48} color="var(--ruby-red)" style={{ margin: "0 auto 16px" }} />
          <h2 style={{ color: "var(--ruby-red)", marginBottom: "8px" }}>
            No Room Code Found
          </h2>
          <p style={{ color: "var(--text-muted)", marginBottom: "24px" }}>
            Please create a room or join with a valid 6-character code from your partner!
          </p>
          <Link href="/" className="heart-btn">
            Go to Home Screen
          </Link>
        </div>
      </div>
    );
  }

  // 2. Waiting for Partner Screen (Player 1 has created room, Player 2 hasn't joined yet)
  if (!isPartnerConnected && room?.status === "waiting") {
    return (
      <div style={{ maxWidth: "640px", margin: "20px auto", textAlign: "center" }}>
        <div
          className="glass-card"
          style={{
            padding: "40px 30px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
          }}
        >
          {/* Two Hearts Joining Animation */}
          <HeartsJoiningLoader
            title="Waiting For Your Partner 💕"
            subtitle="Send the invite link to your partner so both phones unite in real time!"
          />

          {/* Mode Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 16px",
              borderRadius: "9999px",
              background: "rgba(255, 8, 68, 0.1)",
              border: "1px solid rgba(255, 8, 68, 0.25)",
              color: "var(--ruby-red)",
              fontSize: "0.88rem",
              fontWeight: 700,
            }}
          >
            <span>Game Mode:</span>
            <span>{activeModeObj.icon} {activeModeObj.title}</span>
          </div>

          {/* Room Code Display Box */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "10px",
              width: "100%",
            }}
          >
            <span
              style={{
                fontSize: "0.82rem",
                fontWeight: 700,
                letterSpacing: "1px",
                color: "var(--text-muted)",
                textTransform: "uppercase",
              }}
            >
              Your Couple Room Code
            </span>
            <div
              onClick={handleCopyCode}
              className="room-code-badge"
              title="Click to copy room code"
              style={{ cursor: "pointer" }}
            >
              {roomCode}
            </div>
            <button
              onClick={handleCopyCode}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--ruby-red)",
                fontSize: "0.9rem",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer",
              }}
            >
              {copiedCode ? <Check size={16} /> : <Copy size={16} />}
              <span>{copiedCode ? "Code Copied! 💕" : "Tap to copy code"}</span>
            </button>
          </div>

          {/* Social Share Buttons */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              width: "100%",
              maxWidth: "380px",
            }}
          >
            {/* WhatsApp Share Button */}
            <button
              onClick={handleWhatsAppShare}
              className="heart-btn heart-btn-whatsapp"
              style={{ fontSize: "1.05rem", padding: "14px 28px" }}
            >
              <MessageCircle size={20} />
              <span>Share via WhatsApp</span>
            </button>

            {/* Copy Link Button */}
            <button
              onClick={handleCopyLink}
              className="heart-btn heart-btn-secondary"
              style={{ fontSize: "1rem", padding: "13px 26px" }}
            >
              {copiedLink ? <Check size={18} /> : <Share2 size={18} />}
              <span>{copiedLink ? "Link Copied! 💕" : "Copy Invitation Link"}</span>
            </button>
          </div>

          {/* Connection status tip */}
          <div
            style={{
              marginTop: "4px",
              fontSize: "0.85rem",
              color: "var(--text-muted)",
              background: "rgba(255, 255, 255, 0.7)",
              padding: "10px 18px",
              borderRadius: "16px",
              border: "1px solid var(--card-border-subtle)",
            }}
          >
            ✨ As soon as your partner opens the link on their phone, the game will automatically begin for both of you!
          </div>

          {/* Relationship Advice available before the quiz starts */}
          <div style={{ width: "100%", marginTop: "12px" }}>
            <RelationshipSuggestionBox
              name1={room?.player1?.name || "Partner 1"}
              name2="Partner 2"
              compact={true}
            />
          </div>
        </div>
      </div>
    );
  }

  // 3. Final Synchronous Results Screen (Both players completed!)
  if (room?.result) {
    const finalResult = room.result;
    const p1Name = room.player1?.name || "Partner 1";
    const p2Name = room.player2?.name || "Partner 2";
    const p1Avatar = room.player1?.avatar || "🐱";
    const p2Avatar = room.player2?.avatar || "🐰";

    const p1Ans = room.player1?.answers || [];
    const p2Ans = room.player2?.answers || [];

    // Matched questions
    const perfectMatches = [];
    const differences = [];
    activeQuestions.forEach((q, idx) => {
      const a1 = p1Ans[idx] || 1;
      const a2 = p2Ans[idx] || 1;
      if (a1 === a2) {
        perfectMatches.push({ q, text: q.options[a1 - 1]?.text });
      } else {
        differences.push({
          q,
          opt1: q.options[a1 - 1]?.text,
          opt2: q.options[a2 - 1]?.text,
        });
      }
    });

    return (
      <div
        style={{
          maxWidth: "760px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "28px",
        }}
      >
        <ConfettiHearts score={finalResult.score} />

        {/* Love Letter Modal */}
        <LoveLetterModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          name1={p1Name}
          name2={p2Name}
          score={finalResult.score}
          level={finalResult}
          mode={modalMode}
        />

        {/* ---------------- SYNCHRONIZED COUPLE STATUS CARD ---------------- */}
        <CoupleStatusCard
          score={finalResult.score}
          name1={p1Name}
          name2={p2Name}
          avatar1={p1Avatar}
          avatar2={p2Avatar}
          showQuizButton={false}
        />

        {/* Main Result Card with Glowing Red Heart */}
        <div
          className="glass-card glass-card-glow"
          style={{
            padding: "40px 28px",
            textAlign: "center",
            position: "relative",
            animation: "fadeInSlide 0.5s ease-out",
          }}
        >
          {/* Header Title */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 20px",
              background: "rgba(255, 8, 68, 0.14)",
              borderRadius: "9999px",
              color: "var(--ruby-red)",
              fontSize: "0.92rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginBottom: "12px",
            }}
          >
            <Sparkles size={16} />
            <span>{activeModeObj.title} Result</span>
            <Sparkles size={16} />
          </div>

          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 3rem)",
              color: "var(--text-dark)",
              margin: "0 0 6px",
              lineHeight: 1.2,
            }}
          >
            {p1Name} {p1Avatar} & {p2Name} {p2Avatar}
          </h1>

          <p style={{ fontSize: "1.05rem", color: "var(--text-muted)", margin: 0 }}>
            Here is your live couple compatibility score, calculated across both phones!
          </p>

          {/* LARGE GLOWING RED HEART */}
          <ScoreHeart
            targetScore={finalResult.score}
            tier={finalResult.tier}
            name1={p1Name}
            name2={p2Name}
            avatar1={p1Avatar}
            avatar2={p2Avatar}
          />

          {/* Romantic Message Card */}
          <div
            style={{
              maxWidth: "540px",
              margin: "18px auto 0",
              padding: "16px 22px",
              background: "rgba(255, 255, 255, 0.85)",
              borderRadius: "18px",
              border: "1.5px solid var(--card-border-subtle)",
            }}
          >
            <p
              style={{
                fontSize: "1.3rem",
                fontFamily: "var(--font-heading)",
                color: "var(--ruby-red)",
                margin: "0 0 4px",
              }}
            >
              "{finalResult.message}"
            </p>
            <span style={{ fontSize: "0.88rem", color: "var(--text-muted)" }}>
              Saved to your Relationship Memory Wall ❤️
            </span>
          </div>

          {/* Real-time sync badge */}
          <div
            style={{
              marginTop: "18px",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "0.82rem",
              color: "#128C7E",
              background: "rgba(37, 211, 102, 0.12)",
              border: "1px solid rgba(37, 211, 102, 0.35)",
              padding: "6px 14px",
              borderRadius: "9999px",
            }}
          >
            <span className="status-dot dot-green" />
            <span>Synchronized in real time across both phones ✅</span>
          </div>
        </div>

        {/* Exchanged Partner Suggestions Passage */}
        <SealedPassageReveal
          name1={p1Name}
          name2={p2Name}
          avatar1={p1Avatar}
          avatar2={p2Avatar}
          passage1={room.player1?.passage || room.result?.passage1}
          passage2={room.player2?.passage || room.result?.passage2}
        />

        {/* Personalized Couple Coach Insights */}
        <CoupleCoachInsights
          answers1={p1Ans}
          answers2={p2Ans}
          score={finalResult.score}
          questions={activeQuestions}
          name1={p1Name}
          name2={p2Name}
        />

        {/* 20 Questions Comparison Explorer */}
        <QuestionComparisonExplorer
          questions={activeQuestions}
          answers1={p1Ans}
          answers2={p2Ans}
          name1={p1Name}
          name2={p2Name}
          avatar1={p1Avatar}
          avatar2={p2Avatar}
        />

        {/* Romantic Bonus CTAs: Love Letter & Surprise Note */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "14px",
          }}
        >
          <button
            onClick={() => {
              playCelebration();
              setModalMode("letter");
              setModalOpen(true);
            }}
            className="glass-card"
            style={{
              padding: "18px 22px",
              display: "flex",
              alignItems: "center",
              gap: "14px",
              border: "2px solid var(--ruby-red)",
              background: "rgba(255, 255, 255, 0.85)",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, var(--ruby-red) 0%, #FF85B3 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFF",
              }}
            >
              <Mail size={22} />
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: "1.05rem", color: "var(--ruby-red)" }}>
                Generate Romantic Love Letter 💌
              </h4>
              <span style={{ fontSize: "0.84rem", color: "var(--text-muted)" }}>
                Personalized letter based on your answers
              </span>
            </div>
          </button>

          <button
            onClick={() => {
              playCelebration();
              setModalMode("surprise");
              setModalOpen(true);
            }}
            className="glass-card"
            style={{
              padding: "18px 22px",
              display: "flex",
              alignItems: "center",
              gap: "14px",
              border: "2px solid var(--royal-purple)",
              background: "rgba(255, 255, 255, 0.85)",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, var(--royal-purple) 0%, #FF0844 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFF",
              }}
            >
              <Gift size={22} />
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: "1.05rem", color: "var(--royal-purple)" }}>
                Reveal Surprise Love Note 🎁
              </h4>
              <span style={{ fontSize: "0.84rem", color: "var(--text-muted)" }}>
                Secret affectionate message & couple quote
              </span>
            </div>
          </button>
        </div>

        {/* Action Buttons: Replay Together, WhatsApp Share, Download, Profile */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "14px",
            flexWrap: "wrap",
          }}
        >
          {/* Replay Button */}
          <button
            onClick={handleReplay}
            className="heart-btn pulse-heart"
            style={{ padding: "14px 28px", fontSize: "1.05rem" }}
          >
            <RotateCcw size={18} />
            <span>Play Another Round ❤️</span>
          </button>

          {/* WhatsApp Share */}
          <button
            onClick={() => {
              const text = encodeURIComponent(
                `💖 ${p1Name} & ${p2Name} scored ${finalResult.score}% (${finalResult.tier}) on Forever Us ❤️! "${finalResult.message}" Test your love: ${typeof window !== "undefined" ? window.location.origin : ""}`
              );
              window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
            }}
            className="heart-btn heart-btn-whatsapp"
            style={{ padding: "14px 26px", fontSize: "1rem" }}
          >
            <MessageCircle size={18} />
            <span>Share on WhatsApp</span>
          </button>

          {/* Download Card */}
          <button
            onClick={handleDownloadCard}
            disabled={downloading}
            className="heart-btn heart-btn-secondary"
            style={{ padding: "14px 24px", fontSize: "1rem" }}
          >
            <Download size={18} />
            <span>{downloading ? "Preparing..." : "Download Result Card"}</span>
          </button>

          {/* Profile link */}
          <Link
            href="/profile"
            className="heart-btn heart-btn-secondary"
            style={{ padding: "14px 22px", fontSize: "1rem" }}
          >
            <span>View Memory Wall 🌹</span>
          </Link>
        </div>

        {/* Category Breakdown */}
        <div className="glass-card" style={{ padding: "32px 28px" }}>
          <h3 style={{ fontSize: "1.7rem", color: "var(--ruby-red)", margin: "0 0 6px" }}>
            Category Alignment 📊
          </h3>
          <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", margin: "0 0 16px" }}>
            Detailed alignment between {p1Name} and {p2Name}
          </p>

          <CategoryBreakdown categories={finalResult.categories || {}} />
        </div>

        {/* Where You Matched 100% */}
        <div className="glass-card" style={{ padding: "32px 28px" }}>
          <h3 style={{ fontSize: "1.7rem", color: "var(--ruby-red)", marginBottom: "6px" }}>
            Where You Matched 100% 💞
          </h3>
          <p style={{ fontSize: "0.92rem", color: "var(--text-muted)", marginBottom: "20px" }}>
            You both picked the exact same answers on {perfectMatches.length} out of {totalQuestions} questions!
          </p>

          {perfectMatches.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {perfectMatches.map(({ q, text }) => (
                <div
                  key={q.id}
                  style={{
                    background: "rgba(255, 255, 255, 0.8)",
                    borderRadius: "16px",
                    padding: "14px 18px",
                    border: "1.5px solid rgba(255, 8, 68, 0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "14px",
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "1.3rem" }}>{q.categoryIcon}</span>
                    <div>
                      <h5 style={{ margin: 0, fontSize: "0.96rem", color: "var(--text-dark)" }}>
                        {q.question}
                      </h5>
                      <span style={{ fontSize: "0.82rem", color: "var(--ruby-red)", fontWeight: 600 }}>
                        Both chose: "{text}"
                      </span>
                    </div>
                  </div>
                  <div
                    style={{
                      background: "rgba(255, 8, 68, 0.14)",
                      color: "var(--ruby-red)",
                      fontWeight: 700,
                      fontSize: "0.82rem",
                      padding: "4px 12px",
                      borderRadius: "9999px",
                    }}
                  >
                    100% Match ✨
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: "var(--text-muted)", fontStyle: "italic" }}>
              Opposites attract! While your individual choices differed, your composite chemistry is unique and beautiful! 🌸
            </p>
          )}

          {/* Differences Dropdown */}
          {differences.length > 0 && (
            <div style={{ marginTop: "24px" }}>
              <button
                onClick={() => setShowBreakdownDetails(!showBreakdownDetails)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--royal-purple)",
                  fontWeight: 600,
                  fontSize: "0.92rem",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  textDecoration: "underline",
                }}
              >
                {showBreakdownDetails
                  ? "Hide playful differences ▲"
                  : `View where your perspectives differed (${differences.length} questions) ▼`}
              </button>

              {showBreakdownDetails && (
                <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                  {differences.map(({ q, opt1, opt2 }) => (
                    <div
                      key={q.id}
                      style={{
                        background: "rgba(255, 255, 255, 0.7)",
                        borderRadius: "16px",
                        padding: "14px 18px",
                        border: "1px solid var(--card-border-subtle)",
                        fontSize: "0.88rem",
                      }}
                    >
                      <strong style={{ color: "var(--text-dark)", display: "block", marginBottom: "6px" }}>
                        {q.categoryIcon} #{q.id}: {q.question}
                      </strong>
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px", color: "var(--text-muted)" }}>
                        <div>👑 <strong>{p1Name}:</strong> {opt1}</div>
                        <div>💎 <strong>{p2Name}:</strong> {opt2}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // 3b. Partner Passage Writing Step
  if (isWritingPassage) {
    return (
      <div style={{ maxWidth: "760px", margin: "20px auto" }}>
        <PartnerPassageBox
          authorName={myProfile.name}
          recipientName={partner?.name || "My Partner"}
          authorAvatar={myProfile.avatar}
          recipientAvatar={partner?.avatar || "🐰"}
          onSubmitPassage={handlePassageSubmit}
          isLastStep={true}
        />
      </div>
    );
  }

  // 4. Waiting for Partner to Finish (I have finished, but partner hasn't completed yet)
  if (isSubmittedLocally || (me && me.completed)) {
    const partnerName = partner?.name || "Partner";
    const partnerProgress = partner?.progress || 0;

    return (
      <div style={{ maxWidth: "600px", margin: "30px auto", textAlign: "center" }}>
        <div
          className="glass-card"
          style={{
            padding: "44px 32px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "22px",
          }}
        >
          {/* Two Hearts Joining Loader */}
          <HeartsJoiningLoader
            title={`Waiting for ${partnerName}... 💕`}
            subtitle={`Your answers are securely locked in! ${partnerName} is on question ${partnerProgress}/${totalQuestions}.`}
          />

          {/* Real-time Partner Progress Bar */}
          <div style={{ width: "100%", maxWidth: "420px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.85rem",
                color: "var(--text-muted)",
                marginBottom: "6px",
              }}
            >
              <span>{partnerName}'s Progress</span>
              <span>{partnerProgress} of {totalQuestions} questions</span>
            </div>
            <div
              style={{
                width: "100%",
                height: "12px",
                background: "rgba(255, 133, 179, 0.25)",
                borderRadius: "9999px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${(partnerProgress / totalQuestions) * 100}%`,
                  height: "100%",
                  background: "linear-gradient(90deg, #FF0844 0%, #8E05C2 100%)",
                  borderRadius: "9999px",
                  transition: "width 0.5s ease",
                }}
              />
            </div>
          </div>

          <p style={{ fontSize: "0.88rem", color: "var(--text-subtle)", fontStyle: "italic", margin: 0 }}>
            ✨ As soon as {partnerName} answers question {totalQuestions}, your shared Love Score will instantly appear on both phones!
          </p>
        </div>
      </div>
    );
  }

  // 5. Active Quiz View (Player answering questions from their phone)
  const partnerName = partner?.name || "Partner";
  const partnerProgress = partner?.progress || 0;

  return (
    <div
      style={{
        maxWidth: "760px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
      }}
    >
      {/* Top Multi-Device Status Banner */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px",
          background: "rgba(255, 255, 255, 0.8)",
          padding: "10px 18px",
          borderRadius: "20px",
          border: "1px solid var(--card-border-subtle)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span className="status-dot dot-green" />
          <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--ruby-red)" }}>
            Playing with: {partner?.avatar} {partnerName}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span
            style={{
              fontSize: "0.78rem",
              background: "rgba(255, 8, 68, 0.1)",
              color: "var(--ruby-red)",
              padding: "2px 8px",
              borderRadius: "9999px",
              fontWeight: 700,
            }}
          >
            {activeModeObj.icon} {activeModeObj.title}
          </span>
          <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
            Partner at: <strong>Q{partnerProgress + 1}/{totalQuestions}</strong>
          </span>
        </div>
      </div>

      {/* Pre-Quiz & In-Quiz Relationship Suggestion Box */}
      <RelationshipSuggestionBox
        name1={myProfile.name}
        name2={partnerName}
        compact={true}
      />

      {/* Progress Bar */}
      <HeartProgress
        total={totalQuestions}
        current={currentQIndex}
        category={currentQ.category}
        categoryIcon={currentQ.categoryIcon}
        personName={`${myProfile.name} ${myProfile.avatar}`}
        personNumber={playerRole === "player1" ? 1 : 2}
      />

      {/* Interactive Question Card */}
      <QuestionCard
        questionData={currentQ}
        selectedOption={selectedOption}
        onSelectOption={handleSelectOption}
        onNext={handleNext}
        onPrev={handlePrev}
        onSwapQuestion={handleSwapQuestion}
        onChangeAnswer={handleChangeAnswer}
        isFirstQuestion={currentQIndex === 0}
        isLastQuestion={currentQIndex === totalQuestions - 1}
        name1={room?.player1?.name || myProfile.name}
        name2={room?.player2?.name || "Partner 2"}
        avatar1={room?.player1?.avatar || "🐱"}
        avatar2={room?.player2?.avatar || "🐰"}
        activePlayer={playerRole === "player1" ? 1 : 2}
      />

      {/* Question Quick Jump & Change Answer Navigator (1–20) */}
      <div
        className="glass-card"
        style={{
          padding: "16px 20px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          borderRadius: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          <span
            style={{
              fontSize: "0.86rem",
              fontWeight: 700,
              color: "var(--ruby-red)",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span>🎯</span>
            <span>Question Navigator &amp; Review (Tap to review or change any answer)</span>
          </span>
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>
            {localAnswers.filter((a) => a !== null).length}/{totalQuestions} Answered
          </span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(30px, 1fr))",
            gap: "7px",
          }}
        >
          {activeQuestions.map((_, idx) => {
            const isCurrent = idx === currentQIndex;
            const isAnswered = localAnswers[idx] !== null && localAnswers[idx] !== undefined;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleJumpToQuestion(idx)}
                title={`Jump to Question #${idx + 1} to review or change answer`}
                style={{
                  height: "36px",
                  borderRadius: "10px",
                  border: isCurrent
                    ? "2px solid var(--ruby-red)"
                    : isAnswered
                    ? "1px solid rgba(255, 46, 116, 0.4)"
                    : "1px dashed rgba(255, 133, 179, 0.4)",
                  background: isCurrent
                    ? "linear-gradient(135deg, #FF0844 0%, #FF2E74 100%)"
                    : isAnswered
                    ? "rgba(255, 46, 116, 0.12)"
                    : "rgba(255, 255, 255, 0.6)",
                  color: isCurrent ? "#FFFFFF" : isAnswered ? "var(--ruby-red)" : "var(--text-muted)",
                  fontWeight: isCurrent || isAnswered ? 800 : 500,
                  fontSize: "0.82rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: isCurrent ? "0 4px 12px rgba(255, 8, 68, 0.35)" : "none",
                  transition: "all 0.2s ease",
                }}
              >
                {isAnswered && !isCurrent ? `✓${idx + 1}` : idx + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function MultiplayerPage() {
  return (
    <Suspense
      fallback={
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <HeartsJoiningLoader
            title="Connecting to Couple Room..."
            subtitle="Preparing your shared romantic experience ❤️"
          />
        </div>
      }
    >
      <MultiplayerContent />
    </Suspense>
  );
}
