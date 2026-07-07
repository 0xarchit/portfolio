/* eslint-disable @typescript-eslint/no-explicit-any */
import { summarizeEvents } from './telegram';

export const formatNavigatorInfo = (nav: any) => {
  if (!nav) return '';
  return `\n💻 *Navigator Details:*
  • UA: ${nav.userAgent}
  • Platform: ${nav.platform}
  • Language: ${nav.language} (${nav.languages?.join(', ') || ''})
  • Cores: ${nav.hardwareConcurrency} | Memory: ${nav.deviceMemory || '?'} GB
  • Vendor: ${nav.vendor}
  • Touch Points: ${nav.maxTouchPoints}
  ${nav.connection ? `• Network: ${nav.connection.effectiveType} (Down: ${nav.connection.downlink}Mbps, RTT: ${nav.connection.rtt}ms)` : ''}
    `;
};

export const formatDisplayInfo = (dp: any) => {
  if (!dp) return '';
  return `\n🎨 *Display Profile:*
  • Color Scheme: ${dp.prefersColorScheme}
  • Contrast: ${dp.prefersContrast}
  • Dynamic Range: ${dp.dynamicRange}
  • Color Gamut: ${dp.colorGamut}
  • Reduced Motion: ${dp.prefersReducedMotion ? 'Yes' : 'No'}
    `;
};

export const formatCssInfo = (cssSupports: Record<string, boolean> | undefined) => {
  if (!cssSupports) return '';
  return `\n🧩 *CSS Features:*
  ${Object.entries(cssSupports).map(([k, v]) => `• ${k}: ${v ? '✅' : '❌'}`).join('\n  ')}
    `;
};

export const formatStorageInfo = (sq: any) => {
  if (!sq) return '';
  return `\n💾 *Storage:*
  • Used: ${(sq.usage / 1024 / 1024).toFixed(1)}MB / ${(sq.quota / 1024 / 1024 / 1024).toFixed(1)}GB (${((sq.usage / sq.quota) * 100).toFixed(2)}%)
    `;
};

export const formatLongTaskInfo = (tasks: any[] | undefined) => {
  if (!tasks || tasks.length === 0) return '';
  return `\n🐢 *Long Tasks (${tasks.length}):*
  ${tasks.slice(-5).map((t: any) => `• ${t.duration}ms @ ${Math.round(t.startTime)}ms`).join('\n  ')}
    `;
};

export const formatMemInfo = (mem: any) => {
  if (!mem) return '';
  return `\n🧠 *Memory:* ${(mem.usedJSHeapSize / 1024 / 1024).toFixed(1)}MB used / ${(mem.totalJSHeapSize / 1024 / 1024).toFixed(1)}MB total / ${(mem.jsHeapSizeLimit / 1024 / 1024).toFixed(0)}MB limit`;
};

export const formatExtraDeviceInfo = (s: any) => {
  const items = [
    s?.orientation ? `• Orientation: ${s.orientation}` : null,
    s?.pixelRatio ? `• Pixel Ratio: ${s.pixelRatio}x` : null,
    s?.colorDepth ? `• Color Depth: ${s.colorDepth}bit` : null,
    s?.historyLength ? `• History Length: ${s.historyLength} pages` : null,
    s?.webdriver ? '• ⚠️ WebDriver: DETECTED (headless bot)' : null,
    s?.adBlockDetected ? '• 🛡️ Ad Blocker: Detected' : null,
    s?.languageDelta ? '• Multi-Language: Yes (languages differ)' : null,
    s?.intlOptions ? `• Calendar: ${s.intlOptions.calendar} | Numbering: ${s.intlOptions.numberingSystem}` : null,
  ].filter(Boolean).join('\n  ');
  return items ? `\n📱 *Extra Device Info:*\n  ${items}` : '';
};

export const formatVisTimeline = (vt: any[] | undefined) => {
  if (!vt || vt.length === 0) return '';
  return `\n👁️ *Visibility Timeline (${vt.length} changes):*
  ${vt.slice(-8).map((v: any) => `• ${v.state} @ ${v.timestampMs}`).join('\n  ')}`;
};

