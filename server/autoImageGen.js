// Keeps the Lightspeed catalog's photos filled in automatically. Runs on an
// interval so any product pushed into Lightspeed without a photo — from the
// back office, a POS sync, or a new import — eventually gets a real,
// AI-generated one without anyone having to run the backfill by hand.

import { getProductsMissingImages, uploadProductImage, getAllActiveProducts } from './lightspeed.js';
import { generateProductImage } from './imageGen.js';
import { getImageGenFailures, saveImageGenFailures } from './db.js';

const BATCH_SIZE = 20;
const RETRY_AFTER_MS = 24 * 60 * 60 * 1000; // give a permanently-blocked item a fresh chance daily
const isPermanentFailure = (message) => /safety system|safety_violations/i.test(message || '');

let running = false;

export const autoFillMissingImages = async () => {
  if (running) return { skipped: 'already running' };
  if (!process.env.OPENAI_API_KEY) return { skipped: 'OPENAI_API_KEY not set' };

  running = true;
  try {
    const failures = getImageGenFailures().filter(f => Date.now() - f.failedAt < RETRY_AFTER_MS);
    const failedIds = new Set(failures.map(f => f.id));

    const missing = await getProductsMissingImages();
    const candidates = missing.filter(p => !failedIds.has(p.variantParentId || p.id));
    if (candidates.length === 0) return { processed: 0 };

    const batch = candidates.slice(0, BATCH_SIZE);
    const handledFamilies = new Set();
    const nextFailures = [...failures];
    let succeeded = 0, failed = 0;

    for (const product of batch) {
      const targetId = product.variantParentId || product.id;
      if (handledFamilies.has(targetId)) { succeeded++; continue; }
      try {
        const buffer = await generateProductImage(product);
        await uploadProductImage(targetId, buffer, `${targetId}.png`);
        handledFamilies.add(targetId);
        succeeded++;
      } catch (e) {
        failed++;
        if (isPermanentFailure(e.message)) {
          nextFailures.push({ id: targetId, name: product.name, failedAt: Date.now(), error: e.message });
        }
      }
    }

    saveImageGenFailures(nextFailures);
    await getAllActiveProducts({ force: true }).catch(() => {});

    const result = { processed: batch.length, succeeded, failed, remaining: candidates.length - batch.length };
    console.log('[auto-image-gen]', JSON.stringify(result));
    return result;
  } finally {
    running = false;
  }
};

export const startAutoImageGenLoop = (intervalMs = 30 * 60 * 1000) => {
  const tick = () => autoFillMissingImages().catch(e => console.error('[auto-image-gen] error:', e.message));
  setTimeout(tick, 60 * 1000);
  setInterval(tick, intervalMs);
};
