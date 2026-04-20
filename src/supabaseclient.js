import { createClient } from "@supabase/supabase-js";
import supabase from "../supabaseClient.js";
 
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
 
export const supabase = createClient(supabaseUrl, supabaseKey);