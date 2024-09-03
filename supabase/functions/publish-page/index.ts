import { corsHeaders } from '../_shared/cors.ts';
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const { pageId } = await req.json();
  const [id, locale] = pageId.split('-locale-');
  const supabaseClient = createClient(Deno.env.get('URL') ?? '', Deno.env.get('SERVICE_ROLE') ?? '');

  const { error, data } = await supabaseClient
    .from('pages')
    .select('id, blocks_dev, seo, status')
    .eq('id', id)
    .limit(1);

  if (error) throw error;

  const { error: updateError, data: updateData } = await supabaseClient
    .from('pages')
    .update({ blocks: data[0].blocks_dev, status: { ...data[0]?.status, [locale]: 'Publish' } })
    .eq('id', id)
    .select();
  if (updateError) throw updateError;

  return new Response(JSON.stringify({ ...updateData }), {
    status: 200,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });
};

Deno.serve(handler);
