import { useRef, useState } from 'react';
import { processImageFile } from '../../utils/imageUpload';
import { tryUploadImage } from '../../utils/contentApi';
import './ImageUploadField.css';

export default function ImageUploadField({
  label = 'Image',
  value = '',
  onChange,
  onUpload,
  hint,
  showUrlInput = true,
}) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) return;

    setError('');
    setUploading(true);

    try {
      const processed = await processImageFile(file);
      const media = await tryUploadImage(processed);
      onUpload?.(media);
      onChange?.(media.src);
    } catch (err) {
      setError(err.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="image-upload-field">
      {label && <span className="admin-label">{label}</span>}

      <div className="image-upload-actions">
        <button
          type="button"
          className="btn btn-gray image-upload-btn"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Upload Image'}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          hidden
          onChange={handleFileChange}
        />
      </div>

      {hint && <span className="admin-hint">{hint}</span>}
      {error && <span className="image-upload-error">{error}</span>}

      {showUrlInput && (
        <input
          type="text"
          className="image-upload-url"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder="Or paste an image URL"
        />
      )}

      {value && (
        <div className="image-upload-preview">
          <img src={value} alt="Preview" />
        </div>
      )}
    </div>
  );
}
