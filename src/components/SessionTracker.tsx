'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { getElementName } from '../utils/tracking';
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
  navigatorDetails?: NavigatorDetails;
}

const STORAGE_KEY = 'user_session_stats';

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

      
      const nav: any = typeof navigator !== 'undefined' ? navigator : {};
      const conn = nav.connection || nav.mozConnection || nav.webkitConnection;
      
      const navigatorDetails: NavigatorDetails = {
          userAgent: nav.userAgent || 'unknown',
          platform: nav.platform || 'unknown',
          language: nav.language || 'unknown',
          languages: nav.languages || [],
          hardwareConcurrency: nav.hardwareConcurrency || 0,
          deviceMemory: (nav as any).deviceMemory,
          maxTouchPoints: nav.maxTouchPoints || 0,
          vendor: nav.vendor || 'unknown',
          connection: conn ? {
            effectiveType: conn.effectiveType,
            downlink: conn.downlink,
            rtt: conn.rtt,
            saveData: conn.saveData
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
      updateStats(prev => ({
        ...prev,
        clicks: [...prev.clicks, `[${pathname}] ${name}`].slice(-50) 
      }));
    };

    const handleFocus = (e: FocusEvent) => {
      const name = getElementName(e.target);
      updateStats(prev => ({
        ...prev,
        focused: [...prev.focused, `[${pathname}] ${name}`].slice(-50)
      }));
    };

    const handleCopy = () => {
      const selection = document.getSelection()?.toString();
      if (selection) {
        const text = selection.length > 20 ? selection.slice(0, 20) + '...' : selection;
        updateStats(prev => ({
           ...prev,
           copies: [...prev.copies, `[${pathname}] "${text}"`].slice(-20)
        }));
      }
    };

    const handleScroll = () => {
        const scrollPercent = Math.round((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100);
        updateStats(prev => ({
            ...prev,
            maxScroll: Math.max(prev.maxScroll, scrollPercent)
        }));
    };

    window.addEventListener('click', handleClick);
    window.addEventListener('focus', handleFocus as any, true);
    window.addEventListener('copy', handleCopy);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('click', handleClick);
      window.removeEventListener('focus', handleFocus as any, true);
      window.removeEventListener('copy', handleCopy);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pathname]);

  return null; 
};
