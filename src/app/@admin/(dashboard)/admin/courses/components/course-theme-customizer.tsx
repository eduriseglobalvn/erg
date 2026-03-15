"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/admin/ui/card";
import { Label } from "@/components/admin/ui/label";
import { Input } from "@/components/admin/ui/input";
import { Switch } from "@/components/admin/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/admin/ui/select";
import { Badge } from "@/components/admin/ui/badge";

const PRESET_THEMES = [
    { id: 'blue', name: 'Tech Blue', primary: '#2563EB', secondary: '#1E40AF', bg: '#EFF6FF' },
    { id: 'purple', name: 'Creative Purple', primary: '#9333EA', secondary: '#6B21A8', bg: '#FAF5FF' },
    { id: 'green', name: 'Nature Green', primary: '#16A34A', secondary: '#15803D', bg: '#F0FDF4' },
    { id: 'orange', name: 'Warm Orange', primary: '#EA580C', secondary: '#C2410C', bg: '#FFF7ED' },
    { id: 'dark', name: 'Professional', primary: '#1F2937', secondary: '#111827', bg: '#F9FAFB' },
    { id: 'custom', name: 'Tùy chỉnh (Custom)', primary: '#2563EB', secondary: '#1E40AF', bg: '#FFFFFF' },
];

export function CourseTheming() {
    const [selectedThemeId, setSelectedThemeId] = useState('blue');
    const [customColors, setCustomColors] = useState({ primary: '#2563EB', secondary: '#1E40AF', bg: '#FFFFFF' });
    const [cardStyle, setCardStyle] = useState('gradient');
    const [badgeStyle, setBadgeStyle] = useState('Bestseller');
    const [badgeColor, setBadgeColor] = useState('#EF4444');

    const activeTheme = selectedThemeId === 'custom'
        ? { ...customColors, id: 'custom' }
        : PRESET_THEMES.find(t => t.id === selectedThemeId) || PRESET_THEMES[0];

    return (
        <Card className="mt-6 border-indigo-100 shadow-md">
            <CardHeader className="bg-indigo-50/50 border-b">
                <CardTitle className="text-indigo-800">Giao diện khóa học (Theming & Appearance)</CardTitle>
                <CardDescription>Tùy chỉnh màu sắc, thẻ hiển thị và xem trước trực tiếp.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* SETTINGS LEFT */}
                <div className="space-y-6">
                    <div>
                        <Label className="text-base font-semibold mb-3 block">Chọn Theme có sẵn</Label>
                        <div className="grid grid-cols-3 gap-3">
                            {PRESET_THEMES.map(theme => (
                                <div
                                    key={theme.id}
                                    onClick={() => setSelectedThemeId(theme.id)}
                                    className={`
                                        cursor-pointer rounded-md p-3 border-2 transition-all flex flex-col items-center gap-2
                                        ${selectedThemeId === theme.id ? 'border-primary ring-2 ring-primary/20 bg-slate-50' : 'border-slate-200 hover:border-slate-300'}
                                    `}
                                >
                                    <div className="w-8 h-8 rounded-full shadow-inner" style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }} />
                                    <span className="text-xs font-medium text-center">{theme.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {selectedThemeId === 'custom' && (
                        <div className="p-4 bg-slate-50 border rounded-lg space-y-4">
                            <h4 className="font-medium text-sm">Tuỳ chỉnh màu sắc</h4>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground">Màu chính</Label>
                                    <div className="flex items-center gap-2">
                                        <Input type="color" className="w-10 h-10 p-1 cursor-pointer" value={customColors.primary} onChange={e => setCustomColors(p => ({ ...p, primary: e.target.value }))} />
                                        <Input className="flex-1 text-xs" value={customColors.primary} onChange={e => setCustomColors(p => ({ ...p, primary: e.target.value }))} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground">Màu phụ</Label>
                                    <div className="flex items-center gap-2">
                                        <Input type="color" className="w-10 h-10 p-1 cursor-pointer" value={customColors.secondary} onChange={e => setCustomColors(p => ({ ...p, secondary: e.target.value }))} />
                                        <Input className="flex-1 text-xs" value={customColors.secondary} onChange={e => setCustomColors(p => ({ ...p, secondary: e.target.value }))} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground">Màu nền Card</Label>
                                    <div className="flex items-center gap-2">
                                        <Input type="color" className="w-10 h-10 p-1 cursor-pointer" value={customColors.bg} onChange={e => setCustomColors(p => ({ ...p, bg: e.target.value }))} />
                                        <Input className="flex-1 text-xs" value={customColors.bg} onChange={e => setCustomColors(p => ({ ...p, bg: e.target.value }))} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-6 pt-4 border-t">
                        <div className="space-y-3">
                            <Label>Kiểu Card hiển thị</Label>
                            <Select value={cardStyle} onValueChange={setCardStyle}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="gradient">Gradient Header</SelectItem>
                                    <SelectItem value="solid">Màu đặc (Solid)</SelectItem>
                                    <SelectItem value="outline">Đường viền</SelectItem>
                                    <SelectItem value="minimal">Tối giản (Minimal)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-3">
                            <Label>Huy hiệu (Badge)</Label>
                            <Select value={badgeStyle} onValueChange={setBadgeStyle}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Bestseller">Bestseller</SelectItem>
                                    <SelectItem value="Mới nhất">Mới nhất</SelectItem>
                                    <SelectItem value="Hot">Hot</SelectItem>
                                    <SelectItem value="none">Không hiển thị</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* LIVE PREVIEW RIGHT */}
                <div className="bg-slate-100 rounded-xl p-6 flex flex-col items-center justify-center border-2 border-dashed border-slate-300">
                    <Label className="mb-6 font-semibold text-slate-500 uppercase tracking-widest text-xs">Live Preview</Label>

                    {/* ThemedCourseCard inside preview */}
                    <div
                        className="w-full max-w-sm rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                        style={{ backgroundColor: activeTheme.bg }}
                    >
                        {/* Card Header (Thumbnail replacement) */}
                        <div
                            className="h-40 relative flex items-center justify-center"
                            style={cardStyle === 'gradient' ? {
                                background: `linear-gradient(135deg, ${activeTheme.primary}, ${activeTheme.secondary})`
                            } : cardStyle === 'solid' ? {
                                backgroundColor: activeTheme.primary
                            } : {
                                backgroundColor: '#f1f5f9',
                                borderBottom: `4px solid ${activeTheme.primary}`
                            }}
                        >
                            {badgeStyle !== 'none' && (
                                <Badge
                                    className="absolute top-3 right-3 text-white border-0 shadow-sm px-2 py-0.5"
                                    style={{ backgroundColor: badgeColor }}
                                >
                                    {badgeStyle}
                                </Badge>
                            )}
                            <div className="text-white/80 font-medium text-lg drop-shadow-md">
                                Thumbnail Preview
                            </div>
                        </div>

                        {/* Card Body */}
                        <div className="p-5">
                            <h3 className="font-bold text-xl mb-2 line-clamp-2 text-slate-800">Khóa học Lập trình Web Fullstack với Next.js</h3>

                            <div className="flex items-center gap-1.5 text-sm font-medium text-slate-600 mb-4">
                                <span className="text-amber-500">⭐ 4.8</span>
                                <span className="text-slate-400 font-normal">(124)</span>
                                <span className="mx-1">•</span>
                                <span>32 bài học</span>
                            </div>

                            <div className="flex items-center justify-between mt-6">
                                <div className="font-bold text-lg" style={{ color: activeTheme.primary }}>
                                    1,500,000 đ
                                </div>
                                <div
                                    className="text-sm font-medium px-4 py-2 rounded-lg cursor-pointer transition-opacity hover:opacity-90 shadow-sm"
                                    style={{ backgroundColor: activeTheme.primary, color: '#fff' }}
                                >
                                    Xem chi tiết
                                </div>
                            </div>
                        </div>
                    </div>

                    <p className="text-xs text-muted-foreground mt-8 text-center max-w-xs">
                        Giao diện này sẽ được áp dụng cho khóa học hiển thị trên trang chủ và subdomain.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
