"use client"

import { useEffect, useState } from "react"
import { Section } from "@/components/section"
import { motion } from "motion/react"
import { Cormorant_Garamond, Cinzel } from "next/font/google"
import { siteConfig } from "@/content/site"
import Counter from "@/components/Counter"
import { CloudinaryImage } from "@/components/ui/cloudinary-image"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

interface CountdownUnitProps {
  value: number
  label: string
}

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
})

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["700"],
})

const cinzelRegular = Cinzel({
  subsets: ["latin"],
  weight: "400",
})

// Palette lives in globals.css → @theme inline → --color-motif-*
// Edit there once to update every component.

function CountdownUnit({ value, label }: CountdownUnitProps) {
  const places = value >= 100 ? [100, 10, 1] : [10, 1]

  return (
    <div className="flex flex-col items-center gap-1.5 sm:gap-2">
      {/* Card container */}
      
      <div className="relative w-full max-w-[88px] sm:max-w-[96px] md:max-w-[110px] lg:max-w-[120px]">
        {/* Main card */}
        <div className="relative rounded-xl sm:rounded-2xl border border-motif-cream/40 bg-motif-cream/15 px-2.5 py-2.5 sm:px-3.5 sm:py-3.5 md:px-4 md:py-4">
          <div className="relative z-10 flex items-center justify-center text-motif-cream">
            <Counter
              value={value}
              places={places}
              fontSize={26}
              padding={4}
              gap={2}
              textColor="var(--color-motif-cream)"
              fontWeight={800}
              borderRadius={6}
              horizontalPadding={3}
              gradientHeight={0}
              gradientFrom="transparent"
              gradientTo="transparent"
              counterStyle={{
                backgroundColor: "transparent",
              }}
              digitStyle={{
                minWidth: "1.15ch",
                fontFamily: "Arial, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                color: "var(--color-motif-cream)",
              }}
            />
          </div>
        </div>
      </div>

      {/* Label */}
      <span className="text-[10px] sm:text-xs md:text-sm font-inter font-semibold uppercase tracking-[0.16em] text-motif-cream/90">
        {label}
      </span>
    </div>
  )
}

