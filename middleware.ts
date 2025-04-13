import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware handles global request/response modifications
export function middleware(request: NextRequest) {
  // Get the response
  const response = NextResponse.next();

  // Add headers to prevent caching of API responses
  if (request.nextUrl.pathname.startsWith('/api/')) {
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    response.headers.set('Content-Type', 'application/json');
  }

  return response;
}

// Configure the paths this middleware should run on
export const config = {
  matcher: [
    '/api/:path*',
  ],
}; 