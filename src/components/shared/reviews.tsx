"use client"

import * as React from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { reviewsApi, Review } from "@/services/reviews.api"
import { Star, User, Loader2 } from "lucide-react"
import { Button } from "@/components/admin/ui/button"
import { Textarea } from "@/components/admin/ui/textarea"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface ReviewsProps {
    targetId: string;
    targetType?: 'post' | 'course' | 'product';
    className?: string;
}

export function Reviews({ targetId, targetType = 'post', className }: ReviewsProps) {
    const [rating, setRating] = React.useState(0)
    const [hoverRating, setHoverRating] = React.useState(0)
    const [comment, setComment] = React.useState("")
    const queryClient = useQueryClient()

    // 1. Fetch Reviews
    const { data: reviewsData, isLoading } = useQuery({
        queryKey: ['reviews', targetId],
        queryFn: () => reviewsApi.getAll({ targetId, limit: 10 })
    })

    // 2. Submit Review
    const { mutate: submitReview, isPending } = useMutation({
        mutationFn: reviewsApi.create,
        onSuccess: () => {
            toast.success("Cảm ơn đánh giá của bạn!")
            setRating(0)
            setComment("")
            queryClient.invalidateQueries({ queryKey: ['reviews', targetId] })
        },
        onError: () => {
            toast.error("Có lỗi xảy ra, vui lòng thử lại.")
        }
    })

    const handleSubmit = () => {
        if (rating === 0) return toast.warning("Vui lòng chọn số sao đánh giá")
        if (comment.length < 10) return toast.warning("Nội dung đánh giá quá ngắn")

        submitReview({
            targetId,
            targetType,
            rating,
            comment,
            userName: "Khách" // TODO: Lấy tên user thật nếu đã login
        })
    }

    const reviews = reviewsData?.data || []
    const stats = reviewsData?.stats

    return (
        <div className={cn("space-y-8", className)}>

            {/* --- FORM ĐÁNH GIÁ --- */}
            <div className="bg-slate-50 dark:bg-zinc-900/50 p-6 rounded-2xl border border-slate-100 dark:border-zinc-800">
                <h3 className="text-lg font-bold mb-4">Đánh giá bài viết này</h3>

                <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            className="focus:outline-none transition-transform hover:scale-110"
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setRating(star)}
                        >
                            <Star
                                className={cn(
                                    "w-8 h-8 transition-colors",
                                    (hoverRating || rating) >= star
                                        ? "fill-amber-400 text-amber-400"
                                        : "text-slate-300"
                                )}
                            />
                        </button>
                    ))}
                    <span className="ml-2 text-sm text-slate-500 font-medium self-center">
                        {rating > 0 ? (rating === 5 ? "Tuyệt vời!" : rating === 1 ? "Tệ quá" : `${rating} Sao`) : ""}
                    </span>
                </div>

                <Textarea
                    placeholder="Chia sẻ cảm nhận của bạn về nội dung này..."
                    className="min-h-[100px] mb-4 bg-white dark:bg-black"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />

                <Button onClick={handleSubmit} disabled={isPending}>
                    {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Gửi đánh giá
                </Button>
            </div>

            {/* --- DANH SÁCH ĐÁNH GIÁ --- */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        Đánh giá từ cộng đồng
                        {stats?.count ? <span className="text-sm font-normal text-slate-500">({stats.count})</span> : null}
                    </h3>

                    {stats?.average ? (
                        <div className="flex items-center gap-2 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-sm font-bold border border-amber-100">
                            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                            {stats.average.toFixed(1)}/5
                        </div>
                    ) : null}
                </div>

                {isLoading ? (
                    <div className="text-center py-10 opacity-50">Đang tải đánh giá...</div>
                ) : reviews.length > 0 ? (
                    <div className="grid gap-4">
                        {reviews.map((review) => (
                            <div key={review.id} className="flex gap-4 p-4 rounded-xl border border-slate-100 dark:border-zinc-800 bg-white dark:bg-black hover:shadow-sm transition-shadow">
                                <div className="shrink-0 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                                    <User className="w-5 h-5 text-slate-400" />
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-sm">{review.userName}</span>
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={cn("w-3 h-3", i < review.rating ? "fill-amber-400 text-amber-400" : "text-slate-200")}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-xs text-slate-400">
                                            • {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                                        </span>
                                    </div>
                                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                                        {review.comment}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 text-slate-400 italic bg-slate-50/50 rounded-xl border border-dashed">
                        Chưa có đánh giá nào. Hãy là người đầu tiên!
                    </div>
                )}
            </div>
        </div>
    )
}
