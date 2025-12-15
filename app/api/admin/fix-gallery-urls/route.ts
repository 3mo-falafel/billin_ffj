import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/db/client'
import { getCurrentUser } from '@/lib/auth/session'

// This API fixes old gallery entries that have base64 data URIs instead of proper file paths
// It converts base64 images to files and updates the database

export async function POST(request: NextRequest) {
  try {
    // Check authentication - admin only
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const db = createClient()
    
    // Fetch all gallery entries that have base64 data URIs
    const { data: entries, error: fetchError } = await db
      .from('gallery')
      .select('id, title_en, media_url, media_type')
      .like('media_url', 'data:%')  // Find entries with data URIs
    
    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 })
    }
    
    if (!entries || entries.length === 0) {
      return NextResponse.json({ 
        message: 'No base64 entries found to fix',
        fixed: 0
      })
    }
    
    let fixedCount = 0
    let failedCount = 0
    const results: any[] = []
    
    for (const entry of entries) {
      try {
        // Extract base64 data and convert to file
        const base64Data = entry.media_url
        
        // Parse the data URI
        const matches = base64Data.match(/^data:([^;]+);base64,(.+)$/)
        if (!matches) {
          results.push({ id: entry.id, status: 'skipped', reason: 'Invalid data URI format' })
          continue
        }
        
        const mimeType = matches[1]
        const base64String = matches[2]
        
        // Determine file extension from mime type
        let extension = 'jpg'
        if (mimeType.includes('png')) extension = 'png'
        else if (mimeType.includes('webp')) extension = 'webp'
        else if (mimeType.includes('gif')) extension = 'gif'
        
        // Generate a unique filename
        const timestamp = Date.now()
        const randomId = Math.random().toString(36).substring(2, 15)
        const filename = `migrated-${timestamp}-${randomId}.${extension}`
        
        // Convert base64 to buffer
        const buffer = Buffer.from(base64String, 'base64')
        
        // Save to filesystem
        const fs = await import('fs/promises')
        const path = await import('path')
        
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'images')
        
        // Ensure directory exists
        try {
          await fs.mkdir(uploadDir, { recursive: true })
        } catch (e) {
          // Directory might already exist
        }
        
        const filePath = path.join(uploadDir, filename)
        await fs.writeFile(filePath, buffer)
        
        // Generate the URL path
        const newUrl = `/api/uploads/images/${filename}`
        
        // Update database
        const { error: updateError } = await db
          .from('gallery')
          .update({ media_url: newUrl })
          .eq('id', entry.id)
        
        if (updateError) {
          results.push({ id: entry.id, status: 'failed', reason: updateError.message })
          failedCount++
        } else {
          results.push({ id: entry.id, status: 'fixed', newUrl })
          fixedCount++
        }
        
      } catch (err: any) {
        results.push({ id: entry.id, status: 'error', reason: err.message })
        failedCount++
      }
    }
    
    return NextResponse.json({
      message: 'Gallery URL migration complete',
      total: entries.length,
      fixed: fixedCount,
      failed: failedCount,
      results
    })
    
  } catch (error: any) {
    console.error('Error in fix-gallery-urls:', error)
    return NextResponse.json({ error: 'Failed to fix gallery URLs', details: error.message }, { status: 500 })
  }
}

// GET method to check status
export async function GET(request: NextRequest) {
  try {
    const db = createClient()
    
    // Count entries with base64 data URIs
    const { data: base64Entries, error: error1 } = await db
      .from('gallery')
      .select('id', { count: 'exact' })
      .like('media_url', 'data:%')
    
    // Count entries with proper file paths
    const { data: filePathEntries, error: error2 } = await db
      .from('gallery')
      .select('id', { count: 'exact' })
      .like('media_url', '/api/uploads/%')
    
    if (error1 || error2) {
      return NextResponse.json({ error: 'Failed to check status' }, { status: 500 })
    }
    
    return NextResponse.json({
      status: 'ok',
      base64_entries: base64Entries?.length || 0,
      file_path_entries: filePathEntries?.length || 0,
      needs_migration: (base64Entries?.length || 0) > 0
    })
    
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
