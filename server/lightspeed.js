// Server-side client for the Lightspeed Retail (X-Series) API.
// The personal token and store domain prefix live only in server/.env —
// never sent to the frontend.

const API_VERSION = '2.0';

const baseUrl = () => {
  const prefix = process.env.LIGHTSPEED_DOMAIN_PREFIX;
  if (!prefix) throw new Error('LIGHTSPEED_DOMAIN_PREFIX is not set in server/.env');
  return `https://${prefix}.retail.lightspeed.app/api/${API_VERSION}`;
};

export const lightspeedFetch = async (path, options = {}) => {
  const token = process.env.LIGHTSPEED_PERSONAL_TOKEN;
  if (!token) throw new Error('LIGHTSPEED_PERSONAL_TOKEN is not set in server/.env');

  const res = await fetch(`${baseUrl()}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers
    }
  });

  const text = await res.text();
  let body;
  try { body = text ? JSON.parse(text) : null; } catch { body = text; }

  if (!res.ok) {
    const message = (body && body.error) || res.statusText || 'Lightspeed request failed';
    const err = new Error(`Lightspeed API ${res.status}: ${message}`);
    err.status = res.status;
    err.body = body;
    throw err;
  }
  return body;
};

export const getRetailer = () => lightspeedFetch('/retailer');
export const getOutlets = () => lightspeedFetch('/outlets');
export const getProducts = (params = '') => lightspeedFetch(`/products${params}`);
