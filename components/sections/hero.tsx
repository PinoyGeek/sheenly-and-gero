"use client"

import { useEffect, useState, useRef } from "react"
import { CloudinaryImage } from "@/components/ui/cloudinary-image"
import { siteConfig } from "@/content/site"

// ── Canvas particle system ────────────────────────────────────────────────────

interface Particle {
  x: number; y: number
  vx: number; vy: number
  radius: number; opacity: number
  twinklePhase: number; twinkleSpeed: number
  colorIdx: number
}

const PARTICLE_COLORS = [
  "1, 29, 66",      // deep navy   #011D42
  "1, 64, 122",     // mid navy    #01407A
  "100, 151, 178",  // motif accent #6497B2
  "178, 205, 224",  // motif soft  #B2CDE0
]

function createParticles(w: number, h: number): Particle[] {
  const count = Math.min(50, Math.max(22, Math.floor((w * h) / 14000)))
  return Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.25,
    vy: -(Math.random() * 0.18 + 0.06),
    radius: Math.random() * 1.8 + 0.4,
    opacity: Math.random() * 0.4 + 0.15,
    twinklePhase: Math.random() * Math.PI * 2,
    twinkleSpeed: Math.random() * 0.012 + 0.004,
    colorIdx: Math.floor(Math.random() * PARTICLE_COLORS.length),
  }))
}

// ── Component ─────────────────────────────────────────────────────────────────

