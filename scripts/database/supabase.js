import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://fqyyoygphuzryhrxspkr.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxeXlveWdwaHV6cnlocnhzcGtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3OTk5ODEsImV4cCI6MjA3MTM3NTk4MX0.DSqZ3JnYGkmPRNWMcHRYwrMvCP7s45gdxHjRmhIVSMo'
export const supabase = createClient(supabaseUrl, supabaseKey)