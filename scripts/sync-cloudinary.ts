/**
 * Cloudinary bidirectional sync script.
 *
 * Compares local public/ folder with Cloudinary resources under the project prefix.
 *   - Uploads local files not found in Cloudinary
 *   - Deletes Cloudinary resources not found locally
 *
 * Usage:
 *   pnpm sync:cloudinary
 *   pnpm sync:cloudinary --dry-run
 *   pnpm sync:cloudinary --no-delete   (skip deleting from Cloudinary)
 *   pnpm sync:cloudinary --no-upload   (skip uploading to Cloudinary)
 *
 * Environment variables (in .env.local):
 *   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
 *   CLOUDINARY_API_KEY
 *   CLOUDINARY_API_SECRET
 */

import { v2 as cloudinary } from "cloudinary"
import fs from "fs"
import path from "path"
import dotenv from "dotenv"

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") })

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

// ---------------------------------------------------------------------------
// Constants — mirrors lib/cloudinary.ts PROJECT_PREFIX
// ---------------------------------------------------------------------------

const PROJECT_PREFIX = "wedding-projects/sheenly-and-gero"
const SOURCE_DIR = path.resolve(process.cwd(), "public")

const IMAGE_EXTENSIONS = new Set([
  ".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif", ".svg",
  ".JPG", ".JPEG", ".PNG", ".WEBP",
])

const VIDEO_EXTENSIONS = new Set([
  ".mp4", ".mov", ".webm", ".avi", ".mkv", ".ogv",
  ".MP4", ".MOV", ".WEBM",
])

/** Folders inside /public that are never synced to Cloudinary */
const SKIP_FOLDERS = new Set(["favicon_io"])

const BATCH_SIZE = 5

// ---------------------------------------------------------------------------
// CLI args
// ---------------------------------------------------------------------------

interface SyncOptions {
  dryRun: boolean
  noDelete: boolean
  noUpload: boolean
}

function parseArgs(argv: string[]): SyncOptions {
  const args = argv.slice(2)
  return {
    dryRun: args.includes("--dry-run"),
    noDelete: args.includes("--no-delete"),
    noUpload: args.includes("--no-upload"),
  }
}

// ---------------------------------------------------------------------------
// Local file helpers
// ---------------------------------------------------------------------------

function collectMediaFiles(dir: string): string[] {
  const results: string[] = []

  function walk(current: string): void {
    const entries = fs.readdirSync(current, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name)
      if (entry.isDirectory()) {
        if (!SKIP_FOLDERS.has(entry.name)) walk(fullPath)
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name)
        if (IMAGE_EXTENSIONS.has(ext) || VIDEO_EXTENSIONS.has(ext)) {
          results.push(fullPath)
        }
      }
    }
  }

  walk(dir)
  return results
}

function isVideoFile(filePath: string): boolean {
  return VIDEO_EXTENSIONS.has(path.extname(filePath))
}

/** Converts a local absolute path to its Cloudinary public_id (no extension). */
function localPathToPublicId(filePath: string): string {
  const rel = path.relative(SOURCE_DIR, filePath)
  const withoutExt = rel.replace(/\.[^/.]+$/, "")
  const forwardSlash = withoutExt.split(path.sep).join("/")
  return `${PROJECT_PREFIX}/${forwardSlash}`
}

// ---------------------------------------------------------------------------
// Cloudinary listing
// ---------------------------------------------------------------------------

interface CloudinaryResource {
  public_id: string
  resource_type: "image" | "video"
  secure_url: string
}

async function listCloudinaryResources(
  resourceType: "image" | "video"
): Promise<CloudinaryResource[]> {
  const results: CloudinaryResource[] = []
  let nextCursor: string | undefined

  do {
    const response = await cloudinary.api.resources({
      type: "upload",
      prefix: PROJECT_PREFIX,
      resource_type: resourceType,
      max_results: 500,
      ...(nextCursor ? { next_cursor: nextCursor } : {}),
    })

    for (const r of response.resources) {
      results.push({
        public_id: r.public_id,
        resource_type: resourceType,
        secure_url: r.secure_url,
      })
    }

    nextCursor = response.next_cursor
  } while (nextCursor)

  return results
}

async function listAllCloudinaryResources(): Promise<CloudinaryResource[]> {
  const [images, videos] = await Promise.all([
    listCloudinaryResources("image"),
    listCloudinaryResources("video"),
  ])
  return [...images, ...videos]
}

