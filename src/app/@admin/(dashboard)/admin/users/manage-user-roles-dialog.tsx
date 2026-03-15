"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Check, ChevronsUpDown, ShieldAlert, Loader2 } from "lucide-react";

import { Button } from "@/components/admin/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/admin/ui/dialog";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/admin/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/admin/ui/popover";
import { Badge } from "@/components/admin/ui/badge";
import { cn } from "@/lib/utils";
import { accessControlApi } from "@/services/access-control.api";
import { toast } from "sonner";

import { useQuery } from "@tanstack/react-query";

interface ManageUserRolesDialogProps {
    user: Record<string, any> | null;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onRolesUpdated: () => void;
}

export function ManageUserRolesDialog({
    user,
    isOpen,
    onOpenChange,
    onRolesUpdated
}: ManageUserRolesDialogProps) {
    const [openCombobox, setOpenCombobox] = useState(false);
    const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    // 1. Fetch real AVAILABLE_ROLES
    const { data: rolesRes, isLoading: isLoadingRoles } = useQuery({
        queryKey: ['access-control', 'roles'],
        queryFn: () => accessControlApi.getRoles().then((res: any) => res.data || res),
        enabled: isOpen
    });

    const AVAILABLE_ROLES = Array.isArray(rolesRes) ? rolesRes : (rolesRes as any)?.items || [];

    // Sync selected roles when user or roles change
    useEffect(() => {
        if (user?.roles) {
            setSelectedRoleIds(user.roles.map((r: any) => r.id || r._id));
        }
    }, [user, isOpen]);

    const toggleRole = (roleId: string) => {
        setSelectedRoleIds(prev =>
            prev.includes(roleId)
                ? prev.filter(id => id !== roleId)
                : [...prev, roleId]
        );
    };

    const handleSave = async () => {
        if (!user?.id) return;
        try {
            setLoading(true);
            await accessControlApi.assignRoles(user.id, selectedRoleIds);
            toast.success(`Đã cập nhật vai trò cho người dùng ${user?.name}`);
            onRolesUpdated();
            onOpenChange(false);
        } catch (err: unknown) {
            toast.error((err as Record<string, any>)?.response?.data?.message || "Lỗi khi cập nhật roles");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Quản lý Vai trò truy cập</DialogTitle>
                    <DialogDescription>
                        Tùy chỉnh vai trò (Roles) cho user <b>{user?.name}</b> ({user?.email})
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="space-y-4 shadow-sm border p-4 rounded-md bg-muted/20">
                        <h4 className="text-sm font-medium">Vai trò hiện tại (Roles)</h4>

                        <div className="flex flex-wrap gap-2 mb-4">
                            {selectedRoleIds.length === 0 ? (
                                <span className="text-sm text-muted-foreground italic">Chưa có vai trò nào được gán</span>
                            ) : (
                                selectedRoleIds.map((id: string) => {
                                    const role = AVAILABLE_ROLES.find((r: any) => (r.id || r._id) === id);
                                    return (
                                        <Badge key={id} variant="secondary" className="px-2 py-1 flex items-center gap-1">
                                            {role?.name || "Unknown Role"}
                                            <button
                                                className="ml-1 rounded-full hover:bg-muted p-0.5 text-muted-foreground hover:text-foreground"
                                                onClick={() => toggleRole(id)}
                                            >
                                                &times;
                                            </button>
                                        </Badge>
                                    )
                                })
                            )}
                        </div>

                        <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={openCombobox}
                                    className="w-full justify-between"
                                >
                                    Thêm vai trò...
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[400px] p-0" align="start">
                                <Command>
                                    <CommandInput placeholder="Tìm tên vai trò..." />
                                    <CommandList>
                                        <CommandEmpty>Không tìm thấy vai trò.</CommandEmpty>
                                        <CommandGroup>
                                            {AVAILABLE_ROLES.map((role: any) => (
                                                <CommandItem
                                                    key={role.id || role._id}
                                                    value={role.name}
                                                    onSelect={() => {
                                                        toggleRole(role.id || role._id);
                                                        // setOpenCombobox(false); // keep open for multiple selection
                                                    }}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            selectedRoleIds.includes(role.id || role._id) ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                    {role.name}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm p-3 rounded-md flex items-start gap-2">
                        <ShieldAlert className="h-5 w-5 shrink-0 text-amber-600" />
                        <p>
                            Hệ thống sẽ tổng hợp <b>TẤT CẢ</b> các quyền từ các vai trò được gán (Phép Toán OR).
                            User chỉ cần có quyền đó ở một trong các vai trò thì sẽ được phép sử dụng chức năng tương ứng.
                        </p>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Hủy bỏ
                    </Button>
                    <Button onClick={handleSave} disabled={loading}>
                        {loading ? "Đang lưu..." : "Lưu thay đổi"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
