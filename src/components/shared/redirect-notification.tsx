'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function RedirectNotification() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const reason = searchParams.get('reason');

    useEffect(() => {
        if (reason === 'not-found') {
            toast.error('Nội dung không tồn tại', {
                description: 'Bài viết bạn tìm kiếm không tồn tại hoặc đã bị gỡ bỏ. Bạn đã được chuyển hướng về trang danh sách.',
                duration: 5000,
            });

            // Clean up the URL
            const params = new URLSearchParams(searchParams.toString());
            params.delete('reason');
            const newUrl = window.location.pathname + (params.toString() ? `?${params.toString()}` : '');
            router.replace(newUrl, { scroll: false });
        }
    }, [reason, searchParams, router]);

    return null;
}
