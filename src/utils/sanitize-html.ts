import DOMPurify from 'dompurify';

export const sanitizeHTML = (html: string) => {
    return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: [
            'p', 'br', 'strong', 'em', 'ul', 'ol', 'li',
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'a', 'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
            'blockquote', 'code', 'pre', 'span', 'div', 'toc-node'
        ],
        ALLOWED_ATTR: ['href', 'src', 'alt', 'class', 'id', 'data-items', 'data-collapsed', 'target', 'rel'],
    });
};
