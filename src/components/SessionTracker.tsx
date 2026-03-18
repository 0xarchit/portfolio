'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { getElementName, STORAGE_KEY } from '../utils/tracking';
import { getFingerprint } from '../utils/fingerprint';

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

export interface SessionStats {
  visitorId?: string;
  fingerprintComponents?: {
      canvas: string;
      webgl: string;
      hardware: string;
  };
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
    type: 'focus' | 'blur';
    timestampMs: number;
    path: string;
  }>;
  downloadEvents?: Array<{
    resource: string;
    status: 'start' | 'complete' | 'error';
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
          console.error('Failed to parse stats', e);
      }

      
      const nav = typeof navigator !== 'undefined' ? navigator : null;
      const conn =
        nav &&
        'connection' in nav &&
        nav.connection &&
        typeof nav.connection === 'object'
          ? nav.connection
          : null;
      
      const navigatorDetails: NavigatorDetails = {
          userAgent: nav?.userAgent || 'unknown',
          platform: nav?.platform || 'unknown',
          language: nav?.language || 'unknown',
          languages: [...(nav?.languages || [])],
          hardwareConcurrency: nav?.hardwareConcurrency || 0,
          deviceMemory:
            nav && 'deviceMemory' in nav
              ? (nav as Navigator & { deviceMemory?: number }).deviceMemory
              : undefined,
          maxTouchPoints: nav?.maxTouchPoints || 0,
          vendor: nav?.vendor || 'unknown',
          connection: conn ? {
            effectiveType:
              'effectiveType' in conn && typeof conn.effectiveType === 'string'
                ? conn.effectiveType
                : 'unknown',
            downlink:
              'downlink' in conn && typeof conn.downlink === 'number'
                ? conn.downlink
                : 0,
            rtt: 'rtt' in conn && typeof conn.rtt === 'number' ? conn.rtt : 0,
            saveData:
              'saveData' in conn && typeof conn.saveData === 'boolean'
                ? conn.saveData
                : false
          } : undefined
      };

      if (!stats) {
        
        let visitorId = 'unknown';
        let fingerprintComponents;

        try {
            const fpData = await getFingerprint();
            visitorId = fpData.visitorId;
            fingerprintComponents = fpData.components;
        } catch (e) {
            console.error('FP gen failed', e);
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
          screenResolution: typeof window !== 'undefined' ? `${window.screen.width}x${window.screen.height}` : 'unknown',
          localTimezone:
            Intl.DateTimeFormat().resolvedOptions().timeZone || 'unknown',
          referrer: document.referrer || 'N/A',
          buttonClicks: [],
          fieldEvents: [],
          downloadEvents: [],
          errorCodes: [],
          lastEventTimestamp: Date.now(),
          navigatorDetails
        };
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      } else {
        
        
        if (!stats.visitorId || stats.visitorId === 'unknown') {
            try {
                const fpData = await getFingerprint();
                stats.visitorId = fpData.visitorId;
                stats.fingerprintComponents = fpData.components;
            } catch (e) {
                console.error('FP backfill failed', e);
            }
        }

        
        stats.navigatorDetails = navigatorDetails;
        stats.localTimezone =
          Intl.DateTimeFormat().resolvedOptions().timeZone || 'unknown';
        stats.referrer = document.referrer || stats.referrer || 'N/A';
        stats.buttonClicks = stats.buttonClicks || [];
        stats.fieldEvents = stats.fieldEvents || [];
        stats.downloadEvents = stats.downloadEvents || [];
        stats.errorCodes = stats.errorCodes || [];
        stats.lastEventTimestamp = Date.now();

        
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
        console.error('Failed to update session stats', e);
      }
    };

    const handleClick = (e: MouseEvent) => {
      const name = getElementName(e.target);
      const clickable =
        e.target instanceof Element
          ? e.target.closest('button, a, [role="button"], input[type="submit"]')
          : null;
      updateStats(prev => ({
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

    const handleFocus = (e: FocusEvent) => {
      const name = getElementName(e.target);
      updateStats(prev => ({
        ...prev,
        focused: [...prev.focused, `[${pathname}] ${name}`].slice(-50),
        fieldEvents: [
          ...(prev.fieldEvents || []),
          {
            field: name,
            type: 'focus' as const,
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
            type: 'blur' as const,
            timestampMs: Date.now(),
            path: pathname,
          },
        ].slice(-120),
        lastEventTimestamp: Date.now(),
      }));
    };

    const handleCopy = () => {
      const selection = document.getSelection()?.toString();
      if (selection) {
        const text = selection.length > 20 ? selection.slice(0, 20) + '...' : selection;
        updateStats(prev => ({
           ...prev,
           copies: [...prev.copies, `[${pathname}] "${text}"`].slice(-20),
           lastEventTimestamp: Date.now(),
        }));
      }
    };

    const handleScroll = () => {
        const scrollPercent = Math.round((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100);
        updateStats(prev => ({
            ...prev,
            maxScroll: Math.max(prev.maxScroll, scrollPercent),
            lastEventTimestamp: Date.now(),
        }));
    };

    window.addEventListener('click', handleClick);
    window.addEventListener('focus', handleFocus, true);
    window.addEventListener('blur', handleBlur, true);
    window.addEventListener('copy', handleCopy);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('click', handleClick);
      window.removeEventListener('focus', handleFocus, true);
      window.removeEventListener('blur', handleBlur, true);
      window.removeEventListener('copy', handleCopy);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pathname]);

  return null; 
};
