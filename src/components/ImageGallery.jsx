import { useState, useEffect, useCallback } from 'react';
import './ImageGallery.css';

export default function ImageGallery({ images, interval = 6000 }) {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);

  const goTo = useCallback(
    (index) => {
      if (index === current) return;
      setFading(true);
      setTimeout(() => {
        setCurrent(index);
        setFading(false);
      }, 400);
    },
    [current],
  );

  const next = useCallback(() => {
    goTo((current + 1) % images.length);
  }, [current, images.length, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + images.length) % images.length);
  }, [current, images.length, goTo]);

  useEffect(() => {
    const timer = setInterval(next, interval);
    return () => clearInterval(timer);
  }, [next, interval]);

  return (
    <div className="gallery">
      <button className="gallery-arrow gallery-arrow-left" onClick={prev} aria-label="Previous image">
        &#8249;
      </button>

      <div className="gallery-viewport">
        <img
          src={images[current]}
          alt={`Gallery slide ${current + 1}`}
          className={`gallery-image ${fading ? 'fading' : ''}`}
        />
      </div>

      <button className="gallery-arrow gallery-arrow-right" onClick={next} aria-label="Next image">
        &#8250;
      </button>

      <ul className="gallery-dots">
        {images.map((_, i) => (
          <li
            key={i}
            className={i === current ? 'active' : ''}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </ul>
    </div>
  );
}
