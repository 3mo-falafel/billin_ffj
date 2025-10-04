// Server-side database client - Only use in Server Components and API Routes
import 'server-only';

export { createClient } from '../db/client'
export { query, transaction } from '../db/connection'
