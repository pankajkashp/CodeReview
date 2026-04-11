import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://oibjcvvjbvututhfbadm.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9pYmpjdnZqYnZ1dHV0aGZiYWRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4Njg1MDMsImV4cCI6MjA5MTQ0NDUwM30.HL2ibx9eGW3xhEI-kbUI13epjxIjErcBNkPOjn9OBlg";

export const supabase = createClient(supabaseUrl, supabaseKey);