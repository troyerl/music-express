import { Link } from 'react-router-dom';
import { useContent } from '../context/ContentContext';
import ContentBlocks from '../components/ContentBlocks';
import './Page.css';

export default function Page({ pagePath }) {
  const { content } = useContent();
  const pageContent = content.pages[pagePath];
  const isStudio = pagePath === '/studio';

  if (!pageContent) {
    return (
      <main className="page">
        <div className="page-inner">
          <h1>Page Not Found</h1>
          <p>The page you are looking for does not exist.</p>
          <Link to="/" className="btn btn-teal">
            Return Home
          </Link>
        </div>
      </main>
    );
  }

  const blocks = pageContent.blocks?.length
    ? pageContent.blocks
    : pageContent.body
      ? [{ id: 'legacy-body', type: 'text', content: pageContent.body, color: '#636363', fontSize: '20px', textAlign: 'center' }]
      : [];

  const pageClass = [
    'page',
    isStudio ? 'page--studio' : '',
    pagePath === '/equipment' ? 'page--equipment' : '',
    pagePath === '/clients' ? 'page--clients' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const innerClass = [
    'page-inner',
    pagePath === '/equipment' ? 'page-inner--equipment' : '',
    pagePath === '/clients' ? 'page-inner--clients' : '',
    isStudio ? 'page-inner--studio' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <main className={pageClass}>
      {!isStudio && (
        <div className="page-hero">
          <h1>{pageContent.title}</h1>
        </div>
      )}

      <div className={innerClass}>
        {blocks.length > 0 && (
          <div className="page-blocks">
            <ContentBlocks blocks={blocks} />
          </div>
        )}

        {pagePath === '/contact-us' && (
          <div className="contact-details">
            <a href={`tel:${content.phone.replace(/-/g, '')}`} className="contact-phone">
              {content.phone}
            </a>
            <p className="contact-note">Serving Indiana and Michigan — {content.serviceAreas}</p>
          </div>
        )}

        {!isStudio && (
          <Link to="/" className="btn btn-teal">
            Back to Home
          </Link>
        )}
      </div>
    </main>
  );
}
