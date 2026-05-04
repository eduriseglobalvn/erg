import DOMPurify from 'dompurify';

let hooksRegistered = false;

function sanitizeInlineStyle(value: string) {
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

export const sanitizeHTML = (html: string) => {
    registerSanitizeHooks();

    return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: [
            'p', 'br', 'strong', 'em', 'ul', 'ol', 'li',
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'a', 'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
            'blockquote', 'code', 'pre', 'span', 'div', 'section', 'figure', 'figcaption', 's',
            'hr', 'toc-node', 'label', 'input'
        ],
        ALLOWED_ATTR: [
            'href', 'src', 'alt', 'title', 'class', 'id', 'style', 'width', 'height',
            'data-items', 'data-collapsed', 'data-erg-block', 'data-caption',
            'data-align', 'data-width', 'data-height', 'data-bg', 'data-tone',
            'data-accent', 'data-layout', 'data-checked', 'data-type', 'type', 'checked',
            'data-content-type', 'data-text-alignment', 'data-level', 'data-index',
            'data-editor-node', 'data-image-width', 'data-variant',
            'target', 'rel',
        ],
    });
};
