"use client"

import * as React from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/cms/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/cms/ui/form"
import { Input } from "@/components/cms/ui/input"
import { Button } from "@/components/cms/ui/button"
import { Textarea } from "@/components/cms/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/cms/ui/select"
import { Plus, Upload, FileType, ShieldCheck } from "lucide-react"
import { PUBLIC_DISCLOSURE_SECTIONS } from "@/constants/public-disclosure"
import { publicDisclosureApi } from "@/services/public-disclosure.api"
import { toast } from "sonner"
import { Separator } from "@/components/cms/ui/separator"
import { Slider } from "@/components/cms/ui/slider"

const formSchema = z.object({
    sectionSlug: z.string().min(1, "Vui lòng chọn danh mục"),
    title: z.string().min(1, "Vui lòng nhập tiêu đề"),
    menuLabel: z.string().min(1, "Vui lòng nhập nhãn menu"),
    referenceCode: z.string().min(1, "Vui lòng nhập số hiệu văn bản"),
    issuingAuthority: z.string().min(1, "Vui lòng nhập cơ quan ban hành"),
    publishedAt: z.string().min(1, "Vui lòng chọn ngày ban hành"),
    effectiveDate: z.string().min(1, "Vui lòng chọn ngày hiệu lực"),
    schoolYear: z.string().min(1, "Vui lòng nhập năm học"),
    shortDescription: z.string().min(1, "Vui lòng nhập mô tả ngắn"),
    description: z.string(),
    // Watermark settings
    wmText: z.string(),
    wmPosition: z.string(),
    wmOpacity: z.number(),
    wmFontSize: z.number(),
})

type FormValues = z.infer<typeof formSchema>

