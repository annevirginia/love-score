"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Heart, ArrowRight, Sparkles, Smartphone, EyeOff, Feather } from "lucide-react";
import HeartProgress from "../../components/HeartProgress";
import QuestionCard from "../../components/QuestionCard";
import HeartsJoiningLoader from "../../components/HeartsJoiningLoader";
import PartnerPassageBox from "../../components/PartnerPassageBox";
import RelationshipSuggestionBox from "../../components/RelationshipSuggestionBox";
import { getQuestionsForMode, calculateSmartScore, swapQuestionInSet } from "../../lib/gameEngine";
import { saveGameHistory } from "../../lib/profileStorage";
import { playOptionClick, playNextQuestion, playCelebration } from "../../lib/audio";

export default function QuizPage() {
  const router = useRouter();

  // Participant info
  const [name1, setName1] = useState("Person 1");
  const [name2, setName2] = useState("Person 2");
  const [avatar1, setAvatar1] = useState("🐱");
  const [avatar2, setAvatar2] = useState("🐻");
  const [gameMode, setGameMode] = useState("forever_us_20");

  // Questions for this session (20 questions)
  const [questions, setQuestions] = useState([]);

  // Quiz state
  const [turn, setTurn] = useState(1); // 1 or 2
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers1, setAnswers1] = useState([]);
  const [answers2, setAnswers2] = useState([]);

  // Secret Passages & Suggestions State
  const [passage1, setPassage1] = useState(null);
  const [passage2, setPassage2] = useState(null);
  const [isWritingPassage, setIsWritingPassage] = useState(false);

  // Flow states
  const [isHandoff, setIsHandoff] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const saved1 = localStorage.getItem("love-score-name1");
    const saved2 = localStorage.getItem("love-score-name2");
    if (!saved1 || !saved2) {
      router.push("/");
      return;
    }
    setName1(saved1);
    setName2(saved2);
    setAvatar1(localStorage.getItem("love-score-avatar1") || "🐱");
    setAvatar2(localStorage.getItem("love-score-avatar2") || "🐻");

    const mode = localStorage.getItem("love-score-mode") || "forever_us_20";
    setGameMode(mode);

    // Load exactly 20 questions
    const generatedQs = getQuestionsForMode(mode, 20);
    setQuestions(generatedQs);
    setAnswers1(Array(generatedQs.length).fill(null));
    setAnswers2(Array(generatedQs.length).fill(null));
  }, [router]);

  if (!questions || questions.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <HeartsJoiningLoader
          title="Preparing 20 Romantic Questions..."
          subtitle="Assembling multi-format couple challenges and suggestion cards ❤️"
        />
      </div>
    );
  }

  const totalQuestions = questions.length;
  const currentQ = questions[currentQIndex] || questions[0];

  // Active answer for current turn and question
  const currentAnswers = turn === 1 ? answers1 : answers2;
  const selectedOption = currentAnswers[currentQIndex];

  const handleSelectOption = (val) => {
    playOptionClick();
    if (turn === 1) {
      const updated = [...answers1];
      updated[currentQIndex] = val;
      setAnswers1(updated);
    } else {
      const updated = [...answers2];
      updated[currentQIndex] = val;
      setAnswers2(updated);
    }
  };

  // Allow player to swap current question for another one from question bank
  const handleSwapQuestion = () => {
    playCelebration();
    const updatedQs = swapQuestionInSet(questions, currentQIndex);
    setQuestions(updatedQs);
    // Clear answer for this question slot so player can answer fresh
    if (turn === 1) {
      const updated = [...answers1];
      updated[currentQIndex] = null;
      setAnswers1(updated);
    } else {
      const updated = [...answers2];
      updated[currentQIndex] = null;
      setAnswers2(updated);
    }
  };

  // Allow clearing answer so player can re-choose
  const handleChangeAnswer = () => {
    playOptionClick();
    if (turn === 1) {
      const updated = [...answers1];
      updated[currentQIndex] = null;
      setAnswers1(updated);
    } else {
      const updated = [...answers2];
      updated[currentQIndex] = null;
      setAnswers2(updated);
    }
  };

  // Allow jumping to any question (1 to 20) to change answer
  const handleJumpToQuestion = (idx) => {
    playOptionClick();
    setCurrentQIndex(idx);
  };

  const handleNext = () => {
    if (!selectedOption) return;

    if (currentQIndex < totalQuestions - 1) {
      playNextQuestion();
      setCurrentQIndex((prev) => prev + 1);
    } else {
      // Completed all 20 questions for this turn! Transition to Partner Passage step
      playCelebration();
      setIsWritingPassage(true);
    }
  };

  const handlePrev = () => {
    if (currentQIndex > 0) {
      playOptionClick();
      setCurrentQIndex((prev) => prev - 1);
    }
  };

  // Turn 1 completes passage -> handoff to Turn 2
  const handlePassage1Submit = (passageObj) => {
    setPassage1(passageObj);
    setIsWritingPassage(false);
    setIsHandoff(true);
  };

  // Turn 2 completes passage -> submit full quiz
  const handlePassage2Submit = (passageObj) => {
    setPassage2(passageObj);
    setIsWritingPassage(false);
    handleSubmitQuiz(passage1, passageObj);
  };

  const handleStartPerson2 = () => {
    playCelebration();
    setIsHandoff(false);
    setTurn(2);
    setCurrentQIndex(0);
    setIsWritingPassage(false);
  };

  const handleSubmitQuiz = async (finalP1, finalP2) => {
    setIsSubmitting(true);

    const clean1 = answers1.map((a) => (a === null ? 1 : a));
    const clean2 = answers2.map((a) => (a === null ? 1 : a));

    // Calculate smart score across all 20 questions
    const resultData = calculateSmartScore(questions, clean1, clean2);

    const fullResult = {
      ...resultData,
      name1,
      name2,
      avatar1,
      avatar2,
      mode: gameMode,
      answers1: clean1,
      answers2: clean2,
      questions,
      passage1: finalP1 || passage1,
      passage2: finalP2 || passage2,
    };

    localStorage.setItem("love-score-result", JSON.stringify(fullResult));
    saveGameHistory(fullResult);

    setTimeout(() => {
      router.push("/result");
    }, 1500);
  };

  // 1. Calculation & Loading screen
  if (isSubmitting) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          textAlign: "center",
        }}
      >
        <div
          className="glass-card"
          style={{
            padding: "48px 36px",
            maxWidth: "520px",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <HeartsJoiningLoader
            title="Unsealing Your Love Score..."
            subtitle={`Analyzing all 20 questions and sealing your secret passages for ${name1} and ${name2}! ✨`}
          />
        </div>
      </div>
    );
  }

  // 2. Secret Partner Passage Writing Step
  if (isWritingPassage) {
    return (
      <div style={{ maxWidth: "760px", margin: "0 auto" }}>
        {turn === 1 ? (
          <PartnerPassageBox
            authorName={name1}
            recipientName={name2}
            authorAvatar={avatar1}
            recipientAvatar={avatar2}
            onSubmitPassage={handlePassage1Submit}
            isLastStep={false}
          />
        ) : (
          <PartnerPassageBox
            authorName={name2}
            recipientName={name1}
            authorAvatar={avatar2}
            recipientAvatar={avatar1}
            onSubmitPassage={handlePassage2Submit}
            isLastStep={true}
          />
        )}
      </div>
    );
  }

  // 3. Romantic Handoff / Pass the Phone screen
  if (isHandoff) {
    return (
      <div
        style={{
          maxWidth: "600px",
          margin: "20px auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <div
          className="glass-card"
          style={{
            padding: "40px 32px",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px",
            animation: "fadeInSlide 0.4s ease-out",
          }}
        >
          {/* Milestone icon */}
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--ruby-red) 0%, var(--royal-purple) 100%)",
              color: "#FFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 10px 25px rgba(255, 8, 68, 0.4)",
            }}
          >
            <Smartphone size={40} className="beating-heart" />
          </div>

          <div>
            <span
              style={{
                display: "inline-block",
                padding: "6px 16px",
                background: "rgba(255, 8, 68, 0.14)",
                borderRadius: "9999px",
                color: "var(--ruby-red)",
                fontWeight: 700,
                fontSize: "0.88rem",
                textTransform: "uppercase",
                letterSpacing: "1px",
                marginBottom: "10px",
              }}
            >
              🌸 Halfway Done!
            </span>
            <h2
              style={{
                fontSize: "2.1rem",
                color: "var(--text-dark)",
                marginBottom: "8px",
              }}
            >
              Pass The Device to {name2}!
            </h2>
            <p style={{ fontSize: "1.05rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
              Awesome job, <strong>{name1}</strong> {avatar1}! Your 20 answers and secret passage for {name2} have been wax-sealed secretly.
            </p>
          </div>

          <div
            style={{
              background: "rgba(255, 255, 255, 0.85)",
              border: "1.5px dashed var(--ruby-red)",
              borderRadius: "18px",
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              gap: "14px",
              textAlign: "left",
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                background: "rgba(255, 8, 68, 0.14)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--ruby-red)",
                flexShrink: 0,
              }}
            >
              <EyeOff size={22} />
            </div>
            <p style={{ margin: 0, fontSize: "0.92rem", color: "var(--text-dark)" }}>
              <strong>No peeking rule!</strong> {name2} will now answer the exact same 20 questions and write their secret passage to test genuine couple alignment.
            </p>
          </div>

          <button
            onClick={handleStartPerson2}
            className="heart-btn pulse-heart"
            style={{
              fontSize: "1.15rem",
              padding: "16px 40px",
              width: "100%",
              maxWidth: "340px",
            }}
          >
            <span>I&apos;m {name2} {avatar2}, Let&apos;s Go!</span>
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    );
  }

  // 4. Main Quiz View: Questions
  return (
    <div
      style={{
        maxWidth: "760px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      {/* Pre-quiz / Active Relationship Suggestion Box */}
      <RelationshipSuggestionBox
        name1={name1}
        name2={name2}
        compact={true}
      />

      {/* Progress Bar */}
      <HeartProgress
        total={totalQuestions}
        current={currentQIndex}
        category={currentQ.category}
        categoryIcon={currentQ.categoryIcon}
        personName={turn === 1 ? `${name1} ${avatar1}` : `${name2} ${avatar2}`}
        personNumber={turn}
      />

      {/* Active Question Card */}
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
        name1={name1}
        name2={name2}
        avatar1={avatar1}
        avatar2={avatar2}
        activePlayer={turn}
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
            {currentAnswers.filter((a) => a !== null).length}/{totalQuestions} Answered
          </span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(30px, 1fr))",
            gap: "7px",
          }}
        >
          {questions.map((_, idx) => {
            const isCurrent = idx === currentQIndex;
            const isAnswered = currentAnswers[idx] !== null && currentAnswers[idx] !== undefined;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleJumpToQuestion(idx)}
                title={`Jump to Question #${idx + 1} to change answer or swap question`}
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
