"use client"

import React from "react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/cms/ui/select"
import { LayoutTemplate, List, Scale, FileText } from "lucide-react"

export const AI_TEMPLATES = [
    {
        id: "informative",
        name: "Bài viết thông tin/Tin tức",
        description: "Cung cấp tin bài dạng chia sẻ kiến thức, tin tức cơ bản",
        icon: FileText
    },
    {
        id: "howto",
        name: "Hướng dẫn Từng Bước",
        description: "Dạng bài How-to, từng bước thực hành chi tiết",
        icon: LayoutTemplate
    },
    {
        id: "listicle",
        name: "Danh Sách (Listicle)",
        description: "Dạng bài tổng hợp Top danh sách (vd: Top 10...)",
        icon: List
    },
    {
        id: "comparison",
        name: "So sánh phân tích",
        description: "Phân tích ưu nhược điểm, đối chiếu các đối tượng",
        icon: Scale
    }
]

interface AITemplateSelectorProps {
    value: string;
    onValueChange: (value: string) => void;
    disabled?: boolean;
}

export function AITemplateSelector({ value, onValueChange, disabled }: AITemplateSelectorProps) {
    return (
        <Select value={value} onValueChange={onValueChange} disabled={disabled}>
            <SelectTrigger className="w-full h-auto py-2 bg-white/50 hover:bg-white transition-colors">
                <SelectValue placeholder="Chọn mẫu bài viết..." />
            </SelectTrigger>
            <SelectContent>
                {AI_TEMPLATES.map((tpl) => (
                    <SelectItem key={tpl.id} value={tpl.id} className="py-2.5">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded border bg-primary/5 text-primary shrink-0">
                                <tpl.icon className="h-4 w-4" />
                            </div>
                            <div className="flex flex-col text-left items-start justify-center gap-0.5 max-w-[200px]">
                                <span className="text-sm font-bold text-slate-800 leading-tight">{tpl.name}</span>
                                <span className="text-[10px] text-muted-foreground whitespace-normal line-clamp-1 leading-tight">{tpl.description}</span>
                            </div>
                        </div>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
