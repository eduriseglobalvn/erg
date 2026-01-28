"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/admin/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/admin/ui/form"
import { Input } from "@/components/admin/ui/input"
import { Button } from "@/components/admin/ui/button"
import { Textarea } from "@/components/admin/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/admin/ui/select"
import { postsApi, Category } from "@/services/posts.api"
import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
    CheckCircle2,
    Newspaper,
    FileText,
    Layout,
    MessageSquare,
    Brain,
    Cpu,
    Code,
    Music,
    Palmtree,
    Plane,
    Heart,
    Award,
    Trophy,
    DollarSign,
    PieChart,
    LineChart,
    Utensils,
    Coffee,
    ShoppingBag,
    Camera,
    Film,
    Gamepad2,
    Mic,
    Speaker,
    Smartphone,
    Laptop,
    Monitor,
    Shield,
    Lock,
    Bell,
    Calendar,
    Cloud,
    Waves,
    Leaf,
    Flame,
    Droplet,
    Sun,
    Moon,
    Star,
    Zap,
    Tags,
    Image as ImageIcon,
    Library,
    GraduationCap,
    BookOpen,
    Lightbulb,
    Building2,
    Bot,
    Globe
} from "lucide-react"

const categorySchema = z.object({
    name: z.string().min(2, "Tên chuyên mục phải có ít nhất 2 ký tự"),
    slug: z.string().min(2, "Slug phải có ít nhất 2 ký tự"),
    description: z.string().optional(),
    icon: z.string().optional(),
})

type CategoryFormValues = z.infer<typeof categorySchema>

const ICON_OPTIONS = [
    // --- Chung ---
    { label: "Mặc định (Library)", value: "Library", icon: Library },
    { label: "Tin tức (Newspaper)", value: "Newspaper", icon: Newspaper },
    { label: "Tài liệu (FileText)", value: "FileText", icon: FileText },
    { label: "Bố cục (Layout)", value: "Layout", icon: Layout },
    { label: "Hình ảnh (Image)", value: "Image", icon: ImageIcon },
    { label: "Thẻ (Tags)", value: "Tags", icon: Tags },
    { label: "Lịch (Calendar)", value: "Calendar", icon: Calendar },
    { label: "Thông báo (Bell)", value: "Bell", icon: Bell },

    // --- Giáo dục & Công việc ---
    { label: "Giáo dục (GraduationCap)", value: "GraduationCap", icon: GraduationCap },
    { label: "Học tập (BookOpen)", value: "BookOpen", icon: BookOpen },
    { label: "Sáng tạo (Lightbulb)", value: "Lightbulb", icon: Lightbulb },
    { label: "Kinh doanh (Building2)", value: "Building2", icon: Building2 },
    { label: "Tiền tệ (DollarSign)", value: "DollarSign", icon: DollarSign },
    { label: "Biểu đồ tròn (PieChart)", value: "PieChart", icon: PieChart },
    { label: "Biểu đồ đường (LineChart)", value: "LineChart", icon: LineChart },

    // --- Công nghệ & AI ---
    { label: "Công nghệ (Zap)", value: "Zap", icon: Zap },
    { label: "Trí tuệ nhân tạo (Bot)", value: "Bot", icon: Bot },
    { label: "Bộ não (Brain)", value: "Brain", icon: Brain },
    { label: "Vi xử lý (Cpu)", value: "Cpu", icon: Cpu },
    { label: "Lập trình (Code)", value: "Code", icon: Code },
    { label: "Điện thoại (Smartphone)", value: "Smartphone", icon: Smartphone },
    { label: "Máy tính xách tay (Laptop)", value: "Laptop", icon: Laptop },
    { label: "Màn hình (Monitor)", value: "Monitor", icon: Monitor },

    // --- Giải trí & Đời sống ---
    { label: "Giải trí (Gamepad2)", value: "Gamepad2", icon: Gamepad2 },
    { label: "Âm nhạc (Music)", value: "Music", icon: Music },
    { label: "Phim ảnh (Film)", value: "Film", icon: Film },
    { label: "Chụp ảnh (Camera)", value: "Camera", icon: Camera },
    { label: "Ẩm thực (Utensils)", value: "Utensils", icon: Utensils },
    { label: "Cà phê (Coffee)", value: "Coffee", icon: Coffee },
    { label: "Mua sắm (ShoppingBag)", value: "ShoppingBag", icon: ShoppingBag },
    { label: "Micrô (Mic)", value: "Mic", icon: Mic },
    { label: "Loa (Speaker)", value: "Speaker", icon: Speaker },

    // --- Du lịch & Thiên nhiên ---
    { label: "Du lịch (Plane)", value: "Plane", icon: Plane },
    { label: "Khám phá (Globe)", value: "Globe", icon: Globe },
    { label: "Nghỉ dưỡng (Palmtree)", value: "Palmtree", icon: Palmtree },
    { label: "Môi trường (Leaf)", value: "Leaf", icon: Leaf },
    { label: "Thời tiết (Sun)", value: "Sun", icon: Sun },
    { label: "Ban đêm (Moon)", value: "Moon", icon: Moon },
    { label: "Sóng biển (Waves)", value: "Waves", icon: Waves },
    { label: "Mây (Cloud)", value: "Cloud", icon: Cloud },

    // --- Biểu tượng & Khác ---
    { label: "Yêu thích (Heart)", value: "Heart", icon: Heart },
    { label: "Ngôi sao (Star)", value: "Star", icon: Star },
    { label: "Giải thưởng (Award)", value: "Award", icon: Award },
    { label: "Cúp (Trophy)", value: "Trophy", icon: Trophy },
    { label: "Bảo mật (Shield)", value: "Shield", icon: Shield },
    { label: "Khóa (Lock)", value: "Lock", icon: Lock },
    { label: "Lửa (Flame)", value: "Flame", icon: Flame },
    { label: "Nước (Droplet)", value: "Droplet", icon: Droplet },
]

