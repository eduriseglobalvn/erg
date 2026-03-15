"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import { Textarea } from "@/components/admin/ui/textarea";
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter
} from "@/components/admin/ui/card";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/admin/ui/select";
import { Checkbox } from "@/components/admin/ui/checkbox";
import { CourseTheming } from "./course-theme-customizer";
import { KeywordSuggestionPanel } from "@/components/seo/keyword-suggestion-panel";
import { KeywordTagInput } from "@/components/seo/keyword-tag-input";

interface CourseFormProps {
    initialData?: any;
    isEdit?: boolean;
}

export function CourseForm({ initialData, isEdit = false }: CourseFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState(initialData || {
        title: "",
        slug: "",
        description: "",
        level: "Beginner",
        price: 0,
        subdomain: "tinhocquocte",
        status: "Draft",
        isFeatured: false,
        focusKeyword: "",
        keywords: [] as string[]
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: name === 'price' ? Number(value) : value }));

        if (name === 'title' && !isEdit) {
            // Auto generate slug
            const slug = value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
            setFormData((prev: any) => ({ ...prev, slug }));
        }
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (name: string, checked: boolean) => {
        setFormData((prev: any) => ({ ...prev, [name]: checked }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.slug) {
            toast.error("Vui lòng nhập đầy đủ Tiêu đề và Slug!");
            return;
        }

        try {
            setLoading(true);
            // Giả lập API call
            await new Promise(resolve => setTimeout(resolve, 800));

            toast.success(isEdit ? "Cập nhật khóa học thành công!" : "Tạo khóa học thành công!");
            router.push("/admin/courses");
        } catch (error: any) {
            toast.error(error?.message || "Đã xảy ra lỗi khi lưu khóa học.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Thông tin cơ bản</CardTitle>
                            <CardDescription>Tiêu đề, mô tả và cấp độ của khóa học</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="title">Tên khóa học *</Label>
                                <Input
                                    id="title" name="title"
                                    placeholder="VD: Lập trình React cơ bản"
                                    value={formData.title} onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="slug">Slug (Đường dẫn) *</Label>
                                <Input
                                    id="slug" name="slug"
                                    value={formData.slug} onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description">Mô tả khóa học</Label>
                                <Textarea
                                    id="description" name="description" rows={5}
                                    placeholder="Viết một đoạn ngắn giới thiệu khóa học..."
                                    value={formData.description} onChange={handleInputChange}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="price">Giá bán (VNĐ)</Label>
                                    <Input
                                        id="price" name="price" type="number" min={0}
                                        value={formData.price} onChange={handleInputChange}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="level">Trình độ</Label>
                                    <Select
                                        value={formData.level}
                                        onValueChange={(val) => handleSelectChange('level', val)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn trình độ" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Beginner">Cơ bản</SelectItem>
                                            <SelectItem value="Intermediate">Trung cấp</SelectItem>
                                            <SelectItem value="Advanced">Nâng cao</SelectItem>
                                            <SelectItem value="All Levels">Mọi cấp độ</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>SEO & Hiển thị</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="subdomain">Subdomain (Phân hệ)</Label>
                                <Select
                                    value={formData.subdomain}
                                    onValueChange={(val) => handleSelectChange('subdomain', val)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn Subdomain" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="tinhocquocte">Tin học quốc tế</SelectItem>
                                        <SelectItem value="ngoainguerg">Ngoại ngữ ERG</SelectItem>
                                        <SelectItem value="it">Lập trình IT</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center space-x-2 pt-2">
                                <Checkbox
                                    id="isFeatured"
                                    checked={formData.isFeatured}
                                    onCheckedChange={(checked: boolean) => handleCheckboxChange('isFeatured', checked)}
                                />
                                <Label htmlFor="isFeatured" className="cursor-pointer">
                                    Nổi bật (Hiển thị đầu trang)
                                </Label>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Từ khóa SEO</CardTitle>
                            <CardDescription>Tối ưu hóa khả năng tìm kiếm cho khóa học</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="focusKeyword">Từ khóa chính (Focus Keyword)</Label>
                                <Input
                                    id="focusKeyword" name="focusKeyword"
                                    placeholder="VD: mos excel 2021"
                                    value={formData.focusKeyword}
                                    onChange={handleInputChange}
                                />
                                <p className="text-sm text-foreground/60">Từ khóa mục tiêu mà học viên thường xuyên tìm kiếm nhất.</p>
                            </div>

                            {/* Keyword Suggestion Engine */}
                            <KeywordSuggestionPanel
                                focusKeyword={formData.focusKeyword}
                                category={formData.subdomain}
                                type="course"
                                onAddKeywords={(newKeywords) => {
                                    const merged = Array.from(new Set([...formData.keywords, ...newKeywords]));
                                    setFormData((prev: any) => ({ ...prev, keywords: merged }));
                                    toast.success(`Đã thêm ${newKeywords.length} từ khóa từ hệ thống gợi ý.`);
                                }}
                            />

                            <div className="grid gap-2 border-t pt-4 mt-2">
                                <Label>Từ khóa đã chọn</Label>
                                <KeywordTagInput
                                    value={formData.keywords}
                                    onChange={(newKeywords) => setFormData((prev: any) => ({ ...prev, keywords: newKeywords }))}
                                    placeholder="Nhập thủ công thẻ từ khóa (ấn Enter)..."
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <CourseTheming />
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Xuất bản</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="status">Trạng thái khóa học</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(val) => handleSelectChange('status', val)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Trạng thái" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Draft">Bản nháp</SelectItem>
                                        <SelectItem value="Published">Xuất bản</SelectItem>
                                        <SelectItem value="Archived">Lưu trữ</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-muted/50 border-t p-4 flex justify-between">
                            <Button type="submit" disabled={loading} className="w-full gap-2">
                                {loading ? "Đang lưu..." : (
                                    <>
                                        <Save className="h-4 w-4" />
                                        {isEdit ? "Cập nhật" : "Tạo khóa học"}
                                    </>
                                )}
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Ảnh đại diện (Thumbnail)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 transition-colors">
                                <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                                    <ImageIcon className="h-6 w-6" />
                                </div>
                                <p className="text-sm font-medium">Nhấn để tải ảnh lên</p>
                                <p className="text-xs text-muted-foreground mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
    );
}
