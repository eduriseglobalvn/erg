import Link from "next/link";
import { ArrowLeft, BookOpen, Clock, Star, PlayCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/cms/ui/button"; // Reusing admin UI components for demo
import { Card, CardContent } from "@/components/cms/ui/card";
import { Badge } from "@/components/cms/ui/badge";
import { Breadcrumb } from "@/components/seo/breadcrumb";
import { SchemaScript } from "@/components/seo/schema-script";
import { Metadata } from "next";
import { Reviews } from "@/components/shared/reviews";
import { COURSES } from "@/constants/courses";
import { generateFullMetadata } from "@/utils/seo/seo-metadata";
import { headers } from "next/headers";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const headerList = await headers();
    const host = headerList.get('host') || 'tinhocquocte.erg.edu.vn';

    // Tìm khóa học từ mock constant (do không có API thật ở frontend module này)
    const course = COURSES.tinhocquocte.find(c => c.id === slug) ||
        COURSES.tinhocquocgia.find(c => c.id === slug) ||
        COURSES.tinhocthieunhi.find(c => c.id === slug);

    if (!course) {
        return { title: 'Không tìm thấy khóa học' };
    }

    return generateFullMetadata({
        title: `${course.title} | Chuyên trang Tin học ERG`,
        description: course.description,
        path: `/khoa-hoc/${slug}`,
        host,
    });
}
// Removed hardcoded metadata block

