"use client"

import { useRef, type ChangeEvent, type MouseEvent } from "react"
import { Node, mergeAttributes, NodeViewContent, NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react"
import { ArrowDown, ArrowUp, Copy, GripVertical, ImagePlus, PanelLeft, PanelRight, Trash2 } from "lucide-react"
import { handleImageUpload } from "@/lib/tiptap-utils"
import { cn } from "@/lib/utils"

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

export const ImageTextBlock = Node.create({
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
