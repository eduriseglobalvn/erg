"use client"

import type { MouseEvent } from "react"
import { Node, mergeAttributes, NodeViewContent, NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react"
import { ArrowDown, ArrowUp, Copy, GripVertical, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

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

export const ErgSectionBlock = Node.create({
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
