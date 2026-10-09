import {
  calculateSmartScore,
  generateLoveLetter,
  generateSurpriseNote,
  generateCoupleCoachInsights,
  getQuestionsForMode,
  UNIFIED_MODULE,
  RESULT_LEVELS,
  SUGGESTION_TAGS,
  SUGGESTION_PROMPTS,
} from "./lib/gameEngine.js";
import { getDaysUntilAnniversary } from "./lib/profileStorage.js";

async function runTests() {
  console.log("=== Testing Unified 20-Question Game Engine & Features ===");

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

  // 3. Verify Distinct Question Types
  const types = [...new Set(qs.map((q) => q.type))];
  console.log(`Discovered question types (${types.length}):`, types);
  const expectedTypes = ["scenario_choice", "partner_perspective", "who_is_more_likely", "this_or_that", "love_scale"];
  expectedTypes.forEach((t) => {
    if (!types.includes(t)) {
      throw new Error(`Expected question type '${t}' to be present in the 20 questions`);
    }
  });

  // 4. Verify 5 Relationship Dimensions (Categories)
  const categories = [...new Set(qs.map((q) => q.category))];
  console.log(`Discovered categories (${categories.length}):`, categories);
  if (categories.length < 5) {
    throw new Error(`Expected at least 5 categories, got ${categories.length}`);
  }

  // 5. Test Score Calculation on 20 questions
  const perfectAnswers = Array(20).fill(1);
  const perfectRes = calculateSmartScore(qs, perfectAnswers, perfectAnswers);
  console.log(`Perfect Match Score (20 Qs): ${perfectRes.score}%, Tier: ${perfectRes.tier}`);
  if (perfectRes.score < 90) throw new Error("Perfect match score should be >= 90%");

  const mixedAnswers1 = [1, 2, 3, 1, 5, 2, 1, 2, 5, 3, 4, 1, 2, 5, 1, 2, 1, 5, 4, 2];
  const mixedAnswers2 = [1, 2, 3, 2, 4, 2, 2, 1, 4, 3, 2, 1, 2, 4, 2, 2, 1, 5, 3, 2];
  const mixedRes = calculateSmartScore(qs, mixedAnswers1, mixedAnswers2);
  console.log(`Mixed Couple Score (20 Qs): ${mixedRes.score}%, Tier: ${mixedRes.tier}`);
  if (mixedRes.score < 50 || mixedRes.score > 95) {
    throw new Error("Unexpected mixed score");
  }

  // 6. Test AI Couple Coach Insights
  const coachInsights = generateCoupleCoachInsights(mixedAnswers1, mixedAnswers2, mixedRes.score, qs, "Romeo", "Juliet");
  console.log("Couple Coach Superpower:", coachInsights.superpower.title);
  console.log("Tailored Date Night:", coachInsights.dateIdea.title);
  console.log("Intimacy Advice:", coachInsights.intimacyAdvice.title);
  if (!coachInsights.superpower || !coachInsights.dateIdea || !coachInsights.intimacyAdvice) {
    throw new Error("Missing couple coach insight fields");
  }

  // 7. Verify Suggestion Tags & Prompts for Passage Box
  console.log(`Suggestion tags: ${SUGGESTION_TAGS.length}, Prompts: ${SUGGESTION_PROMPTS.length}`);
  if (SUGGESTION_TAGS.length < 5 || SUGGESTION_PROMPTS.length < 4) {
    throw new Error("Passage suggestion tags or starters missing");
  }

  // 8. Test Love Letter Generation
  const letterHigh = generateLoveLetter("Romeo", "Juliet", 96, perfectRes);
  if (!letterHigh.includes("Juliet") || !letterHigh.includes("Romeo")) {
    throw new Error("Love letter should contain couple names");
  }

  // 9. Test Surprise Note Generation
  const surprise = generateSurpriseNote("Romeo", "Juliet");
  if (!surprise || surprise.length < 10) throw new Error("Surprise note is empty");

  // 10. Test Anniversary Calculator
  const today = new Date();
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 15);
  const nextMonthStr = nextMonth.toISOString().split("T")[0];
  const days = getDaysUntilAnniversary(nextMonthStr);
  console.log(`Anniversary countdown: ${days} days until ${nextMonthStr}`);
  if (days <= 0) throw new Error("Expected positive days for future anniversary");

  console.log("\n ALL TESTS PASSED SUCCESSFULLY! ❤️");
}

runTests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
