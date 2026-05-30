import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/cms/ui/dialog"
import { Button } from "@/components/cms/ui/button"
import { Textarea } from "@/components/cms/ui/textarea"
import { Star } from "lucide-react"

interface ReviewReplyDialogProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (reply: string) => void
    review: {
        userName: string
        rating: number
        comment: string
        adminReply?: string
    } | null
    isSubmitting?: boolean
}

export function ReviewReplyDialog({ isOpen, onClose, onSubmit, review, isSubmitting }: ReviewReplyDialogProps) {
    const [replyText, setReplyText] = useState(review?.adminReply || "");

    // Cập nhật text khi mở dialog với review mới
    if (isOpen && review?.adminReply && replyText === "" && !isSubmitting) {
        setReplyText(review.adminReply);
    }

    if (!review) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        💬 Phản hồi đánh giá
                    </DialogTitle>
                    <DialogDescription>
                        Viết phản hồi công khai cho đánh giá dưới tên EduRise Global.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-2">
                    {/* User Review Summary */}
                    <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-lg mb-4 text-sm border">
                        <div className="font-semibold flex items-center gap-2 mb-1">
                            {review.userName}
                            <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-3 h-3 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} />
                                ))}
                            </div>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 italic">"{review.comment}"</p>
                    </div>

                    {/* Admin Reply Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold">Phản hồi từ EduRise Global:</label>
                        <Textarea
                            placeholder="Cảm ơn bạn đã đánh giá! Chúng tôi rất vui khi khóa học hữu ích..."
                            className="min-h-[120px]"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Hủy</Button>
                    <Button
                        onClick={() => onSubmit(replyText)}
                        disabled={!replyText.trim() || isSubmitting}
                    >
                        {isSubmitting ? "Đang gửi..." : "Gửi phản hồi"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
