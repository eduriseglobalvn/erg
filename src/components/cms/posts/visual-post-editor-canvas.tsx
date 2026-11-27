"use client"

import dynamic from "next/dynamic"
import type { VisualPostEditorController } from "./use-visual-post-editor-controller"
import type { VisualPostEditorWorkspaceProps } from "./visual-post-editor-types"

const SimpleEditor = dynamic(
    () => import("@/components/cms/shared/editor/tiptap-templates/simple/simple-editor").then(m => ({ default: m.SimpleEditor })),
    {
        ssr: false,
        loading: () => (
            <div className="flex h-full w-full items-center justify-center bg-white">
                <div className="h-72 w-full max-w-4xl animate-pulse rounded-2xl bg-zinc-100" />
            </div>
        ),
    }
)

const BlockNotePostEditor = dynamic(
    () => import("@/components/cms/posts/blocknote-post-editor"),
    {
        ssr: false,
        loading: () => (
            <div className="flex h-full w-full items-center justify-center bg-white">
                <div className="h-72 w-full max-w-4xl animate-pulse rounded-2xl bg-zinc-100" />
            </div>
        ),
    }
)

const AiWriterBar = dynamic(
    () => import("@/components/cms/shared/editor/tiptap-ui/ai-writer-bar").then(m => ({ default: m.AiWriterBar })),
    { ssr: false }
)

type Props = VisualPostEditorWorkspaceProps & VisualPostEditorController

export function VisualPostEditorCanvas({
    mode,
    postId,
    title,
    onTitleChange,
    onContentChange,
    onStructuredContentChange,
    onRefine,
    onStartAi,
    isGenerating,
    aiProgress = 0,
    editorEngine,
    selectionState,
    currentContent,
    handleEditorReady,
    handleBlockNoteReady,
    setSelectionState,
    isInputVisible,
    setShowAiInput,
}: Props) {
    return (
<main className="relative min-h-0 bg-[#fbfcfe]">
    {editorEngine === "canvas" ? (
        <SimpleEditor
            key={`canvas-${mode}-${postId || "new"}`}
            initialContent={currentContent}
            onEditorReady={handleEditorReady}
            onRefine={onRefine}
            title={title}
            onTitleChange={onTitleChange}
            onContentChange={(html) => {
                onStructuredContentChange?.(null)
                onContentChange(html)
            }}
            onSelectionChange={(selection) => {
                setSelectionState(selection)
            }}
        />
    ) : (
        <BlockNotePostEditor
            key={`blocknote-${mode}-${postId || "new"}`}
            title={title}
            onTitleChange={onTitleChange}
            initialContent={currentContent}
            onContentChange={onContentChange}
            onBlocksChange={(blocks) => onStructuredContentChange?.(blocks)}
            onBridgeReady={handleBlockNoteReady}
        />
    )}

    {editorEngine === "canvas" && selectionState?.type === "section" && (
        <div className="pointer-events-none absolute bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-full border bg-white/95 px-3 py-2 text-xs font-semibold text-zinc-600 shadow-lg backdrop-blur">
            Đang chọn khối: {String(selectionState.attrs.dataErgBlock || "section")} · mở tab Khối để chỉnh màu, xóa hoặc di chuyển
        </div>
    )}

    {isInputVisible && onStartAi && (
        <AiWriterBar
            isGenerating={!!isGenerating}
            progress={aiProgress}
            onStart={onStartAi}
            onClose={() => setShowAiInput(false)}
        />
    )}
</main>
    )
}
