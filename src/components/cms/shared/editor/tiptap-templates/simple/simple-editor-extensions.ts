import { Extension } from "@tiptap/react"
import { StarterKit } from "@tiptap/starter-kit"
import { TaskItem, TaskList } from "@tiptap/extension-list"
import { TextAlign } from "@tiptap/extension-text-align"
import { Typography } from "@tiptap/extension-typography"
import { Highlight } from "@tiptap/extension-highlight"
import { Subscript } from "@tiptap/extension-subscript"
import { Superscript } from "@tiptap/extension-superscript"
import { Selection } from "@tiptap/extensions"
import BubbleMenuExtension from "@tiptap/extension-bubble-menu"
import { TextStyle } from "@tiptap/extension-text-style"
import { FontFamily } from "@tiptap/extension-font-family"
import { ImageNode } from "@/components/cms/shared/editor/tiptap-node/image-node/image-node-extension"
import { ImageUploadNode } from "@/components/cms/shared/editor/tiptap-node/image-upload-node/image-upload-node-extension"
import { HorizontalRule } from "@/components/cms/shared/editor/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension"
import { HeadingWithAnchor } from "@/components/cms/shared/editor/tiptap-extension/heading-with-anchor"
import { TableOfContentsNode } from "@/components/cms/shared/editor/tiptap-extension/table-of-contents-node"
import { handleImageUpload, MAX_FILE_SIZE } from "@/lib/tiptap-utils"
import { ErgSectionBlock } from "./erg-section-block"
import { ImageTextBlock } from "./image-text-block"

export const FontSize = Extension.create({
    name: 'fontSize',
    addOptions() { return { types: ['textStyle'] } },
    addGlobalAttributes() {
        return [{
            types: this.options.types,
            attributes: {
                fontSize: {
                    default: null,
                    parseHTML: element => element.style.fontSize.replace(/['"]+/g, ''),
                    renderHTML: attributes => {
                        if (!attributes.fontSize) return {}
                        return { style: `font-size: ${attributes.fontSize}` }
                    },
                },
            },
        }]
    },
    addCommands() {
        return {
            setFontSize: (fontSize: string) => ({ chain }: any) => chain().setMark('textStyle', { fontSize }).run(),
            unsetFontSize: () => ({ chain }: any) => chain().setMark('textStyle', { fontSize: null }).run(),
        }
    },
})

export const createSimpleEditorExtensions = () => [
            StarterKit.configure({
                heading: false, // Tắt mặc định
                horizontalRule: false,
                link: {
                    openOnClick: false,
                    enableClickSelection: true,
                },
            }),
            HeadingWithAnchor.configure({
                levels: [1, 2, 3, 4, 5, 6],
            }),
            TableOfContentsNode,
            TextStyle,
            FontFamily,
            FontSize,
            ImageTextBlock,
            ErgSectionBlock,
            HorizontalRule,
            TextAlign.configure({ types: ["heading", "paragraph"] }),
            TaskList,
            TaskItem.configure({ nested: true }),
            Highlight.configure({ multicolor: true }),
            ImageNode,
            Typography,
            Superscript,
            Subscript,
            Selection,
            ImageUploadNode.configure({
                accept: "image/*",
                maxSize: MAX_FILE_SIZE,
                limit: 3,
                upload: handleImageUpload,
                onError: (error) => console.error("Upload failed:", error),
            }),
            BubbleMenuExtension.configure({
                pluginKey: 'bubbleMenuAI',
            }),
        ]