// ---------------------------------------------------------------------------
// Delete
// ---------------------------------------------------------------------------

async function deleteFromCloudinary(
  resource: CloudinaryResource,
  dryRun: boolean
): Promise<void> {
  if (dryRun) {
    console.log(`  🗑  (dry) delete — ${resource.public_id}`)
    return
  }

  try {
    await cloudinary.uploader.destroy(resource.public_id, {
      resource_type: resource.resource_type,
    })
    console.log(`  🗑  deleted       — ${resource.public_id}`)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error(`  ✗  delete failed — ${resource.public_id}: ${msg}`)
  }
}

// ---------------------------------------------------------------------------
// Upload
// ---------------------------------------------------------------------------

async function uploadFile(
  filePath: string,
  publicId: string,
  dryRun: boolean
): Promise<void> {
  if (dryRun) {
    console.log(`  ↑  (dry) upload  — ${publicId}`)
    return
  }

  try {
    const resourceType = isVideoFile(filePath) ? "video" : "image"
    const result = await cloudinary.uploader.upload(filePath, {
      public_id: publicId,
      resource_type: resourceType,
      overwrite: false,
      use_filename: false,
      unique_filename: false,
    })
    console.log(`  ↑  uploaded       — ${result.secure_url}`)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error(`  ✗  upload failed — ${publicId}: ${msg}`)
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const opts = parseArgs(process.argv)

  const { NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
    process.env

  if (!NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    console.error(
      "❌  Missing Cloudinary credentials.\n" +
        "    Ensure NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and\n" +
        "    CLOUDINARY_API_SECRET are set in .env.local"
    )
    process.exit(1)
  }

  console.log(`\n☁️  Cloudinary Sync — ${PROJECT_PREFIX}`)
  console.log(`   Source : ${SOURCE_DIR}`)
  if (opts.dryRun) console.log("   Mode   : DRY RUN (no changes will be made)")
  console.log("")

  // 1. Collect local files and their expected public IDs
  const localFiles = collectMediaFiles(SOURCE_DIR)
  const localById = new Map<string, string>() // publicId → filePath
  for (const filePath of localFiles) {
    localById.set(localPathToPublicId(filePath), filePath)
  }

  // 2. Fetch all Cloudinary resources for this project
  console.log("  Fetching Cloudinary resources…")
  const cloudinaryResources = await listAllCloudinaryResources()
  const cloudinaryById = new Map<string, CloudinaryResource>()
  for (const r of cloudinaryResources) {
    cloudinaryById.set(r.public_id, r)
  }

  console.log(`  Local files : ${localById.size}`)
  console.log(`  Cloudinary  : ${cloudinaryById.size}\n`)

  // 3. Compute diff
  const toUpload: string[] = []
  const toDelete: CloudinaryResource[] = []

  for (const [publicId] of localById) {
    if (!cloudinaryById.has(publicId)) toUpload.push(publicId)
  }
  for (const [publicId, resource] of cloudinaryById) {
    if (!localById.has(publicId)) toDelete.push(resource)
  }

  console.log(`  To upload : ${toUpload.length}`)
  console.log(`  To delete : ${toDelete.length}\n`)

  if (toUpload.length === 0 && toDelete.length === 0) {
    console.log("✅  Already in sync. Nothing to do.\n")
    return
  }

  // 4. Delete from Cloudinary (resources that no longer exist locally)
  if (!opts.noDelete && toDelete.length > 0) {
    console.log(`─── Deleting ${toDelete.length} remote resource(s) ───`)
    for (const resource of toDelete) {
      await deleteFromCloudinary(resource, opts.dryRun)
    }
    console.log("")
  }

  // 5. Upload local files missing from Cloudinary (in batches)
  if (!opts.noUpload && toUpload.length > 0) {
    console.log(`─── Uploading ${toUpload.length} local file(s) ───`)
    for (let i = 0; i < toUpload.length; i += BATCH_SIZE) {
      const batch = toUpload.slice(i, i + BATCH_SIZE)
      await Promise.all(
        batch.map((publicId) => {
          const filePath = localById.get(publicId)!
          return uploadFile(filePath, publicId, opts.dryRun)
        })
      )
    }
    console.log("")
  }

  console.log("✅  Sync complete.\n")
}

main()
