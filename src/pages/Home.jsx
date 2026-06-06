import Hero from '../components/Hero';
import FeatureCards from '../components/FeatureCards';
import ContentBlocks from '../components/ContentBlocks';
import { useContent } from '../context/ContentContext';
import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  const { content } = useContent();
  const { serviceAreas, regionBanner, homeBlocks } = content;

  return (
    <main className="home">
      <Hero />
      <FeatureCards />

      {homeBlocks?.length > 0 && (
        <section className="home-blocks">
          <ContentBlocks blocks={homeBlocks} />
        </section>
      )}

      <section className="service-areas">
        <p>{serviceAreas}</p>
      </section>

      <section className="region-banner">
        <h3>{regionBanner.title}</h3>
        <h2>{regionBanner.subtitle}</h2>
        <Link to="/contact-us" className="btn btn-teal region-cta">
          {regionBanner.ctaLabel}
        </Link>
      </section>
    </main>
  );
}
