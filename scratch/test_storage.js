
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function test() {
  const { data, error } = await supabase.storage.from("general").upload("test.txt", "hello world", { upsert: true });
  console.log("Upload Result:", data);
  console.log("Upload Error:", error);
}

test();

