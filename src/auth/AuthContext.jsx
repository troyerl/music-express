import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  confirmSignIn,
  getCurrentUser,
  signIn,
  signOut,
  fetchAuthSession,
} from 'aws-amplify/auth';
import { configureAmplify, isCognitoConfigured } from './amplify';

const AuthContext = createContext(null);

function getAuthErrorMessage(err) {
  const name = err?.name || '';
  const message = err?.message || 'Sign in failed.';

  if (name === 'NotAuthorizedException') {
    return 'Incorrect email or password.';
  }
  if (name === 'UserNotFoundException') {
    return 'No account found with that email.';
  }
  if (name === 'UserNotConfirmedException') {
    return 'Account not confirmed. Check your email for a verification link.';
  }
  if (name === 'PasswordResetRequiredException') {
    return 'Password reset required. Use Forgot password on the Cognito sign-in page or contact an administrator.';
  }
  if (name === 'InvalidPasswordException') {
    return message || 'Password does not meet Cognito requirements (length, uppercase, numbers, symbols, etc.).';
  }

  return message;
}

export function isNewPasswordRequiredStep(nextStep) {
  return nextStep?.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED';
}

export function getSignInChallengeMessage(nextStep) {
  const step = nextStep?.signInStep;

  switch (step) {
    case 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED':
      return 'You must set a new password before signing in.';
    case 'CONFIRM_SIGN_IN_WITH_SMS_MFA_CODE':
    case 'CONFIRM_SIGN_IN_WITH_TOTP_CODE':
      return 'Multi-factor authentication is required. Sign in with Cognito (hosted UI) or ask an administrator to adjust MFA settings.';
    case 'CONFIRM_SIGN_UP':
      return 'Account not confirmed. Check your email for a verification link.';
    case 'RESET_PASSWORD':
      return 'Password reset required. Use Forgot password on the Cognito sign-in page.';
    default:
      return step
        ? `Additional sign-in step required (${step}). Try Sign in with Cognito instead.`
        : 'Sign-in could not be completed.';
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [configured] = useState(() => configureAmplify());

  const refreshUser = useCallback(async () => {
    const session = await fetchAuthSession({ forceRefresh: true });
    if (session.tokens) {
      const current = await getCurrentUser();
      setUser(current);
      return true;
    }

    setUser(null);
    return false;
  }, []);

  const checkAuth = useCallback(async () => {
    if (!configured) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      await refreshUser();
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [configured, refreshUser]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email, password) => {
    if (!configured) {
      throw new Error('Cognito is not configured. Add VITE_COGNITO_* variables to your .env file.');
    }

    try {
      const result = await signIn({
        username: email,
        password,
        options: {
          authFlowType: 'USER_SRP_AUTH',
        },
      });

      if (result.isSignedIn) {
        await refreshUser();
      }

      return result;
    } catch (err) {
      throw new Error(getAuthErrorMessage(err));
    }
  };

  const completeNewPassword = async (newPassword) => {
    if (!configured) {
      throw new Error('Cognito is not configured.');
    }

    try {
      const result = await confirmSignIn({ challengeResponse: newPassword });
      if (result.isSignedIn) {
        await refreshUser();
      }
      return result;
    } catch (err) {
      throw new Error(getAuthErrorMessage(err));
    }
  };

  const logout = async () => {
    if (configured) {
      await signOut();
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        configured,
        isCognitoConfigured: configured,
        isAuthenticated: !!user,
        login,
        completeNewPassword,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export { isCognitoConfigured };
