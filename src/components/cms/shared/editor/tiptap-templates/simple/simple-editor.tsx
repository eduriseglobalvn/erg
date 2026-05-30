"use client"

import { useState, useEffect, useRef, type ChangeEvent, type MouseEvent } from "react"
import { EditorContent, EditorContext, useEditor, Extension, Node, mergeAttributes, NodeViewContent, NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react"
import { NodeSelection } from "@tiptap/pm/state"

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit"
import { TaskItem, TaskList } from "@tiptap/extension-list"
import { TextAlign } from "@tiptap/extension-text-align"
import { Typography } from "@tiptap/extension-typography"
import { Highlight } from "@tiptap/extension-highlight"
import { Subscript } from "@tiptap/extension-subscript"
import { Superscript } from "@tiptap/extension-superscript"
import { Selection } from "@tiptap/extensions"
import BubbleMenuExtension from '@tiptap/extension-bubble-menu'
import { TextStyle } from "@tiptap/extension-text-style"
import { FontFamily } from "@tiptap/extension-font-family"

// --- UI Primitives ---
import { Button } from "@/components/cms/shared/editor/tiptap-ui-primitive/button"
import { Spacer } from "@/components/cms/shared/editor/tiptap-ui-primitive/spacer"
import {
    Toolbar,
    ToolbarGroup,
    ToolbarSeparator,
} from "@/components/cms/shared/editor/tiptap-ui-primitive/toolbar"

// --- Tiptap Node ---
import { ImageNode } from "@/components/cms/shared/editor/tiptap-node/image-node/image-node-extension"
import { ImageUploadNode } from "@/components/cms/shared/editor/tiptap-node/image-upload-node/image-upload-node-extension"
import { HorizontalRule } from "@/components/cms/shared/editor/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension"
import { HeadingWithAnchor } from "@/components/cms/shared/editor/tiptap-extension/heading-with-anchor"
import { TableOfContentsNode } from "@/components/cms/shared/editor/tiptap-extension/table-of-contents-node"
import "@/components/cms/shared/editor/tiptap-node/blockquote-node/blockquote-node.scss"
import "@/components/cms/shared/editor/tiptap-node/code-block-node/code-block-node.scss"
import "@/components/cms/shared/editor/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss"
import "@/components/cms/shared/editor/tiptap-node/list-node/list-node.scss"
import "@/components/cms/shared/editor/tiptap-node/image-node/image-node.scss"
import "@/components/cms/shared/editor/tiptap-node/heading-node/heading-node.scss"
import "@/components/cms/shared/editor/tiptap-node/paragraph-node/paragraph-node.scss"

// --- Tiptap UI ---
import { HeadingDropdownMenu } from "@/components/cms/shared/editor/tiptap-ui/heading-dropdown-menu"
import { ImageUploadButton } from "@/components/cms/shared/editor/tiptap-ui/image-upload-button"
import { ListDropdownMenu } from "@/components/cms/shared/editor/tiptap-ui/list-dropdown-menu"
import { BlockquoteButton } from "@/components/cms/shared/editor/tiptap-ui/blockquote-button"
import { CodeBlockButton } from "@/components/cms/shared/editor/tiptap-ui/code-block-button"
import {
    ColorHighlightPopover,
    ColorHighlightPopoverContent,
    ColorHighlightPopoverButton,
} from "@/components/cms/shared/editor/tiptap-ui/color-highlight-popover"
import {
    LinkPopover,
    LinkContent,
    LinkButton,
} from "@/components/cms/shared/editor/tiptap-ui/link-popover"
import { MarkButton } from "@/components/cms/shared/editor/tiptap-ui/mark-button"
import { TextAlignButton } from "@/components/cms/shared/editor/tiptap-ui/text-align-button"
import { UndoRedoButton } from "@/components/cms/shared/editor/tiptap-ui/undo-redo-button"
// [NEW] Import AI Bubble Menu
import { AIBubbleMenu } from "@/components/cms/shared/editor/tiptap-ui/ai-bubble-menu"

// --- Icons ---
import { ArrowLeftIcon } from "@/components/cms/shared/editor/tiptap-icons/arrow-left-icon"
import { HighlighterIcon } from "@/components/cms/shared/editor/tiptap-icons/highlighter-icon"
import { LinkIcon } from "@/components/cms/shared/editor/tiptap-icons/link-icon"
import { ArrowDown, ArrowUp, ChevronDown, Copy, GripVertical, ImagePlus, Loader2, PanelLeft, PanelRight, Sparkles, ListTree, Trash2 } from "lucide-react"

// --- Hooks ---
import { useIsBreakpoint } from "@/hooks/use-breakpoint"

// --- Components ---
import { ThemeToggle } from "@/components/cms/shared/editor/tiptap-templates/simple/theme-toggle"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/cms/ui/dropdown-menu"

// --- Lib ---
import { handleImageUpload, MAX_FILE_SIZE } from "@/lib/tiptap-utils"
import { cn } from "@/lib/utils"

// --- Styles ---
import "@/components/cms/shared/editor/tiptap-templates/simple/simple-editor.scss"

function ErgSectionBlockView(props: any) {
    const { node, editor, selected, getPos } = props
    const attrs = node.attrs

    const getCurrentPos = () => {
        if (typeof getPos !== "function") return null
        const pos = getPos()
        return typeof pos === "number" ? pos : null
    }

    const deleteBlock = (event: MouseEvent) => {
        event.preventDefault()
        event.stopPropagation()
        const pos = getCurrentPos()
        if (pos === null) return
        editor.chain().focus().deleteRange({ from: pos, to: pos + node.nodeSize }).run()
    }

    const duplicateBlock = (event: MouseEvent) => {
        event.preventDefault()
        event.stopPropagation()
        const pos = getCurrentPos()
        if (pos === null) return
        const { state, view } = editor
        const tr = state.tr.insert(pos + node.nodeSize, node.copy(node.content))
        view.dispatch(tr.scrollIntoView())
        editor.commands.focus()
    }

    const moveBlock = (direction: "up" | "down") => (event: MouseEvent) => {
        event.preventDefault()
        event.stopPropagation()
        const pos = getCurrentPos()
        if (pos === null) return

        const { state, view } = editor
        const blocks: Array<{ pos: number; nodeSize: number }> = []
        state.doc.forEach((child: any, offset: number) => {
            blocks.push({ pos: offset, nodeSize: child.nodeSize })
        })

        const index = blocks.findIndex(block => block.pos === pos)
        if (index === -1) return
        const targetIndex = direction === "up" ? index - 1 : index + 1
        if (targetIndex < 0 || targetIndex >= blocks.length) return

        const selectedBlock = blocks[index]
        const targetBlock = blocks[targetIndex]
        const slice = state.doc.slice(selectedBlock.pos, selectedBlock.pos + selectedBlock.nodeSize)
        let tr = state.tr.delete(selectedBlock.pos, selectedBlock.pos + selectedBlock.nodeSize)
        const insertPos = direction === "up"
            ? targetBlock.pos
            : targetBlock.pos + targetBlock.nodeSize - selectedBlock.nodeSize
        tr = tr.insert(insertPos, slice.content)
        view.dispatch(tr.scrollIntoView())
        editor.commands.focus()
    }

    return (
        <NodeViewWrapper
            className={cn("group/erg-block relative", attrs.class, selected && "ProseMirror-selectednode")}
            data-erg-block={attrs.dataErgBlock}
            data-bg={attrs.dataBg}
            data-tone={attrs.dataTone}
            data-width={attrs.dataWidth}
            data-accent={attrs.dataAccent}
            data-layout={attrs.dataLayout}
        >
            <div
                contentEditable={false}
                className={cn(
                    "absolute -top-11 left-3 z-30 flex items-center gap-1 rounded-xl border bg-white/95 p-1 text-zinc-600 opacity-0 shadow-lg backdrop-blur transition group-hover/erg-block:opacity-100",
                    selected && "opacity-100"
                )}
            >
                <button
                    type="button"
                    className="flex h-8 items-center gap-1 rounded-lg px-2 text-xs font-semibold hover:bg-zinc-100"
                    title="Kéo để đổi vị trí khối"
                    data-drag-handle
                >
                    <GripVertical className="h-4 w-4" />
                    Khối
                </button>
                <button type="button" className="grid h-8 w-8 place-items-center rounded-lg hover:bg-zinc-100" title="Di chuyển lên" onClick={moveBlock("up")}>
                    <ArrowUp className="h-4 w-4" />
                </button>
                <button type="button" className="grid h-8 w-8 place-items-center rounded-lg hover:bg-zinc-100" title="Di chuyển xuống" onClick={moveBlock("down")}>
                    <ArrowDown className="h-4 w-4" />
                </button>
                <button type="button" className="grid h-8 w-8 place-items-center rounded-lg hover:bg-zinc-100" title="Nhân bản khối" onClick={duplicateBlock}>
                    <Copy className="h-4 w-4" />
                </button>
                <button type="button" className="grid h-8 w-8 place-items-center rounded-lg text-red-600 hover:bg-red-50" title="Xóa khối" onClick={deleteBlock}>
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>
            <NodeViewContent />
        </NodeViewWrapper>
    )
}

const ErgSectionBlock = Node.create({
    name: "ergSectionBlock",
    group: "block",
    content: "block+",
    defining: true,
    selectable: true,
    draggable: true,
    isolating: true,

    addAttributes() {
        return {
            dataErgBlock: {
                default: "section",
                parseHTML: element => element.getAttribute("data-erg-block") || "section",
                renderHTML: attributes => attributes.dataErgBlock ? { "data-erg-block": attributes.dataErgBlock } : {},
            },
            class: {
                default: null,
                parseHTML: element => element.getAttribute("class"),
                renderHTML: attributes => attributes.class ? { class: attributes.class } : {},
            },
            dataBg: {
                default: "plain",
                parseHTML: element => element.getAttribute("data-bg") || "plain",
                renderHTML: attributes => attributes.dataBg ? { "data-bg": attributes.dataBg } : {},
            },
            dataTone: {
                default: "light",
                parseHTML: element => element.getAttribute("data-tone") || "light",
                renderHTML: attributes => attributes.dataTone ? { "data-tone": attributes.dataTone } : {},
            },
            dataWidth: {
                default: "normal",
                parseHTML: element => element.getAttribute("data-width") || "normal",
                renderHTML: attributes => attributes.dataWidth ? { "data-width": attributes.dataWidth } : {},
            },
            dataAccent: {
                default: "blue",
                parseHTML: element => element.getAttribute("data-accent") || "blue",
                renderHTML: attributes => attributes.dataAccent ? { "data-accent": attributes.dataAccent } : {},
            },
            dataLayout: {
                default: null,
                parseHTML: element => element.getAttribute("data-layout"),
                renderHTML: attributes => attributes.dataLayout ? { "data-layout": attributes.dataLayout } : {},
            },
        }
    },

    parseHTML() {
        return [{ tag: "section[data-erg-block]" }]
    },

    renderHTML({ HTMLAttributes }) {
        return ["section", mergeAttributes(HTMLAttributes), 0]
    },

    addNodeView() {
        return ReactNodeViewRenderer(ErgSectionBlockView)
    },
})

function ImageTextBlockView(props: any) {
    const { node, editor, selected, getPos } = props
    const attrs = node.attrs
    const fileInputRef = useRef<HTMLInputElement | null>(null)
    const imagePosition = attrs.imagePosition === "left" ? "left" : "right"

    const getCurrentPos = () => {
        if (typeof getPos !== "function") return null
        const pos = getPos()
        return typeof pos === "number" ? pos : null
    }

    const updateAttrs = (nextAttrs: Record<string, unknown>, focusEditor = false) => {
        const pos = getCurrentPos()
        if (pos === null) return
        const tr = editor.state.tr.setNodeMarkup(pos, undefined, {
            ...node.attrs,
            ...nextAttrs,
        })
        editor.view.dispatch(tr)
        if (focusEditor) editor.commands.focus()
    }

    const deleteBlock = (event: MouseEvent) => {
        event.preventDefault()
        event.stopPropagation()
        const pos = getCurrentPos()
        if (pos === null) return
        editor.chain().focus().deleteRange({ from: pos, to: pos + node.nodeSize }).run()
    }

    const duplicateBlock = (event: MouseEvent) => {
        event.preventDefault()
        event.stopPropagation()
        const pos = getCurrentPos()
        if (pos === null) return
        const { state, view } = editor
        const tr = state.tr.insert(pos + node.nodeSize, node.copy(node.content))
        view.dispatch(tr.scrollIntoView())
        editor.commands.focus()
    }

    const moveBlock = (direction: "up" | "down") => (event: MouseEvent) => {
        event.preventDefault()
        event.stopPropagation()
        const pos = getCurrentPos()
        if (pos === null) return

        const { state, view } = editor
        const blocks: Array<{ pos: number; nodeSize: number }> = []
        state.doc.forEach((child: any, offset: number) => {
            blocks.push({ pos: offset, nodeSize: child.nodeSize })
        })

        const index = blocks.findIndex(block => block.pos === pos)
        if (index === -1) return
        const targetIndex = direction === "up" ? index - 1 : index + 1
        if (targetIndex < 0 || targetIndex >= blocks.length) return

        const selectedBlock = blocks[index]
        const targetBlock = blocks[targetIndex]
        const slice = state.doc.slice(selectedBlock.pos, selectedBlock.pos + selectedBlock.nodeSize)
        let tr = state.tr.delete(selectedBlock.pos, selectedBlock.pos + selectedBlock.nodeSize)
        const insertPos = direction === "up"
            ? targetBlock.pos
            : targetBlock.pos + targetBlock.nodeSize - selectedBlock.nodeSize
        tr = tr.insert(insertPos, slice.content)
        view.dispatch(tr.scrollIntoView())
        editor.commands.focus()
    }

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        try {
            const url = await handleImageUpload(file)
            updateAttrs({
                src: url,
                alt: attrs.alt || file.name.replace(/\.[^.]+$/, ""),
                caption: attrs.caption || file.name.replace(/\.[^.]+$/, ""),
            })
        } catch (error) {
            console.error("Upload image text block failed:", error)
        } finally {
            event.target.value = ""
        }
    }

    const image = (
        <figure contentEditable={false} className="erg-image-text-figure">
            <div className="erg-image-text-image-frame">
                <img src={attrs.src} alt={attrs.alt || ""} title={attrs.title || undefined} />
                <div className="erg-image-text-image-actions">
                    <button type="button" title="Đổi ảnh" onClick={() => fileInputRef.current?.click()}>
                        <ImagePlus className="h-4 w-4" />
                    </button>
                    <button type="button" title="Ảnh bên trái" className={imagePosition === "left" ? "is-active" : undefined} onClick={() => updateAttrs({ imagePosition: "left" }, true)}>
                        <PanelLeft className="h-4 w-4" />
                    </button>
                    <button type="button" title="Ảnh bên phải" className={imagePosition === "right" ? "is-active" : undefined} onClick={() => updateAttrs({ imagePosition: "right" }, true)}>
                        <PanelRight className="h-4 w-4" />
                    </button>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </div>
            <figcaption>
                <input
                    value={attrs.caption || ""}
                    placeholder="Thêm chú thích ảnh..."
                    onChange={(event) => updateAttrs({ caption: event.target.value })}
                />
            </figcaption>
        </figure>
    )

    const copy = (
        <div className="erg-image-text-copy">
            <NodeViewContent className="erg-image-text-content" />
        </div>
    )

    return (
        <NodeViewWrapper
            as="section"
            className={cn(
                "erg-image-text-node group/image-text relative",
                selected && "ProseMirror-selectednode"
            )}
            data-erg-block="image-text"
            data-editor-node="image-text"
            data-layout={imagePosition === "left" ? "image-text" : "text-image"}
            data-bg={attrs.dataBg}
            data-tone={attrs.dataTone}
            data-width={attrs.dataWidth}
            data-accent={attrs.dataAccent}
            data-variant={attrs.dataVariant}
            style={{ "--erg-image-column": `${attrs.imageWidth || 44}%` } as any}
        >
            <div
                contentEditable={false}
                className={cn(
                    "absolute -top-11 left-3 z-30 flex items-center gap-1 rounded-xl border bg-white/95 p-1 text-zinc-600 opacity-0 shadow-lg backdrop-blur transition group-hover/image-text:opacity-100",
                    selected && "opacity-100"
                )}
            >
                <button type="button" className="flex h-8 items-center gap-1 rounded-lg px-2 text-xs font-semibold hover:bg-zinc-100" title="Kéo để đổi vị trí khối" data-drag-handle>
                    <GripVertical className="h-4 w-4" />
                    Ảnh + chữ
                </button>
                <button type="button" className="grid h-8 w-8 place-items-center rounded-lg hover:bg-zinc-100" title="Di chuyển lên" onClick={moveBlock("up")}>
                    <ArrowUp className="h-4 w-4" />
                </button>
                <button type="button" className="grid h-8 w-8 place-items-center rounded-lg hover:bg-zinc-100" title="Di chuyển xuống" onClick={moveBlock("down")}>
                    <ArrowDown className="h-4 w-4" />
                </button>
                <button type="button" className="grid h-8 w-8 place-items-center rounded-lg hover:bg-zinc-100" title="Nhân bản khối" onClick={duplicateBlock}>
                    <Copy className="h-4 w-4" />
                </button>
                <button type="button" className="grid h-8 w-8 place-items-center rounded-lg text-red-600 hover:bg-red-50" title="Xóa khối" onClick={deleteBlock}>
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>

            <div className="erg-image-text-grid">
                {imagePosition === "left" ? image : copy}
                {imagePosition === "left" ? copy : image}
            </div>
        </NodeViewWrapper>
    )
}

