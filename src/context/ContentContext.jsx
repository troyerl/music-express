import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { DEFAULT_CONTENT } from '../data/defaultContent';
import { migrateContent } from '../data/contentBlocks';
import { fetchPublishedContent, publishContent } from '../utils/contentApi';

const STORAGE_KEY = 'musicexpress-site-content';

const ContentContext = createContext(null);

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadLocalContent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return migrateContent({ ...deepClone(DEFAULT_CONTENT), ...JSON.parse(raw) });
  } catch {
    return null;
  }
}

function cacheLocalContent(content) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
  } catch {
    // Ignore localStorage quota errors; published content still saved remotely.
  }
}

export function ContentProvider({ children }) {
  const [content, setContentState] = useState(() => migrateContent(deepClone(DEFAULT_CONTENT)));
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [storageMode, setStorageMode] = useState('default');

  useEffect(() => {
    let cancelled = false;

    async function loadContent() {
      setLoading(true);

      try {
        const published = await fetchPublishedContent();
        if (cancelled) return;

        if (published) {
          const migrated = migrateContent(published);
          setContentState(migrated);
          cacheLocalContent(migrated);
          setStorageMode('published');
          return;
        }
      } catch {
        // Fall through to local/default content when API is unavailable.
      }

      if (cancelled) return;

      const local = loadLocalContent();
      if (local) {
        setContentState(local);
        setStorageMode('local');
      } else {
        setContentState(migrateContent(deepClone(DEFAULT_CONTENT)));
        setStorageMode('default');
      }
    }

    loadContent().finally(() => {
      if (!cancelled) {
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const persist = useCallback((next, mode = storageMode) => {
    setContentState(next);
    cacheLocalContent(next);
    setStorageMode(mode);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }, [storageMode]);

  const replaceContent = useCallback(async (next) => {
    const migrated = migrateContent(deepClone(next));

    try {
      await publishContent(migrated);
      persist(migrated, 'published');
    } catch (error) {
      if (import.meta.env.DEV) {
        persist(migrated, 'local');
        return;
      }

      throw error;
    }
  }, [persist]);

  const resetContent = useCallback(async () => {
    const defaults = migrateContent(deepClone(DEFAULT_CONTENT));

    try {
      await publishContent(defaults);
      persist(defaults, 'published');
    } catch (error) {
      if (import.meta.env.DEV) {
        persist(defaults, 'local');
        return;
      }

      throw error;
    }
  }, [persist]);

  return (
    <ContentContext.Provider
      value={{
        content,
        loading,
        storageMode,
        replaceContent,
        resetContent,
        saved,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent must be used within ContentProvider');
  return ctx;
}

export function cardToMedia(card) {
  if (card.mediaType === 'youtube') {
    return { type: 'youtube', id: card.youtubeId };
  }
  return { type: 'image', src: card.imageUrl, alt: card.imageAlt || card.title };
}

export function cardToButtons(card) {
  const button = {
    label: card.buttonLabel,
    href: card.buttonHref,
    external: card.buttonExternal,
  };
  const extraButton =
    card.extraButtonLabel && card.extraButtonHref
      ? { label: card.extraButtonLabel, href: card.extraButtonHref, variant: 'orange' }
      : null;
  return { button, extraButton };
}
