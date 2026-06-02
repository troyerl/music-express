import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Page from './pages/Page';

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<Page pagePath="/about-us" />} />
        <Route path="/clients" element={<Page pagePath="/clients" />} />
        <Route path="/equipment" element={<Page pagePath="/equipment" />} />
        <Route path="/studio" element={<Page pagePath="/studio" />} />
        <Route path="/contact-us" element={<Page pagePath="/contact-us" />} />
        <Route path="*" element={<Page />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
