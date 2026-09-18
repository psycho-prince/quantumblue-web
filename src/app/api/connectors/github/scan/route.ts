import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  try {
    const authResult = await auth().catch(e => ({ error: e.message }));
    if ('error' in authResult) {
      return NextResponse.json({ error: 'Auth failed' }, { status: 401 });
    }

    // Pass the auth token directly to the Go daemon
    const authHeader = req.headers.get('authorization');
    
    const body = await req.json();

    const daemonUrl = process.env.DAEMON_URL || "http://localhost:8080";
    const res = await fetch(`${daemonUrl}/v1/connectors/github/scan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authHeader || ""
      },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });

  } catch (error) {
    console.error('Connector proxy error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
