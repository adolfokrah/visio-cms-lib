type Page = {
  id: string;
  name: string;
  slug: string;
};

type MatchResult = {
  page: Page;
  params: { [key: string]: string };
} | null;

export function matchSlug(slug: string, pages: Page[]): MatchResult {
  // Normalize the slug by removing any trailing slashes
  const normalizedSlug = slug.endsWith('/') ? slug.slice(0, -1) : slug;

  // First, check for an exact match
  const exactMatch = pages.find((page) => page.slug === normalizedSlug);
  if (exactMatch) return { page: exactMatch, params: {} };

  // If no exact match, look for a pattern match
  for (const page of pages) {
    const pageParts = page.slug.split('/');
    const slugParts = normalizedSlug.split('/');

    if (pageParts.length !== slugParts.length) continue;

    let isMatch = true;
    const params: { [key: string]: string } = {};

    for (let i = 0; i < pageParts.length; i++) {
      if (pageParts[i].startsWith(':')) {
        // It's a parameter, so capture its value
        const paramName = pageParts[i].slice(1);
        params[paramName] = slugParts[i];
      } else if (pageParts[i] !== slugParts[i]) {
        // If parts don't match, it's not a match
        isMatch = false;
        break;
      }
    }

    if (isMatch) return { page, params };
  }

  // If no match is found
  return null;
}

export function dateToCron(date: string) {
  const jsDate = new Date(date);

  const minutes = jsDate.getUTCMinutes();
  const hours = jsDate.getUTCHours();
  const dayOfMonth = jsDate.getUTCDate();
  const month = jsDate.getUTCMonth() + 1; // Cron months are 1-based (January is 1, December is 12)
  const dayOfWeek = '*'; // Set to '*' because it's not relevant for a specific date

  // Generate the cron expression
  const cronExpression = `${minutes} ${hours} ${dayOfMonth} ${month} ${dayOfWeek}`;

  return cronExpression;
}

export async function sendEmail({
  emails,
  from,
  body,
  subject,
}: {
  emails: string[];
  from: string;
  body: string;
  subject: string;
}) {
  try {
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    const payload = emails.map((email: string) => ({
      from,
      to: [email],
      subject,
      html: body,
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
    return data;
  } catch (e) {
    throw e;
  }
}
