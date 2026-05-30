"use client"

import { useCallback, useEffect, useMemo, useRef } from "react"
import "@blocknote/mantine/style.css"
import { BlockNoteView } from "@blocknote/mantine"
import { useCreateBlockNote } from "@blocknote/react"
import { vi } from "@blocknote/core/locales"
import type { Block, PartialBlock } from "@blocknote/core"
import { postsApi } from "@/services/posts.api"
import { cn } from "@/lib/utils"

export type BlockNoteEditorBridge = {
    engine: "blocknote"
    getHTML: () => string
    getBlocks: () => Block[]
    insertHtml: (html: string) => void
    insertImagePlaceholder: () => void
    insertImageTextLayout: (imagePosition?: "left" | "right") => void
    replaceWithHtml: (html: string) => void
    focus: () => void
}

interface BlockNotePostEditorProps {
    title: string
    onTitleChange: (value: string) => void
    initialContent?: string
    onContentChange: (html: string) => void
    onBlocksChange?: (blocks: Block[]) => void
    onBridgeReady?: (bridge: BlockNoteEditorBridge | null) => void
    className?: string
}

const defaultBlocks: PartialBlock[] = [
    {
        type: "paragraph",
    },
]

export default function BlockNotePostEditor({
    title,
    onTitleChange,
    initialContent = "",
    onContentChange,
    onBlocksChange,
    onBridgeReady,
    className,
}: BlockNotePostEditorProps) {
    const initializedRef = useRef(false)
    const callbacksRef = useRef({
        onContentChange,
        onBlocksChange,
        onBridgeReady,
    })

    useEffect(() => {
        callbacksRef.current = {
            onContentChange,
            onBlocksChange,
            onBridgeReady,
        }
    }, [onBlocksChange, onBridgeReady, onContentChange])

    const editor = useCreateBlockNote({
        dictionary: vi,
        initialContent: defaultBlocks,
        uploadFile: async (file) => {
            const result = await postsApi.uploadImage(file)
            return result.url
        },
    }, [])

    const emitSnapshot = useCallback(() => {
        const html = editor.blocksToHTMLLossy(editor.document)
        callbacksRef.current.onContentChange(html)
        callbacksRef.current.onBlocksChange?.(editor.document)
        return html
    }, [editor])

    const replaceWithHtml = useCallback((html: string) => {
        const normalizedHtml = html.trim()
        const blocks = normalizedHtml
            ? editor.tryParseHTMLToBlocks(normalizedHtml)
            : defaultBlocks

        editor.replaceBlocks(editor.document, blocks.length > 0 ? blocks : defaultBlocks)
        emitSnapshot()
    }, [editor, emitSnapshot])

    const insertBlocksAtCursor = useCallback((blocks: PartialBlock[]) => {
        if (blocks.length === 0) return

        let referenceBlock: Block | undefined
        try {
            referenceBlock = editor.getTextCursorPosition().block
        } catch {
            referenceBlock = editor.document.at(-1)
        }

        if (!referenceBlock) {
            editor.replaceBlocks(editor.document, blocks)
            emitSnapshot()
            return
        }

        const insertedBlocks = editor.insertBlocks(blocks, referenceBlock, "after")
        const lastInserted = insertedBlocks.at(-1)
        if (lastInserted) {
            editor.setTextCursorPosition(lastInserted, "end")
        }
        editor.focus()
        emitSnapshot()
    }, [editor, emitSnapshot])

    const bridge = useMemo<BlockNoteEditorBridge>(() => ({
        engine: "blocknote",
        getHTML: () => editor.blocksToHTMLLossy(editor.document),
        getBlocks: () => editor.document,
        insertHtml: (html: string) => {
            const blocks = editor.tryParseHTMLToBlocks(html)
            insertBlocksAtCursor(blocks)
        },
        insertImagePlaceholder: () => {
            insertBlocksAtCursor([
                {
                    type: "image",
                    props: {
                        url: "https://media.erg.edu.vn/logo/erg.png",
                        caption: "Thay ảnh này bằng hình ảnh thật của bài viết.",
                    },
                },
            ])
        },
        insertImageTextLayout: (imagePosition = "right") => {
            const textColumn = {
                type: "column",
                children: [
                    {
                        type: "paragraph",
                        content: "Như vậy, để có được chứng chỉ tin học nâng cao bạn cần:",
                    },
                    {
                        type: "bulletListItem",
                        content: "Có kiến thức chuyên sâu về máy tính và thao tác nền tảng trong Tin học.",
                    },
                    {
                        type: "bulletListItem",
                        content: "Đạt các mô đun cơ bản và lựa chọn nhóm mô đun nâng cao phù hợp với mục tiêu.",
                    },
                    {
                        type: "bulletListItem",
                        content: "Được ERG tư vấn lộ trình học, luyện tập và hoàn thiện kỹ năng thực tế.",
                    },
                ],
            } as unknown as PartialBlock

            const imageColumn = {
                type: "column",
                children: [
                    {
                        type: "image",
                        props: {
                            url: "https://media.erg.edu.vn/logo/erg.png",
                            caption: "Thay bằng ảnh minh họa của bài viết.",
                        },
                    },
                ],
            } as unknown as PartialBlock

            insertBlocksAtCursor([
                {
                    type: "columnList",
                    children: imagePosition === "left"
                        ? [imageColumn, textColumn]
                        : [textColumn, imageColumn],
                } as unknown as PartialBlock,
            ])
        },
        replaceWithHtml,
        focus: () => editor.focus(),
    }), [editor, insertBlocksAtCursor, replaceWithHtml])

    useEffect(() => {
        callbacksRef.current.onBridgeReady?.(bridge)
        return () => callbacksRef.current.onBridgeReady?.(null)
    }, [bridge])

    useEffect(() => {
        if (initializedRef.current) return
        initializedRef.current = true

        if (initialContent.trim()) {
            replaceWithHtml(initialContent)
            return
        }

        emitSnapshot()
    }, [emitSnapshot, initialContent, replaceWithHtml])

    return (
        <div className={cn("erg-blocknote-editor flex h-full min-h-0 flex-col bg-white", className)}>
            <div className="shrink-0 border-b bg-white px-8 py-4">
                <textarea
                    value={title}
                    onChange={(event) => onTitleChange(event.target.value)}
                    placeholder="Tiêu đề bài viết..."
                    className="block min-h-[56px] w-full resize-none border-0 bg-transparent p-0 text-4xl font-black leading-tight tracking-normal text-zinc-950 outline-none placeholder:text-zinc-300"
                />
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto bg-white px-8 py-6">
                <BlockNoteView
                    editor={editor}
                    theme="light"
                    className="erg-blocknote-surface h-full"
                    onChange={emitSnapshot}
                />
            </div>
        </div>
    )
}
