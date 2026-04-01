"use client"

import React, { useEffect, useState, useRef } from "react"
import { CloudinaryImage } from "@/components/ui/cloudinary-image"
import { siteConfig } from "@/content/site"

interface LoadingScreenProps {
  onComplete: () => void
}

/** Splits a date string like "May 8, 2026" into ["05", "08", "26"] */
function getDateSegments(dateStr: string): string[] {
  const d = new Date(dateStr)
  return [
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
    String(d.getFullYear()).slice(-2),
  ]
}

const GHOST_NUMBERS = getDateSegments(siteConfig.wedding.date)

// ── Canvas particle system ──────────────────────────────────────────────────

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  opacity: number
  twinklePhase: number
  twinkleSpeed: number
  colorIdx: number
}

/** Soft blues / whites matching the motif palette */
const PARTICLE_COLORS = [
  "255, 255, 255",  // pure white
  "178, 205, 224",  // motif soft   #B2CDE0
  "100, 151, 178",  // motif accent #6497B2
  "244, 248, 251",  // motif cream  #F4F8FB
]

function createParticles(width: number, height: number): Particle[] {
  const count = Math.min(45, Math.max(20, Math.floor((width * height) / 15000)))
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.25,
    vy: -(Math.random() * 0.18 + 0.06),   // slow upward drift
    radius: Math.random() * 1.8 + 0.4,
    opacity: Math.random() * 0.4 + 0.15,
    twinklePhase: Math.random() * Math.PI * 2,
    twinkleSpeed: Math.random() * 0.012 + 0.004,
    colorIdx: Math.floor(Math.random() * PARTICLE_COLORS.length),
  }))
}

