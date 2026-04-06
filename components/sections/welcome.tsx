"use client"

import { Section } from "@/components/section"
import { siteConfig } from "@/content/site"
import { Cormorant_Garamond, Cinzel } from "next/font/google"
import { CloudinaryImage } from "@/components/ui/cloudinary-image"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
})

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: "400",
})


// Palette lives in globals.css → @theme inline → --color-motif-*
// Edit there once to update every component.

// Corner decoration - white
const DECO_FILTER = "brightness(0) invert(1)"

export function Welcome() {
  const brideName = siteConfig.couple.brideNickname || siteConfig.couple.bride
  const groomName = siteConfig.couple.groomNickname || siteConfig.couple.groom
  return (
    <Section
      id="welcome"
      className="relative overflow-hidden bg-transparent -mt-2 sm:-mt-3 pt-4 sm:pt-5 pb-12 sm:pb-16 md:pb-20"
    >
      {/* Corner floral decoration - same as countdown section */}
      <div className="absolute left-0 top-0 z-0 pointer-events-none">
        {/* <CloudinaryImage
          src="/decoration/flower-decoration-left-bottom-corner2.png"
          alt=""
          width={300}
          height={300}
          className="w-auto h-auto max-w-[140px] sm:max-w-[180px] md:max-w-[220px] lg:max-w-[260px] opacity-60 scale-y-[-1]"
          priority={false}
        /> */}
      </div>
      <div className="absolute right-0 top-0 z-0 pointer-events-none">
        {/* <CloudinaryImage
          src="/decoration/flower-decoration-left-bottom-corner2.png"
          alt=""
          width={300}
          height={300}
          className="w-auto h-auto max-w-[140px] sm:max-w-[180px] md:max-w-[220px] lg:max-w-[260px] opacity-60 scale-x-[-1] scale-y-[-1]"
          priority={false}
        /> */}
      </div>
      <div className="absolute left-0 bottom-0 z-0 pointer-events-none">
        {/* <CloudinaryImage
          src="/decoration/flower-decoration-left-bottom-corner2.png"
          alt=""
          width={300}
          height={300}
          className="w-auto h-auto max-w-[140px] sm:max-w-[180px] md:max-w-[220px] lg:max-w-[260px] opacity-60"
          priority={false}
        /> */}
      </div>
      <div className="absolute right-0 bottom-0 z-0 pointer-events-none">
        {/* <CloudinaryImage
          src="/decoration/flower-decoration-left-bottom-corner2.png"
          alt=""
          width={300}
          height={300}
          className="w-auto h-auto max-w-[140px] sm:max-w-[180px] md:max-w-[220px] lg:max-w-[260px] opacity-60 scale-x-[-1]"
          priority={false}
        /> */}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl md:rounded-[2rem] border border-motif-accent/30 bg-motif-cream shadow-[0_16px_60px_rgba(91,102,85,0.12)] px-4 sm:px-5 md:px-8 lg:px-10 py-6 sm:py-8 md:py-10 lg:py-12">
          {/* Subtle accent overlay */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80" style={{ background: 'radial-gradient(circle at center, color-mix(in srgb, var(--color-motif-accent) 6%, transparent), transparent 60%)' }} />
            <div className="absolute bottom-[-6rem] right-[-2rem] w-64 h-64" style={{ background: 'radial-gradient(circle at center, color-mix(in srgb, var(--color-motif-accent) 5%, transparent), transparent 60%)' }} />
            <div className="absolute inset-[1px] rounded-[inherit] border border-motif-accent/10" />
          </div>

          <div className="relative text-center space-y-4 sm:space-y-6 md:space-y-7 lg:space-y-8">
          {/* Main heading */}
          <div className="space-y-1 sm:space-y-1.5 md:space-y-2.5">
            <p
              className={`${cormorant.className} text-[0.65rem] sm:text-[0.7rem] md:text-xs lg:text-sm uppercase tracking-[0.24em] sm:tracking-[0.28em]`}
              style={{ color: 'var(--color-motif-deep)' }}
            >
              {brideName} &amp; {groomName}
            </p>
            <h2
              className="lighten-regular text-[32px] sm:text-[40px] md:text-[48px] lg:text-[56px] xl:text-[64px] leading-tight"
              style={{ color: 'var(--color-motif-deep)' }}
            >
              Welcome to our forever
            </h2>


            {/* Verse */}
            <div className="space-y-0.5 sm:space-y-1">
              <p
                className={`${cormorant.className} text-[0.7rem] sm:text-xs md:text-sm lg:text-base italic leading-relaxed`}
                style={{ color: 'var(--color-motif-deep)', opacity: 0.9 }}
              >
                &quot;I have found the one whom my soul loves.&quot;
              </p>
              <p className={`${cormorant.className} text-[0.7rem] sm:text-xs md:text-sm lg:text-base italic leading-relaxed`} style={{ color: 'var(--color-motif-deep)', opacity: 0.9 }}>Song of Solomon 3:4</p>

            </div>

            {/* Divider */}
            <div className="flex items-center justify-center gap-2 pt-1">
              <span className="h-px w-10 sm:w-16 md:w-20 bg-motif-accent/40" />
              <span className="w-1.5 h-1.5 rounded-full bg-motif-accent" />
              <span className="h-px w-10 sm:w-16 md:w-20 bg-motif-accent/40" />
            </div>
          </div>

          {/* Body text */}
          <div
            className={`${cormorant.className} text-[0.75rem] sm:text-[0.85rem] md:text-sm lg:text-base leading-relaxed sm:leading-6 md:leading-7 space-y-2.5 sm:space-y-3 md:space-y-4`}
            style={{ color: 'var(--color-motif-deep)' }}
          >
            <p>
            Our love is a blessing we hold close to our hearts, and we are deeply grateful to God for gently guiding our story and bringing our lives together in such a beautiful way. With hearts full of joy and thanksgiving, we are so happy to share this special moment of our journey with you. Your love, prayers, and support have meant so much to us, and it would mean the world to celebrate this meaningful day surrounded by the people who have been part of our lives and our story.
            </p>
            <p>
            As you prepare to celebrate with us, please feel free to browse through the important information and helpful reminders. Everything you need to know for the day is here. Your presence and shared joy will truly make this celebration even more special for us. 
            </p>
          </div>
          </div>
        </div>
      </div>
    </Section>
  )
}


