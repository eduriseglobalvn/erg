"use client";

import { useState } from "react";
import { Check, Palette, Eye } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/admin/ui/card";
import { Label } from "@/components/admin/ui/label";
import { Badge } from "@/components/admin/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/admin/ui/select";
import { Button } from "@/components/admin/ui/button";
import { Switch } from "@/components/admin/ui/switch";
import { Input } from "@/components/admin/ui/input";
import { coursesApi } from "@/services/courses.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const PRESET_THEMES = [
    { id: "blue", name: "Tech Blue", primary: "#2563eb", secondary: "#1d4ed8", bg: "#eff6ff", text: "#0f172a", emoji: "💙" },
    { id: "purple", name: "Creative", primary: "#9333ea", secondary: "#7e22ce", bg: "#faf5ff", text: "#1e1b4b", emoji: "💜" },
    { id: "green", name: "Nature", primary: "#16a34a", secondary: "#15803d", bg: "#f0fdf4", text: "#064e3b", emoji: "💚" },
    { id: "orange", name: "Warm", primary: "#f97316", secondary: "#ea580c", bg: "#fff7ed", text: "#431407", emoji: "🧡" },
    { id: "professional", name: "Professional", primary: "#0f172a", secondary: "#020617", bg: "#f8fafc", text: "#020617", emoji: "⬛" },
    { id: "pink", name: "Playful Pink", primary: "#db2777", secondary: "#be185d", bg: "#fdf2f8", text: "#831843", emoji: "💗" },
    { id: "custom", name: "Tùy chỉnh", primary: "#3b82f6", secondary: "#1e40af", bg: "#ffffff", text: "#1e293b", emoji: "🎨" },
];

interface CourseThemeSectionProps {
    courseId: string;
    initialData?: any;
}

