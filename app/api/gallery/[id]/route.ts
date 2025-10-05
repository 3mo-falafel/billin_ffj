import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/db/client'
import { getCurrentUser } from '@/lib/auth/session'

// GET - Fetch single gallery item
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = createClient()
    const result = await db.from('gallery').select('*').eq('id', params.id).single()
    
    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 500 })
    }
    
    if (!result.data) {
      return NextResponse.json({ error: 'Gallery item not found' }, { status: 404 })
    }
    
    return NextResponse.json({ data: result.data })
  } catch (error: any) {
    console.error('Error fetching gallery item:', error)
    return NextResponse.json({ error: 'Failed to fetch gallery item' }, { status: 500 })
  }
}

// PUT - Update gallery item
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const result = await db.from('gallery').update({
      title_en: title_en || null,
      title_ar: title_ar || null,
      description_en: description_en || null,
      description_ar: description_ar || null,
      media_url,
      media_type,
      cover_image: cover_image || null,
      category: category || 'general',
      is_active: is_active !== undefined ? is_active : true
    }).eq('id', params.id)
    
    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 500 })
    }
    
    return NextResponse.json({ 
      data: result.data,
      message: 'Gallery item updated successfully' 
    })
  } catch (error: any) {
    console.error('Error updating gallery item:', error)
    return NextResponse.json({ error: 'Failed to update gallery item' }, { status: 500 })
  }
}

// DELETE - Delete gallery item
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const db = createClient()
    const result = await db.from('gallery').delete().eq('id', params.id)
    
    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 500 })
    }
    
    return NextResponse.json({ 
      message: 'Gallery item deleted successfully' 
    })
  } catch (error: any) {
    console.error('Error deleting gallery item:', error)
    return NextResponse.json({ error: 'Failed to delete gallery item' }, { status: 500 })
  }
}