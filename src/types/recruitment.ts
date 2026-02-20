export enum JobStatus {
    HOT = 'hot',
    NEW = 'new',
    URGENT = 'urgent',
    NORMAL = 'normal',
}

export enum CandidateStatus {
    PENDING = 'PENDING',       // Mới nộp
    REVIEWING = 'REVIEWING',   // Đang xem xét
    INTERVIEW = 'INTERVIEW',   // Mời phỏng vấn
    OFFER = 'OFFER',           // Đề nghị nhận việc
    HIRED = 'HIRED',           // Đã tuyển
    REJECTED = 'REJECTED',     // Từ chối
}

export interface Job {
    id: string;
    slug: string;
    title: string;
    /** @deprecated Use isHot, isNew, isUrgent instead */
    status?: JobStatus;
    salary: string;
    quantity: number;
    workType: string;
    deadline: string;
    location: string;
    summary: string;
    description: string[];
    requirements: string[];
    benefits: string[];
    isActive: boolean;

    // New Flags
    isHot: boolean;
    isNew: boolean;
    isUrgent: boolean;
    viewCount: number;

    createdAt: string;
}

export interface Candidate {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    cvUrl: string;
    status: CandidateStatus;
    trackingCode: string;
    job?: Job;
    submittedAt: string; // Alias of createdAt
    jobId?: string; // For Admin create/update payload
}
