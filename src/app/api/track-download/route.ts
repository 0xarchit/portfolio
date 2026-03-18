import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

const TELEGRAM_BOT_TOKEN = process.env.BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const TELEMETRY_PREVIEW_LIMIT = 8;
const TELEGRAM_MAX_MESSAGE_LENGTH = 3500;

const summarizeEvents = (
  items: unknown,
  formatter: (value: Record<string, unknown>) => string
) => {
  if (!Array.isArray(items) || items.length === 0) {
    return '  (None)';
  }

  return items
    .slice(-TELEMETRY_PREVIEW_LIMIT)
    .map((item) =>
      item && typeof item === 'object'
        ? `  - ${formatter(item as Record<string, unknown>)}`
        : '  - (Invalid event)'
    )
    .join('\n');
};

const splitTelegramMessage = (text: string, maxLength: number) => {
  if (text.length <= maxLength) {
    return [text];
  }

  const chunks: string[] = [];
  const lines = text.split('\n');
  let current = '';

  for (const line of lines) {
    const candidate = current ? `${current}\n${line}` : line;
    if (candidate.length <= maxLength) {
      current = candidate;
      continue;
    }

    if (current) {
      chunks.push(current);
      current = '';
    }

    if (line.length <= maxLength) {
      current = line;
      continue;
    }

    let start = 0;
    while (start < line.length) {
      chunks.push(line.slice(start, start + maxLength));
      start += maxLength;
    }
  }

  if (current) {
    chunks.push(current);
  }

  return chunks;
};

