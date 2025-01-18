import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import axios from 'axios';

export async function middleware(request: NextRequest) {
    console.log(`Middleware triggered for path: ${request.nextUrl.pathname}`);
	const sessionCookie = request.cookies.get('session')?.value;
	console.log(`${request.nextUrl.host}/login`);
	console.log(`${request.nextUrl.host}/api${request.nextUrl.pathname}`);
    if (!sessionCookie) {
      return NextResponse.redirect(`${request.nextUrl.protocol}://${request.nextUrl.host}/login`);
    }

	const verifyResponse = await axios.get(`${request.nextUrl.protocol}://${request.nextUrl.host}/api${request.nextUrl.pathname}`, {
		headers: {
			Cookie: `session=${sessionCookie}`
		  }
	});

	if (verifyResponse.status !== 200) {
		return NextResponse.redirect(`${request.nextUrl.host}/login`);
	}

	return NextResponse.next();
};

export const config = {
    matcher: [
        '/dashboard'
    ],
};
