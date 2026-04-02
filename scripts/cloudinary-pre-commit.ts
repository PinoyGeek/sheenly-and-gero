/**
 * Pre-commit hook: destroys Cloudinary resources for files deleted from public/.
 *
 * Called automatically by .husky/pre-commit on every `git commit`.
 * Reads staged deletions from `git diff --cached`, maps them to Cloudinary
 * public IDs (using the same logic as lib/cloudinary.ts), and destroys them.
 *
 * Non-zero exit codes are intentionally avoided — a Cloudinary failure should
 * never block a commit. Errors are printed as warnings only.
 */

import { v2 as cloudinary } from "cloudinary"
import { execSync } from "child_process"
import path from "path"
import dotenv from "dotenv"

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") })

// ---------------------------------------------------------------------------
// Constants — must match lib/cloudinary.ts PROJECT_PREFIX
// ---------------------------------------------------------------------------

const PROJECT_PREFIX = "wedding-projects/sheenly-and-gero"

const IMAGE_EXTENSIONS = new Set([
  ".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif", ".svg",
  ".JPG", ".JPEG", ".PNG", ".WEBP",
])

const VIDEO_EXTENSIONS = new Set([
  ".mp4", ".mov", ".webm", ".avi", ".mkv", ".ogv",
  ".MP4", ".MOV", ".WEBM",
])

const MEDIA_EXTENSIONS = new Set([...IMAGE_EXTENSIONS, ...VIDEO_EXTENSIONS])

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isVideoFile(filePath: string): boolean {
  return VIDEO_EXTENSIONS.has(path.extname(filePath))
}

/**
 * Converts a repo-relative path (e.g. "public/Album/couple (1).jpg")
 * to a Cloudinary public_id (e.g. "wedding-projects/sheenly-and-gero/Album/couple (1)").
 *
 * Mirrors the toPublicId() function in lib/cloudinary.ts.
 */
function repoPathToPublicId(repoPath: string): string {
  // Strip leading "public/" prefix
  const withoutPublic = repoPath.replace(/^public\//, "")
  // Strip file extension
  const withoutExt = withoutPublic.replace(/\.[^/.]+$/, "")
  return `${PROJECT_PREFIX}/${withoutExt}`
}

/**
 * Returns the list of files staged for deletion (D) in the current commit.
 */
function getStagedDeletions(): string[] {
  try {
    const output = execSync("git diff --cached --name-only --diff-filter=D", {
      encoding: "utf-8",
    })
    return output
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
  } catch {
    return []
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  // Only proceed if credentials are available — skip silently otherwise
  const { NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
    process.env

  if (!NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    // No credentials configured — skip without error
    return
  }

  cloudinary.config({
    cloud_name: NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true,
  })

  const deletedFiles = getStagedDeletions()

  // Filter to media files under public/
  const deletedMedia = deletedFiles.filter(
    (f) => f.startsWith("public/") && MEDIA_EXTENSIONS.has(path.extname(f))
  )

  if (deletedMedia.length === 0) return

  console.log(`\n☁️  Pre-commit: cleaning up ${deletedMedia.length} deleted Cloudinary asset(s)…`)

  const results = await Promise.allSettled(
    deletedMedia.map(async (repoPath) => {
      const publicId = repoPathToPublicId(repoPath)
      const resourceType = isVideoFile(repoPath) ? "video" : "image"

      try {
        await cloudinary.uploader.destroy(publicId, { resource_type: resourceType })
        console.log(`  🗑  deleted — ${publicId}`)
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        // Warn but never fail the commit
        console.warn(`  ⚠️  could not delete ${publicId}: ${msg}`)
      }
    })
  )

  const failed = results.filter((r) => r.status === "rejected").length
  if (failed > 0) {
    console.warn(`  ⚠️  ${failed} deletion(s) failed — commit will still proceed.\n`)
  } else {
    console.log("  ✅  Done.\n")
  }
}

main()
