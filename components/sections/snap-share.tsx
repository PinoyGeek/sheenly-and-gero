"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"
import { Instagram, Facebook, Twitter, Share2, Copy, Download, Check } from "lucide-react"
import { Section } from "@/components/section"
import { QRCodeCanvas } from "qrcode.react"
import { siteConfig } from "@/content/site"
import { CloudinaryImage } from "@/components/ui/cloudinary-image"
import { Cormorant_Garamond, Cinzel } from "next/font/google"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400"],
})

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600"],
})

// QRCodeCanvas renders to <canvas> which cannot resolve CSS variables.
// This hex must match --color-motif-deep defined in globals.css.
const MOTIF_DEEP_HEX = "#015B97"

export function SnapShare() {
  const [copiedHashtagIndex, setCopiedHashtagIndex] = useState<number | null>(null)
  const [copiedAllHashtags, setCopiedAllHashtags] = useState(false)
  const [copiedDriveLink, setCopiedDriveLink] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const websiteUrl = typeof window !== "undefined" ? window.location.href : "https://example.com"
  // https://drive.google.com/drive/folders/1_40IPBZ0bF26uPV7ngLgjyPnUoN4V07Y?usp=sharing
  const driveLink = siteConfig.snapShare.googleDriveLink
  // const hashtags = [siteConfig.snapShare.hashtag] (multiple hashtags)
  const hashtags = siteConfig.snapShare.hashtag
  const allHashtagsText = hashtags.join(" ")
  const groomNickname = siteConfig.couple.groomNickname
  const brideNickname = siteConfig.couple.brideNickname
  const sanitizedGroomName = groomNickname.replace(/\s+/g, "")
  const sanitizedBrideName = brideNickname.replace(/\s+/g, "")

  const shareText = `Celebrate ${brideNickname} & ${groomNickname}'s wedding! Explore the details and share your special memories: ${websiteUrl} ${allHashtagsText} ✨`

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640)

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])


  const shareOnSocial = (platform: "instagram" | "facebook" | "twitter" | "tiktok") => {
    const encodedUrl = encodeURIComponent(websiteUrl)
    const encodedText = encodeURIComponent(shareText)

    const urls: Record<string, string> = {
      instagram: `https://www.instagram.com/`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}`,
      tiktok: `https://www.tiktok.com/`,
    }

    const target = urls[platform]
    if (target) {
      window.open(target, "_blank", "width=600,height=400")
    }
  }

  const downloadQRCode = () => {
    const canvas = document.getElementById("snapshare-qr") as HTMLCanvasElement | null
    if (!canvas) return
    const link = document.createElement("a")
    link.download = `${sanitizedGroomName.toLowerCase()}-${sanitizedBrideName.toLowerCase()}-wedding-qr.png`
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  const downloadDriveQRCode = () => {
    const canvas = document.getElementById("drive-qr") as HTMLCanvasElement | null
    if (!canvas) return
    const link = document.createElement("a")
    link.download = "drive-qr.png"
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  const copyHashtag = async (hashtag: string, index: number) => {
    try {
      await navigator.clipboard.writeText(hashtag)
      setCopiedHashtagIndex(index)
      setTimeout(() => setCopiedHashtagIndex(null), 2000)
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  const copyAllHashtags = async () => {
    try {
      await navigator.clipboard.writeText(allHashtagsText)
      setCopiedAllHashtags(true)
      setTimeout(() => setCopiedAllHashtags(false), 2000)
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  const copyDriveLink = async () => {
    if (driveLink) {
      try {
        await navigator.clipboard.writeText(driveLink)
        setCopiedDriveLink(true)
        setTimeout(() => setCopiedDriveLink(false), 2000)
      } catch (err) {
        console.error("Failed to copy: ", err)
      }
    }
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8 },
  }

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  return (
    <Section
      id="snap-share"
      className="relative overflow-hidden"
      style={{ paddingBottom: 0 }}
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
        {/* <CloudinaryImage
          src="/decoration/corner-left-bottom.png"
          alt=""
          width={300}
          height={300}
          className="absolute bottom-0 left-0 w-auto h-auto max-w-[120px] sm:max-w-[160px] md:max-w-[200px]"
          priority={false}
        /> */}
        {/* <CloudinaryImage
          src="/decoration/corner-left-bottom.png"
          alt=""
          width={300}
          height={300}
          className="absolute bottom-0 right-0 w-auto h-auto max-w-[120px] sm:max-w-[160px] md:max-w-[200px]"
          style={{ transform: "scaleX(-1)" }}
          priority={false}
        /> */}
      </div>

      {/* Background — align with gallery/details */}
      {/* <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-[0.24]"
          style={{
            background: "linear-gradient(145deg, var(--color-motif-cream) 0%, var(--color-motif-deep) 24%, var(--color-motif-medium) 70%, var(--color-motif-deep) 100%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.16]"
          style={{
            background: "radial-gradient(circle at 50% 10%, var(--color-motif-deep) 0%, transparent 55%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, var(--color-motif-cream) 0, var(--color-motif-cream) 26px, var(--color-motif-medium) 27px, var(--color-motif-medium) 28px)",
          }}
        />
      </div> */}
      
      {/* Flower decoration - top left corner */}
      {/* <div className="absolute left-0 top-0 z-0 pointer-events-none">
        <Image
          src="/decoration/flower-decoration-left-bottom-corner2.png"
          alt="Flower decoration"
          width={300}
          height={300}
          className="w-auto h-auto max-w-[160px] sm:max-w-[200px] md:max-w-[240px] lg:max-w-[280px] opacity-65 scale-y-[-1]"
          priority={false}
          style={{ filter: "brightness(0) invert(1)" }}
        />
      </div> */}
      
      {/* Flower decoration - top right corner */}
      {/* <div className="absolute right-0 top-0 z-0 pointer-events-none">
        <Image
          src="/decoration/flower-decoration-left-bottom-corner2.png"
          alt="Flower decoration"
          width={300}
          height={300}
          className="w-auto h-auto max-w-[160px] sm:max-w-[200px] md:max-w-[240px] lg:max-w-[280px] opacity-65 scale-x-[-1] scale-y-[-1]"
          priority={false}
          style={{ filter: "brightness(0) invert(1)" }}
        />
      </div> */}
      
      {/* Flower decoration - left bottom corner */}
      {/* <div className="absolute left-0 bottom-0 z-0 pointer-events-none">
        <Image
          src="/decoration/flower-decoration-left-bottom-corner2.png"
          alt="Flower decoration"
          width={300}
          height={300}
          className="w-auto h-auto max-w-[160px] sm:max-w-[200px] md:max-w-[240px] lg:max-w-[280px] opacity-65"
          priority={false}
          style={{ filter: "brightness(0) invert(1)" }}
        />
      </div> */}
      
      {/* Flower decoration - right bottom corner */}
      {/* <div className="absolute right-0 bottom-0 z-0 pointer-events-none">
        <Image
          src="/decoration/flower-decoration-left-bottom-corner2.png"
          alt="Flower decoration"
          width={300}
          height={300}
          className="w-auto h-auto max-w-[160px] sm:max-w-[200px] md:max-w-[240px] lg:max-w-[280px] opacity-65 scale-x-[-1]"
          priority={false}
          style={{ filter: "brightness(0) invert(1)" }}
        />
      </div> */}

      <div className="relative max-w-6xl mx-auto px-3 sm:px-6 md:px-8">
        <motion.div
          className="text-center mb-5 sm:mb-10"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div
            className={`${cormorant.className} inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] sm:text-xs uppercase`}
            style={{ letterSpacing: "0.3em", borderColor: "var(--color-motif-accent)", backgroundColor: "var(--color-motif-accent)", color: "var(--color-motif-cream)" }}
          >
            Share your memories
          </div>
          <h2
            className="lighten-regular text-[40px] sm:text-[50px] md:text-[60px] lg:text-[70px] xl:text-[80px] leading-tight text-motif-cream mt-2 sm:mt-4"
            style={{ color: 'var(--color-motif-cream)' }}
 
          >
            Capture & Share the Celebration
          </h2>
          <p
  className="text-xs sm:text-sm md:text-base text-motif-cream max-w-2xl mx-auto mt-2 sm:mt-4 leading-relaxed px-2"
  style={{ color: 'var(--color-motif-cream)' }}
>
  Because you have been part of our journey through our friendship and love, we, <b>{brideNickname} & {groomNickname}</b>, joyfully invite you to witness one of the most meaningful moments of our lives.
  <br />
  Join us as we exchange our wedding vows on <b>{siteConfig.ceremony.day}, {siteConfig.wedding.date}, at {siteConfig.ceremony.location}</b> at {siteConfig.ceremony.time}, as we promise our hearts to one another and begin our forever.
  <br />
  Your presence will mean so much to us as we celebrate <b>Love, Commitment, and a Lifetime of Togetherness</b>.
</p>
          <div className="mx-auto mt-3 sm:mt-5 h-px w-20 sm:w-24" style={{ backgroundColor: "var(--color-motif-accent)" }} />
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6 lg:gap-10"
          variants={staggerChildren}
          initial="initial"
          animate="animate"
        >
          {/* Mobile order preserved: Website -> Hashtags -> Social -> Drive */}
          <motion.div className="lg:col-start-1 lg:row-start-1" variants={fadeInUp}>
            <div className="bg-motif-cream/95 rounded-xl sm:rounded-[22px] p-3 sm:p-5 md:p-8 shadow-[0_18px_45px_rgba(0,0,0,0.25)] text-center flex flex-col border border-motif-deep">
              <h4
                className="lighten-regular text-[32px] sm:text-[40px] md:text-[48px] lg:text-[56px] xl:text-[64px] leading-tight text-motif-deep mb-2 sm:mb-3"
                style={{ color: 'var(--color-motif-deep)' }}
              >
                Share Our Wedding Website
              </h4>
              <p
                className={`${cormorant.className} text-motif-deep text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed px-1`}
              >
                Spread the word about {brideNickname} & {groomNickname}&apos;s wedding celebration. Share this QR code with friends and family so they can join the celebration.
              </p>

              <div className="mx-auto inline-flex flex-col items-center bg-white/90 backdrop-blur-sm p-2.5 sm:p-5 md:p-7 rounded-xl sm:rounded-2xl shadow-md border border-motif-cream/80 mb-3 sm:mb-4">
                <div className="mb-2 sm:mb-3 p-1.5 sm:p-3 rounded-lg sm:rounded-xl bg-motif-cream border border-motif-cream/80">
                  <div className="bg-white p-1.5 sm:p-3 rounded-lg shadow-sm border border-motif-cream/80">
                    <QRCodeCanvas
                      id="snapshare-qr"
                      value={websiteUrl}
                      size={isMobile ? 140 : 220}
                      includeMargin
                      className="bg-white"
                      fgColor={MOTIF_DEEP_HEX}
                    />
                  </div>
                </div>
                <button
                  onClick={downloadQRCode}
                  className="flex items-center gap-1.5 sm:gap-2 mx-auto px-3 sm:px-4 py-2 sm:py-2.5 rounded-full bg-motif-deep text-motif-cream border border-motif-deep/80 shadow-[0_10px_28px_rgba(0,0,0,0.2)] hover:shadow-[0_16px_38px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 transition-all duration-200 text-xs sm:text-sm font-semibold"
                >
                  <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span
                    className={`${cormorant.className} uppercase font-semibold`}
                    style={{ letterSpacing: "0.15em" }}
                  >
                    Download QR
                  </span>
                </button>
              </div>

              <p
                className={`${cormorant.className} text-motif-deep text-xs sm:text-sm leading-relaxed`}
              >
                Scan with any camera app to open the full invitation and schedule.
              </p>
            </div>
          </motion.div>

          <motion.div className="lg:col-start-2 lg:row-start-1" variants={fadeInUp}>
            <div className="bg-motif-cream/95 rounded-xl p-3 sm:p-4 shadow-[0_8px_24px_rgba(0,0,0,0.15)] border border-motif-deep/40 text-center">
              <div className="flex items-center gap-2 mb-2.5 sm:mb-3 text-center">
                <h5
                  className="lighten-regular text-[24px] sm:text-[30px] md:text-[35px] lg:text-[40px] xl:text-[45px] leading-tight text-motif-deep text-center mx-auto"
                  style={{ color: 'var(--color-motif-deep)' }}
                >
                  Wedding Hashtags
                </h5>
              </div>

              <div className="space-y-1.5 mb-2.5 sm:mb-3">
                {hashtags.map((hashtag, index) => (
                  <motion.button
                    key={index}
                    onClick={() => copyHashtag(hashtag, index)}
                    className={`w-full flex items-center justify-between gap-2 px-3 py-2 sm:py-2.5 rounded-lg border transition-all duration-200 active:scale-[0.98] ${
                      copiedHashtagIndex === index
                        ? "bg-motif-accent/10 border-motif-accent"
                        : "bg-white/70 border-motif-deep/25 hover:border-motif-deep/60 hover:bg-white/90"
                    }`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 }}
                  >
                    <span
                      className={`${cormorant.className} font-semibold text-sm sm:text-base text-left truncate flex-1 ${
                        copiedHashtagIndex === index ? "text-motif-accent" : "text-motif-deep"
                      }`}
                    >
                      {hashtag}
                    </span>
                    <span
                      className={`flex items-center gap-1 flex-shrink-0 text-[10px] sm:text-xs font-semibold uppercase tracking-wider ${
                        copiedHashtagIndex === index ? "text-motif-accent" : "text-motif-medium"
                      }`}
                    >
                      {copiedHashtagIndex === index ? (
                        <>
                          <Check className="w-3 h-3" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> Copy
                        </>
                      )}
                    </span>
                  </motion.button>
                ))}
              </div>

              <button
                onClick={copyAllHashtags}
                className={`w-full flex items-center justify-center gap-1.5 py-2 sm:py-2.5 rounded-lg border transition-all duration-200 active:scale-[0.98] ${
                  copiedAllHashtags
                    ? "bg-motif-accent/10 border-motif-accent text-motif-accent"
                    : "bg-motif-deep/5 border-motif-deep/30 text-motif-deep hover:bg-motif-deep hover:text-motif-cream hover:border-motif-deep"
                }`}
              >
                {copiedAllHashtags ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span
                  className={`${cormorant.className} text-xs sm:text-sm font-semibold uppercase`}
                  style={{ letterSpacing: "0.12em" }}
                >
                  {copiedAllHashtags ? "All Copied!" : "Copy All"}
                </span>
              </button>
            </div>
          </motion.div>

          <motion.div className="lg:col-start-2 lg:row-start-2" variants={fadeInUp}>
            <div className="bg-motif-cream/95 rounded-lg sm:rounded-[20px] p-3 sm:p-5 md:p-7 shadow-[0_18px_45px_rgba(0,0,0,0.25)] border border-motif-deep">
              <h5
                className="lighten-regular text-[32px] sm:text-[40px] md:text-[48px] lg:text-[56px] xl:text-[64px] leading-tight text-motif-deep mb-2 sm:mb-3 text-center"
                style={{ color: 'var(--color-motif-deep)' }}
              >
                Share on Social Media
              </h5>
              <p
                className={`${cormorant.className} text-motif-deep text-xs sm:text-sm text-center mb-3 sm:mb-4 leading-relaxed`}
              >
                Help spread the word about {brideNickname} & {groomNickname}&apos;s wedding celebration. Share the event across your favorite platforms.
              </p>
              <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                <button
                  onClick={() => shareOnSocial("instagram")}
                  className="group flex items-center justify-center gap-1.5 sm:gap-2 bg-white border border-motif-deep/80 text-motif-deep px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg hover:bg-motif-deep/10 transition-all duration-200 shadow-md hover:shadow-lg hover:border-motif-deep"
                >
                  <Instagram className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform flex-shrink-0" />
                  <span
                    className={`${cormorant.className} font-semibold text-xs sm:text-sm uppercase text-motif-deep`}
                    style={{ letterSpacing: "0.18em" }}
                  >
                    Instagram
                  </span>
                </button>
                <button
                  onClick={() => shareOnSocial("facebook")}
                  className="group flex items-center justify-center gap-1.5 sm:gap-2 bg-white border border-motif-deep/80 text-motif-deep px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg hover:bg-motif-deep/10 transition-all duration-200 shadow-md hover:shadow-lg hover:border-motif-deep"
                >
                  <Facebook className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform flex-shrink-0" />
                  <span
                    className={`${cormorant.className} font-semibold text-xs sm:text-sm uppercase text-motif-deep`}
                    style={{ letterSpacing: "0.18em" }}
                  >
                    Facebook
                  </span>
                </button>
                <button
                  onClick={() => shareOnSocial("tiktok")}
                  className="group flex items-center justify-center gap-1.5 sm:gap-2 bg-white border border-motif-deep/80 text-motif-deep px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg hover:bg-motif-deep/10 transition-all duration-200 shadow-md hover:shadow-lg hover:border-motif-deep"
                >
                  <Share2 className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform flex-shrink-0" />
                  <span
                    className={`${cormorant.className} font-semibold text-xs sm:text-sm uppercase text-motif-deep`}
                    style={{ letterSpacing: "0.18em" }}
                  >
                    TikTok
                  </span>
                </button>
                <button
                  onClick={() => shareOnSocial("twitter")}
                  className="group flex items-center justify-center gap-1.5 sm:gap-2 bg-white border border-motif-deep/80 text-motif-deep px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg hover:bg-motif-deep/10 transition-all duration-200 shadow-md hover:shadow-lg hover:border-motif-deep"
                >
                  <Twitter className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform flex-shrink-0" />
                  <span
                    className={`${cormorant.className} font-semibold text-xs sm:text-sm uppercase text-motif-deep`}
                    style={{ letterSpacing: "0.18em" }}
                  >
                    Twitter
                  </span>
                </button>
              </div>
            </div>
          </motion.div>

          {driveLink && (
            <motion.div className="lg:col-start-1 lg:row-start-2" variants={fadeInUp}>
              <div className="bg-motif-cream/95 rounded-xl sm:rounded-[22px] p-3 sm:p-5 md:p-7 shadow-[0_18px_45px_rgba(0,0,0,0.25)] text-center border border-motif-deep">
                <div
                  className={`${cormorant.className} inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-motif-deep/60 bg-motif-deep px-2.5 py-1 text-[10px] sm:text-xs uppercase text-motif-cream mb-2 sm:mb-3`}
                  style={{ letterSpacing: "0.28em" }}
                >
                  Upload Your Photos & Videos
                </div>
                <p
                  className={`${cormorant.className} text-motif-deep text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 px-1`}
                >
                  Help us capture our special day! Scan the QR or use the actions below to drop your clips into our shared Drive.
                </p>
                <div className="mx-auto inline-flex flex-col items-center bg-white/90 backdrop-blur-sm p-2.5 sm:p-5 rounded-xl sm:rounded-2xl shadow-md border border-motif-cream/80 mb-3 sm:mb-4">
                  <div className="mb-2 sm:mb-3 p-1.5 sm:p-3 rounded-lg sm:rounded-xl bg-motif-cream border border-motif-cream/80">
                    <div className="bg-white p-1.5 sm:p-3 rounded-lg shadow-sm border border-motif-cream/80">
                      <QRCodeCanvas
                        id="drive-qr"
                        value={driveLink}
                        size={isMobile ? 130 : 200}
                        includeMargin
                        className="bg-white"
                        fgColor={MOTIF_DEEP_HEX}
                      />
                    </div>
                  </div>
                  <p className={`${cormorant.className} text-motif-medium text-xs sm:text-sm`}>
                    Scan with your camera app
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3">
                  <button
                    onClick={copyDriveLink}
                    className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full bg-motif-deep text-motif-cream border border-motif-deep/80 shadow-sm hover:shadow-md text-xs sm:text-sm transition-all ${
                      copiedDriveLink ? "bg-motif-deep border-motif-deep text-white" : ""
                    }`}
                  >
                    {copiedDriveLink ? (
                      <>
                        <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span
                          className={`${cormorant.className} uppercase font-semibold`}
                          style={{ letterSpacing: "0.18em" }}
                        >
                          Copied!
                        </span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span
                          className={`${cormorant.className} uppercase font-semibold`}
                          style={{ letterSpacing: "0.18em" }}
                        >
                          Copy Link
                        </span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={downloadDriveQRCode}
                    className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full bg-motif-deep text-motif-cream border border-motif-deep/80 shadow-sm hover:shadow-md text-xs sm:text-sm transition-all font-semibold"
                  >
                    <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span
                      className={`${cormorant.className} uppercase font-semibold text-motif-cream`}
                      style={{ letterSpacing: "0.18em" }}
                    >
                      Download QR
                    </span>
                  </button>
                  <a
                    href={driveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-white border border-motif-deep/80 text-motif-deep shadow-sm hover:shadow-md hover:bg-motif-deep/10 text-xs sm:text-sm transition-all"
                  >
                    <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span
                      className={`${cormorant.className} tracking-[0.15em] sm:tracking-[0.18em] uppercase font-semibold text-motif-deep`}
                    >
                      Open Drive
                    </span>
                  </a>
                </div>
                <p
                  className={`${cormorant.className} text-motif-deep text-xs sm:text-sm mt-2 sm:mt-3 leading-relaxed`}
                >
                  or tap &quot;Open Google Drive Folder.&quot;
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>

        <motion.div className="text-center mt-5 sm:mt-10" variants={fadeInUp}>
          <div className="bg-motif-cream/95 rounded-xl sm:rounded-[22px] p-4 sm:p-6 md:p-7 shadow-[0_25px_80px_rgba(0,0,0,0.25)] border border-motif-cream/80 max-w-3xl mx-auto backdrop-blur-xl">
            <p
              className={`${cormorant.className} text-motif-deep text-sm sm:text-base md:text-lg leading-relaxed mb-3 sm:mb-4 px-2`}
            >
              Thank you for helping make {brideNickname} & {groomNickname}&apos;s wedding celebration memorable. Your photos and messages create beautiful memories
              that we will treasure for a lifetime.
            </p>
            <div
                className={`${cormorant.className} flex items-center justify-center gap-2 text-motif-deep text-xs sm:text-sm uppercase text-motif-deep`}
              style={{ letterSpacing: "0.25em" }}
            >
              <span>Thank you for sharing the joy</span>
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  )
}