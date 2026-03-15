"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, Shield } from "lucide-react";

import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { Textarea } from "@/components/admin/ui/textarea";
import { Label } from "@/components/admin/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/admin/ui/card";
import { Checkbox } from "@/components/admin/ui/checkbox";
import { toast } from "sonner";
import { accessControlApi } from "@/services/access-control.api";

// --- MOCK DATA PERMISSIONS DỰA THEO PLAN ---
const RESOURCES = [
    { id: "posts", name: "Bài viết" },
    { id: "courses", name: "Khóa học" },
    { id: "users", name: "Người dùng" },
    { id: "roles", name: "Phân quyền" },
    { id: "seo", name: "SEO" },
    { id: "crawler", name: "Crawler" },
    { id: "recruitment", name: "Tuyển dụng" },
    { id: "categories", name: "Chuyên mục" },
    { id: "tags", name: "Thẻ Tags" },
    { id: "media", name: "Thư viện" },
    { id: "settings", name: "Cài đặt" }
];

const ACTIONS = [
    { id: "read", name: "Read" },
    { id: "create", name: "Create" },
    { id: "update", name: "Update" },
    { id: "delete", name: "Delete" },
    { id: "manage", name: "Manage" }, // Mức cao nhất của Resource
];

interface RoleFormProps {
    initialData?: {
        id?: string;
        name: string;
        description: string;
        permissions: string[]; // ex: ['posts.read', 'users.manage']
    };
    isEdit?: boolean;
}

export function RoleForm({ initialData, isEdit = false }: RoleFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        description: initialData?.description || "",
    });

    // State lưu trữ quyền đã chọn
    // Dạng mảng string set để check O(1)
    const [selectedPerms, setSelectedPerms] = useState<Set<string>>(
        new Set(initialData?.permissions || [])
    );

    const togglePermission = (resource: string, action: string) => {
        const permId = `${resource}.${action}`;
        const newPerms = new Set(selectedPerms);

        if (newPerms.has(permId)) {
            newPerms.delete(permId);
            // Logic tiện ích: nếu bỏ 'read', bó luôn mấy quyền khác của resource đó
            if (action === "read") {
                ACTIONS.forEach(a => newPerms.delete(`${resource}.${a.id}`));
            }
        } else {
            newPerms.add(permId);
            // Logic tiện ích: nếu tick 'create/update', tự tick luôn 'read'
            if (["create", "update", "delete", "manage"].includes(action)) {
                newPerms.add(`${resource}.read`);
            }
            // Logic tiện ích: nếu tick 'manage', auto tick all
            if (action === "manage") {
                ACTIONS.forEach(a => newPerms.add(`${resource}.${a.id}`));
            }
        }

        setSelectedPerms(newPerms);
    };

    const handleSave = async () => {
        if (!formData.name.trim()) {
            toast.error("Vui lòng nhập tên vai trò");
            return;
        }

        try {
            setLoading(true);
            const payload = {
                name: formData.name,
                description: formData.description,
                permissions: Array.from(selectedPerms),
            };

            if (isEdit && initialData?.id) {
                await accessControlApi.updateRole(initialData.id, payload);
                toast.success("Đã cập nhật vai trò thành công");
            } else {
                await accessControlApi.createRole(payload);
                toast.success("Tạo vai trò thành công");
            }

            router.push("/admin/access-control/roles");
        } catch (err: unknown) {
            toast.error((err as Error)?.message || "Đã có lỗi xảy ra");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                    <Button variant="outline" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">
                            {isEdit ? "Chỉnh sửa Vai trò" : "Tạo mới Vai trò"}
                        </h2>
                    </div>
                </div>
                <Button onClick={handleSave} disabled={loading}>
                    <Save className="mr-2 h-4 w-4" />
                    {loading ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Shield className="mr-2 h-5 w-5 text-primary" />
                            Thông tin chung
                        </CardTitle>
                        <CardDescription>
                            Tên giải nghĩa vai trò và mô tả quyền hạn cơ bản.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2 max-w-md">
                            <Label htmlFor="name">Tên vai trò <span className="text-red-500">*</span></Label>
                            <Input
                                id="name"
                                placeholder="VD: Content Manager"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2 max-w-xl">
                            <Label htmlFor="description">Mô tả</Label>
                            <Textarea
                                id="description"
                                placeholder="Vai trò này được phép làm những gì..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* ROLE PERMISSION GRID */}
                <Card>
                    <CardHeader>
                        <CardTitle>Bảng phân quyền (Permission Grid)</CardTitle>
                        <CardDescription>
                            Tick chọn quyền phân cấp theo từng modules của hệ thống.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border overflow-hidden">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-muted/50">
                                        <th className="p-3 text-left font-medium w-[200px]">Tài nguyên (Resource)</th>
                                        {ACTIONS.map(action => (
                                            <th key={action.id} className="p-3 text-center font-medium w-[120px]">
                                                {action.name}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {RESOURCES.map((resource) => (
                                        <tr key={resource.id} className="hover:bg-muted/20">
                                            <td className="p-3 font-medium bg-muted/5">
                                                {resource.name}
                                                <br />
                                                <span className="text-xs text-muted-foreground font-normal">{resource.id}</span>
                                            </td>
                                            {ACTIONS.map((action) => {
                                                const permId = `${resource.id}.${action.id}`;
                                                const isChecked = selectedPerms.has(permId);

                                                return (
                                                    <td key={action.id} className="p-3 text-center">
                                                        <div className="flex justify-center">
                                                            <Checkbox
                                                                checked={isChecked}
                                                                onCheckedChange={() => togglePermission(resource.id, action.id)}
                                                                aria-label={`Toggle ${permId}`}
                                                                className={isChecked ? "data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600" : ""}
                                                            />
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
