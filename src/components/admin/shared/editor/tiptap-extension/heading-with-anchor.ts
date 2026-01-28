import Heading from '@tiptap/extension-heading'
import { mergeAttributes } from '@tiptap/core'
import { slugify } from '@/lib/utils'

export const HeadingWithAnchor = Heading.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            id: {
                default: null,
                parseHTML: element => element.getAttribute('id'),
                renderHTML: attributes => {
                    // Nếu không có ID, return rỗng (hoặc có thể tự sinh ở đây nếu muốn strict)
                    if (!attributes.id) {
                        return {}
                    }
                    return {
                        id: attributes.id,
                    }
                },
            },
        }
    },
})