export default function PublicCourseDetail({ params }: { params: { slug: string } }) {
    // Giả lập load dữ liệu khóa học bằng slug
    const mockData = {
        title: "MOS Excel 2021 Advanced",
        slug: "mos-excel-2021-advanced",
        description: "Khóa học luyện thi chứng chỉ tin học văn phòng quốc tế MOS Excel phiên bản 2021 ở cấp độ nâng cao (Expert). Cung cấp đầy đủ kiến thức và kỹ năng thực hành bài thi thật.",
        level: "Intermediate",
        price: 1500000,
        subdomain: "tinhocquocte",
        status: "Published",
        category: "MOS",
        stats: { lessons: 12, duration: "24", students: 156, rating: 4.8, reviews: 45 },
        theme: { primary: "#2563EB", secondary: "#1E40AF" },
        benefits: [
            "Hiểu rõ cấu trúc bài thi MOS Excel 2021 Expert",
            "Nắm vững các hàm phức tạp (VLOOKUP, INDEX, MATCH...)",
            "Kỹ năng xử lý dữ liệu lớn bằng Pivot Table và Macro",
            "Thi thử trên phần mềm GMetrix",
        ],
        syllabus: [
            { title: "Phần 1: Quản lý và định dạng Workbook", lessonsCount: 3, duration: "5h" },
            { title: "Phần 2: Áp dụng các định dạng và Layout tùy chỉnh", lessonsCount: 4, duration: "7h" },
            { title: "Phần 3: Sử dụng các hàm nâng cao", lessonsCount: 5, duration: "12h" }
        ]
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            {/* SEO Scripts */}
            <SchemaScript type="WebSite" domain="tinhocquocte.erg.edu.vn" data={{ name: "Tin Học Quốc Tế ERG", url: "https://tinhocquocte.erg.edu.vn" }} />
            <SchemaScript type="Course" domain="tinhocquocte.erg.edu.vn" data={{
                title: mockData.title,
                description: mockData.description,
                price: mockData.price,
                rating: { average: mockData.stats.rating, count: mockData.stats.reviews }
            }} />

            {/* Themed Hero Section */}
            <div
                className="text-white py-12 md:py-20 px-4 md:px-8 relative overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${mockData.theme.primary}, ${mockData.theme.secondary})` }}
            >
                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="mb-6">
                        <Breadcrumb
                            pathname={`/khoa-hoc/${params.slug}`}
                            pageTitle={mockData.title}
                            categoryName={mockData.category}
                            domain="tinhocquocte.erg.edu.vn"
                            className="text-blue-200"
                            itemClassName="hover:text-white"
                            activeItemClassName="text-white opacity-90"
                            separatorClassName="text-blue-300"
                        />
                    </div>

                    <div className="grid md:grid-cols-3 gap-12 items-center">
                        <div className="md:col-span-2 space-y-6">
                            <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm text-sm px-3 py-1">
                                {mockData.category} • {mockData.level}
                            </Badge>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                                {mockData.title}
                            </h1>
                            <p className="text-blue-50 text-lg md:text-xl max-w-2xl leading-relaxed opacity-90">
                                {mockData.description}
                            </p>

                            <div className="flex flex-wrap items-center gap-6 text-sm font-medium pt-4 bg-black/10 inline-flex p-3 pr-6 rounded-lg backdrop-blur-md">
                                <div className="flex items-center text-amber-400">
                                    <Star className="h-5 w-5 mr-1.5 fill-current" />
                                    <span className="text-white font-bold text-base mr-1">{mockData.stats.rating}</span>
                                    <span className="text-blue-100">({mockData.stats.reviews} đánh giá)</span>
                                </div>
                                <div className="flex items-center text-blue-50">
                                    <PlayCircle className="h-5 w-5 mr-1.5" /> {mockData.stats.students} học viên
                                </div>
                                <div className="flex items-center text-blue-50">
                                    <Clock className="h-5 w-5 mr-1.5" /> Cập nhật tháng 3/2026
                                </div>
                            </div>
                        </div>

                        {/* Sticky Action Card */}
                        <div className="hidden md:block">
                            <Card className="shadow-2xl border-0 overflow-hidden text-slate-800 bg-white">
                                <div className="h-48 bg-slate-200 flex items-center justify-center relative group cursor-pointer">
                                    <PlayCircle className="h-16 w-16 text-white absolute z-10 drop-shadow-lg group-hover:scale-110 transition-transform" />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                                    <span className="text-slate-400 font-medium">Video Giới Thiệu</span>
                                </div>
                                <CardContent className="p-6">
                                    <div className="text-3xl font-bold text-slate-800 mb-6">
                                        {formatCurrency(mockData.price)}
                                    </div>
                                    <Button className="w-full text-lg h-14 mb-4" style={{ backgroundColor: mockData.theme.primary }}>
                                        Đăng ký học ngay
                                    </Button>
                                    <p className="text-sm text-center text-muted-foreground">
                                        Đảm bảo hoàn tiền trong 30 ngày
                                    </p>

                                    <div className="mt-6 pt-6 border-t border-slate-100 space-y-4">
                                        <div className="flex items-center text-sm font-medium"><BookOpen className="h-4 w-4 mr-3 text-slate-400" /> {mockData.stats.lessons} bài giảng video</div>
                                        <div className="flex items-center text-sm font-medium"><Clock className="h-4 w-4 mr-3 text-slate-400" /> {mockData.stats.duration} giờ thời lượng</div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 md:px-8 mt-12 grid md:grid-cols-3 gap-12">
                <div className="md:col-span-2 space-y-12">
                    {/* Benefits */}
                    <section>
                        <h2 className="text-2xl font-bold mb-6 text-slate-800">Bạn sẽ học được gì?</h2>
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                            <ul className="grid sm:grid-cols-2 gap-4">
                                {mockData.benefits.map((b, i) => (
                                    <li key={i} className="flex items-start">
                                        <CheckCircle2 className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5" style={{ color: mockData.theme.primary }} />
                                        <span className="text-slate-700 leading-relaxed font-medium">{b}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>

                    {/* Syllabus */}
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-slate-800">Nội dung khóa học</h2>
                            <div className="text-sm font-medium text-slate-500">
                                {mockData.syllabus.length} phần • {mockData.stats.lessons} bài học • {mockData.stats.duration} giờ
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden divide-y divide-slate-100">
                            {mockData.syllabus.map((s, i) => (
                                <div key={i} className="p-5 hover:bg-slate-50 transition-colors cursor-pointer group">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">{s.title}</h3>
                                        <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{s.lessonsCount} bài • {s.duration}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Reviews */}
                    <section className="scroll-mt-24" id="reviews">
                        <Reviews targetId={mockData.slug} targetType="course" />
                    </section>
                </div>

                {/* Mobile Action Card (Hidden on Desktop) */}
                <div className="md:hidden">
                    <Card className="shadow-lg border-slate-200 sticky top-4">
                        <CardContent className="p-6">
                            <div className="text-3xl font-bold text-slate-800 mb-6">
                                {formatCurrency(mockData.price)}
                            </div>
                            <Button className="w-full text-lg h-14 mb-4" style={{ backgroundColor: mockData.theme.primary }}>
                                Đăng ký học ngay
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
