// Server-only database client
// This file uses Node.js modules and should only be imported server-side
import 'server-only';
import { query } from './connection'

/**
 * Database client to replace Supabase functionality
 * Provides similar API to Supabase for easier migration
 */

interface SelectOptions {
  columns?: string
  filter?: Record<string, any>
  order?: { column: string; ascending?: boolean }
  limit?: number
  single?: boolean
}

interface InsertOptions {
  returning?: boolean
}

interface UpdateOptions {
  returning?: boolean
}

class QueryBuilder {
  private tableName: string
  private selectColumns: string = '*'
  private whereConditions: string[] = []
  private whereParams: any[] = []
  private orderByClause: string = ''
  private limitValue: number | null = null
  private isSingleResult: boolean = false

  constructor(table: string) {
    this.tableName = table
  }

  select(columns: string = '*') {
    this.selectColumns = columns
    return this
  }

  eq(column: string, value: any) {
    this.whereConditions.push(`${column} = $${this.whereParams.length + 1}`)
    this.whereParams.push(value)
    return this
  }

  neq(column: string, value: any) {
    this.whereConditions.push(`${column} != $${this.whereParams.length + 1}`)
    this.whereParams.push(value)
    return this
  }

  gt(column: string, value: any) {
    this.whereConditions.push(`${column} > $${this.whereParams.length + 1}`)
    this.whereParams.push(value)
    return this
  }

  gte(column: string, value: any) {
    this.whereConditions.push(`${column} >= $${this.whereParams.length + 1}`)
    this.whereParams.push(value)
    return this
  }

  lt(column: string, value: any) {
    this.whereConditions.push(`${column} < $${this.whereParams.length + 1}`)
    this.whereParams.push(value)
    return this
  }

  lte(column: string, value: any) {
    this.whereConditions.push(`${column} <= $${this.whereParams.length + 1}`)
    this.whereParams.push(value)
    return this
  }

  like(column: string, pattern: string) {
    this.whereConditions.push(`${column} LIKE $${this.whereParams.length + 1}`)
    this.whereParams.push(pattern)
    return this
  }

  ilike(column: string, pattern: string) {
    this.whereConditions.push(`${column} ILIKE $${this.whereParams.length + 1}`)
    this.whereParams.push(pattern)
    return this
  }

  in(column: string, values: any[]) {
    this.whereConditions.push(`${column} = ANY($${this.whereParams.length + 1})`)
    this.whereParams.push(values)
    return this
  }

  is(column: string, value: null | boolean) {
    if (value === null) {
      this.whereConditions.push(`${column} IS NULL`)
    } else {
      this.whereConditions.push(`${column} IS ${value}`)
    }
    return this
  }

  order(column: string, options?: { ascending?: boolean }) {
    const direction = options?.ascending === false ? 'DESC' : 'ASC'
    this.orderByClause = `ORDER BY ${column} ${direction}`
    return this
  }

  limit(count: number) {
    this.limitValue = count
    return this
  }

  single() {
    this.isSingleResult = true
    this.limitValue = 1
    return this
  }

  async execute() {
    let sql = `SELECT ${this.selectColumns} FROM ${this.tableName}`

    if (this.whereConditions.length > 0) {
      sql += ` WHERE ${this.whereConditions.join(' AND ')}`
    }

    if (this.orderByClause) {
      sql += ` ${this.orderByClause}`
    }

    if (this.limitValue) {
      sql += ` LIMIT ${this.limitValue}`
    }

    try {
      const result = await query(sql, this.whereParams)
      
      if (this.isSingleResult) {
        return {
          data: result.rows[0] || null,
          error: null
        }
      }

      return {
        data: result.rows,
        error: null
      }
    } catch (error: any) {
      return {
        data: null,
        error: {
          message: error.message,
          details: error.detail,
          hint: error.hint,
          code: error.code
        }
      }
    }
  }
}

