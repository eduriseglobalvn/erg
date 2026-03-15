"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    BookOpen, ChevronDown, ChevronRight, Edit, ExternalLink, FolderPlus, GraduationCap,
    Link as LinkIcon, Loader2, Plus, Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { elearningApi, ElearningCategoryData, ElearningLevelData, ElearningUnitData } from "@/services/elearning.api";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import { Textarea } from "@/components/admin/ui/textarea";
import { Badge } from "@/components/admin/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/admin/ui/tabs";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/admin/ui/table";
import {
    Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/admin/ui/dialog";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/admin/ui/dropdown-menu";

// ======================== CATEGORY DIALOG ========================
function CategoryDialog({
    open,
    onClose,
    category,
}: {
    open: boolean;
    onClose: () => void;
    category: ElearningCategoryData | null;
}) {
    const qc = useQueryClient();
    const isEdit = !!category;

    const [form, setForm] = useState({
        title: category?.title ?? "",
        subtitle: category?.subtitle ?? "",
        slug: category?.slug ?? "",
        sortOrder: category?.sortOrder ?? 0,
    });

    const mutation = useMutation({
        mutationFn: () =>
            isEdit
                ? elearningApi.admin.updateCategory(category!.id, form)
                : elearningApi.admin.createCategory(form),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["elearning-admin"] });
            toast.success(isEdit ? "Cập nhật category thành công" : "Thêm category thành công");
            onClose();
        },
        onError: () => toast.error("Có lỗi xảy ra, vui lòng thử lại"),
    });

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Chỉnh sửa Category" : "Thêm Category mới"}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                    <div className="space-y-1.5">
                        <Label>Tên Category *</Label>
                        <Input
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            placeholder="VD: Tiểu học (Spark)"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Mô tả phụ (subtitle)</Label>
                        <Input
                            value={form.subtitle}
                            onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                            placeholder="VD: Bám sát chương trình IC3 Spark"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Slug (URL)</Label>
                        <Input
                            value={form.slug}
                            onChange={(e) => setForm({ ...form, slug: e.target.value })}
                            placeholder="primary hoặc secondary"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Thứ tự hiển thị</Label>
                        <Input
                            type="number"
                            value={form.sortOrder}
                            onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Hủy</Button>
                    <Button
                        onClick={() => mutation.mutate()}
                        disabled={!form.title.trim() || mutation.isPending}
                    >
                        {mutation.isPending && <Loader2 size={14} className="animate-spin mr-1" />}
                        {isEdit ? "Lưu thay đổi" : "Thêm mới"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// ======================== UNIT DIALOG ========================
function UnitDialog({
    open,
    onClose,
    unit,
    levelId,
}: {
    open: boolean;
    onClose: () => void;
    unit: ElearningUnitData | null;
    levelId: string;
}) {
    const qc = useQueryClient();
    const isEdit = !!unit;

    const [form, setForm] = useState({
        title: unit?.title ?? "",
        description: unit?.description ?? "",
        studyLink: unit?.studyLink ?? "",
        testLink: unit?.testLink ?? "",
        sortOrder: unit?.sortOrder ?? 0,
    });

    const mutation = useMutation({
        mutationFn: () =>
            isEdit
                ? elearningApi.admin.updateUnit(unit!.id, form)
                : elearningApi.admin.createUnit({ ...form, levelId }),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["elearning-admin"] });
            toast.success(isEdit ? "Cập nhật unit thành công" : "Thêm unit thành công");
            onClose();
        },
        onError: () => toast.error("Có lỗi xảy ra, vui lòng thử lại"),
    });

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Chỉnh sửa Unit" : "Thêm Unit mới"}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                    <div className="space-y-1.5">
                        <Label>Tên Unit *</Label>
                        <Input
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            placeholder="VD: Khám phá máy tính"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Mô tả</Label>
                        <Textarea
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            placeholder="Mô tả ngắn về nội dung unit"
                            rows={2}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="flex items-center gap-2">
                            <BookOpen size={14} className="text-blue-600" />
                            Link Luyện tập (studyLink)
                        </Label>
                        <Input
                            value={form.studyLink}
                            onChange={(e) => setForm({ ...form, studyLink: e.target.value })}
                            placeholder="https://docs.google.com/forms/..."
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="flex items-center gap-2">
                            <LinkIcon size={14} className="text-amber-600" />
                            Link Kiểm tra (testLink)
                        </Label>
                        <Input
                            value={form.testLink}
                            onChange={(e) => setForm({ ...form, testLink: e.target.value })}
                            placeholder="https://docs.google.com/forms/..."
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Thứ tự hiển thị</Label>
                        <Input
                            type="number"
                            value={form.sortOrder}
                            onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Hủy</Button>
                    <Button
                        onClick={() => mutation.mutate()}
                        disabled={!form.title.trim() || mutation.isPending}
                    >
                        {mutation.isPending && <Loader2 size={14} className="animate-spin mr-1" />}
                        {isEdit ? "Lưu thay đổi" : "Thêm mới"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// ======================== LEVEL DIALOG ========================
function LevelDialog({
    open,
    onClose,
    level,
    categoryId,
}: {
    open: boolean;
    onClose: () => void;
    level: ElearningLevelData | null;
    categoryId: string;
}) {
    const qc = useQueryClient();
    const isEdit = !!level;

    const [form, setForm] = useState({
        title: level?.title ?? "",
        description: level?.description ?? "",
        slug: level?.slug ?? "",
        sortOrder: level?.sortOrder ?? 0,
    });

    const mutation = useMutation({
        mutationFn: () =>
            isEdit
                ? elearningApi.admin.updateLevel(level!.id, form)
                : elearningApi.admin.createLevel({ ...form, categoryId }),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["elearning-admin"] });
            toast.success(isEdit ? "Cập nhật level thành công" : "Thêm level thành công");
            onClose();
        },
        onError: () => toast.error("Có lỗi xảy ra, vui lòng thử lại"),
    });

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Chỉnh sửa Level" : "Thêm Level mới"}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                    <div className="space-y-1.5">
                        <Label>Tên Level *</Label>
                        <Input
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            placeholder="VD: IC3 Spark Level 1"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Mô tả</Label>
                        <Textarea
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            placeholder="Mô tả cấp độ"
                            rows={2}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Slug (URL)</Label>
                        <Input
                            value={form.slug}
                            onChange={(e) => setForm({ ...form, slug: e.target.value })}
                            placeholder="ic3-spark-level-1"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Thứ tự hiển thị</Label>
                        <Input
                            type="number"
                            value={form.sortOrder}
                            onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Hủy</Button>
                    <Button
                        onClick={() => mutation.mutate()}
                        disabled={!form.title.trim() || mutation.isPending}
                    >
                        {mutation.isPending && <Loader2 size={14} className="animate-spin mr-1" />}
                        {isEdit ? "Lưu thay đổi" : "Thêm mới"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// ======================== LEVEL SECTION ========================
function LevelSection({ level, categoryId }: { level: ElearningLevelData; categoryId: string }) {
    const qc = useQueryClient();
    const [expanded, setExpanded] = useState(true);
    const [unitDialog, setUnitDialog] = useState<{ open: boolean; unit: ElearningUnitData | null }>({
        open: false,
        unit: null,
    });
    const [levelDialog, setLevelDialog] = useState(false);

    const deleteUnit = useMutation({
        mutationFn: (id: string) => elearningApi.admin.deleteUnit(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["elearning-admin"] });
            toast.success("Đã xóa unit");
        },
        onError: () => toast.error("Không thể xóa unit"),
    });

    const deleteLevel = useMutation({
        mutationFn: () => elearningApi.admin.deleteLevel(level.id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["elearning-admin"] });
            toast.success("Đã xóa level");
        },
        onError: () => toast.error("Không thể xóa level"),
    });

    return (
        <div className="border border-gray-200 rounded-xl overflow-hidden">
            {/* Level Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50">
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="flex items-center gap-2 text-left flex-1 min-w-0"
                >
                    {expanded ? (
                        <ChevronDown size={16} className="text-gray-500 flex-shrink-0" />
                    ) : (
                        <ChevronRight size={16} className="text-gray-500 flex-shrink-0" />
                    )}
                    <GraduationCap size={16} className="text-blue-600 flex-shrink-0" />
                    <span className="font-semibold text-gray-800 truncate">{level.title}</span>
                    {level.description && (
                        <span className="text-xs text-gray-400 truncate hidden sm:inline">
                            — {level.description}
                        </span>
                    )}
                    <Badge variant="secondary" className="ml-2 flex-shrink-0 text-xs">
                        {level.units.length} units
                    </Badge>
                </button>
                <div className="flex items-center gap-2 ml-3">
                    <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs"
                        onClick={() => setUnitDialog({ open: true, unit: null })}
                    >
                        <Plus size={12} className="mr-1" /> Unit
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                                <Edit size={13} />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setLevelDialog(true)}>
                                <Edit size={13} className="mr-2" /> Chỉnh sửa level
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-red-600 focus:text-red-600"
                                onClick={() => {
                                    if (confirm(`Xóa level "${level.title}"? Tất cả units sẽ bị xóa.`))
                                        deleteLevel.mutate();
                                }}
                            >
                                <Trash2 size={13} className="mr-2" /> Xóa level
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Units Table */}
            {expanded && (
                <div className="overflow-x-auto">
                    {level.units.length === 0 ? (
                        <div className="py-8 text-center text-sm text-gray-400">
                            Chưa có unit nào.{" "}
                            <button
                                className="text-blue-600 hover:underline"
                                onClick={() => setUnitDialog({ open: true, unit: null })}
                            >
                                Thêm unit đầu tiên
                            </button>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="text-xs">
                                    <TableHead className="w-8">#</TableHead>
                                    <TableHead>Tên Unit</TableHead>
                                    <TableHead className="hidden md:table-cell">Mô tả</TableHead>
                                    <TableHead>Link Luyện tập</TableHead>
                                    <TableHead>Link Kiểm tra</TableHead>
                                    <TableHead className="w-24 text-right">Thao tác</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {level.units.map((unit, idx) => (
                                    <TableRow key={unit.id} className="text-sm">
                                        <TableCell className="text-gray-400 font-mono text-xs">
                                            {idx + 1}
                                        </TableCell>
                                        <TableCell className="font-medium max-w-[160px] truncate">
                                            {unit.title}
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell text-gray-500 max-w-[200px] truncate text-xs">
                                            {unit.description || "—"}
                                        </TableCell>
                                        <TableCell>
                                            {unit.studyLink ? (
                                                <a
                                                    href={unit.studyLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1 text-blue-600 hover:underline text-xs"
                                                >
                                                    <ExternalLink size={11} />
                                                    <span className="truncate max-w-[100px]">Xem link</span>
                                                </a>
                                            ) : (
                                                <span className="text-gray-300 text-xs">Chưa có</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {unit.testLink ? (
                                                <a
                                                    href={unit.testLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1 text-amber-600 hover:underline text-xs"
                                                >
                                                    <ExternalLink size={11} />
                                                    <span className="truncate max-w-[100px]">Xem link</span>
                                                </a>
                                            ) : (
                                                <span className="text-gray-300 text-xs">Chưa có</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-7 w-7 p-0"
                                                    onClick={() => setUnitDialog({ open: true, unit })}
                                                >
                                                    <Edit size={13} />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-7 w-7 p-0 text-red-500 hover:text-red-700"
                                                    onClick={() => {
                                                        if (confirm(`Xóa unit "${unit.title}"?`))
                                                            deleteUnit.mutate(unit.id);
                                                    }}
                                                >
                                                    <Trash2 size={13} />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </div>
            )}

            <UnitDialog
                open={unitDialog.open}
                onClose={() => setUnitDialog({ open: false, unit: null })}
                unit={unitDialog.unit}
                levelId={level.id}
            />
            <LevelDialog
                open={levelDialog}
                onClose={() => setLevelDialog(false)}
                level={level}
                categoryId={categoryId}
            />
        </div>
    );
}

// ======================== CATEGORY TAB CONTENT ========================
function CategoryTab({
    category,
    onEditCategory,
    onDeleteCategory,
}: {
    category: ElearningCategoryData;
    onEditCategory: (cat: ElearningCategoryData) => void;
    onDeleteCategory: (cat: ElearningCategoryData) => void;
}) {
    const [levelDialog, setLevelDialog] = useState(false);

    const totalUnits = category.levels.reduce((sum, l) => sum + l.units.length, 0);
    const unitsWithLinks = category.levels
        .flatMap((l) => l.units)
        .filter((u) => u.studyLink && u.testLink).length;

    return (
        <div className="space-y-4">
            {/* Stats + actions bar */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>
                        <strong className="text-gray-800">{category.levels.length}</strong> levels
                    </span>
                    <span>
                        <strong className="text-gray-800">{totalUnits}</strong> units
                    </span>
                    {totalUnits > 0 && (
                        <span>
                            <strong className="text-green-600">{unitsWithLinks}</strong>
                            <span className="text-gray-400">/{totalUnits}</span> có link
                        </span>
                    )}
                    {category.subtitle && (
                        <span className="text-gray-400 italic hidden sm:inline">{category.subtitle}</span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onEditCategory(category)}
                    >
                        <Edit size={13} className="mr-1" /> Sửa category
                    </Button>
                    <Button size="sm" onClick={() => setLevelDialog(true)}>
                        <Plus size={14} className="mr-1" /> Thêm Level
                    </Button>
                </div>
            </div>

            {/* Levels list */}
            <div className="space-y-3">
                {category.levels.map((level) => (
                    <LevelSection key={level.id} level={level} categoryId={category.id} />
                ))}
                {category.levels.length === 0 && (
                    <div className="py-16 text-center text-gray-400 border-2 border-dashed rounded-xl">
                        Chưa có level nào. Nhấn &quot;Thêm Level&quot; để bắt đầu.
                    </div>
                )}
            </div>

            <LevelDialog
                open={levelDialog}
                onClose={() => setLevelDialog(false)}
                level={null}
                categoryId={category.id}
            />
        </div>
    );
}

// ======================== MAIN PAGE ========================
export default function ElearningAdminPage() {
    const qc = useQueryClient();
    const [categoryDialog, setCategoryDialog] = useState<{
        open: boolean;
        category: ElearningCategoryData | null;
    }>({ open: false, category: null });

    const { data: categories, isLoading, error } = useQuery({
        queryKey: ["elearning-admin"],
        queryFn: () => elearningApi.admin.getCategories(),
    });

    const deleteCategory = useMutation({
        mutationFn: (id: string) => elearningApi.admin.deleteCategory(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["elearning-admin"] });
            toast.success("Đã xóa category");
        },
        onError: () => toast.error("Không thể xóa category"),
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin text-gray-400" size={32} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64 text-red-500">
                Không thể tải dữ liệu. Vui lòng thử lại.
            </div>
        );
    }

    const cats = (categories as unknown as ElearningCategoryData[]) ?? [];

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Quản lý E-Learning</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Quản lý nội dung và link ôn luyện cho từng cấp độ
                    </p>
                </div>
                <Button
                    onClick={() => setCategoryDialog({ open: true, category: null })}
                    variant="outline"
                    size="sm"
                >
                    <FolderPlus size={14} className="mr-1.5" /> Thêm Category
                </Button>
            </div>

            {/* Tabs per category */}
            {cats.length === 0 ? (
                <div className="py-24 text-center text-gray-400 border-2 border-dashed rounded-xl">
                    <GraduationCap size={40} className="mx-auto mb-3 opacity-30" />
                    <p className="font-medium">Chưa có dữ liệu.</p>
                    <p className="text-sm mt-1">
                        Chạy <code className="bg-gray-100 px-1 rounded text-gray-600">yarn seed:elearning</code> để khởi tạo dữ liệu,
                        hoặc nhấn &quot;Thêm Category&quot; để bắt đầu.
                    </p>
                </div>
            ) : (
                <Tabs defaultValue={cats[0]?.slug ?? cats[0]?.id}>
                    <TabsList className="mb-6">
                        {cats.map((cat) => (
                            <TabsTrigger key={cat.id} value={cat.slug ?? cat.id}>
                                {cat.title}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    {cats.map((cat) => (
                        <TabsContent key={cat.id} value={cat.slug ?? cat.id}>
                            <CategoryTab
                                category={cat}
                                onEditCategory={(c) => setCategoryDialog({ open: true, category: c })}
                                onDeleteCategory={(c) => {
                                    if (confirm(`Xóa category "${c.title}"? Tất cả levels và units sẽ bị xóa.`))
                                        deleteCategory.mutate(c.id);
                                }}
                            />
                        </TabsContent>
                    ))}
                </Tabs>
            )}

            {/* Category Dialog */}
            <CategoryDialog
                open={categoryDialog.open}
                onClose={() => setCategoryDialog({ open: false, category: null })}
                category={categoryDialog.category}
            />
        </div>
    );
}
