"use client";

import { Heart, MessageCircle, ShieldCheck, Sparkles, Compass, Flame } from "lucide-react";

const CATEGORY_META = {
  "💖 Love": {
    icon: <Flame size={20} color="#FF0844" />,
    emoji: "💖",
    weight: "20%",
    description: "Romantic expressions, unconditional devotion, and deep chemistry.",
    tipHigh: "Infinite romance! Your love languages and hearts beat as one.",
    tipMid: "Sweet and tender chemistry. Keep expressing your affection openly!",
    tipLow: "Unique ways of showing love. Explore each other's romantic desires!",
  },
  Love: {
    icon: <Flame size={20} color="#FF0844" />,
    emoji: "💖",
    weight: "20%",
    description: "Romantic expressions, unconditional devotion, and deep chemistry.",
    tipHigh: "Infinite romance! Your love languages and hearts beat as one.",
    tipMid: "Sweet and tender chemistry. Keep expressing your affection openly!",
    tipLow: "Unique ways of showing love. Explore each other's romantic desires!",
  },
  "🥰 Emotions": {
    icon: <Heart size={20} color="#FF2E74" />,
    emoji: "🥰",
    weight: "20%",
    description: "Vulnerability, comfort, conflict healing, and emotional safety.",
    tipHigh: "Telepathic emotional safety! You are each other's truest haven.",
    tipMid: "Wonderful emotional balance and patient mutual support.",
    tipLow: "Deepen quiet listening and exchange longer, silent comforting hugs!",
  },
  Emotions: {
    icon: <Heart size={20} color="#FF2E74" />,
    emoji: "🥰",
    weight: "20%",
    description: "Vulnerability, comfort, conflict healing, and emotional safety.",
    tipHigh: "Telepathic emotional safety! You are each other's truest haven.",
    tipMid: "Wonderful emotional balance and patient mutual support.",
    tipLow: "Deepen quiet listening and exchange longer, silent comforting hugs!",
  },
  "✨ Habits": {
    icon: <Sparkles size={20} color="#D4AF37" />,
    emoji: "✨",
    weight: "20%",
    description: "Daily rituals, playful quirks, downtime vibes, and shared routines.",
    tipHigh: "Effortless everyday rhythm! Life together feels like home.",
    tipMid: "Harmonious daily balance with plenty of laughter and silliness.",
    tipLow: "Invent small sweet daily morning or evening rituals together!",
  },
  Habits: {
    icon: <Sparkles size={20} color="#D4AF37" />,
    emoji: "✨",
    weight: "20%",
    description: "Daily rituals, playful quirks, downtime vibes, and shared routines.",
    tipHigh: "Effortless everyday rhythm! Life together feels like home.",
    tipMid: "Harmonious daily balance with plenty of laughter and silliness.",
    tipLow: "Invent small sweet daily morning or evening rituals together!",
  },
  "📸 Memories": {
    icon: <MessageCircle size={20} color="#8E05C2" />,
    emoji: "📸",
    weight: "20%",
    description: "Cherished milestones, unforgettable early sparks, and keepsakes.",
    tipHigh: "A treasure chest of golden moments etched forever in your hearts!",
    tipMid: "Beautiful shared milestones that keep your romantic flame burning.",
    tipLow: "Plan a nostalgia date night revisiting where you first met!",
  },
  Memories: {
    icon: <MessageCircle size={20} color="#8E05C2" />,
    emoji: "📸",
    weight: "20%",
    description: "Cherished milestones, unforgettable early sparks, and keepsakes.",
    tipHigh: "A treasure chest of golden moments etched forever in your hearts!",
    tipMid: "Beautiful shared milestones that keep your romantic flame burning.",
    tipLow: "Plan a nostalgia date night revisiting where you first met!",
  },
  "🌹 Future Goals": {
    icon: <Compass size={20} color="#FF0844" />,
    emoji: "🌹",
    weight: "20%",
    description: "Shared life vision, dream homes, adventures, and lifelong promises.",
    tipHigh: "Unified horizon! You are walking in lockstep toward a radiant future.",
    tipMid: "Inspiring shared dreams that bring exciting balance to your duo.",
    tipLow: "Create a shared bucket list of dream destinations and milestones!",
  },
  "Future Goals": {
    icon: <Compass size={20} color="#FF0844" />,
    emoji: "🌹",
    weight: "20%",
    description: "Shared life vision, dream homes, adventures, and lifelong promises.",
    tipHigh: "Unified horizon! You are walking in lockstep toward a radiant future.",
    tipMid: "Inspiring shared dreams that bring exciting balance to your duo.",
    tipLow: "Create a shared bucket list of dream destinations and milestones!",
  },
  Communication: {
    icon: <MessageCircle size={20} color="#FF6F91" />,
    emoji: "💬",
    weight: "25%",
    description: "How openly you express thoughts and resolve differences.",
    tipHigh: "Superb alignment! You two understand each other without words.",
    tipMid: "Great connection! Keep expressing your feelings openly.",
    tipLow: "Opposite styles here. Gentle listening can bridge any gap!",
  },
  Trust: {
    icon: <ShieldCheck size={20} color="#FF6F91" />,
    emoji: "🤝",
    weight: "25%",
    description: "Mutual honesty, security, and emotional comfort.",
    tipHigh: "Unshakable rock! You share rare emotional safety & loyalty.",
    tipMid: "Healthy boundaries and steady reassurance keep you close.",
    tipLow: "Building shared transparency will deepen your intimacy.",
  },
  "Values": {
    icon: <Compass size={20} color="#FF6F91" />,
    emoji: "🌍",
    weight: "20%",
    description: "Future vision, family importance, and money habits.",
    tipHigh: "Walking in lockstep toward the same radiant future!",
    tipMid: "Complimentary goals that bring balance to your duo.",
    tipLow: "You each bring unique perspectives—plan your visions together.",
  },
  "Values & Future": {
    icon: <Compass size={20} color="#FF6F91" />,
    emoji: "🌍",
    weight: "20%",
    description: "Future vision, family importance, and money habits.",
    tipHigh: "Walking in lockstep toward the same radiant future!",
    tipMid: "Complimentary goals that bring balance to your duo.",
    tipLow: "You each bring unique perspectives—plan your visions together.",
  },
  Fun: {
    icon: <Sparkles size={20} color="#FF6F91" />,
    emoji: "🎉",
    weight: "15%",
    description: "Spontaneity, humor, adventures, and relaxing vibes.",
    tipHigh: "Playful soulmates! You never run out of giggles and fun.",
    tipMid: "You balance quiet chill nights with exciting adventures.",
    tipLow: "Try trying out brand new hobbies together to spark fresh joy!",
  },
  Romance: {
    icon: <Flame size={20} color="#FF6F91" />,
    emoji: "💘",
    weight: "15%",
    description: "Love languages, affection, and sweet surprise gestures.",
    tipHigh: "Passionate romance! Butterflies are alive and well.",
    tipMid: "Sweet and thoughtful romantic rhythm.",
    tipLow: "Surprise each other with small handwritten notes or hugs!",
  },
};

