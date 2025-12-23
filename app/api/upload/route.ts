import { NextRequest, NextResponse } from 'next/server'
import { processImage, validateImageFile } from '@/lib/utils/image-processor'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB - We accept large files and compress them

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

    // Validate file
    const validation = validateImageFile({
      mimetype: file.type,
      size: file.size
    })

    if (!validation.valid) {
      console.log('📤 Upload API - Validation failed:', validation.error)
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    console.log('📤 Upload API - Buffer created, size:', buffer.length, 'bytes (' + (buffer.length / 1024 / 1024).toFixed(2) + 'MB)')

    // Get processing options from form data
    const maxWidth = parseInt(formData.get('maxWidth') as string) || 1600
    const quality = parseInt(formData.get('quality') as string) || 80
    const generateThumbnail = formData.get('generateThumbnail') !== 'false'
    const maxFileSizeKB = parseInt(formData.get('maxFileSizeKB') as string) || 150 // Default 150KB max

    console.log('📤 Upload API - Processing options:', { maxWidth, quality, generateThumbnail, maxFileSizeKB })

    // Process image with compression
    const result = await processImage(buffer, file.name, {
      maxWidth,
      quality,
      generateThumbnail,
      maxFileSizeKB
    })

    console.log('📤 Upload API - Processing complete:', {
      url: result.url,
      filename: result.filename,
      originalSize: (buffer.length / 1024).toFixed(0) + 'KB',
      finalSize: (result.size / 1024).toFixed(0) + 'KB',
      compression: ((1 - result.size / buffer.length) * 100).toFixed(1) + '%'
    })

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
    const errorStack = error instanceof Error ? error.stack : undefined
    console.error('📤 Upload API - Stack:', errorStack)
    
    return NextResponse.json(
      { 
        error: 'Failed to upload image', 
        details: errorMessage,
        stack: process.env.NODE_ENV === 'development' ? errorStack : undefined
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
