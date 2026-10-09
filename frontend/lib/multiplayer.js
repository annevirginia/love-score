/**
 * Multiplayer Engine for "Forever Us ❤️"
 * Synchronizes room sessions across different phones in real time.
 * Supports Firebase Realtime Database with automatic backend fallback.
 */

import { getFirebaseDatabase, isFirebaseConfigured } from "./firebase";
import { ref, set, update, onValue, off, get } from "firebase/database";
import { getQuestionsForMode, getRandomQuestions, calculateSmartScore } from "./gameEngine";
import { saveGameHistory } from "./profileStorage";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export function generateRoomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Creates a new multiplayer room with randomized questions for the selected mode.
 */
export async function createRoom(hostName, hostAvatar, mode = "forever_us_20") {
  const code = generateRoomCode();
  const questions = getRandomQuestions(15);

  const initialRoom = {
    code,
    mode,
    questions,
    createdAt: Date.now(),
    status: "waiting", // 'waiting' | 'ready' | 'playing' | 'completed'
    player1: {
      name: hostName.trim(),
      avatar: hostAvatar,
      connected: true,
      ready: true,
      progress: 0,
      answers: [],
      completed: false,
    },
    player2: null,
    result: null,
    replayCount: 0,
  };

  const db = getFirebaseDatabase();
  if (db) {
    const roomRef = ref(db, `rooms/${code}`);
    await set(roomRef, initialRoom);
    return { success: true, room: initialRoom, source: "firebase" };
  }

  // Fallback to FastAPI backend
  try {
    const res = await fetch(`${API_BASE}/api/room/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(initialRoom),
    });
    if (res.ok) {
      const data = await res.json();
      return { success: true, room: data, source: "backend" };
    }
  } catch (err) {
    console.warn("Backend room creation unavailable:", err);
  }

  return { success: true, room: initialRoom, source: "local" };
}

/**
 * Joins an existing multiplayer room with code.
 */
export async function joinRoom(roomCode, partnerName, partnerAvatar) {
  const cleanCode = roomCode.trim().toUpperCase();
  const db = getFirebaseDatabase();

  const partnerPayload = {
    name: partnerName.trim(),
    avatar: partnerAvatar,
    connected: true,
    ready: true,
    progress: 0,
    answers: [],
    completed: false,
  };

  if (db) {
    const roomRef = ref(db, `rooms/${cleanCode}`);
    const snapshot = await get(roomRef);
    if (!snapshot.exists()) {
      throw new Error(`Room '${cleanCode}' was not found. Please verify the code! 🔍`);
    }

    const roomData = snapshot.val();
    if (roomData.player2 && roomData.player2.name && roomData.player2.name !== partnerName) {
      throw new Error(`Room '${cleanCode}' already has 2 players connected! 💕`);
    }

    await update(roomRef, {
      player2: partnerPayload,
      status: "ready",
    });

    return {
      success: true,
      room: { ...roomData, player2: partnerPayload, status: "ready" },
      playerRole: "player2",
      source: "firebase",
    };
  }

  // Backend fallback
  const res = await fetch(`${API_BASE}/api/room/join`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      code: cleanCode,
      name: partnerName.trim(),
      avatar: partnerAvatar,
    }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || `Could not join room '${cleanCode}'`);
  }

  const roomData = await res.json();
  return { success: true, room: roomData, playerRole: "player2", source: "backend" };
}

/**
 * Real-time room subscription.
 */
export function subscribeToRoom(roomCode, onUpdate, onError) {
  const cleanCode = roomCode.trim().toUpperCase();
  const db = getFirebaseDatabase();

  if (db) {
    const roomRef = ref(db, `rooms/${cleanCode}`);
    const listener = onValue(
      roomRef,
      (snapshot) => {
        if (snapshot.exists()) {
          onUpdate(snapshot.val());
        } else {
          onError && onError(new Error("Room no longer exists"));
        }
      },
      (error) => {
        onError && onError(error);
      }
    );

    return () => off(roomRef, "value", listener);
  }

  // Backend WebSocket & Polling fallback
  let isClosed = false;
  let ws = null;
  let pollInterval = null;

  try {
    const wsProto = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = API_BASE.replace(/^https?:\/\//, "");
    ws = new WebSocket(`${wsProto}//${host}/ws/room/${cleanCode}`);

    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.type === "ROOM_UPDATE") {
          onUpdate(payload.room);
        }
      } catch (e) {}
    };

    ws.onerror = () => {
      startPolling();
    };
  } catch (err) {
    startPolling();
  }

  function startPolling() {
    if (pollInterval || isClosed) return;
    const fetchLatest = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/room/${cleanCode}`);
        if (res.ok) {
          const data = await res.json();
          onUpdate(data);
        }
      } catch (e) {}
    };

    fetchLatest();
    pollInterval = setInterval(fetchLatest, 1200);
  }

  return () => {
    isClosed = true;
    if (ws) {
      try { ws.close(); } catch (e) {}
    }
    if (pollInterval) {
      clearInterval(pollInterval);
    }
  };
}

/**
 * Updates a player's real-time answer progress.
 */
export async function updatePlayerProgress(roomCode, playerKey, qIndex, answers) {
  const cleanCode = roomCode.trim().toUpperCase();
  const db = getFirebaseDatabase();

  if (db) {
    const roomRef = ref(db, `rooms/${cleanCode}/${playerKey}`);
    await update(roomRef, {
      progress: qIndex,
      answers,
    });
    return;
  }

  try {
    await fetch(`${API_BASE}/api/room/${cleanCode}/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        player_key: playerKey,
        progress: qIndex,
        answers,
      }),
    });
  } catch (err) {}
}

