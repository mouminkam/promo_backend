
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function test() {
  const { data, error } = await supabase.from("messages").select("*").limit(1);
  if (data && data.length > 0) {
    console.log(Object.keys(data[0]));
  } else if (error) {
    console.error(error);
  } else {
    // try to get columns by throwing an error or inserting
    const { error: insertErr } = await supabase.from("messages").insert({ invalid_column: 1 });
    console.log(insertErr.message);
  }
}
test();

