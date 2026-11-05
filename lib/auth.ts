import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET_STRING = process.env.JWT_SECRET || 'dxn_resort_super_secret_jwt_encryption_key_2026';
const secretKey = new TextEncoder().encode(JWT_SECRET_STRING);

export const COOKIE_NAME = 'dxn_admin_token';

export async function createAdminToken(username: string): Promise<string> {
  return await new SignJWT({ username, role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secretKey);
}

export async function verifyAdminToken(token: string): Promise<{ username: string } | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return { username: payload.username as string };
  } catch (err) {
    return null;
  }
}

export async function getAdminSession(): Promise<boolean> {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;

  const valid = await verifyAdminToken(token);
  return !!valid;
}

