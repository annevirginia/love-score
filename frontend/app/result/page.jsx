"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Heart,
  Share2,
  RotateCcw,
  Download,
  Check,
  Sparkles,
  Copy,
  Mail,
  Gift,
  ArrowRight,
} from "lucide-react";
import ScoreHeart from "../../components/ScoreHeart";
import ConfettiHearts from "../../components/ConfettiHearts";
import CategoryBreakdown from "../../components/CategoryBreakdown";
import LoveLetterModal from "../../components/LoveLetterModal";
import SealedPassageReveal from "../../components/SealedPassageReveal";
import CoupleCoachInsights from "../../components/CoupleCoachInsights";
import QuestionComparisonExplorer from "../../components/QuestionComparisonExplorer";
import CoupleStatusCard from "../../components/CoupleStatusCard";
import fallbackQuestions from "../../data/questions.json";
import { UNIFIED_MODULE } from "../../lib/gameEngine";
import { playOptionClick, playCelebration } from "../../lib/audio";

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Love letter modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("letter"); // 'letter' or 'surprise'

  useEffect(() => {
    const raw = localStorage.getItem("love-score-result");
    if (!raw) {
      router.push("/");
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      setResult(parsed);
      playCelebration();
    } catch (e) {
      router.push("/");
    }
  }, [router]);

  if (!result) {
    return null;
  }

  const {
    name1 = "Person 1",
    name2 = "Person 2",
    avatar1 = "🐱",
    avatar2 = "🐰",
    score = 82,
    tier = "Perfect Love Birds 💕",
    message = "Incredible chemistry and deep emotional harmony! You bring out the best in each other.",
    categories = {},
    answers1 = [],
    answers2 = [],
    questions = fallbackQuestions.slice(0, 20),
    passage1 = null,
    passage2 = null,
  } = result;

  const activeQuestions = questions.length > 0 ? questions : fallbackQuestions.slice(0, 20);

  const handleShare = async () => {
    playOptionClick();
    const shareText = `💖 ${name1} & ${name2} took the Forever Us 20-Question Couple Journey and scored ${score}% (${tier})! "${message}" Discover your compatibility & exchange secret love suggestions:`;
    const shareUrl = window.location.origin;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${name1} & ${name2}'s Love Score: ${score}%`,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch (e) {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      alert("Link copied to clipboard!");
    }
  };

  const handleDownloadCard = () => {
    setDownloading(true);
    playOptionClick();

    try {
      // Draw high-resolution certificate on offscreen canvas
      const canvas = document.createElement("canvas");
      canvas.width = 800;
      canvas.height = 1100;
      const ctx = canvas.getContext("2d");

      // Romantic background
      const bgGrad = ctx.createLinearGradient(0, 0, 800, 1100);
      bgGrad.addColorStop(0, "#FFE4EC");
      bgGrad.addColorStop(0.35, "#FFF0F5");
      bgGrad.addColorStop(0.75, "#F7E1FF");
      bgGrad.addColorStop(1, "#FFE5EE");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 800, 1100);

      // Certificate borders
      ctx.strokeStyle = "#FF0844";
      ctx.lineWidth = 10;
      ctx.strokeRect(30, 30, 740, 1040);

      ctx.strokeStyle = "rgba(142, 5, 194, 0.4)";
      ctx.lineWidth = 3;
      ctx.strokeRect(45, 45, 710, 1010);

      // Header
      ctx.textAlign = "center";
      ctx.fillStyle = "#FF0844";
      ctx.font = "bold 38px 'Segoe UI', Arial, sans-serif";
      ctx.fillText("💖 FOREVER US ❤️", 400, 110);

      ctx.fillStyle = "#8E05C2";
      ctx.font = "bold 20px 'Segoe UI', Arial, sans-serif";
      ctx.fillText("OFFICIAL 20-QUESTION COUPLE COMPATIBILITY CERTIFICATE", 400, 145);

      // Couple Names
      ctx.fillStyle = "#421028";
      ctx.font = "bold 44px 'Segoe UI', Arial, sans-serif";
      ctx.fillText(`${name1} ${avatar1}  ❤️  ${name2} ${avatar2}`, 400, 215);

      // Glowing Score Circle
      ctx.fillStyle = "#FF0844";
      ctx.beginPath();
      ctx.arc(400, 370, 110, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 78px 'Segoe UI', Arial, sans-serif";
      ctx.fillText(`${score}%`, 400, 400);

      // Tier & Message
      ctx.fillStyle = "#421028";
      ctx.font = "bold 34px 'Segoe UI', Arial, sans-serif";
      ctx.fillText(tier, 400, 530);

      ctx.fillStyle = "#7E3E5B";
      ctx.font = "italic 22px 'Segoe UI', Arial, sans-serif";
      ctx.fillText(`"${message}"`, 400, 580);

      // Exchanged Suggestions Snippet
      const snippet1 = passage1?.text ? passage1.text.slice(0, 85) + "..." : "";
      if (snippet1) {
        ctx.fillStyle = "rgba(255, 8, 68, 0.08)";
        ctx.fillRect(80, 620, 640, 90);
        ctx.strokeStyle = "#FF85B3";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(80, 620, 640, 90);

        ctx.fillStyle = "#D80032";
        ctx.font = "bold 18px 'Segoe UI', Arial, sans-serif";
        ctx.textAlign = "left";
        ctx.fillText(`💌 Partner Suggestion Excerpt (${name1} ➔ ${name2}):`, 100, 650);

        ctx.fillStyle = "#421028";
        ctx.font = "italic 16px 'Segoe UI', Arial, sans-serif";
        ctx.fillText(`"${snippet1}"`, 100, 685);
      }

      // Category breakdown
      ctx.textAlign = "left";
      ctx.font = "bold 20px 'Segoe UI', Arial, sans-serif";
      ctx.fillStyle = "#421028";
      const entries = Object.entries(categories);
      entries.forEach(([cat, val], i) => {
        const y = 745 + i * 36;
        ctx.fillText(`${cat}:`, 110, y);
        ctx.textAlign = "right";
        ctx.fillStyle = "#FF0844";
        ctx.fillText(`${val}%`, 690, y);
        ctx.textAlign = "left";
        ctx.fillStyle = "#421028";
      });

      // Footer
      ctx.textAlign = "center";
      ctx.fillStyle = "#8E05C2";
      ctx.font = "bold 18px 'Segoe UI', Arial, sans-serif";
      ctx.fillText("Generated with Eternal Love on Forever Us ❤️", 400, 1030);

      const link = document.createElement("a");
      link.download = `ForeverUs-${name1}-${name2}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Card generation error:", err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "780px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "28px",
      }}
    >
      {/* Heart Confetti if score >= 75% */}
      <ConfettiHearts score={score} />

      {/* Love Letter Modal */}
      <LoveLetterModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        name1={name1}
        name2={name2}
        score={score}
        level={result}
        mode={modalMode}
      />

      {/* ---------------- DEDICATED COUPLE STATUS CARD ---------------- */}
      <CoupleStatusCard
        score={score}
        name1={name1}
        name2={name2}
        avatar1={avatar1}
        avatar2={avatar2}
        showQuizButton={false}
      />

      {/* Main Result Card */}
      <div
        className="glass-card glass-card-glow"
        style={{
          padding: "40px 28px",
          textAlign: "center",
          position: "relative",
          animation: "fadeInSlide 0.5s ease-out",
        }}
      >
        {/* Couple Title */}
        <div style={{ marginBottom: "16px" }}>
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
            <span>Forever Us: 20-Question Compatibility</span>
            <Sparkles size={16} />
          </div>

          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 2.9rem)",
              color: "var(--text-dark)",
              margin: "0 0 6px",
              lineHeight: 1.2,
            }}
          >
            {name1} {avatar1} &amp; {name2} {avatar2}
          </h1>
          <p style={{ fontSize: "1.05rem", color: "var(--text-muted)", margin: 0 }}>
            Here is your official Couple Compatibility Score across all 20 questions!
          </p>
        </div>

        {/* Big Animated Glowing Red Score Heart */}
        <ScoreHeart
          targetScore={score}
          tier={tier}
          name1={name1}
          name2={name2}
          avatar1={avatar1}
          avatar2={avatar2}
        />

        {/* Romantic Tier Message */}
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
            &ldquo;{message}&rdquo;
          </p>
          <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
            Saved to your Relationship Memory Wall &amp; History! 🌹
          </span>
        </div>
      </div>

      {/* ---------------- 1. SEALED PASSAGE REVEAL SECTION ---------------- */}
      <SealedPassageReveal
        name1={name1}
        name2={name2}
        avatar1={avatar1}
        avatar2={avatar2}
        passage1={passage1}
        passage2={passage2}
      />

      {/* ---------------- 2. AI COUPLE COACH INSIGHTS ---------------- */}
      <CoupleCoachInsights
        answers1={answers1}
        answers2={answers2}
        score={score}
        questions={activeQuestions}
        name1={name1}
        name2={name2}
      />

      {/* ---------------- 3. ACTION BUTTONS ---------------- */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "14px",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() => {
            playOptionClick();
            const text = encodeURIComponent(
              `💖 ${name1} & ${name2} took the Forever Us 20-Question Quiz and scored ${score}% (${tier})! "${message}" Check out your compatibility: ${typeof window !== "undefined" ? window.location.origin : ""}`
            );
            window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
          }}
          className="heart-btn heart-btn-whatsapp"
          style={{ padding: "14px 26px", fontSize: "1rem" }}
        >
          <Share2 size={18} />
          <span>Share via WhatsApp</span>
        </button>

        <button
          onClick={handleShare}
          className="heart-btn pulse-heart"
          style={{ padding: "14px 26px", fontSize: "1rem" }}
        >
          {copied ? <Check size={18} /> : <Copy size={18} />}
          <span>{copied ? "Link Copied! 💕" : "Copy Link"}</span>
        </button>

        <button
          onClick={handleDownloadCard}
          disabled={downloading}
          className="heart-btn heart-btn-secondary"
          style={{ padding: "14px 24px", fontSize: "1rem" }}
        >
          <Download size={18} />
          <span>{downloading ? "Preparing Card..." : "Download Keepsake Card"}</span>
        </button>

        <Link
          href="/profile"
          className="heart-btn heart-btn-secondary"
          style={{ padding: "14px 22px", fontSize: "1rem" }}
        >
          <span>Memory Wall 🌹</span>
        </Link>

        <Link
          href="/"
          className="heart-btn heart-btn-secondary"
          style={{ padding: "14px 22px", fontSize: "1rem" }}
        >
          <RotateCcw size={18} />
          <span>Play Another Round</span>
        </Link>
      </div>

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
              Secret affectionate message &amp; couple quote
            </span>
          </div>
        </button>
      </div>

      {/* ---------------- 4. 20-QUESTION ANSWER COMPARISON ---------------- */}
      <QuestionComparisonExplorer
        questions={activeQuestions}
        answers1={answers1}
        answers2={answers2}
        name1={name1}
        name2={name2}
        avatar1={avatar1}
        avatar2={avatar2}
      />

      {/* ---------------- 5. 5-DIMENSION CATEGORY BREAKDOWN ---------------- */}
      <div className="glass-card" style={{ padding: "32px 28px" }}>
        <h3
          style={{
            fontSize: "1.7rem",
            color: "var(--ruby-red)",
            margin: "0 0 6px",
          }}
        >
          Relationship Dimensions Alignment 📊
        </h3>
        <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", margin: "0 0 16px" }}>
          Calculated across all 20 questions in your couple journey
        </p>

        <CategoryBreakdown categories={categories} />
      </div>

      {/* Footer Encouragement */}
      <div style={{ textAlign: "center", padding: "10px 0" }}>
        <p style={{ fontSize: "1.1rem", fontFamily: "var(--font-heading)", color: "var(--ruby-red)" }}>
          Made with all the love in the universe 💖
        </p>
      </div>
    </div>
  );
}