const ImageTextBlock = Node.create({
    name: "imageTextBlock",
    group: "block",
    content: "block+",
    defining: true,
    selectable: true,
    draggable: true,
    isolating: true,

    addAttributes() {
        return {
            dataErgBlock: {
                default: "image-text",
                renderHTML: () => ({ "data-erg-block": "image-text" }),
            },
            src: {
                default: "https://media.erg.edu.vn/logo/erg.png",
                parseHTML: element => element.querySelector("img")?.getAttribute("src") || "https://media.erg.edu.vn/logo/erg.png",
            },
            alt: {
                default: "ERG Edurise Global",
                parseHTML: element => element.querySelector("img")?.getAttribute("alt") || "ERG Edurise Global",
            },
            title: {
                default: null,
                parseHTML: element => element.querySelector("img")?.getAttribute("title"),
            },
            caption: {
                default: "Hình minh họa chương trình tại ERG",
                parseHTML: element => element.querySelector("figcaption")?.textContent || element.querySelector("img")?.getAttribute("data-caption"),
            },
            imagePosition: {
                default: "right",
                parseHTML: element => element.getAttribute("data-layout") === "image-text" ? "left" : "right",
            },
            imageWidth: {
                default: 44,
                parseHTML: element => Number(element.getAttribute("data-image-width") || 44),
            },
            dataBg: {
                default: "plain",
                parseHTML: element => element.getAttribute("data-bg") || "plain",
            },
            dataTone: {
                default: "light",
                parseHTML: element => element.getAttribute("data-tone") || "light",
            },
            dataWidth: {
                default: "wide",
                parseHTML: element => element.getAttribute("data-width") || "wide",
            },
            dataAccent: {
                default: "blue",
                parseHTML: element => element.getAttribute("data-accent") || "blue",
            },
            dataVariant: {
                default: "default",
                parseHTML: element => element.getAttribute("data-variant") || "default",
            },
        }
    },

    parseHTML() {
        return [
            { tag: 'section[data-editor-node="image-text"]', contentElement: ".erg-block-copy" },
            { tag: 'section[data-erg-block="image-text"]', contentElement: ".erg-block-copy" },
        ]
    },

    renderHTML({ node }) {
        const attrs = node.attrs
        const layout = attrs.imagePosition === "left" ? "image-text" : "text-image"
        const sectionAttrs = {
            "data-erg-block": "image-text",
            "data-editor-node": "image-text",
            "data-layout": layout,
            "data-bg": attrs.dataBg || "plain",
            "data-tone": attrs.dataTone || "light",
            "data-width": attrs.dataWidth || "wide",
            "data-accent": attrs.dataAccent || "blue",
            "data-variant": attrs.dataVariant || "default",
            "data-image-width": String(attrs.imageWidth || 44),
            class: "erg-block erg-block-image-text",
            style: `--erg-image-column: ${attrs.imageWidth || 44}%`,
        }
        const figure = [
            "figure",
            { class: "erg-figure" },
            [
                "img",
                {
                    src: attrs.src,
                    alt: attrs.alt || "",
                    title: attrs.title || undefined,
                    "data-caption": attrs.caption || "",
                    "data-align": "center",
                    "data-width": "100%",
                },
            ],
            attrs.caption ? ["figcaption", attrs.caption] : ["figcaption", ""],
        ]
        const copy = ["div", { class: "erg-block-copy" }, 0]

        return attrs.imagePosition === "left"
            ? ["section", sectionAttrs, figure, copy]
            : ["section", sectionAttrs, copy, figure]
    },

    addNodeView() {
        return ReactNodeViewRenderer(ImageTextBlockView)
    },
})

