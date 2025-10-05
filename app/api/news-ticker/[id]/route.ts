import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db/connection'

// GET /api/news-ticker/[id] - Get specific news ticker item
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await query(`
      SELECT id, message_en, message_ar, is_active, display_order, created_at, updated_at
      FROM news_ticker 
      WHERE id = $1
    `, [params.id])

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'News ticker item not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    })
  } catch (error) {
    console.error('Error fetching news ticker item:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch news ticker item' },
      { status: 500 }
    )
  }
}

// PUT /api/news-ticker/[id] - Update news ticker item
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { message_en, message_ar, is_active, display_order } = body

    // Validate required fields
    if (!message_en || !message_ar) {
      return NextResponse.json(
        { success: false, error: 'English and Arabic messages are required' },
        { status: 400 }
      )
    }

    const result = await query(`
      UPDATE news_ticker 
      SET message_en = $1, message_ar = $2, is_active = $3, display_order = $4, updated_at = NOW()
      WHERE id = $5
      RETURNING id, message_en, message_ar, is_active, display_order, created_at, updated_at
    `, [message_en, message_ar, is_active, display_order, params.id])

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'News ticker item not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    })
  } catch (error) {
    console.error('Error updating news ticker item:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update news ticker item' },
      { status: 500 }
    )
  }
}

// DELETE /api/news-ticker/[id] - Delete news ticker item
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await query(`
      DELETE FROM news_ticker 
      WHERE id = $1
      RETURNING id
    `, [params.id])

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'News ticker item not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'News ticker item deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting news ticker item:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete news ticker item' },
      { status: 500 }
    )
  }
}