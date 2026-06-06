import { put } from '@vercel/blob';
import { sendError, verifyAdminRequest } from './lib/auth.js';

function parseDataUrl(dataUrl) {
  const match = String(dataUrl).match(/^data:([^;]+);base64,(.+)$/);

  if (!match) {
    const error = new Error('Invalid image data.');
    error.statusCode = 400;
    throw error;
  }

  return {
    contentType: match[1],
    buffer: Buffer.from(match[2], 'base64'),
  };
}

function safeFilename(name) {
  const base = String(name || 'image.jpg')
    .trim()
    .replace(/[^\w.-]+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);

  return base || 'image.jpg';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  try {
    await verifyAdminRequest(req);

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { dataUrl, name } = body || {};

    if (!dataUrl) {
      return res.status(400).json({ error: 'dataUrl is required.' });
    }

    const { contentType, buffer } = parseDataUrl(dataUrl);
    const filename = safeFilename(name);
    const pathname = `uploads/${Date.now()}-${filename}`;

    const blob = await put(pathname, buffer, {
      access: 'public',
      contentType,
      addRandomSuffix: false,
    });

    return res.status(200).json({
      id: `media-${Date.now()}`,
      name: filename,
      src: blob.url,
    });
  } catch (error) {
    return sendError(res, error);
  }
}
