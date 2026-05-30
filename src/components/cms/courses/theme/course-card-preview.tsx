"use client";

import { Star, Clock, BookOpen, Users } from "lucide-react";

interface ThemeConfig {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    cardStyle: "flat" | "shadow" | "border";
    headerStyle: "simple" | "colorful" | "gradient";
}

interface CourseCardPreviewProps {
    theme: ThemeConfig;
    courseData: any;
}

export function CourseCardPreview({ theme, courseData }: CourseCardPreviewProps) {
    // Dynamic styles based on theme
    const cardShadow = theme.cardStyle === "shadow" ? "shadow-lg shadow-black/5" : "shadow-none";
    const cardBorder = theme.cardStyle === "border" ? `2px solid ${theme.primaryColor}` : "1px solid #e2e8f0";
    const titleColor = theme.cardStyle === "border" ? theme.primaryColor : "#1e293b";

    return (
        <div
            className="rounded-xl overflow-hidden bg-white transition-all duration-300 w-full max-w-[320px] mx-auto group cursor-pointer"
            style={{
                fontFamily: theme.fontFamily,
                boxShadow: cardShadow,
                border: cardBorder
            }}
        >
            {/* Thumbnail */}
            <div className="aspect-video bg-slate-100 relative overflow-hidden">
                <div
                    className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity"
                    style={{ backgroundColor: theme.primaryColor }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                    <span className="text-sm font-medium">Card Thumbnail</span>
                </div>
                {/* Badge level */}
                <div className="absolute top-2 left-2 px-2 py-1 bg-white/90 backdrop-blur-sm rounded text-xs font-semibold shadow-sm text-slate-700">
                    {courseData.level}
                </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
                <h3
                    className="font-bold text-lg leading-tight line-clamp-2 transition-colors group-hover:opacity-80"
                    style={{ color: titleColor }}
                >
                    {courseData.title}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-2">
                    {courseData.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-y-2 gap-x-1 text-xs text-slate-500 py-3 border-y border-slate-100">
                    <div className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" style={{ color: theme.secondaryColor }} />
                        <span>{courseData.stats.lessons} bài học</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" style={{ color: theme.secondaryColor }} />
                        <span>{courseData.stats.duration} giờ</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5" style={{ color: theme.secondaryColor }} />
                        <span>{courseData.stats.students} học viên</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-medium text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{courseData.stats.rating} Đánh giá</span>
                    </div>
                </div>

                {/* Price and Action */}
                <div className="flex items-center justify-between pt-1">
                    <span
                        className="font-extrabold text-lg"
                        style={{ color: theme.primaryColor }}
                    >
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(courseData.price)}
                    </span>
                </div>
            </div>
        </div>
    );
}

// ----------------

interface CourseDetailPreviewProps {
    theme: ThemeConfig;
    courseData: any;
}

export function CourseDetailPreview({ theme, courseData }: CourseDetailPreviewProps) {
    let headerBg = "#ffffff";
    let headerText = "#1e293b";

    if (theme.headerStyle === "colorful") {
        headerBg = theme.primaryColor;
        headerText = "#ffffff";
    } else if (theme.headerStyle === "gradient") {
        headerBg = `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`;
        headerText = "#ffffff";
    }

    return (
        <div
            className="rounded-xl overflow-hidden bg-slate-50 border border-slate-200 w-full h-full min-h-[400px] flex flex-col relative"
            style={{ fontFamily: theme.fontFamily }}
        >
            {/* MOCK BROWSER NAVBAR */}
            <div className="h-8 bg-slate-200 border-b flex items-center px-4 gap-2">
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 max-w-[200px] h-4 bg-white/50 rounded-full mx-auto" />
            </div>

            {/* DETAIL HEADER */}
            <div
                className="p-6 md:p-8 relative shrink-0"
                style={{ background: headerBg, color: headerText }}
            >
                {theme.headerStyle !== "simple" && (
                    <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
                )}
                <div className="relative z-10 max-w-2xl">
                    <div className="flex flex-wrap gap-2 mb-3">
                        <span className="px-2.5 py-1 bg-white/20 backdrop-blur text-xs font-semibold rounded text-current border border-white/30">
                            {courseData.level}
                        </span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold mb-2">
                        {courseData.title}
                    </h1>
                    <p className="text-sm opacity-90 mb-4 max-w-lg line-clamp-2">
                        {courseData.description}
                    </p>

                    <button
                        className="px-6 py-2 rounded-full font-bold text-sm shadow-md transition-transform hover:scale-105"
                        style={{
                            backgroundColor: theme.headerStyle === 'simple' ? theme.primaryColor : '#ffffff',
                            color: theme.headerStyle === 'simple' ? '#ffffff' : theme.primaryColor
                        }}
                    >
                        Đăng ký Học ngay
                    </button>
                </div>
            </div>

            {/* FAKE CONTENT AREA */}
            <div className="flex-1 p-6 md:p-8 flex gap-6">
                <div className="flex-1 space-y-4">
                    <div className="h-6 w-1/3 bg-slate-200 rounded animate-pulse" />
                    <div className="space-y-2">
                        <div className="h-4 w-full bg-slate-200 rounded animate-pulse" />
                        <div className="h-4 w-5/6 bg-slate-200 rounded animate-pulse" />
                        <div className="h-4 w-4/6 bg-slate-200 rounded animate-pulse" />
                    </div>
                </div>
                <div className="hidden md:block w-48 shrink-0">
                    <div className="h-32 bg-slate-200 rounded-lg animate-pulse" />
                </div>
            </div>
        </div>
    );
}
