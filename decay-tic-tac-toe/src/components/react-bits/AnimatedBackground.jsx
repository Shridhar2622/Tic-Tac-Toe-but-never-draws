import { useEffect, useRef } from "react";

export default function AnimatedBackground() {
  return (
    <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        background: "#050505",
        overflow: "hidden",
        perspective: "1000px"
    }}>
        {/* Grid Floor */}
        <div style={{
            position: "absolute",
            bottom: "-50%",
            left: "-50%",
            width: "200%",
            height: "100%",
            backgroundImage: `
                linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
            transform: "rotateX(60deg)",
            animation: "gridMove 20s linear infinite"
        }} />
        
        {/* Glow */}
        <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "100%",
            height: "100%",
            transform: "translate(-50%, -50%)",
            background: "radial-gradient(circle, rgba(100, 100, 255, 0.08) 0%, transparent 70%)"
        }} />

        <style>
          {`
            @keyframes gridMove {
                0% { transform: rotateX(60deg) translateY(0); }
                100% { transform: rotateX(60deg) translateY(60px); }
            }
          `}
        </style>
    </div>
  );
}
