import { useRef, useLayoutEffect, useState } from "react";
import gsap from "gsap";
import SpotlightCard from "./react-bits/SpotlightCard";
import GlitchText from "./react-bits/GlitchText";
import AnimatedBackground from "./react-bits/AnimatedBackground";

export default function Home({ onStart, playerName, difficulty, setDifficulty }) {
  const containerRef = useRef(null);
  const [showOfflineModal, setShowOfflineModal] = useState(false);
  const [p1Name, setP1Name] = useState(playerName || "Player 1");
  const [p2Name, setP2Name] = useState("Player 2");

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".home-btn", { 
        y: 30, 
        opacity: 0, 
        duration: 0.5, 
        stagger: 0.1, 
        ease: "back.out(1.7)",
        delay: 0.5 
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleOfflineStart = () => {
      onStart("local", { X: p1Name, O: p2Name });
  };

  /* State for Rules Modal */
  const [showRules, setShowRules] = useState(false);

  return (
    <div className="home-container" ref={containerRef} style={{ 
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        position: "relative",
        textAlign: "center"
    }}>
      <AnimatedBackground />



      {/* Rules Modal */}
      {showRules && (
          <div style={{
              position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 200,
              display: "flex", justifyContent: "center", alignItems: "center", backdropFilter: "blur(5px)"
          }} onClick={() => setShowRules(false)}>
              <div style={{ 
                  background: "#1a1d23", padding: "2.5rem", borderRadius: "16px", border: "1px solid #444", 
                  width: "90%", maxWidth: "500px", textAlign: "left", position: "relative" 
              }} onClick={e => e.stopPropagation()}>
                  <button 
                    onClick={() => setShowRules(false)}
                    style={{ position: "absolute", top: "15px", right: "15px", background: "none", border: "none", color: "#666", fontSize: "1.5rem", cursor: "pointer" }}
                  >✕</button>
                  
                  <h2 style={{ marginTop: 0, color: "#fff", fontSize: "2rem", marginBottom: "1.5rem", textAlign: "center" }}>How to Play 📜</h2>
                  
                  <div style={{ color: "#e8eaed", fontSize: "1.1rem", lineHeight: "1.6" }}>
                      <p><strong>1. Classic Goal:</strong> Get <strong>3 in a row</strong> (Horizontal, Vertical, Diagonal) to win.</p>
                      
                      <hr style={{ borderColor: "#333", margin: "1.5rem 0" }} />
                      
                      <p><strong>2. The Twist (Decay):</strong></p>
                      <ul style={{ paddingLeft: "20px", color: "#aaa" }}>
                          <li style={{ marginBottom: "10px" }}>You can only have <strong>3 pieces</strong> on the board.</li>
                          <li style={{ marginBottom: "10px" }}>When you place your <strong>4th piece</strong>, your <strong>1st piece</strong> (oldest) disappears! 💨</li>
                          <li>This means the board never fills up. <strong>No Draws, Ever.</strong></li>
                      </ul>

                      <div style={{ background: "rgba(255,255,255,0.05)", padding: "1rem", borderRadius: "8px", marginTop: "1.5rem", borderLeft: "4px solid #f0ad4e" }}>
                        <strong style={{ color: "#f0ad4e" }}>💡 Strategy Tip:</strong><br/>
                        Don't just look at empty spaces. Remember which piece is about to vanish! (Use <strong>Easy Mode</strong> to see a warning blink).
                      </div>
                  </div>
                  
                  <button 
                    onClick={() => setShowRules(false)}
                    style={{ 
                        width: "100%", marginTop: "2rem", padding: "12px", 
                        background: "#fff", color: "#000", fontWeight: "bold", 
                        border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "1.1rem"
                    }}
                  >
                      Got it!
                  </button>
              </div>
          </div>
      )}

      {/* Offline Name Modal Overlay */}
      {showOfflineModal && (
          <div style={{
              position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 100,
              display: "flex", justifyContent: "center", alignItems: "center", backdropFilter: "blur(5px)"
          }} onClick={() => setShowOfflineModal(false)}>
              
              <div style={{ 
                  background: "#1a1d23", padding: "2.5rem", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.1)", 
                  width: "90%", maxWidth: "420px", boxShadow: "0 10px 40px rgba(0,0,0,0.6)", position: "relative",
                  animation: "fadeIn 0.2s ease-out"
              }} onClick={e => e.stopPropagation()}>
                  
                  <h2 style={{ 
                      marginTop: 0, marginBottom: "1.5rem", fontSize: "1.5rem", color: "#fff", fontWeight: "600"
                  }}>
                      Enter Player Names
                  </h2>
                  
                  {/* Player 1 Input */}
                  <div style={{ marginBottom: "1.2rem", textAlign: "left" }}>
                      <label style={{ display: "block", marginBottom: "0.5rem", color: "#ccc", fontSize: "0.9rem" }}>
                          Player 1 (X)
                      </label>
                      <input 
                        value={p1Name} 
                        onChange={e => setP1Name(e.target.value)} 
                        autoFocus
                        style={{ 
                            width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #444", 
                            background: "#2a2e37", color: "white", outline: "none", fontSize: "1rem"
                        }}
                        onFocus={e => e.target.style.borderColor = "#888"}
                        onBlur={e => e.target.style.borderColor = "#444"}
                      />
                  </div>
                  
                  {/* Player 2 Input */}
                  <div style={{ marginBottom: "2rem", textAlign: "left" }}>
                      <label style={{ display: "block", marginBottom: "0.5rem", color: "#ccc", fontSize: "0.9rem" }}>
                          Player 2 (O)
                      </label>
                      <input 
                        value={p2Name} 
                        onChange={e => setP2Name(e.target.value)} 
                        style={{ 
                            width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #444", 
                            background: "#2a2e37", color: "white", outline: "none", fontSize: "1rem"
                        }}
                        onFocus={e => e.target.style.borderColor = "#888"}
                        onBlur={e => e.target.style.borderColor = "#444"}
                      />
                  </div>
                  
                  {/* Action Buttons */}
                  <div style={{ display: "flex", gap: "1rem" }}>
                      <button 
                        onClick={() => setShowOfflineModal(false)} 
                        style={{ 
                            flex: 1, padding: "12px", background: "transparent", color: "#aaa", 
                            border: "1px solid #444", borderRadius: "8px", cursor: "pointer", fontSize: "0.95rem",
                            transition: "all 0.2s"
                        }}
                        onMouseEnter={e => {e.target.style.background = "#2a2e37"; e.target.style.color = "#fff"}}
                        onMouseLeave={e => {e.target.style.background = "transparent"; e.target.style.color = "#aaa"}}
                      >
                          Cancel
                      </button>
                      <button 
                        onClick={handleOfflineStart} 
                        style={{ 
                            flex: 2, padding: "12px", 
                            background: "#fff", color: "#000", border: "none", borderRadius: "8px", 
                            cursor: "pointer", fontWeight: "bold", fontSize: "0.95rem",
                            transition: "all 0.2s"
                        }}
                        onMouseEnter={e => e.target.style.background = "#ddd"}
                        onMouseLeave={e => e.target.style.background = "#fff"}
                      >
                          Start Game
                      </button>
                  </div>
              </div>
          </div>
      )}
      
      <div style={{ marginBottom: "1rem" }}>
         <GlitchText text="TIC-TAC-TOE" />
      </div>
      
      <div style={{ marginBottom: "0.5rem", color: "#e8eaed", fontSize: "1.1rem", opacity: 0.8, letterSpacing: "1px" }}>
          WELCOME COMMANDER <span style={{ color: "#fff", fontWeight: "bold", textTransform: "uppercase" }}>{playerName}</span>
      </div>

      <p className="home-subtitle" style={{ fontSize: "1.2rem", color: "#aaa", marginBottom: "3rem", letterSpacing: "2px" }}>
        BUT NO DRAW
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", maxWidth: "400px", margin: "0 auto" }}>
        <SpotlightCard onClick={() => setShowOfflineModal(true)} className="home-btn">
             <div style={{ padding: "1.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                    <img width="30" height="30" src="https://img.icons8.com/ios/50/controller.png" alt="controller" style={{ filter: "invert(1)" }} />
                    <h3 style={{ margin: 0, fontSize: "1.5rem" }}>Play Offline</h3>
                </div>
                <p style={{ margin: "5px 0 0 0", color: "#888", fontSize: "0.9rem" }}>Local Multiplayer on one device</p>
             </div>
        </SpotlightCard>

        <SpotlightCard onClick={() => onStart("ai")} className="home-btn">
             <div style={{ padding: "1.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                    <img width="30" height="30" src="https://img.icons8.com/ios/50/my-computer.png" alt="my-computer" style={{ filter: "invert(1)" }} />
                    <h3 style={{ margin: 0, fontSize: "1.5rem" }}>Vs Computer</h3>
                </div>
                <p style={{ margin: "5px 0 0 0", color: "#888", fontSize: "0.9rem" }}>Challenge the Minimax AI</p>
             </div>
        </SpotlightCard>

        <SpotlightCard onClick={() => onStart("online")} className="home-btn">
             <div style={{ padding: "1.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                    <img width="30" height="30" src="https://img.icons8.com/pulsar-line/48/friendship.png" alt="friendship" style={{ filter: "invert(1)" }} />
                    <h3 style={{ margin: 0, fontSize: "1.5rem" }}>Play Online</h3>
                </div>
                <p style={{ margin: "5px 0 0 0", color: "#888", fontSize: "0.9rem" }}>Real-time Multiplayer</p>
             </div>
        </SpotlightCard>

        {/* Difficulty Toggle */}
        {/* Controls Container */}
        <div className="home-btn" style={{ 
            marginTop: "2rem", 
            display: "flex", 
            gap: "1.5rem",
            alignItems: "center",
            justifyContent: "center"
        }}>
            
            {/* Difficulty Toggle (Segmented Control) */}
            <div style={{ 
                display: "flex", 
                background: "#1a1d23", 
                padding: "4px", 
                borderRadius: "50px", 
                border: "1px solid rgba(255,255,255,0.08)", 
                position: "relative"
            }}>
                <button 
                    onClick={() => setDifficulty("easy")}
                    style={{
                        background: difficulty === "easy" ? "rgba(0, 255, 136, 0.15)" : "transparent",
                        color: difficulty === "easy" ? "#00ff88" : "#888",
                        border: "none",
                        padding: "8px 20px",
                        borderRadius: "40px",
                        cursor: "pointer",
                        fontSize: "0.9rem",
                        fontWeight: difficulty === "easy" ? "bold" : "normal",
                        transition: "all 0.3s ease",
                        boxShadow: difficulty === "easy" ? "0 0 10px rgba(0, 255, 136, 0.1)" : "none"
                    }}
                >
                    Easy
                </button>
                <button 
                    onClick={() => setDifficulty("hard")}
                    style={{
                        background: difficulty === "hard" ? "rgba(255, 77, 77, 0.15)" : "transparent",
                        color: difficulty === "hard" ? "#ff4d4d" : "#888",
                        border: "none",
                        padding: "8px 20px",
                        borderRadius: "40px",
                        cursor: "pointer",
                        fontSize: "0.9rem",
                        fontWeight: difficulty === "hard" ? "bold" : "normal",
                        transition: "all 0.3s ease",
                        boxShadow: difficulty === "hard" ? "0 0 10px rgba(255, 77, 77, 0.1)" : "none"
                    }}
                >
                    Hard
                </button>
            </div>

            {/* How to Play Button */}
            <button 
                onClick={() => setShowRules(true)}
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "50px",
                    padding: "8px 20px",
                    cursor: "pointer",
                    color: "#e8eaed",
                    fontSize: "0.9rem",
                    transition: "all 0.3s ease"
                }}
                onMouseEnter={e => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 5px 15px rgba(0,0,0,0.3)";
                }}
                onMouseLeave={e => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                }}
            >
                <img width="20" height="20" src="https://img.icons8.com/ios/50/question-mark--v1.png" alt="?" style={{ filter: "invert(1)" }} />
                <span>How to Play</span>
            </button>
        </div>


      </div>
    </div>
  );
}
