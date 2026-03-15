"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Plus, Edit, BookOpen, Users, MoreHorizontal, Filter, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/admin/ui/table";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/admin/ui/dropdown-menu";
import { Badge } from "@/components/admin/ui/badge";
import { Checkbox } from "@/components/admin/ui/checkbox";

// Mock data
const mockCourses = [
    {
        id: "c1",
        title: "MOS Excel 2021 Advanced",
        thumbnail: null,
        stats: { lessons: 12, duration: "24", students: 156, rating: 4.8 },
        price: 1500000,
        level: "Intermediate",
        subdomain: "tinhocquocte",
        status: "Published"
    },
    {
        id: "c2",
        title: "Kỹ năng Giao tiếp Tiếng Anh",
        thumbnail: null,
        stats: { lessons: 24, duration: "48", students: 432, rating: 4.9 },
        price: 2000000,
        level: "Beginner",
        subdomain: "ngoainguerg",
        status: "Draft"
    },
    {
        id: "c3",
        title: "Lập trình Web Cơ bản",
        thumbnail: null,
        stats: { lessons: 30, duration: "60", students: 95, rating: 4.7 },
        price: 3000000,
        level: "Beginner",
        subdomain: "it",
        status: "Published"
    }
];

export default function CoursesPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRows, setSelectedRows] = useState<string[]>([]);

    const filteredCourses = mockCourses.filter(c =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.subdomain.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelectAll = (checked: boolean) => {
        if (checked) setSelectedRows(filteredCourses.map(c => c.id));
        else setSelectedRows([]);
    };

    const handleSelectRow = (id: string, checked: boolean) => {
        if (checked) setSelectedRows([...selectedRows, id]);
        else setSelectedRows(selectedRows.filter(rId => rId !== id));
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Quản lý Khóa học</h2>
                    <p className="text-muted-foreground mt-1">
                        Tạo, chỉnh sửa và quản lý nội dung xuất bản trên các Subdomain.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Link href="/admin/courses/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Tạo khóa học mới
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 my-6">
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <div className="relative w-full sm:w-[350px]">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Tìm tên khóa học, subdomain..."
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" className="shrink-0">
                        <Filter className="mr-2 h-4 w-4" />
                        Lọc nâng cao
                    </Button>
                </div>

                {selectedRows.length > 0 && (
                    <div className="flex items-center space-x-2 text-sm bg-muted/50 px-3 py-1.5 rounded-md border text-nowrap">
                        <span className="font-medium mr-2">Đã chọn {selectedRows.length} khóa học</span>
                        <Button variant="secondary" size="sm" className="h-7 text-xs">Publish</Button>
                        <Button variant="secondary" size="sm" className="h-7 text-xs">Unpublish</Button>
                        <Button variant="destructive" size="sm" className="h-7 text-xs">Xóa</Button>
                    </div>
                )}
            </div>

            <div className="rounded-md border bg-white shadow-sm overflow-hidden text-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-12 text-center">
                                <Checkbox
                                    checked={selectedRows.length === filteredCourses.length && filteredCourses.length > 0}
                                    onCheckedChange={handleSelectAll}
                                />
                            </TableHead>
                            <TableHead className="w-[80px]">Ảnh</TableHead>
                            <TableHead>Khóa học</TableHead>
                            <TableHead className="w-[180px]">Thông tin chi tiết</TableHead>
                            <TableHead className="w-[120px]">Subdomain</TableHead>
                            <TableHead className="w-[100px]">Trạng thái</TableHead>
                            <TableHead className="w-[100px] text-right">Thao tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredCourses.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                    Không tìm thấy dữ liệu khóa học.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredCourses.map(course => (
                                <TableRow key={course.id}>
                                    <TableCell className="text-center">
                                        <Checkbox
                                            checked={selectedRows.includes(course.id)}
                                            onCheckedChange={(checked: boolean) => handleSelectRow(course.id, checked)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className="h-12 w-16 bg-slate-100 rounded border border-slate-200 flex items-center justify-center text-slate-400">
                                            {course.thumbnail ? (
                                                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover rounded" />
                                            ) : (
                                                <ImageIcon className="h-5 w-5" />
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Link href={`/admin/courses/${course.id}`} className="font-bold text-base text-blue-700 hover:text-blue-800 hover:underline line-clamp-1">
                                            {course.title}
                                        </Link>
                                        <div className="text-xs text-muted-foreground mt-1 flex gap-2 flex-wrap">
                                            <span title="Level">🏷️ {course.level}</span>
                                            <span title="Rating">⭐ {course.stats.rating}</span>
                                            <span title="Price" className="text-emerald-600 font-medium">{formatCurrency(course.price)}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground">
                                        <div className="flex flex-col gap-1">
                                            <span>📚 {course.stats.lessons} bài học</span>
                                            <span>⏱️ {course.stats.duration} giờ học</span>
                                            <span>👥 {course.stats.students} học viên</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                                            {course.subdomain}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={course.status === 'Published' ? 'default' : 'outline'} className={course.status === 'Published' ? 'bg-green-100 text-green-700 hover:bg-green-200 border-none' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-none'}>
                                            {course.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/admin/courses/${course.id}`}>
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Chỉnh sửa
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/admin/courses/${course.id}/syllabus`}>
                                                        <BookOpen className="mr-2 h-4 w-4" />
                                                        Nội dung (Syllabus)
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/admin/courses/${course.id}/enrollments`}>
                                                        <Users className="mr-2 h-4 w-4" />
                                                        Học viên
                                                    </Link>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
