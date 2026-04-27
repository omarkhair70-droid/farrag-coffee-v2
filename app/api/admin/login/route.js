import { NextResponse } from 'next/server';
import { setAdminSessionCookie, validateAdminCredentials } from '../../../../lib/server/adminAuth';

export async function POST(request) {
  try {
    const body = await request.json();
    const username = String(body?.username || '').trim();
    const password = String(body?.password || '');

    if (!validateAdminCredentials(username, password)) {
      return NextResponse.json({ error: 'بيانات الدخول غير صحيحة.' }, { status: 401 });
    }

    await setAdminSessionCookie(username);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'تعذر تسجيل الدخول حالياً.' }, { status: 500 });
  }
}
