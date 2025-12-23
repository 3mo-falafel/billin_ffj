import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs/promises'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB - We accept large files and compress them

// Ensure upload directories exist
async function ensureUploadDirs() {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads')
  const imagesDir = path.join(uploadDir, 'images')
  const thumbnailsDir = path.join(uploadDir, 'thumbnails')
  
  for (const dir of [uploadDir, imagesDir, thumbnailsDir]) {
    try {
      await fs.access(dir)
    } catch {
      await fs.mkdir(dir, { recursive: true })
    }
  }
  return { uploadDir, imagesDir, thumbnailsDir }
}

// Fallback: save image without compression
async function saveImageWithoutCompression(buffer: Buffer, filename: string): Promise<{
  url: string
  filename: string
  size: number
}> {
  const { imagesDir } = await ensureUploadDirs()
  
  // Generate unique filename
  const ext = path.extname(filename).toLowerCase() || '.jpg'
  const baseName = path.basename(filename, ext).replace(/[^a-z0-9]/gi, '-').toLowerCase().substring(0, 30)
  const uniqueFilename = `${baseName}-${Date.now()}${ext}`
  const outputPath = path.join(imagesDir, uniqueFilename)
  
  await fs.writeFile(outputPath, buffer)
  
  return {
    url: `/api/uploads/images/${uniqueFilename}`,
    filename: uniqueFilename,
    size: buffer.length
  }
}

export async function POST(request: NextRequest) {
  console.log('📤 Upload API - Request received')
  
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      console.log('📤 Upload API - No file provided')
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    console.log('📤 Upload API - File received:', {
      name: file.name,
      type: file.type,
      size: file.size,
      sizeMB: (file.size / 1024 / 1024).toFixed(2) + 'MB'
    })

    // Basic validation - accept any image
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Only image files are allowed' },
        { status: 400 }
      )
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 400 }
      )
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    console.log('📤 Upload API - Buffer created, size:', buffer.length, 'bytes')

    // Get processing options from form data
    const maxWidth = parseInt(formData.get('maxWidth') as string) || 1600
    const quality = parseInt(formData.get('quality') as string) || 80
    const generateThumbnail = formData.get('generateThumbnail') !== 'false'
    const maxFileSizeKB = parseInt(formData.get('maxFileSizeKB') as string) || 150

    console.log('📤 Upload API - Processing options:', { maxWidth, quality, generateThumbnail, maxFileSizeKB })

    // Try to use Sharp for compression, fallback to saving without compression
    let result
    try {
      const imageProcessor = await import('@/lib/utils/image-processor')
      result = await imageProcessor.processImage(buffer, file.name, {
        maxWidth,
        quality,
        generateThumbnail,
        maxFileSizeKB
      })
      console.log('📤 Upload API - Processed with Sharp:', {
        url: result.url,
        originalSize: (buffer.length / 1024).toFixed(0) + 'KB',
        finalSize: (result.size / 1024).toFixed(0) + 'KB'
      })
    } catch (sharpError: any) {
      console.error('📤 Upload API - Sharp failed, using fallback:', sharpError.message)
      // Fallback: save without compression
      const fallbackResult = await saveImageWithoutCompression(buffer, file.name)
      result = {
        ...fallbackResult,
        width: 0,
        height: 0,
        format: path.extname(file.name).replace('.', '') || 'unknown',
        thumbnail: undefined
      }
      console.log('📤 Upload API - Saved without compression:', result.url)
    }

    return NextResponse.json({
      success: true,
      data: {
        url: result.url,
        thumbnailUrl: result.thumbnail?.url,
        filename: result.filename,
        size: result.size,
        width: result.width,
        height: result.height,
        format: result.format
      }
    })

  } catch (error) {
    console.error('📤 Upload API - Error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    return NextResponse.json(
      { 
        error: 'Failed to upload image', 
        details: errorMessage
      },
      { status: 500 }
    )
  }
}

// Optional: GET endpoint to retrieve image info
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const filename = searchParams.get('filename')

  if (!filename) {
    return NextResponse.json(
      { error: 'Filename required' },
      { status: 400 }
    )
  }

  return NextResponse.json({
    url: `/uploads/images/${filename}`,
    thumbnailUrl: `/uploads/thumbnails/thumb-${filename}`
  })
}
