
const API_BASE = "http://localhost:8000";

async function run() {
  console.log("=== Testing Multiplayer Sync & Scoring API ===");

  // 1. Health check
  const healthRes = await fetch(`${API_BASE}/api/health`);
  const health = await healthRes.json();
  console.log("Health check:", health);

  // 2. Create room
  const code = "TEST" + Math.floor(10 + Math.random() * 90);
  const createPayload = {
    code,
    mode: "forever_us_20",
    questions: [
      { id: 1, category: "💖 Love and Relationship", type: "this_or_that" },
      { id: 2, category: "🥰 Understanding Each Other", type: "love_scale" },
      { id: 3, category: "😂 Funny Couple Questions", type: "who_is_more_likely" }
    ],
    status: "waiting",
    player1: {
      name: "Romeo",
      avatar: "🐱",
      connected: true,
      ready: true,
      progress: 0,
      answers: [],
      completed: false
    }
  };

  const createRes = await fetch(`${API_BASE}/api/room/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(createPayload)
  });
  const created = await createRes.json();
  console.log("Room created:", created.code, created.status);

  // 3. Join room as player 2
  const joinRes = await fetch(`${API_BASE}/api/room/join`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      code,
      name: "Juliet",
      avatar: "🐰"
    })
  });
  const joined = await joinRes.json();
  console.log("Player 2 joined:", joined.player2.name, "Room status:", joined.status);

  // 4. Update progress
  await fetch(`${API_BASE}/api/room/${code}/update`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      player_key: "player1",
      progress: 3,
      answers: [1, 5, 3]
    })
  });

  await fetch(`${API_BASE}/api/room/${code}/update`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      player_key: "player2",
      progress: 3,
      answers: [1, 5, 3]
    })
  });

  // 5. Complete player 1
  await fetch(`${API_BASE}/api/room/${code}/complete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      player_key: "player1",
      answers: [1, 5, 3],
      passage: { text: "You are my world! ❤️", tag: "wish" }
    })
  });

  // 6. Complete player 2
  const complete2Res = await fetch(`${API_BASE}/api/room/${code}/complete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      player_key: "player2",
      answers: [1, 5, 3],
      passage: { text: "Forever and always! 🌹", tag: "promise" }
    })
  });
  const complete2 = await complete2Res.json();
  console.log("Final synchronized room result:");
  console.log("Status:", complete2.status);
  console.log("Result:", complete2.result);

  if (!complete2.result || complete2.result.score === undefined) {
    throw new Error("Result score not computed!");
  }

  // 7. Test replay with new questions
  const newQuestions = [
    { id: 10, category: "✨ Romantic Questions", type: "this_or_that" },
    { id: 25, category: "🌟 Personality", type: "scenario_choice" }
  ];
  const replayRes = await fetch(`${API_BASE}/api/room/${code}/replay`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ questions: newQuestions })
  });
  const replayed = await replayRes.json();
  console.log("Replayed room status:", replayed.status);
  console.log("Replayed questions count:", replayed.questions.length);

  console.log("✅ Multiplayer full synchronization E2E verified successfully!");
}

run().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
