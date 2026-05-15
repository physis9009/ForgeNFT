import createMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';
import { routing } from './i18n/routing';

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|robots.txt|.*\\..*).*)'],
};

const handleI18nRouting = createMiddleware(routing);

export function middleware(request: NextRequest) {
  return handleI18nRouting(request);
}