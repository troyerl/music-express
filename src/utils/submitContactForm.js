function fieldName(field) {
  return field.label.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '') || field.id;
}

function mapFormFields(fields, formData) {
  return fields.map((field) => ({
    label: field.label,
    value: String(formData.get(fieldName(field)) || ''),
  }));
}

function buildWeb3FormsPayload(fields, formData) {
  const mapped = mapFormFields(fields, formData);
  const subjectField = mapped.find((field) => /subject/i.test(field.label));
  const nameField = mapped.find((field) => /name/i.test(field.label));
  const emailField = mapped.find((field) => /email/i.test(field.label));
  const messageField = mapped.find((field) => /message/i.test(field.label));

  const subject = subjectField?.value
    ? subjectField.value
    : nameField?.value
      ? `Website contact from ${nameField.value}`
      : 'Website contact form';

  const text = mapped.map((field) => `${field.label}: ${field.value}`).join('\n');

  return {
    access_key: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY,
    subject,
    name: nameField?.value || 'Website visitor',
    email: emailField?.value || 'no-reply@example.com',
    message: messageField?.value || text,
  };
}

async function submitViaWeb3Forms(fields, formData) {
  const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY?.trim();

  if (!accessKey) {
    throw new Error('Contact form is not configured yet.');
  }

  const response = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(buildWeb3FormsPayload(fields, formData)),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || data.success === false) {
    throw new Error(data.message || 'Form submission failed.');
  }
}

async function submitViaServer(recipientEmail, fields, formData) {
  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to: recipientEmail.trim(),
      fields: mapFormFields(fields, formData),
    }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || 'Form submission failed.');
  }
}

export async function submitContactForm({ block, fields, formData }) {
  if (block.formAction?.trim()) {
    const response = await fetch(block.formAction.trim(), {
      method: 'POST',
      body: formData,
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Form submission failed.');
    }
    return;
  }

  if (import.meta.env.VITE_WEB3FORMS_ACCESS_KEY?.trim()) {
    await submitViaWeb3Forms(fields, formData);
    return;
  }

  if (block.recipientEmail?.trim()) {
    await submitViaServer(block.recipientEmail, fields, formData);
    return;
  }

  throw new Error('Form is not configured with a recipient email.');
}
