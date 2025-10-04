// Browser-safe client - only for type compatibility
// All database operations should use server-side functions

export function createClient() {
  // This is a browser-safe stub that matches the Supabase API
  // All actual database calls should go through API routes
  return {
    from: (table: string) => ({
      select: () => Promise.resolve({ data: [], error: null }),
      insert: () => Promise.resolve({ data: null, error: null }),
      update: () => Promise.resolve({ data: null, error: null }),
      delete: () => Promise.resolve({ data: null, error: null }),
    }),
  };
}
