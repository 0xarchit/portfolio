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

const rateLimit = new Map<string, { count: number; lastReset: number }>();

const RATE_LIMIT_WINDOW = 60 * 60 * 1000;
const MAX_REQUESTS = 5;

export async function POST(req: NextRequest) {
  try {
    const originHeader = req.headers.get('origin');
    const refererHeader = req.headers.get('referer');
    const allowedHosts = ['0xarchit.is-a.dev', 'localhost', '127.0.0.1'];
    const verifyHost = (url: string | null) => {
        if (!url) return false;
        try { return allowedHosts.includes(new URL(url).hostname); } catch { return false; }
    };
    if (!verifyHost(originHeader) && !verifyHost(refererHeader)) {
      return NextResponse.json({ error: 'Unauthorized origin' }, { status: 403 });
    }

    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();
    const userLimit = rateLimit.get(ip) || { count: 0, lastReset: now };
    if (now - userLimit.lastReset > RATE_LIMIT_WINDOW) { userLimit.count = 0; userLimit.lastReset = now; }
    if (userLimit.count >= MAX_REQUESTS) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }
    userLimit.count++;
    rateLimit.set(ip, userLimit);

    const data = await req.json();
    const { name, email, telegram, message, company_not_required, startTime, captchaToken, sessionStats, requestTimestampMs, submitPoint, clientContext } = data;

    if (company_not_required) return NextResponse.json({ success: true });

    const submissionTime = Date.now();
    const timeToSubmit = submissionTime - (startTime || submissionTime);
    if (timeToSubmit < 2000) {
      console.warn(`Spam detected: Submission too fast (${timeToSubmit}ms)`);
      return NextResponse.json({ success: true });
    }

    let captchaScore = 0;
    const CAPTCHA_SECRET = process.env.CAPTCHA_SECRET;
    if (CAPTCHA_SECRET && captchaToken) {
       try {
         const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${CAPTCHA_SECRET}&response=${captchaToken}`;
         const verifyRes = await fetch(verifyUrl, { method: 'POST' });
         const verifyData = await verifyRes.json();
         if (verifyData.success) captchaScore = verifyData.score;
         else console.warn('Captcha verification failed:', verifyData['error-codes']);
       } catch (e) { console.warn('Captcha error:', e); }
    }
    if (CAPTCHA_SECRET && captchaScore < 0.3) {
      console.warn(`Spam detected: Low Captcha Score (${captchaScore})`);
      return NextResponse.json({ success: true });
    }

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (message.length > 1000) {
      return NextResponse.json({ error: 'Message exceeds 1000 characters' }, { status: 400 });
    }

    const userAgent = req.headers.get('user-agent') || 'Unknown';
    let location = req.headers.get('cf-ipcountry') || req.headers.get('x-vercel-ip-country') || 'Unknown';
    let city = req.headers.get('cf-ipcity') || req.headers.get('x-vercel-ip-city') || 'Unknown';
    let region = req.headers.get('cf-region-code') || req.headers.get('x-vercel-ip-country-region') || 'Unknown';
    let ipDetails = '';
    const headers = {
        referer: req.headers.get('referer') || 'N/A',
        acceptLanguage: req.headers.get('accept-language') || 'N/A',
        secChUaPlatform: req.headers.get('sec-ch-ua-platform') || 'N/A',
        secChUaMobile: req.headers.get('sec-ch-ua-mobile') || 'N/A',
        connection: req.headers.get('connection') || 'N/A',
        cfRay: req.headers.get('cf-ray') || 'N/A'
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
            ipDetails = `\n🌍 *Enhanced IP Info:*\n🏢 *Org/ISP:* ${details.org || 'N/A'}\n🏷️ *Hostname:* ${details.hostname || 'N/A'}\n📍 *Coordinates:* ${details.loc || 'N/A'}\n⏰ *Timezone:* ${details.timezone || 'N/A'}\n📮 *Postal:* ${details.postal || 'N/A'}`;
            if (details.asn) ipDetails += `\n🛡️ *ASN:* ${details.asn.asn} (${details.asn.name})`;
            if (details.abuse) ipDetails += `\n⚠️ *Abuse Info:* ${details.abuse.address} (${details.abuse.phone || 'No Phone'})`;
         }
      }
    } catch (e) { console.warn('IPInfo lookup failed:', e); }

    const nav = sessionStats?.navigatorDetails;
    const fp = sessionStats?.fingerprintComponents;

    const formattedMessage = `
📩 *New Contact Form Submission*

👤 *Name:* ${name}
📧 *Email:* ${email}
📱 *Telegram:* ${telegram || 'Not provided'}

📝 *Message:*
${message}

---
🛡️ *Security & Fingerprint:*
🆔 *Visitor ID:* \`${sessionStats?.visitorId || 'Generating...'}\`
🎨 *Canvas Hash:* \`${fp?.canvas ? 'Matched' : 'N/A'}\` (Truncated)
🖥️ *GPU:* ${fp?.webgl || 'N/A'}

Valid Origin: ✅
Honeypot: ✅ (Empty)
Time to Submit: ${timeToSubmit}ms
Captcha Score: ${captchaScore ? captchaScore : 'N/A (Key missing?)'}
Referer: \`${headers.referer}\`
Request Timestamp (ms): ${Date.now()}
Client Timestamp (ms): ${typeof requestTimestampMs === 'number' ? requestTimestampMs : clientContext?.timestampMs || sessionStats?.lastEventTimestamp || 'N/A'}
Client Referrer: \`${clientContext?.referrer || sessionStats?.referrer || headers.referer}\`
Client UA: \`${clientContext?.userAgent || nav?.userAgent || userAgent}\`
Client TZ: ${clientContext?.localTimezone || sessionStats?.localTimezone || 'N/A'}
Submit Coordinates: ${submitPoint?.x ?? 'N/A'}, ${submitPoint?.y ?? 'N/A'}

---
🖱️ *Session Stats:*
${formatSessionStats(sessionStats)}

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
Platform: ${headers.secChUaPlatform} (Mobile: ${headers.secChUaMobile})
${formatNavigatorInfo(nav)}
${ipDetails}
`;

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
        console.error('Telegram credentials missing');
        return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 500 });
    }

    await sendTelegramMessage(formattedMessage);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
