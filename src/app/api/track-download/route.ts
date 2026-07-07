import { NextRequest, NextResponse } from 'next/server';
import { sendTelegramMessage } from '../utils/telegram';
import {
  formatNavigatorInfo,
  formatAdvancedTelemetry,
  formatUserIdentification,
  formatSessionStats,
} from '../utils/telemetry';

export const runtime = 'edge';

const TELEGRAM_BOT_TOKEN = process.env.BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'Unknown';
    let location = req.headers.get('cf-ipcountry') || req.headers.get('x-vercel-ip-country') || 'Unknown';
    let city = req.headers.get('cf-ipcity') || req.headers.get('x-vercel-ip-city') || 'Unknown';
    let region = req.headers.get('cf-region-code') || req.headers.get('x-vercel-ip-country-region') || 'Unknown';
    let ipDetails = '';
    const headers = {
        referer: req.headers.get('referer') || 'N/A',
        secChUaPlatform: req.headers.get('sec-ch-ua-platform') || 'N/A',
    };
    const realIp = req.headers.get('cf-connecting-ip') || ip;

    try {
      const IPINFO_TOKEN = process.env.IPINFO_TOKEN;
      if (IPINFO_TOKEN && realIp !== 'unknown' && realIp !== '::1') {
         const ipRes = await fetch(`https://ipinfo.io/${realIp}?token=${IPINFO_TOKEN}`);
         const details = await ipRes.json();
         if (details && !details.error) {
            city = details.city || city;
            location = details.country || location;
            region = details.region || region;
            ipDetails = `\n🌍 *Enhanced IP Info:*\n🏢 *Org/ISP:* ${details.org || 'N/A'}\n🏷️ *Hostname:* ${details.hostname || 'N/A'}\n📍 *Coordinates:* ${details.loc || 'N/A'}`;
         }
      }
    } catch (e) { console.warn('IPInfo lookup failed:', e); }

    let sessionStats: Record<string, unknown> | null = null;
    let requestTimestampMs: number | null = null;
    let downloadStartedAt: number | null = null;
    let clickPoint: { x?: number; y?: number } | null = null;
    let clientContext: Record<string, unknown> | null = null;
    try {
      const body = await req.json();
      sessionStats = body.sessionStats;
      requestTimestampMs = typeof body.requestTimestampMs === 'number' ? body.requestTimestampMs : null;
      downloadStartedAt = typeof body.downloadStartedAt === 'number' ? body.downloadStartedAt : null;
      clickPoint = body.clickPoint && typeof body.clickPoint === 'object' ? body.clickPoint : null;
      clientContext = body.clientContext && typeof body.clientContext === 'object' ? body.clientContext : null;
    } catch (parseError) {
      console.warn('Track download payload parse error:', parseError);
    }

    const nav = sessionStats?.navigatorDetails as Record<string, unknown> | undefined;
    const fp = sessionStats?.fingerprintComponents as Record<string, unknown> | undefined;

    const formattedMessage = `
📄 *Resume Downloaded!*

Someone just downloaded your resume.

---
🛡️ *Security & Fingerprint:*
🆔 *Visitor ID:* \`${sessionStats?.visitorId || 'Generating...'}\`
🎨 *Canvas Hash:* \`${fp?.canvas ? 'Matched' : 'N/A'}\` (Truncated)
🖥️ *GPU:* ${fp?.webgl || 'N/A'}

---
🖱️ *Session Stats:*
${formatSessionStats(sessionStats)}
Client TZ: ${sessionStats?.localTimezone || clientContext?.localTimezone || 'N/A'}
Client Referrer: \`${sessionStats?.referrer || clientContext?.referrer || headers.referer}\`
Client Timestamp (ms): ${requestTimestampMs || clientContext?.timestampMs || sessionStats?.lastEventTimestamp || 'N/A'}
Download Start (ms): ${downloadStartedAt || 'N/A'}
Download Click Point: ${clickPoint?.x ?? 'N/A'}, ${clickPoint?.y ?? 'N/A'}

---
🔍 *User Identification:*
${formatUserIdentification(sessionStats)}
---
🧠 *Advanced Telemetry:*
${formatAdvancedTelemetry(sessionStats)}
---
🕵️ *User Details:*
IP: \`${ip}\`
Location: ${city}, ${region}, ${location}
Device/Agent: ${userAgent}
Screen Res: ${sessionStats?.screenResolution || 'N/A'}
Platform: ${headers.secChUaPlatform}
Referer: \`${headers.referer}\`
${formatNavigatorInfo(nav)}
${ipDetails}
`;

    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      await sendTelegramMessage(formattedMessage);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Track download error:', error);
    return NextResponse.json({ success: true }, { status: 200 });
  }
}
