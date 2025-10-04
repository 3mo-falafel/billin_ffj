// Browser-safe client - Uses server actions for database operations
import { insertRecord, updateRecord, deleteRecord } from '@/app/admin/actions'

interface ChainableQuery {
  select: (columns?: string) => ChainableQuery;
  insert: (data: any) => Promise<{ data: any; error: any }>;
  update: (data: any) => ChainableQuery;
  delete: () => ChainableQuery;
  eq: (column: string, value: any) => Promise<{ data: any; error: any }>;
  neq: (column: string, value: any) => ChainableQuery;
  gt: (column: string, value: any) => ChainableQuery;
  gte: (column: string, value: any) => ChainableQuery;
  lt: (column: string, value: any) => ChainableQuery;
  lte: (column: string, value: any) => ChainableQuery;
  like: (column: string, pattern: string) => ChainableQuery;
  ilike: (column: string, pattern: string) => ChainableQuery;
  in: (column: string, values: any[]) => ChainableQuery;
  is: (column: string, value: any) => ChainableQuery;
  order: (column: string, options?: { ascending?: boolean }) => ChainableQuery;
  limit: (count: number) => ChainableQuery;
  single: () => Promise<{ data: any; error: any }>;
  then: (resolve: (value: { data: any; error: any }) => any, reject?: (reason: any) => any) => Promise<any>;
}

export function createClient() {
  const createChainableQuery = (table: string): ChainableQuery => {
    let operation: 'insert' | 'update' | 'delete' | null = null;
    let updateData: any = null;
    let deleteId: string | null = null;

    const query: ChainableQuery = {
      select: () => query,
      insert: async (data: any) => {
        // Call server action for insert
        const records = Array.isArray(data) ? data : [data]
        const result = await insertRecord(table, records[0])
        
        if (result.success) {
          return { data: result.data, error: null }
        } else {
          return { data: null, error: { message: result.error } }
        }
      },
      update: (data: any) => {
        operation = 'update'
        updateData = data
        return query
      },
      delete: () => {
        operation = 'delete'
        return query
      },
      eq: async (column: string, value: any) => {
        if (operation === 'update' && updateData) {
          // Call server action for update
          const result = await updateRecord(table, value, updateData)
          
          if (result.success) {
            return { data: result.data, error: null }
          } else {
            return { data: null, error: { message: result.error } }
          }
        } else if (operation === 'delete') {
          // Call server action for delete
          const result = await deleteRecord(table, value)
          
          if (result.success) {
            return { data: null, error: null }
          } else {
            return { data: null, error: { message: result.error } }
          }
        }
        
        return { data: null, error: { message: 'Unsupported operation' } }
      },
      neq: () => query,
      gt: () => query,
      gte: () => query,
      lt: () => query,
      lte: () => query,
      like: () => query,
      ilike: () => query,
      in: () => query,
      is: () => query,
      order: () => query,
      limit: () => query,
      single: () => Promise.resolve({ data: null, error: { message: 'Single select not yet implemented on client' } }),
      then: (resolve) => resolve({ data: [], error: null }),
    };
    return query;
  };

  return {
    from: (table: string) => createChainableQuery(table),
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: { message: 'Client-side auth not supported' } }),
      signOut: () => Promise.resolve({ error: null }),
    },
  };
}
