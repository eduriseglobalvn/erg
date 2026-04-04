"use client";

import { useState } from "react";
import { Search, Shield } from "lucide-react";
import { Input } from "@/components/admin/ui/input";
import { ProtectedRoute } from "@/components/admin/shared/protected-route";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/admin/ui/table";
import { Badge } from "@/components/admin/ui/badge";

const MOCK_PERMISSIONS = [
    { id: "posts.read", name: "Xem bài viết", module: "Posts", description: "Cho phép xem danh sách bài viết" },
    { id: "posts.create", name: "Tạo bài viết", module: "Posts", description: "Cho phép tạo nháp bài viết mới" },
    { id: "posts.update", name: "Sửa bài viết", module: "Posts", description: "Cho phép chỉnh sửa các bài viết" },
    { id: "posts.delete", name: "Xóa bài viết", module: "Posts", description: "Cho phép xóa bài viết (trash)" },
    { id: "users.read", name: "Xem người dùng", module: "Users", description: "Cho phép xem danh sách users" },
    { id: "roles.read", name: "Quản lý quyền", module: "Quyền", description: "Có thể truy cập module phân quyền" },
];

export default function PermissionsPage() {
    const [searchTerm, setSearchTerm] = useState("");

    const filtered = MOCK_PERMISSIONS.filter((p) =>
        p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.module.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <ProtectedRoute permission="roles.read">
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Quyền hệ thống (Permissions)</h2>
                    <p className="text-muted-foreground mt-1">
                        Danh sách tất cả các quyền đọc/ghi định nghĩa sẵn trong hệ thống (Read-only).
                    </p>
                </div>
            </div>

            <div className="flex items-center mb-6">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Tìm kiếm ID quyền, tên hoặc module..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="rounded-md border bg-white shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[300px]">Permission ID</TableHead>
                            <TableHead>Tên hiển thị</TableHead>
                            <TableHead className="w-[150px]">Module</TableHead>
                            <TableHead>Mô tả</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filtered.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    Không tìm thấy quyền nào khớp.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filtered.map((perm) => (
                                <TableRow key={perm.id}>
                                    <TableCell className="font-mono text-xs font-semibold">
                                        <div className="flex items-center space-x-2">
                                            <Shield className="h-4 w-4 text-muted-foreground" />
                                            <span>{perm.id}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{perm.name}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{perm.module}</Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {perm.description}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
        </ProtectedRoute>
    );
}
