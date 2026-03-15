import { Job, Candidate, CandidateStatus } from "@/types/recruitment";

export const MOCK_JOBS: Job[] = [
    {
        id: "job-1",
        slug: "chuyen-vien-kinh-doanh-b2b",
        title: "Chuyên Viên Kinh Doanh B2B (Mảng Giáo Dục)",
        salary: "15 - 25 Triệu",
        quantity: 5,
        workType: "Toàn thời gian",
        deadline: "30/03/2026",
        location: "Hà Nội",
        summary: "Tìm kiếm và phát triển khách hàng doanh nghiệp, tư vấn giải pháp đào tạo.",
        description: [
            "Tìm kiếm và tiếp cận khách hàng tiềm năng là các doanh nghiệp.",
            "Tư vấn các khóa học và giải pháp đào tạo của ERG.",
            "Đàm phán, ký kết hợp đồng và chăm sóc khách hàng sau bán."
        ],
        requirements: [
            "Tốt nghiệp Cao đẳng/Đại học chuyên ngành QTKD, Marketing...",
            "Có ít nhất 1 năm kinh nghiệm sales B2B.",
            "Kỹ năng giao tiếp và thuyết trình tốt."
        ],
        benefits: [
            "Lương cứng + Hoa hồng hấp dẫn (Thu nhập up to 30M).",
            "Được đào tạo bài bản về sản phẩm và kỹ năng sales.",
            "Môi trường làm việc trẻ trung, năng động."
        ],
        isActive: true,
        isHot: true,
        isUrgent: false,
        isNew: true,
        viewCount: 150,
        createdAt: new Date().toISOString()
    },
    {
        id: "job-2",
        slug: "fullstack-developer",
        title: "Senior Fullstack Developer (Next.js/Node.js)",
        salary: "$1500 - $2500",
        quantity: 2,
        workType: "Hybrid",
        deadline: "15/02/2026",
        location: "Hồ Chí Minh",
        summary: "Phát triển hệ thống E-learning quy mô lớn.",
        description: [
            "Tham gia phát triển các tính năng mới cho nền tảng ERG.",
            "Tối ưu hóa hiệu năng hệ thống.",
            "Review code và hỗ trợ các thành viên junior."
        ],
        requirements: [
            "Ít nhất 3 năm kinh nghiệm với React/Next.js và Node.js.",
            "Có kiến thức về Database (PostgreSQL/MongoDB) và Cloud (AWS).",
            "Tư duy logic tốt, chủ động trong công việc."
        ],
        benefits: [
            "Lương tháng 13, thưởng dự án.",
            "Review lương 2 lần/năm.",
            "Bảo hiểm sức khỏe cao cấp."
        ],
        isActive: true,
        isHot: false,
        isUrgent: true,
        isNew: false,
        viewCount: 320,
        createdAt: new Date().toISOString()
    }
];

export const MOCK_CANDIDATES: Candidate[] = [
    {
        id: "cand-1",
        fullName: "Nguyễn Văn A",
        email: "nguyenvana@gmail.com",
        phone: "0901234567",
        cvUrl: "https://example.com/cv.pdf",
        status: CandidateStatus.PENDING,
        trackingCode: "REF-123456",
        job: MOCK_JOBS[0],
        submittedAt: new Date().toISOString()
    }
];
