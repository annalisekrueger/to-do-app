import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cofvihilvhitepuwyahw.supabase.co'; // Replace this
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNvZnZpaGlsdmhpdGVwdXd5YWh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzNjM1NDMsImV4cCI6MjA2NzkzOTU0M30.LRo6-E1sIP-SY9fZWeyR9WaL67kwFYsFLARMIF7MIdo'; // Replace this

export const supabase = createClient(supabaseUrl, supabaseKey);