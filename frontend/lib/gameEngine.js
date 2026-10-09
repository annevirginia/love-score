/**
 * Game Engine for "Forever Us ❤️"
 * Unified Single-Module 20-Question Couple Experience.
 * Features: Multi-format questions, smart compatibility scoring,
 * Partner Love & Suggestion Passage exchange, and AI Couple Coach insights.
 */

import allQuestions from "../data/questions.json" with { type: "json" };
import { getCustomQuestions } from "./profileStorage.js";

export const UNIFIED_MODULE = {
  id: "forever_us_20",
  title: "Forever Us — 20 Romantic Questions",
  badge: "💍 The Complete Journey",
  description: "20 multi-type couple challenges: Romantic Scenarios, This-or-That, 1–5 Love Scales, Who's More Likely, and Secret Partner Suggestions.",
  icon: "❤️",
  color: "#FF0844",
  gradient: "linear-gradient(135deg, #FF0844 0%, #FF2E74 100%)",
  totalQuestions: 20,
};

// Kept for backward compatibility if any legacy component looks up GAME_MODES
export const GAME_MODES = [UNIFIED_MODULE];

export const RESULT_LEVELS = [
  {
    min: 71,
    max: 100,
    tier: "Perfect Match! 💍",
    title: "Perfect Match!",
    emoji: "💍",
    message: "Perfect Match! You two are amazing together!",
    badgeId: "soulmates_unlocked",
    badgeName: "Eternal Soulmates 💍",
  },
  {
    min: 40,
    max: 70,
    tier: "Good Connection! 🌷",
    title: "Good Connection!",
    emoji: "🌷",
    message: "Good Connection! Keep understanding each other.",
    badgeId: "growing_together",
    badgeName: "Blooming Hearts 🌷",
  },
  {
    min: 0,
    max: 39,
    tier: "Get Lost! 😂",
    title: "Get Lost! 😂",
    emoji: "😂",
    message: "Get Lost! 😂 Maybe you both need more quality time!",
    badgeId: "opposites_attract",
    badgeName: "Playful Duo 💘",
  },
];

/**
 * Romantic Passage Tags & Quick Starters for Partner Suggestions
 */
export const SUGGESTION_TAGS = [
  { id: "wish", label: "🌹 Romantic Wish", emoji: "🌹" },
  { id: "habit", label: "🍯 Sweet Daily Habit", emoji: "🍯" },
  { id: "date", label: "✨ Dream Date Idea", emoji: "✨" },
  { id: "comfort", label: "🫂 Comfort & Care Tip", emoji: "🫂" },
  { id: "appreciation", label: "💌 Deep Appreciation", emoji: "💌" },
  { id: "promise", label: "💍 Future Promise", emoji: "💍" },
];

export const SUGGESTION_PROMPTS = [
  "🌹 Date Idea: Let's do a cozy candlelit cooking night together with zero phones...",
  "🫂 Comfort Tip: When I'm having a stressful day, the best thing you can do is just hold me in a tight, silent hug...",
  "🍯 Sweet Habit: Let's make it a daily ritual to hug and kiss for at least 30 seconds before leaving...",
  "✨ Romantic Request: Hold my hand more often whenever we walk together in public...",
  "✈️ Adventure Wish: I want us to take an impulsive weekend roadtrip somewhere we've never visited...",
  "💌 Pure Appreciation: Thank you for loving me exactly as I am and being my safest emotional haven...",
];

const RECENT_QUESTIONS_KEY = "love_score_recent_q_ids";

/**
 * Returns all available questions, combining the base bank and any couple custom questions.
 */
export function getAllAvailableQuestions() {
  const custom = getCustomQuestions();
  return [...custom, ...allQuestions];
}

/**
 * Swaps a specific question in an active quiz set for a fresh unused question.
 * Allows the couple to change any question they do not like or want to replace.
 */
