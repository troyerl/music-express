import { head, put } from '@vercel/blob';

export const CONTENT_BLOB_PATH = 'site-content.json';

export async function readStoredContent() {
  try {
    const metadata = await head(CONTENT_BLOB_PATH);
    const response = await fetch(metadata.url);

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch {
    return null;
  }
}

export async function writeStoredContent(content) {
  const body = JSON.stringify(content);

  await put(CONTENT_BLOB_PATH, body, {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}
