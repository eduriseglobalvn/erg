import Link from "next/link";
import { ArrowLeft, Search, Filter, Trash2, Download } from "lucide-react";

import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/admin/ui/table";
import { Badge } from "@/components/admin/ui/badge";

const mockEnrollments = [
    { id: "e1", studentName: "Nguyễn Văn A", email: "a@email.com", progress: 45, enrolledAt: "20/02/2026", status: "Active" },
    { id: "e2", studentName: "Trần Thị B", email: "b@email.com", progress: 100, enrolledAt: "10/01/2026", status: "Completed" },
    { id: "e3", studentName: "Lê Văn C", email: "c@email.com", progress: 5, enrolledAt: "28/02/2026", status: "Active" },
    { id: "e4", studentName: "Phạm T", email: "p@email.com", progress: 0, enrolledAt: "01/03/2026", status: "Refunded" },
];

export default function CourseEnrollmentsPage({ params }: { params: { id: string } }) {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 max-w-6xl mx-auto">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
                <Link href="/admin/courses" className="hover:text-primary flex items-center">
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Danh sách Khóa học
                </Link>
                <span>/</span>
                <Link href={`/admin/courses/${params.id}`} className="hover:text-primary w-32 truncate">
                    Khóa học {params.id}
                </Link>
                <span>/</span>
                <span className="text-foreground font-medium">Học viên</span>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Học viên tham gia</h2>
                    <p className="text-muted-foreground mt-1">
                        Danh sách học viên đã mua và đang học khóa này.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" /> Export CSV
                    </Button>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 my-6">
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <div className="relative w-full sm:w-[350px]">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Tìm tên Học viên, Email..." className="pl-8" />
                    </div>
                    <Button variant="outline" className="shrink-0">
                        <Filter className="mr-2 h-4 w-4" />
                        Lọc theo trạng thái
                    </Button>
                </div>
            </div>

            <div className="rounded-md border bg-white shadow-sm overflow-hidden text-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Học viên</TableHead>
                            <TableHead>Tiến độ</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead>Ngày đăng ký</TableHead>
                            <TableHead className="text-right">Thao tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockEnrollments.map(e => (
                            <TableRow key={e.id}>
                                <TableCell>
                                    <div className="font-semibold">{e.studentName}</div>
                                    <div className="text-xs text-muted-foreground">{e.email}</div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <div className="w-24 h-2 bg-slate-100 rounded overflow-hidden">
                                            <div className="h-full bg-blue-600" style={{ width: `${e.progress}%` }}></div>
                                        </div>
                                        <span className="text-xs font-medium">{e.progress}%</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={e.status === 'Completed' ? 'default' : e.status === 'Active' ? 'outline' : 'secondary'}
                                        className={e.status === 'Completed' ? 'bg-green-100 text-green-700 hover:bg-green-200 border-none' :
                                            e.status === 'Active' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                'bg-slate-100 text-slate-700'}>
                                        {e.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>{e.enrolledAt}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                        Hủy đăng ký
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
