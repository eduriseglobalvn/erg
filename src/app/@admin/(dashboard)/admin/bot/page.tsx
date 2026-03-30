'use client'

import * as React from 'react'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { botApi, LinkedAccount, BotCommand } from '@/services/bot.api'
import type { LinkedAccountListResponse, BotCommandListResponse } from '@/services/bot.api'
import { notificationApi } from '@/services/notification.api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/admin/ui/card'
import { Button } from '@/components/admin/ui/button'
import { Input } from '@/components/admin/ui/input'
import { Badge } from '@/components/admin/ui/badge'
import { Skeleton } from '@/components/admin/ui/skeleton'
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/admin/ui/table'
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/admin/ui/dialog'
import { Label } from '@/components/admin/ui/label'
import {
    Bot, MessageSquare, CheckCircle2, XCircle, Clock, Terminal,
    Users, Link2, Trash2, RefreshCw, Send, Check, X, AlertTriangle,
} from 'lucide-react'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

// ─── CONNECTION STATUS ─────────────────────────────────────────────────────────

function DiscordStatus({ configured }: { configured: boolean }) {
    return configured ? (
        <Badge className="bg-green-100 text-green-700 border-green-200 shadow-none gap-1">
            <CheckCircle2 className="w-3 h-3" /> Đã kết nối
        </Badge>
    ) : (
        <Badge variant="outline" className="shadow-none gap-1 text-gray-400">
            <XCircle className="w-3 h-3" /> Chưa kết nối
        </Badge>
    )
}

function TelegramStatus({ configured }: { configured: boolean }) {
    return configured ? (
        <Badge className="bg-blue-100 text-blue-700 border-blue-200 shadow-none gap-1">
            <CheckCircle2 className="w-3 h-3" /> Đã kết nối
        </Badge>
    ) : (
        <Badge variant="outline" className="shadow-none gap-1 text-gray-400">
            <XCircle className="w-3 h-3" /> Chưa kết nối
        </Badge>
    )
}

// ─── MAIN PAGE ──────────────────────────────────────────────────────────────────

