"use client"

import React from "react"
import { NodeViewWrapper, type NodeViewProps } from "@tiptap/react"
import { AlertCircle, X } from "lucide-react"
import { cn } from "@/lib/utils"

export const ImageNodeView: React.FC<NodeViewProps> = (props) => {
    const { node, selected, editor, getPos } = props
    const { src, alt, title, width, height, caption, align = "center" } = node.attrs

    const handleDelete = (event: React.MouseEvent) => {
        event.preventDefault()
        event.stopPropagation()

        if (typeof getPos === "function") {
            const pos = getPos()
            if (typeof pos === "number") {
                editor.chain().focus().deleteRange({ from: pos, to: pos + node.nodeSize }).run()
            }
        }
    }

    const handleCaptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        editor.chain().focus().updateAttributes("image", { caption: event.target.value }).run()
    }

    const normalizedWidth =
        typeof width === "string" && width.endsWith("%")
            ? width
            : width
                ? `${width}px`
                : undefined

    return (
        <NodeViewWrapper
            className={cn(
                "group my-8 flex outline-none",
                align === "left" && "justify-start",
                align === "center" && "justify-center",
                align === "right" && "justify-end",
                align === "full" && "justify-stretch",
                selected && "ProseMirror-selectednode"
            )}
            data-align={align}
        >
            <figure
                className={cn(
                    "relative m-0 overflow-hidden rounded-xl border bg-white shadow-sm transition-all dark:border-zinc-800 dark:bg-zinc-900",
                    selected && "ring-2 ring-blue-500 ring-offset-2"
                )}
                style={{ width: align === "full" ? "100%" : normalizedWidth, maxWidth: "100%" }}
            >
                <img
                    src={src}
                    alt={alt}
                    title={title}
                    width={width ?? undefined}
                    height={height ?? undefined}
                    className="block h-auto w-full max-w-full bg-zinc-50 object-contain"
                />

                {!alt && (
                    <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-amber-500 px-2 py-1 text-[10px] font-bold uppercase text-white shadow-sm">
                        <AlertCircle className="h-3 w-3" />
                        Thiếu alt
                    </div>
                )}

                <button
                    type="button"
                    onClick={handleDelete}
                    className="absolute right-2 top-2 z-10 flex h-7 w-7 scale-90 items-center justify-center rounded-full bg-black/60 text-white opacity-0 shadow-lg transition-all duration-200 hover:bg-red-500 group-hover:scale-100 group-hover:opacity-100"
                    title="Xóa ảnh"
                >
                    <X className="h-4 w-4" />
                </button>

                <figcaption className="border-t bg-white/95 px-3 py-2 text-center text-sm italic text-zinc-500 dark:bg-zinc-900">
                    <input
                        className="w-full bg-transparent text-center outline-none placeholder:text-zinc-300"
                        value={caption || ""}
                        placeholder="Thêm chú thích ảnh..."
                        onChange={handleCaptionChange}
                    />
                </figcaption>
            </figure>
        </NodeViewWrapper>
    )
}
