import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/db/client'
import { getCurrentUser } from '@/lib/auth/session'

// GET - Fetch single scholarship
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = createClient()
    const result = await db.from('scholarships').select('*').eq('id', params.id).single()
    
    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 500 })
    }
    
    if (!result.data) {
      return NextResponse.json({ error: 'Scholarship not found' }, { status: 404 })
    }
    
    return NextResponse.json({ data: result.data })
  } catch (error: any) {
    console.error('Error fetching scholarship:', error)
    return NextResponse.json({ error: 'Failed to fetch scholarship' }, { status: 500 })
  }
}

// PUT - Update scholarship
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
      category,
      student_name,
      university_name,
      scholarship_amount,
      deadline,
      requirements_en,
      requirements_ar,
      contact_info,
      image_url,
      is_active
    } = body
    
    // Validate required fields
    if (!title_en || !title_ar || !description_en || !description_ar || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Validate category
    const validCategories = ['awarded', 'available', 'sponsor_opportunity']
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: 'Invalid category. Must be one of: awarded, available, sponsor_opportunity' },
        { status: 400 }
      )
    }
    
    const db = createClient()
    const result = await db.from('scholarships').update({
      title_en,
      title_ar,
      description_en,
      description_ar,
      category,
      student_name: student_name || null,
      university_name: university_name || null,
      scholarship_amount: scholarship_amount || null,
      deadline: deadline || null,
      requirements_en: requirements_en || null,
      requirements_ar: requirements_ar || null,
      contact_info: contact_info || null,
      image_url: image_url || null,
      is_active: is_active !== undefined ? is_active : true
    }).eq('id', params.id)
    
    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 500 })
    }
    
    return NextResponse.json({ 
      data: result.data,
      message: 'Scholarship updated successfully' 
    })
  } catch (error: any) {
    console.error('Error updating scholarship:', error)
    return NextResponse.json({ error: 'Failed to update scholarship' }, { status: 500 })
  }
}

// DELETE - Delete scholarship
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
    const result = await db.from('scholarships').delete().eq('id', params.id)
    
    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 500 })
    }
    
    return NextResponse.json({ 
      message: 'Scholarship deleted successfully' 
    })
  } catch (error: any) {
    console.error('Error deleting scholarship:', error)
    return NextResponse.json({ error: 'Failed to delete scholarship' }, { status: 500 })
  }
}