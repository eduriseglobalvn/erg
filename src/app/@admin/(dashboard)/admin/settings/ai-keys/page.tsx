"use client"

import * as React from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
    Sparkles,
    Plus,
    Trash2,
    Key,
    Activity,
    AlertCircle,
    CheckCircle2,
    Clock,
    RefreshCw,
    ShieldCheck,
    BarChart3,
    Pencil,
    Zap,
    RotateCcw
} from "lucide-react"
import { aiApi } from "@/services/ai.api"
import dynamic from "next/dynamic"
const AIKeysChart = dynamic(() => import("@/components/admin/settings/ai-keys-chart").then(mod => mod.AIKeysChart), { ssr: false })
import { Button } from "@/components/admin/ui/button"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/admin/ui/card"
import { Input } from "@/components/admin/ui/input"
import { Progress } from "@/components/admin/ui/progress"
import { Badge } from "@/components/admin/ui/badge"
import { toast } from "sonner"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/admin/ui/dialog"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/admin/ui/select"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/admin/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

const keySchema = z.object({
    key: z.string().min(10, "API Key quá ngắn, vui lòng kiểm tra lại"),
    label: z.string().min(2, "Nhãn gợi nhớ phải có ít nhất 2 ký tự"),
    provider: z.string().optional(),
    projectId: z.string().optional(),
    maxDailyQuota: z.number().min(1, "Quota phải lớn hơn 0"),
})

type KeyFormValues = z.infer<typeof keySchema>

interface AIKey {
    id: string;
    key: string;
    label: string | null;
    provider: string | null;
    projectId: string | null;
    status: 'active' | 'rate_limited' | 'quota_exceeded' | 'error';
    todayUsage: number;
    maxDailyQuota: number;
    usageCount: number;
    lastUsedAt: string | null;
    cooldownUntil: string | null;
    lastErrorMessage: string | null;
}

