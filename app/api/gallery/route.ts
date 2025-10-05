import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/db/client'
import { getCurrentUser } from '@/lib/auth/session'

// GET - Fetch gallery items
export async function GET(request: NextRequest) {
  try {
    const db = createClient()
    const { searchParams } = new URL(request.url)
    
    const limit = searchParams.get('limit')
    const category = searchParams.get('category')
    const media_type = searchParams.get('media_type')
    const active = searchParams.get('active')
    
    let query = db.from('gallery').select('*')
    
    if (category && category !== 'all') {
      query = query.eq('category', category)
    }
    
    if (media_type) {
      query = query.eq('media_type', media_type)
    }
    
    if (active !== 'false') {
      query = query.eq('is_active', true)
    }
    
    query = query.order('created_at', { ascending: false })
    
    if (limit) {
      query = query.limit(parseInt(limit))
    }
    
    const result = await query
    
    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 500 })
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