// BỔ SUNG: Custom FontSize Extension
const FontSize = Extension.create({
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

const MainToolbarContent = ({
    onHighlighterClick,
    onLinkClick,
    isMobile,
    editor,
}: {
    onHighlighterClick: () => void
    onLinkClick: () => void
    isMobile: boolean
    editor: any
}) => {
    // CẬP NHẬT: Dữ liệu Font có thêm "Mặc định"
    const fonts = [
        { name: 'Mặc định', value: '' },
        { name: 'Inter', value: 'Inter, sans-serif' },
        { name: 'Lora (Serif)', value: 'Lora, serif' },
        { name: 'Mono', value: '"JetBrains Mono", monospace' },
        { name: 'Oswald', value: 'Oswald, sans-serif' },
    ]

    // CẬP NHẬT: Bảng Size chuẩn từ 8px - 72px
    const sizes = ['8px', '10px', '12px', '14px', '16px', '18px', '20px', '24px', '30px', '36px', '48px', '60px', '72px']

    if (!editor) return null

    // LOGIC CẬP NHẬT LABEL THEO TRẠNG THÁI ACTIVE
    const currentFontAttr = editor.getAttributes('textStyle').fontFamily
    const currentFont = fonts.find(f => f.value === currentFontAttr)?.name || (currentFontAttr ? 'Custom' : 'Mặc định')
    const currentSize = editor.getAttributes('textStyle').fontSize || '16px'

    return (
        <>
            <ToolbarGroup>
                <UndoRedoButton action="undo" />
                <UndoRedoButton action="redo" />
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup>
                {/* CẬP NHẬT: Heading hỗ trợ từ 1 - 6 */}
                <HeadingDropdownMenu levels={[1, 2, 3, 4, 5, 6]} portal={isMobile} />

                {/* Font Family Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button data-style="ghost" className="h-8 gap-1 px-2 font-normal min-w-[90px] justify-between border">
                            <span className="truncate text-[11px]">{currentFont}</span>
                            <ChevronDown className="h-3 w-3 opacity-50" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="max-h-60 overflow-y-auto">
                        {fonts.map((font) => (
                            <DropdownMenuItem
                                key={font.name}
                                onClick={() => font.value ? editor.chain().focus().setFontFamily(font.value).run() : editor.chain().focus().unsetFontFamily().run()}
                                style={{ fontFamily: font.value }}
                            >
                                {font.name}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Font Size Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button data-style="ghost" className="h-8 gap-1 px-2 font-normal min-w-[65px] justify-between border">
                            <span className="truncate text-[11px]">{currentSize}</span>
                            <ChevronDown className="h-3 w-3 opacity-50" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="max-h-60 overflow-y-auto">
                        {sizes.map((size) => (
                            <DropdownMenuItem key={size} onClick={() => editor.chain().focus().setFontSize(size).run()}>
                                {size}
                            </DropdownMenuItem>
                        ))}
                        <DropdownMenuItem onClick={() => editor.chain().focus().unsetFontSize().run()}>
                            Mặc định
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <ListDropdownMenu
                    types={["bulletList", "orderedList", "taskList"]}
                    portal={isMobile}
                />
                <BlockquoteButton />
                <CodeBlockButton />
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup>
                <MarkButton type="bold" />
                <MarkButton type="italic" />
                <MarkButton type="strike" />
                <MarkButton type="code" />
                <MarkButton type="underline" />
                {!isMobile ? (
                    <ColorHighlightPopover />
                ) : (
                    <ColorHighlightPopoverButton onClick={onHighlighterClick} />
                )}
                {!isMobile ? <LinkPopover /> : <LinkButton onClick={onLinkClick} />}
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup>
                <MarkButton type="superscript" />
                <MarkButton type="subscript" />
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup>
                <TextAlignButton align="left" />
                <TextAlignButton align="center" />
                <TextAlignButton align="right" />
                <TextAlignButton align="justify" />
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup>
                <ImageUploadButton text="Ảnh" />
                <Button
                    data-style="ghost"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground border"
                    title="Chèn Mục lục"
                    onClick={() => editor.chain().focus().insertContent('<toc-node></toc-node>').run()}
                >
                    <ListTree className="h-4 w-4" />
                </Button>
            </ToolbarGroup>

            <Spacer />

            {isMobile && <ToolbarSeparator />}

            <ToolbarGroup>
                <ThemeToggle />
            </ToolbarGroup>
        </>
    )
}

const MobileToolbarContent = ({
    type,
    onBack,
}: {
    type: "highlighter" | "link"
    onBack: () => void
}) => (
    <>
        <ToolbarGroup>
            <Button data-style="ghost" onClick={onBack}>
                <ArrowLeftIcon className="tiptap-button-icon" />
                {type === "highlighter" ? (
                    <HighlighterIcon className="tiptap-button-icon" />
                ) : (
                    <LinkIcon className="tiptap-button-icon" />
                )}
            </Button>
        </ToolbarGroup>

        <ToolbarSeparator />

        {type === "highlighter" ? (
            <ColorHighlightPopoverContent />
        ) : (
            <LinkContent />
        )}
    </>
)

// [UPDATE] Thêm props title và onTitleChange
interface SimpleEditorProps {
    initialContent?: string;
    onEditorReady?: (editor: any) => void;
    onRefine?: (text: string, prompt: string) => Promise<string | null>;
    onContentChange?: (html: string) => void;
    onSelectionChange?: (selection: any) => void;
    title?: string;
    onTitleChange?: (value: string) => void;
    isRefining?: boolean;
}

export function SimpleEditor({
    initialContent = "",
    onEditorReady,
    onRefine,
    onContentChange,
    onSelectionChange,
    title = "",
    onTitleChange,
    isRefining
}: SimpleEditorProps) {
    const isMobile = useIsBreakpoint()
    const [mobileView, setMobileView] = useState<"main" | "highlighter" | "link">(
        "main"
    )

    // [OPTIMIZATION] Dùng local state để gõ title mượt hơn
    const [localTitle, setLocalTitle] = useState(title);
    const syncTimeoutRef = useRef<any>(null);

    const emitSelection = (editor: any) => {
        if (!onSelectionChange) return;
        const { selection } = editor.state;

        if (selection instanceof NodeSelection && selection.node?.type?.name === "image") {
            onSelectionChange({
                type: "image",
                attrs: selection.node.attrs,
                pos: selection.from,
                nodeSize: selection.node.nodeSize,
            });
            return;
        }

        if (selection instanceof NodeSelection && selection.node?.type?.name === "ergSectionBlock") {
            onSelectionChange({
                type: "section",
                attrs: selection.node.attrs,
                pos: selection.from,
                nodeSize: selection.node.nodeSize,
            });
            return;
        }

        if (selection instanceof NodeSelection && selection.node?.type?.name === "imageTextBlock") {
            onSelectionChange({
                type: "section",
                attrs: selection.node.attrs,
                pos: selection.from,
                nodeSize: selection.node.nodeSize,
            });
            return;
        }

        const { $from } = selection;
        for (let depth = $from.depth; depth > 0; depth -= 1) {
            const node = $from.node(depth);
            if (node.type.name === "ergSectionBlock") {
                onSelectionChange({
                    type: "section",
                    attrs: node.attrs,
                    pos: $from.before(depth),
                    nodeSize: node.nodeSize,
                });
                return;
            }
            if (node.type.name === "imageTextBlock") {
                onSelectionChange({
                    type: "section",
                    attrs: node.attrs,
                    pos: $from.before(depth),
                    nodeSize: node.nodeSize,
                });
                return;
            }
        }

        onSelectionChange(null);
    };

    // Đồng bộ ngược từ Prop vào Local State 
    // Chỉ cập nhật khi tiêu đề thực sự khác biệt (để AI có thể đổ dữ liệu vào)
    useEffect(() => {
        if (title !== localTitle && title !== "") {
            setLocalTitle(title);
        }
    }, [title]);

    // [NEW] Debounced sync lên cha để tránh giật lag toàn bộ trang
    const debouncedSyncTitle = (val: string) => {
        if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
        syncTimeoutRef.current = setTimeout(() => {
            if (onTitleChange) onTitleChange(val);
        }, 1000); // Tăng lên 1s để gõ cho sướng, không làm phiền trang mẹ quá nhiều
    };

    // Dọn dẹp timeout
    useEffect(() => {
        return () => {
            if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
        };
    }, []);

    const editor = useEditor({
        immediatelyRender: false,
        editorProps: {
            attributes: {
                autocomplete: "off",
                autocorrect: "off",
                autocapitalize: "off",
                "aria-label": "Main content area, start typing to enter text.",
                class: "simple-editor",
            },
        },
        onCreate({ editor }) {
            if (onEditorReady) onEditorReady(editor);
            onContentChange?.(editor.getHTML());
            emitSelection(editor);
        },
        onUpdate({ editor }) {
            onContentChange?.(editor.getHTML());
            emitSelection(editor);
        },
        onSelectionUpdate({ editor }) {
            emitSelection(editor);
        },
        extensions: [
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
        ],
        content: initialContent,
    })

    return (
        <div className="simple-editor-wrapper flex flex-col w-full h-full relative bg-white dark:bg-[#191919]">
            <EditorContext.Provider value={{ editor }}>

                {/* TOOLBAR Ở TRÊN CÙNG (Sticky mặc định do Flex Layout) */}
                <div className="shrink-0 border-b z-50 relative bg-white dark:bg-[#191919]">
                    <Toolbar className="w-full">
                        {mobileView === "main" ? (
                            <MainToolbarContent
                                onHighlighterClick={() => setMobileView("highlighter")}
                                onLinkClick={() => setMobileView("link")}
                                isMobile={isMobile}
                                editor={editor}
                            />
                        ) : (
                            <MobileToolbarContent
                                type={mobileView === "highlighter" ? "highlighter" : "link"}
                                onBack={() => setMobileView("main")}
                            />
                        )}
                    </Toolbar>
                </div>

                {/* VÙNG SCROLL CHỨA CẢ TITLE VÀ EDITOR */}
                <div className="flex-1 overflow-y-auto scroll-smooth relative">
                    {/* Refining Overlay */}
                    {isRefining && (
                        <div className="absolute inset-0 z-[60] bg-white/50 dark:bg-zinc-900/50 backdrop-blur-[1px] flex items-center justify-center">
                            <div className="flex flex-col items-center gap-2 bg-white dark:bg-zinc-800 p-4 rounded-xl shadow-2xl border animate-in fade-in zoom-in duration-200">
                                <Loader2 className="h-8 w-8 text-purple-600 animate-spin" />
                                <span className="text-sm font-medium text-purple-600">AI đang xử lý văn bản...</span>
                            </div>
                        </div>
                    )}

                    {editor && onRefine && (
                        <AIBubbleMenu editor={editor} onRefine={onRefine} />
                    )}

                    <div className="mx-auto min-h-full w-full max-w-[1280px] px-8 pt-10 pb-32">

                        {/* [NEW] TEXTAREA TITLE - Cực mượt với Debounced Sync */}
                        {onTitleChange && (
                            <textarea
                                className="mb-6 min-h-[50px] w-full resize-none overflow-hidden border-none bg-transparent p-0 text-left text-4xl font-extrabold leading-tight text-black outline-none placeholder:text-gray-300 focus:ring-0 dark:text-white"
                                placeholder="Tiêu đề bài viết..."
                                value={localTitle}
                                rows={1}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setLocalTitle(val); // HIỂN THỊ CỰC NHANH (KHÔNG DELAY)
                                    debouncedSyncTitle(val); // Đợi gõ xong mới báo lên cha

                                    // Auto resize height
                                    e.target.style.height = 'auto';
                                    e.target.style.height = e.target.scrollHeight + 'px';
                                }}
                                onBlur={() => {
                                    // Khi blur thì sync ngay lập tức để đảm bảo dữ liệu mới nhất
                                    if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
                                    onTitleChange(localTitle);
                                }}
                                onFocus={(e) => {
                                    e.target.style.height = 'auto';
                                    e.target.style.height = e.target.scrollHeight + 'px';
                                }}
                            />
                        )}

                        <EditorContent
                            editor={editor}
                            role="presentation"
                            className="simple-editor-content"
                        />
                    </div>
                </div>

            </EditorContext.Provider>
        </div>
    )
}
