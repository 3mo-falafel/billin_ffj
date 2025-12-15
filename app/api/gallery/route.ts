import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/db/client'
import { getCurrentUser } from '@/lib/auth/session'

interface GalleryItem {
  id: string
  title_en: string
  media_url: string
  category: string
  created_at: string
}

// GET - Fetch gallery items
export async function GET(request: NextRequest) {
  try {
    const db = createClient()
    const { searchParams } = new URL(request.url)
    
    const limit = searchParams.get('limit')
    const category = searchParams.get('category')
    const media_type = searchParams.get('media_type')
    const active = searchParams.get('active')
    const metadataOnly = searchParams.get('metadata_only') === 'true'
    const withThumbnails = searchParams.get('with_thumbnails') === 'true'
    
    console.log('📸 Gallery API - Request params:', { limit, category, media_type, active, metadataOnly, withThumbnails })
    
    // For with_thumbnails mode: fetch all items but we'll process to get first image per album
    // For metadata_only requests, we select only essential fields (no media_url)
    // This dramatically improves performance for listing pages
    let selectFields = '*'
    if (metadataOnly && !withThumbnails) {
      selectFields = 'id, title_en, title_ar, description_en, description_ar, media_type, cover_image, category, is_active, created_at'
    }
    
    let query = db.from('gallery').select(selectFields)
    
    if (category && category !== 'all') {
      query = query.eq('category', category)
    }
    
    if (media_type) {
      query = query.eq('media_type', media_type)
    }
    
    if (active !== 'false') {
      query = query.eq('is_active', true)
    }
    
    query = query.order('created_at', { ascending: true }) // Oldest first so first uploaded is the thumbnail
    
    if (limit && !withThumbnails) {
      query = query.limit(parseInt(limit))
    }
    
    const result = await query
    
    console.log('📸 Gallery API - Query result:', { 
      error: result.error, 
      dataLength: result.data?.length,
      firstItem: result.data?.[0]
    })
    
    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 500 })
    }
    
    // If with_thumbnails mode, group by album and return first image as thumbnail
    if (withThumbnails && result.data) {
      const albumMap = new Map<string, { 
        id: string
        title_en: string
        thumbnail: string | null
        category: string
        created_at: string
        imageCount: number
        allImages: string[]
      }>()
      
      result.data.forEach((item: GalleryItem) => {
        const key = item.title_en || 'Untitled Album'
        // Check if media_url is a valid file path (not base64)
        const isValidPath = item.media_url && !item.media_url.startsWith('data:')
        
        if (!albumMap.has(key)) {
          albumMap.set(key, {
            id: item.id,
            title_en: item.title_en,
            thumbnail: isValidPath ? item.media_url : null, // Only use file paths as thumbnails
            category: item.category,
            created_at: item.created_at,
            imageCount: 1,
            allImages: isValidPath ? [item.media_url] : []
          })
        } else {
          const album = albumMap.get(key)!
          album.imageCount++
          // If we don't have a thumbnail yet and this is a valid path, use it
          if (!album.thumbnail && isValidPath) {
            album.thumbnail = item.media_url
          }
          if (isValidPath) {
            album.allImages.push(item.media_url)
          }
        }
      })
      
      // Convert map to array and set thumbnail to first valid image
      const albums = Array.from(albumMap.values()).map(album => ({
        id: album.id,
        title_en: album.title_en,
        thumbnail: album.thumbnail || (album.allImages.length > 0 ? album.allImages[0] : null),
        category: album.category,
        created_at: album.created_at,
        imageCount: album.imageCount
      }))
      
      return NextResponse.json({ 
        data: albums,
        mode: 'albums_with_thumbnails'
      })
    }
    
    return NextResponse.json({ data: result.data })
  } catch (error: any) {
    console.error('Error fetching gallery:', error)
    return NextResponse.json({ error: 'Failed to fetch gallery items' }, { status: 500 })
  }
}

// POST - Create new gallery item
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const body = await request.json()
    const {
      title_en,
      title_ar,
      description_en,
      description_ar,
      media_url,
      media_type,
      cover_image,
      category,
      is_active
    } = body
    
    // Validate required fields
    if (!media_url || !media_type) {
      return NextResponse.json(
        { error: 'Media URL and media type are required' },
        { status: 400 }
      )
    }
    
    if (!['image', 'video'].includes(media_type)) {
      return NextResponse.json(
        { error: 'Media type must be either "image" or "video"' },
        { status: 400 }
      )
    }
    
    const db = createClient()
    const result = await db.from('gallery').insert([{
      title_en: title_en || null,
      title_ar: title_ar || null,
      description_en: description_en || null,
      description_ar: description_ar || null,
      media_url,
      media_type,
      cover_image: cover_image || null,
      category: category || 'general',
      is_active: is_active !== undefined ? is_active : true
    }])
    
    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 500 })
    }
    
    return NextResponse.json({ 
      data: result.data,
      message: 'Gallery item created successfully' 
    })
  } catch (error: any) {
    console.error('Error creating gallery item:', error)
    return NextResponse.json({ error: 'Failed to create gallery item' }, { status: 500 })
  }
}