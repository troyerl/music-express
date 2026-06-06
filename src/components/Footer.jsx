import { useContent } from '../context/ContentContext';
import './Footer.css';

export default function Footer() {
  const { content } = useContent();
  const { images, phone, copyright, social } = content;

  return (
    <footer className="footer">
      <div className="footer-inner">
        <a
          href={social.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="footer-facebook"
          aria-label="Facebook"
        >
          <i className="fa fa-facebook-square" />
        </a>

        <img src={images.footerLogo} alt="Music Express" className="footer-logo" />

        <p className="footer-copyright">{copyright}</p>

        <a href={`tel:${phone.replace(/-/g, '')}`} className="footer-phone">
          {phone}
        </a>

        <a href="/admin" className="footer-admin-link">
          Admin
        </a>
      </div>
    </footer>
  );
}
