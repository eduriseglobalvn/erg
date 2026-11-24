import type { Metadata } from 'next';
import { createPageMetadata } from '@/utils/seo/page-metadata';
import TrackingClient from './client';

export const metadata: Metadata = createPageMetadata({
    title: 'Tra cứu trạng thái hồ sơ ứng tuyển',
    description: 'Nhập mã hồ sơ để theo dõi trạng thái ứng tuyển của bạn tại ERG (Edurise Global): đang xem xét, phỏng vấn hay đã có kết quả tuyển dụng.',
    path: '/tuyen-dung/theo-doi',
    imageAlt: 'Tra cứu trạng thái hồ sơ ứng tuyển tại ERG',
    robots: { index: false, follow: true },
});

export default function TrackingPage() {
    return <TrackingClient />;
}
