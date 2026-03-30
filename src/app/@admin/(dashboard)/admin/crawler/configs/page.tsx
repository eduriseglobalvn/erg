"use client"

import * as React from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
    Plus,
    Pencil,
    Trash2,
    Settings,
    Loader2,
    AlertCircle,
    Globe,
    Beaker,
    FileCode,
    CheckCircle2,
    Play,
    Sparkles,
    Download,
    Search,
    ChevronDown,
    ChevronUp,
    X,
    Check,
    Copy,
    RefreshCw,
} from "lucide-react"
import {
    crawlerApi,
    ScraperConfig,
    BatchTestResult,
    SelectorSuggestion,
} from "@/services/crawler.api"
import { postsApi } from "@/services/posts.api"
import { Button } from "@/components/admin/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/admin/ui/card"
import { Input } from "@/components/admin/ui/input"
import { Badge } from "@/components/admin/ui/badge"
import { Textarea } from "@/components/admin/ui/textarea"
import { toast } from "sonner"
import { Label } from "@/components/admin/ui/label"
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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/admin/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/admin/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/admin/ui/tabs"
import { Progress } from "@/components/admin/ui/progress"
import { Skeleton } from "@/components/admin/ui/skeleton"
import { Separator } from "@/components/admin/ui/separator"

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ScraperConfigsPage() {
    const queryClient = useQueryClient()
    const [isDialogOpen, setIsDialogOpen] = React.useState(false)
    const [editingConfig, setEditingConfig] = React.useState<ScraperConfig | null>(null)
    const [activeTab, setActiveTab] = React.useState<string>("single")
    const [formData, setFormData] = React.useState<Partial<ScraperConfig>>({
        domain: "",
        type: "STATIC",
        selectorConfig: {
            titleSelector: "h1",
            contentSelector: "article",
            thumbnailSelector: "meta[property='og:image']",
            excludeSelectors: []
        }
    })

    // 1. Load Data
    const { data: configs = [], isLoading } = useQuery({
        queryKey: ['crawler', 'configs'],
        queryFn: () => crawlerApi.getConfigs()
    })

    // 2. Mutations
    const saveMutation = useMutation({
        mutationFn: (data: Partial<ScraperConfig>) =>
            editingConfig
                ? crawlerApi.updateConfig(editingConfig.id, data)
                : crawlerApi.createConfig(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['crawler', 'configs'] })
            toast.success(editingConfig ? "Đã cập nhật cấu hình domain" : "Đã thêm cấu hình domain mới")
            handleClose()
        },
        onError: (err: Error) => toast.error(err.message || "Lỗi khi lưu dữ liệu")
    })

    const deleteMutation = useMutation({
        mutationFn: (id: string) => crawlerApi.deleteConfig(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['crawler', 'configs'] })
            toast.success("Đã xóa cấu hình")
        },
        onError: (err: any) => toast.error(err.message || "Lỗi khi xóa cấu hình")
    })

    // 3. Handlers
    const handleEdit = (config: ScraperConfig) => {
        setEditingConfig(config)
        setFormData(config)
        setIsDialogOpen(true)
    }

    const handleClose = () => {
        setIsDialogOpen(false)
        setEditingConfig(null)
        setFormData({
            domain: "",
            type: "STATIC",
            selectorConfig: {
                titleSelector: "h1",
                contentSelector: "article",
                thumbnailSelector: "meta[property='og:image']",
                excludeSelectors: []
            }
        })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        saveMutation.mutate(formData)
    }

    return (
        <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-primary uppercase mb-2">Cấu hình Selector</h1>
                    <p className="text-muted-foreground">Định nghĩa các CSS Selectors để bóc tách nội dung từ từng website cụ thể.</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={(v) => v ? setIsDialogOpen(true) : handleClose()}>
                    <DialogTrigger asChild>
                        <Button className="h-11 px-6 shadow-md transition-all hover:scale-[1.02]">
                            <Plus className="mr-2 h-5 w-5" /> Thêm Domain Config
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                        <form onSubmit={handleSubmit}>
                            <DialogHeader>
                                <DialogTitle>{editingConfig ? "Chỉnh sửa" : "Thêm mới"} cấu hình Domain</DialogTitle>
                                <DialogDescription>
                                    Nhập Domain và các CSS Selector tương ứng để hệ thống biết cách lấy dữ liệu.
                                </DialogDescription>
                            </DialogHeader>

                            {/* AI Auto-Detect Section */}
                            <AiAutoDetectSection
                                onApply={(suggestion: SelectorSuggestion) => {
                                    setFormData(prev => ({
                                        ...prev,
                                        selectorConfig: {
                                            ...prev.selectorConfig,
                                            titleSelector: suggestion.suggestedTitleSelector,
                                            contentSelector: suggestion.suggestedContentSelector,
                                            thumbnailSelector: suggestion.suggestedThumbnailSelector,
                                        }
                                    }))
                                }}
                            />

                            <div className="grid gap-6 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="domain">Domain</Label>
                                        <Input
                                            id="domain"
                                            value={formData.domain}
                                            onChange={e => setFormData({ ...formData, domain: e.target.value })}
                                            placeholder="baomoi.com"
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Loại máy cào</Label>
                                        <Select
                                            value={formData.type}
                                            onValueChange={val => setFormData({ ...formData, type: val as "STATIC" | "DYNAMIC" })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="STATIC">STATIC (Nhanh)</SelectItem>
                                                <SelectItem value="DYNAMIC">DYNAMIC (Puppeteer)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="font-bold text-sm border-b pb-2 flex items-center gap-2">
                                        <FileCode className="h-4 w-4 text-primary" />
                                        CSS Selector Configuration
                                    </h4>
                                    <div className="grid gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="titleSelector">
                                                Title Selector
                                                {formData.selectorConfig?.titleSelector && (
                                                    <span className="ml-2 text-xs text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded">
                                                        {formData.selectorConfig.titleSelector}
                                                    </span>
                                                )}
                                            </Label>
                                            <Input
                                                id="titleSelector"
                                                value={formData.selectorConfig?.titleSelector}
                                                onChange={e => setFormData({
                                                    ...formData,
                                                    selectorConfig: { ...formData.selectorConfig, titleSelector: e.target.value }
                                                })}
                                                placeholder="h1.title"
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="contentSelector">
                                                Content Selector
                                                {formData.selectorConfig?.contentSelector && (
                                                    <span className="ml-2 text-xs text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded">
                                                        {formData.selectorConfig.contentSelector}
                                                    </span>
                                                )}
                                            </Label>
                                            <Input
                                                id="contentSelector"
                                                value={formData.selectorConfig?.contentSelector}
                                                onChange={e => setFormData({
                                                    ...formData,
                                                    selectorConfig: { ...formData.selectorConfig, contentSelector: e.target.value }
                                                })}
                                                placeholder="article.content"
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="thumbnailSelector">
                                                Thumbnail Selector (CSS or Meta)
                                                {formData.selectorConfig?.thumbnailSelector && (
                                                    <span className="ml-2 text-xs text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded">
                                                        {formData.selectorConfig.thumbnailSelector}
                                                    </span>
                                                )}
                                            </Label>
                                            <Input
                                                id="thumbnailSelector"
                                                value={formData.selectorConfig?.thumbnailSelector}
                                                onChange={e => setFormData({
                                                    ...formData,
                                                    selectorConfig: { ...formData.selectorConfig, thumbnailSelector: e.target.value }
                                                })}
                                                placeholder="img.thumb | meta[property='og:image']"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={handleClose}>Hủy</Button>
                                <Button type="submit" disabled={saveMutation.isPending}>
                                    {saveMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Lưu cấu hình
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Main Content: Configs List + Tester */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Configs List */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="shadow-sm">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-xl font-bold flex items-center gap-2">
                                    <Settings className="h-5 w-5 text-primary" />
                                    Custom Domain Configs
                                </CardTitle>
                                <Badge variant="secondary" className="font-normal">{configs.length} domains</Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="space-y-4 py-8">
                                    {Array.from({ length: 3 }).map((_, i) => (
                                        <div key={i} className="h-16 w-full bg-muted animate-pulse rounded-md" />
                                    ))}
                                </div>
                            ) : configs.length === 0 ? (
                                <div className="h-48 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-xl gap-4 bg-muted/5">
                                    <AlertCircle className="h-8 w-8 opacity-20" />
                                    <p>Chưa có cấu hình Domain nào.</p>
                                </div>
                            ) : (
                                <div className="overflow-hidden border rounded-lg">
                                    <Table>
                                        <TableHeader className="bg-muted/50">
                                            <TableRow>
                                                <TableHead>Domain</TableHead>
                                                <TableHead>Máy cào</TableHead>
                                                <TableHead>Selectors (T / C / I)</TableHead>
                                                <TableHead className="text-right">Thao tác</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {configs.map((config) => (
                                                <TableRow key={config.id} className="hover:bg-muted/30 transition-colors">
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <div className="p-1.5 bg-primary/10 rounded-md text-primary">
                                                                <Globe className="h-4 w-4" />
                                                            </div>
                                                            <span className="font-bold">{config.domain}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant={config.type === 'DYNAMIC' ? 'default' : 'secondary'} className="text-[10px] font-bold">
                                                            {config.type}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex gap-2 text-[10px] items-center">
                                                            <TooltipLabel label="Title" value={config.selectorConfig.titleSelector} />
                                                            <TooltipLabel label="Content" value={config.selectorConfig.contentSelector} />
                                                            <TooltipLabel label="Image" value={config.selectorConfig.thumbnailSelector} />
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-1">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8"
                                                                onClick={() => handleEdit(config)}
                                                                aria-label="Sửa"
                                                                title="Sửa"
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-destructive hover:bg-red-50"
                                                                onClick={() => confirm("Xóa cấu hình này sẽ dùng Selector mặc định cho domain này. Tiếp tục?") && deleteMutation.mutate(config.id)}
                                                                aria-label="Xóa"
                                                                title="Xóa"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Batch Tester (full width) */}
                    <BatchTester />
                </div>

                {/* Right: Single Selector Tester */}
                <div className="space-y-6">
                    <SelectorTester />
                </div>
            </div>
        </div>
    )
}

// ─── Helper Components ─────────────────────────────────────────────────────────

function TooltipLabel({ label, value }: { label: string, value?: string }) {
    if (!value) return null
    return (
        <span className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-200" title={`${label}: ${value}`}>
            {label[0]}
        </span>
    )
}

// ─── Single URL Selector Tester ──────────────────────────────────────────────

function SelectorTester() {
    const [url, setUrl] = React.useState("")
    const [type, setType] = React.useState<'STATIC' | 'DYNAMIC'>('STATIC')
    const [result, setResult] = React.useState<{ message: string } | null>(null)
    const [loading, setLoading] = React.useState(false)
    const [categoryId, setCategoryId] = React.useState<string | undefined>(undefined)

    const { data: categories = [] } = useQuery<{ id: string | number, name: string }[]>({
        queryKey: ['categories'],
        queryFn: () => postsApi.getCategories()
    })

    const handleTest = async () => {
        if (!url) return toast.error("Vui lòng nhập URL")
        setLoading(true)
        setResult(null)
        try {
            await crawlerApi.triggerUrl(url, type, categoryId)
            setResult({ message: "Đã thêm vào hàng đợi cào tin. Vui lòng kiểm tra Lịch sử cào tin để xem kết quả." })
            toast.success("Đã thêm vào hàng đợi")
        } catch (err: Error | unknown) {
            toast.error((err as Error).message || "Lỗi khi gọi API")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="shadow-sm border-primary/20 bg-primary/5">
            <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <Beaker className="h-5 w-5 text-primary" />
                    Selector Tester
                </CardTitle>
                <CardDescription>Kiểm tra cấu hình selector bằng cách cào thử 1 URL cụ thể.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex flex-col gap-2">
                    <Label htmlFor="test-url">URL Web cần thử</Label>
                    <Input
                        id="test-url"
                        value={url}
                        onChange={e => setUrl(e.target.value)}
                        placeholder="https://abc.vn/bai-viet-1"
                        className="bg-white dark:bg-zinc-950"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <Label>Chuyên mục (Optional when testing)</Label>
                    <Select
                        value={categoryId?.toString()}
                        onValueChange={val => setCategoryId(val)}
                    >
                        <SelectTrigger className="w-full bg-white dark:bg-zinc-950">
                            <SelectValue placeholder="Chọn chuyên mục lưu bài" />
                        </SelectTrigger>
                        <SelectContent position="popper" className="max-h-[200px]">
                            {categories.map((cat: { id: string | number, name: string }) => (
                                <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <Button
                        variant={type === 'STATIC' ? 'default' : 'outline'}
                        className="h-8 text-xs font-bold"
                        onClick={() => setType('STATIC')}
                    >
                        STATIC
                    </Button>
                    <Button
                        variant={type === 'DYNAMIC' ? 'default' : 'outline'}
                        className="h-8 text-xs font-bold"
                        onClick={() => setType('DYNAMIC')}
                    >
                        DYNAMIC
                    </Button>
                </div>
                <Button
                    className="w-full h-11 shadow-lg bg-primary hover:bg-primary/90"
                    disabled={loading}
                    onClick={handleTest}
                >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                    Kích hoạt cào thử (Async)
                </Button>

                {result && (
                    <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-top-2">
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-sm flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5" />
                            <span>{result.message}</span>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

// ─── Phase 4.6: AI Auto-Detect Section ───────────────────────────────────────

interface AiAutoDetectSectionProps {
    onApply: (suggestion: SelectorSuggestion) => void
}

function AiAutoDetectSection({ onApply }: AiAutoDetectSectionProps) {
    const [detectUrl, setDetectUrl] = React.useState("")
    const [isDetecting, setIsDetecting] = React.useState(false)
    const [suggestion, setSuggestion] = React.useState<SelectorSuggestion | null>(null)
    const [isExpanded, setIsExpanded] = React.useState(false)

    const handleDetect = async () => {
        if (!detectUrl) return toast.error("Nhập URL để phân tích")
        setIsDetecting(true)
        setSuggestion(null)
        try {
            const result = await crawlerApi.analyzeSmartSelectors(detectUrl)
            setSuggestion(result)
            setIsExpanded(true)
            toast.success("Phân tích xong! Xem kết quả bên dưới.")
        } catch (err: Error | unknown) {
            toast.error((err as Error).message || "Lỗi khi phân tích AI")
        } finally {
            setIsDetecting(false)
        }
    }

    const confidencePct = suggestion ? Math.round(suggestion.confidence * 100) : 0
    const confidenceColor = confidencePct >= 70 ? "text-green-600" : confidencePct >= 40 ? "text-yellow-600" : "text-red-600"

    return (
        <div className="border rounded-lg p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 font-bold text-sm text-purple-700 dark:text-purple-300">
                    <Sparkles className="h-4 w-4" />
                    AI Auto-Detect Selectors
                </div>
                {isExpanded && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => setIsExpanded(false)}
                    >
                        <ChevronUp className="h-3 w-3" />
                    </Button>
                )}
            </div>

            <div className="flex gap-2">
                <Input
                    value={detectUrl}
                    onChange={e => setDetectUrl(e.target.value)}
                    placeholder="https://vnexpress.net/bai-viet"
                    className="bg-white dark:bg-zinc-950 text-xs h-8"
                    onKeyDown={e => e.key === 'Enter' && handleDetect()}
                />
                <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 px-3 gap-1 whitespace-nowrap"
                    disabled={isDetecting}
                    onClick={handleDetect}
                >
                    {isDetecting ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                        <Search className="h-3 w-3" />
                    )}
                    Phân tích
                </Button>
            </div>

            {suggestion && isExpanded && (
                <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-top-2">
                    <Separator />

                    {/* Confidence */}
                    <div className="space-y-1">
                        <div className="flex justify-between text-xs font-medium">
                            <span>Confidence</span>
                            <span className={confidenceColor}>{confidencePct}%</span>
                        </div>
                        <Progress value={confidencePct} className="h-2" />
                    </div>

                    {/* Page info badges */}
                    <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="text-[10px]">
                            Type: <span className="font-bold ml-1">{suggestion.pageType}</span>
                        </Badge>
                        <Badge variant="outline" className="text-[10px]">
                            CMS: <span className="font-bold ml-1">{suggestion.cms}</span>
                        </Badge>
                    </div>

                    {/* Suggested selectors */}
                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-muted-foreground">Gợi ý Selectors</Label>
                        {[
                            { label: "Title", value: suggestion.suggestedTitleSelector },
                            { label: "Content", value: suggestion.suggestedContentSelector },
                            { label: "Thumbnail", value: suggestion.suggestedThumbnailSelector },
                            ...(suggestion.suggestedAuthorSelector
                                ? [{ label: "Author", value: suggestion.suggestedAuthorSelector }]
                                : []),
                            ...(suggestion.suggestedDateSelector
                                ? [{ label: "Date", value: suggestion.suggestedDateSelector }]
                                : []),
                        ].map(({ label, value }) => (
                            <div key={label} className="flex items-center gap-2">
                                <span className="text-[10px] font-medium text-muted-foreground w-16 shrink-0">{label}</span>
                                <code className="flex-1 text-[11px] bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded border truncate">
                                    {value}
                                </code>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-5 w-5 shrink-0"
                                    title="Copy selector"
                                    onClick={() => {
                                        navigator.clipboard.writeText(value).catch(() => {})
                                        toast.success("Copied!")
                                    }}
                                >
                                    <Copy className="h-3 w-3" />
                                </Button>
                            </div>
                        ))}
                    </div>

                    {/* Reasoning */}
                    {suggestion.reasoning && (
                        <p className="text-[11px] text-muted-foreground italic bg-zinc-100 dark:bg-zinc-800 rounded px-3 py-2">
                            💡 {suggestion.reasoning}
                        </p>
                    )}

                    {/* Apply button */}
                    <Button
                        className="w-full gap-2"
                        size="sm"
                        onClick={() => {
                            onApply(suggestion)
                            toast.success("Đã áp dụng selectors vào form!")
                            setIsExpanded(false)
                        }}
                    >
                        <Check className="h-3 w-3" />
                        Áp dụng Selectors
                    </Button>
                </div>
            )}
        </div>
    )
}

// ─── Phase 4.6: Batch Selector Tester ────────────────────────────────────────

function BatchTester() {
    const [urlsText, setUrlsText] = React.useState("")
    const [type, setType] = React.useState<'STATIC' | 'DYNAMIC'>('STATIC')
    const [results, setResults] = React.useState<BatchTestResult[]>([])
    const [isRunning, setIsRunning] = React.useState(false)
    const [hasRun, setHasRun] = React.useState(false)

    const handleRunBatch = async () => {
        const urls = urlsText
            .split('\n')
            .map(u => u.trim())
            .filter(u => u.length > 0)

        if (urls.length === 0) {
            toast.error("Nhập ít nhất 1 URL")
            return
        }
        if (urls.length > 50) {
            toast.error("Tối đa 50 URLs mỗi lần test")
            return
        }

        setIsRunning(true)
        setResults([])
        setHasRun(false)

        try {
            const data = await crawlerApi.testBatchSelectors(urls, type)
            setResults(data)
            setHasRun(true)

            const successCount = data.filter(r => r.status === 'SUCCESS').length
            toast.success(
                `${successCount}/${data.length} URLs thành công`,
                { description: `Đã test ${data.length} URLs với type ${type}` }
            )
        } catch (err: Error | unknown) {
            toast.error((err as Error).message || "Lỗi khi batch test")
        } finally {
            setIsRunning(false)
        }
    }

    const handleExportCsv = () => {
        if (results.length === 0) return

        const headers = ["URL", "Status", "Title", "Content Length", "Error"]
        const rows = results.map(r => [
            r.url,
            r.status,
            r.title ?? "",
            r.contentLength?.toString() ?? "",
            r.error ?? "",
        ])

        const csv = [headers, ...rows]
            .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
            .join('\n')

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = `batch-test-${new Date().toISOString().slice(0, 10)}.csv`
        link.click()
        URL.revokeObjectURL(url)
    }

    const successCount = results.filter(r => r.status === 'SUCCESS').length
    const failCount = results.filter(r => r.status === 'FAILED').length

    return (
        <Card className="shadow-sm">
            <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                            <Beaker className="h-5 w-5 text-primary" />
                            Batch Selector Tester
                            <Badge variant="outline" className="ml-1 text-[10px] font-bold">
                                Phase 4.6
                            </Badge>
                        </CardTitle>
                        <CardDescription>
                            Test selectors trên nhiều URLs cùng lúc. Tối đa 50 URLs mỗi lần.
                        </CardDescription>
                    </div>
                    {hasRun && (
                        <div className="flex items-center gap-3 shrink-0">
                            <div className="flex items-center gap-1 text-xs">
                                <span className="flex items-center gap-1 text-green-600">
                                    <CheckCircle2 className="h-3 w-3" /> {successCount} OK
                                </span>
                                <span className="flex items-center gap-1 text-red-500">
                                    <X className="h-3 w-3" /> {failCount} Fail
                                </span>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-1"
                                onClick={handleExportCsv}
                            >
                                <Download className="h-3 w-3" />
                                Export CSV
                            </Button>
                        </div>
                    )}
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Input area */}
                <div className="space-y-2">
                    <Label htmlFor="batch-urls">Danh sách URLs (mỗi dòng 1 URL)</Label>
                    <Textarea
                        id="batch-urls"
                        value={urlsText}
                        onChange={e => setUrlsText(e.target.value)}
                        placeholder={`https://vnexpress.net/bai-viet-1\nhttps://vnexpress.net/bai-viet-2\nhttps://dantri.com.vn/bai-viet.htm`}
                        className="font-mono text-xs min-h-[120px] bg-white dark:bg-zinc-950 resize-y"
                        disabled={isRunning}
                    />
                    <p className="text-[10px] text-muted-foreground">
                        {urlsText.split('\n').filter(u => u.trim()).length} URLs được nhập
                    </p>
                </div>

                {/* Type selector + Run */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="grid grid-cols-2 gap-2 sm:w-48">
                        <Button
                            variant={type === 'STATIC' ? 'default' : 'outline'}
                            className="h-8 text-xs font-bold"
                            onClick={() => setType('STATIC')}
                            disabled={isRunning}
                        >
                            STATIC
                        </Button>
                        <Button
                            variant={type === 'DYNAMIC' ? 'default' : 'outline'}
                            className="h-8 text-xs font-bold"
                            onClick={() => setType('DYNAMIC')}
                            disabled={isRunning}
                        >
                            DYNAMIC
                        </Button>
                    </div>
                    <Button
                        className="flex-1 gap-2"
                        disabled={isRunning || urlsText.trim().length === 0}
                        onClick={handleRunBatch}
                    >
                        {isRunning ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Đang test... ({results.length}/{urlsText.split('\n').filter(u => u.trim()).length})
                            </>
                        ) : (
                            <>
                                <Play className="h-4 w-4" />
                                Batch Test
                            </>
                        )}
                    </Button>
                    {hasRun && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10"
                            title="Reset"
                            onClick={() => { setResults([]); setHasRun(false); }}
                        >
                            <RefreshCw className="h-4 w-4" />
                        </Button>
                    )}
                </div>

                {/* Inline progress */}
                {isRunning && results.length > 0 && (
                    <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-muted-foreground">
                            <span>Đang xử lý...</span>
                            <span>{results.length} / {urlsText.split('\n').filter(u => u.trim()).length}</span>
                        </div>
                        <Progress
                            value={(results.length / urlsText.split('\n').filter(u => u.trim()).length) * 100}
                            className="h-1"
                        />
                    </div>
                )}

                {/* Results table */}
                {hasRun && results.length > 0 && (
                    <div className="animate-in fade-in slide-in-from-top-2">
                        <div className="border rounded-lg overflow-hidden">
                            <Table>
                                <TableHeader className="bg-muted/50">
                                    <TableRow>
                                        <TableHead className="w-10">Status</TableHead>
                                        <TableHead>URL</TableHead>
                                        <TableHead>Title</TableHead>
                                        <TableHead className="text-right">Length</TableHead>
                                        <TableHead>Error</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {results.map((result, idx) => (
                                        <TableRow key={idx} className="hover:bg-muted/20 transition-colors">
                                            <TableCell>
                                                {result.status === 'SUCCESS' ? (
                                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                ) : (
                                                    <X className="h-4 w-4 text-red-500" />
                                                )}
                                            </TableCell>
                                            <TableCell className="max-w-[200px]">
                                                <span
                                                    className="text-xs font-mono truncate block cursor-pointer"
                                                    title={result.url}
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(result.url).catch(() => {})
                                                        toast.success("URL copied!")
                                                    }}
                                                >
                                                    {result.url}
                                                </span>
                                            </TableCell>
                                            <TableCell className="max-w-[160px]">
                                                <span className="text-xs truncate block" title={result.title}>
                                                    {result.title || <span className="text-muted-foreground italic">—</span>}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {result.contentLength !== undefined ? (
                                                    <span className="text-xs font-mono text-muted-foreground">
                                                        {result.contentLength.toLocaleString()}
                                                    </span>
                                                ) : (
                                                    <span className="text-muted-foreground italic">—</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="max-w-[160px]">
                                                {result.error ? (
                                                    <span
                                                        className="text-[10px] text-red-500 cursor-help"
                                                        title={result.error}
                                                    >
                                                        {result.error.slice(0, 50)}
                                                        {result.error.length > 50 ? '...' : ''}
                                                    </span>
                                                ) : (
                                                    <span className="text-muted-foreground italic">—</span>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                )}

                {/* Empty state */}
                {hasRun && results.length === 0 && !isRunning && (
                    <div className="flex flex-col items-center justify-center h-32 text-muted-foreground gap-2">
                        <AlertCircle className="h-6 w-6 opacity-20" />
                        <p className="text-sm">Không có kết quả nào.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