class DatabaseClient {
  from(table: string) {
    return {
      select: (columns: string = '*', options?: { count?: 'exact' | 'planned' | 'estimated'; head?: boolean }) => {
        const builder = new QueryBuilder(table)
        builder.select(columns)
        
        // If head: true is specified, we only want the count, not the actual data
        if (options?.head && options?.count) {
          return {
            then: async (resolve: any, reject: any) => {
              try {
                const countSql = `SELECT COUNT(*) as count FROM ${table}`
                const result = await query(countSql, [])
                resolve({
                  data: null,
                  error: null,
                  count: parseInt(result.rows[0].count, 10)
                })
              } catch (error: any) {
                resolve({
                  data: null,
                  error: {
                    message: error.message,
                    details: error.detail,
                    hint: error.hint,
                    code: error.code
                  },
                  count: null
                })
              }
            }
          }
        }
        
        // Return the builder with all its chaining methods AND the then method for await
        return new Proxy(builder, {
          get(target: any, prop: string) {
            if (prop === 'then') {
              return (resolve: any, reject: any) => target.execute().then(resolve, reject)
            }
            return target[prop]
          }
        })
      },
      
      insert: async (data: any | any[], options?: InsertOptions) => {
        try {
          const records = Array.isArray(data) ? data : [data]
          
          if (records.length === 0) {
            return { data: null, error: { message: 'No data to insert' } }
          }

          const keys = Object.keys(records[0])
          const columns = keys.join(', ')
          
          const valuePlaceholders = records.map((_, recordIndex) => {
            const placeholders = keys.map((_, keyIndex) => `$${recordIndex * keys.length + keyIndex + 1}`)
            return `(${placeholders.join(', ')})`
          }).join(', ')

          const values = records.flatMap(record => keys.map(key => record[key]))

          let sql = `INSERT INTO ${table} (${columns}) VALUES ${valuePlaceholders}`
          
          if (options?.returning !== false) {
            sql += ' RETURNING *'
          }

          const result = await query(sql, values)

          return {
            data: Array.isArray(data) ? result.rows : result.rows[0],
            error: null
          }
        } catch (error: any) {
          return {
            data: null,
            error: {
              message: error.message,
              details: error.detail,
              hint: error.hint,
              code: error.code
            }
          }
        }
      },

      update: (data: Record<string, any>) => {
        return {
          eq: async (column: string, value: any, options?: UpdateOptions) => {
            try {
              const keys = Object.keys(data)
              const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(', ')
              const values = [...keys.map(key => data[key]), value]

              let sql = `UPDATE ${table} SET ${setClause} WHERE ${column} = $${keys.length + 1}`
              
              if (options?.returning !== false) {
                sql += ' RETURNING *'
              }

              const result = await query(sql, values)

              return {
                data: result.rows,
                error: null
              }
            } catch (error: any) {
              return {
                data: null,
                error: {
                  message: error.message,
                  details: error.detail,
                  hint: error.hint,
                  code: error.code
                }
              }
            }
          }
        }
      },

      delete: () => {
        return {
          eq: async (column: string, value: any) => {
            try {
              const sql = `DELETE FROM ${table} WHERE ${column} = $1 RETURNING *`
              const result = await query(sql, [value])

              return {
                data: result.rows,
                error: null
              }
            } catch (error: any) {
              return {
                data: null,
                error: {
                  message: error.message,
                  details: error.detail,
                  hint: error.hint,
                  code: error.code
                }
              }
            }
          }
        }
      }
    }
  }

  // Storage mock (since we won't use Supabase storage)
  storage = {
    from: (bucket: string) => ({
      upload: async (path: string, file: File | Blob) => {
        // This will be handled by file system or other storage solution
        return {
          data: null,
          error: { message: 'Storage functionality needs to be implemented with file system or external service' }
        }
      },
      getPublicUrl: (path: string) => ({
        data: { publicUrl: `/uploads/${path}` }
      })
    })
  }

  // Auth mock for compatibility
  auth = {
    getUser: async () => {
      // This should be replaced with actual JWT session verification
      // For now, return null to force redirect to login
      const { getCurrentUser } = await import('../auth/session')
      const user = await getCurrentUser()
      
      if (user) {
        return {
          data: { user },
          error: null
        }
      }
      
      return {
        data: { user: null },
        error: { message: 'Not authenticated' }
      }
    },
    signOut: async () => {
      const { clearAuthCookies } = await import('../auth/session')
      await clearAuthCookies()
      return { error: null }
    }
  }
}

// Create a singleton instance
let dbClient: DatabaseClient | null = null

export function createClient(): DatabaseClient {
  if (!dbClient) {
    dbClient = new DatabaseClient()
  }
  return dbClient
}
