import { useState, useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import AnimatedBackground from "./react-bits/AnimatedBackground";
import SpotlightCard from "./react-bits/SpotlightCard";

export default function Welcome({ onComplete }) {
  const [name, setName] = useState("");
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // 🔒 Force a clean visible state first
      gsap.set(containerRef.current, { opacity: 1 });

      // 🎬 Deterministic animation (StrictMode safe)
      gsap.fromTo(
        containerRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1,
          ease: "power2.out",
          clearProps: "opacity", // remove inline styles after animation
        }
      );
    }, containerRef);

    return () => ctx.revert(); // ✅ prevents double-run glitches
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) onComplete(name.trim());
  };

  return (
    <div
      ref={containerRef}
      className="welcome-container"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        textAlign: "center",
        position: "relative",

        // 🔒 prevents background blend / opacity bleed
        isolation: "isolate",
      }}
    >
      {/* 🌌 Background */}
      <AnimatedBackground />

      {/* 🧍 Foreground content */}
      <div
        style={{
          zIndex: 10,
          maxWidth: "400px",
          width: "100%",
          padding: "20px",
          position: "relative",
        }}
      >
        <h1 style={{ marginBottom: "2rem", fontSize: "2.5rem" }}>
          Who are you?
        </h1>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            style={{
              padding: "1rem",
              borderRadius: "12px",
              border: "2px solid #fff",
              background: "#000",
              color: "#fff",
              fontSize: "1.5rem",
              fontWeight: "bold",
              textAlign: "center",
              outline: "none",
              boxShadow: "0 0 20px rgba(255, 255, 255, 0.4)",
            }}
          />

          <SpotlightCard onClick={handleSubmit} className="start-btn">
            <div
              style={{
                padding: "1rem",
                fontSize: "1.2rem",
                fontWeight: "bold",
              }}
            >
              Enter Game
            </div>
          </SpotlightCard>
        </form>
      </div>
    </div>
  );
}
