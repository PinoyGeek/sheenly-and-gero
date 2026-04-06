"use client"

import type React from "react"
import { Section } from "@/components/section"
import { siteConfig } from "@/content/site"
import { MapPin } from "lucide-react"
import { motion } from "motion/react"
import { Cormorant_Garamond, Cinzel } from "next/font/google"
import { CloudinaryImage } from "@/components/ui/cloudinary-image"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400"],
})

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400"],
})

// const { groomNickname, brideNickname } = siteConfig.couple
const ceremonyTime = siteConfig.ceremony.time
const guestsTime = siteConfig.ceremony.guestsTime ?? "1:30 PM"
const ceremonyVenue = siteConfig.ceremony.venue
const receptionVenue = siteConfig.reception.venue

// Colors sourced from globals.css @theme inline — edit there to update everywhere
// This section sits on a darker background, so render timeline text/icons in white.
const TIMELINE_TEXT = "var(--color-motif-cream)"
// SVG stroke — CSS vars are not valid SVG attributes
const TIMELINE_SVG_STROKE = "#FFFFFF"
// White tint for corner florals — section sits on dark background
const DECO_FILTER_WHITE = "brightness(0) saturate(100%) invert(1)"

type TimelineIcon = React.ComponentType<React.SVGProps<SVGSVGElement>>

interface TimelineEvent {
  time: string
  title: string
  description?: string
  location?: string
  icon: TimelineIcon
  /** Optional image source to override the default SVG icon for this event. */
  imageSrc?: string
}

const timelineEvents: TimelineEvent[] = [
  {
    time: "12:00 PM",
    title: "Arrival",
    // description: "Please arrive on time to find your seat, settle in, and get ready for the celebration.",
    location: ceremonyVenue,
    icon: GuestsIcon,
    imageSrc: "/weddingtimeline/arrivalimage.png",
  },
  {
    time: "1:00 PM",
    title: "Wedding Ceremony",
    // description: `Join us as ${groomNickname} & ${brideNickname} exchange vows and begin their life together.`,
    location: ceremonyVenue,
    icon: RingsIcon,
    imageSrc: "/weddingtimeline/WeddingCeremony.png",
  },
  {
    time: "2:30 PM",
    title: "Photos",
    // description: "We are having an unplugged ceremony, meaning we kindly ask all guests to put away their phones and cameras. We want everyone to be fully in the moment with us. Don't worry—our professional photographer will capture all the special moments, and we'll be happy to share them with you later!",
    location: ceremonyVenue,
    icon: RingsIcon,
    imageSrc: "/weddingtimeline/PhotoSession.png",
  },
  {
    time: "4:00 PM",
    title: "Cocktail Hour",
    // description: "Enjoy drinks and light bites as we transition into the reception and mingle with guests.",
    location: receptionVenue,
    icon: CocktailIcon,
    imageSrc: "/weddingtimeline/CockTailHour.png",
  },
  {
    time: "5:30 PM",
    title: "Program Starts",
    // description: `Celebrate the grand entrance of ${groomNickname} & ${brideNickname} and the start of the evening festivities.`,
    location: receptionVenue,
    icon: FireworksIcon,
    imageSrc: "/weddingtimeline/reception welcom.png",
  },
  {
    time: "6:30 PM",
    title: "Dinner Service",
    // description: "Share a relaxed meal together as we continue the celebration.",
    location: receptionVenue,
    icon: DinnerIcon,
    imageSrc: "/weddingtimeline/DinnerService.png",
  },
  {
    time: "8:30 PM",
    title: "Party",
    // description: "Let's dance the night away and celebrate this new chapter!",
    location: receptionVenue,
    icon: DanceIcon,
    imageSrc: "/weddingtimeline/SendOff.png",
  },
]

