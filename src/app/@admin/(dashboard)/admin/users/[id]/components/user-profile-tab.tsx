"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/admin/ui/card";
import { Badge } from "@/components/admin/ui/badge";

export function UserProfileTab({ user }: { user: Record<string, any> }) {
    return (
        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Thông tin cá nhân</CardTitle>
                    <CardDescription>Các thông tin cơ bản của người dùng</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                    <div className="grid grid-cols-3 gap-2 py-2 border-b">
                        <div className="text-muted-foreground font-medium">Họ tên</div>
                        <div className="col-span-2 font-medium">{user.name}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 py-2 border-b">
                        <div className="text-muted-foreground font-medium">Email</div>
                        <div className="col-span-2">{user.email}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 py-2 border-b">
                        <div className="text-muted-foreground font-medium">Số điện thoại</div>
                        <div className="col-span-2">{user.phone || <i>Chưa cập nhật</i>}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 py-2 border-b">
                        <div className="text-muted-foreground font-medium">Ngày sinh</div>
                        <div className="col-span-2">{user.dob || <i>Chưa cập nhật</i>}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 py-2 border-b">
                        <div className="text-muted-foreground font-medium">Giới tính</div>
                        <div className="col-span-2">{user.gender || <i>Chưa cập nhật</i>}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 py-2 border-b">
                        <div className="text-muted-foreground font-medium">Địa chỉ</div>
                        <div className="col-span-2">{user.address || <i>Chưa cập nhật</i>}</div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Tài khoản & Hệ thống</CardTitle>
                    <CardDescription>Thông tin system của tài khoản</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                    <div className="grid grid-cols-3 gap-2 py-2 border-b">
                        <div className="text-muted-foreground font-medium">Trạng thái</div>
                        <div className="col-span-2">
                            <Badge variant={user.status === 'Active' ? 'default' : 'outline'} className={user.status === 'Active' ? 'bg-green-600' : ''}>
                                {user.status}
                            </Badge>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 py-2 border-b">
                        <div className="text-muted-foreground font-medium">Provider</div>
                        <div className="col-span-2">{user.provider}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 py-2 border-b">
                        <div className="text-muted-foreground font-medium">Ngày tạo</div>
                        <div className="col-span-2">{user.createdAt}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 py-2 border-b">
                        <div className="text-muted-foreground font-medium">Đăng nhập l.cận</div>
                        <div className="col-span-2">{user.lastLoginAt || <i>Chưa bao giờ</i>}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 py-2 border-b">
                        <div className="text-muted-foreground font-medium">Hoàn thiện HS</div>
                        <div className="col-span-2">
                            <span className="text-green-600 font-medium">✅ 100% (Completed)</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="md:col-span-2">
                <CardHeader>
                    <CardTitle>Bio / Giới thiệu</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground italic">
                        {user.bio || "Người dùng chưa cập nhật thông tin giới thiệu bản thân."}
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
