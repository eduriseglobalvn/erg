import { useRef, useCallback } from 'react';
import { postsApi } from '@/services/posts.api';

/**
 * Hook để track images trong editor content
 * Giúp detect ảnh nào bị xóa để gọi API cleanup
 */
export function useImageTracker() {
    const previousImagesRef = useRef<Set<string>>(new Set());

    /**
     * Extract tất cả image URLs từ HTML content
     */
    const extractImageUrls = useCallback((htmlContent: string): string[] => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');
        const images = doc.querySelectorAll('img');

        return Array.from(images)
            .map(img => img.getAttribute('src'))
            .filter((src): src is string => {
                // Chỉ lấy ảnh từ media server (đã upload)
                // Bỏ qua base64, external URLs, etc.
                return !!src && src.includes('media.erg.edu.vn');
            });
    }, []);

    /**
     * Update danh sách ảnh hiện tại
     */
    const updateImages = useCallback((htmlContent: string) => {
        const currentUrls = extractImageUrls(htmlContent);
        previousImagesRef.current = new Set(currentUrls);
    }, [extractImageUrls]);

    /**
     * Tìm ảnh nào bị xóa so với lần trước
     */
    const getDeletedImages = useCallback((newHtmlContent: string): string[] => {
        const currentUrls = new Set(extractImageUrls(newHtmlContent));
        const deletedUrls: string[] = [];

        // Tìm ảnh có trong previous nhưng không có trong current
        previousImagesRef.current.forEach(url => {
            if (!currentUrls.has(url)) {
                deletedUrls.push(url);
            }
        });

        return deletedUrls;
    }, [extractImageUrls]);

    /**
     * Xóa các ảnh đã bị remove khỏi content
     */
    const cleanupDeletedImages = useCallback(async (deletedUrls: string[]) => {
        if (deletedUrls.length === 0) return;

        console.log('--- START CLEANUP ---');
        console.log('Images to delete:', deletedUrls);

        const deletePromises = deletedUrls.map(url => {
            // Đảm bảo URL sạch, không có khoảng trắng dư thừa (nguyên nhân hay gây lỗi 400)
            const cleanUrl = url.trim();

            console.log(`Sending DELETE for URL: "${cleanUrl}"`);

            return postsApi.deleteImage(cleanUrl).catch(err => {
                console.error(`Status 400/Error for URL ${cleanUrl}:`, err);
            });
        });

        await Promise.allSettled(deletePromises);
        console.log('--- END CLEANUP ---');
    }, []);

    return {
        updateImages,
        getDeletedImages,
        cleanupDeletedImages,
        extractImageUrls,
    };
}
