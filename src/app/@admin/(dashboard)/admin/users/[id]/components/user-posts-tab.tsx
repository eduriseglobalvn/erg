"use client";

import { Badge } from "@/components/admin/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/admin/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/admin/ui/card";

export function UserPostsTab({ userId }: { userId: string }) {
    // Mock data for user's posts
    const posts = [
        { id: 1, title: "Hướng dẫn cài đặt Next.js 14", status: "Published", seoScore: 85, date: "2026-02-25" },
        { id: 2, title: "Tính năng mới trong TypeScript 5.4", status: "Draft", seoScore: 60, date: "2026-02-26" },
        { id: 3, title: "Tối ưu hóa SEO cho website React", status: "Published", seoScore: 92, date: "2026-02-27" },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Bài viết đã tạo</CardTitle>
                <CardDescription>Danh sách các bài viết do người dùng này đóng góp</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tiêu đề</TableHead>
                                <TableHead className="w-[120px]">Trạng thái</TableHead>
                                <TableHead className="w-[120px]">SEO Score</TableHead>
                                <TableHead className="w-[150px]">Ngày đăng</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {posts.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                        Người dùng chưa có bài viết nào
                                    </TableCell>
                                </TableRow>
                            ) : (
                                posts.map((post) => (
                                    <TableRow key={post.id}>
                                        <TableCell className="font-medium">{post.title}</TableCell>
                                        <TableCell>
                                            <Badge variant={post.status === 'Published' ? 'default' : 'secondary'} className={post.status === 'Published' ? 'bg-blue-600' : ''}>
                                                {post.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`font-semibold ${post.seoScore >= 80 ? 'text-green-600' : 'text-yellow-600'}`}>
                                                {post.seoScore}/100
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground text-sm">{post.date}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
