import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/db/client'
import { getCurrentUser } from '@/lib/auth/session'

// GET - Fetch all scholarships
export async function GET(request: NextRequest) {
  try {
    const db = createClient()
    const { searchParams } = new URL(request.url)
    
    const limit = searchParams.get('limit')
    const category = searchParams.get('category')
    const active = searchParams.get('active')
    
    let query = db.from('scholarships').select('*')
    
    if (category && category !== 'all') {
      query = query.eq('category', category)
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
    console.error('Error fetching scholarships:', error)
    return NextResponse.json({ error: 'Failed to fetch scholarships' }, { status: 500 })
  }
}

// POST - Create new scholarship
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
    const result = await db.from('scholarships').insert([{
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
    }])
    
    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 500 })
    }
    
    return NextResponse.json({ 
      data: result.data,
      message: 'Scholarship created successfully' 
    })
  } catch (error: any) {
    console.error('Error creating scholarship:', error)
    return NextResponse.json({ error: 'Failed to create scholarship' }, { status: 500 })
  }
}