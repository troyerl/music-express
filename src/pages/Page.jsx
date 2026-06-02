import { Link } from 'react-router-dom';
import { PAGE_CONTENT, PHONE } from '../data/siteData';
import './Page.css';

export default function Page({ pagePath }) {
  const content = PAGE_CONTENT[pagePath];

  if (!content) {
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

  return (
    <main className="page">
      <div className="page-hero">
        <h1>{content.title}</h1>
      </div>
      <div className="page-inner">
        <p className="page-body">{content.body}</p>

        {pagePath === '/contact-us' && (
          <div className="contact-details">
            <a href={`tel:${PHONE.replace(/-/g, '')}`} className="contact-phone">
              {PHONE}
            </a>
            <p className="contact-note">
              Serving Indiana and Michigan — South Bend, Goshen, Elkhart, Mishawaka, Ft Wayne, Kokomo,
              Indianapolis, Detroit, Sturgis, Kalamazoo, Three Rivers, Warsaw
            </p>
          </div>
        )}

        <Link to="/" className="btn btn-teal">
          Back to Home
        </Link>
      </div>
    </main>
  );
}
