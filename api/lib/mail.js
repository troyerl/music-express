function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
}

export function buildContactEmail(fields) {
  const sanitized = fields
    .filter((field) => field?.label)
    .map((field) => ({
      label: String(field.label).slice(0, 100),
      value: String(field.value || '').slice(0, 5000),
    }));

  const subjectField = sanitized.find((field) => /subject/i.test(field.label));
  const nameField = sanitized.find((field) => /name/i.test(field.label));
  const emailField = sanitized.find((field) => /email/i.test(field.label));

  const subject = subjectField?.value
    ? String(subjectField.value).slice(0, 200)
    : nameField?.value
      ? `Website contact from ${nameField.value}`.slice(0, 200)
      : 'Website contact form';

  const text = sanitized.map((field) => `${field.label}: ${field.value}`).join('\n');
  const replyTo =
    emailField?.value && isValidEmail(emailField.value) ? emailField.value.trim() : undefined;

  return { subject, text, replyTo, sanitized, nameField, emailField };
}

async function sendViaWeb3Forms({ subject, text, replyTo, sanitized }) {
  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;

  if (!accessKey) {
    const error = new Error('Web3Forms is not configured. Set WEB3FORMS_ACCESS_KEY.');
    error.statusCode = 503;
    throw error;
  }

  const nameField = sanitized.find((field) => /name/i.test(field.label));
  const emailField = sanitized.find((field) => /email/i.test(field.label));
  const messageField = sanitized.find((field) => /message/i.test(field.label));

  const payload = {
    access_key: accessKey,
    subject,
    name: nameField?.value || 'Website visitor',
    email: replyTo || emailField?.value || 'no-reply@example.com',
    message: messageField?.value || text,
  };

  const response = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || data.success === false) {
    const error = new Error(data.message || 'Failed to send email.');
    error.statusCode = 502;
    throw error;
  }
}

async function sendViaResend({ to, subject, text, replyTo }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !from) {
    const error = new Error('Resend is not configured. Set RESEND_API_KEY and CONTACT_FROM_EMAIL.');
    error.statusCode = 503;
    throw error;
  }

  const payload = {
    from,
    to: [to],
    subject,
    text,
  };

  if (replyTo) {
    payload.reply_to = replyTo;
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    const error = new Error(data.message || 'Failed to send email.');
    error.statusCode = 502;
    throw error;
  }
}

async function sendViaSmtp({ to, subject, text, replyTo }) {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    const error = new Error('SMTP is not configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASS.');
    error.statusCode = 503;
    throw error;
  }

  const nodemailer = await import('nodemailer');
  const transporter = nodemailer.default.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user, pass },
  });

  await transporter.sendMail({
    from: process.env.CONTACT_FROM_EMAIL || user,
    to,
    subject,
    text,
    replyTo,
  });
}

export async function sendContactEmail({ to, fields }) {
  const emailContent = buildContactEmail(fields);

  if (process.env.WEB3FORMS_ACCESS_KEY) {
    await sendViaWeb3Forms(emailContent);
    return;
  }

  const { subject, text, replyTo } = emailContent;

  if (process.env.RESEND_API_KEY) {
    await sendViaResend({ to, subject, text, replyTo });
    return;
  }

  if (process.env.SMTP_HOST) {
    await sendViaSmtp({ to, subject, text, replyTo });
    return;
  }

  const error = new Error(
    'Contact form email is not configured. Add WEB3FORMS_ACCESS_KEY (free) or another email provider in Vercel.',
  );
  error.statusCode = 503;
  throw error;
}

export { isValidEmail };
