import { useRef, useState } from 'react';
import { FONT_SIZES, TEXT_ALIGN_OPTIONS, createBlock, createFormField, FORM_FIELD_TYPES } from '../../data/contentBlocks';
import { processImageFiles } from '../../utils/imageUpload';
import { tryUploadImage } from '../../utils/contentApi';
import ImageUploadField from './ImageUploadField';
import { MediaPicker } from './MediaLibrary';
import './BlockEditor.css';
import './ImageUploadField.css';
import './MediaLibrary.css';

export function Field({ label, children, hint }) {
  return (
    <label className="admin-field">
      <span className="admin-label">{label}</span>
      {children}
      {hint && <span className="admin-hint">{hint}</span>}
    </label>
  );
}

export function StyleFields({ block, onChange }) {
  return (
    <>
      <div className="admin-row admin-style-row">
        <Field label="Text Color">
          <div className="admin-color-input">
            <input
              type="color"
              value={block.color || '#636363'}
              onChange={(e) => onChange('color', e.target.value)}
            />
            <input
              type="text"
              value={block.color || '#636363'}
              onChange={(e) => onChange('color', e.target.value)}
            />
          </div>
        </Field>
        <Field label="Font Size">
          <select value={block.fontSize || '18px'} onChange={(e) => onChange('fontSize', e.target.value)}>
            {FONT_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Text Alignment">
        <select value={block.textAlign || 'center'} onChange={(e) => onChange('textAlign', e.target.value)}>
          {TEXT_ALIGN_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </Field>
    </>
  );
}

function CarouselImagesEditor({ block, onChange, uploadedMedia, onAddMedia }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const images = block.images || [];

  const setImages = (nextImages) => onChange('images', nextImages);

  const addImage = (src) => {
    if (!src) return;
    setImages([...images, src]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleUpload = async (event) => {
    const files = event.target.files;
    event.target.value = '';
    if (!files?.length) return;

    setError('');
    setUploading(true);

    try {
      const processed = await processImageFiles(files);
      const uploaded = [];

      for (const item of processed) {
        uploaded.push(await tryUploadImage(item));
      }

      onAddMedia?.(uploaded);
      setImages([...images, ...uploaded.map((item) => item.src)]);
    } catch (err) {
      setError(err.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Field label="Carousel Images" hint="Upload images or pick from your media library.">
        <div className="image-upload-actions">
          <button
            type="button"
            className="btn btn-gray image-upload-btn"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Upload Images'}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            multiple
            hidden
            onChange={handleUpload}
          />
        </div>
        {error && <span className="image-upload-error">{error}</span>}
      </Field>

      <MediaPicker media={uploadedMedia} onSelect={addImage} />

      {images.length > 0 && (
        <div className="carousel-image-list">
          {images.map((src, index) => (
            <div key={`${src.slice(0, 32)}-${index}`} className="carousel-image-item">
              <img src={src} alt={`Slide ${index + 1}`} />
              <span>{src.startsWith('data:') ? `Uploaded image ${index + 1}` : src}</span>
              <button type="button" onClick={() => removeImage(index)}>
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function FormFieldsEditor({ block, onChange }) {
  const fields = block.fields || [];

  const updateField = (index, key, value) => {
    onChange(
      'fields',
      fields.map((field, i) => (i === index ? { ...field, [key]: value } : field)),
    );
  };

  const addField = () => {
    onChange('fields', [...fields, createFormField()]);
  };

  const removeField = (index) => {
    onChange(
      'fields',
      fields.filter((_, i) => i !== index),
    );
  };

  const moveField = (index, direction) => {
    const next = [...fields];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange('fields', next);
  };

  return (
    <>
      <Field label="Form Fields">
        {fields.length === 0 && <p className="block-editor-empty">No fields yet. Add one below.</p>}

        {fields.map((field, index) => (
          <div key={field.id} className="form-field-editor">
            <div className="block-editor-item-header">
              <span className="block-type-badge">{field.type}</span>
              <div className="block-editor-item-actions">
                <button type="button" onClick={() => moveField(index, -1)} disabled={index === 0}>
                  ↑
                </button>
                <button type="button" onClick={() => moveField(index, 1)} disabled={index === fields.length - 1}>
                  ↓
                </button>
                <button type="button" className="block-remove" onClick={() => removeField(index)}>
                  Remove
                </button>
              </div>
            </div>

            <div className="admin-row">
              <Field label="Label">
                <input type="text" value={field.label} onChange={(e) => updateField(index, 'label', e.target.value)} />
              </Field>
              <Field label="Field Type">
                <select value={field.type} onChange={(e) => updateField(index, 'type', e.target.value)}>
                  {FORM_FIELD_TYPES.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="admin-row">
              <Field label="Placeholder">
                <input
                  type="text"
                  value={field.placeholder || ''}
                  onChange={(e) => updateField(index, 'placeholder', e.target.value)}
                />
              </Field>
              <label className="admin-checkbox form-field-required">
                <input
                  type="checkbox"
                  checked={!!field.required}
                  onChange={(e) => updateField(index, 'required', e.target.checked)}
                />
                Required field
              </label>
            </div>

            {field.type === 'select' && (
              <Field label="Dropdown options" hint="One option per line">
                <textarea
                  rows={3}
                  value={field.options || ''}
                  onChange={(e) => updateField(index, 'options', e.target.value)}
                />
              </Field>
            )}
          </div>
        ))}

        <button type="button" className="btn btn-gray form-field-add" onClick={addField}>
          + Add field
        </button>
      </Field>
    </>
  );
}

function BlockFields({ block, onChange, uploadedMedia, onAddMedia }) {
  switch (block.type) {
    case 'heading':
      return (
        <>
          <Field label="Heading Text">
            <input type="text" value={block.text} onChange={(e) => onChange('text', e.target.value)} />
          </Field>
          <div className="admin-row">
            <Field label="Heading Level">
              <select value={block.level} onChange={(e) => onChange('level', Number(e.target.value))}>
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>
                    H{n}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <StyleFields block={block} onChange={onChange} />
        </>
      );

    case 'html':
      return (
        <Field label="HTML Content" hint="Supports HTML tags like <p>, <strong>, <a>, <img>, <ul>, etc.">
          <textarea rows={8} value={block.html} onChange={(e) => onChange('html', e.target.value)} />
        </Field>
      );

    case 'image':
      return (
        <>
          <ImageUploadField
            label="Image"
            value={block.src}
            onChange={(src) => onChange('src', src)}
            onUpload={(media) => onAddMedia?.([media])}
            hint="Upload a file or paste an external image URL."
          />
          <MediaPicker
            media={uploadedMedia}
            onSelect={(src) => onChange('src', src)}
            label="Or choose from uploads"
          />
          <div className="admin-row">
            <Field label="Alt Text">
              <input type="text" value={block.alt} onChange={(e) => onChange('alt', e.target.value)} />
            </Field>
            <Field label="Width">
              <input type="text" value={block.width} onChange={(e) => onChange('width', e.target.value)} placeholder="100%" />
            </Field>
          </div>
          <Field label="Caption (optional)">
            <input type="text" value={block.caption} onChange={(e) => onChange('caption', e.target.value)} />
          </Field>
          <Field label="Link URL (optional)">
            <input type="text" value={block.link} onChange={(e) => onChange('link', e.target.value)} />
          </Field>
        </>
      );

    case 'form':
      return (
        <>
          <Field label="Intro text (optional)">
            <input type="text" value={block.intro || ''} onChange={(e) => onChange('intro', e.target.value)} />
          </Field>

          <FormFieldsEditor block={block} onChange={onChange} />

          <div className="admin-row">
            <Field label="Submit button text">
              <input
                type="text"
                value={block.submitLabel || ''}
                onChange={(e) => onChange('submitLabel', e.target.value)}
              />
            </Field>
            <Field label="Send submissions to email">
              <input
                type="email"
                value={block.recipientEmail || ''}
                onChange={(e) => onChange('recipientEmail', e.target.value)}
                placeholder="musicexpress@maplenet.net"
              />
            </Field>
          </div>

          <Field
            label="Success message"
            hint="Shown after someone submits the form."
          >
            <textarea
              rows={3}
              value={block.successMessage || ''}
              onChange={(e) => onChange('successMessage', e.target.value)}
            />
          </Field>

          <Field
            label="Form service URL (optional)"
            hint="Leave blank for automatic email (free with Web3Forms — see README). Use this only for Formspree or similar."
          >
            <input
              type="url"
              value={block.formAction || ''}
              onChange={(e) => onChange('formAction', e.target.value)}
              placeholder="https://formspree.io/f/..."
            />
          </Field>
        </>
      );

    case 'carousel':
      return (
        <>
          <CarouselImagesEditor
            block={block}
            onChange={onChange}
            uploadedMedia={uploadedMedia}
            onAddMedia={onAddMedia}
          />
          <div className="admin-row">
            <Field label="Slide Interval (ms)">
              <input
                type="number"
                min={2000}
                step={500}
                value={block.interval}
                onChange={(e) => onChange('interval', Number(e.target.value))}
              />
            </Field>
            <Field label="Max Height">
              <input type="text" value={block.height} onChange={(e) => onChange('height', e.target.value)} placeholder="400px" />
            </Field>
          </div>
        </>
      );

    case 'text':
    default:
      return (
        <>
          <Field label="Text Content">
            <textarea rows={4} value={block.content} onChange={(e) => onChange('content', e.target.value)} />
          </Field>
          <StyleFields block={block} onChange={onChange} />
        </>
      );
  }
}

export default function BlockEditor({ blocks, onChange, label, uploadedMedia = [], onAddMedia }) {
  const updateBlock = (index, field, value) => {
    onChange(
      blocks.map((block, i) => (i === index ? { ...block, [field]: value } : block)),
    );
  };

  const moveBlock = (index, direction) => {
    const next = [...blocks];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const removeBlock = (index) => {
    onChange(blocks.filter((_, i) => i !== index));
  };

  const addBlock = (type) => {
    onChange([...blocks, createBlock(type)]);
  };

  return (
    <div className="block-editor">
      <div className="block-editor-header">
        <h4>{label}</h4>
        <div className="block-editor-add">
          <select
            defaultValue=""
            onChange={(e) => {
              if (e.target.value) {
                addBlock(e.target.value);
                e.target.value = '';
              }
            }}
          >
            <option value="">+ Add block...</option>
            <option value="text">Styled Text</option>
            <option value="heading">Heading</option>
            <option value="html">HTML Block</option>
            <option value="image">Image</option>
            <option value="carousel">Carousel</option>
            <option value="form">Contact Form</option>
          </select>
        </div>
      </div>

      {blocks.length === 0 && <p className="block-editor-empty">No content blocks yet. Add one above.</p>}

      {blocks.map((block, index) => (
        <div key={block.id} className="block-editor-item">
          <div className="block-editor-item-header">
            <span className="block-type-badge">{block.type}</span>
            <div className="block-editor-item-actions">
              <button type="button" onClick={() => moveBlock(index, -1)} disabled={index === 0}>
                ↑
              </button>
              <button type="button" onClick={() => moveBlock(index, 1)} disabled={index === blocks.length - 1}>
                ↓
              </button>
              <button type="button" className="block-remove" onClick={() => removeBlock(index)}>
                Remove
              </button>
            </div>
          </div>
          <BlockFields
            block={block}
            onChange={(field, value) => updateBlock(index, field, value)}
            uploadedMedia={uploadedMedia}
            onAddMedia={onAddMedia}
          />
        </div>
      ))}
    </div>
  );
}
