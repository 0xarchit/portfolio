"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getElementName, STORAGE_KEY } from "../utils/tracking";
import { getFingerprint } from "../utils/fingerprint";

export interface NavigatorDetails {
  userAgent: string;
  platform: string;
  language: string;
  languages: string[];
  hardwareConcurrency: number;
  deviceMemory?: number;
  maxTouchPoints: number;
  vendor: string;
  connection?: {
    effectiveType: string;
    downlink: number;
    rtt: number;
    saveData: boolean;
  };
}

export interface DisplayProfile {
  prefersReducedMotion: boolean;
  prefersColorScheme: string;
  prefersContrast: string;
  dynamicRange: string;
  colorGamut: string;
}

export interface VisibilityEntry {
  state: "visible" | "hidden";
  timestampMs: number;
}

export interface FocusEntry {
  type: string;
  timestampMs: number;
}

export interface ExitEntry {
  type: string;
  timestampMs: number;
}

export interface LongTaskEntry {
  duration: number;
  startTime: number;
}

export interface ResourceLoadEntry {
  name: string;
  initiatorType: string;
  duration: number;
  transferSize: number;
}

export interface SessionStats {
  visitorId?: string;
  fingerprintComponents?: Record<string, unknown>;
  clicks: string[];
  focused: string[];
  copies: string[];
  maxScroll: number;
  totalTime: number;
  startTime: number;
  paths: string[];
  screenResolution: string;
  localTimezone?: string;
  referrer?: string;
  buttonClicks?: Array<{
    target: string;
    x: number;
    y: number;
    timestampMs: number;
    path: string;
  }>;
  fieldEvents?: Array<{
    field: string;
    type: "focus" | "blur";
    timestampMs: number;
    path: string;
  }>;
  downloadEvents?: Array<{
    resource: string;
    status: "start" | "complete" | "error";
    timestampMs: number;
    errorCode?: string;
  }>;
  errorCodes?: Array<{
    code: string;
    context: string;
    timestampMs: number;
  }>;
  lastEventTimestamp?: number;
  navigatorDetails?: NavigatorDetails;
  // NEW: no-permission telemetry
  visibilityTimeline?: VisibilityEntry[];
  focusTimeline?: FocusEntry[];
  exitEvents?: ExitEntry[];
  displayProfile?: DisplayProfile;
  cssSupports?: Record<string, boolean>;
  storageQuota?: { usage: number; quota: number };
  longTasks?: LongTaskEntry[];
  lcpMs?: number;
  memoryInfo?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
  orientation?: string;
  pixelRatio?: number;
  colorDepth?: number;
  historyLength?: number;
  intlOptions?: { calendar: string; numberingSystem: string };
  languageDelta?: boolean;
  webdriver?: boolean;
  adBlockDetected?: boolean;
  dpiChanges?: Array<{ ratio: number; timestampMs: number }>;
  resourceLoads?: ResourceLoadEntry[];
  // Performance observers
  fcpMs?: number;
  clsScore?: number;
  fidMs?: number;
  navigationTimings?: {
    dns: number;
    tcp: number;
    tls: number;
    ttfb: number;
    download: number;
    domInteractive: number;
    domComplete: number;
    loadEvent: number;
  };
  // Network timeline
  networkChanges?: Array<{ effectiveType: string; downlink: number; timestampMs: number }>;
  // Browser capabilities
  pluginCount?: number;
  mimeTypeCount?: number;
  crossOriginIsolated?: boolean;
  webCrypto?: boolean;
  webXR?: boolean;
  bluetooth?: boolean;
  usb?: boolean;
  paymentRequest?: boolean;
  barcodeDetector?: boolean;
  userAgentData?: { brands: string[]; mobile: boolean; platform: string } | null;
  // Privacy
  globalPrivacyControl?: boolean;
  doNotTrack?: string | null;
  cookiesEnabled?: boolean;
  notificationPermission?: string;
  // Display/context
  outerWidth?: number;
  outerHeight?: number;
  availWidth?: number;
  availHeight?: number;
  pointerCoarse?: boolean;
  hoverHover?: boolean;
  isSecureContext?: boolean;
  characterSet?: string;
  textDirection?: string;
  fontsReady?: boolean;
  // Bot/human
  serviceWorkerActive?: boolean;
  framesLength?: number;
  headMutations?: number;
  readyStateAtCapture?: string;
  // High-value identification
  webrtcLocalIps?: string[];
  webgpuInfo?: { adapter: string; featureNames: string[] } | null;
  audioFingerprint?: string;
  batteryInfo?: { level: number; charging: boolean; chargingTime: number; dischargingTime: number } | null;
}

