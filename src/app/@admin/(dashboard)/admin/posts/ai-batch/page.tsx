"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/admin/ui/card';
import { Button } from '@/components/admin/ui/button';
import { Badge } from '@/components/admin/ui/badge';
import { Textarea } from '@/components/admin/ui/textarea';
import { Progress } from '@/components/admin/ui/progress';
import { Switch } from '@/components/admin/ui/switch';
import { Checkbox } from '@/components/admin/ui/checkbox';
import {
    Sparkles,
    Play,
    StopCircle,
    CheckCircle2,
    Clock,
    AlertCircle,
    Settings2,
    FileText,
    ListPlus,
    Tag,
    Image as ImageIcon
} from 'lucide-react';
import { aiApi } from '@/services/ai.api';
import { toast } from 'sonner';
import { AITemplateSelector } from '@/components/admin/posts/ai-template-selector';

// --- Types & Mock Data ---

type BatchItem = {
    id: string;
    keyword: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    progress: number;
    provider?: string;
    timeTaken?: string;
    error?: string;
}

export default function BatchAIGenerationPage() {
    // Form State
    const [keywordsInput, setKeywordsInput] = useState("");
    const stopRef = React.useRef(false);
    const [selectedCategory, setSelectedCategory] = useState("news");

    // Handle Stop
    const handleStopBatch = () => {
        stopRef.current = true;
        setIsRunning(false);
        toast.info("Yêu cầu dừng sau khi bài viết hiện tại hoàn tất.");
    };
    const [selectedTemplate, setSelectedTemplate] = useState("informative");
    const [targetLength, setTargetLength] = useState("medium");
    const [providerPref, setProviderPref] = useState("auto");
    const [autoPublish, setAutoPublish] = useState(false);
    const [autoGenerateImage, setAutoGenerateImage] = useState(true);

    // Run State
    const [isRunning, setIsRunning] = useState(false);
    const [batchItems, setBatchItems] = useState<BatchItem[]>([]);

    // Derived
    const keywordsList = keywordsInput.split('\n').map(k => k.trim()).filter(k => k.length > 0);
    const completedCount = batchItems.filter(i => i.status === 'completed').length;
    const failedCount = batchItems.filter(i => i.status === 'failed').length;
    const pendingCount = batchItems.filter(i => i.status === 'pending').length;
    const processingItem = batchItems.find(i => i.status === 'processing');
    const totalProgress = batchItems.length > 0 ? ((completedCount + failedCount) / batchItems.length) * 100 : 0;

    // --- Thực thi Batch thật (Sequential with Polling) ---
    const runBatchProcess = async (itemsToProcess: BatchItem[]) => {
        const currentItems = [...itemsToProcess];
        stopRef.current = false;

        for (let i = 0; i < currentItems.length; i++) {
            if (stopRef.current) break;
            // Check if user clicked Stop
            // Note: In a real app we'd use a ref to track if still running.
            // For now we'll continue with the items.

            try {
                // 1. Trigger Generation
                currentItems[i] = { ...currentItems[i], status: 'processing', progress: 5 };
                setBatchItems([...currentItems]);

                const genRes: any = await aiApi.generate({
                    topic: currentItems[i].keyword,
                    categoryId: selectedCategory,
                    template: selectedTemplate,
                    length: targetLength,
                    provider: providerPref
                });

                const jobId = genRes?.data?.jobId || genRes?.jobId;
                if (!jobId) throw new Error("Không lấy được Job ID");

                // 2. Poll Status
                let isDone = false;
                let attempts = 0;
                while (!isDone && attempts < 30) { // Timeout after 30 * 5s = 150s
                    await new Promise(r => setTimeout(r, 5000));
                    attempts++;

                    const statusRes: any = await aiApi.checkStatus(jobId);
                    const statusData = statusRes.data || statusRes;

                    currentItems[i] = {
                        ...currentItems[i],
                        progress: statusData.progress || currentItems[i].progress,
                        provider: statusData.provider || providerPref
                    };
                    setBatchItems([...currentItems]);

                    if (statusData.state === 'completed') {
                        isDone = true;
                        currentItems[i] = {
                            ...currentItems[i],
                            status: 'completed',
                            progress: 100,
                            timeTaken: (attempts * 5) + 's'
                        };
                    } else if (statusData.state === 'failed') {
                        isDone = true;
                        throw new Error(statusData.error || "AI Generation failed");
                    }
                }

                if (!isDone) throw new Error("Thao tác quá hạn (Timeout)");

            } catch (error: any) {
                console.error("Batch error for item:", i, error);
                currentItems[i] = {
                    ...currentItems[i],
                    status: 'failed',
                    progress: 100,
                    error: error.message || "Lỗi không xác định"
                };
            }

            setBatchItems([...currentItems]);
        }

        setIsRunning(false);
        const successCount = currentItems.filter(i => i.status === 'completed').length;
        const failedCount = currentItems.filter(i => i.status === 'failed').length;
        toast.success(`Hoàn tất batch! Thành công: ${successCount}, Thất bại: ${failedCount}`);
    };

    const handleStartBatch = () => {
        if (keywordsList.length === 0) {
            toast.error("Vui lòng nhập ít nhất 1 từ khóa/tiêu đề");
            return;
        }

        const items: BatchItem[] = keywordsList.map((kw, idx) => ({
            id: `batch-item-${Date.now()}-${idx}`,
            keyword: kw,
            status: 'pending',
            progress: 0
        }));

        setBatchItems(items);
        setIsRunning(true);
        runBatchProcess(items);
    };

    return (
        <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto min-h-screen">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2 mb-2">
                    <ListPlus className="text-primary" />
                    Tạo bài viết hàng loạt bằng AI
                </h1>
                <p className="text-sm text-muted-foreground">
                    Tiết kiệm thời gian bằng cách nhập danh sách từ khóa tĩnh, AI sẽ tự động nghiên cứu, viết bài và tối ưu SEO hàng loạt.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* ---------- LEFT COLUMN: CONFIG FORM ---------- */}
                <div className="lg:col-span-5 space-y-6">
                    <Card className="shadow-sm">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-base font-semibold">1. Danh sách Từ khóa / Tiêu đề</CardTitle>
                            <CardDescription>Mỗi dòng là một bài viết riêng biệt</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                placeholder="Nhập từ khóa ở đây...&#10;Ví dụ:&#10;Hướng dẫn học Excel cơ bản&#10;Quy trình quản lý kho thực tế&#10;Top 5 kỹ năng mềm cho năm 2024"
                                className="min-h-[200px] font-mono text-sm leading-relaxed whitespace-pre"
                                value={keywordsInput}
                                onChange={(e) => setKeywordsInput(e.target.value)}
                                disabled={isRunning}
                            />
                            <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground font-medium">
                                <span>Phát hiện: <strong className="text-primary">{keywordsList.length}</strong> bài viết cần tạo</span>
                                <div>
                                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-indigo-50 text-indigo-700">
                                        <Sparkles className="h-3 w-3" />
                                        Capacity ước tính: {keywordsList.length * 1200} tokens
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardHeader className="pb-4 border-b">
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <Settings2 className="h-4 w-4 text-muted-foreground" />
                                2. Cấu hình Content
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-5 pt-5">

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700">Chuyên mục (Category)</label>
                                    <select
                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        disabled={isRunning}
                                    >
                                        <option value="news">Tin tức AI</option>
                                        <option value="tutorial">Hướng dẫn kỹ năng</option>
                                        <option value="review">Đánh giá công cụ</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700">Mẫu bài (Template)</label>
                                    <AITemplateSelector
                                        value={selectedTemplate}
                                        onValueChange={setSelectedTemplate}
                                        disabled={isRunning}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700">Provider Ưu Tiên</label>
                                    <select
                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                        value={providerPref}
                                        onChange={(e) => setProviderPref(e.target.value)}
                                        disabled={isRunning}
                                    >
                                        <option value="auto">Tự động (Groq → Gemini...)</option>
                                        <option value="groq">Chỉ dùng Groq (Nhanh nhất)</option>
                                        <option value="claude">Anthropic Claude (Viết hay nhất)</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700">Độ dài</label>
                                    <select
                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                        value={targetLength}
                                        onChange={(e) => setTargetLength(e.target.value)}
                                        disabled={isRunning}
                                    >
                                        <option value="short">Ngắn (~800 từ)</option>
                                        <option value="medium">Vừa (~1500 từ)</option>
                                        <option value="long">Dài chuyên sâu (2500+ từ)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="pt-2 border-t space-y-3">
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="terms" checked={autoGenerateImage} onCheckedChange={(c) => setAutoGenerateImage(!!c)} disabled={isRunning} />
                                    <label
                                        htmlFor="terms"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-1.5"
                                    >
                                        <ImageIcon className="h-3.5 w-3.5 text-muted-foreground" />
                                        Tự động Prompt & Sinh ảnh minh họa bằng AI DALL-E 3
                                    </label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="publish" checked={autoPublish} onCheckedChange={(c) => setAutoPublish(!!c)} disabled={isRunning} />
                                    <label
                                        htmlFor="publish"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-1.5"
                                    >
                                        <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                                        Đăng công khai ngay lập tức (Thay vì lưu dạng Bản nháp)
                                    </label>
                                </div>
                            </div>

                        </CardContent>
                        <CardFooter className="bg-slate-50 border-t py-4">
                            {!isRunning ? (
                                <Button
                                    className="w-full h-11 bg-primary hover:bg-primary/90 text-sm font-bold tracking-wide"
                                    onClick={handleStartBatch}
                                    disabled={keywordsList.length === 0}
                                >
                                    <Play className="h-4 w-4 mr-2 fill-current" /> BẮT ĐẦU TẠO ({keywordsList.length} BÀI)
                                </Button>
                            ) : (
                                <Button
                                    className="w-full h-11 bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold tracking-wide shadow-sm"
                                    onClick={handleStopBatch}
                                >
                                    <StopCircle className="h-4 w-4 mr-2" /> DỪNG TIẾN TRÌNH
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                </div>


                {/* ---------- RIGHT COLUMN: EXECUTION QUEUE ---------- */}
                <div className="lg:col-span-7 flex flex-col">
                    <Card className="shadow-sm flex-1 flex flex-col border-slate-200">
                        <CardHeader className="bg-slate-50/50 border-b pb-4">
                            <div className="flex justify-between items-center mb-2">
                                <CardTitle className="text-base font-semibold flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-blue-500" />
                                    Tiến trình thực thi
                                </CardTitle>
                                {batchItems.length > 0 && (
                                    <Badge variant="outline" className={isRunning ? "bg-amber-50 text-amber-700 border-amber-200 animate-pulse" : "bg-zinc-100 text-zinc-600 border-none"}>
                                        {isRunning ? 'Đang chạy...' : totalProgress === 100 ? 'Đã hoàn tất' : 'Chưa bắt đầu'}
                                    </Badge>
                                )}
                            </div>

                            {batchItems.length > 0 ? (
                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-xs font-bold text-slate-600">
                                        <span>Tổng quan ({completedCount + failedCount}/{batchItems.length})</span>
                                        <span className="text-primary">{Math.round(totalProgress)}%</span>
                                    </div>
                                    <Progress value={totalProgress} className="h-2" />

                                    <div className="flex gap-4 pt-2 text-[11px] font-semibold">
                                        <div className="flex items-center gap-1.5 text-emerald-600"><CheckCircle2 className="w-3.5 h-3.5" /> Thành công: {completedCount}</div>
                                        <div className="flex items-center gap-1.5 text-rose-600"><AlertCircle className="w-3.5 h-3.5" /> Thất bại: {failedCount}</div>
                                        <div className="flex items-center gap-1.5 text-slate-500"><Clock className="w-3.5 h-3.5" /> Chờ xử lý: {pendingCount}</div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-sm text-muted-foreground flex items-center gap-2">
                                    Hãy nhập danh sách từ khóa và bấm bắt đầu để theo dõi tiến trình tại đây.
                                </div>
                            )}
                        </CardHeader>

                        <CardContent className="flex-1 p-0 overflow-hidden relative">
                            {batchItems.length === 0 ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground bg-slate-50/30">
                                    <FileText className="h-10 w-10 opacity-20 mb-3" />
                                    <p className="font-medium text-sm">Hàng đợi đang trống</p>
                                </div>
                            ) : (
                                <div className="absolute inset-0 overflow-y-auto p-4 space-y-3">
                                    {batchItems.map((item, index) => (
                                        <div
                                            key={item.id}
                                            className={`border rounded-lg p-3 transition-colors ${item.status === 'processing' ? 'bg-primary/5 border-primary/20 shadow-sm' :
                                                item.status === 'completed' ? 'bg-white border-emerald-100' :
                                                    item.status === 'failed' ? 'bg-rose-50/30 border-rose-100' :
                                                        'bg-white text-slate-400'
                                                }`}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center gap-2 font-bold text-sm text-slate-800">
                                                    <span className="text-xs text-slate-400 font-mono">#{index + 1}</span>
                                                    <span className={item.status === 'pending' ? 'opacity-60 text-slate-500 font-medium' : ''}>
                                                        {item.keyword}
                                                    </span>
                                                </div>

                                                {item.status === 'completed' && <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-none px-2 shrink-0">Hoàn thành</Badge>}
                                                {item.status === 'failed' && <Badge variant="outline" className="bg-rose-50 text-rose-700 border-none px-2 shrink-0">Lỗi</Badge>}
                                                {item.status === 'processing' && <Badge variant="outline" className="bg-primary/10 text-primary border-none text-[10px] animate-pulse px-2 shrink-0">Đang viết...</Badge>}
                                                {item.status === 'pending' && <span className="text-[10px] font-semibold text-slate-400 uppercase">Chờ...</span>}
                                            </div>

                                            {item.status === 'processing' && (
                                                <div className="space-y-1.5 mt-2">
                                                    <Progress value={item.progress} className="h-1" />
                                                    <div className="flex justify-between text-[10px] text-muted-foreground font-medium">
                                                        <span>
                                                            {item.progress < 30 ? 'Đang nghiên cứu chủ đề...' :
                                                                item.progress < 60 ? `Đang viết nội dung (${item.provider})...` :
                                                                    item.progress < 90 ? 'Đang tạo ảnh minh họa...' : 'Tối ưu SEO...'}
                                                        </span>
                                                        <span className="text-primary">{item.progress}%</span>
                                                    </div>
                                                </div>
                                            )}

                                            {(item.status === 'completed' || item.status === 'failed') && (
                                                <div className="flex items-center gap-3 mt-1 text-[11px] font-medium text-slate-500">
                                                    <div className="flex items-center gap-1"><Clock className="w-3 h-3" /> {item.timeTaken}</div>
                                                    <div className="flex items-center gap-1"><Sparkles className="w-3 h-3 text-amber-500" /> {item.provider || 'Groq'}</div>
                                                    {item.status === 'completed' && <a href="#" className="ml-auto text-primary hover:underline">Xem bài</a>}
                                                </div>
                                            )}

                                            {item.status === 'failed' && item.error && (
                                                <div className="mt-2 text-[10px] bg-rose-100/50 text-rose-800 px-2 py-1.5 rounded items-center line-clamp-1 italic">
                                                    <AlertCircle className="inline-block w-3 h-3 mr-1" /> {item.error}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
