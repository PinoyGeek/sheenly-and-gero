"use client"

import React, { useEffect, useMemo, useState } from "react"
import { siteConfig } from "@/content/site"

interface LoadingScreenProps {
  onComplete: () => void
}

function getDaysLeft(dateStr: string): number {
  const wedding = new Date(dateStr)
  const today   = new Date()
  today.setHours(0, 0, 0, 0)
  wedding.setHours(0, 0, 0, 0)
  return Math.max(0, Math.ceil((wedding.getTime() - today.getTime()) / 86_400_000))
}

function getDateSegments(dateStr: string): string[] {
  const d = new Date(dateStr)
  return [
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
    String(d.getFullYear()).slice(-2),
  ]
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [fadeOut, setFadeOut]     = useState(false)
  const [progress, setProgress]   = useState(0)
  // phase gates: 0=hidden · 1=top label · 2=bottom text · 3=progress
  const [phase, setPhase]         = useState(0)

  const daysLeft    = useMemo(() => getDaysLeft(siteConfig.ceremony.date), [])
  const dateSegs    = useMemo(() => getDateSegments(siteConfig.ceremony.date), [])

  const TOTAL_LOAD_MS = 12000
  const FADE_MS       = 700

  // ── Staggered content reveal ─────────────────────────────────────────────
  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 150),
      setTimeout(() => setPhase(2), 500),
      setTimeout(() => setPhase(3), 850),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  // ── Progress counter ─────────────────────────────────────────────────────
  useEffect(() => {
    let rafId = 0
    const start        = performance.now()
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

    const tick = (now: number) => {
      const t    = Math.min(1, (now - start) / TOTAL_LOAD_MS)
      const next = Math.round(easeOutCubic(t) * 100)
      setProgress((prev) => (next > prev ? next : prev))
      if (t < 1) rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    const fadeTimer = setTimeout(() => setFadeOut(true), TOTAL_LOAD_MS - FADE_MS)
    const doneTimer = setTimeout(() => { setProgress(100); onComplete() }, TOTAL_LOAD_MS)

    return () => {
      cancelAnimationFrame(rafId)
      clearTimeout(fadeTimer)
      clearTimeout(doneTimer)
    }
  }, [onComplete])

  const vis = (minPhase: number) =>
    `transition-all duration-700 ease-out ${
      phase >= minPhase
        ? "opacity-100 translate-y-0"
        : "opacity-0 translate-y-4"
    }`

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col overflow-hidden transition-opacity duration-700 ease-out ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Loading invitation"
    >
      {/* ── Background image: desktop ── */}
      <div
        className="absolute inset-0 hidden md:block bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/Album/couple (12).jpg')" }}
      />

      {/* ── Background image: mobile ── */}
      <div
        className="absolute inset-0 block md:hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/Album/couple (5).jpg')" }}
      />

      {/* ── Top vignette — #226AAB-toned ── */}
      <div
        className="absolute inset-x-0 top-0 pointer-events-none"
        style={{
          height: "36%",
          background: "linear-gradient(to bottom, rgba(34,106,171,0.78) 0%, rgba(34,106,171,0.22) 65%, transparent 100%)",
        }}
      />

      {/* ── Bottom vignette — deep blue fade ── */}
      <div
        className="absolute inset-x-0 bottom-0 pointer-events-none"
        style={{
          height: "44%",
          background: "linear-gradient(to top, rgba(14,38,72,0.90) 0%, rgba(34,106,171,0.55) 55%, transparent 100%)",
        }}
      />

      {/* ════════════════════════════════════════════════════════
          TOP — heading + countdown + date
      ════════════════════════════════════════════════════════ */}
      <div className="relative z-10 flex flex-col items-center pt-8 sm:pt-10 select-none gap-2">

        {/* "WE'RE GETTING MARRIED" with flanking rules */}
        <div className={vis(1)}>
          <div className="flex items-center gap-3">
            <div
              className="h-px w-10 sm:w-16"
              style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.38))" }}
            />
            <span
              style={{
                fontFamily: '"AgrandirWideBold", sans-serif',
                fontSize: "clamp(0.44rem, 1.4vw, 0.60rem)",
                letterSpacing: "0.38em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.82)",
              }}
            >
              We&apos;re Getting Married
            </span>
            <div
              className="h-px w-10 sm:w-16"
              style={{ background: "linear-gradient(to left, transparent, rgba(255,255,255,0.38))" }}
            />
          </div>
        </div>

        {/* Countdown: {N} more days to go */}
        <div className={vis(1)} style={{ transitionDelay: "120ms" }}>
          <p
            style={{
              fontFamily: '"AgrandirWideBold", sans-serif',
              fontSize: "clamp(0.52rem, 1.7vw, 0.72rem)",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.62)",
              lineHeight: 1,
            }}
          >
            {daysLeft} more {daysLeft === 1 ? "day" : "days"} to go
          </p>
        </div>

        {/* Date segments — MM · DD · YY */}
        <div className={vis(1)} style={{ transitionDelay: "220ms" }}>
          <div className="flex items-center gap-2">
            {dateSegs.map((seg, i) => (
              <React.Fragment key={i}>
                <span
                  className="tabular-nums"
                  style={{
                    fontFamily: '"AgrandirWideBold", sans-serif',
                    fontSize: "clamp(0.52rem, 1.6vw, 0.72rem)",
                    letterSpacing: "0.22em",
                    color: "rgba(255,255,255,0.58)",
                  }}
                >
                  {seg}
                </span>
                {i < 2 && (
                  <span style={{ color: "rgba(255,255,255,0.28)", fontSize: "0.45rem" }}>◆</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          BOTTOM — Save the Date + progress
      ════════════════════════════════════════════════════════ */}
      <div className="relative z-10 mt-auto flex flex-col items-center pb-10 sm:pb-12 px-6 text-center select-none">

        {/* "Save the Date" — Brittany Signature Script */}
        <p
          className={vis(2)}
          style={{
            fontFamily: '"BrittanySignature", cursive',
            fontSize: "clamp(3rem, 10vw, 6.5rem)",
            color: "rgba(255,255,255,0.95)",
            lineHeight: 1.0,
            textShadow: "0 4px 32px rgba(14,38,72,0.45)",
          }}
        >
          Save the Date
        </p>

        {/* Decorative divider */}
        <div
          className={`flex items-center gap-3 w-full max-w-[240px] mt-3 mb-5 ${vis(2)}`}
          style={{ transitionDelay: "100ms" }}
        >
          <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.28)" }} />
          <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "4px", letterSpacing: "0.3em" }}>◆</span>
          <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.28)" }} />
        </div>

        {/* Progress */}
        <div className={`w-full flex flex-col items-center ${vis(3)}`} style={{ transitionDelay: "160ms" }}>
          <p
            style={{
              fontFamily: '"AgrandirWideBold", sans-serif',
              fontSize: "clamp(0.44rem, 1.4vw, 0.58rem)",
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.52)",
              marginBottom: "10px",
            }}
          >
            Preparing your invitation
          </p>

          {/* Hairline progress bar */}
          <div
            className="w-full max-w-[180px] relative"
            style={{ height: "1px" }}
            role="presentation"
          >
            <div
              className="absolute inset-0 rounded-full"
              style={{ backgroundColor: "rgba(255,255,255,0.18)" }}
            />
            <div
              className="absolute inset-y-0 left-0 rounded-full overflow-hidden"
              style={{
                width: `${Math.max(progress, 2)}%`,
                transition: "width 200ms linear",
                background: "linear-gradient(to right, rgba(100,180,255,0.50), rgba(255,255,255,0.90))",
              }}
            >
              <div
                className="absolute inset-y-0 animate-loader-shimmer"
                style={{
                  width: "50px",
                  background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.65) 50%, transparent 100%)",
                }}
              />
            </div>
          </div>

          {/* Percentage */}
          <p
            className="tabular-nums mt-3"
            style={{
              fontFamily: '"AgrandirWideBold", sans-serif',
              fontSize: "clamp(0.42rem, 1.2vw, 0.54rem)",
              letterSpacing: "0.42em",
              color: "rgba(255,255,255,0.45)",
            }}
            aria-live="polite"
          >
            {progress}%
          </p>
        </div>
      </div>
    </div>
  )
}
