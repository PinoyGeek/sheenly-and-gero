"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { Section } from "@/components/section"
import { CloudinaryImage } from "@/components/ui/cloudinary-image"
import { Cormorant_Garamond, Cinzel } from "next/font/google"
import { siteConfig } from "@/content/site"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
})

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600"],
})

// Colors sourced from globals.css @theme inline — edit there to update everywhere
const palette = {
  deep:          "var(--color-motif-deep)",
  softBrown:     "var(--color-motif-medium)",
  background:    "var(--color-motif-cream)",
  champagneGold: "var(--color-motif-silver)",
  champagneLight:"var(--color-motif-cream)",
} as const

interface FAQItem {
  question: string
  answer: string
}

const faqItems: FAQItem[] = [
  {
    question: "When is the wedding?",
    answer:
    `Our wedding will be held on ${siteConfig.ceremony.date} (${siteConfig.ceremony.day})`
  },
  {
    question: "What time should I arrive for the ceremony?",
    answer:
      `Our ceremony will begin promptly at ${siteConfig.ceremony.time}. We kindly ask guests to arrive 30–45 minutes earlier to allow enough time for parking, walking to the ceremony area, and finding your seats so we can begin on time.`,
  },
  {
    question: "Where will the ceremony and reception take place?",
    answer:
    `The ceremony and reception will be held at ${siteConfig.ceremony.location}, ${siteConfig.ceremony.venue}. You can find detailed directions, addresses, and maps in the Details Section above`
  },
  {
    question: "Is there an entourage call time?",
    answer:
    `Yes. We request our Principal Sponsors to arrive at ${siteConfig.ceremony.entourageTime} so we can prepapre and settle before the ceremony begins`
  },
  {
    question: "How do I RSVP?",
    answer:
    `Please RSVP through the RSVP section on this invitation. Simply search for your name in the guest list and confirm your attendance. Due Date of final RSVP is on ${siteConfig.details.rsvp.deadline}. For any questions, please contact ${siteConfig.details.rsvp.contact} via Messenger`
  },
  {
    question: "Are children allowed?",
    answer:
    "While we love your little ones, in the spirit of celebration and intimacy, we kindly request that this special day occasion be reserved for adults only. "
  },
  {
    question: "Can I sit anywhere at the reception?",
    answer:
      "Please don't. We kindly ask our guests to follow the seating arrangement prepared for the reception.\n\nA great deal of thought and care went into planning the seating so that everyone will feel comfortable and be seated with friends, family, or guests who share similar connections. Each seat was thoughtfully arranged with every guest in mind. Our reception team will gladly assist you in finding your assigned table.",
  },
  {
    question: "Is there parking available?",
    answer:
      "Yes, parking is available at the venue, and parking attendants, along with our coordinators, will assist you on the day",
  },
  {
    question: "Will there be a wedding gift registry?",
    answer:
      "With all that we have, we are truly blessed. Your presence and prayers are what we request most. However, if you desire to give nonetheless, a monetary gift to help us begin our new life together would be humbly appreciated. You can find our gift registry information in the Gift Guide section.",
  },
  {
    question: "Unplugged Ceremony",
    answer:
      "EYES UP, PHONES DOWN, HEARTS OPEN.\n\nThe greatest gift you can give us during our ceremony is your presence. We respectfully request that guests refrain from taking photos or videos during the ceremony so our official photographers can capture every moment without distraction. We promise to share the beautiful photos with you afterward!\n\nOur professional photographers will be capturing every beautiful memory, and we promise to share the photos with everyone afterwards.",
  },
  {
    question: "Can I take photos or videos during the reception?",
    answer:
      "Yes! While our I DO’s will be unplugged, our reception will not be. As a couple who loves photos and memories, we would love for you to capture the fun moments throughout the evening. We prepared this celebration wholeheartedly and we want everyone to enjoy it fully.",
  },
  {
    question: "What should I do if I can’t make it?",
    answer:
      "Your presence will truly be missed, but we completely understand.\n\nPlease kindly let us know through RSVP as soon as possible so we may adjust arrangements accordingly.",
  },
  {
    question: "I said “No” to RSVP but my plans changed. Can I still attend?",
    answer:
      "Please check with us first before making arrangements. Due to limited seating and a carefully planned guest list, attendance cannot be guaranteed without prior confirmation.",
  },
  {
    question: "When is the appropriate time to leave?",
    answer:
      "It took us some time to plan for a heartfelt wedding that everyone would hopefully enjoy. We humbly request that you celebrate with us until the program ends. Please don't eat and run! Let's laugh, take pictures, sing, and have fun!",
  },
  {
    question: "What if I have dietary restrictions or allergies?",
    answer:
      "Please let us know about any dietary restrictions or allergies when you RSVP. We want to ensure everyone can enjoy the celebration comfortably.",
  },
  {
    question: "How can I help the couple have a great time during their wedding?",
    answer:
      "• Pray with us for favorable weather and the continuous blessings of our Lord as we enter this new chapter of our lives as husband and wife.\n\n• RSVP as soon as your schedule is cleared.\n\n• Dress appropriately and follow our wedding motif.\n\n• Be on time.\n\n• Follow the seating arrangement in the reception.\n\n• Stay until the end of the program.\n\n• Join the activities and enjoy!",
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="relative w-full" style={{ backgroundColor: palette.background }}>
      {/* Full-bleed layered background — champagne + beige with gentle texture */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        {/* Soft diagonal wash */}
        <div
          className="absolute inset-0 opacity-[0.24]"
          style={{
            background: 'linear-gradient(150deg, var(--color-motif-cream) 0%, color-mix(in srgb, var(--color-motif-silver) 14%, transparent) 35%, color-mix(in srgb, var(--color-motif-medium) 6%, transparent) 70%, color-mix(in srgb, var(--color-motif-deep) 3%, transparent) 100%)',
          }}
        />
        {/* Glow behind FAQ card */}
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            background: 'radial-gradient(circle at 50% 10%, var(--color-motif-silver) 0%, transparent 55%)',
          }}
        />
        {/* Subtle vertical texture */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, rgba(255,255,255,0.0) 0, rgba(255,255,255,0.0) 32px, rgba(255,255,255,0.3) 33px, rgba(255,255,255,0.3) 34px)",
          }}
        />
      </div>

      <Section id="faq" className="relative z-10 py-12 md:py-16 lg:py-20 overflow-hidden">
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

      {/* Section Header */}
      <div className="relative z-30 text-center mb-6 sm:mb-9 md:mb-12 px-3 sm:px-4">
        <p className={`${cormorant.className} text-[0.7rem] sm:text-xs md:text-sm uppercase tracking-[0.28em] mb-2`} style={{ color: palette.softBrown }}>
          Answers for our celebration day
        </p>
        <h2 
                className="lighten-regular text-[32px] sm:text-[40px] md:text-[48px] lg:text-[56px] xl:text-[64px] leading-tight"
                style={{ color: 'var(--color-motif-deep)' }}
                >
          Frequently Asked Questions
        </h2>
        <p className="text-xs sm:text-sm md:text-base font-light max-w-xl mx-auto leading-relaxed px-2 mb-2 sm:mb-3" style={{ color: 'var(--color-motif-medium)' }}>
          Helpful notes so you can simply arrive, celebrate, and enjoy this new chapter with us.
        </p>
        <div className="flex items-center justify-center gap-2 mt-3 sm:mt-4">
          <span className="h-px w-10 sm:w-14 rounded-full" style={{ backgroundColor: palette.champagneGold }} />
          <div className="flex gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full opacity-80" style={{ backgroundColor: palette.champagneGold }} />
            <span className="w-1.5 h-1.5 rounded-full opacity-50" style={{ backgroundColor: palette.champagneGold }} />
            <span className="w-1.5 h-1.5 rounded-full opacity-80" style={{ backgroundColor: palette.champagneGold }} />
          </div>
          <span className="h-px w-10 sm:w-14 rounded-full" style={{ backgroundColor: palette.champagneGold }} />
        </div>
      </div>

      {/* FAQ content — cream container with motif accents */}
      <div className="relative z-30 max-w-4xl mx-auto px-3 sm:px-5">
        <div
          className="relative backdrop-blur-md rounded-xl sm:rounded-2xl overflow-hidden shadow-lg"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--color-motif-cream) 94%, transparent)',
            boxShadow: '0 4px 28px color-mix(in srgb, var(--color-motif-deep) 10%, transparent)',
          }}
        >
          <div className="relative p-2.5 sm:p-4 md:p-5 lg:p-6">
            <div className="space-y-1.5 sm:space-y-2 md:space-y-3">
              {faqItems.map((item, index) => {
                const isOpen = openIndex === index
                const contentId = `faq-item-${index}`
                return (
                  <div
                    key={index}
                    className="rounded-xl sm:rounded-2xl border overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md"
                    style={{
                      backgroundColor: 'color-mix(in srgb, var(--color-motif-cream) 96%, white)',
                      // borderColor: 'color-mix(in srgb, var(--color-motif-silver) 33%, transparent)',
                      boxShadow: '0 4px 28px color-mix(in srgb, var(--color-motif-deep) 10%, transparent)',
                    }}
                  >
                    <button
                      onClick={() => toggleItem(index)}
                      className="group w-full px-2.5 sm:px-3 md:px-4 lg:px-5 py-2 sm:py-2.5 md:py-3 lg:py-4 flex items-center justify-between text-left outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-motif-deep transition-colors"
                      aria-expanded={isOpen}
                      aria-controls={contentId}
                    >
                      <span
                        className="font-semibold pr-2 sm:pr-3 md:pr-4 text-xs sm:text-sm md:text-base lg:text-lg leading-snug sm:leading-relaxed transition-colors duration-200"
                        style={{ color: isOpen ? palette.softBrown : palette.deep }}
                      >
                        {item.question}
                      </span>
                      <ChevronDown
                        size={18}
                        className={`flex-shrink-0 transition-transform duration-300 w-4 h-4 sm:w-5 sm:h-5 ${isOpen ? "rotate-180" : ""}`}
                        style={{ color: palette.softBrown }}
                        aria-hidden
                      />
                    </button>

                    <div
                      id={contentId}
                      role="region"
                      className={`grid transition-all duration-300 ease-out ${
                        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div
                          className="px-2.5 sm:px-3 md:px-4 lg:px-5 py-2 sm:py-2.5 md:py-3 lg:py-4 border-t"
                          style={{ backgroundColor: 'color-mix(in srgb, var(--color-motif-cream) 90%, transparent)', borderColor: 'color-mix(in srgb, var(--color-motif-deep) 25%, transparent)' }}
                        >
                          {item.answer.includes("[RSVP_LINK]") ? (
                            <p className={`${cormorant.className} font-medium leading-relaxed sm:leading-loose text-xs sm:text-sm md:text-base lg:text-lg whitespace-pre-line tracking-wide`} style={{ color: palette.deep }}>
                              {item.answer.split("[RSVP_LINK]")[0]}
                              <a
                                href="#guest-list"
                                className="underline font-bold transition-colors hover:opacity-80"
                                style={{ color: palette.softBrown }}
                                onClick={(e) => {
                                  e.preventDefault()
                                  document.getElementById("guest-list")?.scrollIntoView({ behavior: "smooth" })
                                }}
                              >
                                {item.answer.match(/\[RSVP_LINK\](.*?)\[\/RSVP_LINK\]/)?.[1]}
                              </a>
                              {item.answer.split("[/RSVP_LINK]")[1]}
                            </p>
                          ) : (
                            <p className={`${cormorant.className} font-medium leading-relaxed sm:leading-loose text-xs sm:text-sm md:text-base lg:text-lg whitespace-pre-line tracking-wide`} style={{ color: palette.deep }}>
                              {item.answer}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
      </Section>
    </div>
  )
}
