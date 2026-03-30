"use client"

import * as React from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
    Plus,
    Trash2,
    ShieldAlert,
    Loader2,
    Search,
    Globe,
    Key,
    Regex,
} from "lucide-react"
import { crawlerApi, ContentBlacklistItem } from "@/services/crawler.api"
import { Button } from "@/components/admin/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/admin/ui/card"
import { Input } from "@/components/admin/ui/input"
import { Badge } from "@/components/admin/ui/badge"
import { toast } from "sonner"
import { Label } from "@/components/admin/ui/label"
import { Textarea } from "@/components/admin/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
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
import { Switch } from "@/components/admin/ui/switch"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

type BlacklistType = "domain" | "keyword" | "pattern"
type FilterTab = "all" | BlacklistType

const TYPE_CONFIG: Record<BlacklistType, { label: string; icon: React.ReactNode; color: string }> = {
    domain: {
        label: "Domain",
        icon: <Globe className="h-3.5 w-3.5" />,
        color: "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100",
    },
    keyword: {
        label: "Từ khóa",
        icon: <Key className="h-3.5 w-3.5" />,
        color: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
    },
    pattern: {
        label: "Pattern",
        icon: <Regex className="h-3.5 w-3.5" />,
        color: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
    },
}

// ─── Add/Edit Dialog ───────────────────────────────────────────────────────────

interface BlacklistDialogProps {
    isOpen: boolean
    onClose: () => void
    editingItem: ContentBlacklistItem | null
    onSuccess: () => void
}

