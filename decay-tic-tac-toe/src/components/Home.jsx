import { useRef, useLayoutEffect, useState } from "react";
import gsap from "gsap";
import SpotlightCard from "./react-bits/SpotlightCard";
import GlitchText from "./react-bits/GlitchText";
import AnimatedBackground from "./react-bits/AnimatedBackground";

export default function Home({ onStart, playerName }) {
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

      {/* Offline Name Modal Overlay */}
      {showOfflineModal && (
          <div style={{
              position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 100,
              display: "flex", justifyContent: "center", alignItems: "center"
          }}>
              <div style={{ background: "#222", padding: "2rem", borderRadius: "12px", border: "1px solid #444", width: "90%", maxWidth: "400px" }}>
                  <h2 style={{ marginTop: 0 }}>Enter Player Names</h2>
                  <div style={{ marginBottom: "1rem" }}>
                      <label style={{ display: "block", textAlign: "left", marginBottom: "0.5rem", color: "#888" }}>Player 1 (X)</label>
                      <input 
                        value={p1Name} 
                        onChange={e => setP1Name(e.target.value)} 
                        style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "none", background: "#333", color: "white" }}
                      />
                  </div>
                  <div style={{ marginBottom: "2rem" }}>
                      <label style={{ display: "block", textAlign: "left", marginBottom: "0.5rem", color: "#888" }}>Player 2 (O)</label>
                      <input 
                        value={p2Name} 
                        onChange={e => setP2Name(e.target.value)} 
                        style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "none", background: "#333", color: "white" }}
                      />
                  </div>
                  <div style={{ display: "flex", gap: "1rem" }}>
                      <button onClick={() => setShowOfflineModal(false)} style={{ flex: 1, background: "#444", color: "white" }}>Cancel</button>
                      <button onClick={handleOfflineStart} style={{ flex: 1, background: "#6644ff", color: "white" }}>Start Game</button>
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
      </div>
    </div>
  );
}
