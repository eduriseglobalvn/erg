import DOMPurify from 'dompurify';

let hooksRegistered = false;

export function sanitizeInlineStyle(value: string) {
    const safeDeclarations = value
        .split(';')
        .map((declaration) => declaration.trim())
        .filter((declaration) => {
            const [property, rawValue] = declaration.split(':').map((part) => part?.trim());
            if (!property || !rawValue) return false;

            if (property === '--erg-image-column') {
                return /^(?:[1-9]\d?|100)%$/.test(rawValue);
            }

            return false;
        });

    return safeDeclarations.length > 0 ? safeDeclarations.join('; ') : '';
}

function registerSanitizeHooks() {
    if (hooksRegistered) return;

    DOMPurify.addHook('uponSanitizeAttribute', (_node, data) => {
        if (data.attrName === 'style') {
            const safeStyle = sanitizeInlineStyle(data.attrValue);
            if (safeStyle) {
                data.attrValue = safeStyle;
            } else {
                data.keepAttr = false;
            }
        }
    });

    hooksRegistered = true;
}

export const ALLOWED_TAGS = [
    'p', 'br', 'strong', 'em', 'ul', 'ol', 'li',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'a', 'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'blockquote', 'code', 'pre', 'span', 'div', 'section', 'figure', 'figcaption', 's',
    'hr', 'toc-node', 'label', 'input'
];

export const ALLOWED_ATTR = [
    'href', 'src', 'alt', 'title', 'class', 'id', 'style', 'width', 'height',
    'data-items', 'data-collapsed', 'data-erg-block', 'data-caption',
    'data-align', 'data-width', 'data-height', 'data-bg', 'data-tone',
    'data-accent', 'data-layout', 'data-checked', 'data-type', 'type', 'checked',
    'data-content-type', 'data-text-alignment', 'data-level', 'data-index',
    'data-editor-node', 'data-image-width', 'data-variant',
    'target', 'rel',
];

const DROP_WITH_CHILDREN = new Set(['script', 'style', 'iframe', 'object', 'embed', 'form']);
const URL_ATTRS = new Set(['href', 'src']);
const TAG_SET = new Set(ALLOWED_TAGS);
const ATTR_SET = new Set(ALLOWED_ATTR);

// Strip control chars/whitespace first so an obfuscated "java<newline>script:" cannot slip through.
export function isSafeUrl(value: string) {
    const v = value.replace(/[\u0000- \u007f-\u009f]/g, '').toLowerCase();
    if (!/^[a-z][a-z0-9+.-]*:/.test(v)) return true; // relative path, #anchor, ?query
    return /^(?:https?|mailto|tel):/.test(v);
}

/**
 * DOM-free allow-list enforcement (DOMPurify is a no-op without a DOM, i.e. during SSR).
 * drop = remove with children, unwrap = keep children only, keep = render with returned attribs.
 */
export function filterElement(name: string, attribs: Record<string, string> = {}) {
    const tag = name.toLowerCase();
    if (DROP_WITH_CHILDREN.has(tag)) return { action: 'drop' as const, attribs: {} };
    if (!TAG_SET.has(tag)) return { action: 'unwrap' as const, attribs: {} };

    const clean: Record<string, string> = {};
    for (const [rawKey, value] of Object.entries(attribs)) {
        const key = rawKey.toLowerCase();
        // data-*/aria-* pass like DOMPurify's defaults, so SSR and client output match.
        if (key.startsWith('on') || !(ATTR_SET.has(key) || /^(?:data|aria)-[\w.-]+$/.test(key))) continue;
        const isInlineImage = tag === 'img' && key === 'src' && /^data:image\/(?:png|jpe?g|gif|webp|avif);base64,/i.test(value.trim());
        if (URL_ATTRS.has(key) && !isInlineImage && !isSafeUrl(value)) continue;
        if (key === 'style') {
            const style = sanitizeInlineStyle(value);
            if (style) clean.style = style;
            continue;
        }
        clean[key] = value;
    }

    if (tag === 'input') {
        if ((clean.type || '').toLowerCase() !== 'checkbox') return { action: 'drop' as const, attribs: {} };
        clean.disabled = '';
    }
    if (tag === 'a' && (clean.target || '').toLowerCase() === '_blank') clean.rel = 'noopener noreferrer';

    return { action: 'keep' as const, attribs: clean };
}

export const sanitizeHTML = (html: string) => {
    registerSanitizeHooks();

    return DOMPurify.sanitize(html, {
        ALLOWED_TAGS,
        ALLOWED_ATTR,
    });
};