export default function BotControlCenterPage() {
    const queryClient = useQueryClient()
    const [filterChannel, setFilterChannel] = useState<'discord' | 'telegram' | undefined>(undefined)
    const [tab, setTab] = useState<'accounts' | 'commands'>('accounts')
    const [prefsDialogAccount, setPrefsDialogAccount] = useState<LinkedAccount | null>(null)

    // Channel status
    const { data: channelStatus } = useQuery({
        queryKey: ['notifications', 'channel-status'],
        queryFn: () => notificationApi.getChannelStatus(),
    })

    // Linked accounts
    const { data: linkedAccounts, isLoading: isLoadingAccounts } = useQuery<LinkedAccountListResponse>({
        queryKey: ['bot', 'linked-accounts', filterChannel],
        queryFn: () => botApi.getLinkedAccounts(filterChannel) as any,
    })

    // Recent commands
    const { data: recentCommands, isLoading: isLoadingCommands } = useQuery<BotCommandListResponse>({
        queryKey: ['bot', 'commands'],
        queryFn: () => botApi.getRecentCommands(50) as any,
    })

    // Unlink mutation
    const unlinkMutation = useMutation({
        mutationFn: (id: string) => botApi.deleteLinkedAccount(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bot', 'linked-accounts'] })
            toast.success('Đã hủy liên kết tài khoản')
        },
        onError: () => toast.error('Lỗi khi hủy liên kết'),
    })

    // Generate link code
    const generateCodeMutation = useMutation({
        mutationFn: () => botApi.getLinkCode(),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['bot', 'link-code'] })
            toast.success(`Mã: ${data.code} — có hiệu lực 5 phút`)
        },
        onError: () => toast.error('Lỗi khi tạo mã'),
    })

    const accounts: LinkedAccount[] = linkedAccounts?.data || (linkedAccounts as any) || []
    const commands: BotCommand[] = recentCommands?.data || (recentCommands as any) || []

    return (
        <div className="flex flex-col gap-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-primary uppercase flex items-center gap-2">
                        <Bot className="w-8 h-8" /> 🤖 BOT Control Center
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Quản lý tài khoản đã liên kết Discord/Telegram và lịch sử lệnh.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => generateCodeMutation.mutate()}
                        disabled={generateCodeMutation.isPending}
                        className="gap-1"
                    >
                        <Link2 className="w-4 h-4" />
                        {generateCodeMutation.isPending ? 'Đang tạo...' : 'Tạo mã link'}
                    </Button>
                </div>
            </div>

            {/* Connection Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Discord */}
                <Card className="shadow-sm">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                    <MessageSquare className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">Discord</CardTitle>
                                    <CardDescription>Bot điều khiển qua Discord</CardDescription>
                                </div>
                            </div>
                            <DiscordStatus configured={!!channelStatus?.discord?.configured} />
                        </div>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                        {channelStatus?.discord?.channelId ? (
                            <span>Channel: <code className="bg-muted px-1.5 py-0.5 rounded text-xs">{channelStatus.discord.channelId}</code></span>
                        ) : (
                            <span className="flex items-center gap-1"><AlertTriangle className="w-3 h-3 text-yellow-500" /> Cần cấu hình DISCORD_BOT_TOKEN trong .env</span>
                        )}
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
                                    <CardTitle className="text-lg">Telegram</CardTitle>
                                    <CardDescription>Bot điều khiển qua Telegram</CardDescription>
                                </div>
                            </div>
                            <TelegramStatus configured={!!channelStatus?.telegram?.configured} />
                        </div>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                        {channelStatus?.telegram?.botToken ? (
                            <span>Bot: <code className="bg-muted px-1.5 py-0.5 rounded text-xs">{channelStatus.telegram.botToken}</code></span>
                        ) : (
                            <span className="flex items-center gap-1"><AlertTriangle className="w-3 h-3 text-yellow-500" /> Cần cấu hình TELEGRAM_BOT_TOKEN trong .env</span>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 border-b">
                <button
                    onClick={() => setTab('accounts')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === 'accounts' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                >
                    <Users className="w-4 h-4 inline mr-1" />
                    Linked Accounts ({accounts.length})
                </button>
                <button
                    onClick={() => setTab('commands')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === 'commands' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                >
                    <Terminal className="w-4 h-4 inline mr-1" />
                    Commands ({commands.length})
                </button>
            </div>

            {/* Tab: Linked Accounts */}
            {tab === 'accounts' && (
                <Card className="shadow-sm">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Linked Accounts</CardTitle>
                            <div className="flex gap-1">
                                <Button
                                    size="sm"
                                    variant={filterChannel === undefined ? 'default' : 'outline'}
                                    onClick={() => setFilterChannel(undefined)}
                                >Tất cả</Button>
                                <Button
                                    size="sm"
                                    variant={filterChannel === 'discord' ? 'default' : 'outline'}
                                    onClick={() => setFilterChannel('discord')}
                                >Discord</Button>
                                <Button
                                    size="sm"
                                    variant={filterChannel === 'telegram' ? 'default' : 'outline'}
                                    onClick={() => setFilterChannel('telegram')}
                                >Telegram</Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {isLoadingAccounts ? (
                            <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
                        ) : accounts.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                <p>Chưa có tài khoản nào được liên kết.</p>
                                <p className="text-sm">User gửi <code className="bg-muted px-1 rounded">/link</code> cho bot để liên kết.</p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Kênh</TableHead>
                                        <TableHead>Platform User</TableHead>
                                        <TableHead>ERG User</TableHead>
                                        <TableHead>Permissions</TableHead>
                                        <TableHead>Tương tác cuối</TableHead>
                                        <TableHead>Trạng thái</TableHead>
                                        <TableHead className="text-right">Hành động</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {accounts.map((acc) => (
                                        <TableRow key={acc.id}>
                                            <TableCell>
                                                <Badge
                                                    className={acc.channel === 'discord'
                                                        ? 'bg-indigo-100 text-indigo-700 border-indigo-200 shadow-none'
                                                        : 'bg-blue-100 text-blue-700 border-blue-200 shadow-none'}
                                                >
                                                    {acc.channel === 'discord' ? <MessageSquare className="w-3 h-3 mr-1" /> : <Send className="w-3 h-3 mr-1" />}
                                                    {acc.channel}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{acc.platformUserId.substring(0, 16)}...</code>
                                            </TableCell>
                                            <TableCell>
                                                <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{acc.ergUserId}</code>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-1">
                                                    {acc.permissions?.slice(0, 3).map((p: string) => (
                                                        <Badge key={p} variant="outline" className="text-xs shadow-none">{p}</Badge>
                                                    ))}
                                                    {(acc.permissions?.length || 0) > 3 && (
                                                        <Badge variant="outline" className="text-xs shadow-none">+{(acc.permissions?.length || 0) - 3}</Badge>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-xs text-muted-foreground">
                                                {acc.lastInteractionAt
                                                    ? format(new Date(acc.lastInteractionAt), 'dd/MM HH:mm', { locale: vi })
                                                    : '—'}
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={acc.status === 'active'
                                                    ? 'bg-green-100 text-green-700 border-green-200 shadow-none'
                                                    : 'bg-gray-100 text-gray-500 border-gray-200 shadow-none'}>
                                                    {acc.status === 'active' ? <Check className="w-3 h-3 mr-1" /> : <X className="w-3 h-3 mr-1" />}
                                                    {acc.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex gap-1 justify-end">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => setPrefsDialogAccount(acc)}
                                                        className="gap-1"
                                                    >
                                                        <Bot className="w-3 h-3" /> Settings
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => unlinkMutation.mutate(acc.id)}
                                                        disabled={unlinkMutation.isPending}
                                                        className="gap-1 text-red-500 hover:text-red-600"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Tab: Recent Commands */}
            {tab === 'commands' && (
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle>Lịch sử Commands</CardTitle>
                        <CardDescription>50 lệnh gần nhất từ Discord/Telegram</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoadingCommands ? (
                            <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
                        ) : commands.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <Terminal className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                <p>Chưa có command nào được thực thi.</p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Kênh</TableHead>
                                        <TableHead>User</TableHead>
                                        <TableHead>Command</TableHead>
                                        <TableHead>Args</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Duration</TableHead>
                                        <TableHead>Thời gian</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {commands.slice(0, 30).map((cmd) => (
                                        <TableRow key={cmd.id}>
                                            <TableCell>
                                                <Badge
                                                    className={cmd.channel === 'discord'
                                                        ? 'bg-indigo-100 text-indigo-700 border-indigo-200 shadow-none'
                                                        : 'bg-blue-100 text-blue-700 border-blue-200 shadow-none'}
                                                >
                                                    {cmd.channel}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-xs">
                                                <div className="flex flex-col">
                                                    <span>{cmd.chatName || '—'}</span>
                                                    <span className="text-muted-foreground">{cmd.userId || 'unlinked'}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {cmd.command ? (
                                                    <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono text-primary">
                                                        /{cmd.command}
                                                    </code>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground italic">—</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-xs text-muted-foreground">
                                                {cmd.commandArgs?.join(' ') || '—'}
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={
                                                    cmd.executionStatus === 'success' ? 'bg-green-100 text-green-700 border-green-200 shadow-none' :
                                                    cmd.executionStatus === 'failed' ? 'bg-red-100 text-red-700 border-red-200 shadow-none' :
                                                    'bg-yellow-100 text-yellow-700 border-yellow-200 shadow-none'
                                                }>
                                                    {cmd.executionStatus}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-xs text-muted-foreground">
                                                {cmd.executionDurationMs != null ? `${cmd.executionDurationMs}ms` : '—'}
                                            </TableCell>
                                            <TableCell className="text-xs text-muted-foreground">
                                                {cmd.createdAt ? format(new Date(cmd.createdAt), 'dd/MM HH:mm:ss', { locale: vi }) : '—'}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Preferences Dialog */}
            {prefsDialogAccount && (
                <PreferencesDialog
                    account={prefsDialogAccount}
                    onClose={() => setPrefsDialogAccount(null)}
                />
            )}
        </div>
    )
}

// ─── PREFERENCES DIALOG ────────────────────────────────────────────────────────

function PreferencesDialog({ account, onClose }: { account: LinkedAccount; onClose: () => void }) {
    const queryClient = useQueryClient()
    const [prefs, setPrefs] = useState({
        crawlAlerts: account.notificationPreferences?.crawlAlerts ?? true,
        trendingAlerts: account.notificationPreferences?.trendingAlerts ?? true,
        systemAlerts: account.notificationPreferences?.systemAlerts ?? true,
        dailyDigest: account.notificationPreferences?.dailyDigest ?? false,
    })

    const updateMutation = useMutation({
        mutationFn: () => botApi.updateLinkedAccountPreferences(account.id, prefs),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bot', 'linked-accounts'] })
            toast.success('Đã lưu cài đặt thông báo')
            onClose()
        },
        onError: () => toast.error('Lỗi khi lưu'),
    })

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        <Bot className="w-4 h-4 inline mr-2" />
                        Notification Settings — {account.channel}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <p className="text-sm text-muted-foreground">
                        Platform User: <code className="bg-muted px-1 rounded">{account.platformUserId.substring(0, 20)}...</code>
                    </p>

                    {([
                        { key: 'crawlAlerts', label: '🔔 Crawl Alerts', desc: 'Nhận thông báo khi crawl thành công/thất bại' },
                        { key: 'trendingAlerts', label: '🔥 Trending Alerts', desc: 'Nhận thông báo khi có hot topic mới' },
                        { key: 'systemAlerts', label: '⚙️ System Alerts', desc: 'Cảnh báo hệ thống (quota, lỗi)' },
                        { key: 'dailyDigest', label: '📊 Daily Digest', desc: 'Tổng kết hàng ngày gửi vào buổi sáng' },
                    ] as const).map(({ key, label, desc }) => (
                        <div key={key} className="flex items-start justify-between gap-3 p-3 rounded-lg border">
                            <div>
                                <p className="text-sm font-medium">{label}</p>
                                <p className="text-xs text-muted-foreground">{desc}</p>
                            </div>
                            <button
                                onClick={() => setPrefs(p => ({ ...p, [key]: !p[key] }))}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 mt-0.5 ${prefs[key] ? 'bg-primary' : 'bg-muted'}`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${prefs[key] ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                        </div>
                    ))}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Hủy</Button>
                    <Button onClick={() => updateMutation.mutate()} disabled={updateMutation.isPending}>
                        {updateMutation.isPending ? <RefreshCw className="w-4 h-4 animate-spin mr-1" /> : <Check className="w-4 h-4 mr-1" />}
                        Lưu
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
