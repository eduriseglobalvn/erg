"use client"

import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { aiApi, postsApi } from '@/services';
import { localSeoAnalyzer } from '@/utils/local-seo';

// 1. Định nghĩa lại kiểu dữ liệu trả về cho chắc chắn
// (Khớp với JSON: { statusCode: 200, data: { ... } })
interface ApiResponse<T> {
    statusCode: number;
    message: string;
    data: T;
}

interface AiStatusData {
    id: string;
    state: 'waiting' | 'active' | 'completed' | 'failed';
    progress: number;
    result?: {
        postId: string;
        slug?: string;
    };
}

export function useAiWriter(editor: any) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [isRefining, setIsRefining] = useState(false);
    const [progress, setProgress] = useState(0);

    // FIX LỖI 1: Dùng 'any' cho interval để tránh xung đột kiểu giữa Node và Browser
    const intervalRef = useRef<any>(null);

    // CLEANUP LỖI MEMORY LEAK (B-H4)
    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    // --- HÀM MÔ PHỎNG HIỆU ỨNG GÕ CHỮ (NÂNG CẤP: CHUẨN ĐỊNH DẠNG) ---
    const typeIntoEditor = async (html: string, editor: any) => {
        if (!editor || !html) return;

        // 1. Xóa trắng editor
        editor.commands.setContent('');

        // 2. Parse HTML thành các khối (blocks)
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        // Lấy tất cả các con trực tiếp của body (p, h2, figure, ...)
        const blocks = Array.from(doc.body.childNodes);

        for (const node of blocks) {
            // Loại bỏ text node chỉ chứa khoảng trắng/newline thừa
            if (node.nodeType === Node.TEXT_NODE && !node.textContent?.trim()) continue;

            const content = node.nodeType === Node.TEXT_NODE
                ? node.textContent
                : (node as HTMLElement).outerHTML;

            if (content) {
                // Chèn khối nguyên vẹn để không bị hỏng thẻ HTML
                editor.commands.insertContent(content);

                // Delay nhẹ giữa các khối để tạo hiệu ứng streaming
                await new Promise(r => setTimeout(r, 400));

                // Tự động cuộn
                const editorEl = editor.options.element;
                if (editorEl) {
                    const scrollContainer = editorEl.closest('.overflow-y-auto');
                    if (scrollContainer) {
                        scrollContainer.scrollTo({
                            top: scrollContainer.scrollHeight,
                            behavior: 'smooth'
                        });
                    }
                }
            }
        }
    };

    const generateFullPost = async (
        topic: string,
        categoryId: string,
        onSuccess: (data: any) => void,
        config?: { template?: string; length?: string; provider?: string }
    ) => {
        setIsGenerating(true);
        setProgress(5);
        const toastId = toast.loading('AI đang lên ý tưởng...');

        try {
            const res: any = await aiApi.generate({
                topic,
                categoryId,
                template: config?.template,
                length: config?.length,
                provider: config?.provider
            });
            const jobId = res?.data?.jobId || res?.jobId;

            if (!jobId) throw new Error("Không lấy được Job ID từ Server");

            intervalRef.current = setInterval(async () => {
                try {
                    const resStatus = await aiApi.checkStatus(jobId) as any;

                    // Kiểm tra lỗi từ phía Server (nếu không phải 200/201...)
                    if (!resStatus || (resStatus.status && resStatus.status >= 400)) {
                        throw new Error(resStatus.message || "Lỗi khi kiểm tra trạng thái AI");
                    }

                    const statusData = resStatus.data || resStatus;

                    if (statusData.progress) setProgress(statusData.progress);

                    if (statusData.state === 'completed') {
                        clearInterval(intervalRef.current);
                        setProgress(95);

                        // [OPTIMIZATION] Kiểm tra dữ liệu trực tiếp từ AI status trước
                        // Nhiều lúc Backend trả về data ({title, content}) ngay trong status
                        const resultData = statusData.data || statusData.result;
                        let actualPostData = null;

                        if (resultData?.content && resultData?.title) {
                            actualPostData = resultData;
                        } else {
                            // Nếu không có data trực tiếp, mới dùng postId để fetch bài viết
                            const postId = resultData?.postId || statusData.postId;
                            if (!postId) throw new Error("AI đã hoàn thành nhưng không tìm thấy ID bài viết");

                            console.log("[useAiWriter] Đang fetch bài viết AI vừa tạo:", postId);

                            // [FIX 404] Thử fetch lại 3 lần (mỗi lần cách nhau 2s) nếu gặp lỗi 404
                            // Do đôi khi DB chưa kịp sync xong bài viết mới tạo từ AI Worker
                            let retries = 0;
                            const maxRetries = 3;

                            while (retries < maxRetries) {
                                try {
                                    const postRes: any = await postsApi.getOne(postId);
                                    actualPostData = postRes.data || postRes;
                                    break; // Thành công thì thoát loop
                                } catch (err: any) {
                                    retries++;
                                    if (retries >= maxRetries) {
                                        console.error("[useAiWriter] Lỗi fetch bài viết sau 3 lần thử:", err);
                                        throw new Error("Không thể lấy dữ liệu bài viết (404 Not Found). Backend có vẻ chưa lưu xong dữ liệu.");
                                    }
                                    console.warn(`[useAiWriter] Thử lại lần ${retries}/${maxRetries} sau 2s...`);
                                    await new Promise(r => setTimeout(r, 2000));
                                }
                            }
                        }

                        if (!actualPostData) {
                            throw new Error("Không tìm thấy nội dung bài viết sau khi AI xử lý");
                        }

                        // === BẮT ĐẦU QUY TRÌNH HIỂN THỊ ===
                        toast.dismiss(toastId);
                        toast.success('AI đã viết xong, đang trình bày...');

                        // 1. Cập nhật Title và Metadata NGAY LẬP TỨC
                        onSuccess(actualPostData);

                        // 2. Thực hiện gõ vào editor (hiệu ứng chảy chữ)
                        if (editor && actualPostData.content) {
                            await typeIntoEditor(actualPostData.content, editor);

                            // 3. Tự động kiểm tra SEO sau khi AI viết bài
                            const seoScore = localSeoAnalyzer(
                                actualPostData.content,
                                actualPostData.title || '',
                                actualPostData.metaDescription || '',
                                actualPostData.focusKeyword || ''
                            );

                            if (seoScore.overallScore < 50) {
                                setTimeout(async () => {
                                    const confirmRefine = window.confirm(
                                        `Nội dung này chuẩn SEO khá thấp (Điểm: ${seoScore.overallScore}/100).\nBạn có muốn yêu cầu AI thử viết lại một bản khác tối ưu hơn không?`
                                    );
                                    if (confirmRefine) {
                                        const refineToastId = toast.loading('Đang yêu cầu AI tối ưu lại nội dung...');
                                        const instruction = `Tối ưu hóa nội dung chuẩn SEO, phân bổ lại từ khóa "${actualPostData.focusKeyword || 'chính'}" hợp lý, bổ sung thẻ H2/H3 và đoạn văn chất lượng. Trả về định dạng HTML.`;
                                        const refined = await refineText(actualPostData.content, instruction);

                                        if (refined) {
                                            toast.dismiss(refineToastId);
                                            toast.success('Đã tối ưu SEO xong!');
                                            await typeIntoEditor(refined, editor);
                                            onSuccess({ ...actualPostData, content: refined });
                                        } else {
                                            toast.dismiss(refineToastId);
                                            toast.error('Lỗi khi tối ưu nội dung');
                                        }
                                    }
                                }, 500);
                            }
                        }

                        setProgress(100);
                        setIsGenerating(false);
                    }
                    else if (statusData.state === 'failed') {
                        clearInterval(intervalRef.current);
                        toast.dismiss(toastId);

                        // Thông báo UI thân thiện cho AI Rate Limit / Quota
                        if (statusData.status === 'rate_limited' || statusData.error?.includes('rate limit') || statusData.error?.includes('429')) {
                            toast.warning('Đang chờ rate limit reset... Hệ thống sẽ tự động thử lại sau giây lát.', { duration: 5000 });
                        } else if (statusData.status === 'quota_exceeded' || statusData.error?.includes('quota')) {
                            toast.error('Đã hết quota AI hiện tại. Hệ thống đang tự động chuyển sang provider / key khác...', { duration: 5000 });
                        } else if (statusData.status === 'all_providers_exhausted') {
                            toast.error('Tất cả AI providers đều hết quota. Vui lòng thêm API key mới tại Cài đặt > AI Keys.', { duration: 8000 });
                        } else {
                            toast.error(statusData.error || 'AI gặp lỗi trong quá trình xử lý', { duration: 5000 });
                        }
                        setIsGenerating(false);
                    }
                } catch (err: any) {
                    console.error("Polling error:", err);
                    clearInterval(intervalRef.current);
                    toast.dismiss(toastId);
                    toast.error(err.message || 'Lỗi khi đồng bộ kết quả AI');
                    setIsGenerating(false);
                }
            }, 5000); // Tăng lên 5s để nhẹ server tối đa theo yêu cầu từ USER

        } catch (error: any) {
            console.error(error);
            toast.dismiss(toastId);
            toast.error(error.message || 'Lỗi kết nối AI');
            setIsGenerating(false);
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
    };

    const refineText = async (originalText: string, instruction: string) => {
        setIsRefining(true);
        try {
            const res: any = await aiApi.refine({ text: originalText, instruction });
            return res.data?.refinedContent || res.refinedContent || res.result;
        } catch (e) {
            console.error(e);
            toast.error('Lỗi kết nối AI');
            return null;
        } finally {
            setIsRefining(false);
        }
    };

    return {
        isGenerating,
        isRefining,
        progress,
        generateFullPost,
        refineText
    };
}