const sendTelegramChunk = async (
  telegramUrl: string,
  chatId: string,
  text: string,
  useMarkdown: boolean
) => {
  return fetch(telegramUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      ...(useMarkdown ? { parse_mode: 'Markdown' } : {}),
    }),
  });
};

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
            
            ipDetails = `
            \n🌍 *Enhanced IP Info:*
            🏢 *Org/ISP:* ${details.org || 'N/A'}
            🏷️ *Hostname:* ${details.hostname || 'N/A'}
            📍 *Coordinates:* ${details.loc || 'N/A'}
            `;
         }
      }
    } catch (e) {
      console.warn('IPInfo lookup failed:', e);
    }

    let sessionStats = null;
    let requestTimestampMs: number | null = null;
    let downloadStartedAt: number | null = null;
    let clickPoint: { x?: number; y?: number } | null = null;
    let clientContext: Record<string, unknown> | null = null;
    try {
      const body = await req.json();
      sessionStats = body.sessionStats;
      requestTimestampMs =
        typeof body.requestTimestampMs === 'number'
          ? body.requestTimestampMs
          : null;
      downloadStartedAt =
        typeof body.downloadStartedAt === 'number'
          ? body.downloadStartedAt
          : null;
      clickPoint =
        body.clickPoint && typeof body.clickPoint === 'object'
          ? body.clickPoint
          : null;
      clientContext =
        body.clientContext && typeof body.clientContext === 'object'
          ? body.clientContext
          : null;
    } catch (parseError) {
      console.warn('Track download payload parse error:', parseError);
    }


    const nav = sessionStats?.navigatorDetails;
    const buttonClicks = sessionStats?.buttonClicks;
    const fieldEvents = sessionStats?.fieldEvents;
    const downloadEvents = sessionStats?.downloadEvents;
    const errorCodes = sessionStats?.errorCodes;
    const navigatorInfo = nav ? `
💻 *Navigator Details:*
  • UA: ${nav.userAgent}
  • Platform: ${nav.platform}
  • Language: ${nav.language} (${nav.languages?.join(', ') || ''})
  • Cores: ${nav.hardwareConcurrency} | Memory: ${nav.deviceMemory || '?'} GB
  • Vendor: ${nav.vendor}
  • Touch Points: ${nav.maxTouchPoints}
  ${nav.connection ? `• Network: ${nav.connection.effectiveType} (Down: ${nav.connection.downlink}Mbps, RTT: ${nav.connection.rtt}ms)` : ''}
    ` : '';

    const buttonClickSummary = summarizeEvents(buttonClicks, (item) => {
      const target = typeof item.target === 'string' ? item.target : 'unknown';
      const x = typeof item.x === 'number' ? item.x : 0;
      const y = typeof item.y === 'number' ? item.y : 0;
      const timestamp =
        typeof item.timestampMs === 'number' ? item.timestampMs : Date.now();
      const path = typeof item.path === 'string' ? item.path : 'unknown';
      return `[${path}] ${target} @ (${x}, ${y}) at ${timestamp}`;
    });

    const fieldEventSummary = summarizeEvents(fieldEvents, (item) => {
      const field = typeof item.field === 'string' ? item.field : 'unknown';
      const type = typeof item.type === 'string' ? item.type : 'unknown';
      const timestamp =
        typeof item.timestampMs === 'number' ? item.timestampMs : Date.now();
      const path = typeof item.path === 'string' ? item.path : 'unknown';
      return `[${path}] ${type.toUpperCase()} ${field} at ${timestamp}`;
    });

    const downloadEventSummary = summarizeEvents(downloadEvents, (item) => {
      const resource =
        typeof item.resource === 'string' ? item.resource : 'unknown';
      const status = typeof item.status === 'string' ? item.status : 'unknown';
      const timestamp =
        typeof item.timestampMs === 'number' ? item.timestampMs : Date.now();
      const errorCode =
        typeof item.errorCode === 'string' ? ` (error: ${item.errorCode})` : '';
      return `${resource} ${status.toUpperCase()} at ${timestamp}${errorCode}`;
    });

    const errorCodeSummary = summarizeEvents(errorCodes, (item) => {
      const code = typeof item.code === 'string' ? item.code : 'UNKNOWN';
      const context =
        typeof item.context === 'string' ? item.context : 'unspecified';
      const timestamp =
        typeof item.timestampMs === 'number' ? item.timestampMs : Date.now();
      return `${code} in ${context} at ${timestamp}`;
    });

    const formattedMessage = `
📄 *Resume Downloaded!*

Someone just downloaded your resume.

---
🛡️ *Security & Fingerprint:*
🆔 *Visitor ID:* \`${sessionStats?.visitorId || 'Generating...'}\`
🎨 *Canvas Hash:* \`${sessionStats?.fingerprintComponents?.canvas ? 'Matched' : 'N/A'}\` (Truncated)
🖥️ *GPU:* ${sessionStats?.fingerprintComponents?.webgl || 'N/A'}

---
🖱️ *Session Stats:*
Time on Page: ${(sessionStats?.totalTime / 1000).toFixed(1) || '0'}s
Scroll Depth: ${sessionStats?.maxScroll || 0}%
Screen Res: ${sessionStats?.screenResolution || 'N/A'}
Client TZ: ${sessionStats?.localTimezone || clientContext?.localTimezone || 'N/A'}
Client Referrer: \`${sessionStats?.referrer || clientContext?.referrer || headers.referer}\`
Client Timestamp (ms): ${requestTimestampMs || clientContext?.timestampMs || sessionStats?.lastEventTimestamp || 'N/A'}
Download Start (ms): ${downloadStartedAt || 'N/A'}
Download Click Point: ${clickPoint?.x ?? 'N/A'}, ${clickPoint?.y ?? 'N/A'}
Copies:
${(sessionStats?.copies && Array.isArray(sessionStats.copies) && sessionStats.copies.length > 0) ? sessionStats.copies.map((c: string) => `  - ${c}`).join('\n') : '  (None)'}
Clicks: 
${(sessionStats?.clicks && Array.isArray(sessionStats.clicks) && sessionStats.clicks.length > 0) ? sessionStats.clicks.map((c: string) => `  - ${c}`).join('\n') : '  (None)'}
Focused Areas: 
${(sessionStats?.focused && Array.isArray(sessionStats.focused) && sessionStats.focused.length > 0) ? sessionStats.focused.map((f: string) => `  - ${f}`).join('\n') : '  (None)'}
Path History:
${(sessionStats?.paths && Array.isArray(sessionStats.paths)) ? sessionStats.paths.join(' -> ') : 'Unknown'}
Button Coordinates:
${buttonClickSummary}
Field Focus/Blur:
${fieldEventSummary}
Download Events:
${downloadEventSummary}
Error Codes:
${errorCodeSummary}

---
🕵️ *User Details:*
IP: \`${ip}\`
Location: ${city}, ${region}, ${location}
Device/Agent: ${userAgent}
Screen Res: ${sessionStats?.screenResolution || 'N/A'}
Platform: ${headers.secChUaPlatform}
Referer: \`${headers.referer}\`
${navigatorInfo}
${ipDetails}
`;

    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
        const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        const chunks = splitTelegramMessage(
          formattedMessage,
          TELEGRAM_MAX_MESSAGE_LENGTH
        );

        for (let index = 0; index < chunks.length; index++) {
          const chunk = chunks[index];
          const totalParts = chunks.length;
          const text =
            totalParts > 1
              ? `📨 *Part ${index + 1}/${totalParts}*\n\n${chunk}`
              : chunk;

          let telegramResponse = await sendTelegramChunk(
            telegramUrl,
            TELEGRAM_CHAT_ID,
            text,
            true
          );

          if (!telegramResponse.ok) {
            const telegramError = await telegramResponse.text();
            const shouldRetryAsPlainText = telegramError.includes(
              "can't parse entities"
            );

            if (shouldRetryAsPlainText) {
              const plainText =
                totalParts > 1 ? `Part ${index + 1}/${totalParts}\n\n${chunk}` : chunk;
              telegramResponse = await sendTelegramChunk(
                telegramUrl,
                TELEGRAM_CHAT_ID,
                plainText,
                false
              );
            } else {
              console.error(
                `Telegram API Error (track-download part ${index + 1}/${totalParts}):`,
                telegramError
              );
            }
          }

          if (!telegramResponse.ok) {
            console.error(
              `Telegram API Error (track-download part ${index + 1}/${totalParts}):`,
              await telegramResponse.text()
            );
            throw new Error('Failed to send telegram message');
          }
        }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Track download error:', error);
    
    return NextResponse.json({ success: true }, { status: 200 });
  }
}
