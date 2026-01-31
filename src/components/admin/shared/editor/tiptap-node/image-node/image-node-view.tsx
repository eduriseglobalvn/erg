"use client"

import React from 'react'
import { NodeViewWrapper, type NodeViewProps } from '@tiptap/react'
import { X } from 'lucide-react'

export const ImageNodeView: React.FC<NodeViewProps> = (props) => {
    const { node, selected, editor, getPos } = props
    const { src, alt, title, width, height } = node.attrs

    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (typeof getPos === 'function') {
            const pos = getPos()
            if (typeof pos === 'number') {
                editor.chain().focus().deleteRange({ from: pos, to: pos + node.nodeSize }).run()
            }
        }
    }

    return (
        <NodeViewWrapper className={`relative inline-block group my-8 outline-none ${selected ? 'ProseMirror-selectednode' : ''}`}>
            <div className="relative inline-block overflow-hidden rounded-lg border dark:border-zinc-800">
                <img
                    src={src}
                    alt={alt}
                    title={title}
                    width={width ?? undefined}
                    height={height ?? undefined}
                    className="block max-w-full h-auto"
                />

                {/* Nút xóa - Chỉ hiện khi hover hoặc khi ảnh được chọn */}
                <button
                    onClick={handleDelete}
                    className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 transform scale-90 group-hover:scale-100 shadow-lg z-10"
                    title="Xóa ảnh"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </NodeViewWrapper>
    )
}
