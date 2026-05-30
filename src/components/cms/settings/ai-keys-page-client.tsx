"use client"

import * as React from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
    AlertTriangle,
    CheckCircle2,
    FlaskConical,
    KeyRound,
    Loader2,
    Plus,
    Power,
    RefreshCw,
    ShieldCheck,
    Sparkles,
    Trash2,
} from "lucide-react"
import { toast } from "sonner"

import { AIKeysChart } from "@/components/cms/settings/ai-keys-chart"
import { Badge } from "@/components/cms/ui/badge"
import { Button } from "@/components/cms/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/cms/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/cms/ui/dialog"
import { Input } from "@/components/cms/ui/input"
import { Label } from "@/components/cms/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/cms/ui/select"
import { Switch } from "@/components/cms/ui/switch"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/cms/ui/table"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/cms/ui/tooltip"
import { cn } from "@/lib/utils"
import { aiApi, AIKey, AIProvider, SaveAIKeyPayload } from "@/services/ai.api"

const PROVIDER_DEFAULT_MODEL: Record<AIProvider, string> = {
    groq: "openai/gpt-oss-120b",
    gemini: "gemini-2.0-flash",
}

const PROVIDER_LABEL: Record<AIProvider, string> = {
    groq: "Groq",
    gemini: "Google Gemini",
}

const STATUS_LABEL: Record<string, string> = {
    active: "Hoạt động",
    inactive: "Tạm tắt",
    rate_limited: "Rate limit",
    quota_exceeded: "Hết quota",
    error: "Lỗi",
}

function formatDate(value?: string | null) {
    if (!value) return "-"
    return new Intl.DateTimeFormat("vi-VN", {
        dateStyle: "short",
        timeStyle: "short",
    }).format(new Date(value))
}

function usagePercent(key: AIKey) {
    if (!key.maxDailyQuota) return 0
    return Math.min(100, Math.round((key.todayUsage / key.maxDailyQuota) * 100))
}

function statusClass(status: string) {
    if (status === "active") return "border-emerald-200 bg-emerald-50 text-emerald-700"
    if (status === "error") return "border-red-200 bg-red-50 text-red-700"
    if (status === "rate_limited" || status === "quota_exceeded") return "border-amber-200 bg-amber-50 text-amber-700"
    return "border-slate-200 bg-slate-50 text-slate-700"
}

function providerClass(provider: AIProvider) {
    if (provider === "groq") return "border-orange-200 bg-orange-50 text-orange-700"
    return "border-blue-200 bg-blue-50 text-blue-700"
}

function emptyForm(): SaveAIKeyPayload {
    return {
        provider: "groq",
        key: "",
        label: "",
        projectId: "",
        model: PROVIDER_DEFAULT_MODEL.groq,
        type: "shared",
        maxDailyQuota: 1000,
        maxTokensPerRequest: 4096,
        defaultTemperature: 1,
        selected: true,
    }
}

