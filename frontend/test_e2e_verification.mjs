import {
  calculateSmartScore,
  generateLoveLetter,
  generateSurpriseNote,
  generateCoupleCoachInsights,
  getQuestionsForMode,
  getRomanticCoupleQuizQuestions,
  getPersonalizedLoveMessage,
  ROMANTIC_QUIZ_20_QUESTIONS,
  UNIFIED_MODULE,
  RESULT_LEVELS,
  SUGGESTION_TAGS,
  SUGGESTION_PROMPTS,
} from "./lib/gameEngine.js";
import { getDaysUntilAnniversary } from "./lib/profileStorage.js";

async function runTests() {
  console.log("=== Testing 20-Question Romantic Couple Quiz & Game Engine ===");

  // 1. Verify Unified Module
  console.log(`Checking UNIFIED_MODULE:`, UNIFIED_MODULE.title);
  if (UNIFIED_MODULE.totalQuestions !== 20) {
    throw new Error("Expected UNIFIED_MODULE to have 20 total questions");
  }

  // 2. Verify 20 Questions Generated
  const qs = getQuestionsForMode("forever_us_20", 20);
  console.log(`Generated questions: count = ${qs.length}`);
  if (qs.length !== 20) {
    throw new Error(`Expected exactly 20 questions, got ${qs.length}`);
  }

  // 3. Verify Every Question Has Exactly 4 Multiple-Choice Options
  qs.forEach((q, idx) => {
    if (!q.options || q.options.length !== 4) {
      throw new Error(`Question #${q.id} (index ${idx}) must have exactly 4 answer options, found ${q.options?.length}`);
    }
  });
  console.log("Verified: All 20 questions have exactly 4 multiple-choice options each! (A, B, C, D)");

  // 4. Verify The 5 Relationship Categories (Love, Emotions, Habits, Memories, Future Goals)
  const categories = [...new Set(qs.map((q) => q.category))];
  console.log(`Discovered categories (${categories.length}):`, categories);
  const requiredCategories = ["💖 Love", "🥰 Emotions", "✨ Habits", "📸 Memories", "🌹 Future Goals"];
  requiredCategories.forEach((cat) => {
    if (!categories.includes(cat)) {
      throw new Error(`Expected required category '${cat}' in the 20 questions`);
    }
    const countInCat = qs.filter((q) => q.category === cat).length;
    if (countInCat !== 4) {
      throw new Error(`Expected exactly 4 questions in category '${cat}', found ${countInCat}`);
    }
  });
  console.log("Verified: All 5 categories are present with exactly 4 questions each (Total 20 Qs)!");

  // 5. Test 100% Perfect Match Compatibility Score
  const perfectAnswers = Array(20).fill(1);
  const perfectRes = calculateSmartScore(qs, perfectAnswers, perfectAnswers, "Romeo", "Juliet");
  console.log(`Perfect Match Score: ${perfectRes.score}%, Tier: ${perfectRes.tier}`);
  if (perfectRes.score !== 100) {
    throw new Error(`Expected 100% score for identical answers, got ${perfectRes.score}%`);
  }

  // 6. Test Mixed Couple Answers (0-100% calculation)
  const mixedAnswers1 = [1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4];
  const mixedAnswers2 = [1, 2, 2, 3, 1, 3, 3, 2, 1, 1, 4, 4, 2, 2, 3, 1, 1, 2, 4, 4];
  const mixedRes = calculateSmartScore(qs, mixedAnswers1, mixedAnswers2, "Romeo", "Juliet");
  console.log(`Mixed Couple Score: ${mixedRes.score}%, Tier: ${mixedRes.tier}`);
  if (mixedRes.score < 50 || mixedRes.score > 95) {
    throw new Error(`Unexpected mixed couple score: ${mixedRes.score}%`);
  }

  // 7. Verify Category Breakdown Covers All 5 Dimensions
  const breakdownKeys = Object.keys(mixedRes.categories);
  console.log("Category breakdown scores:", mixedRes.categories);
  requiredCategories.forEach((cat) => {
    if (mixedRes.categories[cat] === undefined) {
      throw new Error(`Missing category '${cat}' in score breakdown`);
    }
  });

  // 8. Verify Personalized Love Message
  console.log("Personalized Message:", mixedRes.message);
  if (!mixedRes.message.includes("Romeo") || !mixedRes.message.includes("Juliet")) {
    throw new Error("Personalized love message must include both partner names");
  }

  // 9. Test Differing/Opposites Couple Score (checking low range)
  const distantAnswers1 = Array(20).fill(1);
  const distantAnswers2 = Array(20).fill(4);
  const distantRes = calculateSmartScore(qs, distantAnswers1, distantAnswers2, "Romeo", "Juliet");
  console.log(`Differing Couple Score: ${distantRes.score}%, Tier: ${distantRes.tier}`);
  if (distantRes.score > 40) {
    throw new Error(`Expected low score for completely differing answers, got ${distantRes.score}%`);
  }

  // 10. Test AI Couple Coach Insights
  const coachInsights = generateCoupleCoachInsights(mixedAnswers1, mixedAnswers2, mixedRes.score, qs, "Romeo", "Juliet");
  console.log("Couple Coach Superpower:", coachInsights.superpower.title);
  console.log("Tailored Date Night:", coachInsights.dateIdea.title);
  console.log("Intimacy Advice:", coachInsights.intimacyAdvice.title);
  if (!coachInsights.superpower || !coachInsights.dateIdea || !coachInsights.intimacyAdvice) {
    throw new Error("Missing couple coach insight fields");
  }

  // 11. Verify Suggestion Tags & Prompts for Passage Box
  if (SUGGESTION_TAGS.length < 5 || SUGGESTION_PROMPTS.length < 4) {
    throw new Error("Passage suggestion tags or starters missing");
  }

  // 12. Test Love Letter Generation
  const letterHigh = generateLoveLetter("Romeo", "Juliet", 96, perfectRes);
  if (!letterHigh.includes("Juliet") || !letterHigh.includes("Romeo")) {
    throw new Error("Love letter should contain couple names");
  }

  // 13. Test Surprise Note Generation
  const surprise = generateSurpriseNote("Romeo", "Juliet");
  if (!surprise || surprise.length < 10) throw new Error("Surprise note is empty");

  // 14. Test Anniversary Calculator
  const today = new Date();
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 15);
  const nextMonthStr = nextMonth.toISOString().split("T")[0];
  const days = getDaysUntilAnniversary(nextMonthStr);
  console.log(`Anniversary countdown: ${days} days until ${nextMonthStr}`);
  if (days <= 0) throw new Error("Expected positive days for future anniversary");

  console.log("\n✨ ALL 20-QUESTION ROMANTIC COUPLE QUIZ TESTS PASSED WITH 100% SUCCESS! ❤️");
}

runTests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
