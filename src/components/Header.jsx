import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useContent } from '../context/ContentContext';
import { getNavLinks } from '../utils/pages';
import './Header.css';

export default function Header() {
  const { content } = useContent();
  const { images, phone, social } = content;
  const navLinks = getNavLinks(content);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="header-bar">
        <div className="header-inner">
          <NavLink to="/" className="header-logo" onClick={() => setMenuOpen(false)}>
            <img src={images.logo} alt="Music Express" />
          </NavLink>

          <div className="header-center">
            <img src={images.tagline} alt="Sound, Lighting, Video, Production" className="header-tagline" />
          </div>

          <div className="header-right">
            <div className="header-accent-bar" />
            <a href={`tel:${phone.replace(/-/g, '')}`} className="header-phone">
              {phone}
            </a>
            <div className="header-social">
              <a href={social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <img src={images.socialFacebook} alt="Facebook" />
              </a>
              <a href={social.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <img src={images.socialTwitter} alt="Twitter" />
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
          {navLinks.map(({ label, path }) => (
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
