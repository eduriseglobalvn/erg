"use client"

import { ArrowDown, ArrowUp, Copy, Palette, PanelRight, Trash2 } from "lucide-react"
import { Button } from "@/components/cms/ui/button"
import { Input } from "@/components/cms/ui/input"
import { Label } from "@/components/cms/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/cms/ui/select"
import { Slider } from "@/components/cms/ui/slider"
import { Textarea } from "@/components/cms/ui/textarea"
import { cn } from "@/lib/utils"
import { accentOptions, bgOptions, widthOptions } from "./visual-post-editor-config"
import { SectionCard } from "./visual-post-editor-primitives"
import type { EditorSelectionState, SelectionAttrs } from "./visual-post-editor-types"

export function BlockInspector({
    selection,
    onChange,
    onDelete,
    onDuplicate,
    onMove,
}: {
    selection: EditorSelectionState
    onChange: (attrs: SelectionAttrs) => void
    onDelete: () => void
    onDuplicate: () => void
    onMove: (direction: "up" | "down") => void
}) {
    if (!selection) {
        return (
            <div className="flex min-h-[420px] flex-col items-center justify-center p-6 text-center">
                <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-white shadow-sm">
                    <Palette className="h-6 w-6 text-zinc-400" />
                </div>
                <p className="text-sm font-semibold text-zinc-900">Chọn một khối trong canvas</p>
                <p className="mt-2 max-w-xs text-sm leading-6 text-zinc-500">
                    Khi chọn section hoặc ảnh, panel này sẽ hiện màu nền, kích thước, căn lề và thao tác xóa/nhân bản/di chuyển.
                </p>
            </div>
        )
    }

    if (selection.type === "image") {
        return <ImageInspector selection={selection} onChange={onChange} onDelete={onDelete} />
    }

    const isImageTextSection = selection.attrs.dataErgBlock === "image-text" || selection.attrs.dataEditorNode === "image-text" || !!selection.attrs.src
    const imagePosition = selection.attrs.imagePosition === "left" || selection.attrs.dataLayout === "image-text" ? "left" : "right"
    const imageWidth = Number.parseInt(String(selection.attrs.imageWidth || selection.attrs.dataImageWidth || 44), 10)
    const normalizedImageWidth = Number.isFinite(imageWidth) ? Math.min(Math.max(imageWidth, 30), 60) : 44

    return (
        <div className="space-y-4 p-4">
            <SectionCard title="Khối đang chọn" description={`Loại khối: ${String(selection.attrs.dataErgBlock || "section")}`}>
                <div className="grid grid-cols-2 gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => onMove("up")}>
                        <ArrowUp className="h-4 w-4" />
                        Lên
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => onMove("down")}>
                        <ArrowDown className="h-4 w-4" />
                        Xuống
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={onDuplicate}>
                        <Copy className="h-4 w-4" />
                        Nhân bản
                    </Button>
                    <Button type="button" variant="destructive" size="sm" onClick={onDelete}>
                        <Trash2 className="h-4 w-4" />
                        Xóa khối
                    </Button>
                </div>
            </SectionCard>

            {isImageTextSection && (
                <SectionCard title="Ảnh và chữ cùng hàng" description="Dùng phần này để đặt ảnh trái/phải và chỉnh tỷ lệ cột ảnh như Word/Google Docs.">
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-2">
                            <Button
                                type="button"
                                variant={imagePosition === "left" ? "default" : "outline"}
                                size="sm"
                                onClick={() => onChange({ imagePosition: "left", dataLayout: "image-text" })}
                            >
                                <PanelRight className="h-4 w-4 rotate-180" />
                                Ảnh trái
                            </Button>
                            <Button
                                type="button"
                                variant={imagePosition === "right" ? "default" : "outline"}
                                size="sm"
                                onClick={() => onChange({ imagePosition: "right", dataLayout: "text-image" })}
                            >
                                <PanelRight className="h-4 w-4" />
                                Ảnh phải
                            </Button>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label className="text-xs font-bold">Tỷ lệ cột ảnh</Label>
                                <span className="text-xs font-semibold text-zinc-500">{normalizedImageWidth}%</span>
                            </div>
                            <Slider
                                value={[normalizedImageWidth]}
                                min={30}
                                max={60}
                                step={2}
                                onValueChange={(value) => onChange({ imageWidth: value[0], dataImageWidth: value[0] })}
                            />
                        </div>
                    </div>
                </SectionCard>
            )}

            <SectionCard title="Màu nền" description="Đổi nền của section mà public renderer vẫn giữ nguyên.">
                <div className="grid grid-cols-2 gap-2">
                    {bgOptions.map(option => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => onChange({ dataBg: option.value })}
                            className={cn(
                                "flex items-center gap-2 rounded-xl border bg-white p-2 text-sm font-semibold text-zinc-700 transition hover:border-zinc-400",
                                selection.attrs.dataBg === option.value && "border-zinc-950 ring-2 ring-zinc-950/10"
                            )}
                        >
                            <span className={cn("h-6 w-6 rounded-lg border", option.className)} />
                            {option.label}
                        </button>
                    ))}
                </div>
            </SectionCard>

            <SectionCard title="Tone chữ & chiều rộng" description="Dùng cho các block nền tối, hero hoặc section cần rộng hơn bài thường.">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-xs font-bold">Tone chữ</Label>
                        <Select
                            value={String(selection.attrs.dataTone || "light")}
                            onValueChange={(value) => onChange({ dataTone: value })}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="light">Sáng</SelectItem>
                                <SelectItem value="dark">Tối</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-bold">Chiều rộng khối</Label>
                        <div className="grid grid-cols-3 gap-2">
                            {widthOptions.map(option => (
                                <Button
                                    key={option.value}
                                    type="button"
                                    variant={selection.attrs.dataWidth === option.value ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => onChange({ dataWidth: option.value })}
                                >
                                    {option.label}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            </SectionCard>

            <SectionCard title="Màu nhấn" description="Áp dụng cho eyebrow, nút CTA, viền nhấn và chi tiết phụ.">
                <div className="grid grid-cols-2 gap-2">
                    {accentOptions.map(option => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => onChange({ dataAccent: option.value })}
                            className={cn(
                                "flex items-center gap-2 rounded-xl border bg-white p-2 text-sm font-semibold text-zinc-700 transition hover:border-zinc-400",
                                selection.attrs.dataAccent === option.value && "border-zinc-950 ring-2 ring-zinc-950/10"
                            )}
                        >
                            <span className={cn("h-6 w-6 rounded-lg", option.className)} />
                            {option.label}
                        </button>
                    ))}
                </div>
            </SectionCard>
        </div>
    )
}