interface CategoryDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    category?: Category | null
}

export function CategoryDialog({ open, onOpenChange, category }: CategoryDialogProps) {
    const queryClient = useQueryClient()
    const isEdit = !!category

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: "",
            slug: "",
            description: "",
            icon: "Library",
        },
    })

    // Reset form when category changes
    React.useEffect(() => {
        if (category) {
            form.reset({
                name: category.name,
                slug: category.slug,
                description: category.description || "",
                icon: category.icon || "Library",
            })
        } else {
            form.reset({
                name: "",
                slug: "",
                description: "",
                icon: "Library",
            })
        }
    }, [category, form, open])

    const mutation = useMutation({
        mutationFn: async (values: CategoryFormValues) => {
            if (isEdit && category) {
                return postsApi.updateCategory(category.id, values as any)
            }
            return postsApi.createCategory(values as any)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] })
            toast.success(isEdit ? "Cập nhật chuyên mục thành công" : "Thêm chuyên mục mới thành công")
            onOpenChange(false)
        },
        onError: (error: any) => {
            toast.error(error.message || "Đã có lỗi xảy ra")
        }
    })

    const onSubmit = (values: CategoryFormValues) => {
        mutation.mutate(values)
    }

    // Auto generate slug from name
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value
        form.setValue("name", name)
        if (!isEdit) {
            const slug = name
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[^\w\s-]/g, "")
                .replace(/[\s_-]+/g, "-")
                .replace(/^-+|-+$/g, "")
            form.setValue("slug", slug)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Chỉnh sửa chuyên mục" : "Thêm chuyên mục mới"}</DialogTitle>
                    <DialogDescription>
                        Điền thông tin chi tiết cho chuyên mục bài viết của bạn.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tên chuyên mục</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Ví dụ: Tin giáo dục"
                                            {...field}
                                            onChange={handleNameChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="slug"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Slug (Đường dẫn)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="ví-du-tin-giao-duc" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="icon"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Biểu tượng (Icon)</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn icon" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent
                                            position="popper"
                                            className="bg-white dark:bg-zinc-950 border border-border shadow-xl z-[100]"
                                            sideOffset={4}
                                        >
                                            {ICON_OPTIONS.map((opt) => (
                                                <SelectItem key={opt.value} value={opt.value}>
                                                    <div className="flex items-center gap-2 py-0.5">
                                                        <opt.icon className="h-4 w-4 text-primary" />
                                                        <span className="font-medium">{opt.label}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mô tả (Không bắt buộc)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Mô tả ngắn về chuyên mục này..."
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={mutation.isPending}
                            >
                                Hủy
                            </Button>
                            <Button type="submit" disabled={mutation.isPending}>
                                {mutation.isPending ? "Đang xử lý..." : isEdit ? "Lưu thay đổi" : "Thêm chuyên mục"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