export function WeddingTimeline() {
  return (
    <Section
      id="wedding-timeline"
      className="relative py-10 sm:py-12 md:py-16 lg:py-20 overflow-hidden"
    >
      {/* Corner floral decoration */}
      <div className="absolute inset-0 pointer-events-none z-[1]">
        <CloudinaryImage
          src="/decoration/corner-left-bottom.png"
          alt=""
          width={300}
          height={300}
          className="absolute top-0 left-0 w-auto h-auto max-w-[120px] sm:max-w-[160px] md:max-w-[200px]"
          style={{ transform: "scaleY(-1)" }}
          priority={false}
        />
        <CloudinaryImage
          src="/decoration/corner-left-bottom.png"
          alt=""
          width={300}
          height={300}
          className="absolute top-0 right-0 w-auto h-auto max-w-[120px] sm:max-w-[160px] md:max-w-[200px]"
          style={{ transform: "scaleX(-1) scaleY(-1)" }}
          priority={false}
        />
        <CloudinaryImage
          src="/decoration/corner-left-bottom.png"
          alt=""
          width={300}
          height={300}
          className="absolute bottom-0 left-0 w-auto h-auto max-w-[120px] sm:max-w-[160px] md:max-w-[200px]"
          priority={false}
        />
        <CloudinaryImage
          src="/decoration/corner-left-bottom.png"
          alt=""
          width={300}
          height={300}
          className="absolute bottom-0 right-0 w-auto h-auto max-w-[120px] sm:max-w-[160px] md:max-w-[200px]"
          style={{ transform: "scaleX(-1)" }}
          priority={false}
        />
      </div>

      {/* Header */}
      <div className="relative z-10 text-center mb-8 sm:mb-10 md:mb-12 px-3 sm:px-4">
        <p
          className="text-[10px] sm:text-xs md:text-sm font-semibold text-motif-medium uppercase tracking-[0.2em] mb-1 sm:mb-1.5 mt-4 sm:mt-6 md:mt-8"
          style={{ color: 'var(--color-motif-cream)' }}
        >
          Wedding Day
        </p>

        <h2
          className="lighten-regular text-[40px] sm:text-[50px] md:text-[60px] lg:text-[70px] xl:text-[80px] leading-tight mb-2 drop-shadow"
          style={{ color: 'var(--color-motif-cream)' }}
        >
          Timeline
        </h2>

        <p
          className={`${cormorant.className} text-[11px] sm:text-sm md:text-base lg:text-lg max-w-xl mx-auto leading-relaxed px-2 opacity-90 drop-shadow-sm`}
          style={{ color: TIMELINE_TEXT }}
        >
          A simple overview of the key moments of our day, from arrival to farewell.
        </p>

        <div className="flex items-center justify-center gap-2 mt-4 sm:mt-5">
          <div
            className="w-10 sm:w-14 md:w-20 h-px opacity-50"
            style={{ backgroundColor: "color-mix(in srgb, var(--color-motif-cream) 55%, transparent)" }}
          />
          <div className="w-1.5 h-1.5 rounded-full opacity-80" style={{ backgroundColor: TIMELINE_TEXT }} />
          <div className="w-1.5 h-1.5 rounded-full opacity-55" style={{ backgroundColor: TIMELINE_TEXT }} />
          <div className="w-1.5 h-1.5 rounded-full opacity-80" style={{ backgroundColor: TIMELINE_TEXT }} />
          <div
            className="w-10 sm:w-14 md:w-20 h-px opacity-50"
            style={{ backgroundColor: "color-mix(in srgb, var(--color-motif-cream) 55%, transparent)" }}
          />
        </div>
      </div>

      {/* Timeline */}
      <div className="relative z-10 max-w-6xl mx-auto px-3 sm:px-5 lg:px-8">
        {/* Center line */}
        <div
          className="absolute left-1/2 -translate-x-1/2 inset-y-0 w-[2px] sm:w-px pointer-events-none opacity-80 z-0"
          style={{
            background:
              "linear-gradient(to bottom, transparent, color-mix(in srgb, var(--color-motif-cream) 60%, transparent), transparent)",
          }}
        />

        <div className="space-y-7 sm:space-y-8 md:space-y-10 lg:space-y-12">
          {timelineEvents.map((event, index) => (
            <TimelineItem key={event.title} event={event} index={index} />
          ))}
        </div>
      </div>
    </Section>
  )
}

