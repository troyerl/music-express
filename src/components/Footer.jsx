import { IMAGES, PHONE } from '../data/siteData';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <a
          href="https://facebook.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-facebook"
          aria-label="Facebook"
        >
          <i className="fa fa-facebook-square" />
        </a>

        <img src={IMAGES.footerLogo} alt="Music Express" className="footer-logo" />

        <p className="footer-copyright">
          Copyright &copy; Music Express. All rights reserved
        </p>

        <a href={`tel:${PHONE.replace(/-/g, '')}`} className="footer-phone">
          {PHONE}
        </a>
      </div>
    </footer>
  );
}
