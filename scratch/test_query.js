
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function test() {
  const { data, error, count } = await supabaseAdmin
      .from("offers")
      .select("*, profile:profiles!inner(id, full_name, username, avatar_url, location), category:categories(id, name_ar, name_en, slug)", { count: "exact" })
      .eq("status", "active")
      .range(0, 19)
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false });
  console.log("Error:", error);
}
test();

