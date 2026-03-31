const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
const PROJECT_PREFIX = "wedding-projects/ramon-and-mary-rose"

/**
 * Converts a local public path to a Cloudinary public ID, scoped to this
 * project's folder so it never collides with other wedding projects.
 * "/mobile-background/couple (1).webp"
 *   → "wedding-projects/ramon-and-mary-rose/mobile-background/couple (1)"
 */
function toPublicId(src: string): string {
  // Already a full Cloudinary public ID (e.g. passed directly from upload output)
  if (src.startsWith(PROJECT_PREFIX)) return src

  const relative = src
    .replace(/^\//, "")       // strip leading slash
    .replace(/\.[^/.]+$/, "") // strip file extension

  return `${PROJECT_PREFIX}/${relative}`
}

/**
 * Percent-encodes each path segment of a Cloudinary public ID so that
 * filenames with spaces, parentheses, commas, etc. form valid URLs.
 * Folder separators (/) are preserved.
 */
function encodePublicIdPath(publicId: string): string {
  return publicId.split("/").map(encodeURIComponent).join("/")
}

/**
 * Custom Next.js Image loader for Cloudinary.
 * Used as `loader={cloudinaryLoader}` on <Image> components.
 * Automatically applies f_auto + q_auto + responsive width.
 */
export function cloudinaryLoader({
  src,
  width,
  quality,
}: {
  src: string
  width: number
  quality?: number
}): string {
  const publicId = encodePublicIdPath(toPublicId(src))
  const q = quality ?? "auto"
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_${q},w_${width}/${publicId}`
}

interface CloudinaryUrlOptions {
  width?: number
  height?: number
  quality?: string | number
  crop?: "fill" | "fit" | "scale" | "crop" | "pad"
  gravity?: string
}

interface CloudinaryVideoOptions {
  width?: number
  height?: number
  quality?: string | number
}

/**
 * Generates a Cloudinary optimized video URL.
 * Accepts local paths (e.g. "/background_music/video.mp4") or Cloudinary public IDs.
 * Falls back to the original src if NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set.
 *
 * Usage:
 *   src={getCloudinaryVideoUrl("/background_music/video.mp4")}
 */
export function getCloudinaryVideoUrl(
  src: string,
  options: CloudinaryVideoOptions = {}
): string {
  if (!CLOUD_NAME) return src
  if (src.startsWith("https://") || src.startsWith("http://")) return src

  const publicId = encodePublicIdPath(toPublicId(src))
  const { width, height, quality = "auto" } = options

  const transforms: string[] = [`q_${quality}`]
  if (width) transforms.push(`w_${width}`)
  if (height) transforms.push(`h_${height}`)

  return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/f_auto,${transforms.join(",")}/${publicId}`
}

/**
 * Generates a Cloudinary optimized URL.
 * Accepts local paths (e.g. "/mobile-background/couple (1).webp") or Cloudinary public IDs.
 * Falls back to the original src if NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set.
 *
 * Usage in plain <img> tags or CSS background-image:
 *   src={getCloudinaryUrl("/mobile-background/couple (1).webp", { width: 800 })}
 */
export function getCloudinaryUrl(
  src: string,
  options: CloudinaryUrlOptions = {}
): string {
  if (!CLOUD_NAME) return src
  if (src.startsWith("https://") || src.startsWith("http://")) return src

  const publicId = encodePublicIdPath(toPublicId(src))
  const { width, height, quality = "auto", crop, gravity } = options

  const transforms: string[] = ["f_auto", `q_${quality}`]
  if (width) transforms.push(`w_${width}`)
  if (height) transforms.push(`h_${height}`)
  if ((width || height) && crop) transforms.push(`c_${crop}`)
  if (gravity) transforms.push(`g_${gravity}`)

  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transforms.join(",")}/${publicId}`
}
