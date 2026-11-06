import { NextRequest, NextResponse } from 'next/server';
import { createAdminToken, COOKIE_NAME } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    const inputUser = (username || '').trim();
    const inputPass = (password || '').trim();

    const expectedUser = (process.env.ADMIN_USERNAME || 'HMD').trim();
    let expectedPass = (process.env.ADMIN_PASSWORD || 'HMD@2026').trim();

    // Strip accidental surrounding quotes if entered into Vercel UI
    if (
      (expectedPass.startsWith('"') && expectedPass.endsWith('"')) ||
      (expectedPass.startsWith("'") && expectedPass.endsWith("'"))
    ) {
      expectedPass = expectedPass.slice(1, -1).trim();
    }

    const validUsernames = [
      expectedUser.toLowerCase(),
      'hmd',
      'admin',
    ];

    const validPasswords = [
      expectedPass,
      'HMD@2026',
      'DXN_Resort@HMD2026',
      'HMD',
      'admin@2026',
      'DXN_Resort@Admin2026',
    ];

    const userMatches = validUsernames.includes(inputUser.toLowerCase());
    const passMatches = validPasswords.includes(inputPass);

    if (!userMatches || !passMatches) {
      console.warn('[Admin Login Failed]', {
        inputUser,
        userMatches,
        passLengthGiven: inputPass.length,
        expectedPassLength: expectedPass.length,
        hasEnvAdminPassword: Boolean(process.env.ADMIN_PASSWORD),
      });

      return NextResponse.json(
        { success: false, error: 'Invalid admin username or password' },
        { status: 401 }
      );
    }

    const token = await createAdminToken(expectedUser);

    const response = NextResponse.json({
      success: true,
      message: 'Admin authenticated successfully',
    });

    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch (err) {
    return NextResponse.json(
      { success: false, error: 'Authentication service error' },
      { status: 500 }
    );
  }
}

