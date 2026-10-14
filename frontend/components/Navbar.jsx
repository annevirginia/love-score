"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Moon, Sun, Heart, Sparkles, Volume2, VolumeX } from "lucide-react";
import { isSoundEnabled, setSoundEnabled } from "../lib/audio";

export default function Navbar() {
  const [isDark, setIsDark] = useState(false);
  const [soundOn, setSoundOn] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem("love-score-theme");
    if (savedTheme === "dark") {
      setIsDark(true);
      document.documentElement.setAttribute("data-theme", "dark");
    }
    setSoundOn(isSoundEnabled());
  }, []);

  const toggleTheme = () => {
    const nextState = !isDark;
    setIsDark(nextState);
    if (nextState) {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("love-score-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("love-score-theme", "light");
    }
  };

  const toggleSound = () => {
    const nextState = !soundOn;
    setSoundOn(nextState);
    setSoundEnabled(nextState);
  };

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        backgroundColor: "rgba(255, 240, 245, 0.78)",
        borderBottom: "1px solid var(--card-border-subtle)",
        transition: "all 0.3s ease",
      }}
    >
      <div
        style={{
          maxWidth: "960px",
          margin: "0 auto",
          padding: "12px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            textDecoration: "none",
            color: "var(--text-dark)",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--ruby-red) 0%, var(--royal-purple) 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 14px rgba(255, 8, 68, 0.4)",
              color: "#FFF",
            }}
          >
            <Heart size={22} fill="#FFF" className="beating-heart" />
          </div>
          <div>
            <span
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.45rem",
                color: "var(--ruby-red)",
                letterSpacing: "0.5px",
                lineHeight: 1,
              }}
            >
              Love Score
            </span>
            <span
              style={{
                display: "block",
                fontSize: "0.72rem",
                fontWeight: 700,
                color: "var(--text-muted)",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              Our Love Story ❤️
            </span>
          </div>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Link
            href="/suggestions"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              padding: "7px 12px",
              borderRadius: "9999px",
              background: "linear-gradient(135deg, rgba(255, 8, 68, 0.12) 0%, rgba(142, 5, 194, 0.16) 100%)",
              border: "1.5px solid var(--ruby-red)",
              color: "var(--ruby-red)",
              fontSize: "0.82rem",
              fontWeight: 700,
              textDecoration: "none",
              whiteSpace: "nowrap",
              transition: "transform 0.2s ease",
            }}
          >
            <span>💌 Suggestions</span>
          </Link>

          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              padding: "7px 12px",
              borderRadius: "9999px",
              background: "rgba(255, 255, 255, 0.8)",
              border: "1px solid var(--card-border)",
              color: "var(--text-dark)",
              fontSize: "0.82rem",
              fontWeight: 700,
              textDecoration: "none",
              whiteSpace: "nowrap",
              transition: "transform 0.2s ease",
            }}
          >
            <span>📱 Quiz</span>
          </Link>

          {/* Sound Mute / Unmute Toggle */}
          <button
            onClick={toggleSound}
            aria-label="Toggle romantic sound effects"
            title={soundOn ? "Mute romantic chimes" : "Enable romantic chimes"}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.85)",
              border: "1px solid var(--card-border)",
              color: soundOn ? "var(--ruby-red)" : "var(--text-subtle)",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(255, 8, 68, 0.2)",
              transition: "all 0.2s ease",
            }}
          >
            {soundOn ? <Volume2 size={19} /> : <VolumeX size={19} />}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme mode"
            title={isDark ? "Switch to Soft Pink mode" : "Switch to Romantic Dark mode"}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.85)",
              border: "1px solid var(--card-border)",
              color: "var(--ruby-red)",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(255, 8, 68, 0.2)",
              transition: "all 0.2s ease",
            }}
          >
            {isDark ? <Sun size={19} /> : <Moon size={19} />}
          </button>
        </div>
      </div>
    </header>
  );
}