export function Hero() {
  const [phase, setPhase] = useState(0)
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const animFrameRef = useRef<number>(0)
  const particlesRef = useRef<Particle[]>([])

  // Canvas particle animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = canvas.parentElement?.offsetHeight ?? window.innerHeight
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
        p.twinklePhase += p.twinkleSpeed
        const twinkle = (Math.sin(p.twinklePhase) + 1) * 0.5
        const alpha   = p.opacity * (0.3 + twinkle * 0.7)
        const color   = PARTICLE_COLORS[p.colorIdx]
        const blurR   = p.radius * 3.5

        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, blurR)
        g.addColorStop(0,   `rgba(${color}, ${alpha})`)
        g.addColorStop(0.4, `rgba(${color}, ${alpha * 0.45})`)
        g.addColorStop(1,   `rgba(${color}, 0)`)

        ctx.beginPath()
        ctx.arc(p.x, p.y, blurR, 0, Math.PI * 2)
        ctx.fillStyle = g
        ctx.fill()

        p.x += p.vx
        p.y += p.vy

        const { width, height } = canvas
        if (p.y < -20)        { p.y = height + 10; p.x = Math.random() * width }
        if (p.x < -20)          p.x = width + 20
        if (p.x > width + 20)   p.x = -20
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

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 100),
      setTimeout(() => setPhase(2), 380),
      setTimeout(() => setPhase(3), 640),
      setTimeout(() => setPhase(4), 860),
      setTimeout(() => setPhase(5), 1060),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  const vis = (minPhase: number) =>
    phase >= minPhase
      ? "opacity-100 translate-y-0 transition-all duration-700 ease-out"
      : "opacity-0 translate-y-5 transition-all duration-700 ease-out"

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >

      {/* ── Particle canvas ── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ mixBlendMode: "multiply" }}
        aria-hidden
      />

      {/* ── Corner decorations ── */}
      {/* <img
        src="/decoration/corner-right-top.png"
        alt="" aria-hidden
        className="absolute top-0 right-0 pointer-events-none select-none z-0"
        style={{ width: "clamp(130px, 24vw, 240px)", opacity: 0.72 }}
      />
      <img
        src="/decoration/corner-left-bottom.png"
        alt="" aria-hidden
        className="absolute bottom-0 left-0 pointer-events-none select-none z-0"
        style={{ width: "clamp(130px, 24vw, 240px)", opacity: 0.72 }}
      /> */}

      {/* Main content */}
      <div className="relative z-10 w-full min-h-screen flex items-center justify-center px-4 sm:px-6 pt-16 pb-4">
        {/* Card container */}
        <div
          className={`w-full max-w-lg sm:max-w-xl rounded-[24px] sm:rounded-[28px] px-7 sm:px-12 py-10 sm:py-14 text-center transition-all duration-700 ease-out ${
            phase >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{
            background: "#ffffff",
            border: "1px solid rgba(1, 29, 66, 0.10)",
            boxShadow: "0 8px 48px rgba(1, 29, 66, 0.08), inset 0 1px 0 rgba(255,255,255,0.9)",
          }}
        >

          {/* Monogram + glow ring */}
          <div className="flex justify-center mb-8">
            <div className="relative flex items-center justify-center">
              <div
                className="absolute rounded-full animate-loader-glow"
                style={{
                  width: "160px",
                  height: "160px",
                  background:
                    "radial-gradient(circle, rgba(1, 64, 122, 0.10) 0%, transparent 65%)",
                }}
              />
              <div
                className="absolute rounded-full"
                style={{
                  width: "90px",
                  height: "90px",
                  border: "1px solid rgba(1, 29, 66, 0.12)",
                }}
              />
              <CloudinaryImage
                src="/monogram/monogram.png"
                alt={`${siteConfig.couple.brideNickname} & ${siteConfig.couple.groomNickname} monogram`}
                width={160}
                height={160}
                className="relative h-20 w-20 sm:h-24 sm:w-24 object-contain object-center"
                style={{ filter: "var(--color-motif-deco-filter)", opacity: 0.90 }}
                priority
              />
            </div>
          </div>

          {/* Together with their families */}
          <p
            className={`${vis(2)}`}
            style={{
              fontFamily: '"Great Vibes", cursive',
              fontSize: "clamp(1.25rem, 3.5vw, 1.65rem)",
              color: "rgba(1, 64, 122, 0.88)",
            }}
          >
            Together with their families
          </p>

          {/* Year rule */}
          <div className={`flex items-center gap-3 justify-center mt-5 mb-4 ${vis(2)}`}>
            <div
              className="h-px flex-1"
              style={{ background: "linear-gradient(to left, rgba(1, 29, 66, 0.55), transparent)" }}
            />
            <span
              style={{
                fontFamily: '"Cinzel", serif',
                fontSize: "0.5rem",
                letterSpacing: "0.45em",
                textTransform: "uppercase",
                color: "rgba(1, 29, 66, 0.82)",
              }}
            >
              Est. {new Date(siteConfig.wedding.date).getFullYear()}
            </span>
            <div
              className="h-px flex-1"
              style={{ background: "linear-gradient(to right, rgba(1, 29, 66, 0.55), transparent)" }}
            />
          </div>

          {/* "to celebrate the marriage of" */}
          <p
            className={`${vis(2)}`}
            style={{
              fontFamily: '"Great Vibes", cursive',
              fontSize: "clamp(1.05rem, 2.8vw, 1.35rem)",
              color: "rgba(1, 64, 122, 0.88)",
            }}
          >
            to celebrate the marriage of
          </p>

          {/* Couple names */}
          <div className={`mt-6 ${vis(3)}`}>
            <p
              className="lighten-regular"
              style={{
                fontSize: "clamp(2.5rem, 8.5vw, 5.5rem)",
                color: "#011D42",
                letterSpacing: "0.12em",
                textShadow: "0 2px 18px rgba(1, 64, 122, 0.12)",
              }}
            >
              {siteConfig.couple.brideNickname.trim()}
            </p>

            {/* Ampersand divider */}
            <div className="flex items-center gap-3 justify-center my-2">
              <div
                className="h-px flex-1 max-w-[55px]"
                style={{ background: "linear-gradient(to left, rgba(1, 29, 66, 0.45), transparent)" }}
              />
              <span
                style={{
                  fontFamily: "var(--font-imperial-script), cursive",
                  fontSize: "clamp(1.5rem, 4.5vw, 2.1rem)",
                  color: "rgba(1, 64, 122, 0.80)",
                  fontWeight: 400,
                }}
              >
                and
              </span>
              <div
                className="h-px flex-1 max-w-[55px]"
                style={{ background: "linear-gradient(to right, rgba(1, 29, 66, 0.45), transparent)" }}
              />
            </div>

            <p
              className="lighten-regular"
              style={{
                fontSize: "clamp(2.5rem, 8.5vw, 5.5rem)",
                color: "#011D42",
                letterSpacing: "0.12em",
                textShadow: "0 2px 18px rgba(1, 64, 122, 0.12)",
              }}
            >
              {siteConfig.couple.groomNickname.trim()}
            </p>
          </div>

          {/* Diamond rule */}
          <div className={`flex items-center gap-3 justify-center mt-7 mb-1 ${vis(4)}`}>
            <div
              className="h-px flex-1"
              style={{ background: "linear-gradient(to left, rgba(1, 29, 66, 0.45), transparent)" }}
            />
            <span style={{ color: "rgba(1, 64, 122, 0.72)", fontSize: "5px" }}>◆</span>
            <div
              className="h-px flex-1"
              style={{ background: "linear-gradient(to right, rgba(1, 29, 66, 0.45), transparent)" }}
            />
          </div>

          {/* Date */}
          <p
            className={`mt-4 ${vis(4)}`}
            style={{
              fontFamily: '"Cinzel", serif',
              fontSize: "clamp(0.52rem, 1.4vw, 0.64rem)",
              letterSpacing: "0.42em",
              textTransform: "uppercase",
              color: "rgba(1, 29, 66, 0.82)",
            }}
          >
            {siteConfig.ceremony.day}
            <span className="mx-2" style={{ opacity: 0.5 }}>·</span>
            {siteConfig.wedding.date.toUpperCase()}
            <span className="mx-2" style={{ opacity: 0.5 }}>·</span>
            {siteConfig.ceremony.time}
          </p>

          {/* Ceremony & reception details */}
          <div className={`mt-7 space-y-4 ${vis(5)}`}>
            <div className="space-y-1">
              <p
                style={{
                  fontFamily: '"Cinzel", serif',
                  fontSize: "clamp(0.52rem, 1.4vw, 0.64rem)",
                  letterSpacing: "0.34em",
                  textTransform: "uppercase",
                  color: "rgba(1, 29, 66, 0.82)",
                }}
              >
                Ceremony
              </p>
              <p
                style={{
                  fontFamily: '"Great Vibes", cursive',
                  fontSize: "clamp(1rem, 2.8vw, 1.3rem)",
                  color: "rgba(1, 64, 122, 0.88)",
                }}
              >
                {siteConfig.ceremony.location}
              </p>
            </div>

            <div className="space-y-1">
              <p
                style={{
                  fontFamily: '"Cinzel", serif',
                  fontSize: "clamp(0.52rem, 1.4vw, 0.64rem)",
                  letterSpacing: "0.34em",
                  textTransform: "uppercase",
                  color: "rgba(1, 29, 66, 0.82)",
                }}
              >
                Reception to follow
              </p>
              <p
                style={{
                  fontFamily: '"Great Vibes", cursive',
                  fontSize: "clamp(1rem, 2.8vw, 1.3rem)",
                  color: "rgba(1, 64, 122, 0.88)",
                }}
              >
                {siteConfig.reception.location}
              </p>
            </div>
          </div>

          {/* RSVP button */}
          <style>{`
            @keyframes btn-glow {
              0%, 100% { box-shadow: 0 0 4px 1px rgba(0,85,143,0.10), 0 2px 10px rgba(0,85,143,0.12); }
              50%       { box-shadow: 0 0 10px 3px rgba(0,85,143,0.22), 0 4px 18px rgba(0,85,143,0.20); }
            }
          `}</style>
          <div className={`mt-10 flex justify-center ${vis(5)}`}>
            <div className="relative">
              {/* Pulse ring */}
              <span className="absolute inset-0 rounded-sm animate-ping opacity-10" style={{ background: "#00558F", animationDuration: "2.5s" }} />
              <a
                href="#guest-list"
                className="relative inline-flex items-center justify-center px-10 py-3 rounded-sm transition-all duration-300 hover:brightness-110 hover:scale-105 active:scale-95"
                style={{
                  fontFamily: '"Cinzel", serif',
                  fontSize: "0.58rem",
                  letterSpacing: "0.45em",
                  textTransform: "uppercase",
                  color: "#ffffff",
                  background: "#00558F",
                  border: "1px solid rgba(0, 85, 143, 0.5)",
                  animation: "btn-glow 5s ease-in-out infinite",
                }}
              >
                RSVP
              </a>
            </div>
          </div>

        </div>{/* end card */}
      </div>
    </section>
  )
}
