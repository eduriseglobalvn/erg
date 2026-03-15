import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CourseForm } from "../../components/course-form";

export default function EditCoursePage({ params }: { params: { id: string } }) {
    // Giả lập load dữ liệu khóa học bằng params.id
    const mockData = {
        title: "MOS Excel 2021 Advanced",
        slug: "mos-excel-2021-advanced",
        description: "Khóa học luyện thi chứng chỉ tin học văn phòng quốc tế MOS Excel phiên bản 2021 ở cấp độ nâng cao (Expert).",
        level: "Intermediate",
        price: 1500000,
        subdomain: "tinhocquocte",
        status: "Published",
        isFeatured: true
    };

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 max-w-5xl mx-auto">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
                <Link href="/admin/courses" className="hover:text-primary flex items-center">
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Danh sách Khóa học
                </Link>
                <span>/</span>
                <span className="text-foreground font-medium w-32 truncate">{mockData.title}</span>
                <span>/</span>
                <span className="text-foreground font-medium">Chỉnh sửa</span>
            </div>

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Chỉnh sửa khóa học</h2>
                    <p className="text-muted-foreground mt-1">
                        Cập nhật thông tin chi tiết của khóa học.
                    </p>
                </div>
            </div>

            <CourseForm initialData={mockData} isEdit />
        </div>
    );
}
