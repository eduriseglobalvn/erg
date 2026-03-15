import Link from "next/link";
import { ArrowLeft, ExternalLink, Settings, Users, BookOpen } from "lucide-react";
import { Button } from "@/components/admin/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/admin/ui/card";
import { Badge } from "@/components/admin/ui/badge";

export default function CourseDetailPage({ params }: { params: { id: string } }) {
    // Mock
    const mockData = {
        title: "MOS Excel 2021 Advanced",
        slug: "mos-excel-2021-advanced",
        description: "Khóa học luyện thi chứng chỉ tin học văn phòng quốc tế MOS Excel phiên bản 2021 ở cấp độ nâng cao (Expert).",
        level: "Intermediate",
        price: 1500000,
        subdomain: "tinhocquocte",
        status: "Published",
        stats: { lessons: 12, duration: "24", students: 156, rating: 4.8 },
    };

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 max-w-5xl mx-auto">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
                <Link href="/admin/courses" className="hover:text-primary flex items-center">
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Danh sách Khóa học
                </Link>
                <span>/</span>
                <span className="text-foreground font-medium">{mockData.title}</span>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                <div>
                    <div className="flex items-center gap-3">
                        <h2 className="text-3xl font-bold tracking-tight">{mockData.title}</h2>
                        <Badge variant="default" className="bg-green-100 text-green-700 hover:bg-green-200 border-none">
                            {mockData.status}
                        </Badge>
                    </div>
                    <p className="text-muted-foreground mt-1 max-w-2xl line-clamp-2">
                        {mockData.description}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" asChild>
                        <a href={`https://${mockData.subdomain}.erg.edu.vn/courses/${mockData.slug}`} target="_blank" rel="noreferrer">
                            <ExternalLink className="mr-2 h-4 w-4" /> Xem trực tiếp
                        </a>
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Doanh thu tạm tính</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">234,000,000 đ</div>
                        <p className="text-xs text-muted-foreground">Từ {mockData.stats.students} học viên</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Học viên đang học</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{mockData.stats.students}</div>
                        <p className="text-xs text-muted-foreground">+12 học viên mới tuần này</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Đánh giá sao</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold flex items-center gap-2">
                            ⭐ {mockData.stats.rating}
                            <span className="text-sm text-muted-foreground font-normal">(45 reviews)</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 mt-6">
                <Card className="hover:border-blue-400 transition-colors shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Settings className="h-5 w-5 text-blue-600" />
                            Cài đặt chung
                        </CardTitle>
                        <CardDescription>Sửa tên, mô tả, giá bán và public trên domain.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="secondary" asChild className="w-full">
                            <Link href={`/admin/courses/${params.id}/edit`}>Điều chỉnh Cài đặt</Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="hover:border-green-400 transition-colors shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-green-600" />
                            Quản lý Giáo trình
                        </CardTitle>
                        <CardDescription>Kéo thả các phần (Chapters), bài học (Lessons).</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="secondary" asChild className="w-full bg-green-50 text-green-700 hover:bg-green-100 border-none">
                            <Link href={`/admin/courses/${params.id}/syllabus`}>Soạn nội dung</Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="hover:border-purple-400 transition-colors shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-purple-600" />
                            Học viên (Enrollments)
                        </CardTitle>
                        <CardDescription>Xem danh sách tài khoản đã mua và tiến độ học tập của họ.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="secondary" asChild className="w-full bg-purple-50 text-purple-700 hover:bg-purple-100 border-none">
                            <Link href={`/admin/courses/${params.id}/enrollments`}>Quản lý học viên</Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="hover:border-amber-400 transition-colors shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <svg className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Giao diện (Theming)
                        </CardTitle>
                        <CardDescription>Tuỳ chỉnh màu sắc, fonts và components hiển thị.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="secondary" asChild className="w-full bg-amber-50 text-amber-700 hover:bg-amber-100 border-none">
                            <Link href={`/admin/courses/${params.id}/theme`}>Cấu hình Giao diện</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
