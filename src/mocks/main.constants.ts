import {
    Star, Monitor, Handshake, Award, Users, BookOpen,
    Zap, ShieldCheck, Cloud, Brain, Target, TrendingUp, Sun, MessageCircle, Wallet
} from 'lucide-react';

// 1. Banner Slides
export const HERO_SLIDES = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
        title: "Tiên phong Đào tạo Công nghệ & Kỹ năng số",
        subtitle: "Hệ thống đào tạo chuẩn Quốc tế, trang bị hành trang vững chắc cho kỷ nguyên số hóa.",
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
        title: "Lộ trình học tập toàn diện",
        subtitle: "Từ Tin học văn phòng đến Khoa học dữ liệu, phù hợp mọi lứa tuổi và nhu cầu công việc.",
    }
];

// 2. Core Values (Tương tự phần Tầm nhìn chiến lược của FPT)
export const CORE_VALUES = [
    {
        title: "Chất lượng Quốc tế",
        content: "Chương trình chuẩn hóa, cấp chứng chỉ MOS, IC3 có giá trị toàn cầu.",
        icon: Award,
    },
    {
        title: "Thực tiễn & Ứng dụng",
        content: "Học đi đôi với hành, cam kết thành thạo kỹ năng ngay sau khóa học.",
        icon: Target, // Icon bắn cung/mục tiêu
    },
    {
        title: "Công nghệ hiện đại",
        content: "Hệ thống phòng máy, phần mềm cập nhật liên tục theo xu hướng 4.0.",
        icon: Zap, // Icon tia sét/năng lượng
    }
];

// 3. Training Fields (Lĩnh vực đào tạo)
// export const TRAINING_FIELDS = [
//     {
//         id: 1,
//         title: "Tin học Quốc tế",
//         description: "Luyện thi chứng chỉ MOS, IC3 Spark, IC3 GS6 chuẩn Hoa Kỳ.",
//         image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
//         link: "/tin-hoc-quoc-te"
//     },
//     {
//         id: 2,
//         title: "Tin học Quốc gia",
//         description: "Đào tạo CNTT cơ bản & nâng cao theo chuẩn Bộ GD&ĐT.",
//         image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
//         link: "/tin-hoc-quoc-gia"
//     },
//     {
//         id: 3,
//         title: "Tin học Thiếu nhi",
//         description: "Khơi dậy tư duy lập trình và logic cho trẻ từ 6-15 tuổi.",
//         image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
//         link: "/tin-hoc-thieu-nhi"
//     },
//     {
//         id: 4,
//         title: "Kỹ năng Công dân số",
//         description: "An toàn thông tin, văn hóa mạng và kỹ năng làm việc số.",
//         image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
//         link: "/ky-nang-so"
//     },
//     {
//         id: 5,
//         title: "Điện toán đám mây",
//         description: "Làm chủ Cloud Computing, lưu trữ và quản lý dữ liệu 4.0.",
//         image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
//         link: "/dien-toan-dam-may"
//     },
//     {
//         id: 6,
//         title: "Trí tuệ nhân tạo (AI)",
//         description: "Ứng dụng AI vào công việc và cuộc sống để bứt phá hiệu suất.",
//         image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
//         link: "/tri-tue-nhan-tao"
//     }
// ];

// 4. Why Choose Us
export const WHY_CHOOSE_US = [
    {
        id: 1,
        icon: Users,
        title: "Đội ngũ giáo viên chất lượng cao",
        desc: "Giáo viên nhiều năm kinh nghiệm, chuyên môn vững vàng, tận tâm với nghề và luôn cập nhật phương pháp giảng dạy hiện đại."
    },
    {
        id: 2,
        icon: BookOpen, // Thay icon phù hợp với chương trình học
        title: "Chương trình chuẩn Quốc tế",
        desc: "Giáo trình biên soạn dựa trên tiêu chuẩn quốc tế, bám sát thực tiễn, giúp học viên nắm vững kiến thức nền tảng và kỹ năng tư duy."
    },
    {
        id: 3,
        icon: Monitor,
        title: "Cơ sở vật chất hiện đại",
        desc: "Phòng học được trang bị đầy đủ thiết bị công nghệ tiên tiến, mang đến môi trường học tập tiện nghi, chuyên nghiệp và hiệu quả."
    },
    {
        id: 4,
        icon: ShieldCheck,
        title: "Kiểm soát chất lượng chặt chẽ",
        desc: "Chương trình giảng dạy và đào tạo được giám sát chặt chẽ theo lộ trình rõ ràng, đảm bảo chất lượng đồng đều."
    },
    // Mục số 5: Sẽ được tách riêng để xử lý hiển thị đặc biệt
    {
        id: 5,
        isFeatured: true, // Cờ đánh dấu để highlight
        icon: Award,
        title: "Cam kết tỉ lệ đầu ra",
        desc: "ERG cam kết tỷ lệ học viên đạt chuẩn đầu ra và vượt qua các kỳ thi quốc tế đạt:",
        stats: [
            { label: "Khối TH, THCS, THPT", value: "Trên 90%" },
            { label: "Khối Cao Đẳng - Đại Học", value: "100%" }
        ]
    },
    {
        id: 6,
        icon: Wallet, // Icon ví tiền cho chi phí
        title: "Chi phí hợp lý, nhiều ưu đãi",
        desc: "Học phí phù hợp, chính sách linh hoạt cùng nhiều chương trình học bổng dành cho học sinh."
    }
];

