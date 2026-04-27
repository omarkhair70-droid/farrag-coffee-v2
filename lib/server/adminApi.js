import { NextResponse } from 'next/server';
import { verifyAdminSessionToken, ADMIN_COOKIE_NAME } from './adminAuth';

export const requireAdminFromRequest = (request) => {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const session = verifyAdminSessionToken(token);

  if (!session) {
    return {
      session: null,
      errorResponse: NextResponse.json({ error: 'غير مصرح. برجاء تسجيل الدخول.' }, { status: 401 })
    };
  }

  return { session, errorResponse: null };
};
