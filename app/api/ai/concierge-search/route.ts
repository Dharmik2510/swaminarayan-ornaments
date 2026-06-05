import type { NextRequest } from 'next/server';
import type { ProductSummary, ConciergeResult } from '@/lib/data';

type Body = {
  query: string;
  products: ProductSummary[];
};

const SYSTEM = `You are an internal search engine for Swaminarayan Ornaments, a premium Indian gold jewelry brand. Given a customer's natural-language description and a catalog of products, return the best matches.

Rules:
- Return STRICT JSON matching this shape (no prose, no code fences):
  { "matchIds": string[], "caption": string, "understood": { "category"?: string, "carat"?: 92 | 84, "vibe"?: string } }
- matchIds: up to 12 product IDs from the provided list, ranked best-to-worst. Only include genuinely relevant matches. Never invent IDs.
- caption: a single short italic-style phrase (8 words max) describing what you understood. Never say "I think", "You might like", or use promotional words like "exquisite", "stunning", "gorgeous", "beautiful", "perfect".
- understood: structured interpretation of the query for optional display.
- If the query is nonsense or nothing matches, return empty matchIds and caption "No pieces matched — try describing the occasion or style".
- Never invent product details, pricing, or claims about materials/gemstones not present in the provided data.
- Only match products from the provided list. Never fabricate product IDs.`;

export async function POST(request: NextRequest): Promise<Response> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: 'AI search unavailable' },
      { status: 503 }
    );
  }

  let body: Body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!body.query?.trim() || !Array.isArray(body.products)) {
    return Response.json(
      { error: 'query (string) and products (array) are required' },
      { status: 400 }
    );
  }

  const catalog = body.products
    .map(
      (p) =>
        `ID:${p.id} | ${p.name} | ${p.category} | ${p.carat}K | tags:${p.tags.join(',')} | ${p.description.slice(0, 200)}`
    )
    .join('\n');

  const validIds = new Set(body.products.map((p) => p.id));

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    signal: AbortSignal.timeout(10000),
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 400,
      system: SYSTEM,
      messages: [
        {
          role: 'user',
          content: `Customer query: "${body.query}"\n\nProduct catalog:\n${catalog}`,
        },
      ],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error('Concierge search API error:', errText);
    return Response.json({ error: 'Search service error' }, { status: 502 });
  }

  const data = await res.json();
  const text: string = data?.content?.[0]?.text ?? '';

  let parsed: ConciergeResult;
  try {
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}');
    if (jsonStart === -1 || jsonEnd === -1) throw new Error('No JSON found');
    parsed = JSON.parse(text.slice(jsonStart, jsonEnd + 1));
  } catch {
    console.error('Concierge search parse error:', text);
    return Response.json({ error: 'Failed to parse search results' }, { status: 502 });
  }

  // Validate matchIds — filter out any hallucinated IDs
  parsed.matchIds = (parsed.matchIds ?? []).filter((id) => validIds.has(id));

  // Ensure caption exists
  if (!parsed.caption) {
    parsed.caption = parsed.matchIds.length > 0
      ? 'Matching pieces'
      : 'No pieces matched — try describing the occasion or style';
  }

  return Response.json(parsed);
}
