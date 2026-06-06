const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_INPUT_BYTES = 10 * 1024 * 1024;
const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 0.82;

export function createMediaId() {
  return `media-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not read that image file.'));
    };

    img.src = url;
  });
}

function canvasToDataUrl(canvas, type) {
  if (type === 'image/png' || type === 'image/gif' || type === 'image/webp') {
    return canvas.toDataURL(type);
  }

  return canvas.toDataURL('image/jpeg', JPEG_QUALITY);
}

export async function processImageFile(file) {
  if (!file) {
    throw new Error('No file selected.');
  }

  if (!ACCEPTED_TYPES.includes(file.type)) {
    throw new Error('Use a JPG, PNG, GIF, or WebP image.');
  }

  if (file.size > MAX_INPUT_BYTES) {
    throw new Error('Image is too large. Use a file under 10 MB.');
  }

  const img = await loadImageFromFile(file);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
  const width = Math.max(1, Math.round(img.width * scale));
  const height = Math.max(1, Math.round(img.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not process image in this browser.');
  }

  ctx.drawImage(img, 0, 0, width, height);

  const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
  const src = canvasToDataUrl(canvas, outputType);

  return {
    id: createMediaId(),
    name: file.name,
    src,
  };
}

export async function processImageFiles(fileList) {
  const files = Array.from(fileList || []);
  const results = [];

  for (const file of files) {
    results.push(await processImageFile(file));
  }

  return results;
}