function TimelineItem({ event, index }: { event: TimelineEvent; index: number }) {
  const Icon = event.icon
  const isEven = index % 2 === 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="relative z-10"
    >
      {/* Desktop: alternating left/right text with opposite-side icon, centered line + dot */}
      <div className="hidden md:grid grid-cols-[1fr_auto_1fr] items-center gap-x-10 lg:gap-x-14">
        {/* Left side */}
        <div className={`${isEven ? "" : "text-right"}`}>
          <div className="flex items-center justify-end gap-4">
            {!isEven ? <TimelineText event={event} align="right" /> : <IconMark Icon={Icon} imageSrc={event.imageSrc} />}
            <div
              className="hidden lg:block w-10 h-px opacity-70"
              style={{ backgroundColor: "color-mix(in srgb, var(--color-motif-cream) 65%, transparent)" }}
            />
          </div>
        </div>

        {/* Center dot */}
        <div className="relative flex items-center justify-center">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: TIMELINE_TEXT }} />
        </div>

        {/* Right side */}
        <div>
          <div className="flex items-center justify-start gap-4">
            <div
              className="hidden lg:block w-10 h-px opacity-70"
              style={{ backgroundColor: "color-mix(in srgb, var(--color-motif-cream) 65%, transparent)" }}
            />
            {isEven ? <TimelineText event={event} align="left" /> : <IconMark Icon={Icon} imageSrc={event.imageSrc} />}
          </div>
        </div>
      </div>

      {/* Mobile: centered line + alternating text/icon */}
      <div className="md:hidden grid grid-cols-[1fr_auto_1fr] items-center gap-x-4 sm:gap-x-6">
        {/* Left side */}
        <div className={`${isEven ? "" : "text-right"}`}>
          <div className="flex items-center justify-end gap-3">
            {!isEven ? <TimelineText event={event} align="right" mobile /> : <IconMark Icon={Icon} imageSrc={event.imageSrc} mobile />}
            <div
              className="w-6 h-px opacity-70"
              style={{ backgroundColor: "color-mix(in srgb, var(--color-motif-cream) 65%, transparent)" }}
            />
          </div>
        </div>

        {/* Center dot */}
        <div className="relative flex items-center justify-center">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: TIMELINE_TEXT }} />
        </div>

        {/* Right side */}
        <div>
          <div className="flex items-center justify-start gap-3">
            <div
              className="w-6 h-px opacity-70"
              style={{ backgroundColor: "color-mix(in srgb, var(--color-motif-cream) 65%, transparent)" }}
            />
            {isEven ? <TimelineText event={event} align="left" mobile /> : <IconMark Icon={Icon} imageSrc={event.imageSrc} mobile />}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function TimelineText({
  event,
  align,
  mobile,
}: {
  event: TimelineEvent
  align: "left" | "right"
  mobile?: boolean
}) {
  const textAlign = align === "right" ? "text-right" : "text-left"
  return (
    <div className={`${textAlign} max-w-md ${align === "right" ? "ml-auto" : "mr-auto"}`}>
      <p
        className={`${cinzel.className} ${
          mobile ? "text-[0.7rem]" : "text-[0.75rem] lg:text-sm"
        } tracking-[0.22em] uppercase drop-shadow-sm`}
        style={{ color: TIMELINE_TEXT }}
      >
        {event.title}
      </p>
      <p
        className={`${cormorant.className} ${
          mobile ? "text-[0.75rem]" : "text-sm lg:text-base"
        } mt-0.5 opacity-95 drop-shadow-sm`}
        style={{ color: TIMELINE_TEXT }}
      >
        at {event.time}
      </p>

      {event.description && (
        <p
          className={`${cormorant.className} ${
            mobile ? "text-[10px]" : "text-xs lg:text-sm"
          } mt-1.5 leading-relaxed opacity-90 drop-shadow-sm`}
          style={{ color: TIMELINE_TEXT }}
        >
          {event.description}
        </p>
      )}

      {event.location && (
        <div
          className={`mt-1.5 flex items-start gap-1.5 ${align === "right" ? "justify-end" : "justify-start"} opacity-90`}
        >
          <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 drop-shadow-sm" style={{ color: TIMELINE_TEXT }} />
          <p
            className={`${cormorant.className} ${mobile ? "text-[10px]" : "text-xs lg:text-sm"} leading-relaxed drop-shadow-sm`}
            style={{ color: TIMELINE_TEXT }}
          >
            {event.location}
          </p>
        </div>
      )}
    </div>
  )
}

