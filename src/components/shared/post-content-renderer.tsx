'use client';
import React, { useState } from 'react'
import parse, { DOMNode, Element } from 'html-react-parser'
import { sanitizeHTML } from '@/utils/sanitize-html'
import { TOCBox, TOCItem } from '@/components/shared/toc-box'

export function PostContentRenderer({ content }: { content: string }) {
    const isInsideFigure = (domNode: DOMNode) => {
        const parent = (domNode as unknown as { parent?: Element | null }).parent
        return parent?.type === 'tag' && parent.name === 'figure'
    }

    const isNestedErgBlock = (domNode: DOMNode) => {
        let parent = (domNode as unknown as { parent?: Element | null }).parent

        while (parent) {
            if (parent.type === 'tag' && parent.attribs?.['data-erg-block']) {
                return true
            }
            parent = (parent as unknown as { parent?: Element | null }).parent || null
        }

        return false
    }

    const options = {
        replace: (domNode: DOMNode) => {
            if (domNode.type === 'tag') {
                const element = domNode as Element
                if (element.name === 'section' && element.attribs?.['data-erg-block'] && isNestedErgBlock(domNode)) {
                    return <></>
                }
            }

            // Check for <toc-node> tag
            // Note: html-react-parser uses domhandler nodes. 
            // safe check: domNode.type === 'tag' && domNode.name === 'toc-node'
            if (domNode.type === 'tag' && (domNode as Element).name === 'toc-node') {
                const element = domNode as Element
                const itemsJson = element.attribs['data-items']
                const collapsedStr = element.attribs['data-collapsed']

                let items: TOCItem[] = []
                try {
                    items = itemsJson ? JSON.parse(itemsJson) : []
                } catch (e) {
                    console.error('Failed to parse TOC items', e)
                }

                const defaultCollapsed = collapsedStr === 'true'

                return <TOCWrapper items={items} defaultCollapsed={defaultCollapsed} />
            }

            if (domNode.type === 'tag' && (domNode as Element).name === 'img') {
                const element = domNode as Element
                const src = element.attribs.src
                if (!src) return

                if (isInsideFigure(domNode)) {
                    return (
                        <img
                            src={src}
                            alt={element.attribs.alt || ''}
                            title={element.attribs.title}
                            width={element.attribs.width && !String(element.attribs.width).endsWith('%') ? Number(element.attribs.width) : undefined}
                            height={element.attribs.height ? Number(element.attribs.height) : undefined}
                            loading="lazy"
                            decoding="async"
                        />
                    )
                }

                const caption = element.attribs['data-caption']
                const align = element.attribs['data-align'] || 'center'
                const width = element.attribs['data-width'] || element.attribs.width
                const height = element.attribs['data-height'] || element.attribs.height
                const alt = element.attribs.alt || ''
                const title = element.attribs.title

                const figureStyle = width
                    ? {
                        width: String(width).endsWith('%') ? String(width) : `${width}px`,
                        maxWidth: '100%',
                    }
                    : undefined

                return (
                    <figure
                        className={`erg-figure erg-figure-${align}`}
                        style={figureStyle}
                    >
                        <img
                            src={src}
                            alt={alt}
                            title={title}
                            width={width && !String(width).endsWith('%') ? Number(width) : undefined}
                            height={height ? Number(height) : undefined}
                            loading="lazy"
                            decoding="async"
                        />
                        {caption && <figcaption>{caption}</figcaption>}
                    </figure>
                )
            }
        }
    }

    const sanitizedContent = sanitizeHTML(content);

    return <div className="erg-post-content prose prose-stone dark:prose-invert max-w-none break-words">
        {parse(sanitizedContent, options)}
    </div>
}

function TOCWrapper({ items, defaultCollapsed }: { items: TOCItem[], defaultCollapsed: boolean }) {
    const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)

    const handleScroll = (id: string) => {
        const el = document.getElementById(id)
        if (el) {
            // Scroll with offset for sticky headers if any
            const y = el.getBoundingClientRect().top + window.pageYOffset - 100
            window.scrollTo({ top: y, behavior: 'smooth' })
        }
    }

    return (
        <TOCBox
            items={items}
            isCollapsed={isCollapsed}
            onToggle={() => setIsCollapsed(!isCollapsed)}
            onItemClick={handleScroll}
            className="my-8 not-prose"
        />
    )
}