export const formatFocusTimeline = (ft: any[] | undefined) => {
  if (!ft || ft.length === 0) return '';
  return `\n🎯 *Focus Timeline (${ft.length} changes):*
  ${ft.slice(-8).map((f: any) => `• ${f.type} @ ${f.timestampMs}`).join('\n  ')}`;
};

export const formatExitInfo = (ee: any[] | undefined) => {
  if (!ee || ee.length === 0) return '';
  return `\n🚪 *Exit Events:*
  ${ee.map((e: any) => `• ${e.type} @ ${e.timestampMs}`).join('\n  ')}`;
};

export const formatDpiChanges = (dc: any[] | undefined) => {
  if (!dc || dc.length === 0) return '';
  return `\n🔍 *DPI Changes:*
  ${dc.map((d: any) => `• ${d.ratio}x @ ${d.timestampMs}`).join('\n  ')}`;
};

export const formatResourceInfo = (rl: any[] | undefined) => {
  if (!rl || rl.length === 0) return '';
  return `\n📦 *Resources Loaded (${rl.length}):*
  ${rl.slice(-10).map((r: any) => `• ${r.name} (${r.initiatorType}) ${r.duration}ms ${r.transferSize > 0 ? (r.transferSize / 1024).toFixed(1) + 'KB' : ''}`).join('\n  ')}`;
};

export const formatPerfMetrics = (s: any) => {
  const items = [
    s?.fcpMs ? `• FCP: ${s.fcpMs}ms` : null,
    s?.clsScore !== undefined ? `• CLS: ${s.clsScore.toFixed(3)}` : null,
    s?.fidMs !== undefined ? `• FID: ${s.fidMs}ms` : null,
  ].filter(Boolean).join('\n  ');
  return items ? `\n⚡ *Performance Metrics:*\n  ${items}` : '';
};

export const formatNavTimings = (nt: any) => {
  if (!nt) return '';
  return `\n🌐 *Navigation Breakdown:*
  • DNS: ${nt.dns}ms
  • TCP: ${nt.tcp}ms
  • TLS: ${nt.tls}ms
  • TTFB: ${nt.ttfb}ms
  • Download: ${nt.download}ms
  • DOM Interactive: ${nt.domInteractive}ms
  • DOM Complete: ${nt.domComplete}ms
  • Load Event: ${nt.loadEvent}ms`;
};

export const formatNetworkChanges = (nc: any[] | undefined) => {
  if (!nc || nc.length === 0) return '';
  return `\n📶 *Network Changes (${nc.length}):*
  ${nc.map((c: any) => `• ${c.effectiveType} (${c.downlink}Mbps) @ ${c.timestampMs}`).join('\n  ')}`;
};

export const formatBrowserCaps = (s: any) => {
  const items = [
    s?.pluginCount !== undefined ? `• Plugins: ${s.pluginCount}` : null,
    s?.mimeTypeCount !== undefined ? `• MIME Types: ${s.mimeTypeCount}` : null,
    s?.crossOriginIsolated ? '• Cross-Origin Isolated: Yes' : null,
    s?.webCrypto ? '• WebCrypto: Yes' : null,
    s?.webXR ? '• WebXR: Yes' : null,
    s?.bluetooth ? '• Bluetooth API: Yes' : null,
    s?.usb ? '• USB API: Yes' : null,
    s?.paymentRequest ? '• PaymentRequest: Yes' : null,
    s?.barcodeDetector ? '• BarcodeDetector: Yes' : null,
  ].filter(Boolean).join('\n  ');
  return items ? `\n🧩 *Browser Capabilities:*\n  ${items}` : '';
};

export const formatUaData = (ua: any) => {
  if (!ua) return '';
  return `\n🔍 *UserAgent Data (Client Hints):*
  • Brands: ${ua.brands.join(', ')}
  • Mobile: ${ua.mobile}
  • Platform: ${ua.platform}`;
};

