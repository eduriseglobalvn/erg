'use client';
import React, { useState } from 'react'
import parse, { DOMNode, Element } from 'html-react-parser'
import { TOCBox, TOCItem } from '@/components/shared/toc-box'

export function PostContentRenderer({ content }: { content: string }) {
    const options = {
        replace: (domNode: DOMNode) => {
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
        }
    }

    return <div className="prose prose-stone dark:prose-invert max-w-none break-words">
        {parse(content, options)}
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
