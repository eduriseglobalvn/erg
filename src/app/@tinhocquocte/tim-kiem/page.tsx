import Link from "next/link";
import { Search, BookOpen, Clock, Star } from "lucide-react";
import { Input } from "@/components/admin/ui/input";
import { Button } from "@/components/admin/ui/button";
import { Card, CardContent, CardFooter } from "@/components/admin/ui/card";
import { Breadcrumb } from "@/components/seo/breadcrumb";
import { SchemaScript } from "@/components/seo/schema-script";
import { Metadata } from "next";
import { createPageMetadata } from "@/utils/seo/page-metadata";

export async function generateMetadata({ searchParams }: { searchParams: { q?: string } }): Promise<Metadata> {
    const query = searchParams.q || "";
    const title = query ? `Kết quả tìm kiếm cho "${query}" | Tin Học Quốc Tế ERG` : `Tìm kiếm khóa học | Tin Học Quốc Tế ERG`;
    return createPageMetadata({
        title,
        description: `Tìm kiếm các khóa học tin học quốc tế MOS, IC3... phù hợp với nhu cầu của bạn.`,
        path: '/tim-kiem',
        imageAlt: 'International IT course search at ERG',
        robots: { index: false, follow: true },
    });
}

export default function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
    const query = searchParams.q || "";

    // Giả lập kết quả tìm kiếm
    const mockResults = query ? [
        {
            id: "c1",
            slug: "mos-excel-2021-advanced",
            title: "MOS Excel 2021 Advanced",
            stats: { lessons: 12, duration: "24", rating: 4.8 },
            price: 1500000,
            level: "Intermediate",
            category: "MOS",
            theme: { primary: "#2563EB", secondary: "#1E40AF" }
        }
    ] : [];

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    return (
        <div className="bg-slate-50 min-h-screen">
            <SchemaScript type="WebSite" domain="tinhocquocte.erg.edu.vn" data={{ name: "Tin Học Quốc Tế ERG", url: "https://tinhocquocte.erg.edu.vn" }} />

            <div className="bg-slate-900 text-white py-12 px-4 md:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-6">
                        <Breadcrumb
                            pathname={`/tim-kiem`}
                            pageTitle="Tìm kiếm"
                            domain="tinhocquocte.erg.edu.vn"
                            className="text-slate-400"
                            itemClassName="hover:text-white"
                            activeItemClassName="text-white"
                            separatorClassName="text-slate-500"
                        />
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold mb-8">
                        {query ? `Kết quả tìm kiếm cho: "${query}"` : "Tìm kiếm khóa học"}
                    </h1>

                    <form action="/tim-kiem" method="GET" className="flex bg-white rounded-lg p-2 max-w-2xl shadow-lg">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                            <Input
                                name="q"
                                defaultValue={query}
                                placeholder="Nhập từ khóa tìm kiếm..."
                                className="pl-10 border-0 focus-visible:ring-0 text-slate-800 text-base h-12"
                            />
                        </div>
                        <Button type="submit" className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-base">Tìm</Button>
                    </form>
                </div>
            </div>

            <div className="max-w-6xl mx-auto py-12 px-4 md:px-8">
                {query && (
                    <div className="mb-6 text-slate-600">
                        Tìm thấy <span className="font-bold text-slate-800">{mockResults.length}</span> kết quả phù hợp.
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {mockResults.map(course => (
                        <Link href={`/khoa-hoc/${course.slug}`} key={course.id} className="group">
                            <Card className="h-full bg-white hover:shadow-xl transition-all duration-300 border-slate-200 hover:-translate-y-1">
                                <div
                                    className="h-40 relative flex items-center justify-center overflow-hidden"
                                    style={{ background: `linear-gradient(135deg, ${course.theme.primary}, ${course.theme.secondary})` }}
                                >
                                    <span className="text-white/80 font-medium text-lg drop-shadow-md">{course.category}</span>
                                </div>
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-2 font-medium">
                                        <span className="flex items-center text-amber-500"><Star className="h-4 w-4 mr-1 fill-current" /> {course.stats.rating}</span>
                                        <span className="mx-1">•</span>
                                        <span>{course.level}</span>
                                    </div>
                                    <h3 className="font-bold text-lg mb-3 line-clamp-2 text-slate-800 group-hover:text-blue-600">
                                        {course.title}
                                    </h3>
                                    <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
                                        <span className="flex items-center"><BookOpen className="h-4 w-4 mr-1.5 opacity-70" /> {course.stats.lessons} bài</span>
                                        <span className="flex items-center"><Clock className="h-4 w-4 mr-1.5 opacity-70" /> {course.stats.duration} giờ</span>
                                    </div>
                                </CardContent>
                                <CardFooter className="p-6 pt-0 flex justify-between items-center border-t border-slate-100 mt-auto">
                                    <div className="font-bold text-lg text-blue-700">{formatCurrency(course.price)}</div>
                                    <Button variant="ghost" className="text-blue-600 font-semibold hover:bg-blue-50">Chi tiết →</Button>
                                </CardFooter>
                            </Card>
                        </Link>
                    ))}
                    {!query && (
                        <div className="col-span-full text-center py-20 text-slate-500">
                            Vui lòng nhập từ khóa để tìm kiếm.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
