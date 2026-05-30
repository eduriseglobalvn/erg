import { Image as TiptapImage } from '@tiptap/extension-image'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { ImageNodeView } from '@/components/cms/shared/editor/tiptap-node/image-node/image-node-view'

export const ImageNode = TiptapImage.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            height: {
                default: null,
                parseHTML: element => element.getAttribute('height') || element.getAttribute('data-height'),
                renderHTML: attributes => {
                    if (!attributes.height) return {}
                    return {
                        height: attributes.height,
                        'data-height': attributes.height,
                    }
                },
            },
            caption: {
                default: null,
                parseHTML: element => element.getAttribute('data-caption'),
                renderHTML: attributes => attributes.caption ? { 'data-caption': attributes.caption } : {},
            },
            align: {
                default: 'center',
                parseHTML: element => element.getAttribute('data-align') || 'center',
                renderHTML: attributes => attributes.align ? { 'data-align': attributes.align } : {},
            },
            width: {
                default: null,
                parseHTML: element => element.getAttribute('width') || element.getAttribute('data-width'),
                renderHTML: attributes => {
                    if (!attributes.width) return {}
                    return {
                        width: attributes.width,
                        'data-width': attributes.width,
                    }
                },
            },
        }
    },

    addNodeView() {
        return ReactNodeViewRenderer(ImageNodeView)
    },
})
