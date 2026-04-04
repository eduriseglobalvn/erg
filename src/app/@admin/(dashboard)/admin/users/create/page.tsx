"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, UserPlus } from "lucide-react";

import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import { Textarea } from "@/components/admin/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/admin/ui/card";
import { Checkbox } from "@/components/admin/ui/checkbox";
import { toast } from "sonner";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "@/services/users.api";
import { accessControlApi } from "@/services/access-control.api";
import { ProtectedRoute } from "@/components/admin/shared/protected-route";

export default function CreateUserPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        bio: "",
        status: "Active"
    });
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
    const queryClient = useQueryClient();

    // Fetch Roles
    const { data: rolesRes } = useQuery({
        queryKey: ['roles'],
        queryFn: () => accessControlApi.getRoles(),
    });

    const AVAILABLE_ROLES = (rolesRes as any)?.data || rolesRes || [];

    const createMutation = useMutation({
        mutationFn: (data: any) => userApi.createUser(data),
        onSuccess: () => {
            toast.success("Tạo người dùng thành công!");
            queryClient.invalidateQueries({ queryKey: ['users'] });
            router.push("/admin/users");
        },
        onError: (err: any) => {
            toast.error(err?.message || "Đã xảy ra lỗi khi tạo người dùng.");
        }
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const toggleRole = (roleId: string) => {
        setSelectedRoles(prev =>
            prev.includes(roleId) ? prev.filter(r => r !== roleId) : [...prev, roleId]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.password) {
            toast.error("Vui lòng nhập đầy đủ Tên, Email và Mật khẩu!");
            return;
        }

        const payload = {
            fullName: formData.name, // BE expects fullName
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            bio: formData.bio,
            status: formData.status === 'Active' ? 'ACTIVE' : 'INACTIVE',
            roleIds: selectedRoles,
        };

        createMutation.mutate(payload);
    };

    const isPending = createMutation.isPending;

    return (
        <ProtectedRoute permission="users.create">
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 max-w-4xl mx-auto">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
                <Link href="/admin/users" className="hover:text-primary flex items-center">
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Quay lại danh sách
                </Link>
                <span>/</span>
                <span className="text-foreground font-medium">Tạo mới</span>
            </div>

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Tạo người dùng mới</h2>
                    <p className="text-muted-foreground mt-1">
                        Thêm một quản trị viên hoặc nhân viên mới vào hệ thống.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid gap-6 md:grid-cols-3">
                    {/* Main Info */}
                    <div className="md:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Thông tin cơ bản</CardTitle>
                                <CardDescription>Các thông tin dùng để đăng nhập và định danh</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Họ và tên *</Label>
                                    <Input
                                        id="name" name="name"
                                        placeholder="VD: Nguyễn Văn A"
                                        value={formData.name} onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email đăng nhập *</Label>
                                        <Input
                                            id="email" name="email" type="email"
                                            placeholder="admin@erg.edu.vn"
                                            value={formData.email} onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="password">Mật khẩu khởi tạo *</Label>
                                        <Input
                                            id="password" name="password" type="password"
                                            placeholder="••••••••"
                                            value={formData.password} onChange={handleInputChange}
                                            required
                                        />
                                        <p className="text-xs text-muted-foreground">User có thể đổi mật khẩu sau khi đăng nhập.</p>
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="phone">Số điện thoại</Label>
                                    <Input
                                        id="phone" name="phone"
                                        placeholder="VD: 0912345678"
                                        value={formData.phone} onChange={handleInputChange}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="bio">Ghi chú / Trích yếu</Label>
                                    <Textarea
                                        id="bio" name="bio" rows={4}
                                        placeholder="Các thông tin nội bộ về nhân sự này..."
                                        value={formData.bio} onChange={handleInputChange}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar Settings */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Trạng thái & Quyền</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-3">
                                    <Label>Trạng thái tài khoản</Label>
                                    <div className="flex items-center space-x-2">
                                        <input type="radio" id="st_active" name="status" value="Active"
                                            checked={formData.status === 'Active'}
                                            onChange={handleInputChange}
                                            className="mr-2"
                                        />
                                        <Label htmlFor="st_active" className="font-normal">Hoạt động (Active)</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input type="radio" id="st_inactive" name="status" value="Inactive"
                                            checked={formData.status === 'Inactive'}
                                            onChange={handleInputChange}
                                            className="mr-2"
                                        />
                                        <Label htmlFor="st_inactive" className="font-normal text-muted-foreground">Đình chỉ (Inactive)</Label>
                                    </div>
                                </div>

                                <div className="space-y-3 pt-4 border-t">
                                    <Label>Phân vai trò (Roles)</Label>
                                    <p className="text-xs text-muted-foreground mb-2">Chọn ít nhất một vai trò dành cho user này.</p>

                                    {AVAILABLE_ROLES.map((role: any) => (
                                        <div key={role.id || role._id} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`role_${role.id || role._id}`}
                                                checked={selectedRoles.includes(role.id || role._id)}
                                                onCheckedChange={() => toggleRole(role.id || role._id)}
                                            />
                                            <label
                                                htmlFor={`role_${role.id || role._id}`}
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                            >
                                                {role.name}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                            <CardFooter className="bg-muted/50 border-t p-4 flex justify-between">
                                <Link href="/admin/users">
                                    <Button type="button" variant="ghost">Hủy</Button>
                                </Link>
                                <Button type="submit" disabled={isPending} className="gap-2">
                                    {isPending ? "Đang lưu..." : (
                                        <>
                                            <Save className="h-4 w-4" />
                                            Lưu người dùng
                                        </>
                                    )}
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </form>
        </div>
        </ProtectedRoute>
    );
}
