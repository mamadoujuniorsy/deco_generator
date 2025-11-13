import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Simple JWT decode (without verification for Edge compatibility)
function decodeJWT(token: string): { userId: string; email: string } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = JSON.parse(
      Buffer.from(parts[1], 'base64').toString('utf-8')
    );
    
    // Check expiration
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      console.error('❌ Token expired');
      return null;
    }
    
    return { userId: payload.userId, email: payload.email };
  } catch (error: any) {
    console.error('❌ Token decode error:', error.message);
    return null;
  }
}

export function middleware(request: NextRequest) {
  // Define protected routes
  const protectedPaths = [
    '/api/projects',
    '/api/rooms',
    '/api/designs',
    '/api/uploads',
    '/api/auth/logout'
  ]

  const isProtectedPath = protectedPaths.some(path =>
    request.nextUrl.pathname.startsWith(path)
  )

  if (isProtectedPath) {
    let token: string | undefined;

    // 1. Try to get token from Authorization header (priority)
    const authHeader = request.headers.get('authorization')
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.substring(7)
      console.log('🔑 Token from Authorization header')
    }
    
    // 2. Fallback to cookie if no Authorization header
    if (!token) {
      token = request.cookies.get('auth_token')?.value
      if (token) {
        console.log('🍪 Token from cookie')
      }
    }

    if (!token) {
      console.error('❌ No token found in request')
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Decode JWT (simple check without crypto for Edge compatibility)
    const decoded = decodeJWT(token);
    
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      )
    }
    
    console.log('✅ Token valid for user:', decoded.email)
    
    // Add userId to request headers for API routes
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-user-id', decoded.userId)
    requestHeaders.set('x-user-email', decoded.email)
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/:path*'
  ]
}
