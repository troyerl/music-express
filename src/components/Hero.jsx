import ImageGallery from './ImageGallery';
import { useContent } from '../context/ContentContext';
import './Hero.css';

export default function Hero() {
  const { content } = useContent();
  const { hero, images, galleryImages } = content;

  return (
    <section className="hero">
      <div className="hero-bg">
        <img src={images.heroBackground} alt="" aria-hidden="true" />
        <div className="hero-overlay" />
      </div>

      <div className="hero-content">
        <div className="hero-text">
          <h3>{hero.ctaLine1}</h3>
          <h3>{hero.ctaLine2}</h3>
          {hero.headlines.map((line) => (
            <h1 key={line}>{line}</h1>
          ))}
        </div>

        <div className="hero-gallery">
          <ImageGallery images={galleryImages} />
        </div>
      </div>
    </section>
  );
}