export const formatPrivacySignals = (s: any) => {
  const items = [
    s?.globalPrivacyControl ? '• GPC: Enabled' : null,
    s?.doNotTrack ? `• DNT: ${s.doNotTrack}` : null,
    s?.cookiesEnabled === false ? '• Cookies: Disabled' : null,
    s?.notificationPermission ? `• Notifications: ${s.notificationPermission}` : null,
  ].filter(Boolean).join('\n  ');
  return items ? `\n🔒 *Privacy Signals:*\n  ${items}` : '';
};

export const formatDisplayContext = (s: any) => {
  const items = [
    s?.outerWidth ? `• Window: ${s.outerWidth}x${s.outerHeight}` : null,
    s?.availWidth ? `• Available: ${s.availWidth}x${s.availHeight}` : null,
    s?.pointerCoarse !== undefined ? `• Pointer: ${s.pointerCoarse ? 'Coarse (touch)' : 'Fine (mouse)'}` : null,
    s?.hoverHover !== undefined ? `• Hover: ${s.hoverHover ? 'Yes' : 'No'}` : null,
    s?.isSecureContext !== undefined ? `• Secure Context: ${s.isSecureContext ? 'Yes' : 'No'}` : null,
    s?.characterSet ? `• Charset: ${s.characterSet}` : null,
    s?.textDirection ? `• Dir: ${s.textDirection}` : null,
    s?.fontsReady !== undefined ? `• Fonts Loaded: ${s.fontsReady ? 'Yes' : 'No'}` : null,
  ].filter(Boolean).join('\n  ');
  return items ? `\n🖥️ *Display Context:*\n  ${items}` : '';
};

export const formatBotHuman = (s: any) => {
  const items = [
    s?.serviceWorkerActive ? '• Service Worker: Active' : null,
    s?.framesLength !== undefined ? `• Frames: ${s.framesLength}` : null,
    s?.headMutations !== undefined ? `• Head Mutations: ${s.headMutations}` : null,
    s?.readyStateAtCapture ? `• ReadyState: ${s.readyStateAtCapture}` : null,
  ].filter(Boolean).join('\n  ');
  return items ? `\n🤖 *Bot/Human Signals:*\n  ${items}` : '';
};

export const formatButtonClickSummary = (clicks: any[]) => {
  return summarizeEvents(clicks, (item) => {
    const target = typeof item.target === 'string' ? item.target : 'unknown';
    const x = typeof item.x === 'number' ? item.x : 0;
    const y = typeof item.y === 'number' ? item.y : 0;
    const timestamp = typeof item.timestampMs === 'number' ? item.timestampMs : Date.now();
    const path = typeof item.path === 'string' ? item.path : 'unknown';
    return `[${path}] ${target} @ (${x}, ${y}) at ${timestamp}`;
  });
};

export const formatFieldEventSummary = (events: any[]) => {
  return summarizeEvents(events, (item) => {
    const field = typeof item.field === 'string' ? item.field : 'unknown';
    const type = typeof item.type === 'string' ? item.type : 'unknown';
    const timestamp = typeof item.timestampMs === 'number' ? item.timestampMs : Date.now();
    const path = typeof item.path === 'string' ? item.path : 'unknown';
    return `[${path}] ${type.toUpperCase()} ${field} at ${timestamp}`;
  });
};

export const formatDownloadEventSummary = (events: any[]) => {
  return summarizeEvents(events, (item) => {
    const resource = typeof item.resource === 'string' ? item.resource : 'unknown';
    const status = typeof item.status === 'string' ? item.status : 'unknown';
    const timestamp = typeof item.timestampMs === 'number' ? item.timestampMs : Date.now();
    const errorCode = typeof item.errorCode === 'string' ? ` (error: ${item.errorCode})` : '';
    return `${resource} ${status.toUpperCase()} at ${timestamp}${errorCode}`;
  });
};

export const formatErrorCodeSummary = (events: any[]) => {
  return summarizeEvents(events, (item) => {
    const code = typeof item.code === 'string' ? item.code : 'UNKNOWN';
    const context = typeof item.context === 'string' ? item.context : 'unspecified';
    const timestamp = typeof item.timestampMs === 'number' ? item.timestampMs : Date.now();
    return `${code} in ${context} at ${timestamp}`;
  });
};

