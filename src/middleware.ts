import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = user ? await supabase.from('profiles').select('role').eq('id', user.id).single() : { data: null }

  const currentPath = request.nextUrl.pathname

  // Protected routes for authenticated users
  const protectedRoutes = ['/dashboard', '/admin']
  if (!user && protectedRoutes.some(path => currentPath.startsWith(path))) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Admin route protection
  if (user && currentPath.startsWith('/admin') && profile?.role !== 'super_admin') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Auth routes for unauthenticated users
  const authRoutes = ['/login', '/register']
  if (user && authRoutes.some(path => currentPath.startsWith(path))) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
