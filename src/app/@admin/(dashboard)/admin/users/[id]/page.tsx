"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Edit, ShieldPlus, Trash2, Ban } from "lucide-react";

import { Button } from "@/components/admin/ui/button";
import { Badge } from "@/components/admin/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/admin/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/admin/ui/avatar";

// Import 4 tab components
import { UserProfileTab } from "./components/user-profile-tab";
import { UserPostsTab } from "./components/user-posts-tab";
import { UserActivityTab } from "./components/user-activity-tab";
import { UserSessionsTab } from "./components/user-sessions-tab";

// Mock User Data
const MOCK_USER = {
    id: "u1",
    name: "Nguyễn Văn A",
    email: "nguyena@erg.edu.vn",
    phone: "0912.345.678",
    dob: "01/01/1990",
    gender: "Nam",
    address: "Quận 1, TP. Hồ Chí Minh",
    bio: "Senior Developer với 5 năm kinh nghiệm về Next.js và NestJS.",
    status: "Active",
    provider: "Local (email/password)",
    roles: [{ id: "1", name: "Admin" }, { id: "2", name: "Editor" }],
    createdAt: "15/01/2026",
    lastLoginAt: "2 giờ trước",
    avatarUrl: "https://i.pravatar.cc/150?u=a",
};

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const userId = resolvedParams.id;

    // Real app: Fetch user detail using userId
    const user = MOCK_USER;

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
                <Link href="/admin/users" className="hover:text-primary flex items-center">
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Quay lại danh sách
                </Link>
                <span>/</span>
                <span className="text-foreground font-medium">Chi tiết: {user.name}</span>
            </div>

            {/* Header Profile Card */}
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between bg-white border p-6 rounded-lg shadow-sm">
                <div className="flex items-center gap-6">
                    <Avatar className="h-24 w-24 border-4 border-muted">
                        <AvatarImage src={user.avatarUrl} alt={user.name} />
                        <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>

                    <div className="space-y-1">
                        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-3">
                            {user.name}
                            <Badge variant={user.status === 'Active' ? 'default' : 'outline'} className={user.status === 'Active' ? 'bg-green-600' : ''}>
                                {user.status}
                            </Badge>
                        </h2>
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-muted-foreground text-sm">
                            <span>{user.email}</span>
                            <span className="hidden sm:inline">•</span>
                            <span>{user.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 pt-2">
                            <span className="text-sm font-medium">Vai trò:</span>
                            {user.roles.map(r => (
                                <Badge key={r.id} variant="secondary" className="px-2">{r.name}</Badge>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 md:justify-end w-full md:w-auto">
                    <Button variant="outline" className="gap-2">
                        <Edit className="h-4 w-4" />
                        Sửa hồ sơ
                    </Button>
                    <Button variant="outline" className="gap-2 border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 hover:text-blue-800" asChild>
                        <Link href={`/admin/users/${userId}/permissions`}>
                            <ShieldPlus className="h-4 w-4" />
                            Phân quyền
                        </Link>
                    </Button>
                    <Button variant="outline" className="gap-2 border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100 hover:text-amber-800">
                        <Ban className="h-4 w-4" />
                        Đình chỉ
                    </Button>
                    <Button variant="destructive" className="gap-2">
                        <Trash2 className="h-4 w-4" />
                        Xóa
                    </Button>
                </div>
            </div>

            {/* Tabs Layout */}
            <Tabs defaultValue="info" className="w-full mt-6">
                <TabsList className="mb-4">
                    <TabsTrigger value="info">Thông tin hồ sơ</TabsTrigger>
                    <TabsTrigger value="posts">Bài viết</TabsTrigger>
                    <TabsTrigger value="activity">Hoạt động log</TabsTrigger>
                    <TabsTrigger value="sessions">Phiên đăng nhập</TabsTrigger>
                </TabsList>

                <TabsContent value="info" className="mt-0">
                    <UserProfileTab user={user} />
                </TabsContent>

                <TabsContent value="posts" className="mt-0">
                    <UserPostsTab userId={userId} />
                </TabsContent>

                <TabsContent value="activity" className="mt-0">
                    <UserActivityTab userId={userId} />
                </TabsContent>

                <TabsContent value="sessions" className="mt-0">
                    <UserSessionsTab userId={userId} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
