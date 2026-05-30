import Link from "next/link";
import { Search, Filter, BookOpen, Clock, Star } from "lucide-react";
import { Button } from "@/components/cms/ui/button"; // Note: reusing admin ui components for now
import { Input } from "@/components/cms/ui/input";
import { Card, CardContent, CardFooter } from "@/components/cms/ui/card";
import { Badge } from "@/components/cms/ui/badge";
import { Metadata } from "next";
import { generateFullMetadata } from "@/utils/seo/seo-metadata";
import { headers } from "next/headers";

const mockPublicCourses = [
    {
        id: "c1",
        slug: "mos-excel-2021-advanced",
        title: "MOS Excel 2021 Advanced",
        thumbnail: null,
        stats: { lessons: 12, duration: "24", students: 156, rating: 4.8, reviews: 45 },
        price: 1500000,
        level: "Intermediate",
        category: "MOS",
        theme: { primary: "#2563EB", secondary: "#1E40AF", badge: "Bestseller", badgeColor: "#EF4444" }
    },
    {
        id: "c2",
        slug: "mos-word-2021-expert",
        title: "MOS Word 2021 Expert",
        thumbnail: null,
        stats: { lessons: 10, duration: "20", students: 89, rating: 4.6, reviews: 20 },
        price: 1200000,
        level: "Advanced",
        category: "MOS",
        theme: { primary: "#9333EA", secondary: "#6B21A8", badge: "Hot", badgeColor: "#F59E0B" }
    },
    {
        id: "c3",
        slug: "ic3-gs6-level-1",
        title: "Tin học cơ bản IC3 GS6 Level 1",
        thumbnail: null,
        stats: { lessons: 15, duration: "30", students: 200, rating: 4.9, reviews: 102 },
        price: 2000000,
        level: "Beginner",
        category: "IC3",
        theme: { primary: "#16A34A", secondary: "#15803D", badge: "Mới nhất", badgeColor: "#0EA5E9" }
    }
];

export async function generateMetadata(): Promise<Metadata> {
    const headerList = await headers();
    const host = headerList.get('host') || 'tinhocquocte.erg.edu.vn';

    return generateFullMetadata({
        title: "Khóa Học Tin Học Quốc Tế | MOS & IC3 GS6",
        description: "Khám phá các chương trình đào tạo chứng chỉ quốc tế MOS, IC3 giúp nâng cao năng lực và thăng tiến trong sự nghiệp tại ERG.",
        keywords: ["tin học quốc tế", "MOS", "IC3 GS6", "chứng chỉ tin học", "luyện thi MOS"],
        path: '/khoa-hoc',
        host,
    });
}

export default function PublicCoursesPage() {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    return (
        <div className="bg-slate-50 min-h-screen">
            {/* Header Banner */}
            <div className="bg-blue-900 text-white py-16 px-4 md:px-8">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Khóa Học Tin Học Quốc Tế</h1>
                    <p className="text-blue-100 text-lg md:text-xl max-w-2xl mb-8">
                        Khám phá các chương trình đào tạo chứng chỉ quốc tế MOS, IC3 giúp nâng cao năng lực và thăng tiến trong sự nghiệp.
                    </p>
                    <div className="flex bg-white rounded-lg p-2 max-w-2xl shadow-lg">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                            <Input
                                placeholder="Tìm khóa học bạn quan tâm..."
                                className="pl-10 border-0 focus-visible:ring-0 text-slate-800 text-base h-12"
                            />
                        </div>
                        <Button className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-base">Tìm kiếm</Button>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto py-12 px-4 md:px-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <h2 className="text-2xl font-bold text-slate-800">Khám phá {mockPublicCourses.length} khóa học</h2>
                    <div className="flex gap-3">
                        <Button variant="outline" className="bg-white"><Filter className="mr-2 h-4 w-4" /> Cấp độ (Level)</Button>
                        <Button variant="outline" className="bg-white"><Filter className="mr-2 h-4 w-4" /> Danh mục (Category)</Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {mockPublicCourses.map(course => (
                        <Link href={`/khoa-hoc/${course.slug}`} key={course.id} className="group">
                            <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 border-slate-200 hover:-translate-y-1 bg-white">
                                {/* Themed Header */}
                                <div
                                    className="h-48 relative flex items-center justify-center overflow-hidden"
                                    style={{ background: `linear-gradient(135deg, ${course.theme.primary}, ${course.theme.secondary})` }}
                                >
                                    {course.theme.badge && (
                                        <Badge
                                            className="absolute top-4 right-4 text-white border-0 shadow-sm px-3 py-1 font-semibold text-xs rounded-full"
                                            style={{ backgroundColor: course.theme.badgeColor }}
                                        >
                                            {course.theme.badge}
                                        </Badge>
                                    )}
                                    {/* Sub-badge for Category */}
                                    <Badge className="absolute bottom-4 left-4 bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm">
                                        {course.category}
                                    </Badge>
                                </div>

                                <CardContent className="p-6">
                                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-3 font-medium">
                                        <span className="flex items-center text-amber-500"><Star className="h-4 w-4 mr-1 fill-current" /> {course.stats.rating}</span>
                                        <span>({course.stats.reviews})</span>
                                        <span>•</span>
                                        <span>{course.level}</span>
                                    </div>
                                    <h3 className="font-bold text-xl mb-3 line-clamp-2 text-slate-800 group-hover:text-blue-600 transition-colors">
                                        {course.title}
                                    </h3>
                                    <div className="flex items-center gap-4 text-sm text-slate-600 mb-6">
                                        <span className="flex items-center"><BookOpen className="h-4 w-4 mr-1.5 opacity-70" /> {course.stats.lessons} bài</span>
                                        <span className="flex items-center"><Clock className="h-4 w-4 mr-1.5 opacity-70" /> {course.stats.duration} giờ</span>
                                    </div>
                                </CardContent>
                                <CardFooter className="p-6 pt-0 flex items-center justify-between border-t border-slate-100 mt-auto">
                                    <div className="font-bold text-xl text-blue-700">
                                        {formatCurrency(course.price)}
                                    </div>
                                    <Button variant="ghost" className="text-blue-600 font-semibold hover:bg-blue-50">
                                        Chi tiết →
                                    </Button>
                                </CardFooter>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}