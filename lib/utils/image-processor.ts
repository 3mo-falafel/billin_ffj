import sharp from 'sharp'
import path from 'path'
import fs from 'fs/promises'
import { createHash } from 'crypto'

export interface ImageProcessingOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  format?: 'webp' | 'jpeg' | 'png'
  generateThumbnail?: boolean
  thumbnailWidth?: number
  maxFileSizeKB?: number // Target maximum file size in KB (for aggressive compression)
}

export interface ProcessedImage {
  filename: string
  path: string
  url: string
  size: number
  width: number
  height: number
  format: string
  thumbnail?: {
    filename: string
    path: string
    url: string
    size: number
  }
}

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')
const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB - Allow large files, we'll compress them
// Allow all common image types
const ALLOWED_TYPES = [
  'image/jpeg', 
  'image/jpg', 
  'image/png', 
  'image/webp',
  'image/gif',
  'image/bmp',
  'image/tiff',
  'image/svg+xml',
  'image/heic',
  'image/heif',
  'image/avif'
]

/**
 * Ensure upload directories exist
 */
export async function ensureUploadDirs() {
  console.log('📁 ensureUploadDirs - UPLOAD_DIR:', UPLOAD_DIR)
  console.log('📁 ensureUploadDirs - process.cwd():', process.cwd())
  
  const dirs = [
    UPLOAD_DIR,
    path.join(UPLOAD_DIR, 'images'),
    path.join(UPLOAD_DIR, 'thumbnails')
  ]

  for (const dir of dirs) {
    try {
      await fs.access(dir)
      console.log('📁 Directory exists:', dir)
    } catch {
      console.log('📁 Creating directory:', dir)
      try {
        await fs.mkdir(dir, { recursive: true })
        console.log('📁 Directory created successfully:', dir)
      } catch (mkdirError) {
        console.error('📁 Failed to create directory:', dir, mkdirError)
        throw mkdirError
      }
    }
  }
}

/**
 * Validate image file
 */
