"use client"

import * as React from "react"
import { useSeoKeywords, useCreateSeoKeyword, useDeleteSeoKeyword } from "@/hooks/use-seo"
import { Button } from "@/components/cms/ui/button"
import { Input } from "@/components/cms/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/cms/ui/table"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/cms/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/cms/ui/dialog"
import { Label } from "@/components/cms/ui/label"
import { Plus, Trash2, Link as LinkIcon, Loader2 } from "lucide-react"
import { toast } from "sonner"

export function KeywordManager() {
    const { data: keywords, isLoading } = useSeoKeywords()
    const createMutation = useCreateSeoKeyword()
    const deleteMutation = useDeleteSeoKeyword()

    const [isAddOpen, setIsAddOpen] = React.useState(false)
    const [newKeyword, setNewKeyword] = React.useState({
        keyword: "",
        targetUrl: "",
        linkLimit: 1
    })

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newKeyword.keyword || !newKeyword.targetUrl) {
            toast.error("Vui lòng nhập đầy đủ thông tin")
            return
        }

        try {
            await createMutation.mutateAsync(newKeyword)
            toast.success("Đã thêm từ khóa auto-link")
            setIsAddOpen(false)
            setNewKeyword({ keyword: "", targetUrl: "", linkLimit: 1 })
        } catch (error) {
            toast.error("Lỗi khi thêm từ khóa")
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Bạn có chắc chắn muốn xóa từ khóa này?")) return
        try {
            await deleteMutation.mutateAsync(id)
            toast.success("Đã xóa từ khóa")
        } catch (error) {
            toast.error("Lỗi khi xóa từ khóa")
        }
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                    <CardTitle>Auto-Linking Keywords</CardTitle>
                    <CardDescription>Quản lý các từ khóa sẽ tự động được gắn link trong bài viết</CardDescription>
                </div>
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="w-4 h-4 mr-2" />
                            Thêm từ khóa
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <form onSubmit={handleAdd}>
                            <DialogHeader>
                                <DialogTitle>Thêm từ khóa mới</DialogTitle>
                                <DialogDescription>
                                    Khi từ khóa này xuất hiện trong nội dung bài viết, nó sẽ tự động được gắn link.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="keyword">Từ khóa</Label>
                                    <Input
                                        id="keyword"
                                        placeholder="Ví dụ: Du học Úc"
                                        value={newKeyword.keyword}
                                        onChange={e => setNewKeyword({ ...newKeyword, keyword: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="url">Link đích</Label>
                                    <Input
                                        id="url"
                                        placeholder="https://erg.edu.vn/uc"
                                        value={newKeyword.targetUrl}
                                        onChange={e => setNewKeyword({ ...newKeyword, targetUrl: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="limit">Số link tối đa mỗi bài</Label>
                                    <Input
                                        id="limit"
                                        type="number"
                                        min={1}
                                        max={5}
                                        value={newKeyword.linkLimit}
                                        onChange={e => setNewKeyword({ ...newKeyword, linkLimit: parseInt(e.target.value) || 1 })}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={createMutation.isPending}>
                                    {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                    Lưu từ khóa
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
                            <TableHead>Từ khóa</TableHead>
                            <TableHead>Link đích</TableHead>
                            <TableHead className="w-[100px] text-center">Giới hạn</TableHead>
                            <TableHead className="w-[100px] text-right">Thao tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><div className="h-4 w-[120px] bg-muted animate-pulse rounded" /></TableCell>
                                    <TableCell><div className="h-4 w-[200px] bg-muted animate-pulse rounded" /></TableCell>
                                    <TableCell><div className="h-4 w-[40px] bg-muted animate-pulse mx-auto rounded" /></TableCell>
                                    <TableCell><div className="h-4 w-[40px] bg-muted animate-pulse ml-auto rounded" /></TableCell>
                                </TableRow>
                            ))
                        ) : keywords?.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-bold">{item.keyword}</TableCell>
                                <TableCell className="text-muted-foreground flex items-center gap-1.5">
                                    <LinkIcon className="w-3 h-3 text-blue-500" />
                                    <span className="truncate max-w-[300px]">{item.targetUrl}</span>
                                </TableCell>
                                <TableCell className="text-center">{item.linkLimit} link/bài</TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                        onClick={() => handleDelete(item.id)}
                                        disabled={deleteMutation.isPending}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {keywords?.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-10 text-muted-foreground italic">
                                    Chưa có từ khóa nào được cấu hình.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
