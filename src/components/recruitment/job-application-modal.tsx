"use client"

import { useState } from 'react'
import { Button } from '@/components/cms/ui/button'
import { Input } from '@/components/cms/ui/input'
import { Label } from '@/components/cms/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/cms/ui/dialog'
import { recruitmentApi } from '@/services/recruitment.api'
import { toast } from 'sonner'
import { Loader2, Upload } from 'lucide-react'

export function JobApplicationModal({
    jobId,
    jobTitle,
    isOpen,
    onClose
}: {
    jobId: string,
    jobTitle: string,
    isOpen: boolean,
    onClose: () => void
}) {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<{ trackingCode: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        formData.append('jobId', jobId);

        try {
            const res = await recruitmentApi.applyJob(formData);
            setResult({ trackingCode: res.data.trackingCode });
            toast.success("Nộp hồ sơ thành công!");
        } catch (error: any) {
            toast.error("Lỗi khi nộp hồ sơ: " + (error.message || "Vui lòng thử lại"));
        } finally {
            setIsLoading(false);
        }
    }

    const reset = () => {
        setResult(null);
        onClose();
    }

    return (
        <Dialog open={isOpen} onOpenChange={reset}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{result ? "Ứng Tuyển Thành Công!" : `Ứng tuyển: ${jobTitle}`}</DialogTitle>
                    <DialogDescription>
                        {result ? "Hồ sơ của bạn đã được gửi đến bộ phận nhân sự." : "Vui lòng điền đầy đủ thông tin bên dưới."}
                    </DialogDescription>
                </DialogHeader>

                {result ? (
                    <div className="py-6 text-center space-y-4">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <p className="text-gray-600">Mã tra cứu hồ sơ của bạn là:</p>
                        <div className="bg-gray-100 py-3 px-4 rounded-lg font-mono text-xl font-bold tracking-wider select-all cursor-pointer border border-gray-200"
                            onClick={() => {
                                navigator.clipboard.writeText(result.trackingCode);
                                toast.success("Đã copy mã tra cứu!");
                            }}
                        >
                            {result.trackingCode}
                        </div>
                        <p className="text-xs text-gray-400">Hãy lưu lại mã này để tra cứu tình trạng hồ sơ sau này.</p>

                        <div className="flex gap-2 mt-4">
                            <Button variant="outline" className="flex-1" onClick={reset}>Đóng</Button>
                            <Button className="flex-1 bg-blue-600 hover:bg-blue-700" asChild>
                                <a href={`/tuyen-dung/track/${result.trackingCode}`} target="_blank">Tra cứu ngay</a>
                            </Button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4 py-2">
                        <div className="grid gap-2">
                            <Label htmlFor="fullName">Họ và tên <span className="text-red-500">*</span></Label>
                            <Input id="fullName" name="fullName" required placeholder="Nguyễn Văn A" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                                <Input id="email" name="email" type="email" required placeholder="email@example.com" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="phone">Số điện thoại <span className="text-red-500">*</span></Label>
                                <Input id="phone" name="phone" required placeholder="09xxxxxxx" />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="cv">CV đính kèm (PDF/DOCX) <span className="text-red-500">*</span></Label>
                            <Input
                                id="cv"
                                name="file"
                                type="file"
                                accept=".pdf,.doc,.docx"
                                required
                                className="cursor-pointer"
                            />
                        </div>

                        <DialogFooter className="mt-6">
                            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>Hủy</Button>
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Gửi Hồ Sơ
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    )
}
