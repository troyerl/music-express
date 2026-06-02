import ImageGallery from './ImageGallery';
import { GALLERY_IMAGES, IMAGES } from '../data/siteData';
import './Hero.css';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-bg">
        <img src={IMAGES.heroBackground} alt="" aria-hidden="true" />
        <div className="hero-overlay" />
      </div>

      <div className="hero-content">
        <div className="hero-text">
          <h3>WE CAN help</h3>
          <h3>contact us today</h3>
          <h1>sound</h1>
          <h1>lighting</h1>
          <h1>video</h1>
          <h1>production</h1>
        </div>

        <div className="hero-gallery">
          <ImageGallery images={GALLERY_IMAGES} />
        </div>
      </div>
    </section>
  );
}