export function validateImageFile(file: { 
  mimetype: string
  size: number 
}): { valid: boolean; error?: string } {
  // Accept any image type - we'll convert it during processing
  if (!file.mimetype.startsWith('image/')) {
    return {
      valid: false,
      error: 'Invalid file type. Only image files are allowed.'
    }
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`
    }
  }

  return { valid: true }
}

/**
 * Generate unique filename
 */
export function generateUniqueFilename(originalName: string, buffer: Buffer): string {
  const ext = path.extname(originalName).toLowerCase()
  const hash = createHash('md5').update(buffer).digest('hex').substring(0, 12)
  const timestamp = Date.now()
  const sanitized = path.basename(originalName, ext)
    .replace(/[^a-z0-9]/gi, '-')
    .toLowerCase()
    .substring(0, 30)
  
  return `${sanitized}-${timestamp}-${hash}${ext}`
}

/**
 * Compress image to target file size using iterative quality reduction
 */
async function compressToTargetSize(
  buffer: Buffer,
  targetSizeKB: number,
  format: 'webp' | 'jpeg' | 'png',
  maxWidth: number,
  maxHeight: number
): Promise<{ buffer: Buffer; quality: number; width: number; height: number }> {
  const targetSizeBytes = targetSizeKB * 1024
  let quality = 85 // Start with high quality
  let currentWidth = maxWidth
  let resultBuffer = buffer
  let metadata = await sharp(buffer).metadata()
  
  // First pass: resize to max dimensions
  let imageProcessor = sharp(buffer).rotate()
  
  if (metadata.width && metadata.width > maxWidth) {
    imageProcessor = imageProcessor.resize(maxWidth, maxHeight, {
      fit: 'inside',
      withoutEnlargement: true
    })
  }
  
  // Apply format
  if (format === 'webp') {
    resultBuffer = await imageProcessor.webp({ quality }).toBuffer()
  } else if (format === 'jpeg') {
    resultBuffer = await imageProcessor.jpeg({ quality, mozjpeg: true }).toBuffer()
  } else {
    resultBuffer = await imageProcessor.png({ quality, compressionLevel: 9 }).toBuffer()
  }
  
  // If already under target, return
  if (resultBuffer.length <= targetSizeBytes) {
    const finalMeta = await sharp(resultBuffer).metadata()
    return { 
      buffer: resultBuffer, 
      quality, 
      width: finalMeta.width || 0, 
      height: finalMeta.height || 0 
    }
  }
  
  console.log(`📊 Initial size: ${(resultBuffer.length / 1024).toFixed(0)}KB, target: ${targetSizeKB}KB`)
  
  // Iteratively reduce quality until we hit target size
  while (resultBuffer.length > targetSizeBytes && quality > 10) {
    quality -= 10
    
    imageProcessor = sharp(buffer).rotate()
    
    // Also progressively reduce dimensions if quality alone isn't enough
    if (quality <= 40 && currentWidth > 800) {
      currentWidth = Math.max(800, currentWidth - 200)
      imageProcessor = imageProcessor.resize(currentWidth, null, {
        fit: 'inside',
        withoutEnlargement: true
      })
    } else if (metadata.width && metadata.width > maxWidth) {
      imageProcessor = imageProcessor.resize(maxWidth, maxHeight, {
        fit: 'inside',
        withoutEnlargement: true
      })
    }
    
    if (format === 'webp') {
      resultBuffer = await imageProcessor.webp({ quality }).toBuffer()
    } else if (format === 'jpeg') {
      resultBuffer = await imageProcessor.jpeg({ quality, mozjpeg: true }).toBuffer()
    } else {
      resultBuffer = await imageProcessor.png({ quality, compressionLevel: 9 }).toBuffer()
    }
    
    console.log(`📊 Quality ${quality}: ${(resultBuffer.length / 1024).toFixed(0)}KB`)
  }
  
  // If still too large, do more aggressive resize
  while (resultBuffer.length > targetSizeBytes && currentWidth > 400) {
    currentWidth = Math.max(400, currentWidth - 100)
    
    imageProcessor = sharp(buffer)
      .rotate()
      .resize(currentWidth, null, {
        fit: 'inside',
        withoutEnlargement: true
      })
    
    if (format === 'webp') {
      resultBuffer = await imageProcessor.webp({ quality }).toBuffer()
    } else if (format === 'jpeg') {
      resultBuffer = await imageProcessor.jpeg({ quality, mozjpeg: true }).toBuffer()
    } else {
      resultBuffer = await imageProcessor.png({ quality, compressionLevel: 9 }).toBuffer()
    }
    
    console.log(`📊 Resize ${currentWidth}px: ${(resultBuffer.length / 1024).toFixed(0)}KB`)
  }
  
  const finalMeta = await sharp(resultBuffer).metadata()
  return { 
    buffer: resultBuffer, 
    quality, 
    width: finalMeta.width || 0, 
    height: finalMeta.height || 0 
  }
}

/**
 * Process and optimize image
 */
export async function processImage(
  buffer: Buffer,
  originalFilename: string,
  options: ImageProcessingOptions = {}
): Promise<ProcessedImage> {
  const startTime = Date.now()
  
  const {
    maxWidth = 1600,
    maxHeight = 1600,
    quality = 80,
    format = 'webp',
    generateThumbnail = true,
    thumbnailWidth = 500,
    maxFileSizeKB = 150 // Default target: 150KB max
  } = options

  await ensureUploadDirs()

  // Generate unique filename
  const filename = generateUniqueFilename(originalFilename, buffer)
  const baseFilename = path.basename(filename, path.extname(filename))
  const outputFilename = `${baseFilename}.${format}`
  const outputPath = path.join(UPLOAD_DIR, 'images', outputFilename)

  // Get original image metadata
  const metadata = await sharp(buffer).metadata()
  
  console.log(`📸 Processing image: ${originalFilename}`)
  console.log(`📊 Original: ${(buffer.length / 1024).toFixed(2)}KB, ${metadata.width}x${metadata.height}`)
  console.log(`🎯 Target max size: ${maxFileSizeKB}KB`)

  // Use aggressive compression to target file size
  const compressed = await compressToTargetSize(
    buffer,
    maxFileSizeKB,
    format,
    maxWidth,
    maxHeight
  )
  
  const processedBuffer = compressed.buffer
  
  console.log('💾 Writing file to:', outputPath)
  await fs.writeFile(outputPath, processedBuffer)
  
  // Verify file was written
  try {
    const fileStats = await fs.stat(outputPath)
    console.log('💾 File written successfully, size:', fileStats.size, 'bytes')
  } catch (verifyError) {
    console.error('💾 ERROR: File was not written!', verifyError)
    throw new Error(`Failed to write file to ${outputPath}`)
  }

  const processedMetadata = await sharp(processedBuffer).metadata()
  const processedSize = (await fs.stat(outputPath)).size

  console.log(`✅ Final: ${(processedSize / 1024).toFixed(2)}KB, ${processedMetadata.width}x${processedMetadata.height}, quality: ${compressed.quality}`)

  const result: ProcessedImage = {
    filename: outputFilename,
    path: outputPath,
    url: `/api/uploads/images/${outputFilename}`,
    size: processedSize,
    width: processedMetadata.width || 0,
    height: processedMetadata.height || 0,
    format: processedMetadata.format || format
  }

  // Generate thumbnail
  if (generateThumbnail) {
    const thumbnailFilename = `thumb-${outputFilename}`
    const thumbnailPath = path.join(UPLOAD_DIR, 'thumbnails', thumbnailFilename)

    const thumbnailBuffer = await sharp(processedBuffer)
      .resize(thumbnailWidth, null, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: 75 })
      .toBuffer()

    await fs.writeFile(thumbnailPath, thumbnailBuffer)
    const thumbnailSize = (await fs.stat(thumbnailPath)).size

    console.log(`🔍 Thumbnail: ${(thumbnailSize / 1024).toFixed(2)}KB`)

    result.thumbnail = {
      filename: thumbnailFilename,
      path: thumbnailPath,
      url: `/api/uploads/thumbnails/${thumbnailFilename}`,
      size: thumbnailSize
    }
  }

  const processingTime = Date.now() - startTime
  console.log(`⏱️  Processing time: ${processingTime}ms`)
  console.log(`💾 Size reduction: ${((1 - processedSize / buffer.length) * 100).toFixed(1)}%\n`)

  return result
}

/**
 * Delete image files
 */
export async function deleteImage(imageUrl: string): Promise<void> {
  try {
    // Extract filename from URL
    const filename = path.basename(imageUrl)
    
    // Delete main image
    const imagePath = path.join(UPLOAD_DIR, 'images', filename)
    try {
      await fs.unlink(imagePath)
      console.log(`🗑️  Deleted image: ${filename}`)
    } catch (error) {
      console.warn(`⚠️  Could not delete image: ${filename}`)
    }

    // Delete thumbnail
    const thumbnailFilename = filename.startsWith('thumb-') ? filename : `thumb-${filename}`
    const thumbnailPath = path.join(UPLOAD_DIR, 'thumbnails', thumbnailFilename)
    try {
      await fs.unlink(thumbnailPath)
      console.log(`🗑️  Deleted thumbnail: ${thumbnailFilename}`)
    } catch (error) {
      console.warn(`⚠️  Could not delete thumbnail: ${thumbnailFilename}`)
    }
  } catch (error) {
    console.error('Error deleting image:', error)
  }
}

/**
 * Get image file size
 */
export async function getImageSize(imageUrl: string): Promise<number | null> {
  try {
    const filename = path.basename(imageUrl)
    const imagePath = path.join(UPLOAD_DIR, 'images', filename)
    const stats = await fs.stat(imagePath)
    return stats.size
  } catch {
    return null
  }
}
