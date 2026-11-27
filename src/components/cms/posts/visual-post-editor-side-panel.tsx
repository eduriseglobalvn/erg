"use client"

import { useMemo, type ComponentType } from "react"
import { Bot, CheckCircle2, Monitor, PanelRight, PanelRightClose, Settings2 } from "lucide-react"
import { Button } from "@/components/cms/ui/button"
import { Input } from "@/components/cms/ui/input"
import { Label } from "@/components/cms/ui/label"
import { Textarea } from "@/components/cms/ui/textarea"
import { PostSidebarTaxonomy } from "@/components/cms/shared/post-sidebar-taxonomy"
import { PostContentRenderer } from "@/components/shared/post-content-renderer"
import { cn } from "@/lib/utils"
import { localSeoAnalyzer } from "@/utils/local-seo"
import { BlockInspector } from "./visual-post-editor-inspectors"
import { Metric, SectionCard } from "./visual-post-editor-primitives"
import { previewModes } from "./visual-post-editor-config"
import type { VisualPostEditorController } from "./use-visual-post-editor-controller"
import type { PostMetadata, VisualPostEditorWorkspaceProps } from "./visual-post-editor-types"

type Props = VisualPostEditorWorkspaceProps & VisualPostEditorController

export function VisualPostEditorSidePanel({
    panelOpen,
    rightTab,
    setRightTab,
    setPanelOpen,
    previewMode,
    setPreviewMode,
    previewConfig,
    previewPost,
    currentContent,
    postId,
    title,
    postMetadata,
    onMetadataChange,
    selectionState,
    updateSelectedNode,
    deleteSelectedNode,
    duplicateSelectedNode,
    moveSelectedSection,
}: Props) {
    if (!panelOpen) return null

    return (
<aside className="absolute bottom-5 right-5 top-20 z-40 flex w-[min(520px,calc(100vw-2rem))] flex-col overflow-hidden rounded-xl border bg-white shadow-2xl">
    <div className="border-b bg-white p-3">
        <div className="flex items-center justify-between gap-3">
            <div className="grid flex-1 grid-cols-4 gap-1 rounded-xl bg-zinc-100 p-1">
                <PanelTab active={rightTab === "preview"} onClick={() => setRightTab("preview")} icon={Monitor} label="Xem" />
                <PanelTab active={rightTab === "settings"} onClick={() => setRightTab("settings")} icon={Settings2} label="Cài đặt" />
                <PanelTab active={rightTab === "seo"} onClick={() => setRightTab("seo")} icon={PanelRight} label="SEO" />
                <PanelTab active={rightTab === "block"} onClick={() => setRightTab("block")} icon={Bot} label="Khối" />
            </div>
            <Button type="button" variant="ghost" size="icon-sm" onClick={() => setPanelOpen(false)} title="Đóng panel">
                <PanelRightClose className="h-4 w-4" />
            </Button>
        </div>
    </div>

    <div className="min-h-0 flex-1 overflow-y-auto bg-[#f7f8fb]">
        {rightTab === "preview" && (
            <PreviewPanel
                previewMode={previewMode}
                setPreviewMode={setPreviewMode}
                previewConfig={previewConfig}
                previewPost={previewPost}
                currentContent={currentContent}
            />
        )}

        {rightTab === "settings" && (
            <SettingsPanel
                postId={postId}
                title={title}
                currentContent={currentContent}
                postMetadata={postMetadata}
                onMetadataChange={onMetadataChange}
            />
        )}

        {rightTab === "seo" && (
            <LiveSeoPanel
                title={title}
                content={currentContent}
                postMetadata={postMetadata}
                onMetadataChange={onMetadataChange}
            />
        )}

        {rightTab === "block" && (
            <BlockInspector
                selection={selectionState}
                onChange={updateSelectedNode}
                onDelete={deleteSelectedNode}
                onDuplicate={duplicateSelectedNode}
                onMove={moveSelectedSection}
            />
        )}
    </div>
</aside>
    )
}

function PanelTab({
    active,
    onClick,
    icon: Icon,
    label,
}: {
    active: boolean
    onClick: () => void
    icon: ComponentType<{ className?: string }>
    label: string
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "flex h-9 items-center justify-center gap-1.5 rounded-lg text-xs font-semibold transition",
                active ? "bg-white text-zinc-950 shadow-sm" : "text-zinc-500 hover:text-zinc-950"
            )}
        >
            <Icon className="h-3.5 w-3.5" />
            {label}
        </button>
    )
}

