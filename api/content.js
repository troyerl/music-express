import { readStoredContent, writeStoredContent } from './lib/contentStore.js';
import { sendError, verifyAdminRequest } from './lib/auth.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const content = await readStoredContent();

      if (!content) {
        return res.status(404).json({ error: 'No published content yet.' });
      }

      return res.status(200).json(content);
    } catch (error) {
      return sendError(res, error);
    }
  }

  if (req.method === 'PUT') {
    try {
      await verifyAdminRequest(req);

      const content = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

      if (!content || typeof content !== 'object') {
        return res.status(400).json({ error: 'Content body must be a JSON object.' });
      }

      await writeStoredContent(content);
      return res.status(200).json({ ok: true });
    } catch (error) {
      return sendError(res, error);
    }
  }

  res.setHeader('Allow', 'GET, PUT');
  return res.status(405).json({ error: 'Method not allowed.' });
}
