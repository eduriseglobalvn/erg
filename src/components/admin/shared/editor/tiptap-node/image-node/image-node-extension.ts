import { Image as TiptapImage } from '@tiptap/extension-image'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { ImageNodeView } from '@/components/admin/shared/editor/tiptap-node/image-node/image-node-view'

export const ImageNode = TiptapImage.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            width: {
                default: null,
            },
            height: {
                default: null,
            },
        }
    },

    addNodeView() {
        return ReactNodeViewRenderer(ImageNodeView)
    },
})