export function swapQuestionInSet(currentQuestions, indexToSwap) {
  if (!currentQuestions || currentQuestions.length === 0) return currentQuestions;
  const currentIds = currentQuestions.map((q) => q.id);
  const fullBank = getAllAvailableQuestions();
  const availablePool = fullBank.filter((q) => !currentIds.includes(q.id));

  const targetPool =
    availablePool.length > 0
      ? availablePool
      : fullBank.filter((q) => q.id !== currentQuestions[indexToSwap]?.id);

  if (targetPool.length === 0) return currentQuestions;

  const randomNewQ = targetPool[Math.floor(Math.random() * targetPool.length)];
  const updated = [...currentQuestions];
  updated[indexToSwap] = randomNewQ;
  return updated;
}

/**
 * Returns a randomized subset from the question bank.
 * - Avoids repeating questions recently seen by this couple.
 * - Balances across all 9 question categories.
 * - Shuffles order so each session is fresh and exciting.
 */
export function getRandomQuestions(count = 15, options = {}) {
  const { avoidRecent = true, rememberSelected = true } = options;
  let recentIds = [];

  if (avoidRecent && typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(RECENT_QUESTIONS_KEY);
      if (raw) recentIds = JSON.parse(raw);
    } catch (e) {}
  }

  const allAvailable = getAllAvailableQuestions();

  // Filter out recent questions if possible
  let pool = allAvailable.filter((q) => !recentIds.includes(q.id));

  // If pool has fewer than count questions left, reset recent tracking and use full bank
  if (pool.length < count) {
    pool = [...allAvailable];
    recentIds = [];
  }

  // Group by category to ensure rich diversity
  const byCategory = {};
  for (const q of pool) {
    const cat = q.category || "💖 Love and Relationship";
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(q);
  }

  // Shuffle within each category
  const categories = Object.keys(byCategory);
  for (const cat of categories) {
    byCategory[cat].sort(() => Math.random() - 0.5);
  }

  // Round-robin selection across different categories
  const selected = [];
  let catIndex = Math.floor(Math.random() * categories.length);
  let iterations = 0;
  const maxIterations = count * 15;

  while (selected.length < count && iterations < maxIterations) {
    iterations++;
    const cat = categories[catIndex % categories.length];
    catIndex++;
    if (byCategory[cat] && byCategory[cat].length > 0) {
      selected.push(byCategory[cat].pop());
    }
  }

  // If still need more to meet count, fill randomly from remaining
  if (selected.length < count) {
    const remaining = pool.filter((q) => !selected.some((s) => s.id === q.id));
    remaining.sort(() => Math.random() - 0.5);
    while (selected.length < count && remaining.length > 0) {
      selected.push(remaining.pop());
    }
  }

  // Final shuffle of selected questions
  selected.sort(() => Math.random() - 0.5);

  // Persist newly selected IDs so they aren't repeated on next play
  if (rememberSelected && typeof window !== "undefined") {
    try {
      const newRecent = [...recentIds, ...selected.map((q) => q.id)].slice(-40);
      localStorage.setItem(RECENT_QUESTIONS_KEY, JSON.stringify(newRecent));
    } catch (e) {}
  }

  return selected;
}

/**
 * Returns dynamic randomized questions for the quiz mode.
 */
export function getQuestionsForMode(_mode = "forever_us_20", count = 15) {
  return getRandomQuestions(count);
}

/**
 * Smart Love Score calculation based on question types and partner answers.
 */
