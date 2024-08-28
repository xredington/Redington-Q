import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = request.nextUrl;


  if (pathname.startsWith('/login') || pathname.startsWith('/signup')) {
    if (token) {
      const role = token.role?.toLowerCase();
      const redirectUrl = role === 'admin' || role === 'superadmin' ? '/dashboard' : '/';

      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }

    return NextResponse.next();
  }


  if (!token) {

    return NextResponse.redirect(new URL('/login', request.url));
  }

  const role = token.role?.toLowerCase();

  if (pathname === '/dashboard' && (role !== 'admin' && role !== 'superadmin')) {
    
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
