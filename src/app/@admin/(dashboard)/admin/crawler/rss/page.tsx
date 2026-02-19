"use client"

import * as React from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
    Plus,
    Play,
    Pencil,
    Trash2,
    Rss,
    Loader2,
    AlertCircle,
    CheckCircle2,
    Calendar,
    Power,
    Send,
    Eye
} from "lucide-react"
import { crawlerApi, RssSource, PeekResponse, PeekItem } from "@/services/crawler.api"
import { postsApi } from "@/services/posts.api"
import { Button } from "@/components/admin/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/admin/ui/card"
import { Input } from "@/components/admin/ui/input"
import { Badge } from "@/components/admin/ui/badge"
import { toast } from "sonner"
import { Switch } from "@/components/admin/ui/switch"
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
import { CronEditor } from "@/components/admin/crawler/cron-editor"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

/**
 * RSS SOURCE DIALOG COMPONENT
 * Memoized to prevent unnecessary re-renders when parent state changes.
 */
import { Checkbox } from "@/components/admin/ui/checkbox"

/**
 * RSS SOURCE DIALOG COMPONENT
 * Memoized to prevent unnecessary re-renders when parent state changes.
 */
const RssSourceDialog = React.memo(({
    isOpen,
    onClose,
    source,
    categories,
    isLoadingCats,
    onSuccess
}: {
    isOpen: boolean,
    onClose: () => void,
    source: RssSource | null,
    categories: any[],
    isLoadingCats: boolean,
    onSuccess: () => void
}) => {
    const queryClient = useQueryClient();
    const [formData, setFormData] = React.useState<Partial<RssSource>>({
        name: "",
        url: "",
        targetCategoryId: undefined,
        cronExpression: "0 * * * *",
        isActive: true,
        autoPublish: false
    });

    const [previewData, setPreviewData] = React.useState<any | null>(null);
    const [selectedLinks, setSelectedLinks] = React.useState<string[]>([]);
    const [isPreviewLoading, setIsPreviewLoading] = React.useState(false);

    // Reset form when dialog opens/closes or source changes
    React.useEffect(() => {
        if (isOpen) {
            setPreviewData(null);
            setSelectedLinks([]);
            if (source) {
                setFormData({
                    ...source,
                    targetCategoryId: source.targetCategoryId
                });
            } else {
                setFormData({
                    name: "",
                    url: "",
                    targetCategoryId: undefined,
                    cronExpression: "0 * * * *",
                    isActive: true,
                    autoPublish: false
                });
            }
        }
    }, [source, isOpen]);

    const saveMutation = useMutation({
        mutationFn: async (data: Partial<RssSource>) => {
            const currentId = source?.id || (source as any)?._id;

            // Priority: Create/Update Selective if items selected
            if (selectedLinks.length > 0) {
                return crawlerApi.createSelectiveRss({
                    feed: {
                        id: currentId,
                        name: data.name!,
                        url: data.url!,
                        targetCategoryId: data.targetCategoryId!,
                        isActive: data.isActive!,
                    } as any,
                    selectedLinks
                });
            }
            // Standard Create/Update
            return currentId
                ? crawlerApi.updateRssSource(currentId, data)
                : crawlerApi.createRssSource(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['crawler', 'rss'] });
            toast.success(source ? "Đã cập nhật nguồn RSS" : (selectedLinks.length > 0 ? `Đã thêm nguồn và cào ${selectedLinks.length} bài` : "Đã thêm nguồn RSS mới"));
            onSuccess();
        },
        onError: (err: any) => toast.error(err.message || "Lỗi khi lưu dữ liệu")
    });

    const syncMutation = useMutation({
        mutationFn: (id: string) => crawlerApi.syncRss(id),
        onSuccess: () => toast.success("Đã kích hoạt đồng bộ tin tức ngay lập tức"),
        onError: (err: any) => toast.error(err.message || "Lỗi khi gọi đồng bộ")
    });

    const handlePreview = async () => {
        if (!formData.url) {
            toast.error("Vui lòng nhập URL trước khi xem thử");
            return;
        }
        setIsPreviewLoading(true);
        try {
            const res = await crawlerApi.previewRss(formData.url);
            setPreviewData(res);
            // Auto fill name if empty
            if (!formData.name && res.title) {
                setFormData(prev => ({ ...prev, name: res.title }));
            }
            toast.success("Đã tải thông tin RSS");
        } catch (error: any) {
            toast.error(error.message || "Không thể tải RSS Preview");
        } finally {
            setIsPreviewLoading(false);
        }
    };

    const toggleLink = (link: string) => {
        setSelectedLinks(prev =>
            prev.includes(link)
                ? prev.filter(l => l !== link)
                : [...prev, link]
        );
    };

    const updateField = (field: keyof RssSource, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.url || !formData.targetCategoryId) {
            toast.error("Vui lòng điền đầy đủ thông tin (Tên, URL, Chuyên mục)");
            return;
        }

        saveMutation.mutate(formData);
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto flex flex-col">
                <form onSubmit={handleSubmit} className="contents">
                    <DialogHeader>
                        <DialogTitle>{source ? "Chỉnh sửa" : "Thêm mới"} nguồn RSS</DialogTitle>
                        <DialogDescription>Nhập thông tin nguồn tin RSS để hệ thống bắt đầu cào dữ liệu.</DialogDescription>
                    </DialogHeader>

                    <div className="flex gap-6 py-4">
                        {/* LEFT COLUMN: FORM */}
                        <div className={`grid gap-4 ${previewData ? 'w-1/2' : 'w-full'} transition-all`}>
                            <div className="grid gap-2">
                                <Label htmlFor="url">URL RSS Feed</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="url"
                                        value={formData.url || ""}
                                        onChange={e => updateField("url", e.target.value)}
                                        placeholder="https://example.com/rss"
                                        required
                                        className="bg-white dark:bg-zinc-950"
                                    />
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={handlePreview}
                                        disabled={isPreviewLoading || !formData.url}
                                        className="shrink-0"
                                    >
                                        {isPreviewLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Check URL"}
                                    </Button>
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="name">Tên nguồn tin</Label>
                                <Input
                                    id="name"
                                    value={formData.name || ""}
                                    onChange={e => updateField("name", e.target.value)}
                                    placeholder="Tự động lấy nếu Check URL"
                                    required
                                    className="bg-white dark:bg-zinc-950"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Chuyên mục mục tiêu (MySQL)</Label>
                                <Select
                                    value={formData.targetCategoryId?.toString()}
                                    onValueChange={val => {
                                        const cat = categories.find(c => c.id.toString() === val);
                                        setFormData(prev => ({
                                            ...prev,
                                            targetCategoryId: cat ? cat.id : val,
                                            categoryName: cat ? cat.name : undefined
                                        }));
                                    }}
                                >
                                    <SelectTrigger className="w-full bg-white dark:bg-zinc-950">
                                        <SelectValue placeholder={isLoadingCats ? "Đang tải..." : "Chọn chuyên mục"} />
                                    </SelectTrigger>
                                    <SelectContent position="popper" className="z-[110]">
                                        {categories.map(cat => (
                                            <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label>Tần suất cào tin tự động</Label>
                                <CronEditor
                                    value={formData.cronExpression || "0 * * * *"}
                                    onChange={val => updateField("cronExpression", val)}
                                />
                            </div>
                            <div className="flex items-center justify-between border-t pt-4">
                                <div className="flex flex-col gap-0.5">
                                    <Label>Tự động đăng bài</Label>
                                    <span className="text-[10px] text-muted-foreground italic">Publish ngay khi cào xong</span>
                                </div>
                                <Switch
                                    checked={formData.autoPublish || false}
                                    onCheckedChange={(checked: boolean) => updateField("autoPublish", checked)}
                                />
                            </div>
                            <div className="flex items-center justify-between border-t pt-2">
                                <div className="flex flex-col gap-0.5">
                                    <Label>Trạng thái hoạt động</Label>
                                </div>
                                <Switch
                                    checked={formData.isActive || false}
                                    onCheckedChange={(checked: boolean) => updateField("isActive", checked)}
                                />
                            </div>
                        </div>

                        {/* RIGHT COLUMN: PREVIEW */}
                        {previewData && (
                            <div className="w-1/2 flex flex-col border rounded-md overflow-hidden bg-muted/10 h-[500px]">
                                <div className="p-3 border-b bg-muted/20 flex justify-between items-center">
                                    <h4 className="font-semibold text-sm">Preview ({previewData.items.length} bài)</h4>
                                    <span className="text-xs text-muted-foreground">Chọn bài muốn cào ngay</span>
                                </div>
                                <div className="flex-1 overflow-y-auto p-0">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[40px]"></TableHead>
                                                <TableHead>Bài viết</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {previewData.items.map((item: any, idx: number) => (
                                                <TableRow key={idx} className={item.isCrawled ? "opacity-50" : ""}>
                                                    <TableCell className="py-2 px-3">
                                                        <Checkbox
                                                            checked={selectedLinks.includes(item.link)}
                                                            onCheckedChange={() => toggleLink(item.link)}
                                                            disabled={item.isCrawled}
                                                        />
                                                    </TableCell>
                                                    <TableCell className="py-2 px-2">
                                                        <div className="flex gap-2">
                                                            {item.thumbnail && (
                                                                <img src={item.thumbnail} className="w-10 h-10 object-cover rounded shadow-sm" />
                                                            )}
                                                            <div className="flex flex-col gap-0.5">
                                                                <p className="font-medium text-xs line-clamp-2" title={item.title}>{item.title}</p>
                                                                {item.isCrawled && <span className="text-[10px] text-green-600 font-bold">● Đã cào</span>}
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                                <div className="p-2 border-t bg-white dark:bg-zinc-950 text-xs text-center text-muted-foreground">
                                    Đã chọn {selectedLinks.length} bài
                                </div>
                            </div>
                        )}
                    </div>

                    <DialogFooter className="flex justify-between items-center w-full mt-auto pt-4 border-t">
                        {(source || formData.id) && (
                            <Button
                                type="button"
                                variant="outline"
                                className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                onClick={() => syncMutation.mutate((source?.id || formData.id) as string)}
                                disabled={syncMutation.isPending}
                            >
                                {syncMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />} Đồng bộ ngay
                            </Button>
                        )}
                        <div className="flex gap-2 ml-auto">
                            <Button type="button" variant="outline" onClick={onClose}>Hủy</Button>
                            <Button type="submit" disabled={saveMutation.isPending}>
                                {saveMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {selectedLinks.length > 0 ? `Lưu & Cào (${selectedLinks.length})` : "Lưu nguồn tin"}
                            </Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
});

// Set display name for memoized component
RssSourceDialog.displayName = "RssSourceDialog";

/**
 * PEEK DIALOG COMPONENT
 * Shows real-time RSS feed items and allows selective crawling.
 */
const PeekDialog = ({
    isOpen,
    onClose,
    rssId,
    targetCategoryId
}: {
    isOpen: boolean,
    onClose: () => void,
    rssId: string | null,
    targetCategoryId: string | number | undefined
}) => {
    const [triggeringUrl, setTriggeringUrl] = React.useState<string | null>(null);

    const { data: peekData, isLoading, refetch } = useQuery({
        queryKey: ['crawler', 'peek', rssId],
        queryFn: () => rssId ? crawlerApi.peekRss(rssId) : Promise.resolve(null),
        enabled: !!rssId
    });

    const triggerUrlMutation = useMutation({
        mutationFn: (url: string) => crawlerApi.triggerUrl(url, 'STATIC', targetCategoryId),
        onSuccess: () => {
            toast.success("Đã thêm vào hàng đợi cào tin");
            setTriggeringUrl(null);
        },
        onError: (err: any) => {
            toast.error(err.message || "Lỗi khi cào tin");
            setTriggeringUrl(null);
        }
    });

    const handleTrigger = (url: string) => {
        setTriggeringUrl(url);
        triggerUrlMutation.mutate(url);
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[800px] max-h-[85vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Rss className="h-5 w-5 text-orange-500" />
                        Xem trước nguồn tin: {peekData?.feedName || "Đang tải..."}
                    </DialogTitle>
                    <DialogDescription>
                        Danh sách bài viết mới nhất từ RSS Feed. Chọn "Cào bài" để xử lý thủ công từng bài.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto min-h-[300px] border rounded-md mt-4">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-48 gap-3">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-sm text-muted-foreground">Đang tải dữ liệu từ RSS...</p>
                        </div>
                    ) : peekData?.items?.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-48 gap-2 text-muted-foreground">
                            <AlertCircle className="h-8 w-8 opacity-20" />
                            <p>Không tìm thấy bài viết nào trong RSS này.</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader className="sticky top-0 bg-white dark:bg-zinc-950 z-10 shadow-sm">
                                <TableRow>
                                    <TableHead className="w-[80px]">Ảnh</TableHead>
                                    <TableHead>Tiêu đề / Link</TableHead>
                                    <TableHead className="w-[120px]">Ngày đăng</TableHead>
                                    <TableHead className="w-[100px] text-right">Thao tác</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {peekData?.items.map((item, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell>
                                            {item.thumbnail ? (
                                                <img src={item.thumbnail} alt="" className="h-10 w-16 object-cover rounded-sm bg-muted" />
                                            ) : (
                                                <div className="h-10 w-16 bg-muted rounded-sm flex items-center justify-center text-[10px] text-muted-foreground">No Img</div>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                <a href={item.link} target="_blank" rel="noopener noreferrer" className="font-medium hover:text-primary line-clamp-2">
                                                    {item.title}
                                                </a>
                                                <div className="flex items-center gap-2">
                                                    {item.isCrawled ? (
                                                        <Badge variant="secondary" className="text-[10px] h-5 px-1.5 bg-green-50 text-green-700 border-green-200">
                                                            <CheckCircle2 className="h-3 w-3 mr-1" /> Đã cào
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="text-[10px] h-5 px-1.5 text-muted-foreground">
                                                            Mới
                                                        </Badge>
                                                    )}
                                                    <span className="text-[10px] text-muted-foreground truncate max-w-[300px]">{item.link}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-xs text-muted-foreground">
                                            {item.pubDate ? format(new Date(item.pubDate), 'dd/MM/yyyy', { locale: vi }) : "N/A"}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {item.isCrawled ? (
                                                <Button size="sm" variant="ghost" disabled className="h-7 w-full text-green-600 opacity-70">
                                                    Đã có
                                                </Button>
                                            ) : (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-7 w-full border-blue-200 text-blue-700 hover:bg-blue-50"
                                                    onClick={() => handleTrigger(item.link)}
                                                    disabled={triggeringUrl === item.link}
                                                >
                                                    {triggeringUrl === item.link ? <Loader2 className="h-3 w-3 animate-spin" /> : "Cào bài"}
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </div>

                <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={onClose}>Đóng</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default function RssManagementPage() {
    const queryClient = useQueryClient()
    const [isDialogOpen, setIsDialogOpen] = React.useState(false)
    const [peekRssId, setPeekRssId] = React.useState<string | null>(null) // State for Peek Dialog
    const [peekCategoryId, setPeekCategoryId] = React.useState<string | number | undefined>(undefined)
    const [editingSource, setEditingSource] = React.useState<RssSource | null>(null)

    // 1. Load Data
    const { data: sources = [], isLoading } = useQuery({
        queryKey: ['crawler', 'rss'],
        queryFn: () => crawlerApi.getRssSources()
    })

    const { data: categories = [], isLoading: isLoadingCats } = useQuery({
        queryKey: ['categories'],
        queryFn: () => postsApi.getCategories()
    })

    // 2. Mutations
    const deleteMutation = useMutation({
        mutationFn: (id: string) => crawlerApi.deleteRssSource(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['crawler', 'rss'] })
            toast.success("Đã xóa nguồn RSS")
        }
    })

    const syncMutation = useMutation({
        mutationFn: (id: string) => crawlerApi.syncRss(id),
        onSuccess: () => toast.success("Đã kích hoạt đồng bộ tin tức"),
        onError: (err: any) => toast.error(err.message || "Lỗi khi gọi đồng bộ")
    })

    // 3. Handlers
    const handleEdit = (source: RssSource) => {
        setEditingSource(source)
        setIsDialogOpen(true)
    }

    const handleAdd = () => {
        setEditingSource(null)
        setIsDialogOpen(true)
    }

    const handleClose = () => {
        setIsDialogOpen(false)
        setEditingSource(null)
    }

    return (
        <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-primary uppercase mb-2">Quản lý nguồn RSS</h1>
                    <p className="text-muted-foreground">Thiết lập các nguồn tin RSS để tự động cập nhật bài viết hàng ngày.</p>
                </div>

                <RssSourceDialog
                    isOpen={isDialogOpen}
                    onClose={handleClose}
                    source={editingSource}
                    categories={categories}
                    isLoadingCats={isLoadingCats}
                    onSuccess={handleClose}
                />

                <PeekDialog
                    isOpen={!!peekRssId}
                    rssId={peekRssId}
                    targetCategoryId={peekCategoryId}
                    onClose={() => {
                        setPeekRssId(null);
                        setPeekCategoryId(undefined);
                    }}
                />

                <Button onClick={handleAdd} className="h-11 px-6 shadow-md transition-all hover:scale-[1.02]">
                    <Plus className="mr-2 h-5 w-5" /> Thêm nguồn RSS
                </Button>
            </div>

            <Card className="shadow-sm">
                <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                            <Rss className="h-5 w-5 text-primary" />
                            Danh sách RSS Sources
                        </CardTitle>
                        <Badge variant="secondary" className="font-normal">{sources.length} sources</Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-4 py-8">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="h-16 w-full bg-muted animate-pulse rounded-md" />
                            ))}
                        </div>
                    ) : sources.length === 0 ? (
                        <div className="h-48 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-xl gap-4 bg-muted/5">
                            <Rss className="h-12 w-12 opacity-20" />
                            <p>Chưa có nguồn tin RSS nào được thiết lập.</p>
                            <Button variant="outline" onClick={handleAdd}>Thêm nguồn tin đầu tiên</Button>
                        </div>
                    ) : (
                        <div className="border rounded-md">
                            <Table>
                                <TableHeader className="bg-muted/50">
                                    <TableRow>
                                        <TableHead className="w-[200px] font-bold">Nguồn tin</TableHead>
                                        <TableHead className="font-bold">Chuyên mục</TableHead>
                                        <TableHead className="font-bold">Tần suất (Cron)</TableHead>
                                        <TableHead className="font-bold">Trạng thái</TableHead>
                                        <TableHead className="text-right font-bold w-[180px]">Thao tác</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {sources.map((source) => (
                                        <TableRow key={source.id || (source as any)._id} className="hover:bg-muted/30 transition-colors">
                                            <TableCell>
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="font-bold text-foreground">{source.name}</span>
                                                    <span className="text-[10px] text-muted-foreground truncate max-w-[180px]">{source.url}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="font-medium bg-zinc-100 dark:bg-zinc-800">
                                                    {source.categoryName || (source.targetCategoryId ? `CatID: ${source.targetCategoryId}` : "N/A")}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1.5 text-xs font-mono">
                                                    <Calendar className="h-3 w-3 text-muted-foreground" />
                                                    {source.cronExpression}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-1">
                                                        {source.isActive ? (
                                                            <Badge className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200">Active</Badge>
                                                        ) : (
                                                            <Badge variant="secondary">Paused</Badge>
                                                        )}
                                                        {source.autoPublish && (
                                                            <Badge className="bg-blue-50 text-blue-700 border-blue-200">Auto-Pub</Badge>
                                                        )}
                                                    </div>
                                                    {source.lastRunAt && (
                                                        <span className="text-[9px] text-muted-foreground italic font-mono">
                                                            Lần cuối: {format(new Date(source.lastRunAt), 'HH:mm:ss dd/MM/yyyy')}
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 px-3 flex items-center gap-1.5 font-bold"
                                                        onClick={() => {
                                                            const id = source.id || (source as any)._id;
                                                            setPeekRssId(id);
                                                            setPeekCategoryId(source.targetCategoryId);
                                                        }}
                                                    >
                                                        <Eye className="h-3 w-3" />
                                                        Xem
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 px-3 text-blue-600 border-blue-200 hover:bg-blue-50 flex items-center gap-1.5 font-bold"
                                                        onClick={() => syncMutation.mutate(source.id || (source as any)._id)}
                                                        disabled={syncMutation.isPending}
                                                    >
                                                        {syncMutation.isPending && syncMutation.variables === (source.id || (source as any)._id) ? (
                                                            <Loader2 className="h-3 w-3 animate-spin" />
                                                        ) : (
                                                            <Play className="h-3 w-3 fill-current" />
                                                        )}
                                                        Đồng bộ ngay
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() => handleEdit(source)}
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-destructive hover:bg-red-50"
                                                        onClick={() => confirm("Bạn có chắc chắn muốn xóa nguồn này?") && deleteMutation.mutate(source.id || (source as any)._id)}
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

            <div className="grid md:grid-cols-2 gap-6 pb-10">
                <Card className="bg-blue-50 border-blue-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold flex items-center gap-2 text-blue-800">
                            <Send className="h-4 w-4" />
                            Cơ chế hoạt động
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-blue-700 space-y-2">
                        <p>1. Hệ thống dựa vào <b>Cron</b> để định kỳ quét link từ RSS XML.</p>
                        <p>2. Chỉ những bài viết chưa từng cào (dựa trên URL) mới được thêm vào hàng đợi.</p>
                        <p>3. AI tự động tóm tắt và tạo SEO trước khi lưu vào cơ sở dữ liệu.</p>
                    </CardContent>
                </Card>

                <Card className="bg-amber-50 border-amber-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold flex items-center gap-2 text-amber-800">
                            <Power className="h-4 w-4" />
                            Lưu ý quan trọng
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-amber-700 space-y-2">
                        <p>• Hãy đảm bảo URL RSS hợp lệ công khai (XML format).</p>
                        <p>• Nếu bài viết cào về bị lỗi định dạng, hãy kiểm tra lại <b>Cấu hình Selector</b> cho domain đó.</p>
                        <p>• Tránh đặt lịch cào quá dày (dưới 5 phút) để không bị website nguồn chặn IP.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
