"""
FastAPI Backend for Love Score Quiz
Endpoints:
- POST /api/submit
- GET /api/health
- GET /api/submissions (view recent results)
- POST /api/room/create (multiplayer room creation)
- POST /api/room/join (multiplayer room join)
- GET /api/room/{code} (multiplayer room fetch)
- POST /api/room/{code}/update (multiplayer progress update)
- POST /api/room/{code}/complete (multiplayer player completion)
- POST /api/room/{code}/replay (multiplayer replay restart)
- WebSocket /ws/room/{code} (real-time live synchronization)
"""

import os
import json
import asyncio
from typing import List, Dict, Optional, Any
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv

from scoring import calculate_love_score
from sheets import save_to_sheet, LOCAL_BACKUP_FILE

load_dotenv()

app = FastAPI(
    title="Love Score Quiz API",
    description="Calculate couple compatibility, multiplayer synchronization, and save results",
    version="2.0.0"
)

# CORS configuration
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
allowed_origins = [
    FRONTEND_URL,
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "https://lovematchscore.netlify.app",
]
EXTRA_ORIGINS = os.getenv("ALLOWED_ORIGINS", "")
if EXTRA_ORIGINS:
    for orig in EXTRA_ORIGINS.split(","):
        cleaned = orig.strip()
        if cleaned and cleaned not in allowed_origins:
            allowed_origins.append(cleaned)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"https://.*\.netlify\.app|https://.*\.web\.app|https://.*\.firebaseapp\.com|https://.*\.run\.app|https://.*\.onrender\.com|https://.*\.up\.railway\.app|http://localhost:\d+|http://127\.0\.0\.1:\d+",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# In-memory room store & active WebSocket connections
ROOMS: Dict[str, Dict[str, Any]] = {}
ACTIVE_ROOM_CONNECTIONS: Dict[str, List[WebSocket]] = {}


async def broadcast_room_update(room_code: str):
    """Broadcasts room state to all connected WebSockets in this room."""
    clean_code = room_code.upper()
    room_data = ROOMS.get(clean_code)
    if not room_data:
        return

    connections = ACTIVE_ROOM_CONNECTIONS.get(clean_code, [])
    dead_connections = []

    message = json.dumps({"type": "ROOM_UPDATE", "room": room_data})

    for ws in connections:
        try:
            await ws.send_text(message)
        except Exception:
            dead_connections.append(ws)

    for dead in dead_connections:
        if dead in connections:
            connections.remove(dead)


class SubmitRequest(BaseModel):
    name1: str = Field(..., description="First person's name", min_length=1)
    name2: str = Field(..., description="Second person's name", min_length=1)
    answers1: List[int] = Field(..., description="Answers 1-4 for Person 1")
    answers2: List[int] = Field(..., description="Answers 1-4 for Person 2")


class SubmitResponse(BaseModel):
    score: int
    tier: str
    message: str
    categories: Dict[str, int]
    question_matches: Optional[List[int]] = None
    sheet_status: Optional[Dict[str, str]] = None


@app.get("/api/health")
def health_check():
    """Health check endpoint to verify backend service."""
    return {
        "status": "healthy",
        "service": "Love Score Quiz Backend",
        "version": "2.0.0",
        "active_rooms": len(ROOMS)
    }


@app.post("/api/submit", response_model=SubmitResponse)
def submit_quiz(data: SubmitRequest):
    """
    Submits quiz responses for both individuals, calculates love score,
    and records the result to Google Sheets (or local backup).
    """
    if not data.answers1 or not data.answers2:
        raise HTTPException(status_code=400, detail="Answers cannot be empty")

    calc_result = calculate_love_score(data.answers1, data.answers2)

    sheet_info = save_to_sheet(
        name1=data.name1.strip(),
        name2=data.name2.strip(),
        score=calc_result["score"],
        tier=calc_result["tier"],
        categories=calc_result["categories"]
    )

    return SubmitResponse(
        score=calc_result["score"],
        tier=calc_result["tier"],
        message=calc_result["message"],
        categories=calc_result["categories"],
        question_matches=calc_result.get("question_matches"),
        sheet_status=sheet_info
    )


# --- MULTIPLAYER ROOM ENDPOINTS ---

class CreateRoomRequest(BaseModel):
    code: str
    createdAt: Optional[int] = None
    status: str = "waiting"
    mode: Optional[str] = "compatibility"
    questions: Optional[List[Dict[str, Any]]] = None
    player1: Dict[str, Any]
    player2: Optional[Dict[str, Any]] = None
    result: Optional[Dict[str, Any]] = None
    replayCount: int = 0


@app.post("/api/room/create")
async def create_room(data: CreateRoomRequest):
    code = data.code.upper()
    room_obj = data.dict()
    room_obj["code"] = code
    ROOMS[code] = room_obj
    await broadcast_room_update(code)
    return room_obj


class JoinRoomRequest(BaseModel):
    code: str
    name: str
    avatar: str = "🐰"


@app.post("/api/room/join")
async def join_room(data: JoinRoomRequest):
    code = data.code.upper().strip()
    if code not in ROOMS:
        raise HTTPException(status_code=404, detail=f"Room '{code}' not found")

    room = ROOMS[code]
    if room.get("player2") and room["player2"].get("name") and room["player2"].get("name") != data.name:
        raise HTTPException(status_code=400, detail="Room is already full with 2 players!")

    room["player2"] = {
        "name": data.name.strip(),
        "avatar": data.avatar,
        "connected": True,
        "ready": True,
        "progress": 0,
        "answers": [],
        "completed": False
    }
    room["status"] = "ready"
    ROOMS[code] = room

    await broadcast_room_update(code)
    return room


