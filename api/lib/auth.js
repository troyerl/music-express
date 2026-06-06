import { CognitoJwtVerifier } from 'aws-jwt-verify';

let verifier;

function getVerifier() {
  if (!verifier) {
    const userPoolId = process.env.COGNITO_USER_POOL_ID;
    const clientId = process.env.COGNITO_CLIENT_ID;

    if (!userPoolId || !clientId) {
      throw new Error('COGNITO_USER_POOL_ID and COGNITO_CLIENT_ID must be set on the server.');
    }

    verifier = CognitoJwtVerifier.create({
      userPoolId,
      tokenUse: 'access',
      clientId,
    });
  }

  return verifier;
}

export async function verifyAdminRequest(req) {
  const header = req.headers.authorization || req.headers.Authorization;

  if (!header?.startsWith('Bearer ')) {
    const error = new Error('Missing authorization token.');
    error.statusCode = 401;
    throw error;
  }

  try {
    await getVerifier().verify(header.slice(7));
  } catch {
    const error = new Error('Invalid or expired sign-in token.');
    error.statusCode = 401;
    throw error;
  }
}

export function sendError(res, error, fallbackStatus = 500) {
  const status = error.statusCode || fallbackStatus;
  res.status(status).json({ error: error.message || 'Request failed.' });
}
