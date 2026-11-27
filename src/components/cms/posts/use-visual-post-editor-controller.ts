"use client"

import { useEffect, useMemo, useState } from "react"
import type { Content, Editor } from "@tiptap/core"
import type { Node as ProseMirrorNode } from "@tiptap/pm/model"
import type { BlockNoteEditorBridge } from "@/components/cms/posts/blocknote-post-editor"
import { blockTemplates } from "./visual-post-editor-block-templates"
import { blockCategories, previewModes } from "./visual-post-editor-config"
import { createPreviewPost, filterBlockTemplates } from "./visual-post-editor-model"
import { createCoursePresetContent, createCoursePresetHtml, createImageTextBlock } from "./visual-post-editor-presets"
import type {
    BlockTemplate,
    CoursePreset,
    EditorEngine,
    EditorSelectionState,
    SelectionAttrs,
    VisualPostEditorWorkspaceProps,
} from "./visual-post-editor-types"

export function useVisualPostEditorController({
    mode,
    title,
    initialContent = "",
    content,
    onContentChange,
    onStructuredContentChange,
    postMetadata,
    isGenerating,
    onEditorReady,
}: VisualPostEditorWorkspaceProps) {
    const [editor, setEditor] = useState<Editor | null>(null)
    const [editorEngine, setEditorEngine] = useState<EditorEngine>("canvas")
    const [blockNoteBridge, setBlockNoteBridge] = useState<BlockNoteEditorBridge | null>(null)
    const [selectionState, setSelectionState] = useState<EditorSelectionState>(null)
    const [panelOpen, setPanelOpen] = useState(false)
    const [rightTab, setRightTab] = useState<"preview" | "settings" | "seo" | "block">("preview")
    const [previewMode, setPreviewMode] = useState<typeof previewModes[number]["id"]>("desktop")
    const [showAiInput, setShowAiInput] = useState(false)
    const [showBlocks, setShowBlocks] = useState(true)
    const [blockQuery, setBlockQuery] = useState("")
    const [blockCategory, setBlockCategory] = useState<typeof blockCategories[number]>("Tất cả")

    const previewConfig = previewModes.find(item => item.id === previewMode) || previewModes[0]
    const currentContent = content || initialContent
    const publishLabel = mode === "edit" ? "Cập nhật bài viết" : "Đăng bài viết"
    const statusLabel = (postMetadata.status || "draft").toLowerCase()
    const canInsertBlock = editorEngine === "canvas" ? !!editor : !!blockNoteBridge
    const isInputVisible = showAiInput || isGenerating

    const filteredBlocks = useMemo(() => {
        return filterBlockTemplates(blockTemplates, blockCategory, blockQuery)
    }, [blockCategory, blockQuery])

    const previewPost = useMemo(
        () => createPreviewPost(title, {
            excerpt: postMetadata.excerpt,
            thumbnailUrl: postMetadata.thumbnailUrl,
        }),
        [postMetadata.excerpt, postMetadata.thumbnailUrl, title],
    )

    const handleEditorReady = (instance: Editor) => {
        setEditor(instance)
        onEditorReady?.(instance)
        onContentChange(instance.getHTML())
    }

    useEffect(() => {
        if (editor) {
            onEditorReady?.(editor)
        }
    }, [editor, onEditorReady])

    const handleEngineChange = (engine: EditorEngine) => {
        setEditorEngine(engine)
        setPanelOpen(false)
        setSelectionState(null)
        if (engine === "canvas") {
            onStructuredContentChange?.(null)
        }
    }

    const handleBlockNoteReady = (bridge: BlockNoteEditorBridge | null) => {
        setBlockNoteBridge(bridge)
        if (bridge) {
            onContentChange(bridge.getHTML())
            onStructuredContentChange?.(bridge.getBlocks())
        }
    }

    const openPanel = (tab: typeof rightTab) => {
        setRightTab(tab)
        setPanelOpen(true)
    }

    const getTopLevelInsertPos = () => {
        if (!editor) return null

        const { doc, selection } = editor.state
        let insertPos = doc.content.size

        doc.forEach((node: ProseMirrorNode, offset: number) => {
            const end = offset + node.nodeSize
            if (selection.from >= offset && selection.from <= end) {
                insertPos = end
            }
        })

        return insertPos
    }

    const insertTopLevelContent = (contentToInsert: unknown) => {
        if (!editor) return

        const insertPos = getTopLevelInsertPos()
        if (insertPos === null) return

        editor.chain().focus().insertContentAt(insertPos, contentToInsert as Content).run()
    }

    const insertTemplate = (template: BlockTemplate) => {
        if (editorEngine === "blocknote") {
            if (!blockNoteBridge) return
            if (template.preset) {
                blockNoteBridge.insertHtml(createCoursePresetHtml(template.preset))
                return
            }
            if (template.command === "image") {
                blockNoteBridge.insertImagePlaceholder()
                return
            }
            if (template.layoutCommand === "image-text-layout") {
                blockNoteBridge.insertImageTextLayout(template.layoutImagePosition ?? "right")
                return
            }
            if (template.html) {
                blockNoteBridge.insertHtml(template.html)
            }
            return
        }

        if (!editor) return
        if (template.preset) {
            insertTopLevelContent(createCoursePresetContent(template.preset))
            return
        }
        if (template.command === "image") {
            editor.chain().focus().setImageUploadNode().run()
            return
        }
        if (template.layoutCommand === "image-text-layout") {
            insertTopLevelContent(createImageTextBlock(template.layoutImagePosition ?? "right"))
            return
        }
        if (template.html) {
            insertTopLevelContent(template.html)
        }
    }

    const insertImageTextLayoutShortcut = (imagePosition: "left" | "right") => {
        const template = blockTemplates.find(item =>
            item.layoutCommand === "image-text-layout"
            && item.layoutImagePosition === imagePosition
        )
        if (template) {
            insertTemplate(template)
        }
    }

    const insertPresetShortcut = (preset: CoursePreset) => {
        const template = blockTemplates.find(item => item.preset === preset)
        if (template) {
            insertTemplate(template)
        }
    }

    const updateSelectedNode = (attrs: SelectionAttrs) => {
        if (!editor || !selectionState) return
        const { state, view } = editor
        const node = state.doc.nodeAt(selectionState.pos)
        if (!node) return

        const tr = state.tr.setNodeMarkup(selectionState.pos, undefined, {
            ...node.attrs,
            ...attrs,
        })
        view.dispatch(tr)
        editor.commands.focus()
        setSelectionState({
            ...selectionState,
            attrs: {
                ...selectionState.attrs,
                ...attrs,
            },
        })
    }

    const deleteSelectedNode = () => {
        if (!editor || !selectionState) return
        editor.chain().focus().deleteRange({
            from: selectionState.pos,
            to: selectionState.pos + selectionState.nodeSize,
        }).run()
        setSelectionState(null)
    }

    const duplicateSelectedNode = () => {
        if (!editor || !selectionState) return
        const { state, view } = editor
        const node = state.doc.nodeAt(selectionState.pos)
        if (!node) return
        const tr = state.tr.insert(selectionState.pos + node.nodeSize, node.copy(node.content))
        view.dispatch(tr.scrollIntoView())
        editor.commands.focus()
    }

    const moveSelectedSection = (direction: "up" | "down") => {
        if (!editor || !selectionState || selectionState.type !== "section") return
        const { state, view } = editor
        const blocks: Array<{ pos: number; nodeSize: number }> = []
        state.doc.forEach((node: ProseMirrorNode, offset: number) => {
            blocks.push({ pos: offset, nodeSize: node.nodeSize })
        })

        const index = blocks.findIndex(block => block.pos === selectionState.pos)
        if (index === -1) return
        const targetIndex = direction === "up" ? index - 1 : index + 1
        if (targetIndex < 0 || targetIndex >= blocks.length) return

        const selected = blocks[index]
        const target = blocks[targetIndex]
        const slice = state.doc.slice(selected.pos, selected.pos + selected.nodeSize)
        let tr = state.tr.delete(selected.pos, selected.pos + selected.nodeSize)
        const insertPos = direction === "up"
            ? target.pos
            : target.pos + target.nodeSize - selected.nodeSize
        tr = tr.insert(insertPos, slice.content)
        view.dispatch(tr.scrollIntoView())
        editor.commands.focus()
    }

    return {
        editorEngine,
        selectionState,
        panelOpen,
        rightTab,
        previewMode,
        showAiInput,
        showBlocks,
        blockQuery,
        blockCategory,
        previewConfig,
        currentContent,
        publishLabel,
        statusLabel,
        canInsertBlock,
        isInputVisible,
        filteredBlocks,
        previewPost,
        setRightTab,
        setPreviewMode,
        setShowAiInput,
        setShowBlocks,
        setBlockQuery,
        setBlockCategory,
        setPanelOpen,
        setSelectionState,
        handleEditorReady,
        handleEngineChange,
        handleBlockNoteReady,
        openPanel,
        insertTemplate,
        insertImageTextLayoutShortcut,
        insertPresetShortcut,
        updateSelectedNode,
        deleteSelectedNode,
        duplicateSelectedNode,
        moveSelectedSection,
    }
}

export type VisualPostEditorController = ReturnType<typeof useVisualPostEditorController>
