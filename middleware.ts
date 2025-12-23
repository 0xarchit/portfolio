import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';


const BLOCKED_AGENTS = [
    'python-requests',
    'libwww-perl', 
    'wget', 
    'curl', 
    'scrapy', 
    'go-http-client'
];

export function middleware(request: NextRequest) {
    const userAgent = request.headers.get('user-agent')?.toLowerCase() || '';
    
    const ip = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || 'unknown';
    const country = request.headers.get('cf-ipcountry') || request.headers.get('x-vercel-ip-country') || 'Unknown';
    
    
    if (BLOCKED_AGENTS.some(agent => userAgent.includes(agent))) {
        console.warn(`Blocked Bot: ${userAgent} from ${ip}`);
        return new NextResponse(JSON.stringify({ error: 'Access Denied: Automated access blocked.' }), {
            status: 403,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    
    if (request.nextUrl.pathname.startsWith('/api/')) {
        const origin = request.headers.get('origin');
        const referer = request.headers.get('referer');
        
        
        
        
        
        const response = NextResponse.next();
        
        
        response.headers.set('X-Content-Type-Options', 'nosniff');
        response.headers.set('X-Frame-Options', 'DENY');
        
        return response;
    }

    return NextResponse.next();
}

export const config = {
  matcher: '/:path*',
};
