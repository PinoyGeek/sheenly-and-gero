import type { MetadataRoute } from "next"

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://sheenly-and-gero.weddinginvitationrsvp.com"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Explicitly allow all social/link-preview bots.
      // These Allow: / entries override Cloudflare's managed Disallow: / blocks
      // for the same user-agents (RFC 9309 — Allow wins on equal path specificity).
      {
        userAgent: "facebookexternalhit", // Facebook, WhatsApp, Instagram previews
        allow: "/",
      },
      {
        userAgent: "meta-externalagent",  // Meta AI + newer WhatsApp preview agent
        allow: "/",
      },
      {
        userAgent: "Twitterbot",
        allow: "/",
      },
      {
        userAgent: "LinkedInBot",
        allow: "/",
      },
      {
        userAgent: "WhatsApp",
        allow: "/",
      },
      {
        userAgent: "Slackbot",
        allow: "/",
      },
      {
        userAgent: "TelegramBot",
        allow: "/",
      },
      {
        userAgent: "Discordbot",
        allow: "/",
      },
      // General crawlers
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
