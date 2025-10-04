// Server-only database client
// This file should only be imported in Server Components, API routes, and Server Actions

import { createClient as createDbClient } from './client';

export function createClient() {
  return createDbClient();
}

// Re-export for convenience
export { query, transaction } from './connection';
