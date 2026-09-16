// Generates a product photo from a product's name/category/description using
// OpenAI's image API. Used to fill in Lightspeed catalog items that have no
// photo yet — the key lives only in server/.env, never sent to the frontend.

// gpt-image-1 defaults to its priciest "auto" quality tier (~$0.167/image) —
// gpt-image-1-mini at low/medium quality is 10-30x cheaper and plenty sharp
// for catalog thumbnails. gpt-image-1 is also being retired on 2026-10-23.
const DEFAULT_MODEL = 'gpt-image-1-mini';
const DEFAULT_QUALITY = 'low';

const buildPrompt = (product) => {
  const bits = [`Professional e-commerce product photo of ${product.name}`];
  if (product.brand) bits.push(`by ${product.brand}`);
  bits.push(`(category: ${product.cat})`);
  if (product.description) bits.push(`Details: ${product.description}.`);
  bits.push('Centered on a plain white seamless background, soft studio lighting, sharp focus, photorealistic, no people, no text, no watermark, no logo.');
  return bits.join(' ');
};

export const generateProductImage = async (product, { model = DEFAULT_MODEL, quality = DEFAULT_QUALITY } = {}) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY is not set in server/.env');

  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      prompt: buildPrompt(product),
      size: '1024x1024',
      quality,
      n: 1
    })
  });

  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const message = body?.error?.message || res.statusText || 'OpenAI image generation failed';
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }

  const b64 = body?.data?.[0]?.b64_json;
  if (!b64) throw new Error('OpenAI returned no image data');
  return Buffer.from(b64, 'base64');
};