function IconMark({
  Icon,
  mobile,
  imageSrc,
}: {
  Icon: TimelineIcon
  mobile?: boolean
  imageSrc?: string
}) {
  if (imageSrc) {
    return (
      <CloudinaryImage
        src={imageSrc}
        alt=""
        width={96}
        height={96}
        className={`${
          mobile ? "w-16 h-16" : "w-18 h-18 lg:w-22 lg:h-22"
        } object-contain brightness-0 invert drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]`}
      />
    )
  }
  
  return (
    <div
      className={`${
        mobile ? "w-14 h-14" : "w-16 h-16 lg:w-18 lg:h-18"
      } rounded-full border bg-white/15 flex items-center justify-center drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]`}
      style={{ borderColor: "color-mix(in srgb, var(--color-motif-cream) 45%, transparent)" }}
    >
      <Icon className={`${mobile ? "w-7 h-7" : "w-8 h-8 lg:w-9 lg:h-9"}`} style={{ color: TIMELINE_TEXT }} />
    </div>
  )
}

/* Hand-drawn–style timeline icons */

const iconStroke = TIMELINE_SVG_STROKE

function GuestsIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke={iconStroke} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M11 16a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" />
      <path d="M21 16a3.5 3.5 0 1 0-3.5-3.5A3.5 3.5 0 0 0 21 16Z" />
      <path d="M4 24.5c1.2-3 3.9-4.5 7-4.5s5.8 1.5 7 4.5" />
      <path d="M17.5 19.5A6 6 0 0 1 26 24" />
    </svg>
  )
}

function RingsIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke={iconStroke} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="20" r="6" />
      <circle cx="20" cy="20" r="6" />
      <path d="M14 9 16 5l2 4" />
      <path d="M13 7h6" />
    </svg>
  )
}

function FireworksIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke={iconStroke} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 5v4" />
      <path d="M9 7l2.5 2.5" />
      <path d="M23 7 20.5 9.5" />
      <path d="M8 14h4" />
      <path d="M20 14h4" />
      <path d="M11 21 8 24" />
      <path d="M21 21 24 24" />
      <circle cx="16" cy="14" r="3" />
    </svg>
  )
}

function DinnerIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke={iconStroke} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="16" cy="16" r="7" />
      <path d="M7 8v12" />
      <path d="M9.5 8v12" />
      <path d="M23 8v12" />
      <path d="M5 24h22" />
    </svg>
  )
}

function CocktailIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke={iconStroke} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M8 28h16" />
      <path d="M16 28V12" />
      <path d="M10 12h12l-1-4H11l-1 4Z" />
      <circle cx="16" cy="8" r="2" />
      <path d="M12 16h8" />
    </svg>
  )
}

function DanceIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke={iconStroke} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="10" cy="12" r="3" />
      <circle cx="22" cy="12" r="3" />
      <path d="M10 15v6a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-6" />
      <path d="M12 23v2" />
      <path d="M20 23v2" />
      <path d="M8 18h16" />
      <path d="M16 5v4" />
      <path d="M13 7l3-2 3 2" />
    </svg>
  )
}

