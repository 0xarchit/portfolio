
const cyrb53 = (str: string, seed = 0) => {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

export const getCanvasFingerprint = (): string => {
    try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return 'error';

        canvas.width = 200;
        canvas.height = 50;

        
        ctx.textBaseline = "top";
        ctx.font = "14px 'Arial'";
        ctx.textBaseline = "alphabetic";
        ctx.fillStyle = "#f60";
        ctx.fillRect(125, 1, 62, 20);
        
        ctx.fillStyle = "#069";
        ctx.fillText("0xArchit Portfolio", 2, 15);
        ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
        ctx.fillText("0xArchit Portfolio", 4, 17);

        
        ctx.font = "14px serif";
        ctx.fillText("🚀👨‍💻🛡️", 50, 35);
        
        
        ctx.globalCompositeOperation = "multiply";
        ctx.fillStyle = "rgb(255,0,255)";
        ctx.beginPath();
        ctx.arc(50, 50, 50, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    } catch (e) {
        return 'error';
    }
};

export const getWebGLFingerprint = (): string => {
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl || !(gl instanceof WebGLRenderingContext)) return 'unsupported';

        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (!debugInfo) return 'no-debug-info';

        const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);

        return `${vendor}~${renderer}`;
    } catch (e) {
        return 'error';
    }
};

export interface FingerprintData {
    visitorId: string;
    components: {
        canvas: string;
        webgl: string;
        hardware: string;
    }
}

export const getFingerprint = async (): Promise<FingerprintData> => {
    if (typeof window === 'undefined') {
        return {
            visitorId: 'server-side',
            components: { canvas: '', webgl: '', hardware: '' }
        };
    }
    
    
    const canvas = getCanvasFingerprint();
    
    
    const webgl = getWebGLFingerprint();
    
    
    const nav = navigator;
    const screen = window.screen;
    
    const hardware = [
        nav.userAgent,
        nav.language,
        (nav as any).deviceMemory || 'unknown',
        nav.hardwareConcurrency || 'unknown',
        screen.width,
        screen.height,
        screen.colorDepth,
        new Date().getTimezoneOffset()
    ].join('|');

    
    const fingerprintString = `${canvas}###${webgl}###${hardware}`;
    
    
    const visitorId = cyrb53(fingerprintString).toString(16);
    
    return {
        visitorId,
        components: {
            canvas: canvas.slice(0, 50) + '...', 
            webgl,
            hardware
        }
    };
};
