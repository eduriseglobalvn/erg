'use client'

import * as React from 'react'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { botApi } from '@/services/bot.api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/admin/ui/card'
import { Button } from '@/components/admin/ui/button'
import { Skeleton } from '@/components/admin/ui/skeleton'
import { Bot, Link2, Clock, Copy, Check, MessageSquare, Send, RefreshCw } from 'lucide-react'
import { notificationApi } from '@/services/notification.api'

export default function BotLinkPage() {
    const queryClient = useQueryClient()
    const [copied, setCopied] = useState(false)

    // Channel status
    const { data: channelStatus, isLoading: isLoadingStatus } = useQuery({
        queryKey: ['notifications', 'channel-status'],
        queryFn: () => notificationApi.getChannelStatus(),
    })

    // Generate link code
    const generateMutation = useMutation({
        mutationFn: () => botApi.getLinkCode(),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['bot', 'link-code'] })
            toast.success('Đã tạo mã mới! Mã có hiệu lực trong 5 phút.')
        },
        onError: () => toast.error('Lỗi khi tạo mã'),
    })

    // Auto-generate on mount
    React.useEffect(() => {
        if (!generateMutation.isPending && !generateMutation.data) {
            generateMutation.mutate()
        }
    }, [])

    const linkCode = generateMutation.data

    const copyToClipboard = async () => {
        if (!linkCode?.code) return
        await navigator.clipboard.writeText(`/link ${linkCode.code}`)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const discordReady = !!channelStatus?.discord?.configured
    const telegramReady = !!channelStatus?.telegram?.configured

    return (
        <div className="flex flex-col gap-6 p-6 max-w-2xl mx-auto">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-primary uppercase flex items-center gap-2">
                    <Link2 className="w-8 h-8" /> Kết nối Bot
                </h1>
                <p className="text-muted-foreground mt-1">
                    Liên kết tài khoản Discord hoặc Telegram để điều khiển ERG Crawler từ bot.
                </p>
            </div>

            {/* Link Code Card */}
            <Card className="shadow-sm border-2 border-dashed border-primary/30">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Bot className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <CardTitle>Mã liên kết</CardTitle>
                            <CardDescription>Mã có hiệu lực trong 5 phút</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {generateMutation.isPending ? (
                        <Skeleton className="h-16 w-full" />
                    ) : linkCode ? (
                        <>
                            <div className="bg-muted rounded-lg p-4 text-center">
                                <p className="text-xs text-muted-foreground mb-2">Gửi lệnh này cho ERG Bot</p>
                                <p className="text-2xl font-mono font-bold tracking-widest text-primary select-all">
                                    /link {linkCode.code}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    onClick={copyToClipboard}
                                    className="flex-1 gap-1"
                                    variant={copied ? 'default' : 'outline'}
                                >
                                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    {copied ? 'Đã copy!' : 'Copy lệnh'}
                                </Button>
                                <Button
                                    onClick={() => generateMutation.mutate()}
                                    disabled={generateMutation.isPending}
                                    variant="outline"
                                    className="gap-1"
                                >
                                    <RefreshCw className={`w-4 h-4 ${generateMutation.isPending ? 'animate-spin' : ''}`} />
                                    Tạo mã mới
                                </Button>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                <span>Mã hết hạn sau 5 phút — tạo mã mới nếu cần.</span>
                            </div>
                        </>
                    ) : (
                        <Button onClick={() => generateMutation.mutate()} className="w-full gap-1">
                            <Link2 className="w-4 h-4" /> Tạo mã liên kết
                        </Button>
                    )}
                </CardContent>
            </Card>

            {/* How to connect */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold">Hướng dẫn kết nối</h2>

                {/* Discord */}
                <Card className="shadow-sm">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                    <MessageSquare className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-base">Discord</CardTitle>
                                    <CardDescription>Ưu tiên #1 — dành cho team nội bộ</CardDescription>
                                </div>
                            </div>
                            {discordReady ? (
                                <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                                    <Check className="w-3 h-3" /> Đã cấu hình
                                </span>
                            ) : (
                                <span className="text-xs text-yellow-600 font-medium flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" /> Chưa cấu hình
                                </span>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="text-sm space-y-2 text-muted-foreground">
                        <ol className="list-decimal pl-4 space-y-1">
                            <li>Mở Discord, tìm ERG Bot trong server</li>
                            <li>Gửi tin nhắn: <code className="bg-muted px-1 rounded text-xs">/link {linkCode?.code || 'MÃ_CỦA_BẠN'}</code></li>
                            <li>Bot sẽ xác nhận liên kết thành công</li>
                        </ol>
                    </CardContent>
                </Card>

                {/* Telegram */}
                <Card className="shadow-sm">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                    <Send className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-base">Telegram</CardTitle>
                                    <CardDescription>Ưu tiên #2 — dành cho mobile</CardDescription>
                                </div>
                            </div>
                            {telegramReady ? (
                                <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                                    <Check className="w-3 h-3" /> Đã cấu hình
                                </span>
                            ) : (
                                <span className="text-xs text-yellow-600 font-medium flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" /> Chưa cấu hình
                                </span>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="text-sm space-y-2 text-muted-foreground">
                        <ol className="list-decimal pl-4 space-y-1">
                            <li>Mở Telegram, tìm ERG Bot bằng tên (@your_bot)</li>
                            <li>Gửi: <code className="bg-muted px-1 rounded text-xs">/start</code></li>
                            <li>Gửi: <code className="bg-muted px-1 rounded text-xs">/link {linkCode?.code || 'MÃ_CỦA_BẠN'}</code></li>
                            <li>Bot sẽ xác nhận liên kết thành công</li>
                        </ol>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

// Helper component not from lucide — use existing icon
function AlertCircle({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
    )
}
