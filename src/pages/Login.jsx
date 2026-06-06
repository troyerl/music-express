import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { getSignInChallengeMessage, isNewPasswordRequiredStep, useAuth } from '../auth/AuthContext';
import { isCognitoConfigured } from '../auth/amplify';
import './Login.css';

export default function Login() {
  const { login, completeNewPassword, isAuthenticated, loading, configured } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [needsNewPassword, setNeedsNewPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const from = location.state?.from || '/admin';

  if (!loading && isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const result = await login(email.trim(), password);
      if (result.isSignedIn) {
        navigate(from, { replace: true });
        return;
      }

      if (isNewPasswordRequiredStep(result.nextStep)) {
        setNeedsNewPassword(true);
        return;
      }

      setError(getSignInChallengeMessage(result.nextStep));
    } catch (err) {
      setError(err.message || 'Sign in failed. Check your email and password.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNewPasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);

    try {
      const result = await completeNewPassword(newPassword);
      if (result.isSignedIn) {
        navigate(from, { replace: true });
        return;
      }

      setError(getSignInChallengeMessage(result.nextStep));
    } catch (err) {
      setError(err.message || 'Could not set new password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Admin Sign In</h1>
        <p className="login-subtitle">Sign in with your Cognito account to manage site content.</p>

        {!isCognitoConfigured() && (
          <div className="login-error">
            Cognito is not configured. Copy <code>.env.example</code> to <code>.env</code> and add your
            User Pool settings.
          </div>
        )}

        {error && <div className="login-error">{error}</div>}

        {needsNewPassword ? (
          <form onSubmit={handleNewPasswordSubmit}>
            <p className="login-subtitle">
              Cognito requires a new password for <strong>{email.trim()}</strong> before you can access the admin.
              Use the temporary password you received when the account was created, then choose a permanent one below.
            </p>

            <label className="login-field">
              <span>New Password</span>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                required
                disabled={!configured || submitting}
              />
            </label>

            <label className="login-field">
              <span>Confirm Password</span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
                disabled={!configured || submitting}
              />
            </label>

            <button type="submit" className="btn btn-gray login-submit" disabled={!configured || submitting}>
              {submitting ? 'Saving...' : 'Set Password and Continue'}
            </button>

            <button
              type="button"
              className="btn btn-gray login-submit"
              disabled={submitting}
              onClick={() => {
                setNeedsNewPassword(false);
                setNewPassword('');
                setConfirmPassword('');
                setError('');
              }}
            >
              Back
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit}>
            <p className="login-subtitle login-note">
              First time signing in? Use the temporary password from Cognito, then you&apos;ll be prompted to set a new one.
            </p>

            <label className="login-field">
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                required
                disabled={!configured || submitting}
              />
            </label>

            <label className="login-field">
              <span>Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                disabled={!configured || submitting}
              />
            </label>

            <button type="submit" className="btn btn-gray login-submit" disabled={!configured || submitting}>
              {submitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
