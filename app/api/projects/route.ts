import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db/connection'

// GET - Fetch all projects
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const limit = searchParams.get('limit')
    const status = searchParams.get('status')
    const featured = searchParams.get('featured')
    const active = searchParams.get('active')
    
    let sql = `
      SELECT id, name, description, location, goal_amount, raised_amount, 
             start_date, end_date, status, images, is_featured, is_active, 
             created_at, updated_at
      FROM projects
      WHERE 1=1
    `
    const params: any[] = []
    let paramIndex = 1
    
    if (status && status !== 'all') {
      sql += ` AND status = $${paramIndex}`
      params.push(status)
      paramIndex++
    }
    
    if (featured === 'true') {
      sql += ` AND is_featured = $${paramIndex}`
      params.push(true)
      paramIndex++
    }
    
    if (active !== 'false') {
      sql += ` AND is_active = $${paramIndex}`
      params.push(true)
      paramIndex++
    }
    
    sql += ` ORDER BY created_at DESC`
    
    if (limit) {
      sql += ` LIMIT $${paramIndex}`
      params.push(parseInt(limit))
    }
    
    const result = await query(sql, params)
    
    return NextResponse.json({
      success: true,
      data: result.rows
    })
  } catch (error: any) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

// POST - Create new project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      description,
      location,
      goal_amount,
      raised_amount = 0,
      start_date,
      end_date,
      status = 'planning',
      images,
      is_featured = false,
      is_active = true
    } = body
    
    // Validate required fields
    if (!name || !description || !location || !goal_amount || !start_date) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, description, location, goal_amount, start_date' },
        { status: 400 }
      )
    }
    
    // Validate status
    const validStatuses = ['planning', 'active', 'completed', 'paused']
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status. Must be one of: planning, active, completed, paused' },
        { status: 400 }
      )
    }
    
    const result = await query(`
      INSERT INTO projects (name, description, location, goal_amount, raised_amount, start_date, end_date, status, images, is_featured, is_active, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
      RETURNING id, name, description, location, goal_amount, raised_amount, start_date, end_date, status, images, is_featured, is_active, created_at, updated_at
    `, [
      name,
      description,
      location,
      parseFloat(goal_amount),
      raised_amount ? parseFloat(raised_amount) : 0,
      start_date,
      end_date || null,
      status || 'planning',
      images || [],
      is_featured || false,
      is_active !== undefined ? is_active : true
    ])
    
    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: 'Project created successfully'
    })
  } catch (error: any) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create project' },
      { status: 500 }
    )
  }
}