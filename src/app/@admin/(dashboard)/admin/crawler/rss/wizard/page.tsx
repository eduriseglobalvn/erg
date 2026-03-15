"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ChevronRight, Globe, Loader2, Newspaper, Rss, Settings2, ShieldCheck, Sparkles, AlertCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/admin/ui/card";
import { Label } from "@/components/admin/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/admin/ui/select";
import { Switch } from "@/components/admin/ui/switch";

import { useQuery } from "@tanstack/react-query"
import { crawlerApi, RssPreviewResponse } from "@/services/crawler.api"
import { postsApi } from "@/services/posts.api"

export default function RssWizardPage() {
    const [step, setStep] = useState(1)
    const [url, setUrl] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [previewData, setPreviewData] = useState<RssPreviewResponse | null>(null)
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>("")
    const [autoPublish, setAutoPublish] = useState(false)

    // Fetch Categories
    const { data: categories = [] } = useQuery({
        queryKey: ['categories'],
        queryFn: () => postsApi.getCategories()
    })

    const handleCheckUrl = async () => {
        if (!url) {
            toast.error("Vui lòng nhập URL nguồn tin")
            return
        }
        setIsLoading(true)
        try {
            const res = await crawlerApi.previewRss(url)
            setPreviewData(res)
            setStep(2)
            toast.success("Đã tìm thấy RSS Feed hợp lệ!")
        } catch (error: any) {
            toast.error(error.message || "Không tìm thấy RSS hợp lệ tại URL này.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleSave = async () => {
        if (!selectedCategoryId) {
            toast.error("Vui lòng chọn danh mục lưu bài")
            return
        }

        setIsSaving(true)
        try {
            await crawlerApi.createRssSource({
                name: previewData?.title || "Nguồn tin mới",
                url: url,
                targetCategoryId: selectedCategoryId,
                cronExpression: "0 * * * *",
                isActive: true,
                autoPublish: autoPublish
            })
            setStep(4)
            toast.success("Đã thiết lập nguồn tin thành công!")
        } catch (error: any) {
            toast.error(error.message || "Lỗi khi lưu nguồn tin")
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="flex-1 space-y-6 flex flex-col items-center justify-center p-4 md:p-8 pt-6 min-h-[80vh]">
            <div className="w-full max-w-3xl">
                <div className="mb-8">
                    <Link href="/admin/crawler/rss" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4 transition-colors">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Quay lại danh sách RSS
                    </Link>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
                        <Sparkles className="h-8 w-8 text-amber-500" />
                        Trợ lý thêm Nguồn Tin RSS
                    </h2>
                    <p className="text-muted-foreground mt-2">
                        Chỉ cần dán đường dẫn trang web, hệ thống AI của ERG sẽ tự động cấu hình bộ máy cào bài tĩnh định kỳ cho bạn.
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="flex justify-between items-center mb-8 relative">
                    <div className="absolute left-[10%] right-[10%] top-1/2 -translate-y-1/2 h-1 bg-slate-100 -z-10 rounded-full" />
                    <div
                        className="absolute left-[10%] top-1/2 -translate-y-1/2 h-1 bg-blue-600 -z-10 rounded-full transition-all duration-500 ease-in-out"
                        style={{ width: step === 1 ? '0%' : step === 2 ? '40%' : step === 3 ? '80%' : '100%' }}
                    />

                    {[
                        { title: "Nhập URL", icon: Globe },
                        { title: "Xác nhận", icon: CheckCircle2 },
                        { title: "Cài đặt & AI", icon: Settings2 },
                    ].map((s, i) => {
                        const isActive = step === i + 1;
                        const isPast = step > i + 1;
                        const Icon = s.icon;
                        return (
                            <div key={i} className="flex flex-col items-center gap-2 bg-white px-2">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300
                                    ${isActive ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-[0_0_0_4px_rgba(37,99,235,0.1)]'
                                        : isPast ? 'border-blue-600 bg-blue-600 text-white'
                                            : 'border-slate-200 bg-white text-slate-400'}`}
                                >
                                    <Icon className="w-5 h-5" />
                                </div>
                                <span className={`text-xs font-semibold uppercase tracking-wider ${isActive ? 'text-blue-700' : isPast ? 'text-slate-800' : 'text-slate-400'}`}>
                                    {s.title}
                                </span>
                            </div>
                        )
                    })}
                </div>

                {/* --- MÀN HÌNH THEO TỪNG BƯỚC --- */}

                {/* BƯỚC 1: NHẬP URL */}
                {step === 1 && (
                    <Card className="border-2 border-blue-100 shadow-md animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <CardHeader className="bg-blue-50/50 border-b border-blue-100 pb-6 rounded-t-xl">
                            <CardTitle className="text-xl text-blue-900">1. Dán đường dẫn website</CardTitle>
                            <CardDescription className="text-blue-700/70 text-base">
                                Bạn có thể dán URL RSS trực tiếp (.xml) hoặc dán link website thường, AI sẽ tự động tìm RSS cho bạn.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-8 pb-8 px-6 sm:px-10">
                            <div className="space-y-4">
                                <Label htmlFor="wizard-url" className="text-base font-medium">Đường dẫn Website / Tin tức</Label>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Input
                                        id="wizard-url"
                                        placeholder="Ví dụ: https://tuoitre.vn hoặc https://vnexpress.net/rss/tin-moi-nhat.rss"
                                        className="h-14 text-lg bg-slate-50 border-slate-300 focus-visible:ring-blue-500 shadow-inner"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleCheckUrl()}
                                    />
                                    <Button
                                        size="lg"
                                        className="h-14 px-8 text-base bg-blue-600 hover:bg-blue-700 shrink-0 shadow-md hover:shadow-lg transition-all"
                                        onClick={handleCheckUrl}
                                        disabled={isLoading || !url}
                                    >
                                        {isLoading ? (
                                            <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Đang quét...</>
                                        ) : (
                                            <>Tiếp tục <ChevronRight className="ml-2 h-5 w-5" /></>
                                        )}
                                    </Button>
                                </div>
                                <div className="bg-amber-50 rounded-lg p-4 border border-amber-200 flex items-start text-sm text-amber-800 mt-6">
                                    <AlertCircle className="w-5 h-5 mr-3 shrink-0 mt-0.5 text-amber-600" />
                                    <p>Hệ thống tự động bỏ qua các trang chống cào bài. Bạn chỉ cần nhập URL, bot sẽ lo phần vượt Firewall nếu cần thiết một cách hợp pháp.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* BƯỚC 2: PREVIEW & XÁC NHẬN */}
                {step === 2 && (
                    <Card className="border-2 border-green-100 shadow-md animate-in fade-in slide-in-from-right-8 duration-500">
                        <CardHeader className="bg-green-50/50 border-b border-green-100 pb-6 rounded-t-xl">
                            <div className="flex items-center gap-3">
                                <div className="bg-green-100 p-2 rounded-full text-green-600">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl text-green-900">2. Kết nối thành công!</CardTitle>
                                    <CardDescription className="text-green-700/80 text-base">
                                        Chúng tôi đã phân tích luồng dữ liệu. Dưới đây là thông tin thu thập được:
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6 pb-6 px-6">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-4 text-sm">
                                    <div className="grid grid-cols-[100px_1fr] gap-2">
                                        <span className="text-muted-foreground font-medium">Tên nguồn:</span>
                                        <span className="font-bold text-slate-800">{previewData?.title}</span>
                                    </div>
                                    <div className="grid grid-cols-[100px_1fr] gap-2">
                                        <span className="text-muted-foreground font-medium">RSS URL:</span>
                                        <span className="text-blue-600 truncate bg-blue-50 px-2 py-0.5 rounded italic">{url}</span>
                                    </div>
                                    <div className="grid grid-cols-[100px_1fr] gap-2">
                                        <span className="text-muted-foreground font-medium">Trạng thái:</span>
                                        <span className="text-green-600 font-medium flex items-center">
                                            <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                                            Sẵn sàng hoạt động
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-[100px_1fr] gap-2">
                                        <span className="text-muted-foreground font-medium">Bài hiện có:</span>
                                        <span className="text-slate-700 font-bold">{previewData?.items.length || 0} bài mới</span>
                                    </div>
                                </div>

                                <div className="bg-slate-50 border rounded-lg p-4">
                                    <h4 className="font-semibold text-slate-700 flex items-center mb-3">
                                        <Newspaper className="w-4 h-4 mr-2" />
                                        Xem trước bài viết
                                    </h4>
                                    <div className="space-y-3">
                                        {previewData?.items.slice(0, 3).map((art, idx) => (
                                            <div key={idx} className="flex flex-col border-b last:border-0 pb-2 last:pb-0 border-slate-200">
                                                <span className="font-medium text-sm text-slate-800 line-clamp-1">{art.title}</span>
                                                <span className="text-[10px] text-muted-foreground">{art.pubDate || "Vừa xong"}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mt-8 pt-4 border-t">
                                <Button variant="ghost" onClick={() => setStep(1)} className="text-muted-foreground">Quay lại</Button>
                                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8" onClick={() => setStep(3)}>
                                    Trông có vẻ ổn, Tiếp tục! <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* BƯỚC 3: SMART DEFAULT / CONFIG */}
                {step === 3 && (
                    <Card className="border-2 border-indigo-100 shadow-md animate-in fade-in slide-in-from-right-8 duration-500">
                        <CardHeader className="bg-indigo-50/50 border-b border-indigo-100 pb-6 rounded-t-xl">
                            <CardTitle className="text-xl text-indigo-900">3. Thiết lập thông minh</CardTitle>
                            <CardDescription className="text-indigo-700/80 text-base">
                                ERG AI đã tự động điền các cấu hình tốt nhất. Bạn chỉ cần chọn Danh mục lưu bài.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-8 pb-6 px-6 sm:px-10">
                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <Label className="text-base font-bold flex items-center">
                                        <span className="text-red-500 mr-1">*</span>
                                        Bài viết cào về lưu vào danh mục nào?
                                    </Label>
                                    <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
                                        <SelectTrigger className="w-full h-12 text-base">
                                            <SelectValue placeholder="Chọn danh mục" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((cat: any) => (
                                                <SelectItem key={cat.id} value={cat.id.toString()}>
                                                    {cat.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-5 relative">
                                    <div className="absolute top-0 right-0 p-2 opacity-50"><Settings2 className="w-16 h-16 text-slate-200" /></div>
                                    <h4 className="font-semibold text-slate-700 relative z-10">Cấu hình tự động (Auto-Pilot)</h4>

                                    <div className="flex items-center justify-between relative z-10">
                                        <div className="space-y-0.5">
                                            <Label className="text-base text-slate-800">Tần suất cào</Label>
                                            <p className="text-sm text-slate-500">Mặc định: 1 giờ / lần (Giờ chẵn)</p>
                                        </div>
                                        <div className="font-mono bg-white px-2 py-1 rounded border text-sm text-blue-600 font-bold">
                                            0 * * * *
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between border-t pt-4 relative z-10">
                                        <div className="space-y-0.5 pr-8">
                                            <Label className="text-base text-slate-800">Tự động xuất bản (Auto-Publish)</Label>
                                            <p className="text-sm text-slate-500">Nếu bật, bài viết sẽ công khai và nộp sitemap ngay sau khi AI SEO xử lý xong.</p>
                                        </div>
                                        <Switch checked={autoPublish} onCheckedChange={setAutoPublish} />
                                    </div>

                                    <div className="flex items-center justify-between border-t pt-4 relative z-10">
                                        <div className="space-y-0.5 pr-8">
                                            <Label className="text-base text-slate-800 flex items-center">
                                                AI Clean & Rewrite <Sparkles className="w-3 h-3 text-amber-500 ml-1" />
                                            </Label>
                                            <p className="text-sm text-slate-500">Sử dụng Google AI tự động viết lại title và lược bỏ html thừa. Giúp tránh báo lỗi spam trùng lặp.</p>
                                        </div>
                                        <Switch checked={true} onCheckedChange={() => { }} disabled />
                                    </div>
                                </div>

                                <div className="flex justify-between items-center pt-2">
                                    <Button variant="ghost" onClick={() => setStep(2)} className="text-muted-foreground">Quay lại</Button>
                                    <Button
                                        size="lg"
                                        className="bg-indigo-600 hover:bg-indigo-700 px-8 text-base shadow-lg"
                                        onClick={handleSave}
                                        disabled={isSaving}
                                    >
                                        {isSaving ? (
                                            <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Đang tạo tiến trình...</>
                                        ) : (
                                            <><CheckCircle2 className="mr-2 h-5 w-5" /> Hoàn tất cài đặt</>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* BƯỚC 4: THÀNH CÔNG */}
                {step === 4 && (
                    <div className="text-center space-y-6 bg-white p-12 rounded-2xl border shadow-sm animate-in zoom-in-95 duration-500 max-w-xl mx-auto">
                        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shrink-0 shadow-inner">
                            <CheckCircle2 className="w-12 h-12" />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-800">Thêm nguồn tin thành công!</h2>
                        <p className="text-slate-600 text-lg">
                            Hệ thống đã bắt đầu tiến trình cào lô bài viết đầu tiên.
                            Các bài viết sẽ được AI xử lý và đưa vào trạng thái Nháp (Draft).
                        </p>
                        <div className="pt-6 flex flex-col sm:flex-row justify-center gap-4">
                            <Link href="/admin/crawler">
                                <Button variant="outline" size="lg" className="w-full">Về Dashboard</Button>
                            </Link>
                            <Link href="/admin/posts">
                                <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700">Xem bài viết đã cào</Button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function ArrowRight(props: any) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
}
