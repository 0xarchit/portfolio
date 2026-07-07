
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

const TRIMMABLE_KEYS_LOW = ['visibilityTimeline', 'focusTimeline', 'dpiChanges', 'networkChanges', 'exitEvents'];
const TRIMMABLE_KEYS_MED = ['resourceLoads', 'buttonClicks', 'fieldEvents', 'longTasks'];
const MAX_STORAGE_BYTES = 4.5 * 1024 * 1024; // 4.5MB threshold (safe under 5MB)

const measureSize = (obj: Record<string, unknown>): number => {
  try {
    return new Blob([JSON.stringify(obj)]).size;
  } catch {
    return 0;
  }
};

const trimStats = (stats: Record<string, unknown>, maxBytes: number): Record<string, unknown> => {
  let current = { ...stats };
  if (measureSize(current) <= maxBytes) return current;

  // Phase 1: trim low-priority arrays to 5 items
  for (const key of TRIMMABLE_KEYS_LOW) {
    if (Array.isArray(current[key]) && current[key]!.length > 5) {
      current = { ...current, [key]: current[key]!.slice(-5) };
    }
  }
  if (measureSize(current) <= maxBytes) return current;

  // Phase 2: drop low-priority entirely
  for (const key of TRIMMABLE_KEYS_LOW) {
    if (current[key]) {
      current = { ...current, [key]: [] };
    }
  }
  if (measureSize(current) <= maxBytes) return current;

  // Phase 3: trim medium-priority to 10 items
  for (const key of TRIMMABLE_KEYS_MED) {
    if (Array.isArray(current[key]) && current[key]!.length > 10) {
      current = { ...current, [key]: current[key]!.slice(-10) };
    }
  }
  if (measureSize(current) <= maxBytes) return current;

  // Phase 4: drop medium-priority entirely
  for (const key of TRIMMABLE_KEYS_MED) {
    if (current[key]) {
      current = { ...current, [key]: [] };
    }
  }
  if (measureSize(current) <= maxBytes) return current;

  // Phase 5: trim clicks/focused/copies to 10
  for (const key of ['clicks', 'focused', 'copies']) {
    if (Array.isArray(current[key]) && current[key]!.length > 10) {
      current = { ...current, [key]: current[key]!.slice(-10) };
    }
  }
  if (measureSize(current) <= maxBytes) return current;

  // Phase 6: drop all arrays except essential stats
  const essential = ['visitorId', 'fingerprintComponents', 'startTime', 'paths', 'screenResolution', 'localTimezone', 'referrer', 'navigatorDetails'];
  const result: Record<string, unknown> = {};
  for (const key of essential) {
    if (current[key] !== undefined) result[key] = current[key];
  }
  result.lastEventTimestamp = current.lastEventTimestamp;
  result._trimmed = true;
  return result;
};

export const writeSessionStats = (stats: Record<string, unknown>) => {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (e) {
    if (e instanceof DOMException && e.name === 'QuotaExceededError') {
      const trimmed = trimStats(stats, MAX_STORAGE_BYTES);
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
      } catch {
        // Last resort: clear and write minimal
        sessionStorage.clear();
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
          visitorId: stats.visitorId,
          startTime: stats.startTime,
          _emergency: true,
        }));
      }
    }
  }
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
