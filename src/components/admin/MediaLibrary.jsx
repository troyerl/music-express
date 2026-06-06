import { useRef, useState } from 'react';
import { processImageFiles } from '../../utils/imageUpload';
import { tryUploadImage } from '../../utils/contentApi';
import './MediaLibrary.css';

export default function MediaLibrary({ media = [], onChange }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

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

      onChange([...media, ...uploaded]);
    } catch (err) {
      setError(err.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const removeMedia = (id) => {
    onChange(media.filter((item) => item.id !== id));
  };

  return (
    <div className="media-library">
      <div className="media-library-toolbar">
        <button
          type="button"
          className="btn btn-teal"
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
        <span className="media-library-count">{media.length} uploaded</span>
      </div>

      <p className="admin-hint">
        Upload photos here to use on your website pages.
      </p>

      {error && <p className="media-library-error">{error}</p>}

      {media.length === 0 ? (
        <p className="media-library-empty">No uploaded images yet.</p>
      ) : (
        <div className="media-library-grid">
          {media.map((item) => (
            <div key={item.id} className="media-library-item">
              <img src={item.src} alt={item.name} />
              <div className="media-library-item-meta">
                <span title={item.name}>{item.name}</span>
                <button type="button" onClick={() => removeMedia(item.id)}>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function MediaPicker({ media = [], onSelect, label = 'Choose from uploads' }) {
  if (!media.length) return null;

  return (
    <div className="media-picker">
      <span className="admin-label">{label}</span>
      <div className="media-picker-grid">
        {media.map((item) => (
          <button
            key={item.id}
            type="button"
            className="media-picker-item"
            title={item.name}
            onClick={() => onSelect(item.src)}
          >
            <img src={item.src} alt={item.name} />
          </button>
        ))}
      </div>
    </div>
  );
}
