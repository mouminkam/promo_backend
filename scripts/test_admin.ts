import { supabaseAdmin } from './src/config/supabase';

async function test() {
  const fileBuffer = Buffer.from('hello world');
  const { data, error } = await supabaseAdmin.storage
    .from('general')
    .upload('test/hello.txt', fileBuffer, {
      contentType: 'text/plain',
      upsert: true,
    });
  console.log('Upload:', data);
  console.log('Error:', error);
}

test();
