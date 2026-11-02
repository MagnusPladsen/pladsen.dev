import { NextResponse, type NextRequest } from 'next/server';

const CV_HOST = 'cv.pladsen.dev';

export function middleware(request: NextRequest): NextResponse {
  if (request.headers.get('host') === CV_HOST && request.nextUrl.pathname === '/') {
    return NextResponse.rewrite(new URL('/cv.pdf', request.url));
  }
  return NextResponse.next();
}

export const config = { matcher: '/' };
