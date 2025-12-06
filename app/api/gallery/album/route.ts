import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/db/client'
import { getCurrentUser } from '@/lib/auth/session'

interface GalleryImage {
  id: string
  media_url: string
  title_en: string
  category: string
}

// GET - Fetch images for a specific album by title
export async function GET(request: NextRequest) {
  try {
    const db = createClient()
    const { searchParams } = new URL(request.url)
    
    const albumTitle = searchParams.get('title')
    
    if (!albumTitle) {
      return NextResponse.json(
        { error: 'Album title is required' },
        { status: 400 }
      )
    }
    
    // Fetch all images for this album (including media_url)
    const result = await db.from('gallery')
      .select('id, media_url, title_en, category, created_at')
      .eq('title_en', albumTitle)
      .eq('media_type', 'image')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
    
    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 500 })
    }
    
    return NextResponse.json({ 
      data: result.data,
      albumTitle: albumTitle,
      imageCount: result.data?.length || 0
    })
  } catch (error: any) {
    console.error('Error fetching album images:', error)
    return NextResponse.json({ error: 'Failed to fetch album images' }, { status: 500 })
  }
}

// PUT - Update an album (batch update/delete/add images with same title)
export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const body = await request.json()
    const {
      originalTitle,  // The original album title to identify existing images
      newTitle,       // New title (can be same as original)
      location,       // Location text (stored in description)
      category,       // Category
      images,         // Array of image URLs (base64 data URLs)
      imagesToDelete  // Array of image URLs to delete (optional)
    } = body
    
    // Validate required fields
    if (!originalTitle) {
      return NextResponse.json(
        { error: 'Original album title is required' },
        { status: 400 }
      )
    }
    
    if (!newTitle || !category) {
      return NextResponse.json(
        { error: 'Title and category are required' },
        { status: 400 }
      )
    }
    
    const db = createClient()
    
    // 1. Get all existing images for this album
    const existingResult = await db.from('gallery')
      .select('*')
      .eq('title_en', originalTitle)
      .eq('media_type', 'image')
    
    if (existingResult.error) {
      return NextResponse.json({ error: existingResult.error.message }, { status: 500 })
    }
    
    const existingImages: GalleryImage[] = existingResult.data || []
    const existingUrls = existingImages.map((img: GalleryImage) => img.media_url)
    
    // 2. Determine which images to keep, delete, and add
    const imagesToKeep = images.filter((url: string) => existingUrls.includes(url))
    const newImages = images.filter((url: string) => !existingUrls.includes(url))
    const urlsToDelete = imagesToDelete || existingUrls.filter((url: string) => !images.includes(url))
    
    // 3. Delete removed images
    if (urlsToDelete.length > 0) {
      for (const urlToDelete of urlsToDelete) {
        const imgToDelete = existingImages.find((img: GalleryImage) => img.media_url === urlToDelete)
        if (imgToDelete) {
          await db.from('gallery').delete().eq('id', imgToDelete.id)
        }
      }
    }
    
    // 4. Update metadata on remaining images (title, category, location)
    for (const img of existingImages) {
      if (imagesToKeep.includes(img.media_url)) {
        await db.from('gallery').update({
          title_en: newTitle,
          title_ar: newTitle,
          description_en: location || 'Bil\'in, Palestine',
          description_ar: location || 'Bil\'in, Palestine',
          category: category
        }).eq('id', img.id)
      }
    }
    
    // 5. Add new images with the same album title
    for (const newImageUrl of newImages) {
      await db.from('gallery').insert([{
        title_en: newTitle,
        title_ar: newTitle,
        description_en: location || 'Bil\'in, Palestine',
        description_ar: location || 'Bil\'in, Palestine',
        media_url: newImageUrl,
        media_type: 'image',
        category: category,
        is_active: true
      }])
    }
    
    return NextResponse.json({ 
      message: 'Album updated successfully',
      stats: {
        kept: imagesToKeep.length,
        deleted: urlsToDelete.length,
        added: newImages.length
      }
    })
  } catch (error: any) {
    console.error('Error updating album:', error)
    return NextResponse.json({ error: 'Failed to update album' }, { status: 500 })
  }
}

// DELETE - Delete an entire album (all images with same title)
export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const body = await request.json()
    const { albumTitle } = body
    
    if (!albumTitle) {
      return NextResponse.json(
        { error: 'Album title is required' },
        { status: 400 }
      )
    }
    
    const db = createClient()
    
    // Get all images belonging to this album
    const existingResult = await db.from('gallery')
      .select('id')
      .eq('title_en', albumTitle)
      .eq('media_type', 'image')
    
    if (existingResult.error) {
      return NextResponse.json({ error: existingResult.error.message }, { status: 500 })
    }
    
    const imagesToDelete = existingResult.data || []
    
    if (imagesToDelete.length === 0) {
      return NextResponse.json({ error: 'Album not found' }, { status: 404 })
    }
    
    // Delete all images with this album title (one by one to avoid chaining issues)
    for (const img of imagesToDelete) {
      await db.from('gallery').delete().eq('id', img.id)
    }
    
    return NextResponse.json({ 
      message: 'Album deleted successfully',
      deletedCount: imagesToDelete.length
    })
  } catch (error: any) {
    console.error('Error deleting album:', error)
    return NextResponse.json({ error: 'Failed to delete album' }, { status: 500 })
  }
}
