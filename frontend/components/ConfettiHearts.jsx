"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

export default function ConfettiHearts({ score = 85 }) {
  useEffect(() => {
    if (score < 80) return;

    // Custom heart confetti shape
    const heartShape = confetti.shapeFromPath({
      path: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
    });

    const colors = ["#FF6F91", "#FFB6C9", "#FF477E", "#FFAEC2", "#FFFFFF", "#FFD166"];

    // First burst
    confetti({
      particleCount: 50,
      spread: 90,
      origin: { y: 0.6 },
      shapes: [heartShape, "circle"],
      colors,
      scalar: 1.2,
      zIndex: 99999,
    });

    // Secondary celebratory bursts from sides
    const end = Date.now() + 2500;
    const interval = setInterval(() => {
      if (Date.now() > end) {
        return clearInterval(interval);
      }
      confetti({
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        origin: { x: Math.random(), y: Math.random() * 0.4 + 0.1 },
        colors,
        shapes: [heartShape],
        scalar: 1.1,
        zIndex: 99999,
      });
    }, 450);

    return () => clearInterval(interval);
  }, [score]);

  return null;
}
