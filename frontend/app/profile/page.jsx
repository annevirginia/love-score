"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Heart,
  Calendar,
  Sparkles,
  Trophy,
  Trash2,
  ArrowLeft,
  Flame,
  Award,
  Edit3,
  Check,
  RotateCcw,
} from "lucide-react";
import {
  getCoupleProfile,
  saveCoupleProfile,
  getDaysUntilAnniversary,
  getGameHistory,
  clearGameHistory,
  getUnlockedBadges,
  ALL_BADGES,
  getCoupleStreak,
} from "../../lib/profileStorage";

const AVATARS = ["🐱", "🐰", "🐼", "🦊", "🐶", "🐻", "🐨", "🦄", "🐧", "🐯"];

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name1: "Partner 1",
    name2: "Partner 2",
    avatar1: "🐱",
    avatar2: "🐰",
    nickname: "Forever Us",
    anniversary: "",
    colorTheme: "rose-gold",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [history, setHistory] = useState([]);
  const [unlockedBadges, setUnlockedBadges] = useState([]);
  const [streak, setStreak] = useState({ count: 1 });
  const [savedAlert, setSavedAlert] = useState(false);

  useEffect(() => {
    setProfile(getCoupleProfile());
    setHistory(getGameHistory());
    setUnlockedBadges(getUnlockedBadges());
    setStreak(getCoupleStreak());
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    saveCoupleProfile(profile);
    setIsEditing(false);
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 2500);
  };

  const handleClearHistory = () => {
    if (confirm("Are you sure you want to delete your saved game history? 🗑️")) {
      clearGameHistory();
      setHistory([]);
    }
  };

  const daysLeft = getDaysUntilAnniversary(profile.anniversary);

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "28px",
      }}
    >
      {/* Top Navigation */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link
          href="/"
          className="heart-btn heart-btn-secondary"
          style={{ padding: "8px 18px", fontSize: "0.9rem" }}
        >
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </Link>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            background: "linear-gradient(135deg, rgba(255, 122, 0, 0.16) 0%, rgba(255, 8, 68, 0.2) 100%)",
            border: "1.5px solid #FF7A00",
            padding: "6px 14px",
            borderRadius: "9999px",
            fontSize: "0.88rem",
            fontWeight: 700,
            color: "#D84A00",
          }}
        >
          <Flame size={16} color="#FF7A00" fill="#FF7A00" />
          <span>{streak.count} Day Couple Streak!</span>
        </div>
      </div>

      {/* Main Couple Profile Card */}
      <div className="glass-card glass-card-glow" style={{ padding: "36px 30px" }}>
        {savedAlert && (
          <div
            style={{
              padding: "10px 18px",
              background: "rgba(37, 211, 102, 0.15)",
              border: "1.5px solid #25D366",
              borderRadius: "14px",
              color: "#128C7E",
              fontWeight: 600,
              fontSize: "0.92rem",
              textAlign: "center",
              marginBottom: "16px",
            }}
          >
            ✓ Couple Profile successfully saved! 💕
          </div>
        )}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
            marginBottom: "20px",
          }}
        >
          <div>
            <span
              style={{
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "var(--ruby-red)",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Couple Profile
            </span>
            <h1
              style={{
                fontSize: "clamp(2rem, 5vw, 2.8rem)",
                color: "var(--text-dark)",
                margin: "4px 0 0",
              }}
            >
              {profile.nickname || "Forever Us"} ❤️
            </h1>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="heart-btn heart-btn-secondary"
            style={{ padding: "8px 18px", fontSize: "0.88rem" }}
          >
            <Edit3 size={15} />
            <span>{isEditing ? "Cancel" : "Edit Profile"}</span>
          </button>
        </div>

        {/* View Mode */}
        {!isEditing ? (
          <div>
            {/* Couple Avatars & Names Banner */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "24px",
                padding: "24px",
                background: "rgba(255, 255, 255, 0.75)",
                borderRadius: "24px",
                border: "1.5px solid var(--card-border-subtle)",
                marginBottom: "22px",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "3.2rem", lineHeight: 1, marginBottom: "4px" }}>
                  {profile.avatar1}
                </div>
                <strong style={{ fontSize: "1.2rem", color: "var(--text-dark)" }}>
                  {profile.name1}
                </strong>
                <span style={{ display: "block", fontSize: "0.78rem", color: "var(--ruby-red)" }}>
                  👑 Partner 1
                </span>
              </div>

              <div style={{ fontSize: "2rem" }}>❤️</div>

              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "3.2rem", lineHeight: 1, marginBottom: "4px" }}>
                  {profile.avatar2}
                </div>
                <strong style={{ fontSize: "1.2rem", color: "var(--text-dark)" }}>
                  {profile.name2}
                </strong>
                <span style={{ display: "block", fontSize: "0.78rem", color: "var(--royal-purple)" }}>
                  💎 Partner 2
                </span>
              </div>
            </div>

            {/* Anniversary Countdown Banner */}
            {profile.anniversary && daysLeft !== null ? (
              <div
                style={{
                  background: "linear-gradient(135deg, rgba(255, 8, 68, 0.12) 0%, rgba(183, 110, 121, 0.22) 100%)",
                  border: "2px solid var(--rose-gold)",
                  borderRadius: "20px",
                  padding: "18px 24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <Calendar size={28} color="var(--ruby-red)" />
                  <div>
                    <strong style={{ display: "block", fontSize: "1.1rem", color: "var(--ruby-red)" }}>
                      {daysLeft === 0
                        ? "🎉 IT'S YOUR ANNIVERSARY TODAY! Happy Celebration! 💍"
                        : `${daysLeft} days until your next Anniversary! 💍`}
                    </strong>
                    <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                      Special Date: {new Date(profile.anniversary).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.65)",
                  border: "1.5px dashed var(--main-pink)",
                  borderRadius: "18px",
                  padding: "16px 20px",
                  textAlign: "center",
                }}
              >
                <p style={{ margin: "0 0 8px", color: "var(--text-muted)", fontSize: "0.92rem" }}>
                  Want a live anniversary countdown?
                </p>
                <button
                  onClick={() => setIsEditing(true)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--ruby-red)",
                    fontWeight: 700,
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  Set your anniversary date now ➔
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Edit Mode Form */
          <form onSubmit={handleSave}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "18px",
                marginBottom: "20px",
              }}
            >
              {/* Partner 1 Input */}
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "6px" }}>
                  👑 Partner 1 Name & Mascot
                </label>
                <input
                  type="text"
                  className="romantic-input"
                  value={profile.name1}
                  onChange={(e) => setProfile({ ...profile, name1: e.target.value })}
                  style={{ marginBottom: "8px" }}
                />
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {AVATARS.map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setProfile({ ...profile, avatar1: a })}
                      style={{
                        background: profile.avatar1 === a ? "var(--ruby-red)" : "rgba(255, 255, 255, 0.7)",
                        border: "none",
                        borderRadius: "50%",
                        width: "32px",
                        height: "32px",
                        cursor: "pointer",
                        fontSize: "1rem",
                      }}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              {/* Partner 2 Input */}
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "6px" }}>
                  💎 Partner 2 Name & Mascot
                </label>
                <input
                  type="text"
                  className="romantic-input"
                  value={profile.name2}
                  onChange={(e) => setProfile({ ...profile, name2: e.target.value })}
                  style={{ marginBottom: "8px" }}
                />
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {AVATARS.map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setProfile({ ...profile, avatar2: a })}
                      style={{
                        background: profile.avatar2 === a ? "var(--royal-purple)" : "rgba(255, 255, 255, 0.7)",
                        border: "none",
                        borderRadius: "50%",
                        width: "32px",
                        height: "32px",
                        cursor: "pointer",
                        fontSize: "1rem",
                      }}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              {/* Couple Nickname */}
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "6px" }}>
                  Couple Nickname
                </label>
                <input
                  type="text"
                  className="romantic-input"
                  placeholder="e.g. Romeo & Juliet"
                  value={profile.nickname}
                  onChange={(e) => setProfile({ ...profile, nickname: e.target.value })}
                />
              </div>

              {/* Anniversary Date */}
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "6px" }}>
                  Anniversary Date 💍
                </label>
                <input
                  type="date"
                  className="romantic-input"
                  value={profile.anniversary}
                  onChange={(e) => setProfile({ ...profile, anniversary: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              className="heart-btn"
              style={{ padding: "12px 30px", fontSize: "1rem" }}
            >
              <Check size={18} />
              <span>Save Couple Profile 💕</span>
            </button>
          </form>
        )}
      </div>

      {/* Heart Collection & Unlocked Badges */}
      <div className="glass-card" style={{ padding: "32px 28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
          <Trophy size={24} color="var(--ruby-red)" />
          <h3 style={{ fontSize: "1.6rem", color: "var(--ruby-red)", margin: 0 }}>
            Heart Collection & Romantic Badges
          </h3>
        </div>
        <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "20px" }}>
          Unlock badges as you complete games, explore modes, and maintain your streak!
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "14px",
          }}
        >
          {ALL_BADGES.map((badge) => {
            const isUnlocked = unlockedBadges.includes(badge.id);

            return (
              <div
                key={badge.id}
                style={{
                  background: isUnlocked
                    ? "linear-gradient(135deg, rgba(255, 8, 68, 0.14) 0%, rgba(235, 211, 248, 0.25) 100%)"
                    : "rgba(255, 255, 255, 0.4)",
                  border: isUnlocked ? "2px solid var(--ruby-red)" : "1px dashed #DDD",
                  borderRadius: "18px",
                  padding: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  opacity: isUnlocked ? 1 : 0.6,
                  filter: isUnlocked ? "none" : "grayscale(0.8)",
                  transition: "all 0.2s ease",
                }}
              >
                <div
                  style={{
                    fontSize: "2.2rem",
                    lineHeight: 1,
                    filter: isUnlocked ? "drop-shadow(0 2px 8px rgba(255, 8, 68, 0.3))" : "none",
                  }}
                >
                  {badge.icon}
                </div>
                <div>
                  <strong style={{ display: "block", fontSize: "0.95rem", color: "var(--text-dark)" }}>
                    {badge.title}
                  </strong>
                  <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.3 }}>
                    {badge.desc}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Relationship Memory Wall (Saved Game History) */}
      <div className="glass-card" style={{ padding: "32px 28px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
            marginBottom: "16px",
          }}
        >
          <div>
            <h3 style={{ fontSize: "1.6rem", color: "var(--royal-purple)", margin: 0 }}>
              Relationship Memory Wall 📸
            </h3>
            <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", margin: "4px 0 0" }}>
              Archive of your couple love scores and special moments
            </p>
          </div>

          {history.length > 0 && (
            <button
              onClick={handleClearHistory}
              style={{
                background: "none",
                border: "none",
                color: "var(--text-subtle)",
                fontSize: "0.82rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer",
              }}
            >
              <Trash2 size={14} />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div
            style={{
              padding: "36px 20px",
              textAlign: "center",
              background: "rgba(255, 255, 255, 0.6)",
              borderRadius: "20px",
              border: "1.5px dashed var(--main-pink)",
            }}
          >
            <div style={{ fontSize: "2.5rem", marginBottom: "8px" }}>💌</div>
            <h4 style={{ color: "var(--text-dark)", marginBottom: "6px" }}>No Saved Games Yet</h4>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", margin: "0 0 16px" }}>
              Play a game together to see your compatibility scores and milestone memories archived here!
            </p>
            <Link href="/" className="heart-btn" style={{ padding: "10px 24px", fontSize: "0.9rem" }}>
              Start Playing Now ❤️
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {history.map((record) => (
              <div
                key={record.id}
                style={{
                  background: "rgba(255, 255, 255, 0.85)",
                  borderRadius: "18px",
                  padding: "16px 20px",
                  border: "1.5px solid var(--card-border-subtle)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "14px",
                  flexWrap: "wrap",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, var(--ruby-red) 0%, var(--royal-purple) 100%)",
                      color: "#FFF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: "0.95rem",
                    }}
                  >
                    {record.score}%
                  </div>
                  <div>
                    <strong style={{ fontSize: "1rem", color: "var(--text-dark)", display: "block" }}>
                      {record.avatar1} {record.name1} & {record.avatar2} {record.name2}
                    </strong>
                    <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                      {record.date} • {record.tier || "Love Match"}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    background: "rgba(255, 8, 68, 0.12)",
                    padding: "6px 14px",
                    borderRadius: "9999px",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    color: "var(--ruby-red)",
                  }}
                >
                  {record.score >= 90 ? "💍 Soulmate" : record.score >= 75 ? "💕 Love Birds" : "🌷 Growing"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
