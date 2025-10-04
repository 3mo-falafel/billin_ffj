// Browser-safe client - only for type compatibility
// All database operations should use server-side functions

interface ChainableQuery {
  select: (columns?: string) => ChainableQuery;
  insert: (data: any) => ChainableQuery;
  update: (data: any) => ChainableQuery;
  delete: () => ChainableQuery;
  eq: (column: string, value: any) => ChainableQuery;
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
  // This is a browser-safe stub that matches the Supabase API
  // All actual database calls should go through API routes or server components
  const createChainableQuery = (): ChainableQuery => {
    const query: ChainableQuery = {
      select: () => query,
      insert: () => query,
      update: () => query,
      delete: () => query,
      eq: () => query,
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
      single: () => Promise.resolve({ data: null, error: { message: 'Client-side database access not supported' } }),
      then: (resolve) => resolve({ data: [], error: null }),
    };
    return query;
  };

  return {
    from: (table: string) => createChainableQuery(),
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: { message: 'Client-side auth not supported' } }),
      signOut: () => Promise.resolve({ error: null }),
    },
  };
}
