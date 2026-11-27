"use client"

import { Columns2, LayoutTemplate, Search, Sparkles, Wand2 } from "lucide-react"
import { Button } from "@/components/cms/ui/button"
import { Input } from "@/components/cms/ui/input"
import { cn } from "@/lib/utils"
import { blockCategories } from "./visual-post-editor-config"
import type { VisualPostEditorController } from "./use-visual-post-editor-controller"
import type { VisualPostEditorWorkspaceProps } from "./visual-post-editor-types"

type Props = VisualPostEditorWorkspaceProps & VisualPostEditorController

export function VisualPostEditorBlockLibrary({
    showBlocks,
    blockQuery,
    setBlockQuery,
    blockCategory,
    setBlockCategory,
    filteredBlocks,
    insertTemplate,
    insertPresetShortcut,
    insertImageTextLayoutShortcut,
    canInsertBlock,
    setShowAiInput,
}: Props) {
    return (
<aside className={cn("min-h-0 overflow-hidden border-r bg-white transition-opacity", showBlocks ? "opacity-100" : "pointer-events-none opacity-0")}>
    <div className="flex h-full min-w-[280px] flex-col">
        <div className="border-b px-4 py-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
                <Wand2 className="h-4 w-4 text-primary" />
                Thư viện block
            </div>
            <p className="mt-1 text-xs leading-5 text-zinc-500">
                Thêm section như Notion, sau đó chọn khối để chỉnh màu, width và thứ tự.
            </p>
            <div className="relative mt-3">
                <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                <Input
                    value={blockQuery}
                    onChange={(event) => setBlockQuery(event.target.value)}
                    placeholder="Tìm hero, gallery, FAQ..."
                    className="h-9 pl-9 text-sm"
                />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
                <Button
                    type="button"
                    variant="default"
                    size="sm"
                    className="col-span-2 justify-start bg-zinc-950 text-xs text-white hover:bg-zinc-800"
                    onClick={() => insertPresetShortcut("courseArticle")}
                    disabled={!canInsertBlock}
                    title="Chèn trọn bộ bố cục giống bài Edusa/ERG"
                >
                    <LayoutTemplate className="h-4 w-4" />
                    Tạo mẫu bài khóa học
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="justify-start text-xs"
                    onClick={() => insertImageTextLayoutShortcut("right")}
                    disabled={!canInsertBlock}
                    title="Chèn chữ bên trái, ảnh bên phải"
                >
                    <Columns2 className="h-4 w-4" />
                    Chữ | ảnh
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="justify-start text-xs"
                    onClick={() => insertImageTextLayoutShortcut("left")}
                    disabled={!canInsertBlock}
                    title="Chèn ảnh bên trái, chữ bên phải"
                >
                    <Columns2 className="h-4 w-4" />
                    Ảnh | chữ
                </Button>
            </div>
        </div>

        <div className="flex gap-1 overflow-x-auto border-b px-3 py-2">
            {blockCategories.map(category => (
                <button
                    key={category}
                    type="button"
                    onClick={() => setBlockCategory(category)}
                    className={cn(
                        "shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition",
                        blockCategory === category
                            ? "bg-zinc-950 text-white"
                            : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                    )}
                >
                    {category}
                </button>
            ))}
        </div>

        <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
            {filteredBlocks.map((template) => {
                const Icon = template.icon
                return (
                    <button
                        key={template.id}
                        type="button"
                        className="group flex w-full items-start gap-3 rounded-xl border border-transparent p-3 text-left transition hover:border-blue-100 hover:bg-blue-50/70"
                        onClick={() => insertTemplate(template)}
                        disabled={!canInsertBlock}
                    >
                        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600 transition group-hover:bg-white group-hover:text-primary">
                            <Icon className="h-4 w-4" />
                        </span>
                        <span className="min-w-0">
                            <span className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
                                {template.title}
                                <span className="rounded-full bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-500">
                                    {template.category}
                                </span>
                            </span>
                            <span className="mt-0.5 block text-xs leading-5 text-zinc-500">{template.description}</span>
                        </span>
                    </button>
                )
            })}
        </div>

        <div className="border-t p-3">
            <Button type="button" variant="outline" className="w-full justify-start" onClick={() => setShowAiInput(true)}>
                <Sparkles className="h-4 w-4 text-violet-600" />
                AI Writer
            </Button>
        </div>
    </div>
</aside>
    )
}
