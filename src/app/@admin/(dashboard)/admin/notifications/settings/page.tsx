'use client'

import * as React from 'react'
import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { notificationApi, ChannelStatus, NotificationPreferences } from '@/services/notification.api'
import { botApi } from '@/services/bot.api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/admin/ui/card'
import { Button } from '@/components/admin/ui/button'
import { Input } from '@/components/admin/ui/input'
import { Badge } from '@/components/admin/ui/badge'
import { Skeleton } from '@/components/admin/ui/skeleton'
import { Bell, Send, CheckCircle2, XCircle, RefreshCw, MessageSquare, Bot, Link2 } from 'lucide-react'
import Link from 'next/link'

export default function NotificationSettingsPage() {
    const { data: channelStatus, isLoading: isLoadingStatus } = useQuery<ChannelStatus>({
        queryKey: ['notifications', 'channel-status'],
        queryFn: () => notificationApi.getChannelStatus(),
    })

    const { data: preferences, isLoading: isLoadingPrefs } = useQuery<NotificationPreferences>({
        queryKey: ['notifications', 'preferences'],
        queryFn: () => notificationApi.getPreferences(),
    })

    const discordTest = useMutation({
        mutationFn: (channelId: string) => notificationApi.testDiscord(channelId),
        onSuccess: (data) => alert(data.success ? '✅ Discord test sent!' : `❌ Discord test failed: ${data.error}`),
    })

    const telegramTest = useMutation({
        mutationFn: (chatId: string) => notificationApi.testTelegram(chatId),
        onSuccess: (data) => alert(data.success ? '✅ Telegram test sent!' : `❌ Telegram test failed: ${data.error}`),
    })

    const setCommands = useMutation({
        mutationFn: () => notificationApi.setTelegramCommands(),
        onSuccess: () => alert('✅ Telegram commands registered!'),
    })

    return (
        <div className="flex flex-col gap-6 p-6 max-w-4xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-primary uppercase mb-2">🔔 Cài đặt thông báo</h1>
                <p className="text-muted-foreground">Kết nối Discord & Telegram để nhận thông báo từ ERG Crawler.</p>
            </div>

            {/* Discord */}
            <Card className="shadow-sm">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                <MessageSquare className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Discord</CardTitle>
                                <CardDescription>Thông báo qua Discord (ưu tiên #1)</CardDescription>
                            </div>
                        </div>
                        {isLoadingStatus ? <Skeleton className="h-6 w-20" /> : channelStatus?.discord?.configured ? (
                            <Badge className="bg-green-100 text-green-700 border-green-200 shadow-none gap-1"><CheckCircle2 className="w-3 h-3" /> Đã kết nối</Badge>
                        ) : (
                            <Badge variant="outline" className="shadow-none gap-1 text-gray-400"><XCircle className="w-3 h-3" /> Chưa kết nối</Badge>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {isLoadingStatus ? (
                        <div className="space-y-2"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-32" /></div>
                    ) : (
                        <>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>Channel:</span>
                                <code className="bg-muted px-2 py-0.5 rounded text-xs">{channelStatus?.discord?.channelId || 'N/A'}</code>
                            </div>
                            <DiscordTestForm onTest={(c) => discordTest.mutate(c)} isPending={discordTest.isPending} />
                            <div className="rounded-lg bg-indigo-50 border border-indigo-100 p-3 text-sm text-indigo-700">
                                <p className="font-semibold mb-1">📋 Setup Discord:</p>
                                <ol className="list-decimal pl-4 space-y-1 text-indigo-800">
                                    <li>Tạo bot ở Discord Developer Portal</li>
                                    <li>Invite bot vào server với quyền Send Messages</li>
                                    <li>Thêm vào .env: DISCORD_BOT_TOKEN, DISCORD_CHANNEL_ID (hoặc DISCORD_WEBHOOK_URL)</li>
                                </ol>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Telegram */}
            <Card className="shadow-sm">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <Send className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Telegram Bot</CardTitle>
                                <CardDescription>Thông báo qua Telegram (ưu tiên #2)</CardDescription>
                            </div>
                        </div>
                        {isLoadingStatus ? <Skeleton className="h-6 w-20" /> : channelStatus?.telegram?.configured ? (
                            <Badge className="bg-green-100 text-green-700 border-green-200 shadow-none gap-1"><CheckCircle2 className="w-3 h-3" /> Đã kết nối</Badge>
                        ) : (
                            <Badge variant="outline" className="shadow-none gap-1 text-gray-400"><XCircle className="w-3 h-3" /> Chưa kết nối</Badge>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {isLoadingStatus ? (
                        <div className="space-y-2"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-32" /></div>
                    ) : (
                        <>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>Bot:</span>
                                <code className="bg-muted px-2 py-0.5 rounded text-xs">{channelStatus?.telegram?.botToken || 'N/A'}</code>
                            </div>
                            <div className="flex gap-3 flex-wrap">
                                <TelegramTestForm onTest={(c) => telegramTest.mutate(c)} isPending={telegramTest.isPending} />
                                <Button variant="outline" onClick={() => setCommands.mutate()} disabled={setCommands.isPending} className="gap-1">
                                    {setCommands.isPending ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
                                    ⚡ Đăng ký lệnh bot
                                </Button>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Preferences */}
            <Card className="shadow-sm">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center">
                            <Bell className="w-5 h-5 text-violet-600" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">Sự kiện thông báo</CardTitle>
                            <CardDescription>Bật/tắt từng loại thông báo</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoadingPrefs ? (
                        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
                    ) : preferences ? (
                        <div className="space-y-3">
                            {([
                                { key: 'crawlSuccess', label: '✅ Crawl thành công' },
                                { key: 'crawlFailed', label: '❌ Crawl thất bại' },
                                { key: 'trendingAlert', label: '🔥 Hot topic mới' },
                                { key: 'systemAlert', label: '⚠️ Cảnh báo hệ thống' },
                                { key: 'dailyDigest', label: '📊 Daily Digest' },
                            ] as const).map(({ key, label }) => (
                                <div key={key} className="flex items-center justify-between p-3 rounded-lg border">
                                    <p className="font-medium text-sm">{label}</p>
                                    <Badge className={preferences.enabledEvents[key] ? 'bg-green-100 text-green-700 border-green-200 shadow-none' : 'bg-gray-100 text-gray-500 border-gray-200 shadow-none'}>
                                        {preferences.enabledEvents[key] ? 'Bật' : 'Tắt'}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    ) : <p className="text-sm text-muted-foreground italic">Chưa có dữ liệu sự kiện</p>}
                </CardContent>
            </Card>

            {/* Bot Settings */}
            <Card className="shadow-sm border-indigo-200">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                <Bot className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">🤖 ERG Bot</CardTitle>
                                <CardDescription>Điều khiển hệ thống qua Discord/Telegram</CardDescription>
                            </div>
                        </div>
                        <Link href="/admin/bot/link">
                            <Button size="sm" variant="outline" className="gap-1">
                                <Link2 className="w-4 h-4" />
                                Kết nối Bot
                            </Button>
                        </Link>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                                <MessageSquare className="w-4 h-4 text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">Discord</p>
                                <p className="text-xs text-muted-foreground">Dùng /link để liên kết</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                <Send className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">Telegram</p>
                                <p className="text-xs text-muted-foreground">Dùng /link để liên kết</p>
                            </div>
                        </div>
                        <Link href="/admin/bot" className="block">
                            <div className="flex items-center gap-3 p-3 rounded-lg border hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer">
                                <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                                    <Bot className="w-4 h-4 text-violet-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Control Center</p>
                                    <p className="text-xs text-muted-foreground">Xem linked accounts & commands</p>
                                </div>
                            </div>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

function DiscordTestForm({ onTest, isPending }: { onTest: (c: string) => void; isPending: boolean }) {
    const [channelId, setChannelId] = useState('')
    return (
        <div className="flex gap-2">
            <Input placeholder="Discord Channel ID" value={channelId} onChange={e => setChannelId(e.target.value)} className="max-w-xs" />
            <Button onClick={() => onTest(channelId)} disabled={isPending} className="gap-1 bg-indigo-600 hover:bg-indigo-700">
                {isPending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Gửi test
            </Button>
        </div>
    )
}

function TelegramTestForm({ onTest, isPending }: { onTest: (c: string) => void; isPending: boolean }) {
    const [chatId, setChatId] = useState('')
    return (
        <div className="flex gap-2">
            <Input placeholder="Telegram Chat ID" value={chatId} onChange={e => setChatId(e.target.value)} className="max-w-xs" />
            <Button onClick={() => onTest(chatId)} disabled={isPending} className="gap-1 bg-blue-600 hover:bg-blue-700">
                {isPending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Gửi test
            </Button>
        </div>
    )
}
