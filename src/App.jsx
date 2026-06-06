import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import { ContentProvider, useContent } from './context/ContentContext';
import { getSortedPageEntries } from './utils/pages';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Page from './pages/Page';
import Admin from './pages/Admin';
import Login from './pages/Login';

function PublicRoutes() {
  const { content } = useContent();
  const pageEntries = getSortedPageEntries(content.pages);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        {pageEntries.map(([path]) => (
          <Route key={path} path={path.replace(/^\//, '')} element={<Page pagePath={path} />} />
        ))}
        <Route path="*" element={<Page />} />
      </Routes>
      <Footer />
    </>
  );
}

function ContentGate({ children }) {
  const { loading } = useContent();

  if (loading) {
    return (
      <div className="auth-loading">
        <p>Loading site content...</p>
      </div>
    );
  }

  return children;
}

function SiteShell() {
  const location = useLocation();
  const isAdminArea = location.pathname.startsWith('/admin');

  if (isAdminArea) {
    return (
      <Routes>
        <Route path="/admin/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
      </Routes>
    );
  }

  return <PublicRoutes />;
}

export default function App() {
  return (
    <AuthProvider>
      <ContentProvider>
        <BrowserRouter>
          <ContentGate>
            <SiteShell />
          </ContentGate>
        </BrowserRouter>
      </ContentProvider>
    </AuthProvider>
  );
}
