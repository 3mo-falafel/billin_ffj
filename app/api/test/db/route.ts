import { NextRequest, NextResponse } from 'next/server'
import { testDatabaseConnection, createTestAdmin } from '@/lib/db/test-connection'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    
    if (action === 'connection') {
      const result = await testDatabaseConnection()
      return NextResponse.json(result)
    }
    
    if (action === 'create-admin') {
      const result = await createTestAdmin()
      return NextResponse.json(result)
    }
    
    // Default: run both tests
    const connectionResult = await testDatabaseConnection()
    
    if (connectionResult.success) {
      const adminResult = await createTestAdmin()
      return NextResponse.json({
        connection: connectionResult,
        admin: adminResult
      })
    }
    
    return NextResponse.json({ connection: connectionResult })
    
  } catch (error: any) {
    console.error('Test API error:', error)
    return NextResponse.json(
      { error: 'Test failed', details: error.message },
      { status: 500 }
    )
  }
}