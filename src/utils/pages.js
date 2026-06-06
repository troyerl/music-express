const DEFAULT_NAV_ORDER = {
  '/about-us': 1,
  '/clients': 2,
  '/equipment': 3,
  '/studio': 4,
  '/contact-us': 5,
};

export function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function createPagePath(title, existingPaths) {
  let slug = slugify(title) || 'page';
  let path = `/${slug}`;
  let counter = 1;
  while (existingPaths.includes(path)) {
    path = `/${slug}-${counter}`;
    counter += 1;
  }
  return path;
}

export function migratePageMeta(path, page, index = 0) {
  const migrated = { ...page };
  if (migrated.showInNav === undefined) migrated.showInNav = true;
  if (migrated.navOrder === undefined) {
    migrated.navOrder = DEFAULT_NAV_ORDER[path] ?? index + 10;
  }
  if (!migrated.navLabel) migrated.navLabel = migrated.title || 'Page';
  return migrated;
}

export function migrateAllPages(pages) {
  return Object.fromEntries(
    Object.entries(pages || {}).map(([path, page], index) => [
      path,
      migratePageMeta(path, page, index),
    ]),
  );
}

export function getSortedPageEntries(pages) {
  return Object.entries(pages || {}).sort(
    (a, b) => (a[1].navOrder ?? 0) - (b[1].navOrder ?? 0),
  );
}

export function getNavLinks(content) {
  const home = { label: 'Home', path: '/' };
  const links = getSortedPageEntries(content.pages)
    .filter(([, page]) => page.showInNav !== false)
    .map(([path, page]) => ({
      label: page.navLabel || page.title || path,
      path,
    }));
  return [home, ...links];
}

export function getPageBuilderOptions(pages) {
  return [
    { key: 'home', label: 'Home Page' },
    ...getSortedPageEntries(pages).map(([path, page]) => ({
      key: path,
      label: page.title || path,
    })),
  ];
}

export function buildNewPage(title, pages) {
  const existingPaths = Object.keys(pages);
  const path = createPagePath(title, existingPaths);
  const maxOrder = Math.max(0, ...Object.values(pages).map((p) => p.navOrder ?? 0));
  return {
    path,
    page: {
      title,
      body: '',
      blocks: [],
      showInNav: true,
      navOrder: maxOrder + 1,
      navLabel: title,
    },
  };
}

export function renamePagePath(pages, oldPath, newSlug) {
  const slug = slugify(newSlug);
  if (!slug) return { error: 'Invalid URL slug.' };

  const newPath = `/${slug}`;
  if (newPath === oldPath) return { pages, newPath: oldPath };

  const otherPaths = Object.keys(pages).filter((p) => p !== oldPath);
  if (otherPaths.includes(newPath)) return { error: 'That URL is already in use.' };

  const next = { ...pages };
  next[newPath] = { ...next[oldPath] };
  delete next[oldPath];
  return { pages: next, newPath };
}
