import { useLayoutEffect, useRef, useState, useMemo } from "react";
import gsap from "gsap";
import Board from "./Board";
import WinModal from "./WinModal";
import { useGame } from "../game/useGame";
import { createSounds } from "../game/sounds";
import { createEffects } from "../game/effects";
import "../styles/board.css";

export default function Game({ mode, onBack, playerNames, setPlayerNames, myIdentity, sounds }) {
  // 🔹 game state
  const [board, setBoard] = useState(Array(9).fill(null));
  const [moves, setMoves] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [winner, setWinner] = useState(null);
  
  // 🔹 online state
  const [roomId, setRoomId] = useState(null);
  const [joinId, setJoinId] = useState("");
  // const [musicEnabled, setMusicEnabled] = useState(false); // REMOVED local state

// 🔹 resources
  // const sounds = useMemo(() => createSounds(), []); // ❌ Use global sounds
  const effects = useMemo(() => createEffects(), []);

  // 🔹 refs for animation
  const headerRef = useRef(null);
  const boardRef = useRef(null);

  // 🎬 entrance animation
  useLayoutEffect(() => {
    if (!headerRef.current) return;
    
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

    tl.fromTo(headerRef.current, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 });
    
    // Board animation only if board is rendered
    if (boardRef.current) {
        tl.fromTo(boardRef.current, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, "-=0.2")
          .fromTo(
            boardRef.current.querySelectorAll(".cell"),
            { scale: 0.95, opacity: 0 },
            { scale: 1, opacity: 1, stagger: 0.04, duration: 0.25 },
            "-=0.25"
          );
    }
    
    return () => tl.kill(); // Cleanup
  }, [roomId]); 

  // 🎵 Audio Effects (Win Sound only - local)
  useLayoutEffect(() => {
    if (winner && sounds.winSound) {
        sounds.winSound.currentTime = 0;
        sounds.winSound.play().catch(e => console.log("Win sound error", e));
    }
  }, [winner, sounds]);

  // 🔹 hook that decides game behavior
  const gameConfig = useMemo(() => ({
    board, setBoard, moves, setMoves, currentPlayer, setCurrentPlayer,
    winner, setWinner, sounds, effects, roomId, setRoomId,
    setPlayerNames, myIdentity
  }), [board, moves, currentPlayer, winner, roomId, sounds, effects, setPlayerNames, myIdentity]);

  const game = useGame(mode, gameConfig);

  // 🔁 replay
  function replayGame() {
    setBoard(Array(9).fill(null));
    setMoves([]);
    setWinner(null);
    setCurrentPlayer("X");
    
    if (mode === "online") {
        setRoomId(null);
        game.createRoom(); 
    }
  }

  // Helper for names
  const currentName = playerNames[currentPlayer];
  const winnerName = winner ? playerNames[winner] : null;

  // 🌍 ONLINE LOBBY VIEW (Before joining a room)
  if (mode === "online" && !roomId) {
      return (
        <div className="game-container" style={{
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            minHeight: "100vh", width: "100%", textAlign: "center", gap: "2rem"
        }}>
            <h1 style={{ fontSize: "2.5rem", margin: 0 }}>ONLINE LOBBY</h1>
            <p style={{ color: "#888", marginTop: "-1.5rem" }}>Multiplayer Zone</p>

            <div style={{ display: "flex", flexDirection: "column", gap: "2rem", width: "100%", maxWidth: "350px" }}>
                
                {/* Create Room Option */}
                <div 
                    onClick={() => game.createRoom()}
                    style={{
                        padding: "2rem",
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "12px",
                        cursor: "pointer",
                        transition: "all 0.2s"
                    }}
                    className="lobby-card"
                >
                    <h2 style={{ margin: "0 0 10px 0" }}>⚡ Create Room</h2>
                    <p style={{ margin: 0, color: "#888", fontSize: "0.9rem" }}>Host a new game and invite a friend</p>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "1rem", color: "#555" }}>
                    <div style={{ height: "1px", background: "#333", flex: 1 }}></div>
                    OR
                    <div style={{ height: "1px", background: "#333", flex: 1 }}></div>
                </div>

                {/* Join Room Option */}
                <div style={{
                    padding: "2rem",
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.05)",
                    borderRadius: "12px"
                }}>
                    <h2 style={{ margin: "0 0 15px 0" }}>🔗 Join Room</h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        <input 
                            placeholder="Enter Room ID" 
                            value={joinId} 
                            onChange={e => setJoinId(e.target.value)}
                            style={{ 
                                width: "100%", padding: "12px", borderRadius: "8px", 
                                border: "1px solid #444", background: "#111", color: "white", 
                                outline: "none", textAlign: "center", fontSize: "1.1rem"
                            }}
                        />
                        <button 
                            onClick={() => game.joinRoom(joinId)}
                            style={{ width: "100%", padding: "12px", background: "#fff", color: "#000", fontWeight: "bold", border: "none" }}
                        >
                            JOIN
                        </button>
                    </div>
                </div>

                {/* Audio Toggle in Lobby */}
                <button 
                    onClick={toggleMusic}
                    style={{ 
                        background: "transparent", 
                        border: "1px solid rgba(255,255,255,0.3)", 
                        borderRadius: "50px",
                        cursor: "pointer", 
                        padding: "8px 16px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        margin: "1rem auto 0",
                        color: "#ddd",
                        fontSize: "0.9rem"
                    }}
                >
                    {musicEnabled ? (
                        <>
                            <img width="20" height="20" src="https://img.icons8.com/ios/50/high-volume--v1.png" alt="Music On" style={{ filter: "invert(1)" }} />
                            <span>Music On</span>
                        </>
                    ) : (
                        <>
                            <img width="20" height="20" src="https://img.icons8.com/ios/50/mute--v1.png" alt="Music Off" style={{ filter: "invert(0.5)" }} />
                            <span>Music Off</span>
                        </>
                    )}
                </button>

                <button onClick={onBack} style={{ background: "transparent", color: "#666", marginTop: "1rem", border: "none", cursor: "pointer" }}>
                    ← Back to Home
                </button>
            </div>
        </div>
      );
  }

  // 🎮 ACTIVE GAME VIEW
  return (
    <div className="game-container" style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        width: "100%"
    }}>
        <header className="header" ref={headerRef} style={{ width: "100%", maxWidth: "400px" }}>
          <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <button onClick={onBack} style={{ padding: '0.5rem 1rem' }}>← Back</button>
          </div>

          <h1>
            {mode === 'local' ? 'Offline Game' : mode === 'ai' ? 'Vs Computer' : 'Online Game'}
          </h1>
          
          {mode === "online" && roomId && (
              <p style={{ color: '#888', fontSize: '0.9rem' }}>
                  Room: <span style={{ color: '#fff', fontWeight: 'bold', fontSize: "1.2rem", marginLeft: "5px" }}>{roomId}</span>
              </p>
          )}

          <p className="subtitle">
            {winner ? `${winnerName} Wins!` : `${currentName}'s Chance`}
          </p>
        </header>

        <div ref={boardRef} style={{
            transition: "all 0.5s ease",
            borderRadius: "10px",
            // Glow effect based on current player
            boxShadow: !winner ? (currentPlayer === "X" ? "0 0 30px rgba(0, 255, 255, 0.3)" : "0 0 30px rgba(255, 0, 0, 0.3)") : "none"
        }}>
          {/* Only show board if offline, ai, OR (online and in room) */}
          {(mode !== "online" || roomId) && (
              <Board
                board={board}
                onMove={game.onMove}
                spawnParticles={effects.spawnParticles}
              />
          )}
        </div>

      {winner && <WinModal winner={winnerName} onReplay={replayGame} onExit={onBack} />}
    </div>
  );
}
