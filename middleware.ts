import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

export default async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }
  
  const response = intlMiddleware(req);
  
  const publicPaths = [
    /^\/(en|vi)\/login$/,
    /^\/(en|vi)\/register$/,
    /^\/(en|vi)?$/,  
  ];
  
  const isPublicPath = publicPaths.some(pattern => pattern.test(pathname));
  
  if (isPublicPath) {
    return response;
  }
  
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  
  if (!token) {
    const locale = pathname.match(/^\/(en|vi)/)?.[1] || 'en';
    const loginUrl = new URL(`/${locale}/login`, req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  return response;
}

export const config = {
  matcher: ['/((?!_next|_vercel|.*\\..*).*)'],
};
