import { corsHeaders } from '../_shared/cors.ts';
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const { email } = await req.json();

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );

  const {
    data: { users },
  } = await supabaseClient.auth.admin.listUsers();

  const user = users.find((user: any) => user.email === email);

  if (user) {
    await supabaseClient.auth.admin.deleteUser(user.id);
  }

  return new Response(JSON.stringify({ message: 'user deleted' }), {
    status: 200,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });
};

Deno.serve(handler);
