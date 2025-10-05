'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function TestPage() {
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const runTest = async (action?: string) => {
    setLoading(true)
    try {
      const url = action ? `/api/test/db?action=${action}` : '/api/test/db'
      const response = await fetch(url)
      const data = await response.json()
      setResults(data)
    } catch (error) {
      setResults({ error: 'Failed to run test', details: error })
    } finally {
      setLoading(false)
    }
  }

  const testNews = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/news')
      const data = await response.json()
      setResults({ newsTest: data })
    } catch (error) {
      setResults({ error: 'Failed to test news API', details: error })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Database & API Testing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 flex-wrap">
            <Button 
              onClick={() => runTest('connection')} 
              disabled={loading}
              variant="outline"
            >
              Test DB Connection
            </Button>
            <Button 
              onClick={() => runTest('create-admin')} 
              disabled={loading}
              variant="outline"
            >
              Create Test Admin
            </Button>
            <Button 
              onClick={() => runTest()} 
              disabled={loading}
            >
              Run All Tests
            </Button>
            <Button 
              onClick={testNews} 
              disabled={loading}
              variant="secondary"
            >
              Test News API
            </Button>
          </div>

          {loading && (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              <span>Running tests...</span>
            </div>
          )}

          {results && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Test Results</CardTitle>
              </CardHeader>
              <CardContent>
                {results.connection && (
                  <div className="mb-4">
                    <Badge variant={results.connection.success ? "default" : "destructive"}>
                      Connection: {results.connection.success ? "Success" : "Failed"}
                    </Badge>
                    {results.connection.error && (
                      <p className="text-red-600 mt-2">{results.connection.error}</p>
                    )}
                  </div>
                )}

                {results.admin && (
                  <div className="mb-4">
                    <Badge variant={results.admin.success ? "default" : "destructive"}>
                      Admin User: {results.admin.success ? "Created" : "Failed"}
                    </Badge>
                    {results.admin.user && (
                      <p className="text-green-600 mt-2">
                        Admin created: {results.admin.user.email}
                      </p>
                    )}
                  </div>
                )}

                {results.newsTest && (
                  <div className="mb-4">
                    <Badge variant={results.newsTest.data ? "default" : "destructive"}>
                      News API: {results.newsTest.data ? "Working" : "Failed"}
                    </Badge>
                    {results.newsTest.data && (
                      <p className="text-green-600 mt-2">
                        Found {results.newsTest.data.length} news articles
                      </p>
                    )}
                  </div>
                )}

                <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
                  {JSON.stringify(results, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  )
}