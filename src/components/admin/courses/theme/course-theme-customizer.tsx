"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/admin/ui/card";
import { Label } from "@/components/admin/ui/label";
import { Input } from "@/components/admin/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/admin/ui/select";
import { Button } from "@/components/admin/ui/button";

interface ThemeConfig {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    cardStyle: "flat" | "shadow" | "border";
    headerStyle: "simple" | "colorful" | "gradient";
}

interface CustomizerProps {
    theme: ThemeConfig;
    onChange: (theme: ThemeConfig) => void;
    onSave: () => void;
    isSaving: boolean;
}

export function CourseThemeCustomizer({ theme, onChange, onSave, isSaving }: CustomizerProps) {
    const handleColorChange = (key: keyof ThemeConfig, val: string) => {
        onChange({ ...theme, [key]: val });
    };

    const handleSelectChange = (key: keyof ThemeConfig, val: string) => {
        onChange({ ...theme, [key]: val });
    };

    return (
        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle>Tùy chỉnh Giao diện</CardTitle>
                <CardDescription>Cấu hình màu sắc, font chữ và kiểu hiển thị.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Màu chính (Primary Color)</Label>
                        <div className="flex gap-2 items-center">
                            <Input
                                type="color"
                                value={theme.primaryColor}
                                onChange={(e) => handleColorChange("primaryColor", e.target.value)}
                                className="w-12 h-10 p-1 cursor-pointer"
                            />
                            <Input
                                type="text"
                                value={theme.primaryColor}
                                onChange={(e) => handleColorChange("primaryColor", e.target.value)}
                                className="font-mono text-sm uppercase"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Màu phụ (Secondary Color)</Label>
                        <div className="flex gap-2 items-center">
                            <Input
                                type="color"
                                value={theme.secondaryColor}
                                onChange={(e) => handleColorChange("secondaryColor", e.target.value)}
                                className="w-12 h-10 p-1 cursor-pointer"
                            />
                            <Input
                                type="text"
                                value={theme.secondaryColor}
                                onChange={(e) => handleColorChange("secondaryColor", e.target.value)}
                                className="font-mono text-sm uppercase"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Font chữ (Font Family)</Label>
                    <Select value={theme.fontFamily} onValueChange={(val) => handleSelectChange("fontFamily", val)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Chọn font chữ" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Inter, sans-serif">Inter (Modern)</SelectItem>
                            <SelectItem value="Roboto, sans-serif">Roboto (Classic)</SelectItem>
                            <SelectItem value="Outfit, sans-serif">Outfit (Playful)</SelectItem>
                            <SelectItem value="'Merriweather', serif">Merriweather (Serif)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>Kiểu thẻ khóa học (Card Style)</Label>
                    <Select value={theme.cardStyle} onValueChange={(val) => handleSelectChange("cardStyle", val)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Chọn kiểu hiển thị" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="flat">Phẳng (Flat + Gray border)</SelectItem>
                            <SelectItem value="shadow">Đổ bóng (Soft Shadow)</SelectItem>
                            <SelectItem value="border">Đường viền màu (Colored Border)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>Kiểu Header (Trang chi tiết)</Label>
                    <Select value={theme.headerStyle} onValueChange={(val) => handleSelectChange("headerStyle", val)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Chọn kiểu Header" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="simple">Đơn giản (Trắng)</SelectItem>
                            <SelectItem value="colorful">Nền màu Primary</SelectItem>
                            <SelectItem value="gradient">Gradient (Primary - Secondary)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="pt-4 border-t">
                    <Button onClick={onSave} disabled={isSaving} className="w-full">
                        {isSaving ? "Đang lưu..." : "Lưu Cấu hình Giao diện"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