export function calculateSmartScore(questions, answers1, answers2) {
  const activeQuestions =
    questions && questions.length > 0 ? questions : allQuestions.slice(0, 15);
  const total = Math.min(activeQuestions.length, answers1.length, answers2.length);
  if (total === 0) return { score: 75, level: RESULT_LEVELS[1] };

  let totalMatchPoints = 0;
  const questionMatches = [];
  const categoryBuckets = {};

  for (let i = 0; i < total; i++) {
    const q = activeQuestions[i];
    const a1 = answers1[i] !== null && answers1[i] !== undefined ? answers1[i] : 1;
    const a2 = answers2[i] !== null && answers2[i] !== undefined ? answers2[i] : 1;
    let match = 1.0;

    if (q.type === "who_is_more_likely") {
      if (a1 === a2) {
        match = 1.0; // Both picked the same person or both
      } else if (a1 === 3 || a2 === 3) {
        match = 0.70; // One picked both, other nominated a person
      } else {
        match = 0.30; // Different nominations
      }
    } else if (q.type === "this_or_that") {
      match = a1 === a2 ? 1.0 : 0.40;
    } else if (q.type === "love_scale") {
      const diff = Math.abs(a1 - a2);
      match = Math.max(0, 1 - diff / 4.0);
    } else {
      // 4-choice question (scenario_choice or partner_perspective)
      const diff = Math.abs(a1 - a2);
      match = Math.max(0, 1 - diff / 3.0);
    }

    totalMatchPoints += match;
    questionMatches.push(Math.round(match * 100));

    // Category tracking
    const cat = q.category || "💖 Romantic Passion & Chemistry";
    if (!categoryBuckets[cat]) {
      categoryBuckets[cat] = [];
    }
    categoryBuckets[cat].push(match);
  }

  const finalScore = Math.max(0, Math.min(100, Math.round((totalMatchPoints / total) * 100)));

  // Identify result level
  let resultLevel = RESULT_LEVELS[2];
  for (const lvl of RESULT_LEVELS) {
    if (finalScore >= lvl.min && finalScore <= lvl.max) {
      resultLevel = lvl;
      break;
    }
  }

  // Calculate category averages
  const categories = {};
  for (const [cat, matches] of Object.entries(categoryBuckets)) {
    const avg = matches.reduce((s, m) => s + m, 0) / matches.length;
    categories[cat] = Math.round(avg * 100);
  }

  return {
    score: finalScore,
    tier: resultLevel.tier,
    title: resultLevel.title,
    emoji: resultLevel.emoji,
    message: resultLevel.message,
    badgeId: resultLevel.badgeId,
    badgeName: resultLevel.badgeName,
    categories,
    question_matches: questionMatches,
  };
}

/**
 * AI Couple Coach & Relationship Recommendations
 * Analyzes answers across the 20 questions to craft personalized romantic insights!
 */
export function generateCoupleCoachInsights(answers1 = [], answers2 = [], score = 80, questions = [], name1 = "Partner 1", name2 = "Partner 2") {
  // 1. Couple Superpower
  let superpower = {
    title: "Telepathic Emotional Resonance 🧠💖",
    desc: `${name1} and ${name2} share an extraordinary intuitive rhythm. You anticipate each other's unspoken thoughts and provide comfort effortlessly.`,
  };

  if (score >= 90) {
    superpower = {
      title: "Soulmate Synchronicity 💍✨",
      desc: `Your emotional and romantic values are aligned down to the smallest detail. You naturally pull in the exact same direction while magnifying each other's joy.`,
    };
  } else if (score < 60) {
    superpower = {
      title: "Dynamic Chemistry & Growth 🔥🌱",
      desc: `You two bring uniquely vibrant perspectives to the table. Your differences prevent boredom and keep the romantic curiosity alive every single day!`,
    };
  }

  // 2. Custom Date Night based on This-or-That (Q4 & Q8)
  const q4Ans = answers1[3] || 1;
  const q8Ans = answers1[7] || 1;
  let dateIdea = {
    title: "Candlelit Living Room Tapas & Vinyl Music 🕯️🍷",
    desc: `Ditch phones at the door, dim the lights, put on low jazz, and cook a delicious dessert together barefoot in the kitchen.`,
  };

  if (q4Ans === 1) {
    dateIdea = {
      title: "Secret Rooftop Stargazing & Cocktails 🍸✨",
      desc: `Dress up to the nines, sneak away to a scenic skyline lounge, and whisper secrets over dessert like it's your first romantic rendezvous.`,
    };
  } else if (q8Ans === 1) {
    dateIdea = {
      title: "Sunset Water Picnic & Foot Massage 🌊🍓",
      desc: `Pack fresh strawberries, sparkling juice, and blankets by the water. Spend an hour trading forehead kisses and foot rubs.`,
    };
  }

  // 3. Intimacy & Love Language Advice (based on Q2 & Q11)
  let intimacyAdvice = {
    title: "The 60-Second Daily Embrace Ritual 🫂",
    desc: `Science shows that a genuine 30 to 60-second hug releases high levels of oxytocin. Make it an unshakeable ritual every morning and before bed.`,
  };

  const q2Ans = answers1[1] || 1;
  if (q2Ans === 2) {
    intimacyAdvice = {
      title: "Sweet Surprise Snack Delivery 🍫🧋",
      desc: `When either of you is stressed, drop off their favorite sweet treat or comfort drink with a sticky note saying 'I'm proud of you'.`,
    };
  } else if (q2Ans === 3) {
    intimacyAdvice = {
      title: "Sacred Quiet Decompression Space 🧘✨",
      desc: `When your partner is overwhelmed, gift them 30 minutes of undisturbed peaceful time—then welcome them back with warmth and zero pressure.`,
    };
  }

  // 4. Weekend Couple Challenge
  const weekendChallenge = {
    title: "The 'No-Phone Hour & Sweet Whispers' Challenge 📵💕",
    desc: `This Saturday night, put both phones in airplane mode for 60 uninterrupted minutes. Take turns sharing 3 small moments you fell in love with each other this week.`,
  };

  return {
    superpower,
    dateIdea,
    intimacyAdvice,
    weekendChallenge,
  };
}

