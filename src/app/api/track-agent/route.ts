import { NextRequest, NextResponse } from 'next/server';
import { sendTelegramMessage } from '../utils/telegram';
import { formatAgentTelemetry } from '../utils/telemetry';

export const runtime = 'edge';

const TELEGRAM_BOT_TOKEN = process.env.BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('cf-connecting-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'Unknown';
    const location = req.headers.get('cf-ipcountry') || req.headers.get('x-vercel-ip-country') || 'Unknown';
    const city = req.headers.get('cf-ipcity') || req.headers.get('x-vercel-ip-city') || 'Unknown';

    let body: Record<string, unknown> = {};
    try {
      body = await req.json();
    } catch {
      // Empty or invalid payload
    }

    const toolName = typeof body.toolName === 'string' ? body.toolName : 'unknown';
    const visitorId = (body.sessionStats as Record<string, unknown> | undefined)?.visitorId || 'anonymous';

    const message = `
${formatAgentTelemetry(body)}
🌐 *Agent Client Context:*
• IP: \`${ip}\`
• Location: ${city}, ${location}
• User-Agent: \`${userAgent.slice(0, 150)}\`
• Visitor ID: \`${visitorId}\`
• Timestamp: ${new Date().toISOString()}
`;

    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      await sendTelegramMessage(message);
    }

    return NextResponse.json({ ok: true, tool: toolName });
  } catch (error) {
    console.error('Track agent error:', error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
