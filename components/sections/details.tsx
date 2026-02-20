"use client"

import { Section } from "@/components/section"
import { siteConfig } from "@/content/site"
import {
  Clock,
  Utensils,
  Copy,
  Check,
  Navigation,
  Heart,
  Camera,
  X,
  MapPin,
} from "lucide-react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { Cormorant_Garamond, Cinzel } from "next/font/google"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400"],
})

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600"],
})

// Wedding motif — align with hero & gallery
const palette = {
  deep: "#45301F",
  medium: "#875F2C",
  sage: "#A2976A",
  cream: "#F5D8B0",
  terracotta: "#8F553D",
} as const

const DECO_FILTER =
  "brightness(0) saturate(100%) invert(18%) sepia(35%) saturate(1200%) hue-rotate(15deg) brightness(92%) contrast(88%)"

export function Details() {
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set())
  const [showImageModal, setShowImageModal] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [rotationOffset, setRotationOffset] = useState(0)

  // Couple images from Couple_img (max 4)
  const coupleImages = [
    "/Couple_img/couple (1).jpg",
    "/Couple_img/couple (2).jpg",
    "/Couple_img/couple (3).jpg",
    "/Couple_img/Capture the Love.png",
  ]

  // Convert address to title case for display
  const formatAddress = (address: string) => {
    return address
      .split(",")
      .map((part) =>
        part
          .trim()
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(" ")
      )
      .join(", ")
  }

  // Ceremony & reception from site config (same as hero)
  const ceremonyVenue = siteConfig.ceremony.venue
  const ceremonyLocation = siteConfig.ceremony.location ?? siteConfig.ceremony.venue
  const receptionVenue = siteConfig.reception.venue
  const receptionLocation = siteConfig.reception.location ?? siteConfig.reception.venue
  const ceremonyLocationFormatted = formatAddress(ceremonyLocation)
  const receptionLocationFormatted = formatAddress(receptionLocation)
  
  // Format date with comma: "February 8 2026" -> "February 8, 2026"
  const formattedCeremonyDate = siteConfig.ceremony.date.replace(/(\w+ \d+) (\d+)/, "$1, $2")
  
  // Format reception date: "FEB 8, 2026" -> "February 8, 2026" or keep as is if already formatted
  const receptionDate = siteConfig.reception.date
  const formattedReceptionDate = receptionDate.includes("March") || receptionDate.includes("January") || receptionDate.includes("February") || receptionDate.includes("April") || receptionDate.includes("May") || receptionDate.includes("June") || receptionDate.includes("July") || receptionDate.includes("August") || receptionDate.includes("September") || receptionDate.includes("October") || receptionDate.includes("November") || receptionDate.includes("December")
    ? receptionDate // Already formatted, use as is
    : receptionDate
      .replace(/FEB/i, "February")
      .replace(/JAN/i, "January")
      .replace(/MAR/i, "March")
      .replace(/APR/i, "April")
      .replace(/MAY/i, "May")
      .replace(/JUN/i, "June")
      .replace(/JUL/i, "July")
      .replace(/AUG/i, "August")
      .replace(/SEP/i, "September")
      .replace(/OCT/i, "October")
      .replace(/NOV/i, "November")
      .replace(/DEC/i, "December")

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showImageModal) {
        setShowImageModal(null)
      }
    }

    if (showImageModal) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [showImageModal])

  // Auto-rotate images in carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % coupleImages.length)
    }, 3000) // Change image every 3 seconds

    return () => clearInterval(interval)
  }, [coupleImages.length])

  // Continuous gentle rotation animation
  useEffect(() => {
    const rotationInterval = setInterval(() => {
      setRotationOffset((prev) => (prev + 0.5) % 360)
    }, 50) // Update rotation every 50ms for smooth animation

    return () => clearInterval(rotationInterval)
  }, [])

  const copyToClipboard = async (text: string, itemId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedItems((prev) => new Set(prev).add(itemId))
      setTimeout(() => {
        setCopiedItems((prev) => {
          const newSet = new Set(prev)
          newSet.delete(itemId)
          return newSet
        })
      }, 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  // Generate Google Maps links
  const ceremonyMapsLink = `https://maps.google.com/?q=${encodeURIComponent(ceremonyLocation)}`
  const receptionMapsLink = `https://maps.google.com/?q=${encodeURIComponent(receptionLocation)}`

  const openInMaps = (link: string) => {
    window.open(link, "_blank", "noopener,noreferrer")
  }

  return (
    <div className="relative w-full" style={{ backgroundColor: palette.cream }}>
      {/* Full-bleed layered background — same as hero & gallery */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            background: `linear-gradient(165deg, ${palette.cream} 0%, ${palette.sage}18 40%, ${palette.medium}08 70%, ${palette.deep}06 100%)`,
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{ background: `radial-gradient(ellipse 80% 50% at 50% 20%, ${palette.terracotta} 0%, transparent 60%)` }}
        />
      </div>

      <Section id="details" className="relative z-10 py-12 md:py-16 lg:py-20 overflow-hidden">
      {/* Corner floral decoration - same as hero */}
      <div className="absolute inset-0 pointer-events-none z-[1]">
        <Image
          src="/decoration/flower-decoration-left-bottom-corner2.png"
          alt=""
          width={300}
          height={300}
          className="absolute top-0 left-0 w-auto h-auto max-w-[140px] sm:max-w-[180px] md:max-w-[220px] opacity-25"
          style={{ transform: "scaleY(-1)", filter: DECO_FILTER }}
          priority={false}
        />
        <Image
          src="/decoration/flower-decoration-left-bottom-corner2.png"
          alt=""
          width={300}
          height={300}
          className="absolute top-0 right-0 w-auto h-auto max-w-[140px] sm:max-w-[180px] md:max-w-[220px] opacity-25"
          style={{ transform: "scaleX(-1) scaleY(-1)", filter: DECO_FILTER }}
          priority={false}
        />
        <Image
          src="/decoration/flower-decoration-left-bottom-corner2.png"
          alt=""
          width={300}
          height={300}
          className="absolute bottom-0 left-0 w-auto h-auto max-w-[140px] sm:max-w-[180px] md:max-w-[220px] opacity-25"
          style={{ filter: DECO_FILTER }}
          priority={false}
        />
        <Image
          src="/decoration/flower-decoration-left-bottom-corner2.png"
          alt=""
          width={300}
          height={300}
          className="absolute bottom-0 right-0 w-auto h-auto max-w-[140px] sm:max-w-[180px] md:max-w-[220px] opacity-25"
          style={{ transform: "scaleX(-1)", filter: DECO_FILTER }}
          priority={false}
        />
      </div>

      {/* Header */}
      <div className="relative z-30 text-center mb-6 sm:mb-9 md:mb-12 px-3 sm:px-4">
        <p
          className={`${cormorant.className} text-[0.7rem] sm:text-xs md:text-sm uppercase tracking-[0.28em] mb-2`}
          style={{ color: palette.medium }}
        >
          Ceremony & Reception Details
        </p>

        <h2
          className={`${cinzel.className} text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold mb-1.5 sm:mb-3 md:mb-4`}
          style={{ color: palette.deep }}
        >
          Details
        </h2>

        <p
          className={`${cormorant.className} text-xs sm:text-sm md:text-base font-light max-w-xl mx-auto leading-relaxed px-2 mb-2 sm:mb-3`}
          style={{ color: palette.medium }}
        >
          All the important details to help you join us in celebrating our special day
        </p>

        {/* Decorative element — sage dividers (hero style) */}
        <div className="flex items-center justify-center gap-2 mt-3 sm:mt-4">
          <span className="h-px w-10 sm:w-14 rounded-full" style={{ backgroundColor: palette.sage }} />
          <div className="flex gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full opacity-80" style={{ backgroundColor: palette.sage }} />
            <span className="w-1.5 h-1.5 rounded-full opacity-50" style={{ backgroundColor: palette.sage }} />
            <span className="w-1.5 h-1.5 rounded-full opacity-80" style={{ backgroundColor: palette.sage }} />
          </div>
          <span className="h-px w-10 sm:w-14 rounded-full" style={{ backgroundColor: palette.sage }} />
        </div>
      </div>

      {/* Ceremony & Reception Containers */}
      <div className="relative z-10 max-w-6xl mx-auto px-3 sm:px-5 space-y-6 sm:space-y-8">
        {/* Ceremony Container */}
        <div
          className="overflow-hidden rounded-xl sm:rounded-2xl border bg-white/90 backdrop-blur-2xl shadow-lg transition-transform duration-500 group hover:scale-[1.01]"
          style={{ borderColor: `${palette.sage}50`, boxShadow: `0 18px 48px ${palette.deep}15` }}
        >
          <div className="relative h-64 sm:h-80 md:h-96 w-full">
            <Image
              src="/Details/image.png"
              alt={ceremonyLocationFormatted}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
            <div
              className="absolute inset-0 bg-gradient-to-t to-transparent"
              style={{ background: `linear-gradient(to top, ${palette.deep}dd 0%, ${palette.deep}55 50%, transparent 100%)` }}
            />
            <div className="absolute inset-0 flex flex-col justify-end px-3 sm:px-6 pb-3 sm:pb-6">
              <p className={`${cinzel.className} text-xl sm:text-2xl md:text-3xl font-normal leading-none drop-shadow-md mb-2 text-white`}>
                Ceremony & Reception
              </p>
            </div>
          </div>

          <div className={`${cormorant.className} bg-transparent px-3 sm:px-6 py-4 sm:py-6 space-y-4`} style={{ color: palette.deep }}>
            <div className="text-left pb-3 border-b" style={{ borderColor: `${palette.deep}30` }}>
              <p className="text-[9px] sm:text-[10px] font-semibold tracking-[0.18em] uppercase mb-1 opacity-80">
                Venue
              </p>
              <p className={`${cinzel.className} text-base sm:text-lg md:text-xl`} style={{ color: palette.deep }}>
                {ceremonyVenue}
              </p>
              {/* <p className="text-sm sm:text-base md:text-lg font-medium break-words" style={{ color: palette.deep }}>
                {ceremonyLocationFormatted}
              </p> */}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 text-left">
              <div className="rounded-md border px-2.5 py-2 shadow-sm bg-white/70" style={{ borderColor: `${palette.deep}50` }}>
                <p className="text-[9px] sm:text-[10px] font-semibold tracking-[0.18em] uppercase mb-0.5 opacity-80">Date</p>
                <p className="text-sm sm:text-base font-bold" style={{ color: palette.deep }}>{formattedCeremonyDate}</p>
              </div>
              <div className="rounded-md border px-2.5 py-2 shadow-sm bg-white/70" style={{ borderColor: `${palette.deep}50` }}>
                <p className="text-[9px] sm:text-[10px] font-semibold tracking-[0.18em] uppercase mb-0.5 opacity-80">Time</p>
                <p className="text-sm sm:text-base font-bold" style={{ color: palette.deep }}>{siteConfig.ceremony.time}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-3 pt-2">
              <button
                onClick={() => openInMaps(ceremonyMapsLink)}
                className={`${cinzel.className} flex items-center justify-center gap-1.5 rounded-sm py-2.5 sm:py-3 border-2 transition-all text-xs sm:text-sm font-medium hover:opacity-90 hover:-translate-y-0.5`}
                style={{ backgroundColor: palette.terracotta, color: palette.cream, borderColor: palette.terracotta }}
              >
                <Navigation className="w-4 h-4" />
                Get Directions
              </button>
              <button
                onClick={() => copyToClipboard(ceremonyLocation, "ceremony")}
                className={`${cinzel.className} flex items-center justify-center gap-1.5 rounded-sm border-2 py-2.5 sm:py-3 hover:bg-white/70 transition-all text-xs sm:text-sm font-normal bg-white/50`}
                style={{ borderColor: `${palette.sage}60`, color: palette.deep }}
              >
                {copiedItems.has("ceremony") ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Address
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Reception Container */}
    
      </div>

      {/* Gentle Reminders Container */}
      <div className="relative z-10 max-w-4xl mx-auto px-3 sm:px-5 mt-8 sm:mt-12 md:mt-16">
        <div
          className="relative overflow-hidden rounded-xl sm:rounded-2xl border bg-white/90 backdrop-blur-2xl shadow-lg"
          style={{ borderColor: `${palette.sage}50`, boxShadow: `0 18px 48px ${palette.deep}15` }}
        >
          <div className="relative z-10 px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10">
            {/* <div className="flex justify-center gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-8">
              {coupleImages.map((image, index) => {
                const isActive = index === currentImageIndex
                const baseRotation = index === 0 ? -5 : index === 1 ? 5 : index === 2 ? -3 : 3
                const currentRotation = isActive
                  ? baseRotation + Math.sin((rotationOffset * Math.PI) / 180) * 2
                  : baseRotation
                return (
                  <div
                    key={index}
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg overflow-hidden border-2 shadow-lg transition-all duration-700 ease-in-out ${
                      isActive ? "scale-110 z-10" : "scale-100 opacity-70"
                    }`}
                    style={{
                      transform: `rotate(${currentRotation}deg) ${isActive ? "scale(1.1)" : "scale(1)"}`,
                      borderColor: `${palette.deep}40`,
                    }}
                  >
                    <Image
                      src={image}
                      alt={`Wedding couple ${index + 1}`}
                      fill
                      className={`object-cover transition-opacity duration-500 ${isActive ? "opacity-100" : "opacity-70"}`}
                      sizes="(max-width: 640px) 64px, (max-width: 768px) 80px, 96px"
                    />
                  </div>
                )
              })}
            </div> */}

            <h3
              className={`${cinzel.className} text-2xl sm:text-3xl md:text-4xl text-center mb-6 sm:mb-8 font-normal tracking-wide`}
              style={{ color: palette.deep }}
            >
              GENTLE REMINDERS
            </h3>

            <div className="space-y-4 sm:space-y-5 md:space-y-6 max-w-2xl mx-auto">
              <div className="bg-white/70 rounded-lg p-4 sm:p-5 md:p-6 border shadow-sm" style={{ borderColor: `${palette.deep}50` }}>
                <h4 className={`${cinzel.className} text-base sm:text-lg md:text-xl font-semibold mb-2 sm:mb-3`} style={{ color: palette.deep }}>
                  CHILDREN
                </h4>
                <p className={`${cormorant.className} text-sm sm:text-base md:text-lg leading-relaxed`} style={{ color: palette.deep }}>
                  To allow all of our guests to celebrate without distraction, we respectfully request that the wedding reception be an adults-only event. Thank you for your understanding.
                </p>
              </div>

              <div className="bg-white/70 rounded-lg p-4 sm:p-5 md:p-6 border shadow-sm" style={{ borderColor: `${palette.deep}50` }}>
                <h4 className={`${cinzel.className} text-base sm:text-lg md:text-xl font-semibold mb-2 sm:mb-3`} style={{ color: palette.deep }}>
                  UNPLUGGED CEREMONY
                </h4>
                <p className={`${cormorant.className} text-sm sm:text-base md:text-lg leading-relaxed`} style={{ color: palette.deep }}>
                  We are having an unplugged ceremony, meaning we kindly ask all guests to put away their phones and cameras. We want everyone to be fully in the moment with us. Don&apos;t worry—our professional photographer will capture all the special moments, and we&apos;ll be happy to share them with you later!
                </p>
              </div>

              <div className="bg-white/70 rounded-lg p-4 sm:p-5 md:p-6 border shadow-sm" style={{ borderColor: `${palette.deep}50` }}>
                <h4 className={`${cinzel.className} text-base sm:text-lg md:text-xl font-semibold mb-2 sm:mb-3`} style={{ color: palette.deep }}>
                  ARRIVAL
                </h4>
                <p className={`${cormorant.className} text-sm sm:text-base md:text-lg leading-relaxed`} style={{ color: palette.deep }}>
                  We kindly request guests to arrive by <span className="font-semibold">1:30 PM</span> to allow ample time to settle in before the ceremony, which will begin promptly at <span className="font-semibold">2:30 PM</span>.{" "}
                  The reception will follow at <span className="font-semibold">5:00 PM</span>.
                </p>
              </div>

              <div className="bg-white/70 rounded-lg p-4 sm:p-5 md:p-6 border shadow-sm" style={{ borderColor: `${palette.deep}50` }}>
                <h4 className={`${cinzel.className} text-base sm:text-lg md:text-xl font-semibold mb-2 sm:mb-3`} style={{ color: palette.deep }}>
                  GIFTS
                </h4>
                <p className={`${cormorant.className} text-sm sm:text-base md:text-lg leading-relaxed`} style={{ color: palette.deep }}>
                  Your presence is already the greatest gift, but if you&apos;d like to give something, cash gifts are preferred. This will help us start our new journey together in the most meaningful way.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal - hero color base */}
      {showImageModal && (
        <div
          className="fixed inset-0 backdrop-blur-xl z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-500"
          onClick={() => setShowImageModal(null)}
          style={{ backgroundColor: `${palette.deep}F5` }}
        >
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse opacity-20"
              style={{ backgroundColor: palette.cream }}
            />
            <div
              className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse opacity-20"
              style={{ backgroundColor: palette.cream, animationDelay: "1s" }}
            />
          </div>

          <div
            className="relative max-w-6xl w-full max-h-[95vh] sm:max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl border-2 animate-in zoom-in-95 duration-500 group bg-white"
            onClick={(e) => e.stopPropagation()}
            style={{ borderColor: palette.deep }}
          >
            <div
              className="absolute top-0 left-0 right-0 h-1"
              style={{ background: `linear-gradient(to right, ${palette.deep}, ${palette.cream}, ${palette.deep})` }}
            />

            <button
              onClick={() => setShowImageModal(null)}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 md:top-6 md:right-6 z-20 p-2.5 sm:p-3 rounded-xl shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl active:scale-95 border-2"
              title="Close (ESC)"
              style={{ backgroundColor: "white", borderColor: palette.deep, color: palette.deep }}
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
            </button>

            <div className="absolute top-4 left-4 sm:top-5 sm:left-5 md:top-6 md:left-6 z-20">
              <div
                className="flex items-center gap-2 backdrop-blur-md px-4 py-2 rounded-full shadow-xl border-2 bg-white"
                style={{ borderColor: palette.deep, color: palette.deep }}
              >
                {showImageModal === "ceremony" ? (
                  <>
                    <Heart className="w-4 h-4" fill={palette.deep} style={{ color: palette.deep }} />
                    <span className="text-xs sm:text-sm font-bold">Ceremony Venue</span>
                  </>
                ) : (
                  <>
                    <Utensils className="w-4 h-4" style={{ color: palette.deep }} />
                    <span className="text-xs sm:text-sm font-bold">Reception Venue</span>
                  </>
                )}
              </div>
            </div>

            <div className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] overflow-hidden bg-white">
              <Image
                src={showImageModal === "ceremony" ? "/Details/Holy Rosary Parish Church Angeles Pampanga.jpg" : "/Details/Ardesia Resort And Spa Angeles Pampanga.jpg"}
                alt={showImageModal === "ceremony" ? ceremonyLocationFormatted : receptionLocationFormatted}
                fill
                className="object-contain p-6 sm:p-8 md:p-10 transition-transform duration-700 group-hover:scale-105 z-10"
                sizes="95vw"
                priority
              />
            </div>

            <div
              className={`${cormorant.className} p-5 sm:p-6 md:p-8 bg-white backdrop-blur-sm border-t-2 relative`}
              style={{ borderColor: `${palette.deep}40` }}
            >
              <div
                className="absolute top-0 left-8 right-8 h-px opacity-30"
                style={{ background: `linear-gradient(to right, transparent, ${palette.deep}, transparent)` }}
              />

              <div className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="space-y-2">
                    <h3
                      className={`${cinzel.className} text-xl sm:text-2xl md:text-3xl font-bold flex items-center gap-3`}
                      style={{ color: palette.deep }}
                    >
                      {showImageModal === "ceremony" ? (
                        <Heart className="w-6 h-6" fill={palette.deep} style={{ color: palette.deep }} />
                      ) : (
                        <Utensils className="w-6 h-6" style={{ color: palette.deep }} />
                      )}
                      {showImageModal === "ceremony" ? siteConfig.ceremony.venue : siteConfig.reception.venue}
                    </h3>
                    <div className="flex items-center gap-2 text-sm opacity-80" style={{ color: palette.deep }}>
                      <MapPin className="w-4 h-4" />
                      <span>
                        {showImageModal === "ceremony"
                          ? ceremonyLocationFormatted
                          : receptionLocationFormatted}
                      </span>
                    </div>

                    {showImageModal === "ceremony" && (
                      <div
                        className="flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg border w-fit"
                        style={{ borderColor: `${palette.deep}50`, color: palette.deep }}
                      >
                        <Clock className="w-4 h-4" />
                        <span>
                          {formattedCeremonyDate} at {siteConfig.ceremony.time}
                        </span>
                      </div>
                    )}
                    {showImageModal === "reception" && (
                      <div
                        className="flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg border w-fit"
                        style={{ borderColor: `${palette.deep}50`, color: palette.deep }}
                      >
                        <Clock className="w-4 h-4" />
                        <span>
                          {formattedReceptionDate} - {siteConfig.reception.time}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                    <button
                      onClick={() =>
                        copyToClipboard(
                          showImageModal === "ceremony" ? ceremonyLocation : receptionLocation,
                          `modal-${showImageModal}`,
                        )
                      }
                      className="flex items-center justify-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 border-2 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 shadow-md whitespace-nowrap"
                      title="Copy address"
                      style={{ borderColor: palette.deep, color: palette.deep, backgroundColor: "white" }}
                    >
                      {copiedItems.has(`modal-${showImageModal}`) ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy Address</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() =>
                        openInMaps(showImageModal === "ceremony" ? ceremonyMapsLink : receptionMapsLink)
                      }
                      className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 shadow-lg whitespace-nowrap text-white"
                      style={{ backgroundColor: palette.terracotta, color: palette.cream }}
                    >
                      <Navigation className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Get Directions</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs opacity-70" style={{ color: palette.deep }}>
                  <span className="flex items-center gap-1.5">
                    <Camera className="w-3 h-3" />
                    Click outside to close
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span className="hidden sm:inline-flex items-center gap-1.5">Press ESC to close</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </Section>
    </div>
  )
}