/**
 * Generates a personalized romantic Love Letter based on results.
 */
export function generateLoveLetter(name1, name2, score, level) {
  const letters = {
    high: `My Dearest ${name2},\n\nEvery day with you feels like an answered prayer. Taking this 20-question journey together and seeing our compatibility score shine at ${score}% only confirms what my heart already knew: you and I were made for each other. \n\nThank you for being my anchor in stormy waters, the brightest smile in every room, and the gentlest home my soul has ever found. I promise to love you, cherish every quiet morning, and choose you in every lifetime.\n\nForever & always,\nYour soulmate, ${name1} ❤️`,
    mid: `To My Sweetest ${name2},\n\nLooking into your eyes, I see a love that is constantly blooming. Our score of ${score}% celebrates everything we share—our shared laughter, the silly inside jokes, and the quiet comfort of just resting by your side. \n\nNo matter where life leads us, having your hand in mine turns every ordinary moment into an adventure. Thank you for choosing to grow, dream, and walk this journey with me.\n\nWith all my love,\n${name1} 💕`,
    unique: `Dearest ${name2},\n\nThey say opposites attract, and with you, every single day is an electric surprise. Our ${score}% compatibility reflects the magical puzzle of us—two unique souls challenging, inspiring, and balancing each other out in ways words can hardly capture. \n\nThank you for loving me as I am and for coloring my world with your unique brilliance. Here's to our ongoing adventure!\n\nYours truly,\n${name1} 💘`,
  };

  if (score >= 75) return letters.high;
  if (score >= 50) return letters.mid;
  return letters.unique;
}

/**
 * Generates a Surprise Love Note.
 */
export function generateSurpriseNote(name1, name2) {
  const notes = [
    `💌 Surprise Secret: "${name1} secretly thinks of ${name2} every time their favorite love song plays on the radio."`,
    `🌹 Little Truth: "A single hug from ${name2} has the power to undo a whole week's worth of stress for ${name1}."`,
    `✨ Celestial Blessing: "The universe spent billions of years putting stars together, just so the two of you could cross paths."`,
    `💖 Sweet Reminder: "True love isn't about being identical—it's about never wanting to let go of each other's hand."`,
    `💍 Future Whisper: "The best chapters of your love story haven't even been written yet. The best is still to come!"`,
  ];
  return notes[Math.floor(Math.random() * notes.length)];
}