// ── Component ───────────────────────────────────────────────────────────────

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [fadeOut, setFadeOut]           = useState(false)
  const [progress, setProgress]         = useState(0)
  // phase gates: 0=hidden · 1=monogram · 2=names · 3=tagline · 4=date · 5=progress
  const [phase, setPhase]               = useState(0)

  const canvasRef     = useRef<HTMLCanvasElement>(null)
  const animFrameRef  = useRef<number>(0)
  const particlesRef  = useRef<Particle[]>([])

  const TOTAL_LOAD_MS = 12000
  const FADE_MS       = 700

  // ── Canvas particle animation ────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
      particlesRef.current = createParticles(canvas.width, canvas.height)
    }
    resize()
    window.addEventListener("resize", resize)

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let running = true

    const draw = () => {
      if (!running) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach((p) => {
        // Gentle twinkle
        p.twinklePhase += p.twinkleSpeed
        const twinkle   = (Math.sin(p.twinklePhase) + 1) * 0.5
        const alpha     = p.opacity * (0.3 + twinkle * 0.7)
        const color     = PARTICLE_COLORS[p.colorIdx]
        const blurR     = p.radius * 3.5

        // Soft glow circle via radial gradient
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, blurR)
        g.addColorStop(0,   `rgba(${color}, ${alpha})`)
        g.addColorStop(0.4, `rgba(${color}, ${alpha * 0.45})`)
        g.addColorStop(1,   `rgba(${color}, 0)`)

        ctx.beginPath()
        ctx.arc(p.x, p.y, blurR, 0, Math.PI * 2)
        ctx.fillStyle = g
        ctx.fill()

        // Drift
        p.x += p.vx
        p.y += p.vy

        // Wrap
        const { width, height } = canvas
        if (p.y < -20)          { p.y = height + 10; p.x = Math.random() * width }
        if (p.x < -20)            p.x = width + 20
        if (p.x > width + 20)     p.x = -20
      })

      animFrameRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      running = false
      cancelAnimationFrame(animFrameRef.current)
      window.removeEventListener("resize", resize)
    }
  }, [])

  // ── Staggered content reveal ─────────────────────────────────────────────
  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 150),
      setTimeout(() => setPhase(2), 460),
      setTimeout(() => setPhase(3), 760),
      setTimeout(() => setPhase(4), 990),
      setTimeout(() => setPhase(5), 1220),
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

  // Helper: CSS transition classes based on phase gate
  const vis = (minPhase: number) =>
    phase >= minPhase
      ? "opacity-100 translate-y-0 transition-all duration-700 ease-out"
      : "opacity-0 translate-y-5 transition-all duration-700 ease-out"

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden transition-opacity duration-700 ease-out ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Loading invitation"
    >
      {/* ── Layer 1: Deep navy gradient base ── */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(155deg, #000F26 0%, #011D42 40%, #013560 70%, #01407A 100%)",
        }}
      />

      {/* ── Layer 2: Soft radial glow at center ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 50% at 50% 52%, rgba(1, 91, 151, 0.42) 0%, transparent 75%)",
        }}
      />

      {/* ── Layer 3: Canvas particle field ── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ mixBlendMode: "screen" }}
        aria-hidden
      />

      {/* ── Layer 4: Edge vignette for depth ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 85% 80% at 50% 50%, transparent 35%, rgba(0, 8, 20, 0.62) 100%)",
        }}
      />

      {/* ── Layer 5: Ghost wedding-date watermark (right side) ── */}
      <div
        className="absolute inset-0 pointer-events-none flex flex-col items-end justify-center pr-4 sm:pr-8 md:pr-12 lg:pr-16 select-none"
        aria-hidden
      >
        {GHOST_NUMBERS.map((num, i) => (
          <span
            key={`ghost-${num}-${i}`}
            className="font-bold leading-[0.82]"
            style={{
              fontFamily: '"Cinzel", serif',
              fontSize: "clamp(5rem, 14vw, 12rem)",
              color: "rgba(100, 151, 178, 0.055)",
              letterSpacing: "-0.04em",
              opacity: phase >= 2 ? 1 : 0,
              transition: `opacity 1.6s ease-out ${i * 150}ms`,
            }}
          >
            {num}
          </span>
        ))}
      </div>

      {/* ── Main content ── */}
      <div className="relative z-10 w-full max-w-sm mx-auto px-6 sm:px-8 text-center">

        {/* Monogram + glow ring */}
        <div
          className={`mb-8 flex justify-center ${
            phase >= 1
              ? "opacity-100 translate-y-0 scale-100 transition-all duration-700 ease-out"
              : "opacity-0 -translate-y-4 scale-95 transition-all duration-700 ease-out"
          }`}
        >
          <div className="relative flex items-center justify-center">
            {/* Soft pulsing glow */}
            <div
              className="absolute rounded-full animate-loader-glow"
              style={{
                width: "176px",
                height: "176px",
                background:
                  "radial-gradient(circle, rgba(100, 151, 178, 0.22) 0%, transparent 65%)",
              }}
            />
            {/* Thin ring accent */}
            <div
              className="absolute rounded-full"
              style={{
                width: "96px",
                height: "96px",
                border: "1px solid rgba(178, 205, 224, 0.14)",
              }}
            />
            <CloudinaryImage
              src={siteConfig.couple.monogram}
              alt="Monogram"
              width={240}
              height={240}
              className="relative h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 object-contain object-center brightness-0 invert"
              style={{ opacity: 0.88 }}
              priority
            />
          </div>
        </div>

        {/* Year ornament rule */}
        <div className={`flex items-center gap-3 justify-center mb-5 ${vis(2)}`}>
          <div
            className="h-px flex-1"
            style={{ background: "linear-gradient(to left, rgba(178, 205, 224, 0.28), transparent)" }}
          />
          <span
            style={{
              fontFamily: '"Cinzel", serif',
              fontSize: "0.5rem",
              letterSpacing: "0.45em",
              textTransform: "uppercase",
              color: "rgba(178, 205, 224, 0.42)",
            }}
          >
            Est. {new Date(siteConfig.wedding.date).getFullYear()}
          </span>
          <div
            className="h-px flex-1"
            style={{ background: "linear-gradient(to right, rgba(178, 205, 224, 0.28), transparent)" }}
          />
        </div>

        {/* Couple names — Lighten font */}
        <h1
          className={`${vis(2)}`}
          style={{ transitionDelay: "60ms" }}
        >
          <span
            className="lighten-regular block"
            style={{
              fontSize: "clamp(2.6rem, 9vw, 4.2rem)",
              color: "#EEF4FA",
              letterSpacing: "0.13em",
              textShadow: "0 2px 32px rgba(100, 151, 178, 0.38)",
            }}
          >
            {siteConfig.couple.brideNickname.trim()}
          </span>

          <span
            className="block my-1"
            style={{
              fontFamily: "var(--font-imperial-script), cursive",
              fontSize: "clamp(1.55rem, 5vw, 2.35rem)",
              color: "rgba(178, 205, 224, 0.62)",
              fontWeight: 400,
            }}
          >
            &amp;
          </span>

          <span
            className="lighten-regular block"
            style={{
              fontSize: "clamp(2.6rem, 9vw, 4.2rem)",
              color: "#EEF4FA",
              letterSpacing: "0.13em",
              textShadow: "0 2px 32px rgba(100, 151, 178, 0.38)",
            }}
          >
            {siteConfig.couple.groomNickname.trim()}
          </span>
        </h1>

        {/* Diamond divider */}
        <div
          className={`flex items-center gap-3 justify-center mt-5 mb-2 ${vis(3)}`}
        >
          <div
            className="h-px flex-1"
            style={{ background: "linear-gradient(to left, rgba(178, 205, 224, 0.22), transparent)" }}
          />
          <span
            style={{
              color: "rgba(178, 205, 224, 0.38)",
              fontSize: "5px",
              letterSpacing: "0.25em",
            }}
          >
            ◆
          </span>
          <div
            className="h-px flex-1"
            style={{ background: "linear-gradient(to right, rgba(178, 205, 224, 0.22), transparent)" }}
          />
        </div>

        {/* Supporting line */}
        <p
          className={`${vis(3)}`}
          style={{
            fontFamily: '"Great Vibes", cursive',
            fontSize: "clamp(1.3rem, 4vw, 1.7rem)",
            color: "rgba(178, 205, 224, 0.65)",
            transitionDelay: "80ms",
          }}
        >
          Together with their families
        </p>

        {/* Wedding date */}
        <p
          className={`mt-3 mb-9 leading-none ${vis(4)}`}
          style={{
            fontFamily: '"Cinzel", serif',
            fontSize: "clamp(0.52rem, 1.4vw, 0.62rem)",
            letterSpacing: "0.42em",
            textTransform: "uppercase",
            color: "rgba(178, 205, 224, 0.42)",
          }}
          aria-label={`${siteConfig.ceremony.day}, ${siteConfig.wedding.date} · ${siteConfig.ceremony.time}`}
        >
          <span>{siteConfig.ceremony.day}</span>
          <span className="mx-2" style={{ opacity: 0.5 }} aria-hidden>·</span>
          <span className="tabular-nums">{siteConfig.wedding.date}</span>
          <span className="mx-2" style={{ opacity: 0.5 }} aria-hidden>·</span>
          <span className="tabular-nums">{siteConfig.ceremony.time}</span>
        </p>

        {/* Progress section */}
        <div className={`${vis(5)}`}>
          <p
            style={{
              fontFamily: '"Great Vibes", cursive',
              fontSize: "clamp(1.2rem, 3.5vw, 1.55rem)",
              color: "rgba(178, 205, 224, 0.5)",
              marginBottom: "14px",
            }}
          >
            Preparing your invitation
          </p>

          {/* Hairline progress bar with shimmer */}
          <div
            className="w-full max-w-[200px] mx-auto relative"
            style={{ height: "1px" }}
            role="presentation"
          >
            {/* Track */}
            <div
              className="absolute inset-0 rounded-full"
              style={{ backgroundColor: "rgba(100, 151, 178, 0.15)" }}
            />
            {/* Filled portion */}
            <div
              className="absolute inset-y-0 left-0 rounded-full overflow-hidden"
              style={{
                width: `${Math.max(progress, 2)}%`,
                transition: "width 200ms linear",
                background:
                  "linear-gradient(to right, rgba(100, 151, 178, 0.45), rgba(244, 248, 251, 0.88))",
              }}
            >
              {/* Travelling shimmer sweep */}
              <div
                className="absolute inset-y-0 animate-loader-shimmer"
                style={{
                  width: "50px",
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.65) 50%, transparent 100%)",
                }}
              />
            </div>
          </div>

          {/* Percentage counter */}
          <p
            className="tabular-nums mt-4"
            style={{
              fontFamily: '"Cinzel", serif',
              fontSize: "clamp(0.52rem, 1.4vw, 0.62rem)",
              letterSpacing: "0.35em",
              color: "rgba(178, 205, 224, 0.38)",
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