@app.get("/api/room/{code}")
def get_room(code: str):
    code = code.upper().strip()
    if code not in ROOMS:
        raise HTTPException(status_code=404, detail="Room not found")
    return ROOMS[code]


class UpdateQuestionsRequest(BaseModel):
    questions: List[Dict[str, Any]]


@app.post("/api/room/{code}/questions")
async def update_room_questions(code: str, data: UpdateQuestionsRequest):
    code = code.upper().strip()
    if code not in ROOMS:
        raise HTTPException(status_code=404, detail="Room not found")
    ROOMS[code]["questions"] = data.questions
    await broadcast_room_update(code)
    return ROOMS[code]


class UpdateProgressRequest(BaseModel):
    player_key: str  # 'player1' or 'player2'
    progress: int
    answers: List[int]


@app.post("/api/room/{code}/update")
async def update_room_progress(code: str, data: UpdateProgressRequest):
    code = code.upper().strip()
    if code not in ROOMS:
        raise HTTPException(status_code=404, detail="Room not found")
    if data.player_key not in ("player1", "player2"):
        raise HTTPException(status_code=400, detail="Invalid player_key. Must be 'player1' or 'player2'")

    room = ROOMS[code]
    if data.player_key in room and room[data.player_key]:
        room[data.player_key]["progress"] = data.progress
        room[data.player_key]["answers"] = data.answers
        room["status"] = "playing"

    await broadcast_room_update(code)
    return room


class CompleteQuizRequest(BaseModel):
    player_key: str
    answers: List[int]
    passage: Optional[Dict[str, Any]] = None


@app.post("/api/room/{code}/complete")
async def complete_quiz(code: str, data: CompleteQuizRequest):
    code = code.upper().strip()
    if code not in ROOMS:
        raise HTTPException(status_code=404, detail="Room not found")
    if data.player_key not in ("player1", "player2"):
        raise HTTPException(status_code=400, detail="Invalid player_key. Must be 'player1' or 'player2'")

    room = ROOMS[code]
    if data.player_key in room and room[data.player_key]:
        room[data.player_key]["completed"] = True
        room[data.player_key]["answers"] = data.answers
        room[data.player_key]["passage"] = data.passage
        room[data.player_key]["progress"] = len(room.get("questions") or []) or 20

    # Check if both completed
    p1 = room.get("player1", {})
    p2 = room.get("player2", {})
    if p1 and p2 and p1.get("completed") and p2.get("completed"):
        ans1 = p1.get("answers", [])
        ans2 = p2.get("answers", [])
        calc = calculate_love_score(ans1, ans2)
        calc["passage1"] = p1.get("passage")
        calc["passage2"] = p2.get("passage")
        room["result"] = calc
        room["status"] = "completed"

        # Also save to sheets / local backup
        save_to_sheet(
            name1=p1.get("name", "Player 1"),
            name2=p2.get("name", "Player 2"),
            score=calc["score"],
            tier=calc["tier"],
            categories=calc["categories"]
        )

    await broadcast_room_update(code)
    return room


class ReplayRoomRequest(BaseModel):
    questions: Optional[List[Dict[str, Any]]] = None


@app.post("/api/room/{code}/replay")
async def replay_game(code: str, data: Optional[ReplayRoomRequest] = None):
    code = code.upper().strip()
    if code not in ROOMS:
        raise HTTPException(status_code=404, detail="Room not found")

    room = ROOMS[code]
    if room.get("player1"):
        room["player1"]["answers"] = []
        room["player1"]["progress"] = 0
        room["player1"]["completed"] = False
    if room.get("player2"):
        room["player2"]["answers"] = []
        room["player2"]["progress"] = 0
        room["player2"]["completed"] = False

    if data and data.questions:
        room["questions"] = data.questions

    room["result"] = None
    room["status"] = "ready"
    room["replayCount"] = room.get("replayCount", 0) + 1

    await broadcast_room_update(code)
    return room


# --- WEBSOCKET REAL-TIME SYNC ---

@app.websocket("/ws/room/{code}")
async def websocket_room(websocket: WebSocket, code: str):
    clean_code = code.upper().strip()
    await websocket.accept()

    if clean_code not in ACTIVE_ROOM_CONNECTIONS:
        ACTIVE_ROOM_CONNECTIONS[clean_code] = []
    ACTIVE_ROOM_CONNECTIONS[clean_code].append(websocket)

    # Send current room state on initial connection
    if clean_code in ROOMS:
        await websocket.send_text(json.dumps({"type": "ROOM_UPDATE", "room": ROOMS[clean_code]}))

    try:
        while True:
            data_text = await websocket.receive_text()
            try:
                msg = json.loads(data_text)
                # Client can push events
                if msg.get("type") == "PING":
                    await websocket.send_text(json.dumps({"type": "PONG"}))
            except Exception:
                pass
    except WebSocketDisconnect:
        if clean_code in ACTIVE_ROOM_CONNECTIONS and websocket in ACTIVE_ROOM_CONNECTIONS[clean_code]:
            ACTIVE_ROOM_CONNECTIONS[clean_code].remove(websocket)


@app.get("/api/submissions")
def get_recent_submissions():
    """Returns local recent submissions for preview."""
    if os.path.exists(LOCAL_BACKUP_FILE):
        try:
            with open(LOCAL_BACKUP_FILE, "r", encoding="utf-8") as f:
                records = json.load(f)
                return {"count": len(records), "records": records[-10:]}
        except Exception as e:
            return {"error": str(e), "records": []}
    return {"count": 0, "records": []}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
