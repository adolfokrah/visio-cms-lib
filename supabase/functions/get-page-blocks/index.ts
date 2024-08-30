import { corsHeaders } from '../_shared/cors.ts';
import { matchSlug } from '../_shared/utils.ts';
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const handler = async (req: Request): Promise<Response> => {
  try {
    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders });
    }

    const { slug, locale } = await req.json();

    const supabaseClient = createClient(Deno.env.get('URL') ?? '', Deno.env.get('SERVICE_ROLE') ?? '');
    const { error, data } = await supabaseClient.from('pages').select('slug, id, name').eq('status', 'Publish');
    if (error) {
      throw error;
    }
    const foundPage = matchSlug(slug, data);
    const { error: pageError, data: pageData } = await supabaseClient
      .from('pages')
      .select('*')
      .eq('slug', foundPage?.page?.slug)
      .limit(1);

    if (pageData.length === 0) {
      return new Response(null, {
        status: 404,
        statusText: 'Not Found',
        headers: corsHeaders,
      });
    }

    if (error) throw pageError;

    const pageBlocks = pageData[0]?.blocks[locale];

    const { error: configurationError, data: projectConfiguration } = await supabaseClient
      .from('project_configuration')
      .select('global_blocks, theme')
      .limit(1);

    if (configurationError) throw configurationError;

    return new Response(
      JSON.stringify({
        pageBlocks: [...pageBlocks],
        projectConfiguration: {
          globalBlocks: projectConfiguration[0].global_blocks,
          theme: projectConfiguration[0].theme,
        },
        params: { ...foundPage?.params, locale },
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    return new Response(null, {
      status: 500,
      statusText: 'Internal Server Error',
      headers: corsHeaders,
    });
  }
};

Deno.serve(handler);