export const SessionTracker = () => {
  const pathname = usePathname();

  useEffect(() => {
    const initStats = async () => {
      let stats: SessionStats | null = null;
      try {
        const existing = sessionStorage.getItem(STORAGE_KEY);
        if (existing) {
          stats = JSON.parse(existing);
        }
      } catch (e) {
        console.error("Failed to parse stats", e);
      }

      const nav = typeof navigator !== "undefined" ? navigator : null;
      const conn =
        nav &&
        "connection" in nav &&
        nav.connection &&
        typeof nav.connection === "object"
          ? nav.connection
          : null;

      const navigatorDetails: NavigatorDetails = {
        userAgent: nav?.userAgent || "unknown",
        platform: nav?.platform || "unknown",
        language: nav?.language || "unknown",
        languages: [...(nav?.languages || [])],
        hardwareConcurrency: nav?.hardwareConcurrency || 0,
        deviceMemory:
          nav && "deviceMemory" in nav
            ? (nav as Navigator & { deviceMemory?: number }).deviceMemory
            : undefined,
        maxTouchPoints: nav?.maxTouchPoints || 0,
        vendor: nav?.vendor || "unknown",
        connection: conn
          ? {
              effectiveType:
                "effectiveType" in conn &&
                typeof conn.effectiveType === "string"
                  ? conn.effectiveType
                  : "unknown",
              downlink:
                "downlink" in conn && typeof conn.downlink === "number"
                  ? conn.downlink
                  : 0,
              rtt: "rtt" in conn && typeof conn.rtt === "number" ? conn.rtt : 0,
              saveData:
                "saveData" in conn && typeof conn.saveData === "boolean"
                  ? conn.saveData
                  : false,
            }
          : undefined,
      };

      // --- Display profile ---
      const getMedia = (q: string) => {
        try {
          return window.matchMedia(q).matches;
        } catch {
          return false;
        }
      };
      const displayProfile: DisplayProfile = {
        prefersReducedMotion: getMedia("(prefers-reduced-motion: reduce)"),
        prefersColorScheme: getMedia("(prefers-color-scheme: dark)")
          ? "dark"
          : getMedia("(prefers-color-scheme: light)")
            ? "light"
            : "no-preference",
        prefersContrast: getMedia("(prefers-contrast: more)")
          ? "more"
          : getMedia("(prefers-contrast: less)")
            ? "less"
            : "no-preference",
        dynamicRange: getMedia("(dynamic-range: high)") ? "high" : "standard",
        colorGamut: getMedia("(color-gamut: rec2020)")
          ? "rec2020"
          : getMedia("(color-gamut: p3)")
            ? "p3"
            : "srgb",
      };

      // --- CSS.supports ---
      const cssProps = [
        "backdrop-filter",
        "container-type",
        "has:has",
        "layer",
        "text-wrap: balance",
        "view-transition-name",
        "accent-color",
        "color-mix()",
        "field-sizing",
        "scroll-timeline",
      ];
      const cssSupports: Record<string, boolean> = {};
      for (const prop of cssProps) {
        try {
          cssSupports[prop] = CSS.supports(prop);
        } catch {
          cssSupports[prop] = false;
        }
      }

      // --- Storage quota ---
      let storageQuota = { usage: 0, quota: 0 };
      try {
        if (navigator.storage && navigator.storage.estimate) {
          const est = await navigator.storage.estimate();
          storageQuota = { usage: est.usage || 0, quota: est.quota || 0 };
        }
      } catch {}

      // --- Intl options ---
      const intlOpts = Intl.DateTimeFormat().resolvedOptions();

      // --- Ad blocker detect ---
      let adBlockDetected = false;
      try {
        const testAd = document.createElement("div");
        testAd.className = "adsbox ad-banner pub_300x250";
        testAd.style.cssText =
          "position:absolute;left:-9999px;width:1px;height:1px";
        document.body.appendChild(testAd);
        await new Promise((r) => setTimeout(r, 100));
        adBlockDetected =
          testAd.offsetHeight === 0 ||
          getComputedStyle(testAd).display === "none";
        testAd.remove();
      } catch {}

      // --- Performance: paint ---
      let fcpMs: number | undefined;
      try {
        const paintEntries = performance.getEntriesByType("paint") as PerformancePaintTiming[];
        const fcp = paintEntries.find((e) => e.name === "first-contentful-paint");
        if (fcp) fcpMs = Math.round(fcp.startTime);
      } catch {}

      // --- Performance: CLS ---
      let clsScore = 0;
      try {
        const layoutShifts = performance.getEntriesByType("layout-shift") as PerformanceEntry[];
        for (const entry of layoutShifts) {
          const e = entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number };
          if (!e.hadRecentInput && typeof e.value === "number") clsScore += e.value;
        }
      } catch {}

      // --- Performance: navigation ---
      let navigationTimings: SessionStats["navigationTimings"];
      try {
        const navEntries = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
        if (navEntries.length > 0) {
          const n = navEntries[0];
          navigationTimings = {
            dns: Math.round(n.domainLookupEnd - n.domainLookupStart),
            tcp: Math.round(n.connectEnd - n.connectStart),
            tls: Math.round(n.secureConnectionStart > 0 ? n.connectEnd - n.secureConnectionStart : 0),
            ttfb: Math.round(n.responseStart - n.requestStart),
            download: Math.round(n.responseEnd - n.responseStart),
            domInteractive: Math.round(n.domInteractive),
            domComplete: Math.round(n.domComplete),
            loadEvent: Math.round(n.loadEventEnd),
          };
        }
      } catch {}

      // --- Browser capabilities ---
      const pluginCount = nav?.plugins?.length ?? 0;
      const mimeTypeCount = nav?.mimeTypes?.length ?? 0;
      const crossOriginIsolated = typeof window.crossOriginIsolated === "boolean" ? window.crossOriginIsolated : false;
      const webCrypto = !!(window.crypto && window.crypto.subtle);
      const webXR = nav ? "xr" in nav : false;
      const bluetooth = nav ? "bluetooth" in nav : false;
      const usb = nav ? "usb" in nav : false;
      const paymentRequest = typeof window.PaymentRequest === "function";
      const barcodeDetector = typeof (window as Window & { BarcodeDetector?: unknown }).BarcodeDetector === "function";

      // --- UserAgentData (Client Hints) ---
      let userAgentData: SessionStats["userAgentData"] = null;
      try {
        const uad = (nav as Navigator & { userAgentData?: { brands: Array<{ brand: string }>; mobile: boolean; platform: string } })?.userAgentData;
        if (uad && uad.brands) {
          userAgentData = {
            brands: uad.brands.map((b) => b.brand),
            mobile: uad.mobile,
            platform: uad.platform,
          };
        }
      } catch {}

      // --- Privacy signals ---
      const globalPrivacyControl = nav && "globalPrivacyControl" in nav ? !!(nav as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl : false;
      const doNotTrack = nav?.doNotTrack ?? null;
      const cookiesEnabled = nav?.cookieEnabled ?? true;
      let notificationPermission = "default";
      try {
        if ("Notification" in window) notificationPermission = Notification.permission;
      } catch {}

      // --- Display/context ---
      const outerWidth = window.outerWidth;
      const outerHeight = window.outerHeight;
      const availWidth = window.screen.availWidth;
      const availHeight = window.screen.availHeight;
      const pointerCoarse = getMedia("(pointer: coarse)");
      const hoverHover = getMedia("(hover: hover)");
      const isSecureContext = window.isSecureContext;
      const characterSet = document.characterSet || "unknown";
      const textDirection = document.dir || "ltr";
      let fontsReady = false;
      try {
        await document.fonts.ready;
        fontsReady = document.fonts.size > 0;
      } catch {}

      // --- Bot/human signals ---
      const serviceWorkerActive = !!(navigator.serviceWorker && navigator.serviceWorker.controller);
      const framesLength = window.frames.length;
      const readyStateAtCapture = document.readyState;

      // --- WebRTC local IP leak ---
      let webrtcLocalIps: string[] = [];
      try {
        const pc = new RTCPeerConnection({ iceServers: [] });
        pc.createDataChannel("");
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        await new Promise<void>((resolve) => {
          let found = false;
          pc.onicecandidate = (e) => {
            if (!e.candidate || found) return;
            const candidate = e.candidate.candidate;
            const match = candidate.match(/([0-9]{1,3}\.){3}[0-9]{1,3}/);
            if (match) {
              const ip = match[0];
              if (!webrtcLocalIps.includes(ip)) webrtcLocalIps.push(ip);
            }
            if (webrtcLocalIps.length >= 5 || !candidate) {
              found = true;
              pc.close();
              resolve();
            }
          };
          setTimeout(() => { pc.close(); resolve(); }, 2000);
        });
      } catch {}

      // --- WebGPU info ---
      let webgpuInfo: SessionStats["webgpuInfo"] = null;
      try {
        const gpu = (navigator as Navigator & { gpu?: { requestAdapter?: () => Promise<{ name?: string; features?: unknown }> } }).gpu;
        if (gpu && gpu.requestAdapter) {
          const adapter = await gpu.requestAdapter();
          if (adapter) {
            const featureNames: string[] = [];
            try {
              const features = adapter.features as unknown as { [Symbol.iterator]?: () => Iterator<{ toString(): string }> } | undefined;
              if (features && typeof features[Symbol.iterator] === "function") {
                for (const f of features as Iterable<{ toString(): string }>) {
                  featureNames.push(f.toString());
                }
              }
            } catch {}
            webgpuInfo = {
              adapter: adapter.name || "unknown",
              featureNames,
            };
          }
        }
      } catch {}

      // --- AudioContext fingerprint ---
      let audioFingerprint = "";
      try {
        const AC = window.OfflineAudioContext || (window as Window & { webkitOfflineAudioContext?: typeof OfflineAudioContext }).webkitOfflineAudioContext;
        if (AC) {
          const ctx = new AC(1, 44100, 44100);
          const oscillator = ctx.createOscillator();
          oscillator.type = "triangle";
          oscillator.frequency.setValueAtTime(10000, ctx.currentTime);
          const compressor = ctx.createDynamicsCompressor();
          compressor.threshold.setValueAtTime(-50, ctx.currentTime);
          compressor.knee.setValueAtTime(40, ctx.currentTime);
          compressor.ratio.setValueAtTime(12, ctx.currentTime);
          compressor.attack.setValueAtTime(0, ctx.currentTime);
          compressor.release.setValueAtTime(0.25, ctx.currentTime);
          oscillator.connect(compressor);
          compressor.connect(ctx.destination);
          oscillator.start(0);
          const buffer = await ctx.startRendering();
          const data = buffer.getChannelData(0).slice(4500, 5000);
          let sum = 0;
          for (let i = 0; i < data.length; i++) sum += Math.abs(data[i]);
          audioFingerprint = sum.toFixed(6);
        }
      } catch {}

      // --- Battery status ---
      let batteryInfo: SessionStats["batteryInfo"] = null;
      try {
        const navBattery = navigator as Navigator & { getBattery?: () => Promise<{ level: number; charging: boolean; chargingTime: number; dischargingTime: number }> };
        if (navBattery.getBattery) {
          const battery = await navBattery.getBattery();
          batteryInfo = {
            level: battery.level,
            charging: battery.charging,
            chargingTime: battery.chargingTime,
            dischargingTime: battery.dischargingTime,
          };
        }
      } catch {}

      const newSignals = {
        visibilityTimeline: [] as VisibilityEntry[],
        focusTimeline: [] as FocusEntry[],
        exitEvents: [] as ExitEntry[],
        displayProfile,
        cssSupports,
        storageQuota,
        longTasks: [] as LongTaskEntry[],
        lcpMs: undefined as number | undefined,
        memoryInfo: undefined as SessionStats["memoryInfo"],
        orientation: window.screen.orientation?.type || "unknown",
        pixelRatio: window.devicePixelRatio || 1,
        colorDepth: window.screen.colorDepth || 24,
        historyLength: window.history.length,
        intlOptions: {
          calendar: intlOpts.calendar,
          numberingSystem: intlOpts.numberingSystem,
        },
        languageDelta: nav ? nav.language !== nav.languages?.[0] : false,
        webdriver: !!nav?.webdriver,
        adBlockDetected,
        dpiChanges: [] as Array<{ ratio: number; timestampMs: number }>,
        resourceLoads: [] as ResourceLoadEntry[],
        fcpMs,
        clsScore,
        fidMs: undefined as number | undefined,
        navigationTimings,
        networkChanges: [] as Array<{ effectiveType: string; downlink: number; timestampMs: number }>,
        pluginCount,
        mimeTypeCount,
        crossOriginIsolated,
        webCrypto,
        webXR,
        bluetooth,
        usb,
        paymentRequest,
        barcodeDetector,
        userAgentData,
        globalPrivacyControl,
        doNotTrack,
        cookiesEnabled,
        notificationPermission,
        outerWidth,
        outerHeight,
        availWidth,
        availHeight,
        pointerCoarse,
        hoverHover,
        isSecureContext,
        characterSet,
        textDirection,
        fontsReady,
        serviceWorkerActive,
        framesLength,
        headMutations: 0,
        readyStateAtCapture,
        webrtcLocalIps,
        webgpuInfo,
        audioFingerprint,
        batteryInfo,
      };

      if (!stats) {
        let visitorId = "unknown";
        let fingerprintComponents;

        try {
          const fpData = await getFingerprint();
          visitorId = fpData.visitorId;
          fingerprintComponents = fpData.components;
        } catch (e) {
          console.error("FP gen failed", e);
        }

        const initial: SessionStats = {
          visitorId,
          fingerprintComponents,
          clicks: [],
          focused: [],
          copies: [],
          maxScroll: 0,
          totalTime: 0,
          startTime: Date.now(),
          paths: [pathname],
          screenResolution: `${window.screen.width}x${window.screen.height}`,
          localTimezone:
            Intl.DateTimeFormat().resolvedOptions().timeZone || "unknown",
          referrer: document.referrer || "N/A",
          buttonClicks: [],
          fieldEvents: [],
          downloadEvents: [],
          errorCodes: [],
          lastEventTimestamp: Date.now(),
          navigatorDetails,
          ...newSignals,
        };
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      } else {
        if (!stats.visitorId || stats.visitorId === "unknown") {
          try {
            const fpData = await getFingerprint();
            stats.visitorId = fpData.visitorId;
            stats.fingerprintComponents = fpData.components;
          } catch (e) {
            console.error("FP backfill failed", e);
          }
        }

        stats.navigatorDetails = navigatorDetails;
        stats.localTimezone =
          Intl.DateTimeFormat().resolvedOptions().timeZone || "unknown";
        stats.referrer = document.referrer || stats.referrer || "N/A";
        stats.buttonClicks = stats.buttonClicks || [];
        stats.fieldEvents = stats.fieldEvents || [];
        stats.downloadEvents = stats.downloadEvents || [];
        stats.errorCodes = stats.errorCodes || [];
        stats.lastEventTimestamp = Date.now();
        stats.paths = stats.paths || [];

        // Merge new signals only if not already present
        stats.visibilityTimeline =
          stats.visibilityTimeline || newSignals.visibilityTimeline;
        stats.focusTimeline = stats.focusTimeline || newSignals.focusTimeline;
        stats.exitEvents = stats.exitEvents || newSignals.exitEvents;
        stats.displayProfile =
          stats.displayProfile || newSignals.displayProfile;
        stats.cssSupports = stats.cssSupports || newSignals.cssSupports;
        stats.storageQuota = stats.storageQuota || newSignals.storageQuota;
        stats.longTasks = stats.longTasks || newSignals.longTasks;
        stats.lcpMs = stats.lcpMs ?? newSignals.lcpMs;
        stats.memoryInfo = stats.memoryInfo || newSignals.memoryInfo;
        stats.orientation = stats.orientation || newSignals.orientation;
        stats.pixelRatio = stats.pixelRatio ?? newSignals.pixelRatio;
        stats.colorDepth = stats.colorDepth ?? newSignals.colorDepth;
        stats.historyLength = stats.historyLength ?? newSignals.historyLength;
        stats.intlOptions = stats.intlOptions || newSignals.intlOptions;
        stats.languageDelta = stats.languageDelta ?? newSignals.languageDelta;
        stats.webdriver = stats.webdriver ?? newSignals.webdriver;
        stats.adBlockDetected =
          stats.adBlockDetected ?? newSignals.adBlockDetected;
        stats.dpiChanges = stats.dpiChanges || newSignals.dpiChanges;
        stats.resourceLoads = stats.resourceLoads || newSignals.resourceLoads;
        stats.fcpMs = stats.fcpMs ?? newSignals.fcpMs;
        stats.clsScore = stats.clsScore ?? newSignals.clsScore;
        stats.fidMs = stats.fidMs ?? newSignals.fidMs;
        stats.navigationTimings = stats.navigationTimings || newSignals.navigationTimings;
        stats.networkChanges = stats.networkChanges || newSignals.networkChanges;
        stats.pluginCount = stats.pluginCount ?? newSignals.pluginCount;
        stats.mimeTypeCount = stats.mimeTypeCount ?? newSignals.mimeTypeCount;
        stats.crossOriginIsolated = stats.crossOriginIsolated ?? newSignals.crossOriginIsolated;
        stats.webCrypto = stats.webCrypto ?? newSignals.webCrypto;
        stats.webXR = stats.webXR ?? newSignals.webXR;
        stats.bluetooth = stats.bluetooth ?? newSignals.bluetooth;
        stats.usb = stats.usb ?? newSignals.usb;
        stats.paymentRequest = stats.paymentRequest ?? newSignals.paymentRequest;
        stats.barcodeDetector = stats.barcodeDetector ?? newSignals.barcodeDetector;
        stats.userAgentData = stats.userAgentData ?? newSignals.userAgentData;
        stats.globalPrivacyControl = stats.globalPrivacyControl ?? newSignals.globalPrivacyControl;
        stats.doNotTrack = stats.doNotTrack ?? newSignals.doNotTrack;
        stats.cookiesEnabled = stats.cookiesEnabled ?? newSignals.cookiesEnabled;
        stats.notificationPermission = stats.notificationPermission ?? newSignals.notificationPermission;
        stats.outerWidth = stats.outerWidth ?? newSignals.outerWidth;
        stats.outerHeight = stats.outerHeight ?? newSignals.outerHeight;
        stats.availWidth = stats.availWidth ?? newSignals.availWidth;
        stats.availHeight = stats.availHeight ?? newSignals.availHeight;
        stats.pointerCoarse = stats.pointerCoarse ?? newSignals.pointerCoarse;
        stats.hoverHover = stats.hoverHover ?? newSignals.hoverHover;
        stats.isSecureContext = stats.isSecureContext ?? newSignals.isSecureContext;
        stats.characterSet = stats.characterSet ?? newSignals.characterSet;
        stats.textDirection = stats.textDirection ?? newSignals.textDirection;
        stats.fontsReady = stats.fontsReady ?? newSignals.fontsReady;
        stats.serviceWorkerActive = stats.serviceWorkerActive ?? newSignals.serviceWorkerActive;
        stats.framesLength = stats.framesLength ?? newSignals.framesLength;
        stats.headMutations = stats.headMutations ?? newSignals.headMutations;
        stats.readyStateAtCapture = stats.readyStateAtCapture ?? newSignals.readyStateAtCapture;
        stats.webrtcLocalIps = stats.webrtcLocalIps?.length ? stats.webrtcLocalIps : newSignals.webrtcLocalIps;
        stats.webgpuInfo = stats.webgpuInfo ?? newSignals.webgpuInfo;
        stats.audioFingerprint = stats.audioFingerprint ?? newSignals.audioFingerprint;
        stats.batteryInfo = stats.batteryInfo ?? newSignals.batteryInfo;

        if (stats.paths[stats.paths.length - 1] !== pathname) {
          stats.paths.push(pathname);
        }

        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
      }
    };

    initStats();
  }, [pathname]);

  useEffect(() => {
    const updateStats = (updater: (prev: SessionStats) => SessionStats) => {
      try {
        const existing = sessionStorage.getItem(STORAGE_KEY);
        if (existing) {
          const stats = JSON.parse(existing);
          const newStats = updater(stats);
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify(newStats));
        }
      } catch (e) {
        console.error("Failed to update session stats", e);
      }
    };

    // --- Visibility timeline ---
    const handleVisibility = () => {
      updateStats((prev) => ({
        ...prev,
        visibilityTimeline: [
          ...(prev.visibilityTimeline || []),
          {
            state: document.visibilityState as "visible" | "hidden",
            timestampMs: Date.now(),
          },
        ].slice(-50),
        lastEventTimestamp: Date.now(),
      }));
    };

    // --- Focus/blur on window ---
    const handleWindowFocus = () => {
      updateStats((prev) => ({
        ...prev,
        focusTimeline: [
          ...(prev.focusTimeline || []),
          { type: "focus", timestampMs: Date.now() },
        ].slice(-50),
        lastEventTimestamp: Date.now(),
      }));
    };
    const handleWindowBlur = () => {
      updateStats((prev) => ({
        ...prev,
        focusTimeline: [
          ...(prev.focusTimeline || []),
          { type: "blur", timestampMs: Date.now() },
        ].slice(-50),
        lastEventTimestamp: Date.now(),
      }));
    };

    // --- Exit events ---
    const handleExit = (type: string) => {
      updateStats((prev) => ({
        ...prev,
        exitEvents: [
          ...(prev.exitEvents || []),
          { type, timestampMs: Date.now() },
        ].slice(-10),
        lastEventTimestamp: Date.now(),
      }));
    };

    // --- DPI change ---
    const handleDpiChange = () => {
      const ratio = window.devicePixelRatio;
      updateStats((prev) => ({
        ...prev,
        dpiChanges: [
          ...(prev.dpiChanges || []),
          { ratio, timestampMs: Date.now() },
        ].slice(-10),
        lastEventTimestamp: Date.now(),
      }));
    };
    const dpiMq = window.matchMedia(
      `(resolution: ${window.devicePixelRatio}dppx)`,
    );
    const onDpiChange = () => {
      handleDpiChange();
      // Re-match new ratio
      dpiMq.removeEventListener("change", onDpiChange);
      const newMq = window.matchMedia(
        `(resolution: ${window.devicePixelRatio}dppx)`,
      );
      newMq.addEventListener("change", onDpiChange);
    };
    dpiMq.addEventListener("change", onDpiChange);

    // --- Resource loads ---
    const handleResources = () => {
      try {
        const entries = performance.getEntriesByType(
          "resource",
        ) as PerformanceResourceTiming[];
        const loads = entries.slice(-30).map((e) => ({
          name: e.name.split("/").pop()?.split("?")[0] || e.name.slice(-60),
          initiatorType: e.initiatorType,
          duration: Math.round(e.duration),
          transferSize: e.transferSize,
        }));
        updateStats((prev) => ({ ...prev, resourceLoads: loads }));
      } catch {}
    };

    // --- Long tasks ---
    let longTaskObs: PerformanceObserver | null = null;
    try {
      longTaskObs = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        updateStats((prev) => ({
          ...prev,
          longTasks: [
            ...(prev.longTasks || []),
            ...entries.map((e) => ({
              duration: Math.round(e.duration),
              startTime: Math.round(e.startTime),
            })),
          ].slice(-20),
        }));
      });
      longTaskObs.observe({ type: "longtask", buffered: true });
    } catch {}

    // --- LCP ---
    let lcpObs: PerformanceObserver | null = null;
    try {
      lcpObs = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const last = entries[entries.length - 1];
        if (last) {
          updateStats((prev) => ({
            ...prev,
            lcpMs: Math.round(last.startTime),
          }));
        }
      });
      lcpObs.observe({ type: "largest-contentful-paint", buffered: true });
    } catch {}

    // --- FID ---
    let fidObs: PerformanceObserver | null = null;
    try {
      fidObs = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const last = entries[entries.length - 1];
        if (last) {
          const e = last as PerformanceEntry & { processingStart?: number };
          const delay = e.processingStart ? e.processingStart - last.startTime : last.duration;
          updateStats((prev) => ({ ...prev, fidMs: Math.round(delay) }));
        }
      });
      fidObs.observe({ type: "first-input", buffered: true });
    } catch {}

    // --- CLS ---
    let clsObs: PerformanceObserver | null = null;
    try {
      clsObs = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        let delta = 0;
        for (const entry of entries) {
          const e = entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number };
          if (!e.hadRecentInput && typeof e.value === "number") delta += e.value;
        }
        if (delta > 0) {
          updateStats((prev) => ({ ...prev, clsScore: (prev.clsScore || 0) + delta }));
        }
      });
      clsObs.observe({ type: "layout-shift", buffered: true });
    } catch {}

    // --- Network changes ---
    const conn = (navigator as Navigator & { connection?: EventTarget & { effectiveType?: string; downlink?: number } }).connection;
    const handleNetworkChange = () => {
      if (conn && conn.effectiveType) {
        updateStats((prev) => ({
          ...prev,
          networkChanges: [
            ...(prev.networkChanges || []),
            {
              effectiveType: conn.effectiveType || "unknown",
              downlink: conn.downlink || 0,
              timestampMs: Date.now(),
            },
          ].slice(-20),
        }));
      }
    };
    conn?.addEventListener("change", handleNetworkChange);

    // --- Head mutations (dynamic script/style injection) ---
    let headMutObs: MutationObserver | null = null;
    try {
      let mutationCount = 0;
      headMutObs = new MutationObserver(() => {
        mutationCount++;
        updateStats((prev) => ({ ...prev, headMutations: mutationCount }));
      });
      if (document.head) {
        headMutObs.observe(document.head, { childList: true, subtree: true });
      }
    } catch {}

    // --- Memory (Chrome) ---
    const memInterval = setInterval(() => {
      const perf = performance as Performance & {
        memory?: {
          usedJSHeapSize: number;
          totalJSHeapSize: number;
          jsHeapSizeLimit: number;
        };
      };
      if (perf.memory) {
        updateStats((prev) => ({
          ...prev,
          memoryInfo: {
            usedJSHeapSize: perf.memory!.usedJSHeapSize,
            totalJSHeapSize: perf.memory!.totalJSHeapSize,
            jsHeapSizeLimit: perf.memory!.jsHeapSizeLimit,
          },
        }));
      }
    }, 5000);

    // --- Click ---
    const handleClick = (e: MouseEvent) => {
      const name = getElementName(e.target);
      const clickable =
        e.target instanceof Element
          ? e.target.closest('button, a, [role="button"], input[type="submit"]')
          : null;
      updateStats((prev) => ({
        ...prev,
        clicks: [...prev.clicks, `[${pathname}] ${name}`].slice(-50),
        buttonClicks: clickable
          ? [
              ...(prev.buttonClicks || []),
              {
                target: name,
                x: Math.round(e.clientX),
                y: Math.round(e.clientY),
                timestampMs: Date.now(),
                path: pathname,
              },
            ].slice(-80)
          : prev.buttonClicks || [],
        lastEventTimestamp: Date.now(),
      }));
    };

    // --- Focus on elements ---
    const handleFocus = (e: FocusEvent) => {
      const name = getElementName(e.target);
      updateStats((prev) => ({
        ...prev,
        focused: [...prev.focused, `[${pathname}] ${name}`].slice(-50),
        fieldEvents: [
          ...(prev.fieldEvents || []),
          {
            field: name,
            type: "focus" as const,
            timestampMs: Date.now(),
            path: pathname,
          },
        ].slice(-120),
        lastEventTimestamp: Date.now(),
      }));
    };

    const handleBlur = (e: FocusEvent) => {
      const name = getElementName(e.target);
      updateStats((prev) => ({
        ...prev,
        fieldEvents: [
          ...(prev.fieldEvents || []),
          {
            field: name,
            type: "blur" as const,
            timestampMs: Date.now(),
            path: pathname,
          },
        ].slice(-120),
        lastEventTimestamp: Date.now(),
      }));
    };

    // --- Copy ---
    const handleCopy = () => {
      const selection = document.getSelection()?.toString();
      if (selection) {
        const text =
          selection.length > 20 ? selection.slice(0, 20) + "..." : selection;
        updateStats((prev) => ({
          ...prev,
          copies: [...prev.copies, `[${pathname}] "${text}"`].slice(-20),
          lastEventTimestamp: Date.now(),
        }));
      }
    };

    // --- Scroll ---
    const handleScroll = () => {
      const scrollPercent = Math.round(
        ((window.scrollY + window.innerHeight) /
          document.documentElement.scrollHeight) *
          100,
      );
      updateStats((prev) => ({
        ...prev,
        maxScroll: Math.max(prev.maxScroll, scrollPercent),
        lastEventTimestamp: Date.now(),
      }));
    };

    // --- Resource timing final snapshot ---
    const handleBeforeUnload = () => {
      handleResources();
      handleExit("beforeunload");
    };
    const handlePageHide = () => {
      handleResources();
      handleExit("pagehide");
    };

    // Register listeners
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("focus", handleWindowFocus);
    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("pagehide", handlePageHide);
    window.addEventListener("click", handleClick);
    window.addEventListener("focus", handleFocus, true);
    window.addEventListener("blur", handleBlur, true);
    window.addEventListener("copy", handleCopy);
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Initial snapshot
    handleResources();

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("focus", handleWindowFocus);
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("pagehide", handlePageHide);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("focus", handleFocus, true);
      window.removeEventListener("blur", handleBlur, true);
      window.removeEventListener("copy", handleCopy);
      window.removeEventListener("scroll", handleScroll);
      longTaskObs?.disconnect();
      lcpObs?.disconnect();
      fidObs?.disconnect();
      clsObs?.disconnect();
      headMutObs?.disconnect();
      conn?.removeEventListener("change", handleNetworkChange);
      dpiMq.removeEventListener("change", onDpiChange);
      clearInterval(memInterval);
    };
  }, [pathname]);

  return null;
};
