import { fetchAuthSession } from 'aws-amplify/auth';

async function getAccessToken() {
  const session = await fetchAuthSession();
  const token = session.tokens?.accessToken?.toString();

  if (!token) {
    throw new Error('Please sign in again to update the website.');
  }

  return token;
}

export async function fetchPublishedContent() {
  const response = await fetch('/api/content');

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error('Could not load published site content.');
  }

  return response.json();
}

export async function publishContent(content) {
  const token = await getAccessToken();
  const response = await fetch('/api/content', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(content),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || 'We could not update the website. Please try again.');
  }
}

export async function uploadImageToStorage(processedMedia) {
  const token = await getAccessToken();
  const response = await fetch('/api/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      dataUrl: processedMedia.src,
      name: processedMedia.name,
    }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || 'Could not upload that image. Try a smaller photo.');
  }

  return response.json();
}

export async function tryUploadImage(processedMedia) {
  if (import.meta.env.PROD) {
    return uploadImageToStorage(processedMedia);
  }

  try {
    return await uploadImageToStorage(processedMedia);
  } catch {
    return processedMedia;
  }
}
