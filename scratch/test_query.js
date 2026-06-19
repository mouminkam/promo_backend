
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function test() {
  const { data, error } = await supabase
    .from("profiles")
    .select("*, categories(id, name_ar, name_en, slug, icon_url)")
    .eq("id", "985b241b-d0ec-477e-b103-2c1083498633")
    .single();

  console.log("Data:", data);
  console.log("Error:", error);
}

test();

