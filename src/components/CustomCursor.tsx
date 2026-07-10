"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only on desktop (no touch devices)
    if (typeof window === "undefined") return;
    if ("ontouchstart" in window) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;

    function onMouseMove(e: MouseEvent) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dot) dot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
    }

    function animateRing() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      if (ring) ring.style.transform = `translate(${ringX - 18}px, ${ringY - 18}px)`;
      requestAnimationFrame(animateRing);
    }

    document.addEventListener("mousemove", onMouseMove);
    const raf = requestAnimationFrame(animateRing);

    function onMouseOver(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button")
      ) {
        if (ring) {
          ring.style.width = "52px";
          ring.style.height = "52px";
          ring.style.borderColor = "rgba(217,35,35,0.6)";
        }
        if (dot) dot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px) scale(0)`;
      }
    }

    function onMouseOut(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button")
      ) {
        if (ring) {
          ring.style.width = "36px";
          ring.style.height = "36px";
          ring.style.borderColor = "rgba(217,35,35,0.3)";
        }
        if (dot) dot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px) scale(1)`;
      }
    }

    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      {/* Small dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] w-2 h-2 bg-white rounded-full pointer-events-none hidden md:block"
        style={{ willChange: "transform" }}
      />
      {/* Outer ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[9998] w-9 h-9 rounded-full border-2 border-white/40 pointer-events-none hidden md:block"
        style={{ willChange: "transform", transition: "width 0.3s, height 0.3s, border-color 0.3s" }}
      />
    </>
  );
}