export function Countdown() {
  const ceremonyDate = siteConfig.ceremony.date
  const ceremonyTimeDisplay = siteConfig.ceremony.time
  const [ceremonyMonth = "June", ceremonyDayRaw = "7", ceremonyYear = "2026"] = ceremonyDate.split(" ")
  const ceremonyDayNumber = ceremonyDayRaw.replace(/[^0-9]/g, "") || "7"
  const { brideNickname, groomNickname } = siteConfig.couple
  const ceremonyDay = siteConfig.ceremony.day || "Thursday"
  const ceremonyDayShort = ceremonyDay.slice(0, 3).toUpperCase()
  // Parse the date: December 20, 2025 at 10:30 AM PH Time (GMT+0800)
  // Extract time from "10:30 A.M., PH Time" -> "10:30 A.M."
  const timeStr = ceremonyTimeDisplay.split(",")[0].trim() // "10:30 A.M."
  
  // Create date string in ISO-like format for better parsing
  // December 20, 2025 -> 2025-12-20
  const monthMap: { [key: string]: string } = {
    "January": "01", "February": "02", "March": "03", "April": "04",
    "May": "05", "June": "06", "July": "07", "August": "08",
    "September": "09", "October": "10", "November": "11", "December": "12"
  }
  const monthNum = monthMap[ceremonyMonth] || "12"
  const dayNum = ceremonyDayNumber.padStart(2, "0")
  
  // Parse time: "3:00 PM" -> 15:00
  const timeMatch = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i)
  let hour = 15 // default 3 PM
  let minutes = 0
  
  if (timeMatch) {
    hour = parseInt(timeMatch[1])
    minutes = parseInt(timeMatch[2])
    const ampm = timeMatch[3].toUpperCase()
    if (ampm === "PM" && hour !== 12) hour += 12
    if (ampm === "AM" && hour === 12) hour = 0
  }
  
  // Create date in GMT+8 (PH Time)
  // Using Date.UTC and adjusting for GMT+8 offset (subtract 8 hours to convert GMT+8 to UTC)
  const parsedTargetDate = new Date(Date.UTC(
    parseInt(ceremonyYear),
    parseInt(monthNum) - 1,
    parseInt(dayNum),
    hour - 8, // Convert GMT+8 to UTC
    minutes,
    0
  ))
  
  const targetTimestamp = Number.isNaN(parsedTargetDate.getTime())
    ? new Date(Date.UTC(2026, 1, 8, 8, 0, 0)).getTime() // Fallback: February 8, 2026, 4:00 PM GMT+8 = 8:00 AM UTC
    : parsedTargetDate.getTime()

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const targetDate = targetTimestamp
      const now = new Date().getTime()
      const difference = targetDate - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      } else {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(timer)
  }, [targetTimestamp])

  return (
    <Section
      id="countdown"
      className="relative py-10 sm:py-12 md:py-16 lg:py-20 overflow-hidden"
    >
         {/* ── Corner decorations ── */}
         <img
        src="/decoration/corner-right-top.png"
        alt=""
        aria-hidden
        className="absolute top-0 right-0 pointer-events-none select-none z-0"
        style={{ width: "clamp(130px, 24vw, 240px)", opacity: 0.72 }}
      />
      <img
        src="/decoration/corner-left-bottom.png"
        alt=""
        aria-hidden
        className="absolute bottom-0 left-0 pointer-events-none select-none z-0"
        style={{ width: "clamp(130px, 24vw, 240px)", opacity: 0.72 }}
      />

      {/* Corner floral decoration - white */}
      <div className="absolute left-0 top-0 z-0 pointer-events-none">
        {/* <CloudinaryImage
          src="/decoration/flower-decoration-left-bottom-corner2.png"
          alt=""
          width={300}
          height={300}
          className="w-auto h-auto max-w-[160px] sm:max-w-[200px] md:max-w-[240px] lg:max-w-[280px] opacity-60 scale-y-[-1]"
          priority={false}
          style={{ filter: "brightness(0) invert(1)" }}
        /> */}
      </div>
      <div className="absolute right-0 top-0 z-0 pointer-events-none">
        {/* <CloudinaryImage
          src="/decoration/flower-decoration-left-bottom-corner2.png"
          alt=""
          width={300}
          height={300}
          className="w-auto h-auto max-w-[160px] sm:max-w-[200px] md:max-w-[240px] lg:max-w-[280px] opacity-60 scale-x-[-1] scale-y-[-1]"
          priority={false}
          style={{ filter: "brightness(0) invert(1)" }}
        /> */}
      </div>
      <div className="absolute left-0 bottom-0 z-0 pointer-events-none">
        {/* <CloudinaryImage
          src="/decoration/flower-decoration-left-bottom-corner2.png"
          alt=""
          width={300}
          height={300}
          className="w-auto h-auto max-w-[160px] sm:max-w-[200px] md:max-w-[240px] lg:max-w-[280px] opacity-60"
          priority={false}
          style={{ filter: "brightness(0) invert(1)" }}
        /> */}
      </div>
      <div className="absolute right-0 bottom-0 z-0 pointer-events-none">
        {/* <CloudinaryImage
          src="/decoration/flower-decoration-left-bottom-corner2.png"
          alt=""
          width={300}
          height={300}
          className="w-auto h-auto max-w-[160px] sm:max-w-[200px] md:max-w-[240px] lg:max-w-[280px] opacity-60 scale-x-[-1]"
          priority={false}
          style={{ filter: "brightness(0) invert(1)" }}
        /> */}
      </div>
      
      {/* Monogram - centered at top */}
      <div className="relative flex justify-center pt-8 sm:pt-10 md:pt-12 mb-6 sm:mb-8 md:mb-10 z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative"
        >
          <div className="relative w-72 h-72 sm:w-96 sm:h-96 md:w-[28rem] md:h-[28rem] lg:w-[36rem] lg:h-[36rem] xl:w-[40rem] xl:h-[40rem] opacity-90">
            <CloudinaryImage
              src={siteConfig.couple.monogram}
              alt={`${groomNickname} & ${brideNickname} Monogram`}
              fill
              className="object-contain"
              style={{
                filter: "brightness(0) invert(1)",
              }}
              priority={false}
            />
          </div>
        </motion.div>
      </div>

      {/* Header */}
      <div className="relative z-10 text-center mb-6 sm:mb-8 md:mb-10 px-3 sm:px-4">
        {/* Decorative element above title */}
        <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
          <div className="w-8 sm:w-12 md:w-16 h-px bg-motif-cream/25" />
          <div className="w-1.5 h-1.5 bg-motif-soft rounded-full shadow-[0_0_12px_var(--color-motif-soft)]" />
          <div className="w-8 sm:w-12 md:w-16 h-px bg-motif-cream/25" />
        </div>
        
        <h2
           className="lighten-regular text-[32px] sm:text-[40px] md:text-[48px] lg:text-[56px] xl:text-[64px] leading-tight"
           style={{ color: 'var(--color-motif-cream)' }}
          >
          Counting down to our Forever
        </h2>
        
        {/* <p className="text-xs sm:text-sm md:text-base lg:text-lg text-motif-cream/95 font-light max-w-xl mx-auto leading-relaxed px-2">
          Every heartbeat brings us closer to the moment when two hearts become one. Join {groomNickname} and {brideNickname} as they count down to forever.
        </p> */}
        
        {/* Decorative element below subtitle */}
        <div className="flex items-center justify-center gap-2 mt-3 sm:mt-4">
          <div className="w-1 h-1 bg-motif-cream/70 rounded-full" />
          <div className="w-1 h-1 bg-motif-cream/40 rounded-full" />
          <div className="w-1 h-1 bg-motif-cream/70 rounded-full" />
        </div>
      </div>

      {/* Save The Date Card */}
      <div className="relative z-10">
        <div className="flex justify-center px-3 sm:px-4">
          <div className="max-w-2xl w-full">

            {/* Numeric countdown: Days / Hours / Minutes / Seconds */}
            <div className="mt-2 sm:mt-4 md:mt-6 font-inter">
              <div className="flex flex-col items-center gap-3 sm:gap-4 md:gap-6">
                {/* 2x2 on mobile, 4 in a row from md+ */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 w-full max-w-sm sm:max-w-md md:max-w-xl">
                  <CountdownUnit value={timeLeft.days} label="Days" />
                  <CountdownUnit value={timeLeft.hours} label="Hours" />
                  <CountdownUnit value={timeLeft.minutes} label="Minutes" />
                  <CountdownUnit value={timeLeft.seconds} label="Seconds" />
                </div>
              </div>
            </div>
          </div>
          
        </div>
        
            {/* Date Section - Layout matched with hero date block */}
            <div className="relative sm:rounded-3xl p-6 sm:p-8 md:p-10 mb-6 sm:mb-8">
              <div className="w-full max-w-2xl mx-auto">
                <div
                  className={`${cinzel.className} flex flex-col items-center gap-1.5 sm:gap-2.5 md:gap-3 text-motif-cream font-bold`}
                >
                  {/* Month */}
                  <span
                    className="text-[0.65rem] sm:text-xs md:text-sm uppercase tracking-[0.4em] sm:tracking-[0.5em] text-motif-cream"
                  >
                    {ceremonyMonth}
                  </span>

                  {/* Day and time row */}
                  <div className="flex w-full items-center gap-2 sm:gap-4 md:gap-5">
                    {/* Day of week & divider */}
                    <div className="flex flex-1 items-center justify-end gap-1.5 sm:gap-2.5">
                      <span className="h-[0.5px] flex-1 bg-motif-cream/45" />
                      <span
                        className="text-[0.6rem] sm:text-[0.7rem] md:text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] text-motif-cream"
                      >
                        {ceremonyDayShort}
                      </span>
                      <span className="h-[0.5px] w-6 sm:w-8 md:w-10 bg-motif-cream/45" />
                    </div>

                    {/* Day number */}
                    <div className="relative flex items-center justify-center px-3 sm:px-4 md:px-5">
                      <span
                        className={`${cinzel.className} relative text-[3rem] sm:text-[4.5rem] md:text-[5.5rem] lg:text-[6rem] font-bold leading-none tracking-wider text-motif-cream`}
                      >
                        {ceremonyDayNumber.padStart(2, "0")}
                      </span>
                    </div>

                    {/* Time */}
                    <div className="flex flex-1 items-center gap-1.5 sm:gap-2.5">
                      <span className="h-[0.5px] w-6 sm:w-8 md:w-10 bg-motif-cream/45" />
                      <span
                        className="text-[0.6rem] sm:text-[0.7rem] md:text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] text-motif-cream"
                      >
                        {ceremonyTimeDisplay.split(",")[0]}
                      </span>
                      <span className="h-[0.5px] flex-1 bg-motif-cream/45" />
                    </div>
                  </div>

                  {/* Year */}
                  <span
                    className="text-[0.65rem] sm:text-xs md:text-sm uppercase tracking-[0.4em] sm:tracking-[0.5em] text-motif-cream"
                  >
                    {ceremonyYear}
                  </span>
                </div>
              </div>
            </div>
      </div>
    </Section>
  )
}
