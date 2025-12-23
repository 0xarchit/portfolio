import { NextRequest, NextResponse } from 'next/server';

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
    try {
        const body = await req.json();
        sessionStats = body.sessionStats;
    } catch {
        
    }


    const nav = sessionStats?.navigatorDetails;
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
Copies:
${(sessionStats?.copies && Array.isArray(sessionStats.copies) && sessionStats.copies.length > 0) ? sessionStats.copies.map((c: string) => `  - ${c}`).join('\n') : '  (None)'}
Clicks: 
${(sessionStats?.clicks && Array.isArray(sessionStats.clicks) && sessionStats.clicks.length > 0) ? sessionStats.clicks.map((c: string) => `  - ${c}`).join('\n') : '  (None)'}
Focused Areas: 
${(sessionStats?.focused && Array.isArray(sessionStats.focused) && sessionStats.focused.length > 0) ? sessionStats.focused.map((f: string) => `  - ${f}`).join('\n') : '  (None)'}
Path History:
${(sessionStats?.paths && Array.isArray(sessionStats.paths)) ? sessionStats.paths.join(' -> ') : 'Unknown'}

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
        
        await fetch(telegramUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: formattedMessage,
                parse_mode: 'Markdown',
            }),
        });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Track download error:', error);
    
    return NextResponse.json({ success: true }, { status: 200 });
  }
}
