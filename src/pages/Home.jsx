import Hero from '../components/Hero';
import FeatureCards from '../components/FeatureCards';
import { SERVICE_AREAS } from '../data/siteData';
import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  return (
    <main className="home">
      <Hero />
      <FeatureCards />

      <section className="service-areas">
        <p>{SERVICE_AREAS}</p>
      </section>

      <section className="region-banner">
        <h3>WE&apos;LL BE THERE.</h3>
        <h2>INDIANA. MICHIGAN.</h2>
        <Link to="/contact-us" className="btn btn-teal region-cta">
          Contact Us Today
        </Link>
      </section>
    </main>
  );
}