export function CourseThemeSection({ courseId, initialData }: CourseThemeSectionProps) {
    const [selectedPreset, setSelectedPreset] = useState(PRESET_THEMES[0]);
    const [customColors, setCustomColors] = useState({
        primary: "#2563eb",
        secondary: "#1d4ed8",
        bg: "#eff6ff",
    });
    const [cardStyle, setCardStyle] = useState("default");
    const [headerStyle, setHeaderStyle] = useState("banner");
    const [badgeText, setBadgeText] = useState("Bestseller");

    const isCustom = selectedPreset.id === "custom";

    // Active colors applied to preview
    const activeColors = isCustom
        ? { primary: customColors.primary, secondary: customColors.secondary, bg: customColors.bg, text: "#1e293b" }
        : { primary: selectedPreset.primary, secondary: selectedPreset.secondary, bg: selectedPreset.bg, text: selectedPreset.text };

    const handleSelectPreset = (preset: typeof PRESET_THEMES[0]) => {
        setSelectedPreset(preset);
    };

    const queryClient = useQueryClient();

    const updateThemeMutation = useMutation({
        mutationFn: async (themeData: any) => {
            return coursesApi.updateTheme(courseId, themeData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['course', courseId] });
            toast.success("Đã lưu cài đặt giao diện!");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Lỗi khi lưu giao diện");
        }
    });

    const handleSave = () => {
        const themeToSave = {
            presetId: selectedPreset.id,
            customColors: isCustom ? customColors : undefined,
            cardStyle,
            headerStyle,
            badgeText
        };
        updateThemeMutation.mutate(themeToSave);
    };

    const getCardClasses = () => {
        switch (cardStyle) {
            case "gradient": return "bg-gradient-to-br border-0 shadow-lg text-white";
            case "bordered": return "bg-white border-2 hover:shadow-md";
            case "elevated": return "bg-white border-none shadow-xl hover:shadow-2xl";
            case "minimal": return "bg-transparent border-none shadow-none";
            default: return "bg-white border shadow-sm hover:shadow-md"; // default
        }
    };

    return (
        <Card className="mt-6 border-blue-100 overflow-hidden">
            <div className="bg-blue-50/50 p-4 border-b border-blue-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Palette className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold text-lg text-blue-900">Giao diện (Theming & Appearance)</h3>
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        size="sm"
                        onClick={handleSave}
                        disabled={updateThemeMutation.isPending}
                    >
                        {updateThemeMutation.isPending ? "Đang lưu..." : "Lưu thay đổi"}
                    </Button>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 lg:divide-x">
                {/* Control Panel */}
                <div className="p-6 space-y-6">
                    <div className="space-y-3">
                        <Label className="text-base">Mẫu giao diện (Presets)</Label>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                            {PRESET_THEMES.map(preset => (
                                <button
                                    key={preset.id}
                                    type="button"
                                    onClick={() => handleSelectPreset(preset)}
                                    className={`flex flex-col items-center justify-center p-3 rounded-md border-2 transition-all relative ${selectedPreset.id === preset.id
                                        ? "border-primary bg-primary/5"
                                        : "border-border hover:border-primary/50 hover:bg-muted"
                                        }`}
                                >
                                    <span className="text-2xl mb-1">{preset.emoji}</span>
                                    <span className="text-xs font-medium text-center leading-tight">{preset.name}</span>
                                    {selectedPreset.id === preset.id && (
                                        <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-0.5">
                                            <Check className="h-3 w-3" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {isCustom && (
                        <div className="space-y-4 p-4 rounded-lg bg-muted/30 border border-muted-foreground/20 animate-in fade-in zoom-in-95 duration-200">
                            <Label className="flex items-center text-sm font-semibold mb-2">
                                <SettingsIcon className="w-4 h-4 mr-2" />
                                Tùy chỉnh màu sắc CSS Variables
                            </Label>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-xs text-muted-foreground">Màu chính (Primary)</Label>
                                    <div className="flex gap-2">
                                        <input
                                            type="color"
                                            value={customColors.primary}
                                            onChange={e => setCustomColors(prev => ({ ...prev, primary: e.target.value }))}
                                            className="h-8 w-12 cursor-pointer border rounded bg-white p-0.5"
                                        />
                                        <Input value={customColors.primary} readOnly className="h-8 font-mono text-xs" />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs text-muted-foreground">Màu phụ (Secondary)</Label>
                                    <div className="flex gap-2">
                                        <input
                                            type="color"
                                            value={customColors.secondary}
                                            onChange={e => setCustomColors(prev => ({ ...prev, secondary: e.target.value }))}
                                            className="h-8 w-12 cursor-pointer border rounded bg-white p-0.5"
                                        />
                                        <Input value={customColors.secondary} readOnly className="h-8 font-mono text-xs" />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs text-muted-foreground">Màu nền Card (Bg)</Label>
                                    <div className="flex gap-2">
                                        <input
                                            type="color"
                                            value={customColors.bg}
                                            onChange={e => setCustomColors(prev => ({ ...prev, bg: e.target.value }))}
                                            className="h-8 w-12 cursor-pointer border rounded bg-white p-0.5"
                                        />
                                        <Input value={customColors.bg} readOnly className="h-8 font-mono text-xs" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="space-y-4 pt-4 border-t">
                        <Label className="text-base">Kiểu dáng Layout</Label>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs">Kiểu Card (Card Style)</Label>
                                <Select value={cardStyle} onValueChange={setCardStyle}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="default">Mặc định (Viền mảnh)</SelectItem>
                                        <SelectItem value="gradient">Gradient Nổi Bật</SelectItem>
                                        <SelectItem value="bordered">Viền Đậm (Bordered)</SelectItem>
                                        <SelectItem value="elevated">Nổi 3D (Elevated)</SelectItem>
                                        <SelectItem value="minimal">Tối Giản (Minimal)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs">Hiệu ứng Header</Label>
                                <Select value={headerStyle} onValueChange={setHeaderStyle}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="banner">Banner chuẩn</SelectItem>
                                        <SelectItem value="overlay">Chữ đè lên ảnh (Overlay)</SelectItem>
                                        <SelectItem value="split">Chia đôi (Split)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2 max-w-[200px]">
                            <Label className="text-xs">Badge Khóa Học</Label>
                            <Select value={badgeText} onValueChange={setBadgeText}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Bestseller">Bestseller 🔥</SelectItem>
                                    <SelectItem value="New">Mới ra mắt 🆕</SelectItem>
                                    <SelectItem value="Hot">Hot Sale ⚡</SelectItem>
                                    <SelectItem value="Advanced">Nâng cao 🚀</SelectItem>
                                    <SelectItem value="none">Không hiển thị</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Live Preview Panel */}
                <div className="p-6 bg-slate-50 flex flex-col items-center">
                    <div className="w-full flex justify-between items-center mb-6">
                        <Label className="flex items-center text-sm font-semibold text-slate-500 uppercase tracking-wide">
                            <Eye className="w-4 h-4 mr-2" /> Live Preview
                        </Label>
                        <div className="bg-white text-xs border rounded-full px-3 py-1 text-muted-foreground shadow-sm">
                            View: Card Layout
                        </div>
                    </div>

                    {/* THEMED COMPONENT PREVIEW (As User Sees It) */}
                    <div
                        className="w-full max-w-[320px] rounded-xl overflow-hidden transition-all duration-300"
                        style={{
                            backgroundColor: cardStyle === 'gradient' ? activeColors.primary : activeColors.bg,
                            backgroundImage: cardStyle === 'gradient' ? `linear-gradient(to bottom right, ${activeColors.primary}, ${activeColors.secondary})` : 'none',
                            borderColor: cardStyle === 'bordered' ? activeColors.primary : '#e2e8f0',
                            color: cardStyle === 'gradient' ? 'white' : activeColors.text,
                        }}
                    >
                        <div className={`relative ${getCardClasses()} transition-all duration-300 h-full flex flex-col`}>
                            {/* Thumbnail area */}
                            <div className="relative aspect-video w-full overflow-hidden bg-slate-200">
                                {headerStyle === 'split' ? (
                                    <div className="absolute inset-0 flex">
                                        <div className="w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('https://placehold.co/300x170/e2e8f0/1e293b?text=Course')" }} />
                                        <div className="w-1/2 p-4 flex flex-col justify-center text-white" style={{ backgroundColor: activeColors.primary }}>
                                            <div className="text-xs opacity-80 mb-1">MOS Excel</div>
                                            <div className="font-bold text-sm leading-tight line-clamp-2">Excel Thực Chiến 2021</div>
                                        </div>
                                    </div>
                                ) : (
                                    <img src="https://placehold.co/300x170/e2e8f0/1e293b?text=Course+Thumbnail" alt="Preview" className="w-full h-full object-cover" />
                                )}

                                {/* Overlay Style text */}
                                {headerStyle === 'overlay' && (
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-4">
                                        <h4 className="text-white font-bold leading-tight line-clamp-2">MOS Excel 2021 Advanced Thực Chiến</h4>
                                    </div>
                                )}

                                {/* Badge */}
                                {badgeText !== 'none' && (
                                    <div className="absolute top-2 right-2">
                                        <Badge style={{ backgroundColor: '#ef4444', color: 'white', border: 'none' }} className="shadow-md">
                                            {badgeText}
                                        </Badge>
                                    </div>
                                )}
                            </div>

                            {/* Content area */}
                            <div className={`p-4 flex flex-col flex-1 ${headerStyle === 'overlay' ? 'pt-2' : ''}`}>
                                <div className="text-xs font-medium mb-1 opacity-70" style={{ color: cardStyle === 'gradient' ? 'white' : activeColors.primary }}>
                                    THÔNG QUA BỞI ERG
                                </div>

                                {headerStyle !== 'overlay' && headerStyle !== 'split' && (
                                    <h4 className="font-bold text-lg mb-2 line-clamp-2 leading-tight">
                                        MOS Excel 2021 Advanced Thực Chiến
                                    </h4>
                                )}

                                <div className="flex items-center gap-1 text-sm mt-auto pb-3 pt-2 opacity-80 border-b border-current/10">
                                    <span className="text-amber-500">★</span>
                                    <span className="font-medium">4.8</span>
                                    <span className="opacity-70">(156)</span>
                                    <span className="mx-1">•</span>
                                    <span>12 bài học</span>
                                </div>

                                <div className="flex items-center justify-between pt-3">
                                    <div className="font-bold text-base">
                                        1,500,000đ
                                    </div>
                                    <Button size="sm" style={{
                                        backgroundColor: cardStyle === 'gradient' ? 'white' : activeColors.primary,
                                        color: cardStyle === 'gradient' ? activeColors.primary : 'white'
                                    }} className="hover:opacity-90">
                                        Xem ngay
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 text-center text-xs text-slate-400 max-w-xs">
                        * Preview này mô phỏng giao diện public user sẽ thấy khi truy cập khóa học. Các CSS settings sẽ được lưu trực tiếp vào JSON meta data của course.
                    </div>
                </div>
            </div>
        </Card>
    );
}

// Icon helper
function SettingsIcon(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
    )
}
