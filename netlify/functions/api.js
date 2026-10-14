/**
 * Netlify Serverless Functions Backend for Forever Us ❤️
 * Implements all Love Score REST endpoints with zero external dependencies:
 * - GET  /api/health
 * - POST /api/submit
 * - GET  /api/submissions
 * - POST /api/room/create
 * - POST /api/room/join
 * - GET  /api/room/:code
 * - POST /api/room/:code/update
 * - POST /api/room/:code/questions
 * - POST /api/room/:code/complete
 * - POST /api/room/:code/replay
 */

// In-memory room store (preserved across warm serverless invocations)
const ROOMS = {};
const SUBMISSIONS = [
  {
    Timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
    "Name 1": "Romeo",
    "Name 2": "Juliet",
    Score: 100,
    Tier: "Perfect Match! 💍",
    Communication: 100,
    Trust: 100,
    Fun: 100,
    Values: 100,
    Romance: 100
  }
];

const CATEGORY_MAPPING = {
  "💖 Romantic Passion & Chemistry": [0, 3, 10, 17],
  "🥰 Emotional Intimacy & Empathy": [1, 9, 14, 16],
  "😂 Playful Connection & Humor": [2, 6, 13, 15],
  "🌹 Future Vision & Life Goals": [5, 7, 18, 19],
  "✨ Daily Devotion & Couple Rhythm": [4, 8, 11, 12]
};

const TIERS = [
  { min: 71, max: 100, name: "Perfect Match! 💍", msg: "Perfect Match! You two are amazing together!" },
  { min: 40, max: 70, name: "Good Connection! 🌷", msg: "Good Connection! Keep understanding each other." },
  { min: 0, max: 39, name: "Get Lost! 😂", msg: "Get Lost! 😂 Maybe you both need more quality time!" }
];

function calculateLoveScore(answers1, answers2) {
  const total = Math.min(answers1.length, answers2.length, 20);
  const whoLikely = new Set([2, 6, 11, 15]);
  const thisOrThat = new Set([3, 7, 12, 14]);
  const scale = new Set([4, 8, 13, 17]);

  const matches = [];
  for (let i = 0; i < total; i++) {
    const a1 = answers1[i];
    const a2 = answers2[i];

    if (whoLikely.has(i)) {
      matches.push(a1 === a2 ? 1.0 : (a1 === 3 || a2 === 3 ? 0.70 : 0.30));
    } else if (thisOrThat.has(i)) {
      matches.push(a1 === a2 ? 1.0 : 0.40);
    } else if (scale.has(i)) {
      const diff = Math.abs(a1 - a2);
      matches.push(Math.max(0, Math.min(1.0, 1.0 - diff / 4.0)));
    } else {
      const diff = Math.abs(a1 - a2);
      matches.push(Math.max(0, Math.min(1.0, 1.0 - diff / 3.0)));
    }
  }

  const categoryScores = {};
  let weightedSum = 0.0;

  for (const [cat, indices] of Object.entries(CATEGORY_MAPPING)) {
    const catMatches = indices.filter((idx) => idx < matches.length).map((idx) => matches[idx]);
    const avg = catMatches.length > 0 ? catMatches.reduce((a, b) => a + b, 0) / catMatches.length : 0;
    const catScore = Math.round(avg * 100);
    categoryScores[cat] = catScore;
    weightedSum += catScore * 0.20;
  }

  const finalScore = Math.max(0, Math.min(100, Math.round(weightedSum)));
  let tierName = "Good Connection! 🌷";
  let tierMessage = "Good Connection! Keep understanding each other.";

  for (const t of TIERS) {
    if (finalScore >= t.min && finalScore <= t.max) {
      tierName = t.name;
      tierMessage = t.msg;
      break;
    }
  }

  return {
    score: finalScore,
    tier: tierName,
    message: tierMessage,
    categories: categoryScores,
    question_matches: matches.map((m) => Math.round(m * 100))
  };
}

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Content-Type": "application/json"
};

function jsonResponse(statusCode, data) {
  return {
    statusCode,
    headers: CORS_HEADERS,
    body: JSON.stringify(data)
  };
}

