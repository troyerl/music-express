import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { NAV_LINKS, IMAGES, PHONE } from '../data/siteData';
import './Header.css';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="header-bar">
        <div className="header-inner">
          <NavLink to="/" className="header-logo" onClick={() => setMenuOpen(false)}>
            <img src={IMAGES.logo} alt="Music Express" />
          </NavLink>

          <div className="header-center">
            <img src={IMAGES.tagline} alt="Sound, Lighting, Video, Production" className="header-tagline" />
          </div>

          <div className="header-right">
            <div className="header-accent-bar" />
            <a href={`tel:${PHONE.replace(/-/g, '')}`} className="header-phone">
              {PHONE}
            </a>
            <div className="header-social">
              <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <img src={IMAGES.socialFacebook} alt="Facebook" />
              </a>
              <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <img src={IMAGES.socialTwitter} alt="Twitter" />
              </a>
            </div>
          </div>

          <button
            className="header-menu-toggle"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <nav className={`header-nav ${menuOpen ? 'open' : ''}`}>
        <ul>
          {NAV_LINKS.map(({ label, path }) => (
            <li key={path}>
              <NavLink
                to={path}
                end={path === '/'}
                className={({ isActive }) => (isActive ? 'active' : undefined)}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
