"use client"

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { recruitmentApi } from '@/services/recruitment.api'
import { Job, JobStatus } from '@/types/recruitment'
import { Button } from '@/components/admin/ui/button'
import { Input } from '@/components/admin/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/admin/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/admin/ui/dialog'
import { Label } from '@/components/admin/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/admin/ui/select'
import { Textarea } from '@/components/admin/ui/textarea'
import { Plus, Pencil, Trash2, Eye, PlusCircle, MinusCircle } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

// Component Input mảng động (cho Description, Requirements, Benefits)
function ArrayInput({ values, onChange, label }: { values: string[], onChange: (val: string[]) => void, label: string }) {
    const addField = () => onChange([...values, ""]);
    const removeField = (idx: number) => onChange(values.filter((_, i) => i !== idx));
    const updateField = (idx: number, val: string) => {
        const newValues = [...values];
        newValues[idx] = val;
        onChange(newValues);
    }

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <Label>{label}</Label>
                <Button type="button" variant="ghost" size="sm" onClick={addField}><PlusCircle className="w-4 h-4 mr-1" /> Thêm dòng</Button>
            </div>
            {values.map((val, idx) => (
                <div key={idx} className="flex gap-2">
                    <Textarea
                        value={val}
                        onChange={(e) => updateField(idx, e.target.value)}
                        className="min-h-[60px]"
                        placeholder={`Dòng ${idx + 1}...`}
                    />
                    <Button type="button" variant="destructive" size="icon" onClick={() => removeField(idx)}><MinusCircle className="w-4 h-4" /></Button>
                </div>
            ))}
        </div>
    )
}

export default function AdminJobsPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingJob, setEditingJob] = useState<Partial<Job>>({});
    const queryClient = useQueryClient();

    // Fetch Jobs
    const { data: jobs, isLoading } = useQuery({
        queryKey: ['admin-jobs'],
        queryFn: () => recruitmentApi.adminGetJobs().then(res => res.data)
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
            status: JobStatus.NEW,
            salary: "Thỏa thuận",
            quantity: 1,
            workType: "Toàn thời gian",
            location: "Hà Nội",
            deadline: "",
            summary: "",
            description: [""],
            requirements: [""],
            benefits: [""]
        });
        setIsDialogOpen(true);
    }

    const openEdit = (job: Job) => {
        setEditingJob(job);
        setIsDialogOpen(true);
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Quản lý Tin Tuyển Dụng</h1>
                <Button onClick={openCreate} className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="w-4 h-4 mr-2" /> Tạo mới
                </Button>
            </div>

            <div className="bg-white rounded-lg border shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Tiêu đề</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead>Địa điểm</TableHead>
                            <TableHead>Hạn nộp</TableHead>
                            <TableHead className="text-right">Hành động</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow><TableCell colSpan={5} className="text-center py-8">Đang tải...</TableCell></TableRow>
                        ) : jobs?.map((job) => (
                            <TableRow key={job.id}>
                                <TableCell className="font-medium">
                                    <div className="line-clamp-1" title={job.title}>{job.title}</div>
                                    <div className="text-xs text-muted-foreground">{job.slug}</div>
                                </TableCell>
                                <TableCell>
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase
                                        ${job.status === JobStatus.HOT ? 'bg-red-100 text-red-600' :
                                            job.status === JobStatus.NEW ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'
                                        }`}>
                                        {job.status}
                                    </span>
                                </TableCell>
                                <TableCell>{job.location}</TableCell>
                                <TableCell>{job.deadline}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button size="icon" variant="ghost" asChild>
                                            <Link href={`/tuyen-dung/${job.slug}`} target="_blank"><Eye className="w-4 h-4" /></Link>
                                        </Button>
                                        <Button size="icon" variant="ghost" onClick={() => openEdit(job)}>
                                            <Pencil className="w-4 h-4 text-blue-500" />
                                        </Button>
                                        <Button size="icon" variant="ghost" onClick={() => {
                                            if (confirm('Bạn có chắc chắn muốn xóa tin này?')) deleteMutation.mutate(job.id)
                                        }}>
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
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
                            <Label>Trạng thái</Label>
                            <Select value={editingJob.status} onValueChange={(val: any) => setEditingJob(prev => ({ ...prev, status: val }))}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {Object.values(JobStatus).map(s => <SelectItem key={s} value={s}>{s.toUpperCase()}</SelectItem>)}
                                </SelectContent>
                            </Select>
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

                        <div className="col-span-2 space-y-2">
                            <Label>Địa điểm làm việc</Label>
                            <Input value={editingJob.location} onChange={(e) => setEditingJob(prev => ({ ...prev, location: e.target.value }))} />
                        </div>

                        <div className="col-span-2 space-y-2">
                            <Label>Mô tả ngắn (Summary)</Label>
                            <Textarea value={editingJob.summary} onChange={(e) => setEditingJob(prev => ({ ...prev, summary: e.target.value }))} />
                        </div>

                        {/* Array Inputs */}
                        <div className="col-span-2 space-y-4 border-t pt-4">
                            <ArrayInput
                                label="Mô tả công việc (Mỗi dòng là một ý)"
                                values={editingJob.description || []}
                                onChange={(val) => setEditingJob(prev => ({ ...prev, description: val }))}
                            />
                            <ArrayInput
                                label="Yêu cầu ứng viên"
                                values={editingJob.requirements || []}
                                onChange={(val) => setEditingJob(prev => ({ ...prev, requirements: val }))}
                            />
                            <ArrayInput
                                label="Quyền lợi được hưởng"
                                values={editingJob.benefits || []}
                                onChange={(val) => setEditingJob(prev => ({ ...prev, benefits: val }))}
                            />
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
