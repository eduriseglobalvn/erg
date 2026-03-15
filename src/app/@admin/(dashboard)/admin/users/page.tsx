"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, MoreHorizontal, ShieldPlus, Trash2, Edit, Plus, Download, Filter } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import { toast } from 'sonner';
import { userApi } from "@/services/users.api";

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
import { Checkbox } from "@/components/admin/ui/checkbox";
import { TableSkeleton } from "@/components/admin/shared/table-skeleton";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/admin/ui/pagination";

import { ManageUserRolesDialog } from "./manage-user-roles-dialog";

export interface RoleItem {
    id: string;
    name: string;
}

export interface UserRow {
    id: string;
    name?: string;
    email?: string;
    roles?: RoleItem[];
    provider?: string;
    isActive?: boolean;
    createdAt?: string;
}

export default function UsersPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch] = useDebounce(searchTerm, 500);
    const [page, setPage] = useState(1);
    const [selectedRows, setSelectedRows] = useState<string[]>([]);
    const queryClient = useQueryClient();

    // Dialog State
    const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
    const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);

    // API Call
    const { data: usersData, isLoading, refetch } = useQuery({
        queryKey: ['users', page, debouncedSearch],
        queryFn: () => userApi.getAllUsers(page, 10, debouncedSearch).then(res => res.data || res),
    });

    const usersList = (usersData as Record<string, any>)?.data || (Array.isArray(usersData) ? usersData : []);
    const totalItems = (usersData as Record<string, any>)?.meta?.totalItems || (usersData as Record<string, any>)?.total || 0;
    const totalPages = (usersData as Record<string, any>)?.meta?.totalPages || (usersData as Record<string, any>)?.lastPage || 1;

    // Fix selectedRows when users list changes
    const filteredUsers = usersList;

    // Mutaions
    const bulkStatusMutation = useMutation({
        mutationFn: ({ userIds, status }: { userIds: string[], status: 'ACTIVE' | 'BANNED' | 'BLOCKED' }) =>
            userApi.bulkUpdateStatus(userIds, status),
        onSuccess: () => {
            toast.success("Cập nhật trạng thái thành công");
            queryClient.invalidateQueries({ queryKey: ['users'] });
            setSelectedRows([]);
        },
        onError: () => toast.error("Lỗi khi cập nhật trạng thái")
    });

    const bulkDeleteMutation = useMutation({
        mutationFn: (userIds: string[]) => userApi.bulkDelete(userIds),
        onSuccess: () => {
            toast.success("Xóa người dùng thành công");
            queryClient.invalidateQueries({ queryKey: ['users'] });
            setSelectedRows([]);
        },
        onError: () => toast.error("Lỗi khi xóa người dùng")
    });

    const handleBulkStatus = (status: 'ACTIVE' | 'BANNED' | 'BLOCKED') => {
        if (selectedRows.length === 0) return;
        if (confirm(`Bạn có chắc chắn muốn chuyển ${selectedRows.length} users sang trạng thái ${status}?`)) {
            bulkStatusMutation.mutate({ userIds: selectedRows, status });
        }
    };

    const handleBulkDelete = () => {
        if (selectedRows.length === 0) return;
        if (confirm(`Bạn có chắc chắn muốn xóa vĩnh viễn ${selectedRows.length} users? Hành động này không thể hoàn tác.`)) {
            bulkDeleteMutation.mutate(selectedRows);
        }
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedRows(filteredUsers.map((u: UserRow) => u.id));
        } else {
            setSelectedRows([]);
        }
    };

    const handleSelectRow = (id: string, checked: boolean) => {
        if (checked) {
            setSelectedRows([...selectedRows, id]);
        } else {
            setSelectedRows(selectedRows.filter(rowId => rowId !== id));
        }
    };

    const handleOpenRoleDialog = (user: UserRow) => {
        setSelectedUser(user);
        setIsRoleDialogOpen(true);
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "-";
        try {
            return new Intl.DateTimeFormat('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            }).format(new Date(dateString));
        } catch (e) {
            return dateString;
        }
    };

    const handleExport = () => {
        if (filteredUsers.length === 0) {
            toast.info("Không có dữ liệu để xuất");
            return;
        }

        const headers = ["ID", "Tên", "Email", "SĐT", "Vai trò", "Provider", "Trạng thái", "Ngày tạo"];
        const rows = filteredUsers.map((u: UserRow) => [
            u.id,
            u.name || "",
            u.email || "",
            (u as any).phoneNumber || "",
            u.roles?.map(r => typeof r === 'string' ? r : r.name).join(", ") || "",
            u.provider || "Local",
            u.isActive ? "Hoạt động" : "Bị khóa",
            u.createdAt || ""
        ]);

        const csvContent = [headers, ...rows]
            .map(row => row.map((cell: any) => `"${(cell || "").toString().replace(/"/g, '""')}"`).join(","))
            .join("\n");

        const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `users_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Đã xuất dữ liệu thành công");
    };

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 overflow-hidden">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Quản lý Người dùng</h2>
                    <p className="text-muted-foreground mt-1">
                        Danh sách tất cả người dùng hệ thống. Bạn có thể phân quyền (gán Role) tại đây.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Button variant="outline" onClick={handleExport}>
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                    <Link href="/admin/users/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Tạo user mới
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 my-6">
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <div className="relative w-full sm:w-[300px]">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Tìm Email, Tên hoặc SĐT..."
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" className="shrink-0">
                        <Filter className="mr-2 h-4 w-4" />
                        Lọc
                    </Button>
                </div>

                {selectedRows.length > 0 && (
                    <div className="flex items-center space-x-2 text-sm bg-muted/50 px-3 py-1.5 rounded-md border text-nowrap">
                        <span className="font-medium mr-2">Đã chọn {selectedRows.length} users</span>
                        <Button variant="secondary" size="sm" className="h-7 text-xs" onClick={() => handleBulkStatus('ACTIVE')} disabled={bulkStatusMutation.isPending}>Kích hoạt</Button>
                        <Button variant="secondary" size="sm" className="h-7 text-xs text-amber-600 hover:text-amber-700" onClick={() => handleBulkStatus('BANNED')} disabled={bulkStatusMutation.isPending}>Tạm khóa</Button>
                        <Button variant="destructive" size="sm" className="h-7 text-xs" onClick={handleBulkDelete} disabled={bulkDeleteMutation.isPending}>Xóa</Button>
                    </div>
                )}
            </div>

            <div className="rounded-md border bg-white shadow-sm overflow-hidden text-sm flex-1">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-12 text-center">
                                <Checkbox
                                    checked={selectedRows.length === filteredUsers.length && filteredUsers.length > 0}
                                    onCheckedChange={handleSelectAll}
                                />
                            </TableHead>
                            <TableHead className="w-[250px]">Người dùng</TableHead>
                            <TableHead>Chức vụ (Roles)</TableHead>
                            <TableHead className="w-[120px]">Provider</TableHead>
                            <TableHead className="w-[120px]">Trạng thái</TableHead>
                            <TableHead className="w-[120px]">Ngày tạo</TableHead>
                            <TableHead className="w-[100px] text-right">Thao tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 p-0">
                                    <TableSkeleton columnCount={7} rowCount={10} />
                                </TableCell>
                            </TableRow>
                        ) : filteredUsers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                    Không tìm thấy người dùng nào.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredUsers.map((u: UserRow) => (
                                <TableRow key={u.id}>
                                    <TableCell className="text-center">
                                        <Checkbox
                                            checked={selectedRows.includes(u.id)}
                                            onCheckedChange={(checked: boolean) => handleSelectRow(u.id, checked)}
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        <Link href={`/admin/users/${u.id}`} className="hover:underline text-blue-600 font-bold block">
                                            {u.name || "Chưa cập nhật"}
                                        </Link>
                                        <span className="text-xs text-muted-foreground font-normal">{u.email}</span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {u.roles?.length === 0 ? (
                                                <span className="text-muted-foreground italic">-</span>
                                            ) : (
                                                u.roles?.map((r: RoleItem) => (
                                                    <Badge key={r.id} variant="secondary" className="font-medium text-[10px] px-1.5 py-0">
                                                        {r.name}
                                                    </Badge>
                                                ))
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-xs">{u.provider || 'local'}</TableCell>
                                    <TableCell>
                                        <Badge variant={u.isActive ? 'default' : 'outline'} className={u.isActive ? 'bg-green-100 text-green-700 hover:bg-green-200 border-none' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-none'}>
                                            {u.isActive ? 'Hoạt động' : 'Tạm khóa'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-xs">{formatDate(u.createdAt || '')}</TableCell>
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
                                                    <Link href={`/admin/users/${u.id}`}>
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Xem chi tiết
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleOpenRoleDialog(u)}>
                                                    <ShieldPlus className="mr-2 h-4 w-4" />
                                                    Phân quyền (Roles)
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600 focus:bg-red-50 focus:text-red-600">
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Khóa tài khoản
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

            {/* Pagination */}
            <div className="flex items-center justify-between px-2 pt-4">
                <div className="text-sm text-muted-foreground font-medium">
                    Hiển thị <span className="text-foreground font-bold">{usersList.length}</span> / <span className="text-foreground font-bold">{totalItems}</span> người dùng
                </div>
                <Pagination className="justify-end w-auto mx-0">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setPage(p => Math.max(1, p - 1));
                                }}
                                className={page === 1 || isLoading ? "pointer-events-none opacity-50" : ""}
                            />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#" isActive>
                                {page}
                            </PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setPage(p => Math.min(totalPages, p + 1));
                                }}
                                className={page === totalPages || isLoading ? "pointer-events-none opacity-50" : ""}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>

            {/* Role Assignment Dialog */}
            {selectedUser && (
                <ManageUserRolesDialog
                    user={selectedUser}
                    isOpen={isRoleDialogOpen}
                    onOpenChange={setIsRoleDialogOpen}
                    onRolesUpdated={() => {
                        toast.success("Cập nhật phân quyền thành công");
                        refetch();
                    }}
                />
            )}
        </div>
    );
}
