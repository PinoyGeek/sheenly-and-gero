import fs from "fs/promises"
import path from "path"
import sharp from "sharp"
import MasonryGallery from "@/components/masonry-gallery"
import { siteConfig } from "@/content/site"
import { CloudinaryImage } from "@/components/ui/cloudinary-image"
import { Cinzel, Cormorant_Garamond } from "next/font/google"

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: "400",
})

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
})

// Generate on each request so newly added images in public/ appear without a rebuild
export const dynamic = "force-dynamic"

async function getAlbumImages() {
  const dir = "Album"
  const abs = path.join(process.cwd(), "public", dir)
  try {
    const entries = await fs.readdir(abs, { withFileTypes: true })
    const srcs = entries
      .filter((e) => e.isFile())
      .map((e) => ({ name: e.name, src: `/${dir}/${e.name}` }))
      .filter(({ src }) => src.match(/\.(jpe?g|png|webp|gif)$/i))
      .sort((a, b) => {
        // Sort by the number inside parentheses, e.g. "couple (3).jpg"
        const numA = parseInt(a.src.match(/\((\d+)\)/)?.[1] || "0", 10)
        const numB = parseInt(b.src.match(/\((\d+)\)/)?.[1] || "0", 10)
        return numA - numB
      })

    return await Promise.all(
      srcs.map(async ({ name, src }) => {
        try {
          const { width = 800, height = 600 } = await sharp(path.join(abs, name)).metadata()
          const orientation: "portrait" | "landscape" = height > width ? "portrait" : "landscape"
          // Drive the masonry card aspect-ratio via category
          const category = orientation === "portrait" ? ("mobile" as const) : ("desktop" as const)
          return { src, width, height, orientation, category }
        } catch {
          return { src, width: 800, height: 600, orientation: "landscape" as const, category: "desktop" as const }
        }
      }),
    )
  } catch {
    return []
  }
}

export default async function GalleryPage() {
  const images = await getAlbumImages()

  return (
    <main className="min-h-screen relative overflow-hidden bg-white">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-white" />
      
      {/* Flower decoration - top left corner */}
      <div className="absolute left-0 top-0 z-0 pointer-events-none">
        <CloudinaryImage
          src="/decoration/flower-decoration-left-bottom-corner2.png"
          alt=""
          width={300}
          height={300}
          className="w-auto h-auto max-w-[140px] sm:max-w-[180px] md:max-w-[220px] lg:max-w-[260px] opacity-25 scale-y-[-1]"
          priority={false}
          style={{ filter: "var(--color-motif-deco-filter)" }}
        />
      </div>
      
      {/* Flower decoration - top right corner */}
      <div className="absolute right-0 top-0 z-0 pointer-events-none">
        <CloudinaryImage
          src="/decoration/flower-decoration-left-bottom-corner2.png"
          alt=""
          width={300}
          height={300}
          className="w-auto h-auto max-w-[140px] sm:max-w-[180px] md:max-w-[220px] lg:max-w-[260px] opacity-25 scale-x-[-1] scale-y-[-1]"
          priority={false}
          style={{ filter: "var(--color-motif-deco-filter)" }}
        />
      </div>
      
      {/* Flower decoration - left bottom corner */}
      <div className="absolute left-0 bottom-0 z-0 pointer-events-none">
        <CloudinaryImage
          src="/decoration/flower-decoration-left-bottom-corner2.png"
          alt=""
          width={300}
          height={300}
          className="w-auto h-auto max-w-[140px] sm:max-w-[180px] md:max-w-[220px] lg:max-w-[260px] opacity-25"
          priority={false}
          style={{ filter: "var(--color-motif-deco-filter)" }}
        />
      </div>
      
      {/* Flower decoration - right bottom corner */}
      <div className="absolute right-0 bottom-0 z-0 pointer-events-none">
        <CloudinaryImage
          src="/decoration/flower-decoration-left-bottom-corner2.png"
          alt=""
          width={300}
          height={300}
          className="w-auto h-auto max-w-[140px] sm:max-w-[180px] md:max-w-[220px] lg:max-w-[260px] opacity-25 scale-x-[-1]"
          priority={false}
          style={{ filter: "var(--color-motif-deco-filter)" }}
        />
      </div>

      <section className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-16">
        <div className="text-center mb-6 sm:mb-8 md:mb-10 px-3 sm:px-4">
          {/* Decorative element above title - match Details/Gallery */}
          <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
            <div
              className="w-8 sm:w-12 md:w-16 h-px"
              style={{ background: "linear-gradient(to right, transparent, color-mix(in srgb, var(--color-motif-deep) 25%, transparent), transparent)" }}
            />
            <div className="w-1.5 h-1.5 rounded-full opacity-80" style={{ backgroundColor: "var(--color-motif-deep)" }} />
            <div className="w-1.5 h-1.5 rounded-full opacity-50" style={{ backgroundColor: "var(--color-motif-deep)" }} />
            <div className="w-1.5 h-1.5 rounded-full opacity-80" style={{ backgroundColor: "var(--color-motif-deep)" }} />
            <div
              className="w-8 sm:w-12 md:w-16 h-px"
              style={{ background: "linear-gradient(to right, transparent, color-mix(in srgb, var(--color-motif-deep) 25%, transparent), transparent)" }}
            />
          </div>

          <h1
            className={`${cinzel.className} text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-normal mb-2 sm:mb-3 md:mb-4`}
            style={{ color: "var(--color-motif-deep)" }}
          >
            Our Love Story Gallery
          </h1>
          <p
            className={`${cormorant.className} text-xs sm:text-sm md:text-base lg:text-lg font-light max-w-xl mx-auto leading-relaxed px-2`}
            style={{ color: "var(--color-motif-deep)" }}
          >
            Every photograph tells a story of {siteConfig.couple.groomNickname} & {siteConfig.couple.brideNickname}'s journey to
            forever
          </p>

          {/* Decorative element below subtitle */}
          <div className="flex items-center justify-center gap-2 mt-3 sm:mt-4">
            <div className="w-1.5 h-1.5 rounded-full opacity-80" style={{ backgroundColor: "var(--color-motif-deep)" }} />
            <div className="w-1.5 h-1.5 rounded-full opacity-50" style={{ backgroundColor: "var(--color-motif-deep)" }} />
            <div className="w-1.5 h-1.5 rounded-full opacity-80" style={{ backgroundColor: "var(--color-motif-deep)" }} />
          </div>
        </div>

        {images.length === 0 ? (
          <div className={`${cormorant.className} text-center`} style={{ color: "var(--color-motif-medium)" }}>
            <p className="font-light">
              No images found. Add files to{" "}
              <code
                className="px-2 py-1 rounded border"
                style={{ backgroundColor: "var(--color-motif-cream)", borderColor: "var(--color-motif-silver)", color: "var(--color-motif-deep)" }}
              >
                public/Album
              </code>
              .
            </p>
          </div>
        ) : (
          <MasonryGallery images={images} />
        )}


      </section>
    </main>
  )
}