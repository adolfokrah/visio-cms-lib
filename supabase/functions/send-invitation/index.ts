import { corsHeaders } from '../_shared/cors.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const { emails, from, invitationLInk, siteUrl } = await req.json();

  const payload = emails.map((email: string) => ({
    from,
    to: [email],
    subject: 'You have been invited',
    html: `<h2>You have been invited</h2>

<p>You have been invited to create a user on ${siteUrl}. Follow this link to accept the invite:</p>
<p><a href="${invitationLInk}&e=${btoa(email)}">Accept the invite</a></p>`,
  }));

  const res = await fetch('https://api.resend.com/emails/batch', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });
};

Deno.serve(handler);
