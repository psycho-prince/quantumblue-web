import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const daemonUrl = process.env.DAEMON_URL || 'http://localhost:8080';
    const response = await fetch(`${daemonUrl}/v1/cbom`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error proxying cbom request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
