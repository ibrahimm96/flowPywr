// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fviwfijutygubzeevwpa.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2aXdmaWp1dHlndWJ6ZWV2d3BhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU5ODE0MTMsImV4cCI6MjA2MTU1NzQxM30.oBSNaWbojtNsDvpchzL0W23pAlAMB96BX-4rQ6PZBJk'

export const supabase = createClient(supabaseUrl, supabaseKey)
