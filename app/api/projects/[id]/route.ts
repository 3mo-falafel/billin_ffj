import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/db/client'
import { getCurrentUser } from '@/lib/auth/session'

// GET - Fetch single project
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = createClient()
    const result = await db.from('projects').select('*').eq('id', params.id).single()
    
    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 500 })
    }
    
    if (!result.data) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }
    
    return NextResponse.json({ data: result.data })
  } catch (error: any) {
    console.error('Error fetching project:', error)
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 })
  }
}

// PUT - Update project
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
    const result = await db.from('projects').update({
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
    }).eq('id', params.id)
    
    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 500 })
    }
    
    return NextResponse.json({ 
      data: result.data,
      message: 'Project updated successfully' 
    })
  } catch (error: any) {
    console.error('Error updating project:', error)
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 })
  }
}

// DELETE - Delete project
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
    const result = await db.from('projects').delete().eq('id', params.id)
    
    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 500 })
    }
    
    return NextResponse.json({ 
      message: 'Project deleted successfully' 
    })
  } catch (error: any) {
    console.error('Error deleting project:', error)
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 })
  }
}