const BlacklistDialog = React.memo(({
    isOpen,
    onClose,
    editingItem,
    onSuccess,
}: BlacklistDialogProps) => {
    const queryClient = useQueryClient()
    const [formData, setFormData] = React.useState({
        type: "domain" as BlacklistType,
        value: "",
        reason: "",
        expiresAt: "",
    })

    // Reset form when dialog opens/closes or editing item changes
    React.useEffect(() => {
        if (isOpen) {
            if (editingItem) {
                setFormData({
                    type: editingItem.type,
                    value: editingItem.value,
                    reason: editingItem.reason ?? "",
                    expiresAt: editingItem.expiresAt
                        ? format(new Date(editingItem.expiresAt), "yyyy-MM-dd'T'HH:mm")
                        : "",
                })
            } else {
                setFormData({ type: "domain", value: "", reason: "", expiresAt: "" })
            }
        }
    }, [isOpen, editingItem])

    const saveMutation = useMutation({
        mutationFn: async () => {
            if (editingItem) {
                return crawlerApi.updateBlacklist(editingItem.id, {
                    reason: formData.reason || undefined,
                    expiresAt: formData.expiresAt || undefined,
                })
            } else {
                return crawlerApi.createBlacklist({
                    type: formData.type,
                    value: formData.value,
                    reason: formData.reason || undefined,
                    expiresAt: formData.expiresAt || undefined,
                })
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["crawler", "blacklist"] })
            toast.success(editingItem ? "Đã cập nhật mục blacklist" : "Đã thêm vào blacklist")
            onSuccess()
        },
        onError: (err: Error) => toast.error(err.message || "Lỗi khi lưu blacklist"),
    })

    const updateField = (field: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.value.trim()) {
            toast.error("Vui lòng nhập giá trị")
            return
        }
        if (!editingItem && formData.type === "pattern") {
            try { new RegExp(formData.value) }
            catch { toast.error("Pattern không hợp lệ. Vui lòng nhập regex hợp lệ."); return }
        }
        saveMutation.mutate()
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[520px]">
                <form onSubmit={handleSubmit} className="contents">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <ShieldAlert className="h-5 w-5 text-red-500" />
                            {editingItem ? "Chỉnh sửa mục Blacklist" : "Thêm mục Blacklist mới"}
                        </DialogTitle>
                        <DialogDescription>
                            {editingItem
                                ? "Cập nhật lý do hoặc thời hạn cho mục này."
                                : "Thêm domain, từ khóa hoặc pattern để chặn nội dung khi cào."}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        {!editingItem && (
                            <div className="grid gap-2">
                                <Label htmlFor="type">Loại chặn</Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={(val) => updateField("type", val)}
                                >
                                    <SelectTrigger className="w-full bg-white dark:bg-zinc-950">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent position="popper" className="z-[110]">
                                        <SelectItem value="domain">
                                            <div className="flex items-center gap-2">
                                                <Globe className="h-4 w-4 text-purple-600" />
                                                Domain — Chặn theo tên miền
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="keyword">
                                            <div className="flex items-center gap-2">
                                                <Key className="h-4 w-4 text-amber-600" />
                                                Từ khóa — Chặn theo từ/cụm từ trong nội dung
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="pattern">
                                            <div className="flex items-center gap-2">
                                                <Regex className="h-4 w-4 text-emerald-600" />
                                                Pattern — Chặn theo biểu thức chính quy (Regex)
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {!editingItem && (
                            <div className="grid gap-2">
                                <Label htmlFor="value">
                                    Giá trị
                                    {formData.type === "domain" && (
                                        <span className="text-muted-foreground font-normal ml-1">
                                            (VD: spam-site.com)
                                        </span>
                                    )}
                                    {formData.type === "keyword" && (
                                        <span className="text-muted-foreground font-normal ml-1">
                                            (VD: casino)
                                        </span>
                                    )}
                                    {formData.type === "pattern" && (
                                        <span className="text-muted-foreground font-normal ml-1">
                                            (VD: click here to continue)
                                        </span>
                                    )}
                                </Label>
                                <Input
                                    id="value"
                                    value={formData.value}
                                    onChange={(e) => updateField("value", e.target.value)}
                                    placeholder={
                                        formData.type === "domain"
                                            ? "spam-site.com"
                                            : formData.type === "keyword"
                                                ? "casino online"
                                                : "click here to continue"
                                    }
                                    required
                                    className="bg-white dark:bg-zinc-950"
                                />
                            </div>
                        )}

                        <div className="grid gap-2">
                            <Label htmlFor="reason">
                                Lý do
                                {editingItem && (
                                    <span className="text-muted-foreground font-normal ml-1">(tùy chọn)</span>
                                )}
                            </Label>
                            <Textarea
                                id="reason"
                                value={formData.reason}
                                onChange={(e) => updateField("reason", e.target.value)}
                                placeholder="Mô tả lý do chặn (VD: Trang chứa nội dung spam quảng cáo)"
                                rows={3}
                                className="bg-white dark:bg-zinc-950 resize-none"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="expiresAt">
                                Hạn chặn
                                <span className="text-muted-foreground font-normal ml-1">(tùy chọn)</span>
                            </Label>
                            <Input
                                id="expiresAt"
                                type="datetime-local"
                                value={formData.expiresAt}
                                onChange={(e) => updateField("expiresAt", e.target.value)}
                                className="bg-white dark:bg-zinc-950"
                            />
                            <p className="text-[11px] text-muted-foreground">
                                Để trống nếu muốn chặn vĩnh viễn.
                            </p>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Hủy
                        </Button>
                        <Button type="submit" disabled={saveMutation.isPending}>
                            {saveMutation.isPending && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            {editingItem ? "Lưu thay đổi" : "Thêm vào Blacklist"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
})
BlacklistDialog.displayName = "BlacklistDialog"

// ─── Toggle Active Dialog ─────────────────────────────────────────────────────

interface ToggleActiveDialogProps {
    isOpen: boolean
    onClose: () => void
    item: ContentBlacklistItem | null
    onSuccess: () => void
}

const ToggleActiveDialog = React.memo(({
    isOpen,
    onClose,
    item,
    onSuccess,
}: ToggleActiveDialogProps) => {
    const queryClient = useQueryClient()
    const toggleMutation = useMutation({
        mutationFn: async () => {
            if (!item) return
            return crawlerApi.updateBlacklist(item.id, {
                isActive: !item.isActive,
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["crawler", "blacklist"] })
            toast.success(item?.isActive ? "Đã tắt mục blacklist" : "Đã bật mục blacklist")
            onSuccess()
        },
        onError: (err: Error) => toast.error(err.message || "Lỗi khi cập nhật trạng thái"),
    })

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[420px]">
                <DialogHeader>
                    <DialogTitle>Xác nhận thay đổi trạng thái</DialogTitle>
                    <DialogDescription>
                        {item?.isActive
                            ? `Bạn có chắc muốn TẮT mục "${item?.value}"? Nội dung từ domain/từ khóa này sẽ không còn bị chặn.`
                            : `Bạn có chắc muốn BẬT lại mục "${item?.value}"?`}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Hủy</Button>
                    <Button
                        variant={item?.isActive ? "destructive" : "default"}
                        onClick={() => toggleMutation.mutate()}
                        disabled={toggleMutation.isPending}
                    >
                        {toggleMutation.isPending && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {item?.isActive ? "Tắt ngay" : "Bật lại"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
})
ToggleActiveDialog.displayName = "ToggleActiveDialog"

// ─── Delete Confirmation Dialog ───────────────────────────────────────────────

interface DeleteDialogProps {
    isOpen: boolean
    onClose: () => void
    item: ContentBlacklistItem | null
    onSuccess: () => void
}

const DeleteDialog = React.memo(({
    isOpen,
    onClose,
    item,
    onSuccess,
}: DeleteDialogProps) => {
    const queryClient = useQueryClient()
    const deleteMutation = useMutation({
        mutationFn: async () => {
            if (!item) return
            return crawlerApi.deleteBlacklist(item.id)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["crawler", "blacklist"] })
            toast.success("Đã xóa mục blacklist")
            onSuccess()
        },
        onError: (err: Error) => toast.error(err.message || "Lỗi khi xóa mục blacklist"),
    })

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[420px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-destructive">
                        <Trash2 className="h-5 w-5" />
                        Xác nhận xóa
                    </DialogTitle>
                    <DialogDescription>
                        Bạn có chắc muốn xóa mục{" "}
                        <strong>{item?.value}</strong>{" "}
                        khỏi blacklist? Hành động này không thể hoàn tác.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Hủy</Button>
                    <Button
                        variant="destructive"
                        onClick={() => deleteMutation.mutate()}
                        disabled={deleteMutation.isPending}
                    >
                        {deleteMutation.isPending && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Xóa vĩnh viễn
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
})
DeleteDialog.displayName = "DeleteDialog"

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function BlacklistPage() {
    const queryClient = useQueryClient()
    const [activeTab, setActiveTab] = React.useState<FilterTab>("all")
    const [searchQuery, setSearchQuery] = React.useState("")
    const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false)
    const [editingItem, setEditingItem] = React.useState<ContentBlacklistItem | null>(null)
    const [deletingItem, setDeletingItem] = React.useState<ContentBlacklistItem | null>(null)
    const [togglingItem, setTogglingItem] = React.useState<ContentBlacklistItem | null>(null)

    const typeParam = activeTab === "all" ? undefined : activeTab

    const { data: items = [], isLoading } = useQuery({
        queryKey: ["crawler", "blacklist", typeParam],
        queryFn: () => crawlerApi.getBlacklist(typeParam),
    })

    // Client-side search filter
    const filteredItems = React.useMemo(() => {
        if (!searchQuery.trim()) return items
        const q = searchQuery.toLowerCase()
        return items.filter(
            (item) =>
                item.value.toLowerCase().includes(q) ||
                item.reason?.toLowerCase().includes(q) ||
                item.type.toLowerCase().includes(q),
        )
    }, [items, searchQuery])

    const tabs: { value: FilterTab; label: string; count: number }[] = [
        { value: "all", label: "Tất cả", count: items.length },
        { value: "domain", label: "Domain", count: items.filter((i) => i.type === "domain").length },
        { value: "keyword", label: "Từ khóa", count: items.filter((i) => i.type === "keyword").length },
        { value: "pattern", label: "Pattern", count: items.filter((i) => i.type === "pattern").length },
    ]

    const handleAdd = () => {
        setEditingItem(null)
        setIsAddDialogOpen(true)
    }

    const handleEdit = (item: ContentBlacklistItem) => {
        setEditingItem(item)
        setIsAddDialogOpen(true)
    }

    const handleCloseAddDialog = () => {
        setIsAddDialogOpen(false)
        setEditingItem(null)
    }

    const isExpired = (item: ContentBlacklistItem) =>
        item.expiresAt ? new Date(item.expiresAt) < new Date() : false

    return (
        <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto">
            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-primary uppercase mb-2">
                        Blacklist Nội dung
                    </h1>
                    <p className="text-muted-foreground">
                        Quản lý danh sách domain, từ khóa và pattern bị chặn khi cào bài viết.
                    </p>
                </div>
                <Button
                    onClick={handleAdd}
                    className="h-11 px-6 shadow-md transition-all hover:scale-[1.02] bg-red-600 hover:bg-red-700"
                >
                    <ShieldAlert className="mr-2 h-5 w-5 text-white" />
                    Thêm mục Blacklist
                </Button>
            </div>

            {/* ── Filters ── */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                {/* Tabs */}
                <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
                    {tabs.map((tab) => (
                        <button
                            key={tab.value}
                            onClick={() => setActiveTab(tab.value)}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                                activeTab === tab.value
                                    ? "bg-white dark:bg-zinc-800 shadow-sm text-foreground"
                                    : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            {tab.label}
                            <span className={`ml-1.5 text-xs ${
                                activeTab === tab.value
                                    ? "font-bold"
                                    : "font-normal"
                            }`}>
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Tìm kiếm..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 bg-white dark:bg-zinc-950"
                    />
                </div>
            </div>

            {/* ── Table ── */}
            <Card className="shadow-sm">
                <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                            <ShieldAlert className="h-5 w-5 text-red-500" />
                            Danh sách Blacklist
                        </CardTitle>
                        <Badge variant="secondary" className="font-normal">
                            {filteredItems.length} / {items.length} mục
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-4 py-8">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="h-14 w-full bg-muted animate-pulse rounded-md" />
                            ))}
                        </div>
                    ) : filteredItems.length === 0 ? (
                        <div className="h-48 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-xl gap-4 bg-muted/5">
                            <ShieldAlert className="h-12 w-12 opacity-20" />
                            <p>
                                {searchQuery
                                    ? "Không tìm thấy kết quả phù hợp."
                                    : activeTab === "all"
                                        ? "Chưa có mục nào trong blacklist."
                                        : `Chưa có mục nào thuộc loại "${tabs.find((t) => t.value === activeTab)?.label}".`}
                            </p>
                            {!searchQuery && activeTab === "all" && (
                                <Button variant="outline" onClick={handleAdd}>
                                    Thêm mục đầu tiên
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="border rounded-md overflow-hidden">
                            <Table>
                                <TableHeader className="bg-muted/50">
                                    <TableRow>
                                        <TableHead className="w-[130px] font-bold">Loại</TableHead>
                                        <TableHead className="font-bold">Giá trị</TableHead>
                                        <TableHead className="font-bold">Lý do</TableHead>
                                        <TableHead className="w-[100px] font-bold">Trạng thái</TableHead>
                                        <TableHead className="w-[150px] font-bold">Hạn chặn</TableHead>
                                        <TableHead className="w-[160px] font-bold text-right">Thao tác</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredItems.map((item) => {
                                        const config = TYPE_CONFIG[item.type as BlacklistType] ?? TYPE_CONFIG.domain
                                        const expired = isExpired(item)
                                        return (
                                            <TableRow
                                                key={item.id}
                                                className={`hover:bg-muted/30 transition-colors ${!item.isActive || expired ? "opacity-55" : ""}`}
                                            >
                                                <TableCell>
                                                    <Badge
                                                        variant="outline"
                                                        className={`flex items-center gap-1.5 font-medium ${config.color}`}
                                                    >
                                                        {config.icon}
                                                        {config.label}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="font-mono text-sm font-semibold break-all">
                                                        {item.value}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-sm text-muted-foreground line-clamp-2">
                                                        {item.reason || <span className="italic opacity-50">Không có</span>}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col gap-1">
                                                        {expired ? (
                                                            <Badge variant="secondary" className="bg-gray-100 text-gray-500 border-gray-200 text-xs">
                                                                Đã hết hạn
                                                            </Badge>
                                                        ) : item.isActive ? (
                                                            <Badge className="bg-red-50 text-red-700 border-red-200 text-xs">
                                                                Đang chặn
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="secondary" className="text-xs">
                                                                Tắt
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-xs text-muted-foreground">
                                                        {item.expiresAt
                                                            ? format(new Date(item.expiresAt), "dd/MM/yyyy HH:mm", { locale: vi })
                                                            : "Vĩnh viễn"}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-1">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-8 px-3 text-xs flex items-center gap-1 font-bold"
                                                            onClick={() => setTogglingItem(item)}
                                                            title={item.isActive ? "Tắt chặn" : "Bật lại"}
                                                        >
                                                            {item.isActive ? "Tắt" : "Bật"}
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                            onClick={() => handleEdit(item)}
                                                            title="Sửa"
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="14"
                                                                height="14"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            >
                                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                            </svg>
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-destructive hover:bg-red-50"
                                                            onClick={() => setDeletingItem(item)}
                                                            title="Xóa"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* ── Info Cards ── */}
            <div className="grid md:grid-cols-3 gap-6 pb-10">
                <Card className="bg-purple-50 border-purple-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold flex items-center gap-2 text-purple-800">
                            <Globe className="h-4 w-4" />
                            Domain — Chặn tên miền
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-purple-700 space-y-1">
                        <p>Kiểm tra hostname của URL đang cào. VD: nhập <code>spam-site.com</code> sẽ chặn mọi trang con của domain đó.</p>
                    </CardContent>
                </Card>

                <Card className="bg-amber-50 border-amber-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold flex items-center gap-2 text-amber-800">
                            <Key className="h-4 w-4" />
                            Từ khóa — Chặn nội dung
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-amber-700 space-y-1">
                        <p>Kiểm tra nội dung HTML đã cào. VD: nhập <code>casino</code> sẽ chặn bài viết chứa từ này trong body text.</p>
                    </CardContent>
                </Card>

                <Card className="bg-emerald-50 border-emerald-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold flex items-center gap-2 text-emerald-800">
                            <Regex className="h-4 w-4" />
                            Pattern — Chặn Regex
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-emerald-700 space-y-1">
                        <p>Kiểm tra nội dung HTML bằng biểu thức chính quy. VD: <code>click here to continue</code> chặn các trang lừa đảo.</p>
                    </CardContent>
                </Card>
            </div>

            {/* ── Dialogs ── */}
            <BlacklistDialog
                isOpen={isAddDialogOpen}
                onClose={handleCloseAddDialog}
                editingItem={editingItem}
                onSuccess={handleCloseAddDialog}
            />

            <ToggleActiveDialog
                isOpen={!!togglingItem}
                onClose={() => setTogglingItem(null)}
                item={togglingItem}
                onSuccess={() => setTogglingItem(null)}
            />

            <DeleteDialog
                isOpen={!!deletingItem}
                onClose={() => setDeletingItem(null)}
                item={deletingItem}
                onSuccess={() => setDeletingItem(null)}
            />
        </div>
    )
}
