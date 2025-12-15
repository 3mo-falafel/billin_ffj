import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs/promises'
import { existsSync } from 'fs'

// Serve uploaded images dynamically
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathSegments } = await params
    const filePath = pathSegments.join('/')
    
    // Security: prevent directory traversal
    if (filePath.includes('..') || filePath.includes('~')) {
      return new NextResponse('Invalid path', { status: 400 })
    }
    
    const fullPath = path.join(process.cwd(), 'public', 'uploads', filePath)
    
    // Check if file exists
    if (!existsSync(fullPath)) {
      console.log('📁 Image not found:', fullPath)
      return new NextResponse('Not found', { status: 404 })
    }
    
    // Read file
    const fileBuffer = await fs.readFile(fullPath)
    
    // Determine content type
    const ext = path.extname(fullPath).toLowerCase()
    const contentTypes: Record<string, string> = {
      '.webp': 'image/webp',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
    }
    
    const contentType = contentTypes[ext] || 'application/octet-stream'
    
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Error serving image:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
