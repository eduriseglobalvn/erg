"use client"

import * as React from "react"
import { ChevronRight, Lightbulb } from "lucide-react"

interface SeoKeywordListProps {
    suggestions: string[]
}

export function SeoKeywordList({ suggestions }: SeoKeywordListProps) {
    if (suggestions.length === 0) {
        return (
            <div className="bg-purple-50/50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="w-4 h-4 text-purple-600" />
                    <h3 className="text-sm font-bold text-purple-900 dark:text-purple-300 uppercase tracking-tight">Gợi ý hành động</h3>
                </div>
                <p className="text-xs text-muted-foreground text-center py-2 italic">
                    Không có gợi ý nào thêm. Bài viết của bạn đã rất tốt!
                </p>
            </div>
        )
    }

    return (
        <div className="bg-purple-50/50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-4 h-4 text-purple-600" />
                <h3 className="text-sm font-bold text-purple-900 dark:text-purple-300 uppercase tracking-tight">Gợi ý hành động</h3>
            </div>
            <ul className="space-y-3">
                {suggestions.map((suggestion, index) => (
                    <li key={index} className="flex gap-2 text-xs text-purple-800 dark:text-purple-400 leading-relaxed font-medium">
                        <ChevronRight className="w-3 h-3 mt-0.5 shrink-0" />
                        {suggestion}
                    </li>
                ))}
            </ul>
        </div>
    )
}