// High-value identification
export const formatWebrtcInfo = (ips: string[] | undefined) => {
  if (!ips || ips.length === 0) return '';
  return `\n🌐 *WebRTC Local IPs:*\n  ${ips.map((ip) => `• ${ip}`).join('\n  ')}`;
};

export const formatWebgpuInfo = (info: any) => {
  if (!info) return '';
  const featureStr = info.featureNames.length > 0
    ? info.featureNames.slice(0, 10).join(', ') + (info.featureNames.length > 10 ? ` (+${info.featureNames.length - 10} more)` : '')
    : 'None';
  return `\n🎮 *WebGPU:*
  • Adapter: ${info.adapter}
  • Features: ${featureStr}`;
};

export const formatAudioInfo = (fp: string | undefined) => {
  if (!fp) return '';
  return `\n🔊 *Audio Fingerprint:* \`${fp}\``;
};

export const formatBatteryInfo = (b: any) => {
  if (!b) return '';
  return `\n🔋 *Battery:*
  • Level: ${Math.round(b.level * 100)}%
  • Charging: ${b.charging ? 'Yes' : 'No'}
  • Charging Time: ${b.chargingTime === Infinity ? 'N/A' : Math.round(b.chargingTime / 60) + 'min'}
  • Discharging Time: ${b.dischargingTime === Infinity ? 'N/A' : Math.round(b.dischargingTime / 60) + 'min'}`;
};

// Assemble full telemetry block
export const formatAdvancedTelemetry = (s: any) => {
  return [
    formatDisplayInfo(s?.displayProfile),
    formatCssInfo(s?.cssSupports),
    formatStorageInfo(s?.storageQuota),
    formatLongTaskInfo(s?.longTasks),
    s?.lcpMs ? `⚡ *LCP:* ${s.lcpMs}ms` : '',
    formatMemInfo(s?.memoryInfo),
    formatExtraDeviceInfo(s),
    formatPerfMetrics(s),
    formatNavTimings(s?.navigationTimings),
    formatNetworkChanges(s?.networkChanges),
    formatBrowserCaps(s),
    formatUaData(s?.userAgentData),
    formatPrivacySignals(s),
    formatDisplayContext(s),
    formatBotHuman(s),
    formatVisTimeline(s?.visibilityTimeline),
    formatFocusTimeline(s?.focusTimeline),
    formatExitInfo(s?.exitEvents),
    formatDpiChanges(s?.dpiChanges),
    formatResourceInfo(s?.resourceLoads),
  ].join('');
};

export const formatUserIdentification = (s: any) => {
  return [
    formatWebrtcInfo(s?.webrtcLocalIps),
    formatWebgpuInfo(s?.webgpuInfo),
    formatAudioInfo(s?.audioFingerprint),
    formatBatteryInfo(s?.batteryInfo),
  ].join('');
};

export const formatSessionStats = (s: any) => {
  const arr = (arr: any[]) => Array.isArray(arr) && arr.length > 0;
  return `Time on Page: ${(s?.totalTime / 1000).toFixed(1) || '0'}s
Scroll Depth: ${s?.maxScroll || 0}%
Screen Res: ${s?.screenResolution || 'N/A'}
Copies:
${arr(s?.copies) ? s.copies.map((c: string) => `  - ${c}`).join('\n') : '  (None)'}
Clicks: 
${arr(s?.clicks) ? s.clicks.map((c: string) => `  - ${c}`).join('\n') : '  (None)'}
Focused: 
${arr(s?.focused) ? s.focused.map((c: string) => `  - ${c}`).join('\n') : '  (None)'}
Path History:
${arr(s?.paths) ? s.paths.join(' -> ') : 'Unknown'}
Button Coordinates:
${formatButtonClickSummary(s?.buttonClicks)}
Field Focus/Blur:
${formatFieldEventSummary(s?.fieldEvents)}
Download Events:
${formatDownloadEventSummary(s?.downloadEvents)}
Error Codes:
${formatErrorCodeSummary(s?.errorCodes)}`;
};
