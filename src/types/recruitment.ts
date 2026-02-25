export enum CandidateStatus {
    PENDING = 'PENDING',       // Chờ xử lý
    REVIEWING = 'REVIEWING',   // Đang xem xét
    INTERVIEW = 'INTERVIEW',   // Phỏng vấn
    OFFER = 'OFFER',           // Nhận việc
    HIRED = 'HIRED',           // Đã tuyển
    REJECTED = 'REJECTED',     // Từ chối
}

export interface Job {
    id: string;
    title: string;
    slug: string;
    salary: string;
    quantity: number;
    workType: string;
    workSchedule?: string; // e.g. "Từ thứ Hai đến thứ Bảy"
    deadline: string;
    postDate?: string; // e.g. "30/12/2025"
    location: string;
    summary: string;
    description: string[];
    requirements: string[];
    benefits: string[];

    // Trạng thái hiển thị (Publish / Nháp)
    isActive: boolean;
    status?: string; // e.g. "normal"

    // Các nhãn (Badge)
    isHot: boolean;      // 🔥 Hot (View > 20 & Còn hạn)
    isNew: boolean;      // ✨ Mới (Tạo < 7 ngày)
    isUrgent: boolean;   // ⚡️ Gấp (Deadline < 5 ngày)
    viewCount: number;   // Lượt xem (tự tăng)

    createdAt: string;
    updatedAt?: string;
}

export interface Candidate {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    cvUrl: string;
    status: CandidateStatus;
    trackingCode: string;
    jobTitle?: string; // New flat field from backend
    applyType?: 'ONLINE' | 'ZALO';
    publicNote?: string; // Information for candidate from HR
    job?: Job;
    submittedAt: string; // Alias of createdAt
    jobId?: string; // For Admin create/update payload
}
