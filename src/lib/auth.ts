export const COOKIE = 'dash_session';

export function isAuthenticated(cookies: { get: (k: string) => { value: string } | undefined }): boolean {
  const password = process.env.DASHBOARD_PASSWORD;
  if (!password) return false;
  return cookies.get(COOKIE)?.value === password;
}
