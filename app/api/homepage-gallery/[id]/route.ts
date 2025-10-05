import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/db/client'
import { getCurrentUser } from '@/lib/auth/session'

// GET - Fetch single homepage gallery item
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = createClient()
    const result = await db.from('homepage_gallery').select('*').eq('id', params.id).single()
    
    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 500 })
    }
    
    if (!result.data) {
      return NextResponse.json({ error: 'Homepage gallery item not found' }, { status: 404 })
    }
    
    return NextResponse.json({ data: result.data })
  } catch (error: any) {
    console.error('Error fetching homepage gallery item:', error)
    return NextResponse.json({ error: 'Failed to fetch homepage gallery item' }, { status: 500 })
  }
}

// PUT - Update homepage gallery item
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
    const result = await db.from('homepage_gallery').update({
      title_en,
      title_ar,
      image_url,
      alt_text: alt_text || null,
      display_order: display_order || 0,
      is_active: is_active !== undefined ? is_active : true
    }).eq('id', params.id)
    
    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 500 })
    }
    
    return NextResponse.json({ 
      data: result.data,
      message: 'Homepage gallery item updated successfully' 
    })
  } catch (error: any) {
    console.error('Error updating homepage gallery item:', error)
    return NextResponse.json({ error: 'Failed to update homepage gallery item' }, { status: 500 })
  }
}

// DELETE - Delete homepage gallery item
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
    const result = await db.from('homepage_gallery').delete().eq('id', params.id)
    
    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 500 })
    }
    
    return NextResponse.json({ 
      message: 'Homepage gallery item deleted successfully' 
    })
  } catch (error: any) {
    console.error('Error deleting homepage gallery item:', error)
    return NextResponse.json({ error: 'Failed to delete homepage gallery item' }, { status: 500 })
  }
}