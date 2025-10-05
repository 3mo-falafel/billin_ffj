import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/db/client'
import { getCurrentUser } from '@/lib/auth/session'

// GET - Fetch all activities
export async function GET(request: NextRequest) {
  try {
    const db = createClient()
    const { searchParams } = new URL(request.url)
    
    const limit = searchParams.get('limit')
    const active = searchParams.get('active')
    
    let query = db.from('activities').select('*')
    
    if (active !== 'false') {
      query = query.eq('is_active', true)
    }
    
    query = query.order('date', { ascending: false })
    
    if (limit) {
      query = query.limit(parseInt(limit))
    }
    
    const result = await query
    
    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 500 })
    }
    
    return NextResponse.json({ data: result.data })
  } catch (error: any) {
    console.error('Error fetching activities:', error)
    return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 })
  }
}

// POST - Create new activity
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
      image_url,
      video_url,
      date,
      is_active
    } = body
    
    // Validate required fields
    if (!title_en || !title_ar || !description_en || !description_ar || !date) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    const db = createClient()
    const result = await db.from('activities').insert([{
      title_en,
      title_ar,
      description_en,
      description_ar,
      image_url: image_url || null,
      video_url: video_url || null,
      date,
      is_active: is_active !== undefined ? is_active : true
    }])
    
    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 500 })
    }
    
    return NextResponse.json({ 
      data: result.data,
      message: 'Activity created successfully' 
    })
  } catch (error: any) {
    console.error('Error creating activity:', error)
    return NextResponse.json({ error: 'Failed to create activity' }, { status: 500 })
  }
}