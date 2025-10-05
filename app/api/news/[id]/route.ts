import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/db/client'
import { getCurrentUser } from '@/lib/auth/session'

// GET - Fetch single news article
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = createClient()
    const result = await db.from('news').select('*').eq('id', params.id).single()
    
    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 500 })
    }
    
    if (!result.data) {
      return NextResponse.json({ error: 'News article not found' }, { status: 404 })
    }
    
    return NextResponse.json({ data: result.data })
  } catch (error: any) {
    console.error('Error fetching news article:', error)
    return NextResponse.json({ error: 'Failed to fetch news article' }, { status: 500 })
  }
}

// PUT - Update news article
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
      content_en,
      content_ar,
      image_url,
      video_url,
      featured,
      is_active,
      date
    } = body
    
    // Validate required fields
    if (!title_en || !title_ar || !content_en || !content_ar || !date) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    const db = createClient()
    const result = await db.from('news').update({
      title_en,
      title_ar,
      content_en,
      content_ar,
      image_url: image_url || null,
      video_url: video_url || null,
      featured: featured || false,
      is_active: is_active !== undefined ? is_active : true,
      date
    }).eq('id', params.id)
    
    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 500 })
    }
    
    return NextResponse.json({ 
      data: result.data,
      message: 'News article updated successfully' 
    })
  } catch (error: any) {
    console.error('Error updating news:', error)
    return NextResponse.json({ error: 'Failed to update news article' }, { status: 500 })
  }
}

// DELETE - Delete news article
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
    const result = await db.from('news').delete().eq('id', params.id)
    
    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 500 })
    }
    
    return NextResponse.json({ 
      message: 'News article deleted successfully' 
    })
  } catch (error: any) {
    console.error('Error deleting news:', error)
    return NextResponse.json({ error: 'Failed to delete news article' }, { status: 500 })
  }
}