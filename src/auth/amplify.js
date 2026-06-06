import { Amplify } from 'aws-amplify';

export function isCognitoConfigured() {
  return !!(
    import.meta.env.VITE_COGNITO_USER_POOL_ID &&
    import.meta.env.VITE_COGNITO_CLIENT_ID &&
    import.meta.env.VITE_COGNITO_REGION
  );
}

export function configureAmplify() {
  if (!isCognitoConfigured()) return false;

  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
        userPoolClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
        loginWith: {
          email: true,
        },
      },
    },
  });

  return true;
}
