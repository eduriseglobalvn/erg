import React from 'react'
import { ChevronDown, ChevronUp, List } from 'lucide-react'

export interface TOCItem {
    id: string
    text: string
    level: number
}

interface TOCBoxProps {
    items: TOCItem[]
    isCollapsed: boolean
    onToggle: () => void
    onItemClick: (id: string) => void
    className?: string
}

export function TOCBox({ items, isCollapsed, onToggle, onItemClick, className = "" }: TOCBoxProps) {
    return (
        <div className={`rounded-lg border bg-card text-card-foreground shadow-sm w-full overflow-hidden ${className}`}>
            <div
                className="flex items-center justify-between p-4 bg-muted/30 cursor-pointer select-none border-b user-select-none"
                onClick={onToggle}
            >
                <div className="flex items-center gap-2 font-semibold text-base">
                    <List className="h-4 w-4" />
                    <span>Nội dung bài viết</span>
                </div>
                {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </div>

            {!isCollapsed && (
                <div className="p-4 bg-background">
                    {items.length === 0 ? (
                        <p className="text-sm text-muted-foreground italic">Chưa có tiêu đề nào...</p>
                    ) : (
                        <ul className="flex flex-col gap-2 list-none m-0 p-0">
                            {items.map((item, index) => (
                                <li
                                    key={`${item.id}-${index}`}
                                    className={`text-sm list-none hover:underline cursor-pointer text-muted-foreground hover:text-primary transition-colors before:content-none ${item.level === 3 ? 'pl-4' : ''}`}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        onItemClick(item.id)
                                    }}
                                >
                                    <a href={`#${item.id}`} className="inherit-color no-underline pointer-events-none">
                                        {item.text}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    )
}
