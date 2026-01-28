import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { TableOfContents } from '@/components/admin/shared/editor/tiptap-ui/table-of-contents'

export const TableOfContentsNode = Node.create({
    name: 'tableOfContents',

    group: 'block',

    atom: true,

    draggable: true,

    addAttributes() {
        return {
            items: {
                default: [],
                parseHTML: element => {
                    const data = element.getAttribute('data-items')
                    return data ? JSON.parse(data) : []
                },
                renderHTML: attributes => {
                    return {
                        'data-items': JSON.stringify(attributes.items),
                    }
                },
            },
            collapsed: {
                default: false,
                parseHTML: element => element.getAttribute('data-collapsed') === 'true',
                renderHTML: attributes => {
                    return {
                        'data-collapsed': attributes.collapsed,
                    }
                }
            }
        }
    },

    parseHTML() {
        return [
            {
                tag: 'toc-node',
            },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return ['toc-node', mergeAttributes(HTMLAttributes)]
    },

    addNodeView() {
        return ReactNodeViewRenderer(TableOfContents)
    },
})