export const handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: ""
    };
  }

  // Normalize path
  // Netlify functions receive paths like:
  // /.netlify/functions/api/health OR /api/health
  let rawPath = event.path || "";
  rawPath = rawPath.replace(/^\/\.netlify\/functions\/api/, "");
  rawPath = rawPath.replace(/^\/api/, "");
  if (!rawPath.startsWith("/")) rawPath = "/" + rawPath;

  const method = event.httpMethod.toUpperCase();
  let body = {};
  if (event.body) {
    try {
      body = JSON.parse(event.body);
    } catch (e) {
      body = {};
    }
  }

  // 1. Health check: GET /api/health
  if (rawPath === "/health" && method === "GET") {
    return jsonResponse(200, {
      status: "healthy",
      service: "Love Score Quiz Backend (Netlify Serverless)",
      version: "2.0.0",
      active_rooms: Object.keys(ROOMS).length
    });
  }

  // 2. Submit quiz: POST /api/submit
  if (rawPath === "/submit" && method === "POST") {
    const { name1, name2, answers1, answers2 } = body;
    if (!answers1 || !answers2) {
      return jsonResponse(400, { detail: "Answers cannot be empty" });
    }

    const calc = calculateLoveScore(answers1, answers2);
    const submission = {
      Timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      "Name 1": (name1 || "Partner 1").trim(),
      "Name 2": (name2 || "Partner 2").trim(),
      Score: calc.score,
      Tier: calc.tier,
      Communication: calc.categories["💖 Romantic Passion & Chemistry"] || 0,
      Trust: calc.categories["🥰 Emotional Intimacy & Empathy"] || 0,
      Fun: calc.categories["😂 Playful Connection & Humor"] || 0,
      Values: calc.categories["🌹 Future Vision & Life Goals"] || 0,
      Romance: calc.categories["✨ Daily Devotion & Couple Rhythm"] || 0
    };
    SUBMISSIONS.unshift(submission);
    if (SUBMISSIONS.length > 50) SUBMISSIONS.pop();

    return jsonResponse(200, {
      ...calc,
      sheet_status: {
        status: "saved_serverless",
        message: "Result recorded successfully to serverless session."
      }
    });
  }

  // 3. Submissions list: GET /api/submissions
  if (rawPath === "/submissions" && method === "GET") {
    return jsonResponse(200, {
      count: SUBMISSIONS.length,
      records: SUBMISSIONS
    });
  }

  // 4. Create room: POST /api/room/create
  if (rawPath === "/room/create" && method === "POST") {
    const code = (body.code || Math.random().toString(36).substring(2, 8)).toUpperCase();
    const room = {
      code,
      mode: body.mode || "forever_us_20",
      questions: body.questions || [],
      createdAt: Date.now(),
      status: "waiting",
      player1: body.player1 || null,
      player2: null,
      result: null,
      replayCount: 0
    };
    ROOMS[code] = room;
    return jsonResponse(200, room);
  }

  // 5. Join room: POST /api/room/join
  if (rawPath === "/room/join" && method === "POST") {
    const code = (body.code || "").toUpperCase().trim();
    if (!ROOMS[code]) {
      return jsonResponse(404, { detail: `Room '${code}' was not found. Please verify the code! 🔍` });
    }
    const room = ROOMS[code];
    if (room.player2 && room.player2.name && room.player2.name !== body.name) {
      return jsonResponse(400, { detail: `Room '${code}' already has 2 players connected! 💕` });
    }

    room.player2 = {
      name: (body.name || "Partner 2").trim(),
      avatar: body.avatar || "🐰",
      connected: true,
      ready: true,
      progress: 0,
      answers: [],
      completed: false
    };
    room.status = "ready";
    return jsonResponse(200, room);
  }

  // 6. Room state: GET /api/room/:code
  const roomMatch = rawPath.match(/^\/room\/([A-Za-z0-9_-]+)$/);
  if (roomMatch && method === "GET") {
    const code = roomMatch[1].toUpperCase();
    if (!ROOMS[code]) {
      return jsonResponse(404, { detail: "Room not found" });
    }
    return jsonResponse(200, ROOMS[code]);
  }

  // 7. Update progress: POST /api/room/:code/update
  const updateMatch = rawPath.match(/^\/room\/([A-Za-z0-9_-]+)\/update$/);
  if (updateMatch && method === "POST") {
    const code = updateMatch[1].toUpperCase();
    if (!ROOMS[code]) {
      return jsonResponse(404, { detail: "Room not found" });
    }
    const room = ROOMS[code];
    const { player_key, progress, answers } = body;
    if (player_key && room[player_key]) {
      room[player_key].progress = progress;
      if (answers) room[player_key].answers = answers;
    }
    return jsonResponse(200, { success: true, room });
  }

  // 8. Update questions: POST /api/room/:code/questions
  const questionsMatch = rawPath.match(/^\/room\/([A-Za-z0-9_-]+)\/questions$/);
  if (questionsMatch && method === "POST") {
    const code = questionsMatch[1].toUpperCase();
    if (!ROOMS[code]) {
      return jsonResponse(404, { detail: "Room not found" });
    }
    ROOMS[code].questions = body.questions || [];
    return jsonResponse(200, { success: true, room: ROOMS[code] });
  }

  // 9. Complete quiz: POST /api/room/:code/complete
  const completeMatch = rawPath.match(/^\/room\/([A-Za-z0-9_-]+)\/complete$/);
  if (completeMatch && method === "POST") {
    const code = completeMatch[1].toUpperCase();
    if (!ROOMS[code]) {
      return jsonResponse(404, { detail: "Room not found" });
    }
    const room = ROOMS[code];
    const { player_key, answers, passage } = body;
    if (player_key && room[player_key]) {
      room[player_key].completed = true;
      room[player_key].answers = answers || [];
      room[player_key].passage = passage || null;
      room[player_key].progress = room.questions?.length || 20;
    }

    const p1 = room.player1;
    const p2 = room.player2;
    if (p1?.completed && p2?.completed) {
      const calc = calculateLoveScore(p1.answers || [], p2.answers || []);
      calc.passage1 = p1.passage;
      calc.passage2 = p2.passage;
      room.result = calc;
      room.status = "completed";
    }

    return jsonResponse(200, room);
  }

  // 10. Replay room: POST /api/room/:code/replay
  const replayMatch = rawPath.match(/^\/room\/([A-Za-z0-9_-]+)\/replay$/);
  if (replayMatch && method === "POST") {
    const code = replayMatch[1].toUpperCase();
    if (!ROOMS[code]) {
      return jsonResponse(404, { detail: "Room not found" });
    }
    const room = ROOMS[code];
    room.status = "ready";
    room.result = null;
    if (body.questions) room.questions = body.questions;
    if (room.player1) {
      room.player1.answers = [];
      room.player1.passage = null;
      room.player1.progress = 0;
      room.player1.completed = false;
    }
    if (room.player2) {
      room.player2.answers = [];
      room.player2.passage = null;
      room.player2.progress = 0;
      room.player2.completed = false;
    }
    room.replayCount = (room.replayCount || 0) + 1;
    return jsonResponse(200, room);
  }

  return jsonResponse(404, { detail: `Route ${method} ${rawPath} not found` });
};
