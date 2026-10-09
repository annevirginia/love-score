/**
 * Profile, Anniversary, Memory Wall, Badges and Streak Storage
 */

const PROFILE_KEY = "forever_us_profile";
const HISTORY_KEY = "forever_us_history";
const BADGES_KEY = "forever_us_badges";
const STREAK_KEY = "forever_us_streak";

export const ALL_BADGES = [
  { id: "soulmates_unlocked", title: "Eternal Soulmates 💍", desc: "Achieved a 90%+ compatibility score", icon: "💍" },
  { id: "love_birds", title: "Perfect Love Birds 💕", desc: "Achieved a 75%+ compatibility score", icon: "💕" },
  { id: "first_game", title: "First Spark ✨", desc: "Completed your very first game together", icon: "✨" },
  { id: "who_knows_master", title: "Mind Reader 🎭", desc: "Completed 'Who Knows Whom Better?' mode", icon: "🎭" },
  { id: "future_builders", title: "Future Dreamers 🌹", desc: "Explored 'Our Future Together' mode", icon: "🌹" },
  { id: "rapid_flirt", title: "Rapid Hearts ⚡", desc: "Played 'This or That' rapid mode", icon: "⚡" },
  { id: "streak_3", title: "Passionate Streak 🔥", desc: "Completed 3 consecutive daily love challenges", icon: "🔥" },
  { id: "anniversary_set", title: "Milestone Keeper 📅", desc: "Saved your special relationship anniversary date", icon: "📅" },
];

export function getCoupleProfile() {
  if (typeof window === "undefined") {
    return {
      name1: "Romeo",
      name2: "Juliet",
      avatar1: "🐱",
      avatar2: "🐰",
      nickname: "Our Love Story",
      anniversary: "",
      colorTheme: "rose-gold",
    };
  }

  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}

  return {
    name1: localStorage.getItem("love-score-name1") || "Partner 1",
    name2: localStorage.getItem("love-score-name2") || "Partner 2",
    avatar1: localStorage.getItem("love-score-avatar1") || "🐱",
    avatar2: localStorage.getItem("love-score-avatar2") || "🐰",
    nickname: "Forever Us",
    anniversary: "",
    colorTheme: "rose-gold",
  };
}

export function saveCoupleProfile(profile) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    if (profile.name1) localStorage.setItem("love-score-name1", profile.name1);
    if (profile.name2) localStorage.setItem("love-score-name2", profile.name2);
    if (profile.avatar1) localStorage.setItem("love-score-avatar1", profile.avatar1);
    if (profile.avatar2) localStorage.setItem("love-score-avatar2", profile.avatar2);

    if (profile.anniversary) {
      unlockBadge("anniversary_set", "Milestone Keeper 📅");
    }
  } catch (e) {}
}

export function getDaysUntilAnniversary(anniversaryDateString) {
  if (!anniversaryDateString) return null;
  try {
    const target = new Date(anniversaryDateString);
    if (isNaN(target.getTime())) return null;

    const today = new Date();
    // Set to same day this year
    let nextAnniv = new Date(today.getFullYear(), target.getMonth(), target.getDate());

    if (nextAnniv < today) {
      // If passed this year, look at next year
      nextAnniv = new Date(today.getFullYear() + 1, target.getMonth(), target.getDate());
    }

    const diffTime = nextAnniv.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  } catch (e) {
    return null;
  }
}

export function getGameHistory() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveGameHistory(record) {
  if (typeof window === "undefined") return;
  try {
    const history = getGameHistory();
    const newRecord = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      timestamp: Date.now(),
      ...record,
    };
    const updated = [newRecord, ...history].slice(0, 50); // keep up to 50 records
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));

    // Unlock badges automatically
    unlockBadge("first_game", "First Spark ✨");
    if (record.score >= 90) unlockBadge("soulmates_unlocked", "Eternal Soulmates 💍");
    if (record.score >= 75) unlockBadge("love_birds", "Perfect Love Birds 💕");
    if (record.mode === "who_knows_better") unlockBadge("who_knows_master", "Mind Reader 🎭");
    if (record.mode === "future_together") unlockBadge("future_builders", "Future Dreamers 🌹");
    if (record.mode === "this_or_that") unlockBadge("rapid_flirt", "Rapid Hearts ⚡");

    recordPlayedToday();
  } catch (e) {}
}

export function clearGameHistory() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (e) {}
}

export function getUnlockedBadges() {
  if (typeof window === "undefined") return ["first_game"];
  try {
    const raw = localStorage.getItem(BADGES_KEY);
    return raw ? JSON.parse(raw) : ["first_game"];
  } catch (e) {
    return ["first_game"];
  }
}

export function unlockBadge(badgeId, badgeName) {
  if (typeof window === "undefined") return;
  try {
    const badges = getUnlockedBadges();
    if (!badges.includes(badgeId)) {
      badges.push(badgeId);
      localStorage.setItem(BADGES_KEY, JSON.stringify(badges));
    }
  } catch (e) {}
}

export function getCoupleStreak() {
  if (typeof window === "undefined") return { count: 1, lastPlayed: "" };
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    return raw ? JSON.parse(raw) : { count: 1, lastPlayed: "" };
  } catch (e) {
    return { count: 1, lastPlayed: "" };
  }
}

