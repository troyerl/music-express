import ImageGallery from './ImageGallery';
import './ContentBlocks.css';

function blockStyle({ color, fontSize, textAlign }) {
  return {
    color: color || undefined,
    fontSize: fontSize || undefined,
    textAlign: textAlign || undefined,
  };
}

function HeadingBlock({ block }) {
  const Tag = `h${Math.min(6, Math.max(1, block.level || 2))}`;
  return (
    <Tag className="content-block content-block-heading" style={blockStyle(block)}>
      {block.text}
    </Tag>
  );
}

function TextBlock({ block }) {
  return (
    <p className="content-block content-block-text" style={blockStyle(block)}>
      {block.content}
    </p>
  );
}

function HtmlBlock({ block }) {
  return (
    <div
      className="content-block content-block-html"
      dangerouslySetInnerHTML={{ __html: block.html }}
    />
  );
}

function ImageBlock({ block }) {
  const img = (
    <img
      src={block.src}
      alt={block.alt || ''}
      style={{ width: block.width || '100%' }}
      className="content-block-image"
    />
  );

  return (
    <figure className="content-block content-block-figure">
      {block.link ? (
        <a href={block.link} target="_blank" rel="noopener noreferrer">
          {img}
        </a>
      ) : (
        img
      )}
      {block.caption && <figcaption style={blockStyle(block)}>{block.caption}</figcaption>}
    </figure>
  );
}

function CarouselBlock({ block }) {
  if (!block.images?.length) return null;

  return (
    <div className="content-block content-block-carousel" style={{ maxHeight: block.height || '400px' }}>
      <ImageGallery images={block.images} interval={block.interval || 6000} />
    </div>
  );
}

export default function ContentBlocks({ blocks }) {
  if (!blocks?.length) return null;

  return (
    <div className="content-blocks">
      {blocks.map((block) => {
        switch (block.type) {
          case 'heading':
            return <HeadingBlock key={block.id} block={block} />;
          case 'html':
            return <HtmlBlock key={block.id} block={block} />;
          case 'image':
            return block.src ? <ImageBlock key={block.id} block={block} /> : null;
          case 'carousel':
            return <CarouselBlock key={block.id} block={block} />;
          case 'text':
          default:
            return <TextBlock key={block.id} block={block} />;
        }
      })}
    </div>
  );
}
