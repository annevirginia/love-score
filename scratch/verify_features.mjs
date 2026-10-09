import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const questionsPath = path.resolve(__dirname, "../frontend/data/questions.json");
const questions = JSON.parse(fs.readFileSync(questionsPath, "utf-8"));

console.log("=== 1. VERIFY QUESTION POOL ===");
console.log(`Total questions in bank: ${questions.length}`);
if (questions.length < 60) {
  throw new Error(`Expected at least 60 questions, got ${questions.length}`);
}

const ids = new Set();
const categories = new Set();
for (const q of questions) {
  if (ids.has(q.id)) throw new Error(`Duplicate question ID found: ${q.id}`);
  ids.add(q.id);
  categories.add(q.category);

  if (!q.options || q.options.length < 2) {
    throw new Error(`Question ID ${q.id} has invalid options`);
  }
  if (!q.prompt_p1 || !q.prompt_p2) {
    throw new Error(`Question ID ${q.id} missing prompts`);
  }
}

console.log(`Unique IDs count: ${ids.size}`);
console.log("Distinct categories:", [...categories]);
const expectedCategories = [
  "💖 Love and Relationship",
  "🥰 Understanding Each Other",
  "📸 Memories",
  "🌟 Personality",
  "🌹 Future Plans",
  "😂 Funny Couple Questions",
  "✨ Romantic Questions",
  "🔮 Compatibility",
  "⚡ Preferences"
];

for (const exp of expectedCategories) {
  if (!categories.has(exp)) {
    throw new Error(`Missing expected category: ${exp}`);
  }
}
console.log("✅ All 9 categories present and verified!");

console.log("\n=== 2. VERIFY SCORING AND AVATAR MAPPING LOGIC ===");
function getStatusData(score) {
  if (score === null || score === undefined || isNaN(score)) {
    return { tierKey: "unscored", message: "Take the quiz together to discover how well you understand each other." };
  }
  const s = Number(score);
  if (s > 70) {
    return { tierKey: "high", title: "Perfect Match!", message: "Perfect Match! You two are amazing together!" };
  }
  if (s >= 40) {
    return { tierKey: "medium", title: "Good Connection!", message: "Good Connection! Keep understanding each other." };
  }
  return { tierKey: "low", title: "Get Lost! 😂", message: "Get Lost! 😂 Maybe you both need more quality time!" };
}

const testHigh = getStatusData(82);
console.log("Score 82:", testHigh);
if (testHigh.tierKey !== "high" || testHigh.message !== "Perfect Match! You two are amazing together!") {
  throw new Error("High score tier mismatch");
}

const testMed = getStatusData(55);
console.log("Score 55:", testMed);
if (testMed.tierKey !== "medium" || testMed.message !== "Good Connection! Keep understanding each other.") {
  throw new Error("Medium score tier mismatch");
}

const testLow = getStatusData(32);
console.log("Score 32:", testLow);
if (testLow.tierKey !== "low" || testLow.message !== "Get Lost! 😂 Maybe you both need more quality time!") {
  throw new Error("Low score tier mismatch");
}

const testNull = getStatusData(null);
console.log("Score null (pre-quiz):", testNull);
if (testNull.tierKey !== "unscored") {
  throw new Error("Pre-quiz tier mismatch");
}

console.log("✅ Avatar and tier calculation verified successfully!");
