import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  const apiUrl = process.env.DATA_API_URL;
  if (!apiUrl) {
    return NextResponse.json({ error: 'DATA_API_URL is not configured' }, { status: 500 });
  }

  try {
    const res = await fetch(`${apiUrl}/v1/all`, {
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Upstream error: ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Error fetching portfolio data' },
      { status: 500 }
    );
  }
}