function PreviewPanel({
    previewMode,
    setPreviewMode,
    previewConfig,
    previewPost,
    currentContent,
}: {
    previewMode: typeof previewModes[number]["id"]
    setPreviewMode: (value: typeof previewModes[number]["id"]) => void
    previewConfig: typeof previewModes[number]
    previewPost: { title: string; excerpt: string; category: string; thumbnailUrl?: string | null }
    currentContent: string
}) {
    return (
        <div className="p-4">
            <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">Live preview</p>
                    <h2 className="mt-1 text-lg font-bold text-zinc-950">Bản xem trước public</h2>
                    <p className="mt-1 text-sm leading-6 text-zinc-500">
                        Dùng renderer public và cập nhật theo nội dung đang soạn.
                    </p>
                </div>
                <div className="flex rounded-xl border bg-white p-1">
                    {previewModes.map((item) => {
                        const Icon = item.icon
                        return (
                            <button
                                key={item.id}
                                type="button"
                                title={item.label}
                                onClick={() => setPreviewMode(item.id)}
                                className={cn(
                                    "flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500",
                                    previewMode === item.id && "bg-zinc-950 text-white"
                                )}
                            >
                                <Icon className="h-4 w-4" />
                            </button>
                        )
                    })}
                </div>
            </div>

            <div className={cn("mx-auto transition-all", previewConfig.width)}>
                <div className={cn("overflow-hidden border bg-white shadow-sm", previewConfig.frame)}>
                    <div className="flex h-9 items-center gap-1.5 border-b bg-zinc-50 px-3">
                        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                        <span className="ml-2 truncate rounded-md bg-white px-2 py-1 text-[10px] font-medium text-zinc-500">
                            erg.edu.vn/tin-tuc/preview
                        </span>
                    </div>

                    <article className="max-h-[calc(100vh-220px)] overflow-y-auto bg-white">
                        {previewPost.thumbnailUrl && (
                            <div className="aspect-[16/9] bg-zinc-100">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={previewPost.thumbnailUrl} alt="" className="h-full w-full object-cover" />
                            </div>
                        )}
                        <div className={cn("p-6", previewMode !== "mobile" && "md:p-8")}>
                            <div className="mb-4 flex flex-wrap items-center gap-2 text-xs font-medium text-zinc-500">
                                <span className="rounded-md bg-blue-50 px-2 py-1 text-blue-700">{previewPost.category}</span>
                                <span>Bản nháp trực tiếp</span>
                            </div>
                            <h2 className={cn("font-black leading-tight text-zinc-950", previewMode === "mobile" ? "text-3xl" : "text-4xl")}>
                                {previewPost.title}
                            </h2>
                            {previewPost.excerpt && (
                                <p className="mt-4 text-base leading-7 text-zinc-600">{previewPost.excerpt}</p>
                            )}
                            <div className="mt-8">
                                <PostContentRenderer content={currentContent} />
                            </div>
                        </div>
                    </article>
                </div>
            </div>
        </div>
    )
}