// 5. Latest News (Tin tức)
export const LATEST_NEWS = [
    {
        id: 1,
        title: "Lễ ký kết hợp tác chiến lược đào tạo nhân lực số 2025",
        date: "15/12/2024",
        summary: "ERG Global chính thức ký kết với các đối tác doanh nghiệp nhằm cung ứng nhân lực chất lượng cao.",
        image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        slug: "le-ky-ket-hop-tac"
    },
    {
        id: 2,
        title: "Khai giảng khóa học MOS Specialist - Ưu đãi 30%",
        date: "10/12/2024",
        summary: "Cơ hội sở hữu chứng chỉ tin học văn phòng quốc tế với mức học phí cực kỳ hấp dẫn trong tháng này.",
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        slug: "khai-giang-mos"
    },
    {
        id: 3,
        title: "Hội thảo: Ứng dụng AI trong công việc văn phòng",
        date: "05/12/2024",
        summary: "Chia sẻ từ các chuyên gia hàng đầu về cách tận dụng ChatGPT, Copilot để x10 hiệu suất.",
        image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        slug: "hoi-thao-ai"
    }
];

// 6. Testimonials
export const TESTIMONIALS = [
    {
        id: 1,
        name: "Nguyễn Văn A",
        role: "Sinh viên ĐH Kinh Tế",
        content: "Khóa học MOS tại ERG giúp mình tự tin hơn hẳn khi làm đồ án tốt nghiệp. Giảng viên rất nhiệt tình!",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
        id: 2,
        name: "Trần Thị B",
        role: "Nhân viên văn phòng",
        content: "Mình đã ứng dụng được ngay kiến thức Excel vào công việc kế toán hàng ngày. Cảm ơn ERG rất nhiều.",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
        id: 3,
        name: "Lê Hoàng C",
        role: "Freelancer",
        content: "Môi trường học tập chuyên nghiệp, máy móc xịn. Mình sẽ giới thiệu bạn bè đến học.",
        avatar: "https://randomuser.me/api/portraits/men/85.jpg"
    }
];


// 2. Lĩnh vực đào tạo (Dựa trên ảnh Menu bạn gửi)
export const TRAINING_FIELDS = [
    {
        id: 1,
        title: "Tin học Quốc tế",
        description: "Chương trình đào tạo - luyện thi các chứng chỉ uy tín toàn cầu như MOS, IC3 Spark, IC3 GS6. Trang bị hành trang vững chắc cho sự nghiệp.",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        link: "/tin-hoc-quoc-te"
    },
    {
        id: 2,
        title: "Tin học Quốc gia",
        description: "Các khóa học bám sát chương trình chuẩn của Bộ GD&ĐT, nâng cao kỹ năng tin học văn phòng,đáp ứng yêu cầu công việc và thi tuyển.",
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        link: "/tin-hoc-quoc-gia"
    },
    {
        id: 3,
        title: "Tin học Thiếu nhi",
        description: "Khơi dậy niềm đam mê công nghệ cho trẻ từ sớm với phương pháp trực quan,sinh động.Giúp phát triển tư duy logic và kỹ năng giải quyết vấn đề.",
        image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        link: "/tin-hoc-thieu-nhi"
    },
    {
        id: 4,
        title: "Giáo dục kỹ năng công dân số",
        description: "Trang bị kiến thức về an toàn trực tuyến, đạo đức mạng và kỹ năng sử dụng công nghệ văn minh trong kỷ nguyên số hóa.",
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        link: "/ky-nang-so"
    },
    {
        id: 5,
        title: "Điện toán đám mây",
        description: "Làm chủ công nghệ Cloud Computing, lưu trữ và quản lý dữ liệu hiện đại. Đón đầu xu hướng công nghệ của doanh nghiệp 4.0.",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        link: "/dien-toan-dam-may"
    },
    {
        id: 6,
        title: "Trí tuệ nhân tạo (AI)",
        description: "Khám phá thế giới AI, Machine Learning cơ bản và ứng dụng AI vào học tập, làm việc để gia tăng hiệu suất đột phá.",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        link: "/tri-tue-nhan-tao"
    }
];