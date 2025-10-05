import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/db/client'
import { getCurrentUser } from '@/lib/auth/session'

// GET - Fetch all projects
export async function GET(request: NextRequest) {
  try {
    const db = createClient()
    const { searchParams } = new URL(request.url)
    
    const limit = searchParams.get('limit')
    const status = searchParams.get('status')
    const featured = searchParams.get('featured')
    const active = searchParams.get('active')
    
    let query = db.from('projects').select('*')
    
    if (status && status !== 'all') {
      query = query.eq('status', status)
    }
    
    if (featured === 'true') {
      query = query.eq('is_featured', true)
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
    console.error('Error fetching projects:', error)
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}

// POST - Create new project
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const body = await request.json()
    const {
      name,
      description,
      location,
      goal_amount,
      raised_amount,
      start_date,
      end_date,
      status,
      images,
      is_featured,
      is_active
    } = body
    
    // Validate required fields
    if (!name || !description || !location || !goal_amount || !start_date) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Validate status
    const validStatuses = ['planning', 'active', 'completed', 'paused']
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be one of: planning, active, completed, paused' },
        { status: 400 }
      )
    }
    
    const db = createClient()
    const result = await db.from('projects').insert([{
      name,
      description,
      location,
      goal_amount: parseFloat(goal_amount),
      raised_amount: raised_amount ? parseFloat(raised_amount) : 0,
      start_date,
      end_date: end_date || null,
      status: status || 'planning',
      images: images || [],
      is_featured: is_featured || false,
      is_active: is_active !== undefined ? is_active : true
    }])
    
    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 500 })
    }
    
    return NextResponse.json({ 
      data: result.data,
      message: 'Project created successfully' 
    })
  } catch (error: any) {
    console.error('Error creating project:', error)
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}