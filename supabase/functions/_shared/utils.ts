type Page = {
  id: string;
  name: string;
  slug: string;
};

export function matchSlug(slug: string, pages: Page[]): Page | null {
  // Normalize the slug by removing any trailing slashes
  const normalizedSlug = slug.endsWith('/') ? slug.slice(0, -1) : slug;

  // First, check for an exact match
  const exactMatch = pages.find((page) => page.slug === normalizedSlug);
  if (exactMatch) return exactMatch;

  // If no exact match, look for a pattern match
  for (const page of pages) {
    const pageParts = page.slug.split('/');
    const slugParts = normalizedSlug.split('/');

    if (pageParts.length !== slugParts.length) continue;

    let isMatch = true;
    for (let i = 0; i < pageParts.length; i++) {
      if (pageParts[i].startsWith(':')) {
        // It's a parameter, so continue
        continue;
      } else if (pageParts[i] !== slugParts[i]) {
        // If parts don't match, it's not a match
        isMatch = false;
        break;
      }
    }

    if (isMatch) return page;
  }

  // If no match is found
  return null;
}
