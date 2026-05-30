"use client"

import * as React from "react"
import { Check, ChevronDown, Clock, Calendar, Zap } from "lucide-react"
import { Button } from "@/components/cms/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/cms/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/cms/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/cms/ui/select"
import { Label } from "@/components/cms/ui/label"

interface CronEditorProps {
    value: string
    onChange: (value: string) => void
}

export const CronEditor = React.memo(({ value, onChange }: CronEditorProps) => {
    // ... nội dung giữ nguyên
    // Basic detection of cron pattern
    const getActiveTab = (cron: string) => {
        if (!cron) return "minutes"
        if (cron.startsWith("0 */")) return "hours"
        if (cron.startsWith("*/")) return "minutes"
        if (cron.endsWith("* * *")) return "daily"
        if (cron.split(" ").length === 5 && cron.split(" ")[4] !== "*") return "weekly"
        return "minutes"
    }

    const [activeTab, setActiveTab] = React.useState(getActiveTab(value))

    // Parsing components from cron
    const parts = (value || "0 * * * *").split(" ")
    const pMinute = parts[0] || "0"
    const pHour = parts[1] || "0"
    const pDayOfWeek = parts[4] || "*"

    const handleFrequencyChange = (type: string, val: string) => {
        let newCron = value
        if (type === 'minutes') {
            newCron = `*/${val} * * * *`
        } else if (type === 'hours') {
            newCron = `0 */${val} * * *`
        } else if (type === 'daily') {
            const [h, m] = val.split(":")
            newCron = `${parseInt(m)} ${parseInt(h)} * * *`
        } else if (type === 'weekly') {
            const [day, time] = val.split("|")
            const [h, m] = time.split(":")
            newCron = `${parseInt(m)} ${parseInt(h)} * * ${day}`
        }
        onChange(newCron)
    }

    return (
        <div className="flex flex-col gap-3 p-3 border rounded-lg bg-zinc-50 dark:bg-zinc-900/50">
            <Tabs value={activeTab} onValueChange={setActiveTab as any} className="w-full">
                <TabsList className="grid grid-cols-4 h-8 w-full bg-zinc-200/50 dark:bg-zinc-800">
                    <TabsTrigger value="minutes" className="text-[10px] uppercase font-bold">Phút</TabsTrigger>
                    <TabsTrigger value="hours" className="text-[10px] uppercase font-bold">Giờ</TabsTrigger>
                    <TabsTrigger value="daily" className="text-[10px] uppercase font-bold">Ngày</TabsTrigger>
                    <TabsTrigger value="weekly" className="text-[10px] uppercase font-bold">Tuần</TabsTrigger>
                </TabsList>

                {/* Phút */}
                <TabsContent value="minutes" className="mt-3 space-y-2">
                    <Label className="text-[10px] text-muted-foreground uppercase">Tần suất theo phút</Label>
                    <Select
                        value={pMinute.replace("*/", "")}
                        onValueChange={val => handleFrequencyChange('minutes', val)}
                    >
                        <SelectTrigger className="h-9 bg-white dark:bg-zinc-950">
                            <SelectValue placeholder="Chọn phút" />
                        </SelectTrigger>
                        <SelectContent position="popper" className="z-[110]">
                            {[5, 10, 15, 20, 30, 45].map(m => (
                                <SelectItem key={m} value={m.toString()}>Mỗi {m} phút</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </TabsContent>

                {/* Giờ */}
                <TabsContent value="hours" className="mt-3 space-y-2">
                    <Label className="text-[10px] text-muted-foreground uppercase">Tần suất theo giờ</Label>
                    <Select
                        value={pHour.replace("*/", "")}
                        onValueChange={val => handleFrequencyChange('hours', val)}
                    >
                        <SelectTrigger className="h-9 bg-white dark:bg-zinc-950">
                            <SelectValue placeholder="Chọn giờ" />
                        </SelectTrigger>
                        <SelectContent position="popper" className="z-[110]">
                            {[1, 2, 3, 4, 6, 8, 12].map(h => (
                                <SelectItem key={h} value={h.toString()}>Mỗi {h} tiếng</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </TabsContent>

                {/* Ngày */}
                <TabsContent value="daily" className="mt-3 space-y-2">
                    <Label className="text-[10px] text-muted-foreground uppercase">Hàng ngày vào lúc</Label>
                    <div className="flex gap-2">
                        <Select
                            value={pHour.padStart(2, '0')}
                            onValueChange={val => handleFrequencyChange('daily', `${val}:${pMinute}`)}
                        >
                            <SelectTrigger className="h-9 flex-1 bg-white dark:bg-zinc-950">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent position="popper" className="z-[110]">
                                {Array.from({ length: 24 }).map((_, i) => (
                                    <SelectItem key={i} value={i.toString().padStart(2, '0')}>{i.toString().padStart(2, '0')} Giờ</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <span className="flex items-center text-muted-foreground">:</span>
                        <Select
                            value={pMinute.padStart(2, '0')}
                            onValueChange={val => handleFrequencyChange('daily', `${pHour}:${val}`)}
                        >
                            <SelectTrigger className="h-9 flex-1 bg-white dark:bg-zinc-950">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent position="popper" className="z-[110]">
                                {Array.from({ length: 60 }).map((_, i) => (
                                    <SelectItem key={i} value={i.toString().padStart(2, '0')}>{i.toString().padStart(2, '0')} Phút</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </TabsContent>

                {/* Tuần */}
                <TabsContent value="weekly" className="mt-3 space-y-2">
                    <Label className="text-[10px] text-muted-foreground uppercase">Hàng tuần vào lúc</Label>
                    <div className="grid grid-cols-2 gap-2">
                        <Select
                            value={pDayOfWeek}
                            onValueChange={val => handleFrequencyChange('weekly', `${val}|${pHour}:${pMinute}`)}
                        >
                            <SelectTrigger className="h-9 bg-white dark:bg-zinc-950">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent position="popper" className="z-[110]">
                                <SelectItem value="1">Thứ Hai</SelectItem>
                                <SelectItem value="2">Thứ Ba</SelectItem>
                                <SelectItem value="3">Thứ Tư</SelectItem>
                                <SelectItem value="4">Thứ Năm</SelectItem>
                                <SelectItem value="5">Thứ Sáu</SelectItem>
                                <SelectItem value="6">Thứ Bảy</SelectItem>
                                <SelectItem value="0">Chủ Nhật</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select
                            value={`${pHour.padStart(2, '0')}:${pMinute.padStart(2, '0')}`}
                            onValueChange={val => handleFrequencyChange('weekly', `${pDayOfWeek}|${val}`)}
                        >
                            <SelectTrigger className="h-9 bg-white dark:bg-zinc-950">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent position="popper" className="z-[110]">
                                {Array.from({ length: 24 }).map((_, i) => (
                                    <SelectItem key={i} value={`${i.toString().padStart(2, '0')}:00`}>{i.toString().padStart(2, '0')}:00</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </TabsContent>
            </Tabs>

            <div className="mt-2 pt-2 border-t flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                    <Zap className="h-3 w-3 text-primary" />
                    <span className="text-[11px] font-bold font-mono text-primary">{value || "Chưa thiết lập"}</span>
                </div>
                <span className="text-[9px] text-muted-foreground italic uppercase">Cron Syntax</span>
            </div>
        </div>
    )
})