export default function CategoryBreakdown({ categories = {} }) {
  const getTip = (key, val) => {
    const meta = CATEGORY_META[key] || CATEGORY_META["Values"];
    if (val >= 80) return meta.tipHigh;
    if (val >= 55) return meta.tipMid;
    return meta.tipLow;
  };

  const getBarColor = (score) => {
    if (score >= 80) return "linear-gradient(90deg, #FF6F91 0%, #FF3366 100%)";
    if (score >= 60) return "linear-gradient(90deg, #FFB6C9 0%, #FF6F91 100%)";
    return "linear-gradient(90deg, #FFD166 0%, #FF99A8 100%)";
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "18px",
        marginTop: "16px",
      }}
    >
      {Object.entries(categories).map(([catKey, score]) => {
        const meta = CATEGORY_META[catKey] || CATEGORY_META["Values"];
        const comment = getTip(catKey, score);

        return (
          <div
            key={catKey}
            style={{
              background: "rgba(255, 255, 255, 0.85)",
              border: "1.5px solid var(--card-border-subtle)",
              borderRadius: "20px",
              padding: "18px 22px",
              boxShadow: "0 4px 14px rgba(255, 111, 145, 0.08)",
              transition: "transform 0.2s ease, border-color 0.2s ease",
            }}
          >
            {/* Category header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "1.25rem" }}>{meta.emoji}</span>
                <div>
                  <h4
                    style={{
                      fontFamily: "var(--font-body)",
                      fontWeight: 700,
                      fontSize: "1.05rem",
                      color: "var(--text-dark)",
                      margin: 0,
                    }}
                  >
                    {catKey === "Values" ? "Values & Future" : catKey}
                  </h4>
                  <span style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>
                    Weight: {meta.weight}
                  </span>
                </div>
              </div>

              {/* Score badge */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "rgba(255, 111, 145, 0.12)",
                  padding: "4px 12px",
                  borderRadius: "9999px",
                  border: "1px solid rgba(255, 111, 145, 0.3)",
                }}
              >
                <Heart size={14} fill="var(--deep-rose)" color="var(--deep-rose)" />
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: "1.05rem",
                    color: "var(--deep-rose)",
                  }}
                >
                  {score}%
                </span>
              </div>
            </div>

            {/* Progress Track */}
            <div
              style={{
                width: "100%",
                height: "12px",
                backgroundColor: "rgba(255, 182, 201, 0.25)",
                borderRadius: "9999px",
                overflow: "hidden",
                margin: "10px 0 8px",
                position: "relative",
              }}
            >
              <div
                style={{
                  width: `${score}%`,
                  height: "100%",
                  background: getBarColor(score),
                  borderRadius: "9999px",
                  transition: "width 1.4s cubic-bezier(0.16, 1, 0.3, 1)",
                  boxShadow: "0 0 8px rgba(255, 111, 145, 0.5)",
                }}
              />
            </div>

            {/* Personalized insight tip */}
            <p
              style={{
                fontSize: "0.85rem",
                color: "var(--text-muted)",
                margin: 0,
                lineHeight: 1.4,
              }}
            >
              💡 <em>{comment}</em>
            </p>
          </div>
        );
      })}
    </div>
  );
}
