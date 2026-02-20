"use client"

import * as React from "react"
import { useSeoRedirects, useCreateSeoRedirect, useDeleteSeoRedirect, useUpdateSeoRedirect } from "@/hooks/use-seo"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/admin/ui/table"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/admin/ui/card"
import { Button } from "@/components/admin/ui/button"
import { Input } from "@/components/admin/ui/input"
import { Badge } from "@/components/admin/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/admin/ui/dialog"
import { Label } from "@/components/admin/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/admin/ui/select"
import { Plus, Trash2, Shield, Loader2, ArrowRight } from "lucide-react"
import { toast } from "sonner"

export function SeoRedirectsManager() {
    const { data: redirects, isLoading } = useSeoRedirects()
    const createMutation = useCreateSeoRedirect()
    const deleteMutation = useDeleteSeoRedirect()

    const [isAddOpen, setIsAddOpen] = React.useState(false)
    const [newRedirect, setNewRedirect] = React.useState({
        fromUrl: "",
        toUrl: "",
        type: 301 as 301 | 302,
        isActive: true
    })

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newRedirect.fromUrl || !newRedirect.toUrl) {
            toast.error("Vui lòng nhập đầy đủ URL")
            return
        }

        try {
            await createMutation.mutateAsync(newRedirect)
            toast.success("Đã tạo quy tắc chuyển hướng")
            setIsAddOpen(false)
            setNewRedirect({ fromUrl: "", toUrl: "", type: 301, isActive: true })
        } catch (error) {
            toast.error("Lỗi khi tạo redirect")
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Bạn có chắc chắn muốn xóa quy tắc này?")) return
        try {
            await deleteMutation.mutateAsync(id)
            toast.success("Đã xóa quy tắc")
        } catch (error) {
            toast.error("Lỗi khi xóa")
        }
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Redirects Management</CardTitle>
                    <CardDescription>Quản lý các đường dẫn chuyển hướng 301/302 để bảo vệ SEO</CardDescription>
                </div>
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">
                            <Plus className="w-4 h-4 mr-2" />
                            Tạo Redirect
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <form onSubmit={handleAdd}>
                            <DialogHeader>
                                <DialogTitle>Thêm quy tắc chuyển hướng</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="from">URL cũ (Nguồn)</Label>
                                    <Input
                                        id="from"
                                        placeholder="/bai-viet-cu-loi-thoi"
                                        value={newRedirect.fromUrl}
                                        onChange={e => setNewRedirect({ ...newRedirect, fromUrl: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="to">URL mới (Đích)</Label>
                                    <Input
                                        id="to"
                                        placeholder="/bai-viet-moi-cap-nhat"
                                        value={newRedirect.toUrl}
                                        onChange={e => setNewRedirect({ ...newRedirect, toUrl: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="type">Loại chuyển hướng</Label>
                                    <Select
                                        value={newRedirect.type.toString()}
                                        onValueChange={v => setNewRedirect({ ...newRedirect, type: parseInt(v) as 301 | 302 })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="301">301 (Vĩnh viễn - Truyền điểm SEO)</SelectItem>
                                            <SelectItem value="302">302 (Tạm thời)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={createMutation.isPending}>
                                    {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                    Tạo quy tắc
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>URL Nguồn</TableHead>
                            <TableHead></TableHead>
                            <TableHead>URL Đích</TableHead>
                            <TableHead className="text-center">Loại</TableHead>
                            <TableHead className="text-right">Thao tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><div className="h-4 w-[150px] bg-muted animate-pulse rounded" /></TableCell>
                                    <TableCell><div className="h-4 w-4 bg-muted animate-pulse rounded" /></TableCell>
                                    <TableCell><div className="h-4 w-[150px] bg-muted animate-pulse rounded" /></TableCell>
                                    <TableCell><div className="h-4 w-[40px] bg-muted animate-pulse mx-auto rounded" /></TableCell>
                                    <TableCell><div className="h-4 w-[40px] bg-muted animate-pulse ml-auto rounded" /></TableCell>
                                </TableRow>
                            ))
                        ) : redirects?.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium truncate max-w-[250px]">{item.fromUrl}</TableCell>
                                <TableCell><ArrowRight className="w-4 h-4 text-muted-foreground" /></TableCell>
                                <TableCell className="text-blue-600 truncate max-w-[250px]">{item.toUrl}</TableCell>
                                <TableCell className="text-center">
                                    <Badge variant={item.type === 301 ? "default" : "outline"}>
                                        {item.type}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-red-500"
                                        onClick={() => handleDelete(item.id)}
                                        disabled={deleteMutation.isPending}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {redirects?.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                                    Chưa có quy tắc chuyển hướng nào được thiết lập.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
