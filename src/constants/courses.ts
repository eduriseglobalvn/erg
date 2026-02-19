export interface CourseData {
    id: string;
    code?: string;
    displayTitle: string;
    subtitle?: string;
    title: string;
    description: string;
    points: string[];
    href: string;
    headerGradient?: string;
    btnColor?: string;
    modules?: string;
    price?: number;
    rating?: {
        average: number;
        count: number;
    };
    instructor?: string;
    duration?: string;
    faqs?: Array<{
        question: string;
        answer: string;
    }>;
}

export const COURSES: Record<string, CourseData[]> = {
    tinhocquocte: [
        {
            id: "ic3-gs6-spark",
            code: "Tiểu học",
            displayTitle: "SPARK",
            subtitle: "Primary Skills",
            title: "IC3 Spark GS6",
            description: "Học máy tính từ bước đầu tiên, nâng cao nhận thức và kỹ năng số.",
            points: [
                "Level 1: Các khái niệm cơ bản",
                "Level 2: Kỹ năng thực hành"
            ],
            href: "/ic3-gs6-spark",
            headerGradient: "from-blue-400 to-cyan-300",
            btnColor: "border-blue-500 text-blue-600 hover:bg-blue-600",
            rating: { average: 4.8, count: 125 }
        },
        {
            id: "ic3-gs6",
            code: "THCS",
            displayTitle: "GS6",
            subtitle: "Digital Literacy",
            title: "IC3 GS6",
            description: "Chuẩn đánh giá năng lực CNTT theo tiêu chuẩn toàn cầu mới nhất.",
            points: [
                "3 Cấp độ năng lực",
                "7 Chuyên đề trọng tâm"
            ],
            href: "/ic3-gs6",
            headerGradient: "from-teal-500 to-emerald-400",
            btnColor: "border-teal-500 text-teal-600 hover:bg-teal-500",
            rating: { average: 4.9, count: 210 },
            faqs: [
                {
                    question: "Chứng chỉ IC3 GS6 có giá trị bao lâu?",
                    answer: "Chứng chỉ IC3 GS6 có giá trị vĩnh viễn trên toàn cầu."
                },
                {
                    question: "IC3 GS6 khác gì so với GS5?",
                    answer: "GS6 tập trung vào kỹ năng số tổng hợp theo chuẩn công dân số mới nhất, thay vì chia theo từng phần mềm riêng lẻ."
                }
            ]
        },
        {
            id: "mos",
            code: "THPT & Đại học",
            displayTitle: "MOS",
            subtitle: "Expert Skills",
            title: "Microsoft Office (MOS)",
            description: "Chứng chỉ tin học văn phòng quốc tế do Microsoft cấp.",
            points: [
                "Word, Excel, PowerPoint...",
                "Cấp độ: Specialist, Expert"
            ],
            href: "/mos",
            headerGradient: "from-[#F25022] to-orange-500",
            btnColor: "border-orange-500 text-orange-600 hover:bg-orange-500",
            rating: { average: 4.9, count: 350 }
        }
    ],
    tinhocquocgia: [
        {
            id: "thcb",
            code: "MÃ LỚP: THCB",
            displayTitle: "CƠ BẢN",
            title: "Kỹ năng sử dụng CNTT Cơ bản",
            description: "Dành cho người mới bắt đầu, trang bị kiến thức nền tảng về máy tính và tin học văn phòng.",
            headerGradient: "from-blue-600 to-blue-400",
            points: [
                "Windows: Quản lý tập tin, thư mục (Explorer).",
                "MS Word (IU03): Soạn thảo, định dạng văn bản, bảng biểu.",
                "MS Excel (IU04): Hàm chuỗi, ngày tháng, tính toán cơ bản.",
                "MS PowerPoint (IU05): Thiết kế slide, hiệu ứng trình chiếu."
            ],
            href: "/khoa-hoc",
            btnColor: "border-blue-600 text-blue-600 hover:bg-blue-600",
            rating: { average: 4.7, count: 180 }
        },
        {
            id: "thnc",
            code: "MÃ LỚP: THNC",
            displayTitle: "NÂNG CAO",
            title: "Kỹ năng sử dụng CNTT Nâng cao",
            description: "Chuyên sâu về văn phòng, xử lý dữ liệu phức tạp. Yêu cầu đã có kiến thức cơ bản.",
            headerGradient: "from-purple-600 to-indigo-500",
            points: [
                "Word Nâng cao (IU07): Trộn thư (Mail Merge), Mục lục tự động.",
                "Excel Nâng cao (IU08): PivotTable, VLOOKUP nâng cao, Công thức mảng.",
                "PPT Nâng cao (IU09): Slide Master, Trigger, Chèn đa phương tiện.",
                "Kỹ năng kiểm tra và bảo mật bảng tính nâng cao."
            ],
            href: "/khoa-hoc",
            btnColor: "border-purple-600 text-purple-600 hover:bg-purple-600",
            rating: { average: 4.8, count: 140 }
        },
        {
            id: "luyenthi",
            code: "CẤP TỐC",
            displayTitle: "LUYỆN THI",
            title: "Ôn Thi & Cấp Chứng Chỉ",
            description: "Dành cho đối tượng đã có kiến thức, cần hệ thống hóa để thi lấy bằng nhanh chóng.",
            headerGradient: "from-orange-500 to-red-400",
            points: [
                "Làm quen với phần mềm thi trắc nghiệm & thực hành.",
                "Giải bộ đề thi sát hạch chuẩn quốc gia các năm gần nhất.",
                "Mẹo làm bài đạt điểm tối đa và quản lý thời gian thi.",
                "Tỷ lệ đậu cao. Hỗ trợ đăng ký thi ngay tại trung tâm."
            ],
            href: "/khoa-hoc",
            btnColor: "border-orange-500 text-orange-600 hover:bg-orange-500",
            rating: { average: 5.0, count: 95 }
        }
    ],
    tinhocthieunhi: [
        {
            id: "scratch",
            code: "Tiểu học",
            displayTitle: "SCRATCH",
            subtitle: "Creative Coding",
            title: "Lộ trình Sáng Tạo (Scratch)",
            description: "Phù hợp với trẻ thích hình ảnh, âm thanh, vẽ tranh & kể chuyện. Bé tự tạo được trò chơi, thiệp điện tử, phim hoạt hình.",
            points: [
                "Học tư duy Kéo - Thả (No-code)",
                "Tự làm Game & Phim hoạt hình",
                "Phát triển trí tưởng tượng phong phú"
            ],
            href: "/khoa-hoc/lap-trinh-scratch",
            headerGradient: "from-orange-500 to-yellow-400",
            btnColor: "border-orange-500 text-orange-600 hover:bg-orange-600",
            rating: { average: 4.8, count: 85 }
        },
        {
            id: "python-kids",
            code: "THCS",
            displayTitle: "PYTHON",
            subtitle: "Logic & Data",
            title: "Lộ trình Tư Duy (Python)",
            description: "Phù hợp với trẻ thích toán học, giải đố. Tiếp cận ngôn ngữ lập trình thực tế số 1 thế giới chuẩn kỹ sư công nghệ.",
            points: [
                "Lập trình dòng lệnh thực tế",
                "Giải quyết vấn đề & Thuật toán",
                "Nền tảng cho AI & Khoa học dữ liệu"
            ],
            href: "/khoa-hoc/lap-trinh-python-thieu-nhi",
            headerGradient: "from-blue-600 to-indigo-500",
            btnColor: "border-blue-600 text-blue-600 hover:bg-blue-600",
            rating: { average: 4.9, count: 65 }
        }
    ],
    congdanso: [
        {
            id: "kdc-tieu-hoc",
            displayTitle: "01",
            subtitle: "Lớp 1 - 5",
            title: "Kỹ Năng Công Dân Số Tiểu Học",
            description: "Khởi động hành trình số với sự tò mò và an toàn.",
            points: [
                "Hoạt động hướng nghiệp",
                "Khởi nghiệp & Đổi mới sáng tạo",
                "Cân bằng thời gian sử dụng thiết bị"
            ],
            href: "/kdc-tieu-hoc",
            headerGradient: "from-green-500 to-emerald-400",
            btnColor: "border-green-500 text-green-600 hover:bg-green-500",
            rating: { average: 4.7, count: 110 }
        },
        {
            id: "kdc-thcs",
            displayTitle: "02",
            subtitle: "Lớp 6 - 9",
            title: "Kỹ Năng Công Dân Số THCS",
            description: "Phát triển tư duy phản biện và trách nhiệm xã hội.",
            points: [
                "Nhận diện tin giả (Fake News)",
                "Phòng chống bắt nạt mạng",
                "Bản quyền & Đạo đức số"
            ],
            href: "/kdc-thcs",
            headerGradient: "from-blue-600 to-cyan-400",
            btnColor: "border-blue-600 text-blue-600 hover:bg-blue-600",
            rating: { average: 4.8, count: 90 }
        },
        {
            id: "kdc-thpt",
            displayTitle: "03",
            subtitle: "Lớp 10 - 12",
            title: "Kỹ Năng Công Dân Số THPT",
            description: "Làm chủ công nghệ, định hướng nghề nghiệp tương lai.",
            points: [
                "Xây dựng thương hiệu cá nhân số",
                "Dấu chân số & Tuyển dụng",
                "Tham gia cộng đồng số toàn cầu"
            ],
            href: "/kdc-thpt",
            headerGradient: "from-orange-500 to-red-400",
            btnColor: "border-orange-500 text-orange-600 hover:bg-orange-500",
            rating: { average: 4.9, count: 75 }
        }
    ],
    dientoandammay: [
        {
            id: "cloud-admin",
            displayTitle: "AWS / Azure",
            subtitle: "Foundation",
            title: "Cloud Administrator",
            description: "Nhập môn điện toán đám mây. Vận hành máy chủ ảo (EC2), mạng VPC và quản trị người dùng IAM trên AWS/Azure.",
            points: [
                "Dịch vụ Core: EC2, S3, RDS",
                "Bảo mật & Phân quyền IAM"
            ],
            href: "/khoa-hoc/cloud-admin",
            headerGradient: "from-orange-400 to-amber-500",
            btnColor: "border-orange-500 text-orange-600 hover:bg-orange-500",
            rating: { average: 4.8, count: 135 }
        },
        {
            id: "devops-engineer",
            displayTitle: "DevOps",
            subtitle: "Professional",
            title: "DevOps Engineer",
            description: "Làm chủ công nghệ Container và quy trình phát triển phần mềm hiện đại CI/CD tự động hóa.",
            points: [
                "Docker & Kubernetes (K8s)",
                "Jenkins, GitLab CI Pipeline"
            ],
            href: "/khoa-hoc/devops-engineer",
            headerGradient: "from-blue-600 to-cyan-500",
            btnColor: "border-blue-600 text-blue-600 hover:bg-blue-600",
            rating: { average: 4.9, count: 110 }
        },
        {
            id: "cloud-architect",
            displayTitle: "Architect",
            subtitle: "Expert",
            title: "Solutions Architect",
            description: "Tư duy thiết kế hệ thống phân tán, chịu tải cao (High Availability) và tối ưu chi phí hạ tầng doanh nghiệp.",
            points: [
                "Microservices Design Patterns",
                "Terraform (IaC) & Security"
            ],
            href: "/khoa-hoc/cloud-architect",
            headerGradient: "from-purple-600 to-fuchsia-500",
            btnColor: "border-purple-500 text-purple-600 hover:bg-purple-500",
            rating: { average: 5.0, count: 85 }
        }
    ],
    ai: [
        {
            id: "hoc-cung-ai",
            code: "Lớp 1 - 12",
            displayTitle: "AI",
            subtitle: "Future Intelligence",
            title: "Chương trình Học Cùng AI",
            description: "Trang bị kiến thức Trí tuệ nhân tạo bài bản cho học sinh phổ thông theo bộ sách 'Học cùng AI' (NXB Giáo dục Việt Nam).",
            points: [
                "Tiểu học: Làm quen Robot & Nhận diện",
                "THCS: Big Data & Máy học (Machine Learning)",
                "THPT: Thuật toán & Đạo đức AI chuyên sâu"
            ],
            href: "/khoa-hoc/hoc-cung-ai",
            headerGradient: "from-indigo-600 to-blue-500",
            btnColor: "border-indigo-600 text-indigo-600 hover:bg-indigo-600",
            rating: { average: 4.9, count: 160 }
        }
    ]
};
