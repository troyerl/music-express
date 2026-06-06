import { useState } from 'react';
import { submitContactForm } from '../utils/submitContactForm';
import './FormBlock.css';

function fieldName(field) {
  return field.label.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '') || field.id;
}

function getSelectOptions(field) {
  return (field.options || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

export default function FormBlock({ block }) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fields = block.fields || [];

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      await submitContactForm({ block, fields, formData });

      setSubmitted(true);
      form.reset();
    } catch (submitError) {
      setError(
        submitError.message === 'Form submission failed.'
          ? 'We could not send your message. Please call us instead.'
          : submitError.message || 'We could not send your message. Please call us instead.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="content-block content-form content-form-success">
        <p>{block.successMessage || 'Thank you for contacting us!'}</p>
        <button type="button" className="btn btn-gray content-form-reset" onClick={() => setSubmitted(false)}>
          Send another message
        </button>
      </div>
    );
  }

  return (
    <div className="content-block content-form">
      {block.intro && <p className="content-form-intro">{block.intro}</p>}

      <form className="content-form-fields" onSubmit={handleSubmit}>
        {fields.map((field) => {
          const name = fieldName(field);
          const label = (
            <label className="content-form-label" htmlFor={field.id}>
              {field.label}
              {field.required && <span className="content-form-required"> *</span>}
            </label>
          );

          if (field.type === 'textarea') {
            return (
              <div key={field.id} className="content-form-field">
                {label}
                <textarea
                  id={field.id}
                  name={name}
                  rows={5}
                  required={field.required}
                  placeholder={field.placeholder || ''}
                />
              </div>
            );
          }

          if (field.type === 'select') {
            const options = getSelectOptions(field);
            return (
              <div key={field.id} className="content-form-field">
                {label}
                <select id={field.id} name={name} required={field.required} defaultValue="">
                  <option value="" disabled>
                    Select...
                  </option>
                  {options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            );
          }

          return (
            <div key={field.id} className="content-form-field">
              {label}
              <input
                id={field.id}
                name={name}
                type={field.type || 'text'}
                required={field.required}
                placeholder={field.placeholder || ''}
              />
            </div>
          );
        })}

        {error && <p className="content-form-error">{error}</p>}

        <button type="submit" className="btn btn-teal content-form-submit" disabled={submitting}>
          {submitting ? 'Sending...' : block.submitLabel || 'Send Message'}
        </button>
      </form>
    </div>
  );
}
