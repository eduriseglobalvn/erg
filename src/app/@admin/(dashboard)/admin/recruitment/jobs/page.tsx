"use client"

import { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { recruitmentApi } from '@/services/recruitment.api'
import { Job } from '@/types/recruitment'
import { Button } from '@/components/admin/ui/button'
import { Input } from '@/components/admin/ui/input'
import { Switch } from '@/components/admin/ui/switch'
import { DataTable } from '@/components/admin/data-table/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/admin/ui/dialog'
import { Label } from '@/components/admin/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/admin/ui/select'
import { Textarea } from '@/components/admin/ui/textarea'
import { Flame, Zap, Eye, Pencil, Trash2, Plus } from 'lucide-react'
// Component Input mảng động (cho Description, Requirements, Benefits) -> Đã thay thế bằng Textarea
// NOTE: Removed unused PlusCircle/MinusCircle imports

export default function AdminJobsPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingJob, setEditingJob] = useState<Partial<Job>>({});
    const queryClient = useQueryClient();

    // Fetch Jobs
    const { data: jobs, isLoading } = useQuery({
        queryKey: ['admin-jobs'],
        queryFn: () => recruitmentApi.adminGetJobs().then(res => res.data.items)
    });

    // Mutations
    const createMutation = useMutation({
        mutationFn: recruitmentApi.adminCreateJob,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-jobs'] });
            toast.success("Tạo tin tuyển dụng thành công");
            setIsDialogOpen(false);
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string, data: Partial<Job> }) => recruitmentApi.adminUpdateJob(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-jobs'] });
            toast.success("Cập nhật thành công");
            setIsDialogOpen(false);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: recruitmentApi.adminDeleteJob,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-jobs'] });
            toast.success("Đã xóa tin tuyển dụng");
        }
    });

    const toggleHotMutation = useMutation({
        mutationFn: (id: string) => recruitmentApi.adminToggleHot(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-jobs'] });
            toast.success('Cập nhật trạng thái HOT thành công');
        }
    });

    const toggleUrgentMutation = useMutation({
        mutationFn: (id: string) => recruitmentApi.adminToggleUrgent(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-jobs'] });
            toast.success('Cập nhật trạng thái GẤP thành công');
        }
    });

    const toggleStatusMutation = useMutation({
        mutationFn: ({ id, isActive }: { id: string, isActive: boolean }) => recruitmentApi.adminUpdateStatus(id, isActive),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-jobs'] });
            toast.success('Cập nhật trạng thái hiển thị thành công');
        }
    });

    const handleSave = () => {
        // Validate cơ bản
        if (!editingJob.title || !editingJob.slug) return toast.error("Vui lòng nhập tiêu đề và slug");

        if (editingJob.id) {
            updateMutation.mutate({ id: editingJob.id, data: editingJob });
        } else {
            createMutation.mutate(editingJob);
        }
    }

    const openCreate = () => {
        setEditingJob({
            title: "",
            slug: "",
            salary: "Thỏa thuận",
            quantity: 1,
            workType: "Toàn thời gian",
            workSchedule: "",
            location: "Hà Nội",
            deadline: "",
            postDate: "",
            summary: "",
            description: [""],
            requirements: [""],
            benefits: [""],
            isHot: false,
            isUrgent: false,
            isNew: true,
            isActive: false,
            status: "normal"
        });
        setIsDialogOpen(true);
    }

    const openEdit = (job: Job) => {
        setEditingJob(job);
        setIsDialogOpen(true);
    }

    const columns: ColumnDef<Job>[] = [
        {
            accessorKey: 'title',
            header: 'Tiêu đề',
            cell: ({ row }) => (
                <div className="max-w-[300px]">
                    <div className="font-medium truncate" title={row.original.title}>{row.original.title}</div>
                    <div className="text-xs text-gray-500 truncate">{row.original.slug}</div>
                </div>
            )
        },
        {
            header: 'Attributes',
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <div className="flex flex-col items-center gap-1">
                        <Flame className={`w-4 h-4 ${row.original.isHot ? 'text-orange-500' : 'text-gray-300'}`} />
                        <Switch
                            checked={row.original.isHot}
                            onCheckedChange={() => toggleHotMutation.mutate(row.original.id)}
                            className="scale-75"
                        />
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <Zap className={`w-4 h-4 ${row.original.isUrgent ? 'text-yellow-500' : 'text-gray-300'}`} />
                        <Switch
                            checked={row.original.isUrgent}
                            onCheckedChange={() => toggleUrgentMutation.mutate(row.original.id)}
                            className="scale-75"
                        />
                    </div>
                </div>
            )
        },
        {
            accessorKey: 'viewCount',
            header: 'Views',
            cell: ({ row }) => (
                <div className="flex items-center gap-1 text-gray-600">
                    <Eye className="w-3 h-3" />
                    <span>{row.original.viewCount || 0}</span>
                </div>
            )
        },
        {
            accessorKey: 'workSchedule',
            header: 'Thời gian / Hình thức',
            cell: ({ row }) => (
                <div className="text-sm">
                    {row.original.workSchedule || row.original.workType}
                </div>
            )
        },
        {
            accessorKey: 'deadline',
            header: 'Ngày đăng - Hạn nộp',
            cell: ({ row }) => (
                <div className="text-sm">
                    <div className="text-gray-500">Đăng: {row.original.postDate || '---'}</div>
                    <div className="text-[#cc0022]">Hạn: {row.original.deadline}</div>
                </div>
            )
        },
        {
            accessorKey: 'isActive',
            header: 'Trạng thái',
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Switch
                        checked={row.original.isActive}
                        onCheckedChange={(checked) => toggleStatusMutation.mutate({ id: row.original.id, isActive: checked })}
                    />
                    <span className="text-xs text-gray-500">{row.original.isActive ? 'Public' : 'Draft'}</span>
                </div>
            )
        },
        {
            id: 'actions',
            cell: ({ row }) => (
                <div className="flex gap-2 justify-end">
                    <Button variant="outline" size="icon" asChild>
                        <Link href={`/tuyen-dung/${row.original.slug}`} target="_blank">
                            <Eye className="w-4 h-4" />
                        </Link>
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => openEdit(row.original)}>
                        <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => {
                            if (confirm('Bạn có chắc muốn xóa tin này?')) {
                                deleteMutation.mutate(row.original.id);
                            }
                        }}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            )
        }
    ];

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Quản lý Tin Tuyển Dụng</h1>
                <Button onClick={openCreate} className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="w-4 h-4 mr-2" /> Tạo mới
                </Button>
            </div>

            <div className="bg-white rounded-lg border shadow-sm p-4">
                <DataTable
                    columns={columns}
                    data={jobs || []}
                    searchKey="title"
                    loading={isLoading}
                />
            </div>

            {/* Dialog Form Create/Edit */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingJob.id ? "Chỉnh sửa tin tuyển dụng" : "Tạo tin tuyển dụng mới"}</DialogTitle>
                    </DialogHeader>

                    <div className="grid grid-cols-2 gap-4 py-4">
                        <div className="col-span-2 space-y-2">
                            <Label>Tiêu đề</Label>
                            <Input value={editingJob.title} onChange={(e) => {
                                const title = e.target.value;
                                const slug = title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
                                setEditingJob(prev => ({ ...prev, title, slug: !prev.id ? slug : prev.slug }));
                            }} />
                        </div>

                        <div className="space-y-2">
                            <Label>Slug (URL)</Label>
                            <Input value={editingJob.slug} onChange={(e) => setEditingJob(prev => ({ ...prev, slug: e.target.value }))} />
                        </div>

                        <div className="space-y-2">
                            <Label>Cấu hình Badge</Label>
                            <div className="flex gap-4 pt-2">
                                <div className="flex items-center gap-2">
                                    <Switch checked={editingJob.isHot || false} onCheckedChange={(c) => setEditingJob(p => ({ ...p, isHot: c }))} />
                                    <Label>HOT 🔥</Label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Switch checked={editingJob.isUrgent || false} onCheckedChange={(c) => setEditingJob(p => ({ ...p, isUrgent: c }))} />
                                    <Label>GẤP ⚡</Label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Switch checked={editingJob.isNew || false} onCheckedChange={(c) => setEditingJob(p => ({ ...p, isNew: c }))} />
                                    <Label>MỚI ✨</Label>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Mức lương</Label>
                            <Input value={editingJob.salary} onChange={(e) => setEditingJob(prev => ({ ...prev, salary: e.target.value }))} />
                        </div>

                        <div className="space-y-2">
                            <Label>Số lượng</Label>
                            <Input type="number" value={editingJob.quantity} onChange={(e) => setEditingJob(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))} />
                        </div>

                        <div className="space-y-2">
                            <Label>Loại hình</Label>
                            <Input value={editingJob.workType} onChange={(e) => setEditingJob(prev => ({ ...prev, workType: e.target.value }))} />
                        </div>

                        <div className="space-y-2">
                            <Label>Hạn nộp</Label>
                            <Input value={editingJob.deadline} onChange={(e) => setEditingJob(prev => ({ ...prev, deadline: e.target.value }))} placeholder="dd/mm/yyyy" />
                        </div>

                        <div className="space-y-2">
                            <Label>Ngày đăng (Post Date)</Label>
                            <Input value={editingJob.postDate || ''} onChange={(e) => setEditingJob(prev => ({ ...prev, postDate: e.target.value }))} placeholder="dd/mm/yyyy" />
                        </div>

                        <div className="space-y-2">
                            <Label>Thời gian làm việc (Work Schedule)</Label>
                            <Input value={editingJob.workSchedule || ''} onChange={(e) => setEditingJob(prev => ({ ...prev, workSchedule: e.target.value }))} placeholder="VD: Từ thứ Hai đến thứ Bảy" />
                        </div>

                        <div className="col-span-2 space-y-2">
                            <Label>Địa điểm làm việc</Label>
                            <Input value={editingJob.location} onChange={(e) => setEditingJob(prev => ({ ...prev, location: e.target.value }))} />
                        </div>

                        <div className="col-span-2 space-y-2">
                            <Label>Mô tả ngắn (Summary)</Label>
                            <Textarea
                                value={editingJob.summary}
                                onChange={(e) => setEditingJob(prev => ({ ...prev, summary: e.target.value }))}
                                placeholder="Mô tả ngắn gọn về vị trí này..."
                            />
                        </div>

                        {/* Bulk Text Areas for Arrays */}
                        <div className="col-span-2 space-y-4 border-t pt-4">
                            <div className="space-y-2">
                                <Label>Mô tả công việc (Mỗi dòng một ý - Enter để xuống dòng)</Label>
                                <Textarea
                                    value={editingJob.description?.join('\n') || ''}
                                    onChange={(e) => setEditingJob(prev => ({ ...prev, description: e.target.value.split('\n') }))}
                                    className="min-h-[150px] font-mono text-sm"
                                    placeholder="- Tham gia phát triển dự án...&#10;- Phối hợp với team..."
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Yêu cầu ứng viên (Mỗi dòng một ý)</Label>
                                <Textarea
                                    value={editingJob.requirements?.join('\n') || ''}
                                    onChange={(e) => setEditingJob(prev => ({ ...prev, requirements: e.target.value.split('\n') }))}
                                    className="min-h-[150px] font-mono text-sm"
                                    placeholder="- Có kinh nghiệm ReactJS...&#10;- Tốt nghiệp đại học..."
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Quyền lợi được hưởng (Mỗi dòng một ý)</Label>
                                <Textarea
                                    value={editingJob.benefits?.join('\n') || ''}
                                    onChange={(e) => setEditingJob(prev => ({ ...prev, benefits: e.target.value.split('\n') }))}
                                    className="min-h-[150px] font-mono text-sm"
                                    placeholder="- Lương tháng 13...&#10;- BHXH đầy đủ..."
                                />
                            </div>
                        </div>

                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Hủy</Button>
                        <Button onClick={handleSave} disabled={createMutation.isPending || updateMutation.isPending}>
                            {createMutation.isPending || updateMutation.isPending ? "Đang lưu..." : "Lưu tin tuyển dụng"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
