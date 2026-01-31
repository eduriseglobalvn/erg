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
    ChevronDown,
    ChevronUp,
    CheckCircle2,
    Play
} from "lucide-react"
import { crawlerApi, ScraperConfig } from "@/services/crawler.api"
import { postsApi } from "@/services/posts.api"
import { Button } from "@/components/admin/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/admin/ui/card"
import { Input } from "@/components/admin/ui/input"
import { Badge } from "@/components/admin/ui/badge"
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

export default function ScraperConfigsPage() {
    const queryClient = useQueryClient()
    const [isDialogOpen, setIsDialogOpen] = React.useState(false)
    const [editingConfig, setEditingConfig] = React.useState<ScraperConfig | null>(null)
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
        onError: (err: any) => toast.error(err.message || "Lỗi khi lưu dữ liệu")
    })

    const deleteMutation = useMutation({
        mutationFn: (id: string) => crawlerApi.deleteConfig(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['crawler', 'configs'] })
            toast.success("Đã xóa cấu hình")
        }
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
        // For editingSource we need to be careful with the ID
        const finalId = editingConfig?.id
        if (finalId) {
            saveMutation.mutate(formData)
        } else {
            saveMutation.mutate(formData)
        }
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
                    <DialogContent className="sm:max-w-[600px]">
                        <form onSubmit={handleSubmit}>
                            <DialogHeader>
                                <DialogTitle>{editingConfig ? "Chỉnh sửa" : "Thêm mới"} cấu hình Domain</DialogTitle>
                                <DialogDescription>Nhập Domain và các CSS Selector tương ứng để hệ thống biết cách lấy dữ liệu.</DialogDescription>
                            </DialogHeader>
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
                                            onValueChange={val => setFormData({ ...formData, type: val as any })}
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
                                            <Label htmlFor="titleSelector">Title Selector</Label>
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
                                            <Label htmlFor="contentSelector">Content Selector</Label>
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
                                            <Label htmlFor="thumbnailSelector">Thumbnail Selector (CSS or Meta)</Label>
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* List Configs */}
                <Card className="lg:col-span-2 shadow-sm">
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
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-destructive hover:bg-red-50"
                                                            onClick={() => confirm("Xóa cấu hình này sẽ dùng Selector mặc định cho domain này. Tiếp tục?") && deleteMutation.mutate(config.id)}
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

                {/* Selector Tester UI */}
                <SelectorTester />
            </div>
        </div>
    )
}

function TooltipLabel({ label, value }: { label: string, value?: string }) {
    if (!value) return null
    return (
        <span className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-200" title={`${label}: ${value}`}>
            {label[0]}
        </span>
    )
}

function SelectorTester() {
    const [url, setUrl] = React.useState("")
    const [type, setType] = React.useState<'STATIC' | 'DYNAMIC'>('STATIC')
    const [result, setResult] = React.useState<any>(null)
    const [loading, setLoading] = React.useState(false)
    const [categoryId, setCategoryId] = React.useState<string | undefined>(undefined)

    const { data: categories = [] } = useQuery({
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
        } catch (err: any) {
            toast.error(err.message || "Lỗi khi gọi API")
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
                            {categories.map((cat: any) => (
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