export function DisclosureUploadDialog() {
    const [open, setOpen] = React.useState(false)
    const [file, setFile] = React.useState<File | null>(null)
    const queryClient = useQueryClient()

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            sectionSlug: "",
            title: "",
            menuLabel: "",
            referenceCode: "",
            issuingAuthority: "Phòng Tài chính - Vận hành",
            publishedAt: new Date().toISOString().split('T')[0],
            effectiveDate: new Date().toISOString().split('T')[0],
            schoolYear: "2025 - 2026",
            shortDescription: "",
            description: "",
            wmText: "ERG.EDU.VN",
            wmPosition: "TILED",
            wmOpacity: 0.15,
            wmFontSize: 32,
        },
    })

    const mutation = useMutation({
        mutationFn: (formData: FormData) => publicDisclosureApi.create(formData),
        onSuccess: () => {
            toast.success("Đã tải lên hồ sơ công khai thành công")
            setOpen(false)
            form.reset()
            setFile(null)
            queryClient.invalidateQueries({ queryKey: ['public-disclosure'] })
        },
        onError: (err: any) => toast.error(`Lỗi: ${err.message}`)
    })

    const onSubmit: SubmitHandler<FormValues> = async (values) => {
        if (!file) {
            toast.error("Vui lòng chọn file PDF")
            return
        }

        const formData = new FormData()
        formData.append("file", file)
        
        // Wrap metadata in a "data" JSON field for the backend controller
        const metadata = {
            section_slug: values.sectionSlug,
            slug: values.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
            title: values.title,
            menu_label: values.menuLabel,
            short_description: values.shortDescription,
            description: values.description,
            published_at: values.publishedAt,
            effective_date: values.effectiveDate,
            reference_code: values.referenceCode,
            issuing_authority: values.issuingAuthority,
            review_cycle: "Định kỳ hàng năm",
            access_scope: "Công khai trên cổng thông tin chính thức",
            hero_kicker: "Văn bản công khai",
            highlights: [values.shortDescription],
            cover: {
                eyebrow: "VĂN BẢN CÔNG KHAI",
                issued_by: values.issuingAuthority,
                title: values.title,
                subtitle: values.shortDescription,
                footer: "Ban hành nội bộ để công khai trên cổng thông tin ERG",
            },
            school_year: values.schoolYear,
        }
        formData.append("data", JSON.stringify(metadata))

        // Watermark config
        const wmConfig = {
            text: values.wmText,
            position: values.wmPosition,
            opacity: values.wmOpacity,
            color: "#888888",
            font_size: values.wmFontSize,
            per_page: true,
        }
        formData.append("watermark", JSON.stringify(wmConfig))

        mutation.mutate(formData)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md">
                    <Plus className="mr-2 h-4 w-4" /> Import Hồ Sơ Mới
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        <FileType className="h-6 w-6 text-blue-600" />
                        Import Hồ Sơ Công Khai
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h3 className="font-semibold text-lg flex items-center gap-2 text-indigo-700">
                                    <span className="bg-indigo-100 p-1 rounded">01</span> Thông tin cơ bản
                                </h3>
                                <FormField
                                    name="sectionSlug"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Danh mục công khai</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Chọn danh mục..." />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {PUBLIC_DISCLOSURE_SECTIONS.map(s => (
                                                        <SelectItem key={s.slug} value={s.slug}>{s.label}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tiêu đề văn bản</FormLabel>
                                            <FormControl>
                                                <Input placeholder="VD: Chứng nhận hoạt động chi nhánh..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        name="referenceCode"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Số hiệu văn bản</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="VD: ERG/PL-01/2026" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        name="schoolYear"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Năm học</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="2025 - 2026" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    name="shortDescription"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Mô tả ngắn</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Tóm tắt nội dung bản công khai..." className="h-20" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-semibold text-lg flex items-center gap-2 text-blue-700">
                                    <span className="bg-blue-100 p-1 rounded">02</span> File & Watermark
                                </h3>
                                
                                <div className="space-y-2">
                                    <FormLabel>File văn bản (PDF)</FormLabel>
                                    <div 
                                        className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer ${file ? 'border-green-400 bg-green-50' : 'border-muted hover:border-blue-400 hover:bg-blue-50/50'}`}
                                        onClick={() => document.getElementById('file-upload')?.click()}
                                    >
                                        <Upload className={`h-8 w-8 ${file ? 'text-green-500' : 'text-muted-foreground'}`} />
                                        <span className="text-sm font-medium">
                                            {file ? file.name : "Kéo thả hoặc click để chọn file"}
                                        </span>
                                        <span className="text-xs text-muted-foreground italic">Dung lượng tối đa 50MB</span>
                                        <input 
                                            id="file-upload"
                                            type="file" 
                                            accept=".pdf" 
                                            className="hidden" 
                                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                                        />
                                    </div>
                                </div>

                                <div className="bg-slate-50 p-4 rounded-xl border space-y-4">
                                    <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                        <ShieldCheck className="h-4 w-4 text-green-600" /> Cấu hình Watermark Bảo mật
                                    </div>
                                    <FormField
                                        name="wmText"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs">Nội dung Watermark</FormLabel>
                                                <FormControl>
                                                    <Input className="h-8 text-xs" {...field} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            name="wmPosition"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs">Vị trí</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className="h-8 text-xs">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="CENTER">Trung tâm</SelectItem>
                                                            <SelectItem value="CORNER">Góc dưới</SelectItem>
                                                            <SelectItem value="TILED">Lặp lại (Tiled)</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            name="wmFontSize"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs">Cỡ chữ: {field.value}px</FormLabel>
                                                    <FormControl>
                                                        <Slider 
                                                            min={12} 
                                                            max={72} 
                                                            step={1} 
                                                            value={[field.value]} 
                                                            onValueChange={(v) => field.onChange(v[0])}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <FormField
                                        name="wmOpacity"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs">Độ mờ (Opacity): {Math.round(field.value * 100)}%</FormLabel>
                                                <FormControl>
                                                    <Slider 
                                                        min={0.05} 
                                                        max={0.5} 
                                                        step={0.01} 
                                                        value={[field.value]} 
                                                        onValueChange={(v) => field.onChange(v[0])}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

                        <Separator />

                        <div className="flex justify-end gap-3">
                            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Hủy</Button>
                            <Button 
                                type="submit" 
                                className="min-w-[150px] bg-blue-600 hover:bg-blue-700"
                                disabled={mutation.isPending}
                            >
                                {mutation.isPending ? "Đang xử lý..." : "Bắt đầu Upload"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
