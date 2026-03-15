"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, GripVertical, Settings2, Trash2 } from "lucide-react";
import {
    DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/admin/ui/card";
import { Switch } from "@/components/admin/ui/switch";
import { Label } from "@/components/admin/ui/label";
import { toast } from "sonner";

interface Lesson {
    id: string;
    title: string;
    duration: string;
    isFree: boolean;
    isPublished: boolean;
}

interface Chapter {
    id: string;
    title: string;
    lessons: Lesson[];
}

const initialChapters: Chapter[] = [
    {
        id: "chap-1", title: "Phần 1: Giới thiệu khóa học", lessons: [
            { id: "les-1-1", title: "Giới thiệu chung về Excel 2021", duration: "05:20", isFree: true, isPublished: true },
            { id: "les-1-2", title: "Tổng quan giao diện", duration: "10:15", isFree: true, isPublished: true },
        ]
    },
    {
        id: "chap-2", title: "Phần 2: Các hàm tính toán cơ bản", lessons: [
            { id: "les-2-1", title: "Hàm SUM, MIN, MAX, AVERAGE", duration: "15:30", isFree: false, isPublished: true },
            { id: "les-2-2", title: "Hàm logic IF, AND, OR", duration: "20:00", isFree: false, isPublished: true },
        ]
    }
];

// Component for a Sortable Chapter
function SortableChapter({ chapter, setChapters }: { chapter: Chapter, setChapters: any }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: chapter.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <Card ref={setNodeRef} style={style} className="mb-4 overflow-hidden border-slate-200 shadow-sm">
            <CardHeader className="p-4 bg-slate-50 border-b flex flex-row items-center space-y-0 gap-3">
                <div {...attributes} {...listeners} className="cursor-grab hover:bg-slate-200 p-1 rounded text-slate-400">
                    <GripVertical className="h-5 w-5" />
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold text-lg">{chapter.title}</h3>
                </div>
                <Button variant="ghost" size="sm" className="h-8 text-xs">Sửa tên</Button>
                <Button variant="ghost" size="sm" className="h-8 text-xs text-red-600 hover:bg-red-50 hover:text-red-700"><Trash2 className="h-4 w-4" /></Button>
            </CardHeader>
            <CardContent className="p-0">
                <div className="flex flex-col">
                    {chapter.lessons.map((lesson, idx) => (
                        <div key={lesson.id} className="flex items-center gap-3 p-3 border-b last:border-0 hover:bg-slate-50 transition-colors group">
                            <div className="cursor-grab text-slate-300 hover:text-slate-500">
                                <GripVertical className="h-4 w-4" />
                            </div>
                            <div className="text-sm font-medium w-6 text-slate-400">{idx + 1}.</div>
                            <div className="flex-1 font-medium text-sm">
                                {lesson.title}
                            </div>
                            <div className="flex items-center gap-4 opacity-70 group-hover:opacity-100 transition-opacity">
                                <span className="text-xs text-muted-foreground mr-4">{lesson.duration}</span>
                                <div className="flex items-center gap-2">
                                    <Label htmlFor={`free-${lesson.id}`} className="text-xs">Free Preview</Label>
                                    <Switch id={`free-${lesson.id}`} checked={lesson.isFree} onCheckedChange={() => { }} className="data-[state=checked]:bg-green-500" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Label htmlFor={`pub-${lesson.id}`} className="text-xs">Publish</Label>
                                    <Switch id={`pub-${lesson.id}`} checked={lesson.isPublished} onCheckedChange={() => { }} />
                                </div>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 ml-2"><Settings2 className="h-4 w-4 text-slate-500" /></Button>
                            </div>
                        </div>
                    ))}
                    <div className="p-3 bg-slate-50/50">
                        <Button variant="outline" size="sm" className="w-full border-dashed">
                            <Plus className="mr-2 h-4 w-4" /> Thêm bài học mới
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default function CourseSyllabusPage({ params }: { params: { id: string } }) {
    const [chapters, setChapters] = useState(initialChapters);

    // Dnd-kit sensors
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setChapters((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
            toast.success("Đã cập nhật thứ tự chương học", { position: "bottom-right" });
        }
    };

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 max-w-5xl mx-auto">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
                <Link href="/admin/courses" className="hover:text-primary flex items-center">
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Danh sách Khóa học
                </Link>
                <span>/</span>
                <Link href={`/admin/courses/${params.id}`} className="hover:text-primary w-32 truncate">
                    Khóa học {params.id}
                </Link>
                <span>/</span>
                <span className="text-foreground font-medium">Giáo trình</span>
            </div>

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Xây dựng Giáo trình</h2>
                    <p className="text-muted-foreground mt-1">
                        Sắp xếp các phần và bài học bằng cách kéo thả (Drag & Drop).
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">Xem trước (Preview)</Button>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Thêm Phần mới (Chapter)
                    </Button>
                </div>
            </div>

            <div className="mt-8">
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={chapters.map(c => c.id)} strategy={verticalListSortingStrategy}>
                        {chapters.map(chapter => (
                            <SortableChapter key={chapter.id} chapter={chapter} setChapters={setChapters} />
                        ))}
                    </SortableContext>
                </DndContext>
            </div>
        </div>
    );
}
