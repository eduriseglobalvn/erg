import type { Metadata } from 'next';
import { CandidateTrackingClient } from './client';

// Trang tra cứu theo mã hồ sơ cá nhân: không cho index và không đặt canonical để tránh lộ mã trong thẻ link.
export const metadata: Metadata = {
    title: 'Tra cứu hồ sơ ứng tuyển',
    description: 'Nhập mã hồ sơ để xem trạng thái ứng tuyển của bạn tại ERG (Edurise Global): đang xem xét, phỏng vấn hay đã có kết quả.',
    robots: { index: false, follow: false },
};

export default function CandidateTrackingPage() {
    return <CandidateTrackingClient />;
}
