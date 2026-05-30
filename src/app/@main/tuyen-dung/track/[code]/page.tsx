"use client"

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/cms/ui/button'
import { Input } from '@/components/cms/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/cms/ui/card'
import { Search, CheckCircle, Clock, XCircle, FileText, User } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { recruitmentApi } from '@/services/recruitment.api'
import { CandidateStatus } from '@/types/recruitment'

export default function CandidateTrackingPage() {
    const params = useParams();
    const router = useRouter();
    const urlCode = params?.code as string;
    const [inputCode, setInputCode] = useState(urlCode || "");

    // Nếu có code trên url thì tự fetch
    const { data: candidate, isLoading, error } = useQuery({
        queryKey: ['tracking', urlCode],
        queryFn: () => recruitmentApi.trackCandidate(urlCode).then(res => res.data),
        enabled: !!urlCode
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputCode.trim()) {
            router.push(`/tuyen-dung/track/${inputCode.trim()}`);
        }
    }

    const getStatusInfo = (status: CandidateStatus) => {
        switch (status) {
            case CandidateStatus.PENDING: return { color: "bg-yellow-100 text-yellow-700", icon: Clock, label: "Chờ xử lý" };
            case CandidateStatus.REVIEWING: return { color: "bg-blue-100 text-blue-700", icon: FileText, label: "Đang xem xét hồ sơ" };
            case CandidateStatus.INTERVIEW: return { color: "bg-purple-100 text-purple-700", icon: User, label: "Mời phỏng vấn" };
            case CandidateStatus.OFFER: return { color: "bg-pink-100 text-pink-700", icon: CheckCircle, label: "Gửi lời mời làm việc" };
            case CandidateStatus.HIRED: return { color: "bg-green-100 text-green-700", icon: CheckCircle, label: "Đã tuyển dụng" };
            case CandidateStatus.REJECTED: return { color: "bg-red-100 text-red-700", icon: XCircle, label: "Hồ sơ không phù hợp" };
            default: return { color: "bg-gray-100", icon: Clock, label: "Không xác định" };
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Tra Cứu Hồ Sơ</h1>
                    <p className="text-gray-500 mt-2">Nhập mã hồ sơ của bạn để kiểm tra trạng thái</p>
                </div>

                {/* Search Form */}
                <Card className="shadow-lg border-0">
                    <CardContent className="pt-6">
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <Input
                                placeholder="Nhập mã hồ sơ (VD: REF-123456)"
                                value={inputCode}
                                onChange={(e) => setInputCode(e.target.value)}
                                className="uppercase font-mono"
                            />
                            <Button type="submit" disabled={!inputCode.trim()}>
                                <Search className="w-4 h-4" />
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Result */}
                {urlCode && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {isLoading ? (
                            <div className="text-center py-8 text-gray-500">Đang tìm kiếm...</div>
                        ) : error ? (
                            <Card className="border-red-200 bg-red-50">
                                <CardContent className="pt-6 text-center text-red-600">
                                    Không tìm thấy hồ sơ với mã này. Vui lòng kiểm tra lại.
                                </CardContent>
                            </Card>
                        ) : candidate ? (
                            <Card className="border-t-4 border-t-blue-600 shadow-xl">
                                <CardHeader className="text-center border-b bg-gray-50/50 pb-6">
                                    <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-gray-500 uppercase">
                                        {candidate.fullName.charAt(0)}
                                    </div>
                                    <CardTitle className="text-xl">{candidate.fullName}</CardTitle>
                                    <p className="text-sm text-gray-500 font-medium">{candidate.job?.title || "Ứng tuyển tự do"}</p>
                                </CardHeader>
                                <CardContent className="pt-8">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className={`px-6 py-3 rounded-full flex items-center gap-3 font-bold text-lg 
                                            ${getStatusInfo(candidate.status).color}`}>
                                            {(() => {
                                                const Icon = getStatusInfo(candidate.status).icon;
                                                return <Icon className="w-6 h-6" />
                                            })()}
                                            {getStatusInfo(candidate.status).label}
                                        </div>

                                        <div className="w-full h-1 bg-gray-100 rounded-full mt-4 overflow-hidden relative">
                                            {/* Simple Status Bar Visualization */}
                                            <div className={`h-full absolute left-0 top-0 transition-all duration-1000 bg-current opacity-20 w-full`}></div>
                                        </div>

                                        <p className="text-xs text-center text-gray-400 mt-2 max-w-[80%]">
                                            Cập nhật lần cuối: {new Date(candidate.submittedAt).toLocaleDateString('vi-VN')}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : null}
                    </div>
                )}
            </div>
        </div>
    )
}
