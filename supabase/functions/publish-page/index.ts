import { corsHeaders } from '../_shared/cors.ts';
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
import { sendEmail } from '../_shared/utils.ts';

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const { pageId } = await req.json();
  const [id, locale] = pageId.split('-locale-');
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );

  const { error, data } = await supabaseClient
    .from('pages')
    .select('id, blocks_dev, seo, name, slug, status, author(*)')
    .eq('id', id)
    .limit(1);

  if (error) throw error;

  const { error: updateError, data: updateData } = await supabaseClient
    .from('pages')
    .update({ blocks: data[0].blocks_dev, status: { ...data[0]?.status, [locale]: 'Publish' } })
    .eq('id', id);

  if (updateError) throw updateError;

  await sendEmail({
    emails: [data[0].author.email],
    from: 'noreply@visiocms.com',
    body: `Your changes for the below page have been published <br/> <b>name</b> : ${data[0].name}<br/><b>slug</b> : ${data[0].slug}<br/><b>Locale</b> : ${locale}`,
    subject: `Your changes have been published`,
  });

  return new Response(JSON.stringify({ ...updateData }), {
    status: 200,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });
};

Deno.serve(handler);
