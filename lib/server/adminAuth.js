import 'server-only';
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'farrag_admin_session';
const SESSION_TTL_SECONDS = 60 * 60 * 8;

const base64UrlEncode = (value) =>
  Buffer.from(value)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');

const base64UrlDecode = (value) => {
  const pad = 4 - (value.length % 4 || 4);
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat(pad === 4 ? 0 : pad);
  return Buffer.from(normalized, 'base64').toString('utf8');
};

const getSecret = () => {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error('ADMIN_SESSION_SECRET is required.');
  }
  return secret;
};

const getExpectedHash = () => {
  const expectedHash = process.env.ADMIN_LOGIN_PASSWORD_HASH;
  const salt = process.env.ADMIN_LOGIN_PASSWORD_SALT;

  if (!expectedHash || !salt) {
    throw new Error('ADMIN_LOGIN_PASSWORD_HASH and ADMIN_LOGIN_PASSWORD_SALT are required.');
  }

  return { expectedHash, salt };
};

export const hashAdminPassword = (password, salt) => scryptSync(password, salt, 64).toString('hex');

export const validateAdminCredentials = (username, password) => {
  const expectedUsername = process.env.ADMIN_LOGIN_USERNAME;
  if (!expectedUsername || !password || !username) return false;

  if (username !== expectedUsername) return false;

  const { expectedHash, salt } = getExpectedHash();
  const passwordHash = hashAdminPassword(password, salt);

  try {
    return timingSafeEqual(Buffer.from(passwordHash, 'hex'), Buffer.from(expectedHash, 'hex'));
  } catch {
    return false;
  }
};

const sign = (payload) => {
  const secret = getSecret();
  return createHmac('sha256', secret).update(payload).digest('base64url');
};

export const createAdminSessionToken = (username) => {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    username,
    exp: now + SESSION_TTL_SECONDS,
    nonce: randomBytes(12).toString('hex')
  };

  const payloadEncoded = base64UrlEncode(JSON.stringify(payload));
  const signature = sign(payloadEncoded);

  return `${payloadEncoded}.${signature}`;
};

export const verifyAdminSessionToken = (token) => {
  if (!token || !token.includes('.')) return null;

  const [payloadEncoded, signature] = token.split('.');
  const expectedSignature = sign(payloadEncoded);

  try {
    const match = timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
    if (!match) return null;

    const payload = JSON.parse(base64UrlDecode(payloadEncoded));
    if (!payload?.username || typeof payload.exp !== 'number') return null;

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp <= now) return null;

    return payload;
  } catch {
    return null;
  }
};

export const setAdminSessionCookie = async (username) => {
  const store = await cookies();
  const token = createAdminSessionToken(username);

  store.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_TTL_SECONDS
  });
};

export const clearAdminSessionCookie = async () => {
  const store = await cookies();
  store.set({
    name: COOKIE_NAME,
    value: '',
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0
  });
};

export const getAdminSession = async () => {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  return verifyAdminSessionToken(token);
};

export const ADMIN_COOKIE_NAME = COOKIE_NAME;
