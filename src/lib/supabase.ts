import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string

if (!supabaseUrl || supabaseUrl.includes('TODO')) {
	console.warn('⚠️  VITE_SUPABASE_URL not set — add your project URL to .env.local')
}

export const supabase = createClient(supabaseUrl, supabaseKey)
