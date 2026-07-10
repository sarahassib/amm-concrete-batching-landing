"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hasPointer = window.matchMedia("(pointer: fine)").matches;
    setIsDesktop(hasPointer);
    if (!hasPointer) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    let rafId: number;

    function onMouseMove(e: MouseEvent) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dot) {
        dot.style.left = `${mouseX - 4}px`;
        dot.style.top = `${mouseY - 4}px`;
      }
    }

    function animateRing() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      if (ring) {
        ring.style.left = `${ringX - 18}px`;
        ring.style.top = `${ringY - 18}px`;
      }
      rafId = requestAnimationFrame(animateRing);
    }

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
        if (dot) dot.style.transform = "scale(0)";
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
        if (dot) dot.style.transform = "scale(1)";
      }
    }

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);
    rafId = requestAnimationFrame(animateRing);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      cancelAnimationFrame(rafId);
    };
  }, []);

  if (!isDesktop) return null;

  return (
    <>
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "8px",
          height: "8px",
          backgroundColor: "#D92323",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 99999,
          transition: "transform 0.15s ease-out",
        }}
      />
      <div
        ref={ringRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "36px",
          height: "36px",
          border: "2px solid rgba(217,35,35,0.3)",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 99998,
          transition: "width 0.3s, height 0.3s, border-color 0.3s",
        }}
      />
    </>
  );
}
