import gsap from "gsap";

export function createEffects() {
  function spawnParticles(element, type = "merge") {
    if (!element) return;
    
    // Create particle container
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const count = type === "explode" ? 12 : 6;
    const color = type === "explode" ? "#ff4444" : "#44ff44";

    for (let i = 0; i < count; i++) {
        const p = document.createElement("div");
        p.style.position = "fixed";
        p.style.left = centerX + "px";
        p.style.top = centerY + "px";
        p.style.width = "4px";
        p.style.height = "4px";
        p.style.backgroundColor = color;
        p.style.borderRadius = "50%";
        p.style.pointerEvents = "none";
        p.style.zIndex = "9999";
        document.body.appendChild(p);

        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 60 + 20;

        gsap.to(p, {
            x: Math.cos(angle) * velocity,
            y: Math.sin(angle) * velocity,
            opacity: 0,
            duration: 0.6,
            ease: "power2.out",
            onComplete: () => p.remove()
        });
    }
  }

  return { spawnParticles };
}
