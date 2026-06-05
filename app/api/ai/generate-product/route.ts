import type { NextRequest } from 'next/server';

type Tone = 'traditional' | 'modern' | 'minimal';

type Body = {
  imageUrl: string;
  categories?: string[];
  carat?: 92 | 84;
  tone?: Tone;
};

const TONE_GUIDANCE: Record<Tone, string> = {
  traditional: 'Voice: warm, heritage-forward. Invoke craftsmanship, temple motifs, bridal legacy, ceremonial wear. Use evocative adjectives (majestic, regal, ancestral). Sanskrit/Hindi loanwords welcome where accurate.',
  modern:      'Voice: contemporary, confident, clean. Focus on wearability for modern occasions, layering, everyday elegance. Avoid archaic flourish. Use active verbs; keep sentences tight.',
  minimal:     'Voice: quiet luxury, restrained. Short sentences. No superlatives. Focus on silhouette, material, weight. No emojis or exclamations.',
};

type Generated = {
  name: string;
  description: string;
  category: string;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
};

const SYSTEM = `You are a copywriter for Swaminarayan Ornaments, a premium Indian jewelry brand specializing in 22K and 18K gold ornaments (kundan, polki, antique, temple, bridal styles).
Given a product photo, produce catalog metadata in strict JSON matching this TypeScript type:

{
  "name": string,              // 3-7 words, evocative, no pricing
  "description": string,       // 2-3 sentences, warm but refined, highlights craft/stones/occasion
  "category": string,          // MUST be one of the provided categories
  "tags": string[],            // 5-8 lowercase tags: style, stones, occasion, motif
  "seoTitle": string,          // <=60 chars, includes primary keyword + brand tail ok
  "seoDescription": string     // 120-160 chars, compelling, includes key features
}

Return ONLY the JSON object, no prose, no code fences.`;

export async function POST(request: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 });
  }

  let body: Body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!body.imageUrl) {
    return Response.json({ error: 'imageUrl is required' }, { status: 400 });
  }

  const categories = body.categories?.length
    ? body.categories
    : ['Necklaces', 'Bangles', 'Earrings', 'Rings', 'Chains', 'Bracelets', 'Pendants', 'Mangalsutra'];

  const tone: Tone = body.tone ?? 'traditional';
  const userText = `Categories to choose from: ${categories.join(', ')}
Carat: ${body.carat ?? 92} (${body.carat === 84 ? '18K' : '22K'}) gold

${TONE_GUIDANCE[tone]}

Generate metadata for this product.`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-opus-4-6',
      max_tokens: 800,
      system: SYSTEM,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'image', source: { type: 'url', url: body.imageUrl } },
            { type: 'text', text: userText },
          ],
        },
      ],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    return Response.json({ error: 'Claude API error', detail: errText }, { status: 502 });
  }

  const data = await res.json();
  const text: string = data?.content?.[0]?.text ?? '';

  let parsed: Generated;
  try {
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}');
    parsed = JSON.parse(text.slice(jsonStart, jsonEnd + 1));
  } catch {
    return Response.json({ error: 'Failed to parse model output', raw: text }, { status: 502 });
  }

  if (!categories.includes(parsed.category)) {
    parsed.category = categories[0];
  }

  return Response.json(parsed);
}
