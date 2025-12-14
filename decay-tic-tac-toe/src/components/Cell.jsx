import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Cell({
  value,
  onClick,
  index,
  spawnParticles,
  isWinning // 👈 NEW
}) {
  const cellRef = useRef(null);
  const symbolRef = useRef(null);
  const prevValue = useRef(null);

  useEffect(() => {
    if (
      prevValue.current === null &&
      value !== null &&
      cellRef.current &&
      symbolRef.current
    ) {
      spawnParticles(cellRef.current, "merge");

      gsap.fromTo(
        symbolRef.current,
        { scale: 0.6, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.2,
          ease: "power2.out",
        }
      );
    }

    prevValue.current = value;
  }, [value, spawnParticles]);

  return (
    <div
      ref={cellRef}
      className={`cell ${isWinning ? "cell-win" : ""}`} // 👈 HERE
      data-index={index}
      onClick={onClick}
    >
      {value && (
        <span ref={symbolRef} className="symbol">
          {value}
        </span>
      )}
    </div>
  );
}
