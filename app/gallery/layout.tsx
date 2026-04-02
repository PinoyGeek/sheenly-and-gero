"use client"

import Link from "next/link"
import { useEffect } from "react"

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Hide the global navbar while on /gallery
    const navbar = document.querySelector("nav") as HTMLElement | null
    if (navbar) navbar.style.display = "none"
    return () => {
      if (navbar) navbar.style.display = ""
    }
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Simple top bar with only Back link, themed to match Details/Gallery */}
      <div
        className="sticky top-0 z-50 backdrop-blur-md bg-white/95 border-b shadow-sm"
        style={{ borderColor: "color-mix(in srgb, var(--color-motif-deep) 30%, transparent)" }}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-12 sm:h-14 flex items-center justify-between">
          <Link
            href="/#gallery"
            className="inline-flex items-center gap-1.5 sm:gap-2 font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border-2 transition-all duration-200 font-sans text-sm sm:text-base"
            style={{
              backgroundColor: "var(--color-motif-deep)",
              borderColor: "var(--color-motif-deep)",
              color: "#FFFFFF",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "color-mix(in srgb, var(--color-motif-deep) 75%, #000000)"
              e.currentTarget.style.borderColor = "color-mix(in srgb, var(--color-motif-deep) 75%, #000000)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "var(--color-motif-deep)"
              e.currentTarget.style.borderColor = "var(--color-motif-deep)"
            }}
          >
            <span className="text-base sm:text-lg">←</span>
            <span className="hidden xs:inline">Back to main page</span>
            <span className="xs:hidden">Back</span>
          </Link>
          <div className="text-xs sm:text-sm font-sans font-medium" style={{ color: "var(--color-motif-deep)" }}>
            Gallery
          </div>
        </div>
      </div>
      {children}
    </div>
  )
}