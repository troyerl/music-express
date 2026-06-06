import { sendError } from './lib/auth.js';
import { isValidEmail, sendContactEmail } from './lib/mail.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { to, fields } = body || {};

    const recipient = String(to || process.env.CONTACT_TO_EMAIL || '').trim();

    if (!isValidEmail(recipient)) {
      return res.status(400).json({ error: 'A valid recipient email is required.' });
    }

    if (!Array.isArray(fields) || fields.length === 0) {
      return res.status(400).json({ error: 'Form fields are required.' });
    }

    await sendContactEmail({ to: recipient, fields });

    return res.status(200).json({ ok: true });
  } catch (error) {
    return sendError(res, error);
  }
}
