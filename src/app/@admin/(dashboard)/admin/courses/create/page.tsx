import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CourseForm } from "../components/course-form";

export default function CreateCoursePage() {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 max-w-5xl mx-auto">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
                <Link href="/admin/courses" className="hover:text-primary flex items-center">
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Danh sách Khóa học
                </Link>
                <span>/</span>
                <span className="text-foreground font-medium">Tạo mới</span>
            </div>

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Tạo khóa học mới</h2>
                    <p className="text-muted-foreground mt-1">
                        Thiết lập các thông tin cơ bản cho khóa học mới.
                    </p>
                </div>
            </div>

            <CourseForm />
        </div>
    );
}
