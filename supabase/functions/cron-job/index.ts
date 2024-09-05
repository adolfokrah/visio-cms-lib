import * as postgres from 'https://deno.land/x/postgres@v0.17.0/mod.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { dateToCron } from '../_shared/utils.ts';

// Get the connection string from the environment variable "SUPABASE_DB_URL"
const databaseUrl = Deno.env.get('SUPABASE_DB_URL')!;
const projectUrl = Deno.env.get('SUPABASE_URL')!;
const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
// Create a database pool with three connections that are lazily established
const pool = new postgres.Pool(databaseUrl, 3, true);

Deno.serve(async (req: Request): Promise<Response> => {
  try {
    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders });
    }

    const { action, name, date } = await req.json();

    // Grab a connection from the pool
    const connection = await pool.connect();

    try {
      // Run a query
      const cron_expression = dateToCron(new Date(date));

      const results = await connection.queryObject`select * from cron.job where jobname = ${name}`;

      let query = '';
      if (action === 'CREATE') {
        query = `select cron.schedule (
          '${name}',
          '${cron_expression}',
          $$ select net.http_post(
          url:='${projectUrl}/functions/v1/publish-page',
          headers:='{"Content-Type": "application/json", "Authorization": "Bearer ${anonKey}"}'::jsonb,
          body:=concat('{"pageId":"${name}"}')::jsonb
      ) as request_id; $$
      )`;
      } else if (results?.rows.length > 0) {
        query = `select cron.unschedule('${name}')`;
      }

      const { error } = await connection.queryObject(query);

      if (error) throw error;
      // Return the response with the correct content type header
      return new Response(JSON.stringify({ message: action === 'CREATE' ? 'job_scheduled' : 'job_removed' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' },
      });
    } finally {
      // Release the connection back into the pool
      connection.release();
    }
  } catch (err) {
    return new Response(String(err?.message ?? err), { status: 500 });
  }
});