function ImageInspector({
    selection,
    onChange,
    onDelete,
}: {
    selection: NonNullable<EditorSelectionState>
    onChange: (attrs: SelectionAttrs) => void
    onDelete: () => void
}) {
    const attrs = selection.attrs
    const widthValue = Number.parseInt(String(attrs.width || attrs.dataWidth || 100), 10)
    const normalizedWidth = Number.isFinite(widthValue) ? Math.min(Math.max(widthValue, 30), 100) : 100

    return (
        <div className="space-y-4 p-4">
            <SectionCard title="Ảnh trong bài viết" description="Các thuộc tính này được dùng lại ở public renderer.">
                {typeof attrs.src === "string" && attrs.src && (
                    <div className="mb-4 overflow-hidden rounded-xl border bg-zinc-50">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={attrs.src} alt={String(attrs.alt || "")} className="max-h-52 w-full object-contain" />
                    </div>
                )}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-xs font-bold">Alt text</Label>
                        <Input
                            value={String(attrs.alt || "")}
                            placeholder="Mô tả nội dung ảnh cho SEO/accessibility"
                            onChange={(event) => onChange({ alt: event.target.value })}
                        />
                        {!attrs.alt && <p className="text-xs font-medium text-amber-600">Ảnh đang thiếu alt text.</p>}
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-bold">Caption</Label>
                        <Textarea
                            value={String(attrs.caption || "")}
                            placeholder="Chú thích hiển thị bên dưới ảnh"
                            onChange={(event) => onChange({ caption: event.target.value })}
                            className="min-h-20"
                        />
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label className="text-xs font-bold">Độ rộng</Label>
                            <span className="text-xs font-semibold text-zinc-500">{normalizedWidth}%</span>
                        </div>
                        <Slider
                            value={[normalizedWidth]}
                            min={30}
                            max={100}
                            step={5}
                            onValueChange={(value) => onChange({ width: `${value[0]}%` })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-bold">Căn lề</Label>
                        <div className="grid grid-cols-4 gap-2">
                            {[
                                ["left", "Trái"],
                                ["center", "Giữa"],
                                ["right", "Phải"],
                                ["full", "Full"],
                            ].map(([value, label]) => (
                                <Button
                                    key={value}
                                    type="button"
                                    variant={attrs.align === value ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => onChange({ align: value })}
                                >
                                    {label}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <Button type="button" variant="destructive" className="w-full" onClick={onDelete}>
                        <Trash2 className="h-4 w-4" />
                        Xóa ảnh
                    </Button>
                </div>
            </SectionCard>
        </div>
    )
}
