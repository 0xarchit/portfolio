const TELEGRAM_MAX_MESSAGE_LENGTH = 3500;
const TELEMETRY_PREVIEW_LIMIT = 8;

export const summarizeEvents = (
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

export const splitTelegramMessage = (text: string, maxLength: number = TELEGRAM_MAX_MESSAGE_LENGTH) => {
  if (text.length <= maxLength) return [text];
  const chunks: string[] = [];
  const lines = text.split('\n');
  let current = '';
  for (const line of lines) {
    const candidate = current ? `${current}\n${line}` : line;
    if (candidate.length <= maxLength) { current = candidate; continue; }
    if (current) { chunks.push(current); current = ''; }
    if (line.length <= maxLength) { current = line; continue; }
    let start = 0;
    while (start < line.length) { chunks.push(line.slice(start, start + maxLength)); start += maxLength; }
  }
  if (current) chunks.push(current);
  return chunks;
};

export const sendTelegramChunk = async (
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

export const sendTelegramMessage = async (message: string) => {
  const token = process.env.BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) throw new Error('Telegram credentials missing');
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const chunks = splitTelegramMessage(message);
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const total = chunks.length;
    const text = total > 1 ? `📨 *Part ${i + 1}/${total}*\n\n${chunk}` : chunk;
    let res = await sendTelegramChunk(url, chatId, text, true);
    if (!res.ok) {
      const err = await res.text();
      if (err.includes("can't parse entities")) {
        const plain = total > 1 ? `Part ${i + 1}/${total}\n\n${chunk}` : chunk;
        res = await sendTelegramChunk(url, chatId, plain, false);
      }
    }
    if (!res.ok) throw new Error(`Telegram API Error (part ${i + 1}/${total}): ${await res.text()}`);
  }
};
