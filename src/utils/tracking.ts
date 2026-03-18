
export const STORAGE_KEY = 'user_session_stats';

export const getElementName = (target: EventTarget | null): string => {
  if (!target || !(target instanceof HTMLElement)) return 'unknown';

  const closest = target.closest('button, a, input, textarea, [role="button"]');
  const el = closest instanceof HTMLElement ? closest : target;

  const txt = el.innerText?.slice(0, 30).replace(/\n/g, ' ').trim();
  const label = el.getAttribute('aria-label');
  const id = el.id;
  const cls = el.className?.split(' ').filter((c) => c !== ' ').pop();
  const placeholder = el.getAttribute('placeholder');

  if (label) return `Label: ${label}`;
  if (txt) return `Text: "${txt}"`;
  if (placeholder) return `Placeholder: "${placeholder}"`;
  if (id) return `#${id}`;
  if (cls) return `.${cls}`;
  return el.tagName.toLowerCase();
};

export const readSessionStats = (): Record<string, unknown> => {
  if (typeof window === 'undefined') return {};
  try {
    const existing = sessionStorage.getItem(STORAGE_KEY);
    return existing ? (JSON.parse(existing) as Record<string, unknown>) : {};
  } catch {
    return {};
  }
};

export const writeSessionStats = (stats: Record<string, unknown>) => {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
};

export const updateSessionStats = (
  updater: (prev: Record<string, unknown>) => Record<string, unknown>
) => {
  const prev = readSessionStats();
  const next = updater(prev);
  writeSessionStats(next);
  return next;
};

export const appendSessionEvent = (
  key: string,
  event: Record<string, unknown>,
  limit: number
) => {
  updateSessionStats((prev) => {
    const current = Array.isArray(prev[key]) ? (prev[key] as Record<string, unknown>[]) : [];
    return {
      ...prev,
      [key]: [...current, event].slice(-limit),
      lastEventTimestamp: Date.now(),
    };
  });
};

export const appendSessionErrorCode = (code: string, context: string) => {
  appendSessionEvent(
    'errorCodes',
    { code, context, timestampMs: Date.now() },
    50
  );
};

export const getClientContext = () => {
  if (typeof window === 'undefined') {
    return {
      timestampMs: Date.now(),
      userAgent: 'unknown',
      referrer: 'N/A',
      screenResolution: 'unknown',
      localTimezone: 'unknown',
    };
  }

  return {
    timestampMs: Date.now(),
    userAgent: navigator.userAgent || 'unknown',
    referrer: document.referrer || 'N/A',
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    localTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'unknown',
  };
};
