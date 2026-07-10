"use client";

import { useEffect } from "react";

export default function CustomCursor() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const dot = document.createElement("div");
    const ring = document.createElement("div");

    Object.assign(dot.style, {
      position: "fixed",
      top: "0px",
      left: "0px",
      width: "8px",
      height: "8px",
      backgroundColor: "#D92323",
      borderRadius: "50%",
      pointerEvents: "none",
      zIndex: "99999",
      transform: "translate(-9999px, -9999px)",
    });

    Object.assign(ring.style, {
      position: "fixed",
      top: "0px",
      left: "0px",
      width: "36px",
      height: "36px",
      border: "2px solid rgba(217,35,35,0.4)",
      borderRadius: "50%",
      pointerEvents: "none",
      zIndex: "99998",
      transform: "translate(-9999px, -9999px)",
      transition: "width 0.2s, height 0.2s, border-color 0.2s",
    });

    document.body.appendChild(dot);
    document.body.appendChild(ring);

    let mx = 0;
    let my = 0;
    let rx = 0;
    let ry = 0;

    function move(e: MouseEvent) {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate(${mx - 4}px, ${my - 4}px)`;
    }

    function loop() {
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;
      ring.style.transform = `translate(${rx - 18}px, ${ry - 18}px)`;
      requestAnimationFrame(loop);
    }

    function over(e: MouseEvent) {
      const t = (e.target as HTMLElement).closest?.("a, button, input, textarea, select, [role='button']");
      if (t) {
        ring.style.width = "52px";
        ring.style.height = "52px";
        ring.style.borderColor = "rgba(217,35,35,0.7)";
        dot.style.opacity = "0";
      }
    }

    function out(e: MouseEvent) {
      const t = (e.target as HTMLElement).closest?.("a, button, input, textarea, select, [role='button']");
      if (t) {
        ring.style.width = "36px";
        ring.style.height = "36px";
        ring.style.borderColor = "rgba(217,35,35,0.4)";
        dot.style.opacity = "1";
      }
    }

    document.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseover", over, { passive: true });
    document.addEventListener("mouseout", out, { passive: true });
    const raf = requestAnimationFrame(loop);

    return () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", over);
      document.removeEventListener("mouseout", out);
      cancelAnimationFrame(raf);
      dot.remove();
      ring.remove();
    };
  }, []);

  return null;
}
