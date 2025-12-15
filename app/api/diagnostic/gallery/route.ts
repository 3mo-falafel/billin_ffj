import { NextResponse } from 'next/server'
import { createClient } from '@/lib/db/client'

// GET - Diagnostic endpoint to check gallery data
export async function GET() {
  try {
    const db = createClient()
    
    // Get all gallery entries
    const result = await db.from('gallery').select('*').order('created_at', { ascending: false }).limit(20)
    
    if (result.error) {
      return NextResponse.json({ 
        error: result.error.message,
        status: 'database_error'
      }, { status: 500 })
    }
    
    const data = result.data || []
    
    // Analyze the data
    const analysis = {
      total_entries: data.length,
      entries_with_media_url: data.filter((item: any) => item.media_url).length,
      entries_without_media_url: data.filter((item: any) => !item.media_url).length,
      media_types: {
        image: data.filter((item: any) => item.media_type === 'image').length,
        video: data.filter((item: any) => item.media_type === 'video').length
      },
      sample_entries: data.slice(0, 5).map((item: any) => ({
        id: item.id,
        title_en: item.title_en,
        media_url: item.media_url,
        media_type: item.media_type,
        is_active: item.is_active,
        category: item.category
      }))
    }
    
    return NextResponse.json({
      status: 'ok',
      analysis,
      raw_data: data
    })
  } catch (error: any) {
    console.error('Diagnostic error:', error)
    return NextResponse.json({ 
      error: error.message,
      status: 'server_error'
    }, { status: 500 })
  }
}
