import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

let clientInstance: ReturnType<typeof createSupabaseClient> | null = null

export function createClient() {
  if (clientInstance) return clientInstance
  
  clientInstance = createSupabaseClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
  
  return clientInstance
}
