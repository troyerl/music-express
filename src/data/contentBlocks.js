export const BLOCK_TYPES = [
  { value: 'text', label: 'Styled Text' },
  { value: 'heading', label: 'Heading' },
  { value: 'html', label: 'HTML Block' },
  { value: 'image', label: 'Image' },
  { value: 'carousel', label: 'Carousel' },
];

export const FONT_SIZES = [
  '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '48px', '60px',
];

export const TEXT_ALIGN_OPTIONS = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' },
];

let blockCounter = 0;

export function createBlockId() {
  blockCounter += 1;
  return `block-${Date.now()}-${blockCounter}`;
}

export function createBlock(type) {
  const id = createBlockId();

  switch (type) {
    case 'heading':
      return {
        id,
        type: 'heading',
        text: 'Section Heading',
        level: 2,
        color: '#27afcf',
        fontSize: '36px',
        textAlign: 'center',
      };
    case 'html':
      return {
        id,
        type: 'html',
        html: '<p><strong>Custom HTML</strong> content goes here.</p>',
      };
    case 'image':
      return {
        id,
        type: 'image',
        src: '',
        alt: '',
        caption: '',
        width: '100%',
        link: '',
      };
    case 'carousel':
      return {
        id,
        type: 'carousel',
        images: [],
        interval: 6000,
        height: '400px',
      };
    default:
      return {
        id,
        type: 'text',
        content: 'Enter your text here.',
        color: '#636363',
        fontSize: '20px',
        textAlign: 'center',
      };
  }
}

export function bodyToTextBlock(body, overrides = {}) {
  return {
    id: createBlockId(),
    type: 'text',
    content: body,
    color: '#636363',
    fontSize: '20px',
    textAlign: 'center',
    ...overrides,
  };
}

export function migratePage(page) {
  if (page.blocks?.length) {
    return {
      ...page,
      blocks: page.blocks.map((block) => ({ ...createBlock(block.type), ...block })),
    };
  }

  const blocks = page.body ? [bodyToTextBlock(page.body)] : [];
  return { ...page, blocks };
}

import { migrateAllPages } from '../utils/pages';

export function migrateContent(content) {
  const migrated = structuredClone(content);
  ensureUploadedMedia(migrated);

  migrated.pages = migrateAllPages(
    Object.fromEntries(
      Object.entries(migrated.pages || {}).map(([path, page]) => [path, migratePage(page)]),
    ),
  );

  if (!Array.isArray(migrated.homeBlocks)) {
    migrated.homeBlocks = [];
  }

  return migrated;
}

export function ensureUploadedMedia(content) {
  if (!Array.isArray(content.uploadedMedia)) {
    content.uploadedMedia = [];
  }
  return content;
}

export function blocksToDraft(blocks) {
  return blocks.map((block) => ({ ...block }));
}

export function blocksFromDraft(blocks) {
  return blocks.map((block) => {
    if (block.type === 'carousel') {
      const images = block.images?.length
        ? block.images
        : (block.imagesText || '')
            .split('\n')
            .map((line) => line.trim())
            .filter(Boolean);
      const next = { ...block, images };
      delete next.imagesText;
      return next;
    }
    return block;
  });
}
