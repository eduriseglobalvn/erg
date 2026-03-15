"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, X, Save, ShieldAlert, BadgeInfo } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/admin/ui/button";
import { Badge } from "@/components/admin/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/admin/ui/card";
import { accessControlApi } from "@/services/access-control.api";

// --- MOCK DATA ---
const RESOURCES = [
    { id: "posts", name: "Bài viết" },
    { id: "courses", name: "Khóa học" },
    { id: "users", name: "Người dùng" },
    { id: "roles", name: "Phân quyền" },
    { id: "seo", name: "SEO" },
    { id: "crawler", name: "Crawler" },
    { id: "recruitment", name: "Tuyển dụng" },
];

const ACTIONS = [
    { id: "read", name: "Read" },
    { id: "create", name: "Create" },
    { id: "update", name: "Update" },
    { id: "delete", name: "Delete" },
    { id: "manage", name: "Manage" }, // Mức cao nhất của Resource
];

export default function UserPermissionsPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const userId = resolvedParams.id;
    const [loading, setLoading] = useState(false);

    // TODO: Load user roles & permissions from API
    // Dữ liệu giả lập
    const userRoles = [{ id: "2", name: "Editor" }, { id: "3", name: "Content Writer" }];
    const allRoles = [
        { id: "1", name: "Admin" },
        { id: "2", name: "Editor" },
        { id: "3", name: "Content Writer" },
        { id: "4", name: "SEO Specialist" }
    ];

    const [selectedRoles, setSelectedRoles] = useState<string[]>(userRoles.map(r => r.id));

    // Quyền từ roles (inherited) - Tưởng tượng đây là quyền tổng kết từ API
    const inheritedPerms = new Set(["posts.read", "posts.create", "posts.update", "crawler.read"]);

    // Quyền GRANT (cấp thêm)
    const [grantedPerms, setGrantedPerms] = useState<Set<string>>(new Set(["seo.read"]));

    // Quyền DENY (cấm)
    const [deniedPerms, setDeniedPerms] = useState<Set<string>>(new Set(["posts.delete"]));

    // Tính toán quyền hiệu lực
    const getEffectiveStatus = (permId: string) => {
        if (deniedPerms.has(permId)) return "DENIED"; // Bị chặn (đỏ)
        if (grantedPerms.has(permId)) return "GRANTED"; // Cấp riêng (xanh lá nhạt)
        if (inheritedPerms.has(permId)) return "INHERITED"; // Có sẵn từ vai trò (xanh lá sậm)
        return "NONE"; // Không có quyền
    };

    const toggleRole = (roleId: string) => {
        setSelectedRoles(prev =>
            prev.includes(roleId) ? prev.filter(r => r !== roleId) : [...prev, roleId]
        );
    };

    const cyclePermission = (permId: string) => {
        const status = getEffectiveStatus(permId);

        // Vòng lặp: INHERITED/NONE -> GRANT -> DENY -> NONE
        // Lưu ý: Nếu perm đã là INHERITED, cycle -> DENY -> NONE (trở về INHERITED) -> GRANT

        if (deniedPerms.has(permId)) {
            // Đang bị cấm -> xóa cấm -> về NONE/INHERITED
            const newDenied = new Set(deniedPerms);
            newDenied.delete(permId);
            setDeniedPerms(newDenied);
        } else if (grantedPerms.has(permId)) {
            // Đang đc cấp riêng -> chuyển thành cấm
            const newGranted = new Set(grantedPerms);
            newGranted.delete(permId);
            setGrantedPerms(newGranted);
            setDeniedPerms(new Set(deniedPerms).add(permId));
        } else {
            // Đang là NONE hoặc INHERITED -> chuyển thành DENY nếu là INHERITED, hoặc GRANT nếu NONE
            if (inheritedPerms.has(permId)) {
                setDeniedPerms(new Set(deniedPerms).add(permId));
            } else {
                setGrantedPerms(new Set(grantedPerms).add(permId));
            }
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            // Giả lập lưu
            setTimeout(() => {
                toast.success("Đã lưu phân quyền cho người dùng");
                setLoading(false);
            }, 500);
        } catch (e) {
            toast.error("Có lỗi xảy ra");
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href={`/admin/users/${userId}`}>
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Phân quyền: Nguyễn Văn A</h2>
                        <p className="text-muted-foreground">nguyena@erg.edu.vn</p>
                    </div>
                </div>
                <Button onClick={handleSave} disabled={loading}>
                    <Save className="mr-2 h-4 w-4" />
                    Lưu thay đổi
                </Button>
            </div>

            <div className="space-y-6">
                {/* 1. MÀN CHỌN VAI TRÒ */}
                <Card>
                    <CardHeader>
                        <CardTitle>Vai trò hiện tại</CardTitle>
                        <CardDescription>
                            Click vào badge để gán hoặc gỡ vai trò.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-3">
                            {allRoles.map(role => {
                                const isSelected = selectedRoles.includes(role.id);
                                return (
                                    <Badge
                                        key={role.id}
                                        variant={isSelected ? "default" : "outline"}
                                        className={`px-4 py-2 text-sm cursor-pointer transition-colors ${isSelected ? 'bg-primary' : 'text-muted-foreground hover:bg-muted'}`}
                                        onClick={() => toggleRole(role.id)}
                                    >
                                        {isSelected ? <Check className="mr-2 h-4 w-4" /> : <X className="mr-2 h-4 w-4" />}
                                        {role.name}
                                    </Badge>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* 2. BẢNG PHÂN QUYỀN HEADER */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quyền hiệu lực (Effective Permissions)</CardTitle>
                        <CardDescription>
                            Tổng hợp quyền hạn từ vai trò và các cấp phép/cấm rẽ nhánh (Overrides).
                            <div className="mt-4 flex flex-wrap gap-6 border border-muted bg-muted/20 p-4 rounded-md">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                                            <Check className="h-3 w-3" />
                                        </div>
                                        <span className="text-sm font-medium">Inherited (Có sẵn từ Roles)</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground ml-6">Quyển có được từ các vai trò ở trên.</p>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0">
                                            <Check className="h-3 w-3" />
                                        </div>
                                        <span className="text-sm font-medium">Granted (Cấp riêng)</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground ml-6">Quyền được gắn thêm riêng cho user này.</p>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center shrink-0">
                                            <X className="h-3 w-3" />
                                        </div>
                                        <span className="text-sm font-medium">Denied (Cấm riêng)</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground ml-6">Chặn quyền mà user vốn dĩ có từ Roles.</p>
                                </div>
                            </div>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border overflow-hidden">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-muted/50 border-b">
                                        <th className="p-4 text-left font-medium w-[200px]">Tài nguyên</th>
                                        {ACTIONS.map(action => (
                                            <th key={action.id} className="p-4 text-center font-medium w-[120px]">
                                                {action.name}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y relative">
                                    {RESOURCES.map((resource) => (
                                        <tr key={resource.id} className="hover:bg-muted/10">
                                            <td className="p-4 font-medium border-r bg-muted/5">
                                                {resource.name}
                                                <br />
                                                <span className="text-xs text-muted-foreground font-normal">{resource.id}</span>
                                            </td>
                                            {ACTIONS.map((action) => {
                                                const permId = `${resource.id}.${action.id}`;
                                                // Tính trạng thái của cell này
                                                const status = getEffectiveStatus(permId);

                                                return (
                                                    <td
                                                        key={action.id}
                                                        className="p-4 text-center border-r hover:bg-muted/50 cursor-pointer transition-colors"
                                                        onClick={() => cyclePermission(permId)}
                                                    >
                                                        <div className="flex justify-center flex-col items-center group">
                                                            {status === "INHERITED" && (
                                                                <div className="w-6 h-6 rounded bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-sm border border-emerald-200" title="Đã có từ Vai trò">
                                                                    <Check className="h-4 w-4" />
                                                                </div>
                                                            )}
                                                            {status === "GRANTED" && (
                                                                <div className="w-6 h-6 rounded bg-blue-100 text-blue-600 flex items-center justify-center shadow-sm border border-blue-200" title="Được cấp riêng">
                                                                    <Check className="h-4 w-4" />
                                                                </div>
                                                            )}
                                                            {status === "DENIED" && (
                                                                <div className="w-6 h-6 rounded bg-red-100 text-red-600 flex items-center justify-center shadow-sm border border-red-200" title="Bị chặn">
                                                                    <X className="h-4 w-4" />
                                                                </div>
                                                            )}
                                                            {status === "NONE" && (
                                                                <div className="w-6 h-6 flex items-center justify-center text-muted-foreground/30 font-light group-hover:text-muted-foreground transition-colors">
                                                                    -
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
