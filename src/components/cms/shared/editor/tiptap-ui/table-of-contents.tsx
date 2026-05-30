import { NodeViewWrapper } from '@tiptap/react'
import React, { useEffect, useState, useCallback } from 'react'
import { Editor } from '@tiptap/core'
import { slugify } from '@/lib/utils'
import { TOCBox, TOCItem } from '@/components/shared/toc-box'

// Hàm đệ quy để handle duplicates
const getUniqueId = (id: string, existingIds: Set<string>) => {
    if (!existingIds.has(id)) return id
    let counter = 1
    while (existingIds.has(`${id}-${counter}`)) {
        counter++
    }
    return `${id}-${counter}`
}

export const TableOfContents = ({ editor, node, updateAttributes }: { editor: Editor, node: any, updateAttributes: (attrs: any) => void }) => {
    // Local state for UI responsiveness, but we also sync to node.attrs
    const [items, setItems] = useState<TOCItem[]>(node.attrs.items || [])
    const [isCollapsed, setIsCollapsed] = useState(node.attrs.collapsed || false)

    // Sync collapsed state
    const handleToggle = useCallback(() => {
        const newState = !isCollapsed
        setIsCollapsed(newState)
        updateAttributes({ collapsed: newState })
    }, [isCollapsed, updateAttributes])

    useEffect(() => {
        if (!editor) return

        const handleUpdate = () => {
            const headings: TOCItem[] = []
            const transaction = editor.state.tr
            let modified = false
            const existingIds = new Set<string>()

            editor.state.doc.descendants((node, pos) => {
                if (node.type.name === 'heading') { // Cần đảm bảo name khớp với extension heading
                    // Chỉ lấy H2, H3
                    if (node.attrs.level > 3) return

                    const text = node.textContent
                    if (!text) return

                    let id = node.attrs.id

                    // Nếu chưa có ID hoặc ID rỗng, tạo mới từ text
                    if (!id) {
                        const baseSlug = slugify(text)
                        id = getUniqueId(baseSlug, existingIds)
                        transaction.setNodeMarkup(pos, undefined, { ...node.attrs, id })
                        modified = true
                    } else {
                        // Đảm bảo unique cho cả ID cũ
                        if (existingIds.has(id)) {
                            id = getUniqueId(id, existingIds)
                            transaction.setNodeMarkup(pos, undefined, { ...node.attrs, id })
                            modified = true
                        }
                    }

                    existingIds.add(id)

                    headings.push({
                        level: node.attrs.level,
                        text,
                        id,
                    })
                }
            })

            if (modified) {
                // Dispatch transaction để lưu ID vào document
                // Lưu ý: Việc này sẽ trigger lại update, nên cần logic check kỹ để tránh loop
                // Tuy nhiên vì ở trên ta chỉ set khi "chưa có" hoặc "trùng", nên sẽ hội tụ nhanh.
                setTimeout(() => {
                    if (!editor.isDestroyed) {
                        editor.view.dispatch(transaction)
                    }
                }, 0)
            }

            // Check if items changed
            if (JSON.stringify(headings) !== JSON.stringify(items)) {
                setItems(headings)
                // Sync to node attributes so getting HTML output includes the data
                updateAttributes({ items: headings })
            }
        }

        // Initial scan
        editor.on('update', handleUpdate)

        return () => {
            editor.off('update', handleUpdate)
        }
    }, [editor, items, updateAttributes])

    const handleScrollToHead = (id: string) => {
        const element = editor.view.dom.querySelector(`#${id}`)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }

    return (
        <NodeViewWrapper className="my-6 not-prose">
            <TOCBox
                items={items}
                isCollapsed={isCollapsed}
                onToggle={handleToggle}
                onItemClick={handleScrollToHead}
            />
        </NodeViewWrapper>
    )
}
