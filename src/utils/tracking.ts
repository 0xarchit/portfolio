
export const getElementName = (target: EventTarget | null): string => {
    if (!target || !(target instanceof HTMLElement)) return 'unknown';
    
    
    const el = target.closest('button, a, input, textarea, [role="button"]') || target as HTMLElement;
    
    const txt = (el as HTMLElement).innerText?.slice(0, 30).replace(/\n/g, ' ').trim();
    const label = el.getAttribute('aria-label');
    const id = el.id;
    const cls = el.className?.split(' ').filter(c => c !== ' ').pop(); 
    const placeholder = el.getAttribute('placeholder');
    
    
    if (label) return `Label: ${label}`;
    if (txt) return `Text: "${txt}"`;
    if (placeholder) return `Placeholder: "${placeholder}"`;
    if (id) return `#${id}`;
    if (cls) return `.${cls}`;
    return el.tagName.toLowerCase();
};
