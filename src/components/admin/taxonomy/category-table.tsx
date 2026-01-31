"use client"

import * as React from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"
import {
    MoreHorizontal,
    Edit,
    Trash2,
    Library,
    GraduationCap,
    Lightbulb,
    Building2,
    Tags,
    Image as ImageIcon,
    Sparkles,
    Globe,
    Zap,
    BookOpen,
    Bot,
    PenSquare,
    CheckCircle2,
    Search,
    Plus
} from "lucide-react"

import { Button } from "@/components/admin/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/admin/ui/dropdown-menu"
import { Input } from "@/components/admin/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/admin/ui/table"
import { postsApi, Category } from "@/services/posts.api"
import { toast } from "sonner"
import { CategoryDialog } from "./category-dialog"

const categoryIcons: Record<string, React.ElementType> = {
    "GraduationCap": GraduationCap,
    "Lightbulb": Lightbulb,
    "Building2": Building2,
    "Library": Library,
    "Tags": Tags,
    "Image": ImageIcon,
    "Sparkles": Sparkles,
    "Globe": Globe,
    "Zap": Zap,
    "BookOpen": BookOpen,
    "Bot": Bot,
    "PenSquare": PenSquare,
    "CheckCircle2": CheckCircle2
}

export function CategoryTable() {
    const queryClient = useQueryClient()
    const [searchTerm, setSearchTerm] = React.useState("")
    const [isDialogOpen, setIsDialogOpen] = React.useState(false)
    const [selectedCategory, setSelectedCategory] = React.useState<Category | null>(null)

    const { data: categories = [], isLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: () => postsApi.getCategories()
    })

    const deleteMutation = useMutation({
        mutationFn: (id: string) => postsApi.deleteCategory(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] })
            toast.success("Xóa chuyên mục thành công")
        },
        onError: (error: any) => {
            toast.error(error.message || "Không thể xóa chuyên mục này")
        }
    })

    const handleEdit = (category: Category) => {
        setSelectedCategory(category)
        setIsDialogOpen(true)
    }

    const handleAdd = () => {
        setSelectedCategory(null)
        setIsDialogOpen(true)
    }

    const handleDelete = (id: string) => {
        if (confirm("Bạn có chắc chắn muốn xóa chuyên mục này?")) {
            deleteMutation.mutate(id)
        }
    }

    const filteredData = React.useMemo(() => {
        return categories.filter(cat =>
            cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cat.slug.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [categories, searchTerm])

    const columns: ColumnDef<Category>[] = [
        {
            accessorKey: "icon",
            header: "Icon",
            cell: ({ row }) => {
                const iconName = row.getValue("icon") as string
                const Icon = categoryIcons[iconName] || Library
                return (
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
                        <Icon className="h-5 w-5" />
                    </div>
                )
            },
        },
        {
            accessorKey: "name",
            header: "Tên chuyên mục",
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-bold text-foreground">{row.getValue("name")}</span>
                    <span className="text-xs text-muted-foreground font-mono">{row.original.slug}</span>
                </div>
            ),
        },
        {
            accessorKey: "description",
            header: "Mô tả",
            cell: ({ row }) => (
                <p className="text-sm text-muted-foreground line-clamp-1 max-w-[300px]">
                    {row.getValue("description") || "—"}
                </p>
            ),
        },
        {
            accessorKey: "createdAt",
            header: "Ngày tạo",
            cell: ({ row }) => (
                <div className="text-sm text-muted-foreground">
                    {new Date(row.getValue("createdAt")).toLocaleDateString("vi-VN")}
                </div>
            ),
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const category = row.original
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleEdit(category)}>
                                <Edit className="mr-2 h-4 w-4" /> Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleDelete(category.id)}
                            >
                                <Trash2 className="mr-2 h-4 w-4" /> Xóa chuyên mục
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]

    const table = useReactTable({
        data: filteredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <div className="w-full space-y-4">
            <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Tìm chuyên mục..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 h-10"
                    />
                </div>
                <Button onClick={handleAdd} className="bg-primary hover:bg-primary/90 shadow-sm h-10 px-4">
                    <Plus className="mr-2 h-4 w-4" /> Thêm chuyên mục
                </Button>
            </div>

            <div className="rounded-md border bg-card overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-muted/50">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="font-bold text-foreground/80 py-4 h-auto">
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Đang tải dữ liệu...
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="py-4">
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    Không tìm thấy chuyên mục nào.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <CategoryDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                category={selectedCategory}
            />
        </div>
    )
}