export function recordPlayedToday() {
  if (typeof window === "undefined") return;
  try {
    const todayStr = new Date().toDateString();
    const streak = getCoupleStreak();

    if (streak.lastPlayed === todayStr) {
      return; // already recorded today
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    let newCount = 1;
    if (streak.lastPlayed === yesterdayStr) {
      newCount = (streak.count || 0) + 1;
    }

    localStorage.setItem(
      STREAK_KEY,
      JSON.stringify({ count: newCount, lastPlayed: todayStr })
    );

    if (newCount >= 3) {
      unlockBadge("streak_3", "Passionate Streak 🔥");
    }
  } catch (e) {}
}

/**
 * ----------------------------------------------------
 * Couple Suggestion Box Storage (Available anytime without quiz)
 * ----------------------------------------------------
 */
const SUGGESTIONS_KEY = "forever_us_suggestions";

const DEFAULT_COUPLE_SUGGESTIONS = [
  {
    id: "sug-init-1",
    authorName: "Partner 1",
    recipientName: "Partner 2",
    authorAvatar: "🐱",
    recipientAvatar: "🐰",
    tag: "wish",
    text: "Let's plan a cozy candlelit cooking night together this Friday with zero phones or distractions! 🍝🕯️",
    date: "Always",
    completed: false,
    timestamp: Date.now() - 86400000,
  },
  {
    id: "sug-init-2",
    authorName: "Partner 2",
    recipientName: "Partner 1",
    authorAvatar: "🐰",
    recipientAvatar: "🐱",
    tag: "comfort",
    text: "Whenever either of us feels stressed after a long day, let's have an automatic 30-second silent hug without questions. 🫂✨",
    date: "Always",
    completed: false,
    timestamp: Date.now() - 43200000,
  },
  {
    id: "sug-init-3",
    authorName: "Partner 1",
    recipientName: "Partner 2",
    authorAvatar: "🐱",
    recipientAvatar: "🐰",
    tag: "habit",
    text: "Let's leave one sweet hidden sticky note for each other every Monday morning to start the week with butterflies. 💌🍯",
    date: "Always",
    completed: false,
    timestamp: Date.now() - 21600000,
  },
];

export function getCoupleSuggestions() {
  if (typeof window === "undefined") return DEFAULT_COUPLE_SUGGESTIONS;
  try {
    const raw = localStorage.getItem(SUGGESTIONS_KEY);
    if (!raw) {
      localStorage.setItem(SUGGESTIONS_KEY, JSON.stringify(DEFAULT_COUPLE_SUGGESTIONS));
      return DEFAULT_COUPLE_SUGGESTIONS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return DEFAULT_COUPLE_SUGGESTIONS;
  }
}

export function saveCoupleSuggestion(suggestion) {
  if (typeof window === "undefined") return null;
  try {
    const current = getCoupleSuggestions();
    const newSug = {
      id: `sug-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      timestamp: Date.now(),
      date: new Date().toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      completed: false,
      ...suggestion,
    };
    const updated = [newSug, ...current];
    localStorage.setItem(SUGGESTIONS_KEY, JSON.stringify(updated));
    return newSug;
  } catch (e) {
    return null;
  }
}

export function deleteCoupleSuggestion(id) {
  if (typeof window === "undefined") return;
  try {
    const current = getCoupleSuggestions();
    const updated = current.filter((s) => s.id !== id);
    localStorage.setItem(SUGGESTIONS_KEY, JSON.stringify(updated));
  } catch (e) {}
}

export function toggleCoupleSuggestionStatus(id) {
  if (typeof window === "undefined") return;
  try {
    const current = getCoupleSuggestions();
    const updated = current.map((s) =>
      s.id === id ? { ...s, completed: !s.completed } : s
    );
    localStorage.setItem(SUGGESTIONS_KEY, JSON.stringify(updated));
  } catch (e) {}
}

/**
 * ----------------------------------------------------
 * Custom / Modified Questions Storage
 * ----------------------------------------------------
 */
const CUSTOM_QUESTIONS_KEY = "forever_us_custom_questions";

export function getCustomQuestions() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CUSTOM_QUESTIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveCustomQuestions(questions) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CUSTOM_QUESTIONS_KEY, JSON.stringify(questions));
  } catch (e) {}
}

export function addCustomQuestion(newQ) {
  if (typeof window === "undefined") return null;
  try {
    const current = getCustomQuestions();
    const created = {
      id: `custom-${Date.now()}`,
      category: "💖 Love and Relationship",
      categoryIcon: "💖",
      type: "scenario_choice",
      typeLabel: "Custom Couple Question 💌",
      ...newQ,
    };
    const updated = [created, ...current];
    saveCustomQuestions(updated);
    return created;
  } catch (e) {
    return null;
  }
}

export function updateCustomQuestion(id, updatedFields) {
  if (typeof window === "undefined") return;
  try {
    const current = getCustomQuestions();
    const updated = current.map((q) =>
      q.id === id ? { ...q, ...updatedFields } : q
    );
    saveCustomQuestions(updated);
  } catch (e) {}
}

export function deleteCustomQuestion(id) {
  if (typeof window === "undefined") return;
  try {
    const current = getCustomQuestions();
    const updated = current.filter((q) => q.id !== id);
    saveCustomQuestions(updated);
  } catch (e) {}
}

export function resetCustomQuestions() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(CUSTOM_QUESTIONS_KEY);
  } catch (e) {}
}
