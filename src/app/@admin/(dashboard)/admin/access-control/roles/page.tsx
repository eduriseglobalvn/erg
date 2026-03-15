"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, Shield, Trash2, Edit } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { accessControlApi } from "@/services/access-control.api";

import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/admin/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/admin/ui/dropdown-menu";
import { Badge } from "@/components/admin/ui/badge";
import { MoreHorizontal } from "lucide-react";
import { PermissionGate } from "@/components/admin/shared/permission-gate";

export default function RoleListPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['roles'],
        queryFn: () => accessControlApi.getRoles(),
    });

    const roles: any[] = (data as any)?.data || data || [];

    const deleteMutation = useMutation({
        mutationFn: (id: string) => accessControlApi.deleteRole(id),
        onSuccess: () => {
            toast.success("Đã xóa vai trò thành công");
            queryClient.invalidateQueries({ queryKey: ['roles'] });
        },
        onError: (error: any) => {
            toast.error(error?.message || "Lỗi khi xóa vai trò");
        }
    });

    const handleDelete = (id: string) => {
        if (confirm("Bạn có chắc chắn muốn xóa vai trò này?")) {
            deleteMutation.mutate(id);
        }
    };

    // Filter logic
    const filteredRoles = roles.filter((role: any) =>
        role.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Quản lý Vai trò</h2>
                    <p className="text-muted-foreground mt-1">
                        Thiết lập danh sách vai trò (Role) và phân quyền (Permissions).
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <PermissionGate permission="roles.manage">
                        <Button asChild>
                            <Link href="/admin/access-control/roles/create">
                                <Plus className="mr-2 h-4 w-4" />
                                Tạo vai trò
                            </Link>
                        </Button>
                    </PermissionGate>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center mb-6">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Tìm kiếm vai trò hoặc mô tả..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="rounded-md border bg-white shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[250px]">Tên vai trò</TableHead>
                            <TableHead>Mô tả</TableHead>
                            <TableHead className="text-center w-[150px]">Số người dùng</TableHead>
                            <TableHead className="text-center w-[150px]">Số quyền (Perms)</TableHead>
                            <TableHead className="w-[100px] text-right">Thao tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    Đang tải dữ liệu...
                                </TableCell>
                            </TableRow>
                        ) : filteredRoles.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    Không tìm thấy vai trò nào.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredRoles.map((role: any) => (
                                <TableRow key={role.id || role._id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center space-x-2">
                                            <Shield className="h-4 w-4 text-primary" />
                                            <span>{role.name}</span>
                                            {role.isSystem && (
                                                <Badge variant="secondary" className="text-xs">System</Badge>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {role.description}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="outline">{role.userCount || 0}</Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="outline">{role.permissions?.length || role.permissionCount || 0}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <PermissionGate permission="roles.manage">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/admin/access-control/roles/${role.id || role._id}/edit`}>
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Phân quyền & Sửa
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    {!role.isSystem && (
                                                        <DropdownMenuItem
                                                            className="text-red-600 focus:bg-red-50 focus:text-red-600 cursor-pointer"
                                                            onClick={() => handleDelete(role.id || role._id)}
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Xóa vai trò
                                                        </DropdownMenuItem>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </PermissionGate>
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