function SettingsPanel({
    postId,
    title,
    currentContent,
    postMetadata,
    onMetadataChange,
}: {
    postId?: string
    title: string
    currentContent: string
    postMetadata: PostMetadata
    onMetadataChange: (data: Partial<PostMetadata>) => void
}) {
    const wordCount = useMemo(() => {
        const text = currentContent.replace(/<[^>]+>/g, " ").trim()
        return text ? text.split(/\s+/).length : 0
    }, [currentContent])

    return (
        <div className="space-y-4 p-4">
            <SectionCard title="Tổng quan bài viết" description="Thông tin nhanh để kiểm soát trước khi lưu hoặc xuất bản.">
                <div className="grid grid-cols-3 gap-2">
                    <Metric label="ID" value={postId ? "Đã có" : "Bài mới"} />
                    <Metric label="Từ" value={`${wordCount}`} />
                    <Metric label="Trạng thái" value={postMetadata.status || "draft"} />
                </div>
            </SectionCard>

            <SectionCard title="Phân loại & ảnh đại diện" description="Nhóm nội dung, trạng thái và thumbnail dùng cho card tin tức.">
                <PostSidebarTaxonomy post={postMetadata} onUpdate={onMetadataChange} />
            </SectionCard>

            <SectionCard title="Tóm tắt hiển thị" description="Sapo và slug phục vụ danh sách tin, preview và chia sẻ.">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-xs font-bold">Slug</Label>
                        <Input
                            value={postMetadata.slug || ""}
                            placeholder="tu-dong-tao-tu-tieu-de"
                            onChange={(event) => onMetadataChange({ slug: event.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-bold">Mô tả ngắn</Label>
                        <Textarea
                            value={postMetadata.excerpt || ""}
                            placeholder={`Tóm tắt bài "${title || "chưa có tiêu đề"}"...`}
                            className="min-h-24"
                            onChange={(event) => onMetadataChange({ excerpt: event.target.value })}
                        />
                    </div>
                </div>
            </SectionCard>
        </div>
    )
}

function LiveSeoPanel({
    title,
    content,
    postMetadata,
    onMetadataChange,
}: {
    title: string
    content: string
    postMetadata: PostMetadata
    onMetadataChange: (data: Partial<PostMetadata>) => void
}) {
    const keyword = postMetadata.keywords || postMetadata.focusKeyword || ""
    const metaDescription = postMetadata.metaDescription || postMetadata.excerpt || ""
    const analysis = useMemo(
        () => localSeoAnalyzer(content, postMetadata.metaTitle || title, metaDescription, keyword, postMetadata.slug || ""),
        [content, keyword, metaDescription, postMetadata.metaTitle, postMetadata.slug, title]
    )

    const scoreTone = analysis.overallScore >= 80
        ? "text-emerald-600 bg-emerald-50 border-emerald-100"
        : analysis.overallScore >= 55
            ? "text-amber-600 bg-amber-50 border-amber-100"
            : "text-red-600 bg-red-50 border-red-100"

    return (
        <div className="space-y-4 p-4">
            <div className={cn("rounded-2xl border p-4", scoreTone)}>
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-70">SEO live</p>
                        <h2 className="mt-1 text-xl font-black">{analysis.overallScore}/100</h2>
                        <p className="mt-1 text-sm opacity-80">Chấm điểm ngay khi đang soạn, không cần lưu nháp.</p>
                    </div>
                    <div
                        className="grid h-16 w-16 place-items-center rounded-full border-4 border-current bg-white text-lg font-black"
                        style={{ opacity: 0.95 }}
                    >
                        {analysis.overallScore}
                    </div>
                </div>
            </div>

            <SectionCard title="Meta SEO" description="Tối ưu cách Google và mạng xã hội hiển thị bài viết.">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label className="text-xs font-bold">Meta title</Label>
                            <span className={cn("text-xs font-semibold", analysis.titleAnalysis.length > 70 ? "text-red-500" : "text-zinc-500")}>
                                {analysis.titleAnalysis.length}/70
                            </span>
                        </div>
                        <Input
                            value={postMetadata.metaTitle || ""}
                            placeholder={title || "Tiêu đề bài viết"}
                            onChange={(event) => onMetadataChange({ metaTitle: event.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label className="text-xs font-bold">Meta description</Label>
                            <span className={cn("text-xs font-semibold", analysis.metaAnalysis.length > 160 ? "text-red-500" : "text-zinc-500")}>
                                {analysis.metaAnalysis.length}/160
                            </span>
                        </div>
                        <Textarea
                            value={postMetadata.metaDescription || ""}
                            placeholder="Mô tả ngắn gọn, có từ khóa chính và lý do người đọc nên mở bài."
                            className="min-h-24"
                            onChange={(event) => onMetadataChange({ metaDescription: event.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-bold">Từ khóa chính</Label>
                        <Input
                            value={postMetadata.keywords || ""}
                            placeholder="Ví dụ: khóa học CNTT nâng cao"
                            onChange={(event) => onMetadataChange({ keywords: event.target.value })}
                        />
                    </div>
                </div>
            </SectionCard>

            <SectionCard title="Phân tích nội dung" description="Các chỉ số được tính trực tiếp từ HTML đang soạn.">
                <div className="grid grid-cols-2 gap-2">
                    <Metric label="Số từ" value={`${analysis.contentAnalysis.wordCount}`} />
                    <Metric label="H2/H3" value={`${analysis.contentAnalysis.headingStructure.h2}/${analysis.contentAnalysis.headingStructure.h3}`} />
                    <Metric label="Ảnh có alt" value={`${analysis.technicalAnalysis.imageAltTags.withAlt}/${analysis.technicalAnalysis.imageAltTags.total}`} />
                    <Metric label="Liên kết nội bộ" value={`${analysis.technicalAnalysis.internalLinks}`} />
                </div>
            </SectionCard>

            <SectionCard title="Gợi ý cải thiện" description="Ưu tiên những điểm tác động trực tiếp tới bài đang soạn.">
                <div className="space-y-2">
                    {analysis.suggestions.length > 0 ? analysis.suggestions.map((suggestion) => (
                        <div key={suggestion} className="flex gap-2 rounded-xl border bg-white p-3 text-sm leading-6 text-zinc-600">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                            <span>{suggestion}</span>
                        </div>
                    )) : (
                        <div className="flex gap-2 rounded-xl border bg-emerald-50 p-3 text-sm leading-6 text-emerald-700">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                            Nội dung đang ổn. Tiếp tục kiểm tra ảnh, internal link và CTA trước khi xuất bản.
                        </div>
                    )}
                </div>
            </SectionCard>

            <SectionCard title="Kỹ thuật SEO" description="Các tùy chọn nâng cao cho crawler và schema.">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-xs font-bold">Canonical URL</Label>
                        <Input
                            value={postMetadata.canonicalUrl || ""}
                            placeholder="https://erg.edu.vn/tin-tuc/..."
                            onChange={(event) => onMetadataChange({ canonicalUrl: event.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-bold">Schema type</Label>
                        <Input
                            value={postMetadata.schemaType || "Article"}
                            placeholder="Article"
                            onChange={(event) => onMetadataChange({ schemaType: event.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <label className="flex items-center gap-2 rounded-xl border bg-white p-3 text-sm">
                            <input
                                type="checkbox"
                                checked={!!postMetadata.noindex}
                                onChange={(event) => onMetadataChange({ noindex: event.target.checked })}
                            />
                            noindex
                        </label>
                        <label className="flex items-center gap-2 rounded-xl border bg-white p-3 text-sm">
                            <input
                                type="checkbox"
                                checked={!!postMetadata.nofollow}
                                onChange={(event) => onMetadataChange({ nofollow: event.target.checked })}
                            />
                            nofollow
                        </label>
                    </div>
                </div>
            </SectionCard>
        </div>
    )
}
