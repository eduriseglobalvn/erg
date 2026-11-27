"use client"

import { ArrowLeft, Bot, LayoutTemplate, Monitor, PanelRight, Save, Send, Settings2, SquareStack, Wand2 } from "lucide-react"
import { Badge } from "@/components/cms/ui/badge"
import { Button } from "@/components/cms/ui/button"
import { cn } from "@/lib/utils"
import type { VisualPostEditorController } from "./use-visual-post-editor-controller"
import type { VisualPostEditorWorkspaceProps } from "./visual-post-editor-types"

type Props = VisualPostEditorWorkspaceProps & VisualPostEditorController

export function VisualPostEditorHeader({
    mode,
    statusLabel,
    showBlocks,
    setShowBlocks,
    editorEngine,
    handleEngineChange,
    openPanel,
    onSaveDraft,
    onSave,
    isSaving,
    publishLabel,
}: Props) {
    return (
<header className="flex h-14 shrink-0 items-center justify-between border-b bg-white px-4">
    <div className="flex min-w-0 items-center gap-3">
        <Button variant="ghost" size="icon-sm" type="button" onClick={() => history.back()} title="Quay lại">
            <ArrowLeft className="h-4 w-4" />
        </Button>
        <Button
            variant={showBlocks ? "secondary" : "outline"}
            size="sm"
            type="button"
            onClick={() => setShowBlocks(value => !value)}
        >
            <Wand2 className="h-4 w-4" />
            Blocks
        </Button>
        <div className="min-w-0">
            <div className="flex items-center gap-2">
                <h1 className="truncate text-sm font-semibold text-zinc-950">
                    {mode === "edit" ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}
                </h1>
                <Badge variant="outline" className="rounded-md bg-zinc-50 px-1.5 text-[10px] uppercase text-zinc-500">
                    {statusLabel}
                </Badge>
            </div>
            <p className="truncate text-xs text-zinc-500">
                Canvas WYSIWYG rộng hơn, panel mở khi cần để xem trước, SEO hoặc chỉnh block.
            </p>
        </div>
    </div>

    <div className="flex items-center gap-2">
        <div className="hidden items-center rounded-lg border bg-zinc-100 p-1 text-xs font-bold text-zinc-600 lg:flex">
            <button
                type="button"
                onClick={() => handleEngineChange("canvas")}
                className={cn(
                    "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 transition",
                    editorEngine === "canvas" ? "bg-white text-blue-700 shadow-sm" : "hover:text-zinc-900"
                )}
            >
                <LayoutTemplate className="h-3.5 w-3.5" />
                Canvas ERG
            </button>
            <button
                type="button"
                onClick={() => handleEngineChange("blocknote")}
                className={cn(
                    "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 transition",
                    editorEngine === "blocknote" ? "bg-white text-violet-700 shadow-sm" : "hover:text-zinc-900"
                )}
            >
                <SquareStack className="h-3.5 w-3.5" />
                BlockNote
            </button>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={() => openPanel("preview")}>
            <Monitor className="h-4 w-4" />
            Xem trước
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => openPanel("settings")}>
            <Settings2 className="h-4 w-4" />
            Cài đặt
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => openPanel("seo")}>
            <PanelRight className="h-4 w-4" />
            SEO
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => openPanel("block")}>
            <Bot className="h-4 w-4" />
            Khối
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onSaveDraft || onSave} disabled={isSaving}>
            <Save className="h-4 w-4" />
            Lưu nháp
        </Button>
        <Button type="button" size="sm" className="bg-zinc-950 text-white hover:bg-zinc-800" onClick={onSave} disabled={isSaving}>
            <Send className="h-4 w-4" />
            {isSaving ? "Đang lưu..." : publishLabel}
        </Button>
    </div>
</header>
    )
}
