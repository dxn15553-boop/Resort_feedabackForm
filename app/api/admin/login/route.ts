import { NextRequest, NextResponse } from 'next/server';
import { createAdminToken, COOKIE_NAME } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    const expectedUser = process.env.ADMIN_USERNAME || 'admin';
    const expectedPass = process.env.ADMIN_PASSWORD || 'DXN_Resort@Admin2026';

    if (username !== expectedUser || password !== expectedPass) {
      return NextResponse.json(
        { success: false, error: 'Invalid admin username or password' },
        { status: 401 }
      );
    }

    const token = await createAdminToken(username);

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