export function AIKeysPageClient() {
    const queryClient = useQueryClient()
    const [open, setOpen] = React.useState(false)
    const [form, setForm] = React.useState<SaveAIKeyPayload>(() => emptyForm())

    const keysQuery = useQuery({
        queryKey: ["ai-keys"],
        queryFn: async () => (await aiApi.getMyKeys()).data,
    })

    const dashboardQuery = useQuery({
        queryKey: ["ai-keys-dashboard"],
        queryFn: async () => (await aiApi.getKeysDashboard()).data,
    })

    const healthQuery = useQuery({
        queryKey: ["ai-provider-health"],
        queryFn: async () => (await aiApi.getProviderHealth()).data,
    })

    const refresh = React.useCallback(() => {
        queryClient.invalidateQueries({ queryKey: ["ai-keys"] })
        queryClient.invalidateQueries({ queryKey: ["ai-keys-dashboard"] })
        queryClient.invalidateQueries({ queryKey: ["ai-provider-health"] })
    }, [queryClient])

    const saveMutation = useMutation({
        mutationFn: aiApi.saveKey,
        onSuccess: () => {
            toast.success("Đã lưu và kiểm tra API key")
            setOpen(false)
            setForm(emptyForm())
            refresh()
        },
        onError: (error: Error) => toast.error(error.message || "Không lưu được API key"),
    })

    const deleteMutation = useMutation({
        mutationFn: aiApi.deleteKey,
        onSuccess: () => {
            toast.success("Đã xoá API key")
            refresh()
        },
        onError: (error: Error) => toast.error(error.message || "Không xoá được API key"),
    })

    const testMutation = useMutation({
        mutationFn: aiApi.testKey,
        onSuccess: (result) => {
            if (result.data.ok) {
                toast.success("API key kết nối tốt")
            } else {
                toast.error(result.data.key.lastErrorMessage || "API key kiểm tra không thành công")
            }
            refresh()
        },
        onError: (error: Error) => toast.error(error.message || "Không kiểm tra được API key"),
    })

    const selectMutation = useMutation({
        mutationFn: aiApi.selectKey,
        onSuccess: () => {
            toast.success("Đã chọn key dùng cho AI Content")
            refresh()
        },
        onError: (error: Error) => toast.error(error.message || "Không chọn được API key"),
    })

    const reactivateMutation = useMutation({
        mutationFn: aiApi.reactivateKey,
        onSuccess: () => {
            toast.success("Đã kích hoạt lại API key")
            refresh()
        },
        onError: (error: Error) => toast.error(error.message || "Không kích hoạt lại được API key"),
    })

    const keys = keysQuery.data ?? []
    const selectedKey = keys.find((key) => key.selected)
    const isBusy = saveMutation.isPending

    const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        saveMutation.mutate({
            ...form,
            key: form.key.trim(),
            label: form.label?.trim(),
            projectId: form.projectId?.trim(),
            model: form.model?.trim(),
        })
    }

    const setProvider = (provider: AIProvider) => {
        setForm((current) => ({
            ...current,
            provider,
            model: PROVIDER_DEFAULT_MODEL[provider],
            maxTokensPerRequest: provider === "groq" ? 4096 : 2048,
            defaultTemperature: provider === "groq" ? 1 : 0.7,
        }))
    }

    return (
        <div className="flex-1 space-y-6 p-8 pt-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h2 className="flex items-center gap-3 text-3xl font-bold tracking-tight text-foreground">
                        <KeyRound className="h-8 w-8 text-slate-700" />
                        Quản lý AI API Keys
                    </h2>
                    <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
                        Chọn nhà cung cấp và key đang dùng để tạo nội dung bài viết. Key thật chỉ lưu ở BE và không trả ngược về trình duyệt.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={refresh}
                                disabled={keysQuery.isFetching || healthQuery.isFetching}
                                aria-label="Tải lại"
                            >
                                <RefreshCw className={cn("h-4 w-4", (keysQuery.isFetching || healthQuery.isFetching) && "animate-spin")} />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Tải lại trạng thái provider</TooltipContent>
                    </Tooltip>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button type="button">
                                <Plus className="h-4 w-4" />
                                Thêm key
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[720px]">
                            <form onSubmit={submitForm} className="space-y-5">
                                <DialogHeader>
                                    <DialogTitle>Thêm AI API key</DialogTitle>
                                    <DialogDescription>
                                        Key sẽ được BE kiểm tra trực tiếp với provider trước khi lưu.
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label>Provider</Label>
                                        <Select value={form.provider} onValueChange={(value) => setProvider(value as AIProvider)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="groq">Groq</SelectItem>
                                                <SelectItem value="gemini">Google Gemini</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Label</Label>
                                        <Input
                                            value={form.label ?? ""}
                                            onChange={(event) => setForm((current) => ({ ...current, label: event.target.value }))}
                                            placeholder="Groq production"
                                        />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <Label>API key</Label>
                                        <Input
                                            value={form.key}
                                            onChange={(event) => setForm((current) => ({ ...current, key: event.target.value }))}
                                            placeholder={form.provider === "groq" ? "gsk_..." : "AIza..."}
                                            type="password"
                                            autoComplete="off"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Model</Label>
                                        <Input
                                            value={form.model ?? ""}
                                            onChange={(event) => setForm((current) => ({ ...current, model: event.target.value }))}
                                            placeholder={PROVIDER_DEFAULT_MODEL[form.provider]}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Project ID</Label>
                                        <Input
                                            value={form.projectId ?? ""}
                                            onChange={(event) => setForm((current) => ({ ...current, projectId: event.target.value }))}
                                            placeholder="Default Project"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Quota/ngày</Label>
                                        <Input
                                            value={form.maxDailyQuota ?? 1000}
                                            onChange={(event) => setForm((current) => ({ ...current, maxDailyQuota: Number(event.target.value) || 0 }))}
                                            type="number"
                                            min={1}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Max tokens/request</Label>
                                        <Input
                                            value={form.maxTokensPerRequest ?? 4096}
                                            onChange={(event) => setForm((current) => ({ ...current, maxTokensPerRequest: Number(event.target.value) || 0 }))}
                                            type="number"
                                            min={16}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Temperature</Label>
                                        <Input
                                            value={form.defaultTemperature ?? 1}
                                            onChange={(event) => setForm((current) => ({ ...current, defaultTemperature: Number(event.target.value) || 0 }))}
                                            type="number"
                                            min={0}
                                            max={2}
                                            step="0.1"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between rounded-md border px-3 py-2">
                                        <div>
                                            <Label>Chọn dùng ngay</Label>
                                            <p className="text-xs text-muted-foreground">AI Content sẽ dùng key này sau khi lưu.</p>
                                        </div>
                                        <Switch
                                            checked={Boolean(form.selected)}
                                            onCheckedChange={(checked) => setForm((current) => ({ ...current, selected: checked }))}
                                        />
                                    </div>
                                </div>

                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isBusy}>
                                        Huỷ
                                    </Button>
                                    <Button type="submit" disabled={isBusy}>
                                        {isBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                                        Lưu và test
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng key</CardTitle>
                        <KeyRound className="h-4 w-4 text-slate-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{dashboardQuery.data?.total_keys ?? keys.length}</div>
                        <p className="text-xs text-muted-foreground">Được quản lý trong database</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Đang hoạt động</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{dashboardQuery.data?.active_keys ?? keys.filter((key) => key.status === "active").length}</div>
                        <p className="text-xs text-muted-foreground">Key có thể gọi provider</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Key đang dùng</CardTitle>
                        <Sparkles className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="truncate text-2xl font-bold">{selectedKey ? PROVIDER_LABEL[selectedKey.provider] : "-"}</div>
                        <p className="truncate text-xs text-muted-foreground">{selectedKey?.label || "Chưa chọn key database"}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Usage hôm nay</CardTitle>
                        <Power className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{keys.reduce((sum, key) => sum + key.todayUsage, 0)}</div>
                        <p className="text-xs text-muted-foreground">Lượt gọi qua AI Content</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
                <Card>
                    <CardHeader>
                        <CardTitle>Danh sách API key</CardTitle>
                        <CardDescription>Provider, model và key đang được dùng để generate post.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Provider</TableHead>
                                    <TableHead>Key</TableHead>
                                    <TableHead>Model</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Quota</TableHead>
                                    <TableHead>Lần test</TableHead>
                                    <TableHead className="text-right">Thao tác</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {keysQuery.isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                            Đang tải API keys...
                                        </TableCell>
                                    </TableRow>
                                ) : keys.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                            Chưa có key database. Thêm Groq hoặc Gemini key để AI Content dùng theo lựa chọn của admin.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    keys.map((key) => (
                                        <TableRow key={key.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline" className={providerClass(key.provider)}>
                                                        {PROVIDER_LABEL[key.provider] ?? key.provider}
                                                    </Badge>
                                                    {key.selected ? (
                                                        <Badge variant="outline" className="border-slate-300 bg-slate-900 text-white">
                                                            Đang dùng
                                                        </Badge>
                                                    ) : null}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium">{key.label || key.maskedKey}</div>
                                                <div className="text-xs text-muted-foreground">{key.maskedKey}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="max-w-[220px] truncate">{key.model}</div>
                                                <div className="text-xs text-muted-foreground">{key.maxTokensPerRequest} tokens</div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={statusClass(key.status)}>
                                                    {STATUS_LABEL[key.status] ?? key.status}
                                                </Badge>
                                                {key.lastErrorMessage ? (
                                                    <div className="mt-1 flex max-w-[260px] items-center gap-1 truncate text-xs text-red-600">
                                                        <AlertTriangle className="h-3 w-3 shrink-0" />
                                                        <span className="truncate">{key.lastErrorMessage}</span>
                                                    </div>
                                                ) : null}
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm font-medium">{key.todayUsage}/{key.maxDailyQuota}</div>
                                                <div className="mt-1 h-1.5 w-24 overflow-hidden rounded-full bg-slate-100">
                                                    <div className="h-full bg-slate-700" style={{ width: `${usagePercent(key)}%` }} />
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm">{formatDate(key.lastTestedAt)}</div>
                                                <div className="text-xs text-muted-foreground">Last used: {formatDate(key.lastUsedAt)}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex justify-end gap-1">
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon-sm"
                                                                onClick={() => testMutation.mutate(key.id)}
                                                                disabled={testMutation.isPending}
                                                                aria-label="Test key"
                                                            >
                                                                <FlaskConical className="h-4 w-4" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>Test provider</TooltipContent>
                                                    </Tooltip>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon-sm"
                                                                onClick={() => selectMutation.mutate(key.id)}
                                                                disabled={key.selected || selectMutation.isPending}
                                                                aria-label="Chọn dùng"
                                                            >
                                                                <CheckCircle2 className="h-4 w-4" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>Chọn cho AI Content</TooltipContent>
                                                    </Tooltip>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon-sm"
                                                                onClick={() => reactivateMutation.mutate(key.id)}
                                                                disabled={reactivateMutation.isPending}
                                                                aria-label="Kích hoạt lại"
                                                            >
                                                                <Power className="h-4 w-4" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>Kích hoạt lại</TooltipContent>
                                                    </Tooltip>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon-sm"
                                                                onClick={() => deleteMutation.mutate(key.id)}
                                                                disabled={deleteMutation.isPending}
                                                                aria-label="Xoá key"
                                                            >
                                                                <Trash2 className="h-4 w-4 text-red-600" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>Xoá key</TooltipContent>
                                                    </Tooltip>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Provider health</CardTitle>
                        <CardDescription>Trạng thái từ BE, gồm key database và fallback config.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {Object.entries(healthQuery.data ?? {}).map(([provider, info]) => (
                            <div key={provider} className="rounded-md border p-3">
                                <div className="flex items-center justify-between gap-2">
                                    <div className="font-medium capitalize">{provider}</div>
                                    <Badge variant="outline" className={statusClass(info.status)}>
                                        {info.status}
                                    </Badge>
                                </div>
                                <div className="mt-2 text-sm text-muted-foreground">{info.message}</div>
                                {info.model ? <div className="mt-1 truncate text-xs text-muted-foreground">Model: {info.model}</div> : null}
                                {info.source ? <div className="mt-1 text-xs text-muted-foreground">Source: {info.source}</div> : null}
                            </div>
                        ))}
                        {!healthQuery.isLoading && Object.keys(healthQuery.data ?? {}).length === 0 ? (
                            <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                                Chưa có provider nào sẵn sàng.
                            </div>
                        ) : null}
                    </CardContent>
                </Card>
            </div>

            <AIKeysChart keys={keys} />
        </div>
    )
}
