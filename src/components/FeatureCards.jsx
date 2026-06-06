import { Link } from 'react-router-dom';
import { useContent, cardToMedia, cardToButtons } from '../context/ContentContext';
import './FeatureCards.css';

function CardMedia({ media }) {
  if (media.type === 'youtube') {
    return (
      <div className="card-media card-youtube">
        <iframe
          src={`https://www.youtube.com/embed/${media.id}?wmode=opaque&theme=dark&showinfo=0`}
          title="Video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className="card-media card-image">
      <img src={media.src} alt={media.alt} />
    </div>
  );
}

function CardButton({ button }) {
  const className = button.variant === 'orange' ? 'btn btn-orange btn-sm' : 'btn btn-gray btn-sm';

  if (button.external) {
    return (
      <a href={button.href} target="_blank" rel="noopener noreferrer" className={className}>
        {button.label}
      </a>
    );
  }

  return (
    <Link to={button.href} className={className}>
      {button.label}
    </Link>
  );
}

export default function FeatureCards() {
  const { content } = useContent();

  return (
    <section className="feature-cards">
      <div className="feature-cards-grid">
        {content.featureCards.map((card) => {
          const { button, extraButton } = cardToButtons(card);
          return (
            <article key={card.title} className="feature-card">
              <div className="feature-card-inner">
                <CardMedia media={cardToMedia(card)} />
                <div className="feature-card-body">
                  <h6>{card.title}</h6>
                  <p>{card.description}</p>
                  <div className="feature-card-actions">
                    {extraButton && <CardButton button={extraButton} />}
                    <CardButton button={button} />
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
