// Client-side API utility functions
// Replaces Supabase client with standard fetch API calls

interface ApiResponse<T = any> {
  data: T | null
  error: { message: string } | null
}

class ApiClient {
  private baseUrl: string

  constructor() {
    this.baseUrl = '/api'
  }

  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      })

      const result = await response.json()

      if (!response.ok) {
        return {
          data: null,
          error: { message: result.error || 'An error occurred' }
        }
      }

      return {
        data: result.data || result,
        error: null
      }
    } catch (error: any) {
      return {
        data: null,
        error: { message: error.message || 'Network error' }
      }
    }
  }

  // News API methods
  news = {
    getAll: (params?: { limit?: number; featured?: boolean; active?: boolean }) => {
      const searchParams = new URLSearchParams()
      if (params?.limit) searchParams.set('limit', params.limit.toString())
      if (params?.featured !== undefined) searchParams.set('featured', params.featured.toString())
      if (params?.active !== undefined) searchParams.set('active', params.active.toString())
      
      const query = searchParams.toString()
      return this.request(`/news${query ? `?${query}` : ''}`)
    },

    getById: (id: string) => {
      return this.request(`/news/${id}`)
    },

    create: (data: any) => {
      return this.request('/news', {
        method: 'POST',
        body: JSON.stringify(data)
      })
    },

    update: (id: string, data: any) => {
      return this.request(`/news/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      })
    },

    delete: (id: string) => {
      return this.request(`/news/${id}`, {
        method: 'DELETE'
      })
    }
  }

  // Gallery API methods
  gallery = {
    getAll: (params?: { limit?: number; category?: string; media_type?: string; active?: boolean }) => {
      const searchParams = new URLSearchParams()
      if (params?.limit) searchParams.set('limit', params.limit.toString())
      if (params?.category) searchParams.set('category', params.category)
      if (params?.media_type) searchParams.set('media_type', params.media_type)
      if (params?.active !== undefined) searchParams.set('active', params.active.toString())
      
      const query = searchParams.toString()
      return this.request(`/gallery${query ? `?${query}` : ''}`)
    },

    getById: (id: string) => {
      return this.request(`/gallery/${id}`)
    },

    create: (data: any) => {
      return this.request('/gallery', {
        method: 'POST',
        body: JSON.stringify(data)
      })
    },

    update: (id: string, data: any) => {
      return this.request(`/gallery/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      })
    },

    delete: (id: string) => {
      return this.request(`/gallery/${id}`, {
        method: 'DELETE'
      })
    }
  }

  // Activities API methods
  activities = {
    getAll: (params?: { limit?: number; active?: boolean }) => {
      const searchParams = new URLSearchParams()
      if (params?.limit) searchParams.set('limit', params.limit.toString())
      if (params?.active !== undefined) searchParams.set('active', params.active.toString())
      
      const query = searchParams.toString()
      return this.request(`/activities${query ? `?${query}` : ''}`)
    },

    getById: (id: string) => {
      return this.request(`/activities/${id}`)
    },

    create: (data: any) => {
      return this.request('/activities', {
        method: 'POST',
        body: JSON.stringify(data)
      })
    },

    update: (id: string, data: any) => {
      return this.request(`/activities/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      })
    },

    delete: (id: string) => {
      return this.request(`/activities/${id}`, {
        method: 'DELETE'
      })
    }
  }

  // Scholarships API methods
  scholarships = {
    getAll: (params?: { limit?: number; category?: string; active?: boolean }) => {
      const searchParams = new URLSearchParams()
      if (params?.limit) searchParams.set('limit', params.limit.toString())
      if (params?.category) searchParams.set('category', params.category)
      if (params?.active !== undefined) searchParams.set('active', params.active.toString())
      
      const query = searchParams.toString()
      return this.request(`/scholarships${query ? `?${query}` : ''}`)
    },

    getById: (id: string) => {
      return this.request(`/scholarships/${id}`)
    },

    create: (data: any) => {
      return this.request('/scholarships', {
        method: 'POST',
        body: JSON.stringify(data)
      })
    },

    update: (id: string, data: any) => {
      return this.request(`/scholarships/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      })
    },

    delete: (id: string) => {
      return this.request(`/scholarships/${id}`, {
        method: 'DELETE'
      })
    }
  }

  // Projects API methods
  projects = {
    getAll: (params?: { limit?: number; status?: string; featured?: boolean; active?: boolean }) => {
      const searchParams = new URLSearchParams()
      if (params?.limit) searchParams.set('limit', params.limit.toString())
      if (params?.status) searchParams.set('status', params.status)
      if (params?.featured !== undefined) searchParams.set('featured', params.featured.toString())
      if (params?.active !== undefined) searchParams.set('active', params.active.toString())
      
      const query = searchParams.toString()
      return this.request(`/projects${query ? `?${query}` : ''}`)
    },

    getById: (id: string) => {
      return this.request(`/projects/${id}`)
    },

    create: (data: any) => {
      return this.request('/projects', {
        method: 'POST',
        body: JSON.stringify(data)
      })
    },

    update: (id: string, data: any) => {
      return this.request(`/projects/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      })
    },

    delete: (id: string) => {
      return this.request(`/projects/${id}`, {
        method: 'DELETE'
      })
    }
  }

  // Homepage Gallery API methods
  homepageGallery = {
    getAll: (params?: { active?: boolean }) => {
      const searchParams = new URLSearchParams()
      if (params?.active !== undefined) searchParams.set('active', params.active.toString())
      
      const query = searchParams.toString()
      return this.request(`/homepage-gallery${query ? `?${query}` : ''}`)
    },

    create: (data: any) => {
      return this.request('/homepage-gallery', {
        method: 'POST',
        body: JSON.stringify(data)
      })
    },

    update: (id: string, data: any) => {
      return this.request(`/homepage-gallery/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      })
    },

    delete: (id: string) => {
      return this.request(`/homepage-gallery/${id}`, {
        method: 'DELETE'
      })
    }
  }

  // Generic table methods (for backward compatibility with Supabase-like syntax)
  from(table: string) {
    return {
      select: (columns: string = '*') => ({
        eq: async (column: string, value: any) => {
          // This is a simplified implementation
          // You would need to extend this for all the query methods
          return this.request(`/${table}?${column}=${value}`)
        },
        // Add more query methods as needed
        then: (resolve: any, reject: any) => {
          return this.request(`/${table}`).then(resolve, reject)
        }
      }),

      insert: async (data: any) => {
        return this.request(`/${table}`, {
          method: 'POST',
          body: JSON.stringify(data)
        })
      },

      update: (data: any) => ({
        eq: async (column: string, value: any) => {
          return this.request(`/${table}/${value}`, {
            method: 'PUT',
            body: JSON.stringify(data)
          })
        }
      }),

      delete: () => ({
        eq: async (column: string, value: any) => {
          return this.request(`/${table}/${value}`, {
            method: 'DELETE'
          })
        }
      })
    }
  }

  // News Ticker specific methods
  news_ticker = {
    select: (columns = '*') => ({
      order: (column: string, options?: { ascending?: boolean }) => ({
        execute: async () => {
          try {
            const response = await this.request('/news-ticker')
            const items = response.data || []
            
            // Sort if needed
            if (column && options) {
              items.sort((a: any, b: any) => {
                const aVal = a[column]
                const bVal = b[column]
                const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
                return options.ascending === false ? -comparison : comparison
              })
            }
            
            return { data: items, error: null }
          } catch (error) {
            return { data: null, error }
          }
        }
      })
    }),
    insert: (data: any[]) => ({
      execute: async () => {
        try {
          if (data.length === 1) {
            const response = await this.request('/news-ticker', {
              method: 'POST',
              body: JSON.stringify(data[0])
            })
            return { data: response.data, error: null }
          } else {
            // Handle multiple inserts if needed
            const results = await Promise.all(
              data.map(item => this.request('/news-ticker', {
                method: 'POST', 
                body: JSON.stringify(item)
              }))
            )
            return { data: results.map(r => r.data), error: null }
          }
        } catch (error) {
          return { data: null, error }
        }
      }
    }),
    update: (data: any) => ({
      eq: (column: string, value: any) => ({
        execute: async () => {
          try {
            const response = await this.request(`/news-ticker/${value}`, {
              method: 'PUT',
              body: JSON.stringify(data)
            })
            return { data: response.data, error: null }
          } catch (error) {
            return { data: null, error }
          }
        }
      })
    }),
    delete: () => ({
      eq: (column: string, value: any) => ({
        execute: async () => {
          try {
            await this.request(`/news-ticker/${value}`, {
              method: 'DELETE'
            })
            return { error: null }
          } catch (error) {
            return { error }
          }
        }
      })
    })
  }

  // Auth methods (placeholder - would need to implement based on your auth system)
  auth = {
    getUser: async () => {
      // This would check if user is authenticated
      // For now, return null to maintain compatibility
      return { data: { user: null }, error: null }
    },
    signOut: async () => {
      // Implement sign out logic
      return { error: null }
    }
  }
}

// Create and export a singleton instance
const apiClient = new ApiClient()

export function createClient() {
  return apiClient
}

// For compatibility with existing code
export default apiClient