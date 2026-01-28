"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/admin/ui/card"
import { Button } from "@/components/admin/ui/button"
import { Badge } from "@/components/admin/ui/badge"
import { Can } from "@/components/admin/shared/can"
import { usePermissions, useRoles } from "@/hooks/use-permission"
import { Shield, CheckCircle, XCircle, Info } from "lucide-react"

export default function PermissionsTestPage() {
    const permissions = usePermissions()
    const roles = useRoles()

    // Danh sách permissions để test
    const testPermissions = [
        { name: "posts.create", label: "Tạo bài viết" },
        { name: "posts.update", label: "Sửa bài viết" },
        { name: "posts.delete", label: "Xóa bài viết" },
        { name: "users.read", label: "Xem danh sách user" },
        { name: "users.create", label: "Tạo user mới" },
        { name: "users.update", label: "Cập nhật user" },
        { name: "users.delete", label: "Xóa user" },
        { name: "roles.read", label: "Xem roles" },
        { name: "roles.create", label: "Tạo role" },
        { name: "roles.update", label: "Cập nhật role" },
        { name: "roles.assign", label: "Gán role cho user" },
        { name: "system.settings", label: "Cài đặt hệ thống" },
        { name: "system.logs", label: "Xem logs hệ thống" },
    ]

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Shield className="h-8 w-8 text-blue-600" />
                    Permission System Test
                </h1>
                <p className="text-muted-foreground mt-2">
                    Trang này giúp bạn kiểm tra hệ thống phân quyền
                </p>
            </div>

            {/* Current User Info */}
            <Card>
                <CardHeader>
                    <CardTitle>Thông tin phân quyền hiện tại</CardTitle>
                    <CardDescription>
                        Roles và Permissions của tài khoản đang đăng nhập
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Roles */}
                    <div>
                        <h3 className="text-sm font-semibold mb-2">Roles:</h3>
                        <div className="flex flex-wrap gap-2">
                            {roles.length > 0 ? (
                                roles.map((role) => (
                                    <Badge key={role} variant="default" className="bg-blue-600">
                                        {role}
                                    </Badge>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground">Không có role nào</p>
                            )}
                        </div>
                    </div>

                    {/* Permissions */}
                    <div>
                        <h3 className="text-sm font-semibold mb-2">
                            Permissions ({permissions.length}):
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {permissions.length > 0 ? (
                                permissions.map((permission) => (
                                    <Badge key={permission} variant="outline" className="text-xs">
                                        {permission}
                                    </Badge>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground">Không có permission nào</p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Permission Tests */}
            <Card>
                <CardHeader>
                    <CardTitle>Kiểm tra từng Permission</CardTitle>
                    <CardDescription>
                        Danh sách các permissions phổ biến và trạng thái của bạn
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {testPermissions.map((perm) => {
                            const hasPermission = permissions.includes(perm.name)
                            return (
                                <div
                                    key={perm.name}
                                    className={`p-3 rounded-lg border ${hasPermission
                                            ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30"
                                            : "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30"
                                        }`}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">
                                                {perm.label}
                                            </p>
                                            <p className="text-xs text-muted-foreground font-mono">
                                                {perm.name}
                                            </p>
                                        </div>
                                        {hasPermission ? (
                                            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                                        ) : (
                                            <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Can Component Demo */}
            <Card>
                <CardHeader>
                    <CardTitle>Demo Component &lt;Can&gt;</CardTitle>
                    <CardDescription>
                        Ví dụ sử dụng component Can để ẩn/hiện UI dựa trên permission
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Example 1: Show/Hide button */}
                    <div className="space-y-2">
                        <h4 className="text-sm font-semibold">Ví dụ 1: Ẩn/Hiện nút</h4>
                        <div className="flex gap-2">
                            <Can permission="posts.create">
                                <Button className="bg-green-600 hover:bg-green-700">
                                    ✓ Tạo bài viết (Bạn có quyền)
                                </Button>
                            </Can>
                            <Can
                                permission="posts.delete"
                                fallback={
                                    <Button variant="outline" disabled>
                                        ✗ Xóa bài viết (Không có quyền)
                                    </Button>
                                }
                            >
                                <Button variant="destructive">
                                    ✓ Xóa bài viết (Bạn có quyền)
                                </Button>
                            </Can>
                        </div>
                    </div>

                    {/* Example 2: Show message */}
                    <div className="space-y-2">
                        <h4 className="text-sm font-semibold">Ví dụ 2: Hiển thị thông báo</h4>
                        <Can
                            permission="users.delete"
                            fallback={
                                <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-900 rounded-lg">
                                    <Info className="h-5 w-5 text-yellow-600" />
                                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                        Bạn không có quyền xóa user. Liên hệ admin để được cấp quyền.
                                    </p>
                                </div>
                            }
                        >
                            <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                                <p className="text-sm text-green-800 dark:text-green-200">
                                    Bạn có quyền xóa user. Hãy cẩn thận khi sử dụng quyền này!
                                </p>
                            </div>
                        </Can>
                    </div>

                    {/* Example 3: Admin section */}
                    <div className="space-y-2">
                        <h4 className="text-sm font-semibold">Ví dụ 3: Khu vực Admin</h4>
                        <Can
                            permission="system.settings"
                            fallback={
                                <div className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-center">
                                    <p className="text-sm text-muted-foreground">
                                        Khu vực này chỉ dành cho Admin
                                    </p>
                                </div>
                            }
                        >
                            <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 border border-purple-200 dark:border-purple-900 rounded-lg">
                                <h5 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
                                    🎉 Chào mừng Admin!
                                </h5>
                                <p className="text-sm text-purple-800 dark:text-purple-200">
                                    Bạn có quyền truy cập vào tất cả các cài đặt hệ thống.
                                </p>
                            </div>
                        </Can>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
