"use client"

import * as React from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { reviewsApi, Review, ReviewStats } from "@/services/reviews.api"
import { Star, User, Loader2, CheckCircle2, ChevronDown, ThumbsUp, Pin } from "lucide-react"
import { Button } from "@/components/admin/ui/button"
import { Textarea } from "@/components/admin/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/admin/ui/select"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"

interface ReviewsProps {
    targetId: string;
    targetType?: 'post' | 'course' | 'product';
    className?: string;
}

export function Reviews({ targetId, targetType = 'post', className }: ReviewsProps) {
    const [rating, setRating] = React.useState(0)
    const [hoverRating, setHoverRating] = React.useState(0)
    const [comment, setComment] = React.useState("")
    const [sortBy, setSortBy] = React.useState<'newest' | 'highest' | 'lowest' | 'helpful'>('newest')
    const queryClient = useQueryClient()
    const { data: auth } = useAuth()

    // 1. Fetch Reviews
    const { data: reviewsData, isLoading } = useQuery({
        queryKey: ['reviews', targetId, sortBy],
        queryFn: () => reviewsApi.getAll({ targetId, limit: 10, sort: sortBy })
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
        if (comment.trim().length < 20) return toast.warning("Nội dung chia sẻ trải nghiệm quá ngắn (Tối thiểu 20 ký tự).")

        submitReview({
            targetId,
            targetType,
            rating,
            comment,
            userName: auth?.user?.fullName || "Khách"
        })
    }

    const { mutate: markHelpful } = useMutation({
        mutationFn: reviewsApi.markHelpful,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reviews', targetId, sortBy] })
        },
        onError: () => {
            toast.error("Không thể ghi nhận tại thời điểm này.")
        }
    })

    const reviews = reviewsData?.data || []
    const stats: ReviewStats | undefined = reviewsData?.stats

    const renderDistribution = () => {
        if (!stats || !stats.distribution) return null;

        return (
            <div className="space-y-2 flex-grow max-w-sm">
                {[5, 4, 3, 2, 1].map((star) => {
                    const count = stats.distribution?.[star] || 0;
                    const percent = stats.count > 0 ? (count / stats.count) * 100 : 0;

                    return (
                        <div key={star} className="flex items-center text-sm">
                            <div className="w-12 flex items-center gap-1 text-slate-600 font-medium">
                                {star} <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            </div>
                            <div className="flex-1 h-2 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden mx-3">
                                <div
                                    className="h-full bg-amber-400 rounded-full"
                                    style={{ width: `${percent}%` }}
                                />
                            </div>
                            <div className="w-12 text-right text-slate-500 text-xs">
                                {Math.round(percent)}%
                            </div>
                        </div>
                    );
                })}
            </div>
        )
    }

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

                <p className="text-xs text-slate-500 mb-4 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Thêm đánh giá tối thiểu 20 ký tự. Đánh giá sẽ được kiểm duyệt trước khi hiển thị công khai.
                </p>

                <Button onClick={handleSubmit} disabled={isPending}>
                    {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Gửi đánh giá
                </Button>
            </div>

            {/* --- DANH SÁCH ĐÁNH GIÁ --- */}
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6 md:items-center bg-white dark:bg-zinc-900/40 p-6 rounded-2xl border border-slate-100 dark:border-zinc-800">
                    <div className="shrink-0 text-center md:text-left">
                        <h3 className="text-xl font-bold mb-2 flex items-center justify-center md:justify-start gap-2">
                            Đánh giá từ cộng đồng
                        </h3>
                        {stats?.average ? (
                            <div className="flex flex-col items-center md:items-start gap-1">
                                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
                                    {stats.average.toFixed(1)}/5
                                </span>
                                <div className="flex items-center text-amber-400 gap-0.5">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star key={star} className={cn("w-4 h-4", star <= Math.round(stats.average) ? "fill-amber-400 text-amber-400" : "text-slate-200 fill-slate-200")} />
                                    ))}
                                </div>
                                <span className="text-sm text-slate-500 mt-1">Dựa trên {stats.count} đánh giá</span>
                            </div>
                        ) : null}
                    </div>

                    <div className="hidden md:block w-px h-24 bg-slate-100 dark:bg-zinc-800 shrink-0 mx-4" />

                    <div className="flex-1 min-w-[200px] w-full max-w-sm mx-auto md:mx-0">
                        {renderDistribution()}
                    </div>
                </div>

                <div className="flex items-center justify-between mt-8 mb-4">
                    <h4 className="font-semibold text-slate-800 dark:text-slate-200">Reviews ({stats?.count || 0})</h4>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <span className="hidden sm:inline">Sắp xếp theo:</span>
                        <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
                            <SelectTrigger className="w-[140px] h-8 text-xs bg-white dark:bg-black">
                                <SelectValue placeholder="Sắp xếp theo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="newest">Mới nhất</SelectItem>
                                <SelectItem value="highest">Điểm cao nhất</SelectItem>
                                <SelectItem value="lowest">Điểm thấp nhất</SelectItem>
                                <SelectItem value="helpful">Hữu ích nhất</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
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

                                <div className="space-y-3 w-full">
                                    <div className="flex items-start justify-between flex-wrap gap-2">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                            <span className="font-bold text-sm flex items-center gap-1">
                                                {review.userName}
                                                {review.isVerifiedPurchase && (
                                                    <span className="bg-green-100 text-green-700 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-sm flex items-center ml-1">
                                                        <CheckCircle2 className="w-3 h-3 mr-0.5" /> Đã xác thực
                                                    </span>
                                                )}
                                            </span>
                                            <div className="flex">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={cn("w-3.5 h-3.5", i < review.rating ? "fill-amber-400 text-amber-400" : "text-slate-200")}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {review.isFeatured && (
                                                <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center">
                                                    <Pin className="w-3 h-3 mr-1" /> Nổi bật
                                                </span>
                                            )}
                                            <span className="text-xs text-slate-400">
                                                {new Date(review.createdAt).toLocaleDateString("vi-VN", { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>

                                    <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                                        {review.comment}
                                    </p>

                                    {/* Admin Reply Section */}
                                    {review.adminReply && (
                                        <div className="mt-3 bg-slate-50 dark:bg-white/5 p-3 rounded-lg border-l-2 border-indigo-500 text-sm">
                                            <div className="font-semibold text-indigo-700 dark:text-indigo-400 mb-1 flex items-center gap-1.5">
                                                <div className="w-4 h-4 bg-indigo-100 rounded-full flex items-center justify-center"><CheckCircle2 className="w-3 h-3 text-indigo-600" /></div>
                                                Phản hồi từ EduRise Global:
                                            </div>
                                            <p className="text-slate-600 dark:text-slate-400 pl-5 leading-relaxed">{review.adminReply}</p>
                                        </div>
                                    )}

                                    {/* Helpful Action */}
                                    <div className="flex items-center gap-4 pt-2">
                                        <button
                                            className="text-xs font-medium text-slate-500 hover:text-indigo-600 flex items-center gap-1.5 transition-colors focus:outline-none"
                                            onClick={() => markHelpful(review.id)}
                                        >
                                            <ThumbsUp className="w-3.5 h-3.5" />
                                            {review.helpfulCount ? `${review.helpfulCount} người thấy hữu ích` : "Hữu ích"}
                                        </button>
                                    </div>
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
