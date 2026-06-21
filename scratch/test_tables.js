
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function test() {
  const { data: convs, error: cErr } = await supabase.from("conversations").select("id").limit(1);
  console.log("Conversations exists:", !cErr);
}
test();

