import type { APIRoute } from 'astro';
import { COOKIE } from '../../../lib/auth';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const form = await request.formData();
  const password = form.get('password')?.toString() ?? '';

  const expected = process.env.DASHBOARD_PASSWORD;

  if (!expected || password !== expected) {
    return redirect('/login?error=1');
  }

  cookies.set(COOKIE, expected, {
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 dias
  });

  return redirect('/leads');
};