/**
 * Updates questions synchronized in a multiplayer room (e.g. when a question is swapped).
 */
export async function updateRoomQuestions(roomCode, updatedQuestions) {
  if (!roomCode) return;
  const cleanCode = roomCode.trim().toUpperCase();
  const db = getFirebaseDatabase();

  if (db) {
    try {
      const roomRef = ref(db, `rooms/${cleanCode}`);
      await update(roomRef, { questions: updatedQuestions });
    } catch (e) {}
    return;
  }

  try {
    await fetch(`${API_BASE}/api/room/${cleanCode}/questions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questions: updatedQuestions }),
    });
  } catch (err) {}
}

/**
 * Submits player completion.
 * When both players have completed, computes smart love score and archives in memory wall.
 */
export async function completePlayerQuiz(roomCode, playerKey, finalAnswers, currentRoom, passageObj = null) {
  const cleanCode = roomCode.trim().toUpperCase();
  const db = getFirebaseDatabase();

  const otherPlayerKey = playerKey === "player1" ? "player2" : "player1";
  const otherPlayer = currentRoom[otherPlayerKey];
  const isBothCompleted = otherPlayer && otherPlayer.completed && otherPlayer.answers?.length > 0;

  let calculatedResult = null;
  if (isBothCompleted) {
    const p1Answers = playerKey === "player1" ? finalAnswers : otherPlayer.answers;
    const p2Answers = playerKey === "player2" ? finalAnswers : otherPlayer.answers;
    const p1Passage = playerKey === "player1" ? passageObj : otherPlayer.passage;
    const p2Passage = playerKey === "player2" ? passageObj : otherPlayer.passage;

    calculatedResult = calculateSmartScore(currentRoom.questions || [], p1Answers, p2Answers);
    calculatedResult.passage1 = p1Passage;
    calculatedResult.passage2 = p2Passage;

    // Save to Relationship Memory Wall
    saveGameHistory({
      name1: currentRoom.player1?.name || "Partner 1",
      name2: currentRoom.player2?.name || "Partner 2",
      avatar1: currentRoom.player1?.avatar || "🐱",
      avatar2: currentRoom.player2?.avatar || "🐰",
      score: calculatedResult.score,
      tier: calculatedResult.tier,
      title: calculatedResult.title,
      mode: currentRoom.mode || "forever_us_20",
      passage1: p1Passage,
      passage2: p2Passage,
    });
  }

  if (db) {
    const updates = {};
    updates[`rooms/${cleanCode}/${playerKey}/completed`] = true;
    updates[`rooms/${cleanCode}/${playerKey}/answers`] = finalAnswers;
    updates[`rooms/${cleanCode}/${playerKey}/passage`] = passageObj;
    updates[`rooms/${cleanCode}/${playerKey}/progress`] = currentRoom.questions?.length || 20;

    if (calculatedResult) {
      updates[`rooms/${cleanCode}/result`] = calculatedResult;
      updates[`rooms/${cleanCode}/status`] = "completed";
    }

    await update(ref(db), updates);
    return calculatedResult;
  }

  // Backend fallback
  try {
    const res = await fetch(`${API_BASE}/api/room/${cleanCode}/complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        player_key: playerKey,
        answers: finalAnswers,
        passage: passageObj,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      return data.result || calculatedResult;
    }
  } catch (err) {}

  return calculatedResult;
}

/**
 * Replays game together with a fresh set of randomized 20 questions!
 */
export async function replayRoom(roomCode, currentRoom) {
  const cleanCode = roomCode.trim().toUpperCase();
  const db = getFirebaseDatabase();

  const newQuestions = getRandomQuestions(15);

  const resetData = {
    status: "ready",
    result: null,
    questions: newQuestions,
    "player1/answers": [],
    "player1/passage": null,
    "player1/progress": 0,
    "player1/completed": false,
    "player2/answers": [],
    "player2/passage": null,
    "player2/progress": 0,
    "player2/completed": false,
  };

  if (db) {
    const roomRef = ref(db, `rooms/${cleanCode}`);
    await update(roomRef, resetData);
    return;
  }

  try {
    await fetch(`${API_BASE}/api/room/${cleanCode}/replay`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questions: newQuestions }),
    });
  } catch (err) {}
}
