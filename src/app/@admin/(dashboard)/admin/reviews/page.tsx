"use client"

import React, { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { reviewsApi } from "@/services/reviews.api"
import { Star, CheckCircle2, XCircle, MessageSquare, Pin, Filter, Loader2, ShieldAlert } from "lucide-react"
import { Button } from "@/components/admin/ui/button"
import { Badge } from "@/components/admin/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/admin/ui/select"
import { toast } from "sonner"
import { ReviewReplyDialog } from "@/components/admin/reviews/review-reply-dialog"

export default function AdminReviewsPage() {
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [typeFilter, setTypeFilter] = useState<string>("all");
    const [ratingFilter, setRatingFilter] = useState<string>("all");

    const [replyDialog, setReplyDialog] = useState<{ isOpen: boolean, review: any }>({ isOpen: false, review: null });

    const queryClient = useQueryClient();

    // 1. Fetch Reviews
    const { data: reviewsData, isLoading } = useQuery({
        queryKey: ['admin-reviews', statusFilter, typeFilter, ratingFilter],
        queryFn: () => reviewsApi.getAdminAll({
            status: statusFilter !== 'all' ? statusFilter as any : undefined,
            targetType: typeFilter !== 'all' ? typeFilter : undefined,
            rating: ratingFilter !== 'all' ? parseInt(ratingFilter) : undefined,
            limit: 50
        })
    });

    const reviews = reviewsData?.data || [];
    const stats = reviewsData?.stats;

    // --- Action Mutations ---
    const { mutate: approveReview } = useMutation({
        mutationFn: reviewsApi.approve,
        onSuccess: () => {
            toast.success("Đã duyệt đánh giá!");
            queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
        }
    });

    const { mutate: rejectReview } = useMutation({
        mutationFn: ({ id, reason }: { id: string, reason: string }) => reviewsApi.reject(id, reason),
        onSuccess: () => {
            toast.success("Đã từ chối đánh giá!");
            queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
        }
    });

    const { mutate: replyReview, isPending: isReplying } = useMutation({
        mutationFn: ({ id, reply }: { id: string, reply: string }) => reviewsApi.reply(id, reply),
        onSuccess: () => {
            toast.success("Đã gửi phản hồi thành công!");
            setReplyDialog({ isOpen: false, review: null });
            queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
        }
    });

    const { mutate: featureReview } = useMutation({
        mutationFn: ({ id, isFeatured }: { id: string, isFeatured: boolean }) => reviewsApi.feature(id, isFeatured),
        onSuccess: (data: any, variables) => {
            toast.success(variables.isFeatured ? "Đã đánh dấu nổi bật" : "Đã bỏ nổi bật");
            queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
        }
    });

    // --- Render Helpers ---
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved': return <Badge className="bg-green-100 text-green-700 hover:bg-green-200">Đã duyệt</Badge>;
            case 'rejected': return <Badge className="bg-red-100 text-red-700 hover:bg-red-200">Từ chối</Badge>;
            default: return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200">Chờ duyệt</Badge>;
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <MessageSquare className="h-6 w-6 text-indigo-600" />
                    Quản Lý Đánh Giá
                </h1>
            </div>

            {/* Dashboard Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-amber-50 to-white border-amber-100 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-amber-800">Chờ duyệt</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-amber-600">12</div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-emerald-50 to-white border-emerald-100 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-emerald-800">Đã duyệt</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-emerald-600">234</div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-rose-50 to-white border-rose-100 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-rose-800">Từ chối / Spam</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-rose-600">8</div>
                    </CardContent>
                </Card>
                <Card className="shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Tổng đánh giá</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-800">254</div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <Filter className="h-5 w-5 text-slate-400" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tất cả trạng thái</SelectItem>
                        <SelectItem value="pending">Chờ duyệt</SelectItem>
                        <SelectItem value="approved">Đã duyệt</SelectItem>
                        <SelectItem value="rejected">Từ chối</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Loại nội dung" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tất cả nội dung</SelectItem>
                        <SelectItem value="course">Khóa học</SelectItem>
                        <SelectItem value="post">Bài viết</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={ratingFilter} onValueChange={setRatingFilter}>
                    <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Đánh giá sao" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tất cả số sao</SelectItem>
                        <SelectItem value="5">5 Sao</SelectItem>
                        <SelectItem value="4">4 Sao</SelectItem>
                        <SelectItem value="3">3 Sao</SelectItem>
                        <SelectItem value="2">2 Sao</SelectItem>
                        <SelectItem value="1">1 Sao</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
                {isLoading ? (
                    <div className="text-center py-20 flex flex-col items-center text-slate-500">
                        <Loader2 className="h-8 w-8 animate-spin mb-4" />
                        Đang tải danh sách đánh giá...
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="text-center py-20 bg-slate-50 border border-dashed rounded-xl text-slate-500">
                        Không tìm thấy đánh giá nào phù hợp với bộ lọc.
                    </div>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className={`bg-white rounded-xl border p-5 shadow-sm transition-colors hover:border-indigo-200 ${review.status === 'pending' ? 'border-amber-200 ring-1 ring-amber-100' : 'border-slate-200'}`}>
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                <div className="flex-1 space-y-3">
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold text-slate-800">{review.userName}</span>
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`w-4 h-4 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-slate-200 fill-slate-200"}`} />
                                            ))}
                                        </div>
                                        {getStatusBadge(review.status || 'pending')}
                                        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                                            {review.targetType === 'course' ? 'Khóa học' : 'Bài viết'}
                                        </span>
                                        {review.isFeatured && (
                                            <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-0.5 rounded-full flex items-center">
                                                <Pin className="w-3 h-3 mr-1" /> Nổi bật
                                            </span>
                                        )}
                                    </div>

                                    <div className="bg-slate-50 p-4 rounded-lg text-slate-700 text-sm leading-relaxed border border-slate-100">
                                        {review.comment}
                                    </div>

                                    <div className="flex items-center gap-4 text-xs text-slate-500">
                                        <span className="font-medium">{new Date(review.createdAt).toLocaleString("vi-VN")}</span>
                                        {review.isVerifiedPurchase ? (
                                            <span className="text-green-600 font-medium flex items-center"><CheckCircle2 className="w-3 h-3 mr-1" /> Đã mua khóa học</span>
                                        ) : (
                                            <span className="text-slate-400 flex items-center"><ShieldAlert className="w-3 h-3 mr-1" /> Chưa xác thực</span>
                                        )}
                                        <span>IP: 14.123.xx.xx</span>
                                    </div>

                                    {review.adminReply && (
                                        <div className="mt-3 bg-indigo-50/50 p-3 rounded-lg border border-indigo-100 text-sm">
                                            <div className="font-semibold text-indigo-700 mb-1 flex items-center gap-1.5">
                                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                                                Phản hồi từ ERG:
                                            </div>
                                            <p className="text-slate-700 pl-3">{review.adminReply}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex flex-row md:flex-col gap-2 shrink-0 border-t md:border-t-0 pt-4 md:pt-0">
                                    {review.status !== 'approved' && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="bg-green-50 hover:bg-green-100 text-green-700 hover:text-green-800 border-green-200 justify-start"
                                            onClick={() => approveReview(review.id)}
                                        >
                                            <CheckCircle2 className="w-4 h-4 mr-2" /> Duyệt
                                        </Button>
                                    )}

                                    {review.status !== 'rejected' && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-800 border-rose-200 justify-start"
                                            onClick={() => {
                                                const reason = window.prompt("Lý do từ chối (Spam, Quảng cáo, Tiêu cực...)?");
                                                if (reason !== null) rejectReview({ id: review.id, reason });
                                            }}
                                        >
                                            <XCircle className="w-4 h-4 mr-2" /> Từ chối
                                        </Button>
                                    )}

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="justify-start"
                                        onClick={() => setReplyDialog({ isOpen: true, review })}
                                    >
                                        <MessageSquare className="w-4 h-4 mr-2" /> Phản hồi
                                    </Button>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className={`justify-start ${review.isFeatured ? 'bg-purple-100 border-purple-200 text-purple-700' : ''}`}
                                        onClick={() => featureReview({ id: review.id, isFeatured: !review.isFeatured })}
                                    >
                                        <Pin className={`w-4 h-4 mr-2 ${review.isFeatured ? 'fill-current' : ''}`} />
                                        {review.isFeatured ? 'Bỏ nổi bật' : 'Nổi bật'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Reply Dialog */}
            <ReviewReplyDialog
                isOpen={replyDialog.isOpen}
                review={replyDialog.review}
                onClose={() => setReplyDialog({ isOpen: false, review: null })}
                onSubmit={(reply) => replyReview({ id: replyDialog.review.id, reply })}
                isSubmitting={isReplying}
            />
        </div>
    );
}
