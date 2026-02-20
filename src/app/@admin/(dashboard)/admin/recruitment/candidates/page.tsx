"use client"

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { recruitmentApi } from '@/services/recruitment.api'
import { CandidateStatus } from '@/types/recruitment'
import { Button } from '@/components/admin/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/admin/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/admin/ui/select'
import { Badge } from '@/components/admin/ui/badge'
import { ExternalLink, Filter } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

export default function AdminCandidatesPage() {
    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    const queryClient = useQueryClient();

    // Fetch Candidates
    const { data: candidates, isLoading } = useQuery({
        queryKey: ['admin-candidates', statusFilter],
        queryFn: () => recruitmentApi.adminGetCandidates({
            status: statusFilter === "ALL" ? undefined : statusFilter as CandidateStatus
        }).then(res => res.data)
    });

    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string, status: CandidateStatus }) => recruitmentApi.adminUpdateCandidateStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-candidates'] });
            toast.success("Đã cập nhật trạng thái hồ sơ");
        }
    });

    const getStatusColor = (status: CandidateStatus) => {
        switch (status) {
            case CandidateStatus.PENDING: return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
            case CandidateStatus.REVIEWING: return "bg-blue-100 text-blue-800 hover:bg-blue-200";
            case CandidateStatus.INTERVIEW: return "bg-purple-100 text-purple-800 hover:bg-purple-200";
            case CandidateStatus.OFFER: return "bg-pink-100 text-pink-800 hover:bg-pink-200";
            case CandidateStatus.HIRED: return "bg-green-100 text-green-800 hover:bg-green-200";
            case CandidateStatus.REJECTED: return "bg-red-100 text-red-800 hover:bg-red-200";
            default: return "bg-gray-100";
        }
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Quản lý Ứng viên</h1>
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Lọc theo trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
                            {Object.values(CandidateStatus).map(s => (
                                <SelectItem key={s} value={s}>{s}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="bg-white rounded-lg border shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Ứng viên</TableHead>
                            <TableHead>Vị trí ứng tuyển</TableHead>
                            <TableHead>Mã hồ sơ</TableHead>
                            <TableHead>Ngày nộp</TableHead>
                            <TableHead>CV</TableHead>
                            <TableHead>Trạng thái</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow><TableCell colSpan={6} className="text-center py-8">Đang tải...</TableCell></TableRow>
                        ) : candidates?.length === 0 ? (
                            <TableRow><TableCell colSpan={6} className="text-center py-8 text-gray-400">Không có hồ sơ nào.</TableCell></TableRow>
                        ) : candidates?.map((c) => (
                            <TableRow key={c.id}>
                                <TableCell>
                                    <div className="font-medium">{c.fullName}</div>
                                    <div className="text-xs text-muted-foreground">{c.email}</div>
                                    <div className="text-xs text-muted-foreground">{c.phone}</div>
                                </TableCell>
                                <TableCell className="max-w-[200px] truncate" title={c.job?.title}>
                                    {c.job?.title || <span className="text-gray-400 italic">Job đã xóa</span>}
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="font-mono">{c.trackingCode}</Badge>
                                </TableCell>
                                <TableCell>{new Date(c.submittedAt).toLocaleDateString('vi-VN')}</TableCell>
                                <TableCell>
                                    {c.cvUrl ? (
                                        <Button size="sm" variant="ghost" className="text-blue-600 h-8 font-normal" asChild>
                                            <Link href={c.cvUrl} target="_blank">
                                                Xem CV <ExternalLink className="w-3 h-3 ml-1" />
                                            </Link>
                                        </Button>
                                    ) : <span className="text-gray-400 text-xs">Không có file</span>}
                                </TableCell>
                                <TableCell>
                                    <Select
                                        defaultValue={c.status}
                                        onValueChange={(val) => updateStatusMutation.mutate({ id: c.id, status: val as CandidateStatus })}
                                    >
                                        <SelectTrigger className={`w-[140px] h-8 text-xs font-bold border-none ${getStatusColor(c.status)}`}>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.values(CandidateStatus).map(s => (
                                                <SelectItem key={s} value={s} className="text-xs">
                                                    {s}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
