import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/db/client'
import { getCurrentUser } from '@/lib/auth/session'

// GET - Fetch all homepage gallery items
export async function GET(request: NextRequest) {
  try {
    const db = createClient()
    const { searchParams } = new URL(request.url)
    
    const active = searchParams.get('active')
    
    let query = db.from('homepage_gallery').select('*')
    
    if (active !== 'false') {
      query = query.eq('is_active', true)
    }
    
    query = query.order('display_order', { ascending: true })
    
    const result = await query
    
    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 500 })
    }
    
    return NextResponse.json({ data: result.data })
  } catch (error: any) {
    console.error('Error fetching homepage gallery:', error)
    return NextResponse.json({ error: 'Failed to fetch homepage gallery' }, { status: 500 })
  }
}

// POST - Create new homepage gallery item
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
      image_url,
      alt_text,
      display_order,
      is_active
    } = body
    
    // Validate required fields
    if (!title_en || !title_ar || !image_url) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    const db = createClient()
    const result = await db.from('homepage_gallery').insert([{
      title_en,
      title_ar,
      image_url,
      alt_text: alt_text || null,
      display_order: display_order || 0,
      is_active: is_active !== undefined ? is_active : true
    }])
    
    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 500 })
    }
    
    return NextResponse.json({ 
      data: result.data,
      message: 'Homepage gallery item created successfully' 
    })
  } catch (error: any) {
    console.error('Error creating homepage gallery item:', error)
    return NextResponse.json({ error: 'Failed to create homepage gallery item' }, { status: 500 })
  }
}