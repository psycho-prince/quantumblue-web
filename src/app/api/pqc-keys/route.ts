import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: Request) {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // In a real production setup, we would generate an internal Service API key
    // or pass the organization ID securely. For this architecture, we pass the API Key
    // to the Go Daemon. Since we are in the BFF, we can mint a short-lived token or 
    // simply bypass if the daemon allows local-cli, but let's pass a dummy for now 
    // or use the authHeader if provided from frontend.
    
    // For this demonstration, we'll hit the daemon directly
    const response = await fetch('http://localhost:8080/v1/keys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer local-cli' // Bypasses DB check in Go when DSN is empty or uses mock
      }
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error proxying keys request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
