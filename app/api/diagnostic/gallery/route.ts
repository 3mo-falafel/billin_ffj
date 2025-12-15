import { NextResponse } from 'next/server'
import { createClient } from '@/lib/db/client'

// GET - Diagnostic endpoint to check gallery data
export async function GET() {
  try {
    const db = createClient()
    
    // Get ALL gallery entries (no filters)
    const allResult = await db.from('gallery').select('*').order('created_at', { ascending: false })
    
    // Get only active entries
    const activeResult = await db.from('gallery').select('*').eq('is_active', true).order('created_at', { ascending: false })
    
    // Get only image entries
    const imageResult = await db.from('gallery').select('*').eq('media_type', 'image').order('created_at', { ascending: false })
    
    if (allResult.error) {
      return NextResponse.json({ 
        error: allResult.error.message,
        status: 'database_error'
      }, { status: 500 })
    }
    
    const allData = allResult.data || []
    const activeData = activeResult.data || []
    const imageData = imageResult.data || []
    
    // Analyze the data
    const analysis = {
      all_entries: allData.length,
      active_entries: activeData.length,
      image_entries: imageData.length,
      entries_with_media_url: allData.filter((item: any) => item.media_url && item.media_url.length > 0).length,
      entries_without_media_url: allData.filter((item: any) => !item.media_url || item.media_url.length === 0).length,
      media_types: {
        image: allData.filter((item: any) => item.media_type === 'image').length,
        video: allData.filter((item: any) => item.media_type === 'video').length,
        other: allData.filter((item: any) => item.media_type !== 'image' && item.media_type !== 'video').length
      },
      is_active_breakdown: {
        true: allData.filter((item: any) => item.is_active === true).length,
        false: allData.filter((item: any) => item.is_active === false).length,
        null: allData.filter((item: any) => item.is_active === null || item.is_active === undefined).length
      },
      sample_entries: allData.slice(0, 10).map((item: any) => ({
        id: item.id,
        title_en: item.title_en,
        media_url: item.media_url,
        media_type: item.media_type,
        is_active: item.is_active,
        category: item.category,
        created_at: item.created_at
      }))
    }
    
    return NextResponse.json({
      status: 'ok',
      analysis,
      raw_counts: {
        all: allData.length,
        active: activeData.length,
        images: imageData.length
      }
    })
  } catch (error: any) {
    console.error('Diagnostic error:', error)
    return NextResponse.json({ 
      error: error.message,
      status: 'server_error'
    }, { status: 500 })
  }
}
