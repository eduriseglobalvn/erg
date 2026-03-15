"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, MonitorPlay, Smartphone } from "lucide-react";
import { toast } from "sonner";

import { CourseThemeCustomizer } from "@/components/admin/courses/theme/course-theme-customizer";
import { CourseCardPreview, CourseDetailPreview } from "@/components/admin/courses/theme/course-card-preview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/admin/ui/tabs";
import { Button } from "@/components/admin/ui/button";

interface ThemeConfig {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    cardStyle: "flat" | "shadow" | "border";
    headerStyle: "simple" | "colorful" | "gradient";
}

const DEFAULT_THEMES = [
    { id: 'default', name: 'Mặc định (Default)', primaryColor: '#2563eb', secondaryColor: '#4f46e5', fontFamily: 'Inter, sans-serif', cardStyle: 'shadow', headerStyle: 'simple' },
    { id: 'elegant', name: 'Sang trọng (Elegant)', primaryColor: '#0f172a', secondaryColor: '#334155', fontFamily: "'Merriweather', serif", cardStyle: 'border', headerStyle: 'gradient' },
    { id: 'vibrant', name: 'Nổi bật (Vibrant)', primaryColor: '#f97316', secondaryColor: '#fbbf24', fontFamily: 'Outfit, sans-serif', cardStyle: 'flat', headerStyle: 'colorful' },
    { id: 'nature', name: 'Tương lai (Nature)', primaryColor: '#059669', secondaryColor: '#10b981', fontFamily: 'Roboto, sans-serif', cardStyle: 'shadow', headerStyle: 'gradient' },
];

export default function CourseThemeConfigPage({ params }: { params: { id: string } }) {
    // Mock course data 
    const courseData = {
        title: "MOS Excel 2021 Advanced",
        description: "Khóa học luyện thi chứng chỉ tin học văn phòng quốc tế MOS Excel phiên bản 2021 ở cấp độ nâng cao (Expert). Cung cấp kiến thức từ A-Z.",
        level: "Nâng cao",
        price: 1500000,
        stats: { lessons: 12, duration: "24", students: 156, rating: 4.8 },
    };

    const [theme, setTheme] = useState<ThemeConfig>(DEFAULT_THEMES[0] as ThemeConfig);
    const [isSaving, setIsSaving] = useState(false);
    const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");

    const handleSaveTheme = () => {
        setIsSaving(true);
        // Simulate API
        setTimeout(() => {
            setIsSaving(false);
            toast.success("Đã cập nhật giao diện hiển thị cho khóa học!");
        }, 600);
    };

    const applyPresetTheme = (preset: typeof DEFAULT_THEMES[0]) => {
        setTheme({
            primaryColor: preset.primaryColor,
            secondaryColor: preset.secondaryColor,
            fontFamily: preset.fontFamily,
            cardStyle: preset.cardStyle as any,
            headerStyle: preset.headerStyle as any,
        });
        toast.info(`Đã áp dụng mẫu: ${preset.name}`);
    };

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 max-w-7xl mx-auto">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
                <Link href="/admin/courses" className="hover:text-primary flex items-center">
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Khóa học
                </Link>
                <span>/</span>
                <Link href={`/admin/courses/${params.id}`} className="hover:text-primary w-24 truncate">
                    {courseData.title}
                </Link>
                <span>/</span>
                <span className="text-foreground font-medium">Cấu hình Giao diện</span>
            </div>

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight border-l-4 border-primary pl-3 ml-[-16px]">
                        Theming & Live Preview
                    </h2>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Cá nhân hóa CSS variables, cấu hình màu sắc thương hiệu và xem trước kết quả trực tiếp ngay trên Subdomain.
                    </p>
                </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-6">
                {/* TRÁI: SELECTORS & CUSTOMIZER */}
                <div className="lg:col-span-5 space-y-6">
                    {/* Presets */}
                    <div className="space-y-3">
                        <label className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                            Mẫu giao diện (Presets)
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {DEFAULT_THEMES.map(preset => (
                                <button
                                    key={preset.id}
                                    onClick={() => applyPresetTheme(preset)}
                                    className="p-3 rounded-lg border text-left hover:border-primary hover:shadow-sm transition-all flex flex-col items-start gap-2 bg-white"
                                    style={{
                                        borderColor: theme.primaryColor === preset.primaryColor ? preset.primaryColor : undefined,
                                        boxShadow: theme.primaryColor === preset.primaryColor ? `0 0 0 1px ${preset.primaryColor}` : undefined
                                    }}
                                >
                                    <div className="flex items-center gap-1.5 w-full">
                                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.primaryColor }} />
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: preset.secondaryColor }} />
                                    </div>
                                    <span className="text-xs font-semibold">{preset.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <CourseThemeCustomizer
                        theme={theme}
                        onChange={setTheme}
                        onSave={handleSaveTheme}
                        isSaving={isSaving}
                    />
                </div>

                {/* PHẢI: LIVE PREVIEW */}
                <div className="lg:col-span-7 bg-slate-50/50 rounded-2xl border p-4 sm:p-6 lg:p-8 flex flex-col shadow-inner">
                    <div className="flex items-center justify-between mb-6 shrink-0">
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                            <MonitorPlay className="h-5 w-5 text-primary" />
                            Live Preview
                        </h3>
                        {/* Device Toggle */}
                        <div className="flex items-center bg-slate-200 rounded-md p-1">
                            <button
                                onClick={() => setPreviewMode('desktop')}
                                className={`p-1.5 rounded-sm transition-colors ${previewMode === 'desktop' ? 'bg-white shadow-sm text-primary' : 'text-slate-500 hover:text-slate-700'}`}
                                title="Desktop View"
                            >
                                <MonitorPlay className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setPreviewMode('mobile')}
                                className={`p-1.5 rounded-sm transition-colors ${previewMode === 'mobile' ? 'bg-white shadow-sm text-primary' : 'text-slate-500 hover:text-slate-700'}`}
                                title="Mobile View"
                            >
                                <Smartphone className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-center relative min-h-[500px]">
                        {/* Wrapper simulating device */}
                        <div className={`mx-auto transition-all duration-500 overflow-visible w-full flex flex-col relative ${previewMode === 'mobile' ? 'max-w-[375px]' : 'max-w-full'}`}>
                            {previewMode === 'mobile' && (
                                <div className="absolute -inset-4 border-[8px] border-slate-800 rounded-[3rem] pointer-events-none z-50">
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-xl" />
                                </div>
                            )}

                            <Tabs defaultValue="card" className="w-full relative z-10 flex flex-col h-full">
                                <TabsList className="mb-4 self-center bg-white/50 backdrop-blur shadow-sm border border-slate-200">
                                    <TabsTrigger value="card">Hiển thị thẻ (Card)</TabsTrigger>
                                    <TabsTrigger value="detail">Trang chi tiết (Detail)</TabsTrigger>
                                </TabsList>

                                <TabsContent value="card" className="flex-1 flex items-center justify-center p-4">
                                    <div className="animate-in fade-in zoom-in-95 duration-300 w-full flex justify-center">
                                        <CourseCardPreview theme={theme} courseData={courseData} />
                                    </div>
                                </TabsContent>

                                <TabsContent value="detail" className="flex-1">
                                    <div className="animate-in fade-in zoom-in-95 duration-300 h-full">
                                        <CourseDetailPreview theme={theme} courseData={courseData} />
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </div >
            </div >
        </div >
    );
}