const StatusBadge = ({ keyData }: { keyData: AIKey }) => {
    const [timeLeft, setTimeLeft] = React.useState<number | null>(null)

    React.useEffect(() => {
        if (keyData.status === 'rate_limited' && keyData.cooldownUntil) {
            const updateTimer = () => {
                const diff = new Date(keyData.cooldownUntil!).getTime() - Date.now()
                setTimeLeft(diff > 0 ? Math.ceil(diff / 1000) : 0)
            }
            updateTimer()
            const interval = setInterval(updateTimer, 1000)
            return () => clearInterval(interval)
        }
    }, [keyData])

    const config = {
        active: { label: 'Hoạt động', bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
        rate_limited: { label: timeLeft ? `Chờ (${timeLeft}s)` : 'Bị giới hạn', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
        quota_exceeded: { label: 'Hết hạn mức', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
        error: { label: 'Lỗi', bg: 'bg-zinc-50', text: 'text-zinc-700', border: 'border-zinc-200' },
    }

    const { label, bg, text, border } = config[keyData.status]

    return (
        <Badge variant="outline" className={cn(bg, text, border, "font-bold uppercase text-[10px]")}>
            {label}
        </Badge>
    )
}

export default function AIKeysPage() {
    const queryClient = useQueryClient()
    const [isAddOpen, setIsAddOpen] = React.useState(false)
    const [editingKey, setEditingKey] = React.useState<AIKey | null>(null)

    // 1. Fetch Keys
    const { data: keys = [], isLoading, isRefetching, refetch } = useQuery<AIKey[]>({
        queryKey: ['ai-keys'],
        queryFn: () => aiApi.getMyKeys().then(res => res.data || [])
    })

    // 2. Form Setup
    const form = useForm<KeyFormValues>({
        resolver: zodResolver(keySchema),
        defaultValues: {
            key: "",
            label: "",
            provider: "gemini",
            projectId: "",
            maxDailyQuota: 1500,
        },
    })

    // 3. Save/Update Mutation
    const saveMutation = useMutation({
        mutationFn: (values: KeyFormValues) => aiApi.saveKey({
            ...values,
            id: editingKey?.id
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ai-keys'] })
            toast.success(editingKey ? "Đã cập nhật API Key!" : "Đã thêm API Key mới!")
            handleClose()
        },
        onError: (err: any) => {
            toast.error(err.message || "Không thể lưu API Key")
        }
    })

    const handleClose = () => {
        setIsAddOpen(false)
        setEditingKey(null)
        form.reset({
            key: "",
            label: "",
            provider: "gemini",
            projectId: "",
            maxDailyQuota: 1500
        })
    }

    const openEdit = (key: AIKey) => {
        setEditingKey(key)
        form.reset({
            key: key.key,
            label: key.label || "",
            provider: key.provider || "gemini",
            projectId: key.projectId || "",
            maxDailyQuota: key.maxDailyQuota
        })
        setIsAddOpen(true)
    }

    // 4. Delete Mutation
    const deleteMutation = useMutation({
        mutationFn: (id: string) => aiApi.deleteKey(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ai-keys'] })
            toast.success("Đã xóa API Key")
        },
        onError: (err: any) => {
            toast.error(err.message || "Không thể xóa API Key")
        }
    })

    const onSubmit = (values: KeyFormValues) => {
        saveMutation.mutate(values)
    }

    const handleDelete = (id: string) => {
        if (confirm("Bạn có chắc chắn muốn xóa API Key này?")) {
            deleteMutation.mutate(id)
        }
    }

    // Group keys by projectId
    const groupedKeys = React.useMemo(() => {
        const groups: Record<string, AIKey[]> = {}
        const survivors: AIKey[] = []

        keys.forEach(k => {
            if (k.projectId) {
                if (!groups[k.projectId]) groups[k.projectId] = []
                groups[k.projectId].push(k)
            } else {
                survivors.push(k)
            }
        })

        return { groups, survivors }
    }, [keys])

    // Calc total stats
    const totalUsage = keys.reduce((acc: number, k: AIKey) => acc + k.todayUsage, 0)
    const totalQuota = keys.reduce((acc: number, k: AIKey) => acc + k.maxDailyQuota, 0)
    const usagePercent = totalQuota > 0 ? (totalUsage / totalQuota) * 100 : 0

    return (
        <div className="flex flex-col gap-8 p-6 max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <Sparkles className="h-6 w-6" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-primary uppercase leading-none">Cấu hình AI Keys</h1>
                    </div>
                    <p className="text-muted-foreground max-w-xl">
                        Quản lý các API Key (Gemini, OpenAI...) để phục vụ tính năng tạo bài viết tự động.
                        Hệ thống sẽ tự động luân chuyển Key khi hết hạn mức trong ngày.
                    </p>
                </div>

                <Dialog open={isAddOpen} onOpenChange={(open) => !open && handleClose()}>
                    <DialogTrigger asChild>
                        <Button className="bg-primary hover:bg-primary/90 h-11 px-6 shadow-md transition-all hover:scale-[1.02] active:scale-95">
                            <Plus className="mr-2 h-5 w-5" /> Thêm API Key mới
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>{editingKey ? "Cập nhật" : "Thêm"} AI API Key</DialogTitle>
                            <DialogDescription>
                                {editingKey ? "Chỉnh sửa thông tin cấu hình cho Key hiện tại." : "Nhập mã API Key (Ví dụ từ Google AI Studio hoặc OpenAI) để bắt đầu."}
                            </DialogDescription>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                                <FormField
                                    control={form.control}
                                    name="label"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tên gợi nhớ (Label)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="VD: Project A - Account 1" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="provider"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>AI Provider</FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} defaultValue={field.value || 'gemini'}>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Chọn dịch vụ AI" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectLabel>Miễn phí (Free Models)</SelectLabel>
                                                            <SelectItem value="gemini">Google Gemini (15 RPM / 1.5K RPD)</SelectItem>
                                                            <SelectItem value="groq">Groq Llama 3 (30 RPM / 14.4K RPD)</SelectItem>
                                                        </SelectGroup>
                                                        <SelectGroup>
                                                            <SelectLabel>Trả phí (Paid Models)</SelectLabel>
                                                            <SelectItem value="openai">OpenAI GPT-4o-mini</SelectItem>
                                                            <SelectItem value="claude">Anthropic Claude Haiku</SelectItem>
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="key"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>API Key</FormLabel>
                                            <FormControl>
                                                <Input placeholder="AIzaSy..." {...field} className="font-mono text-sm" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="projectId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Project ID (Tùy chọn)</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="project-id-123" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="maxDailyQuota"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Quota hàng ngày</FormLabel>
                                                <FormControl>
                                                    <Input type="number" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <p className="text-[10px] text-muted-foreground italic">
                                    * Project ID giúp gộp các Key dùng chung hạn mức của Google Cloud để quản lý dễ dàng hơn.
                                </p>
                                <DialogFooter className="pt-4">
                                    <Button type="button" variant="outline" onClick={handleClose}>Hủy</Button>
                                    <Button type="submit" disabled={saveMutation.isPending}>
                                        {saveMutation.isPending ? "Đang lưu..." : editingKey ? "Cập nhật Key" : "Lưu API Key"}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-l-4 border-l-primary shadow-sm">
                    <CardHeader className="py-4 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Tổng Key hoạt động</CardTitle>
                        <ShieldCheck className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{keys.length} Keys</div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-blue-500 shadow-sm">
                    <CardHeader className="py-4 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Hạn mức toàn cục</CardTitle>
                        <BarChart3 className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between items-baseline">
                            <div className="text-2xl font-bold">{totalUsage} / {totalQuota}</div>
                            <span className="text-xs font-bold text-muted-foreground uppercase">Requests</span>
                        </div>
                        <Progress value={usagePercent} className="h-1.5" />
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-green-500 shadow-sm">
                    <CardHeader className="py-4 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Trạng thái hệ thống</CardTitle>
                        <Activity className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                            <div className="text-2xl font-bold text-green-600">Sẵn sàng</div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Providers Health Grid (Dynamic from keys) */}
            <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
                        <Activity className="w-4 h-4 text-slate-400" /> Tình trạng Providers
                    </h2>
                    <span className="text-xs font-semibold px-2 py-1 bg-indigo-100/50 text-indigo-700 rounded-md">
                        Tổng capacity: {totalQuota.toLocaleString()} req/ngày
                    </span>
                </div>

                <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
                    <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 text-sm">
                        {['gemini', 'groq', 'openai', 'claude'].map(provider => {
                            const providerKeys = keys.filter(k => k.provider === provider);
                            const providerUsage = providerKeys.reduce((acc, k) => acc + k.todayUsage, 0);
                            const providerQuota = providerKeys.reduce((acc, k) => acc + k.maxDailyQuota, 0);
                            const isAvailable = providerKeys.some(k => k.status === 'active');
                            const label = provider === 'gemini' ? 'Gemini' : provider === 'groq' ? 'Groq' : provider === 'openai' ? 'OpenAI' : 'Claude';

                            return (
                                <div key={provider} className="p-4 flex flex-col gap-2 relative">
                                    <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                                        {providerKeys.length > 0 ? (
                                            isAvailable ? (
                                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                            ) : (
                                                <AlertCircle className="w-4 h-4 text-amber-500" />
                                            )
                                        ) : (
                                            <div className="w-3 h-3 rounded-full bg-slate-200" />
                                        )}
                                        {label}
                                    </div>
                                    <div className="text-xs text-slate-500 font-medium">
                                        {providerKeys.length} keys
                                    </div>
                                    <div className="text-[11px] bg-slate-50 text-slate-600 rounded p-1.5 font-mono text-center border">
                                        {providerUsage.toLocaleString()} / {providerQuota.toLocaleString()}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Tracking Chart */}
            <AIKeysChart keys={keys} />

            {/* Key List Table */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Key className="h-5 w-5 text-muted-foreground" />
                        Danh sách API Keys đã thêm
                    </h2>
                    <Button variant="ghost" size="sm" onClick={() => refetch()} className="text-muted-foreground">
                        <RefreshCw className={`h-4 w-4 mr-2 ${isRefetching ? 'animate-spin' : ''}`} />
                        Làm mới
                    </Button>
                </div>

                {isLoading ? (
                    <div className="h-48 flex items-center justify-center border-2 border-dashed rounded-xl border-muted text-muted-foreground">
                        Đang tải danh sách Keys...
                    </div>
                ) : keys.length === 0 ? (
                    <div className="h-48 flex flex-col items-center justify-center border-2 border-dashed rounded-xl border-muted text-muted-foreground gap-4 bg-muted/5">
                        <AlertCircle className="h-8 w-8 opacity-20" />
                        <div className="text-center">
                            <p className="font-medium text-foreground">Chưa có API Key nào được thêm</p>
                            <p className="text-sm text-muted-foreground">Nhấn nút "Thêm API Key mới" ở góc trên để bắt đầu tích hợp AI.</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {keys.map((key: AIKey) => (
                            <KeyCard
                                key={key.id}
                                keyData={key}
                                onDelete={handleDelete}
                                onEdit={openEdit}
                                onReactChanged={() => refetch()}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Note Section */}
            <Card className="bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/50">
                <CardContent className="py-4 flex gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
                    <div className="text-xs text-amber-800 dark:text-amber-200">
                        <span className="font-bold">Lưu ý về Quota:</span> Hệ thống sử dụng một trình luân chuyển tự động (Load Balancer) cho các Key. Ngay khi một Key đạt hạn mức (Exceeded Quota), nó sẽ được tạm ẩn và Key tiếp theo sẽ được sử dụng. Nếu tất cả Keys đều hết hạn mức, quá trình tạo bài viết AI sẽ bị tạm dừng cho đến ngày hôm sau.
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

function KeyCard({ keyData, onDelete, onEdit, onReactChanged }: { keyData: AIKey, onDelete: (id: string) => void, onEdit: (key: AIKey) => void, onReactChanged: () => void }) {
    const quotaPercent = (keyData.todayUsage / keyData.maxDailyQuota) * 100
    const isError = keyData.status === 'error' || keyData.status === 'quota_exceeded'

    const queryClient = useQueryClient()

    const testMutation = useMutation({
        mutationFn: (id: string) => aiApi.testKey(id),
        onSuccess: () => {
            toast.success("Kiểm tra Key thành công! Key hoạt động tốt.");
            onReactChanged();
        },
        onError: (err: any) => {
            toast.error(err.message || "Key gặp lỗi khi kiểm tra.");
            onReactChanged();
        }
    });

    const reactivateMutation = useMutation({
        mutationFn: (id: string) => aiApi.reactivateKey(id),
        onSuccess: () => {
            toast.success("Đã kích hoạt lại Key thành công!");
            onReactChanged();
        },
        onError: (err: any) => {
            toast.error(err.message || "Không thể kích hoạt lại Key.");
        }
    });

    return (
        <Card className="relative group overflow-hidden border-2 hover:border-primary/30 transition-all shadow-sm flex flex-col pt-1">
            {/* Background Icon */}
            <div className={`absolute -top-2 -right-2 p-3 ${isError ? 'text-destructive opacity-[0.08]' : 'text-primary opacity-[0.05]'}`}>
                <ShieldCheck className="h-20 w-20 rotate-12" />
            </div>

            <CardHeader className="pb-2 relative z-10">
                <div className="flex justify-between items-start mb-2">
                    <StatusBadge keyData={keyData} />
                    <div className="flex items-center gap-1">
                        {isError && (
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7 border-green-200 text-green-600 hover:text-green-700 hover:bg-green-50"
                                onClick={() => reactivateMutation.mutate(keyData.id)}
                                title="Kích hoạt lại"
                                disabled={reactivateMutation.isPending}
                            >
                                <RotateCcw className={`h-3.5 w-3.5 ${reactivateMutation.isPending ? 'animate-spin' : ''}`} />
                            </Button>
                        )}
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 border-blue-200 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => testMutation.mutate(keyData.id)}
                            title="Kiểm tra Key"
                            disabled={testMutation.isPending}
                        >
                            <Zap className={`h-3.5 w-3.5 ${testMutation.isPending ? 'animate-pulse' : ''}`} />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-primary hover:bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => onEdit(keyData)}
                            title="Chỉnh sửa"
                        >
                            <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/5 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => onDelete(keyData.id)}
                            title="Xóa Key"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                </div>

                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-[15px] truncate" title={keyData.label || 'Chưa đặt tên'}>
                            {keyData.label || 'API Key Content'}
                        </h4>
                        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold bg-primary/10 text-primary">
                            {keyData.provider === 'groq' ? 'Groq' : keyData.provider === 'openai' ? 'OpenAI' : keyData.provider === 'claude' ? 'Claude' : 'Gemini'}
                        </span>
                        {keyData.projectId && (
                            <Badge variant="secondary" className="px-1.5 py-0 text-[9px] h-4 bg-zinc-100 text-zinc-600 border-none">
                                {keyData.projectId}
                            </Badge>
                        )}
                    </div>
                    <p className="font-mono text-[10px] text-muted-foreground bg-zinc-50 dark:bg-zinc-900 px-1.5 py-0.5 rounded w-fit">
                        {keyData.key.substring(0, 10)}...{keyData.key.substring(keyData.key.length - 6)}
                    </p>
                </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-2 flex-1 relative z-10">
                <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] font-bold">
                        <span className="text-muted-foreground uppercase tracking-tight">Today Usage:</span>
                        <span className={cn("tabular-nums", isError ? 'text-destructive' : 'text-foreground')}>
                            {keyData.todayUsage} / {keyData.maxDailyQuota}
                        </span>
                    </div>
                    <Progress
                        value={quotaPercent}
                        className={cn(
                            "h-1.5",
                            keyData.status === 'quota_exceeded' ? 'bg-red-100 *:bg-red-500' :
                                keyData.status === 'rate_limited' ? 'bg-amber-100 *:bg-amber-500' : ''
                        )}
                    />
                </div>

                {keyData.lastErrorMessage && (
                    <div className="bg-destructive/5 border border-destructive/10 rounded p-2 flex gap-2 items-start animate-in fade-in slide-in-from-top-1">
                        <AlertCircle className="h-3 w-3 text-destructive mt-0.5 shrink-0" />
                        <p className="text-[10px] text-destructive leading-tight line-clamp-2 italic">
                            {keyData.lastErrorMessage}
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-3 border-t text-[10px] items-center">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                        <div className="p-1 bg-zinc-100 dark:bg-zinc-800 rounded">
                            <Activity className="h-3 w-3" />
                        </div>
                        <span className="font-bold text-foreground">{keyData.usageCount.toLocaleString()} <span className="text-[9px] font-normal text-muted-foreground ml-0.5">tín dụng</span></span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground justify-end">
                        <Clock className="h-3 w-3" />
                        <span className="font-bold text-foreground">
                            {keyData.lastUsedAt ? new Date(keyData.lastUsedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : 'Chưa dùng'}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
