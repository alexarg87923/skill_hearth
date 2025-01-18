import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import axios from 'axios';

export async function middleware(request: NextRequest) {
    console.log(`Middleware triggered for path: ${request.nextUrl.pathname}`);
	const session = request.cookies.get('session')?.value;

	if (!session) {
		return NextResponse.redirect(new URL('/login', request.url));
	}

	return NextResponse.next();
};

export const config = {
    matcher: [
        '/dashboard'
    ],
};
