import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db/connection'

// GET /api/news-ticker - Get all news ticker items
export async function GET(request: NextRequest) {
  try {
    const result = await query(`
      SELECT id, message_en, message_ar, is_active, display_order, created_at, updated_at
      FROM news_ticker 
      ORDER BY display_order ASC, created_at DESC
    `)

    return NextResponse.json({
      success: true,
      data: result.rows
    })
  } catch (error) {
    console.error('Error fetching news ticker items:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch news ticker items' },
      { status: 500 }
    )
  }
}

// POST /api/news-ticker - Create new news ticker item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message_en, message_ar, is_active = true, display_order = 0 } = body

    // Validate required fields
    if (!message_en || !message_ar) {
      return NextResponse.json(
        { success: false, error: 'English and Arabic messages are required' },
        { status: 400 }
      )
    }

    const result = await query(`
      INSERT INTO news_ticker (message_en, message_ar, is_active, display_order, created_at, updated_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      RETURNING id, message_en, message_ar, is_active, display_order, created_at, updated_at
    `, [message_en, message_ar, is_active, display_order])

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    })
  } catch (error) {
    console.error('Error creating news ticker item:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create news ticker item' },
      { status: 500 }
    )
  }
}