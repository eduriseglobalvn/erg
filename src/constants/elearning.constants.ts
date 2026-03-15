export interface ElearningUnit {
    id: string;
    title: string;
    description: string;
    studyLink: string;
    testLink: string;
}

export interface ElearningLevel {
    id: string;
    title: string;
    description: string;
    units: ElearningUnit[];
}

export interface ElearningCategory {
    id: 'primary' | 'secondary';
    title: string;
    subtitle: string;
    levels: ElearningLevel[];
}

/**
 * 1. QUẢN LÝ LINK GOOGLE FORM TẬP TRUNG
 * Bạn có thể sửa các link mặc định tại đây
 */
export const GOOGLE_FORM_LINKS = {
    DEFAULT_STUDY: "https://docs.google.com/forms/d/e/1FAIpQLSdwA6y-...",
    DEFAULT_TEST: "https://docs.google.com/forms/d/e/1FAIpQLSdX_T-..."
};

/**
 * 2. DỮ LIỆU BÀI HỌC CHO TIỂU HỌC (SPARK)
 */
const SPARK_LEVEL_1_UNITS: ElearningUnit[] = [
    {
        id: 'spark1-u1',
        title: "Khám phá máy tính",
        description: "Làm quen với các bộ phận và chức năng cơ bản của máy tính.",
        studyLink: GOOGLE_FORM_LINKS.DEFAULT_STUDY,
        testLink: GOOGLE_FORM_LINKS.DEFAULT_TEST
    },
    {
        id: 'spark1-u2',
        title: "Phần cứng & Phần mềm",
        description: "Phân biệt thiết bị ngoại vi và các chương trình máy tính.",
        studyLink: GOOGLE_FORM_LINKS.DEFAULT_STUDY,
        testLink: GOOGLE_FORM_LINKS.DEFAULT_TEST
    },
    {
        id: 'spark1-u3',
        title: "Sử dụng bàn phím",
        description: "Kỹ năng gõ phím 10 ngón và các phím chức năng.",
        studyLink: GOOGLE_FORM_LINKS.DEFAULT_STUDY,
        testLink: GOOGLE_FORM_LINKS.DEFAULT_TEST
    },
    {
        id: 'spark1-u4',
        title: "Hệ điều hành cơ bản",
        description: "Cách quản lý cửa sổ và thư mục đơn giản.",
        studyLink: GOOGLE_FORM_LINKS.DEFAULT_STUDY,
        testLink: GOOGLE_FORM_LINKS.DEFAULT_TEST
    },
    {
        id: 'spark1-u5',
        title: "An toàn thiết bị",
        description: "Bảo quản máy tính và sử dụng thiết bị đúng cách.",
        studyLink: GOOGLE_FORM_LINKS.DEFAULT_STUDY,
        testLink: GOOGLE_FORM_LINKS.DEFAULT_TEST
    }
];

const SPARK_LEVEL_2_UNITS: ElearningUnit[] = [
    {
        id: 'spark2-u1',
        title: "Phần mềm ứng dụng",
        description: "Tìm hiểu các loại phần mềm phục vụ học tập.",
        studyLink: GOOGLE_FORM_LINKS.DEFAULT_STUDY,
        testLink: GOOGLE_FORM_LINKS.DEFAULT_TEST
    },
    {
        id: 'spark2-u2',
        title: "Soạn thảo văn bản",
        description: "Kỹ năng trình bày văn bản đơn giản.",
        studyLink: GOOGLE_FORM_LINKS.DEFAULT_STUDY,
        testLink: GOOGLE_FORM_LINKS.DEFAULT_TEST
    },
    {
        id: 'spark2-u3',
        title: "Bảng tính cơ bản",
        description: "Làm quen với các ô dữ liệu và tính toán.",
        studyLink: GOOGLE_FORM_LINKS.DEFAULT_STUDY,
        testLink: GOOGLE_FORM_LINKS.DEFAULT_TEST
    },
    {
        id: 'spark2-u4',
        title: "Trình chiếu sáng tạo",
        description: "Thiết kế slide bài thuyết trình sinh động.",
        studyLink: GOOGLE_FORM_LINKS.DEFAULT_STUDY,
        testLink: GOOGLE_FORM_LINKS.DEFAULT_TEST
    },
    {
        id: 'spark2-u5',
        title: "Quản lý tệp tin",
        description: "Cách sắp xếp dữ liệu khoa học trên máy tính.",
        studyLink: GOOGLE_FORM_LINKS.DEFAULT_STUDY,
        testLink: GOOGLE_FORM_LINKS.DEFAULT_TEST
    }
];

const SPARK_LEVEL_3_UNITS: ElearningUnit[] = [
    {
        id: 'spark3-u1',
        title: "Mạng máy tính",
        description: "Cách các máy tính kết nối với nhau.",
        studyLink: GOOGLE_FORM_LINKS.DEFAULT_STUDY,
        testLink: GOOGLE_FORM_LINKS.DEFAULT_TEST
    },
    {
        id: 'spark3-u2',
        title: "Internet & Web",
        description: "Kỹ năng duyệt web và tìm kiếm thông tin.",
        studyLink: GOOGLE_FORM_LINKS.DEFAULT_STUDY,
        testLink: GOOGLE_FORM_LINKS.DEFAULT_TEST
    },
    {
        id: 'spark3-u3',
        title: "Liên lạc trực tuyến",
        description: "Sử dụng email và các công cụ nhắn tin.",
        studyLink: GOOGLE_FORM_LINKS.DEFAULT_STUDY,
        testLink: GOOGLE_FORM_LINKS.DEFAULT_TEST
    },
    {
        id: 'spark3-u4',
        title: "An toàn thông tin",
        description: "Bảo vệ mật khẩu và thông tin cá nhân.",
        studyLink: GOOGLE_FORM_LINKS.DEFAULT_STUDY,
        testLink: GOOGLE_FORM_LINKS.DEFAULT_TEST
    },
    {
        id: 'spark3-u5',
        title: "Đạo đức số",
        description: "Quy tắc ứng xử văn minh trên không gian mạng.",
        studyLink: GOOGLE_FORM_LINKS.DEFAULT_STUDY,
        testLink: GOOGLE_FORM_LINKS.DEFAULT_TEST
    }
];

/**
 * 3. DỮ LIỆU BÀI HỌC CHO THCS (GS6)
 */
const GS6_LEVEL_1_UNITS: ElearningUnit[] = [
    {
        id: 'gs6-l1-u1',
        title: "Phần 1",
        description: "Ôn luyện IC3 GS6 Level 1 — Phần 1.",
        studyLink: "https://docs.google.com/forms/d/e/1FAIpQLSd-tNzg1tSu6BIKt6_pKm6SyLomVP4tN-NEHipn0z_Q9_zDEw/viewform?usp=header",
        testLink: ""
    },
    {
        id: 'gs6-l1-u2',
        title: "Phần 2",
        description: "Ôn luyện IC3 GS6 Level 1 — Phần 2.",
        studyLink: "https://docs.google.com/forms/d/e/1FAIpQLSdftMlhuqn5piqRnFbdAGLZ6br1pY4LDYwYVx96SirGdzv40w/viewform?usp=header",
        testLink: ""
    },
    {
        id: 'gs6-l1-u3',
        title: "Phần 3",
        description: "Ôn luyện IC3 GS6 Level 1 — Phần 3.",
        studyLink: "https://docs.google.com/forms/d/e/1FAIpQLSclY06gNvYXfKZbrW2kwgMrniJni87aApeQaFVkKJ02kf0sWg/viewform?usp=header",
        testLink: ""
    },
    {
        id: 'gs6-l1-u4',
        title: "Phần 4",
        description: "Ôn luyện IC3 GS6 Level 1 — Phần 4.",
        studyLink: "https://docs.google.com/forms/d/e/1FAIpQLSfvm4bHLdh-XZZp4dAM8MBh1OT6kX4qTQqupZ928kJHbHrRog/viewform?usp=header",
        testLink: ""
    },
    {
        id: 'gs6-l1-u5',
        title: "Phần 5",
        description: "Ôn luyện IC3 GS6 Level 1 — Phần 5.",
        studyLink: "https://docs.google.com/forms/d/e/1FAIpQLScEPTkNAd0lnE5OakbJVpnwlun2nfAxIU9tG3cQOk4N2lXgmw/viewform?usp=header",
        testLink: ""
    },
    {
        id: 'gs6-l1-u6',
        title: "Phần 6",
        description: "Ôn luyện IC3 GS6 Level 1 — Phần 6.",
        studyLink: "https://docs.google.com/forms/d/e/1FAIpQLScEHhc8sLI_nYGHvqqjpnwoa2tXYLeHNQ7I5lBDmk3_W95XhQ/viewform?usp=header",
        testLink: ""
    },
    {
        id: 'gs6-l1-u7',
        title: "Phần 7",
        description: "Ôn luyện IC3 GS6 Level 1 — Phần 7.",
        studyLink: "https://docs.google.com/forms/d/e/1FAIpQLSf1lEhL7gP40fUy6mxCLpY4izAE3-LQkq_aarP1NRcHZJDFaw/viewform?usp=header",
        testLink: ""
    }
];

const GS6_LEVEL_2_UNITS: ElearningUnit[] = [
    {
        id: 'gs6-l2-u1',
        title: "Kết nối mạng",
        description: "Giao thức mạng và hạ tầng kết nối.",
        studyLink: GOOGLE_FORM_LINKS.DEFAULT_STUDY,
        testLink: GOOGLE_FORM_LINKS.DEFAULT_TEST
    },
    {
        id: 'gs6-l2-u2',
        title: "Trình duyệt Web",
        description: "Tận dụng tối đa các công nghệ duyệt web.",
        studyLink: GOOGLE_FORM_LINKS.DEFAULT_STUDY,
        testLink: GOOGLE_FORM_LINKS.DEFAULT_TEST
    },
    {
        id: 'gs6-l2-u3',
        title: "Tìm kiếm thông tin",
        description: "Kỹ khai thác thông tin trên Internet.",
        studyLink: GOOGLE_FORM_LINKS.DEFAULT_STUDY,
        testLink: GOOGLE_FORM_LINKS.DEFAULT_TEST
    },
    {
        id: 'gs6-l2-u4',
        title: "Giao tiếp số",
        description: "Các hình thức trao đổi thông tin hiện đại.",
        studyLink: GOOGLE_FORM_LINKS.DEFAULT_STUDY,
        testLink: GOOGLE_FORM_LINKS.DEFAULT_TEST
    },
    {
        id: 'gs6-l2-u5',
        title: "Cộng tác trực tuyến",
        description: "Làm việc nhóm trên các nền tảng Cloud.",
        studyLink: GOOGLE_FORM_LINKS.DEFAULT_STUDY,
        testLink: GOOGLE_FORM_LINKS.DEFAULT_TEST
    }
];

const GS6_LEVEL_3_UNITS: ElearningUnit[] = [
    {
        id: 'gs6-l3-u1',
        title: "Soạn thảo chuyên nghiệp",
        description: "Xử lý văn bản cấp độ nâng cao.",
        studyLink: GOOGLE_FORM_LINKS.DEFAULT_STUDY,
        testLink: GOOGLE_FORM_LINKS.DEFAULT_TEST
    },
    {
        id: 'gs6-l3-u2',
        title: "Bảng tính nâng cao",
        description: "Phân tích dữ liệu và hàm phức tạp.",
        studyLink: GOOGLE_FORM_LINKS.DEFAULT_STUDY,
        testLink: GOOGLE_FORM_LINKS.DEFAULT_TEST
    },
    {
        id: 'gs6-l3-u3',
        title: "Quản lý dữ liệu",
        description: "Tổ chức và bảo vệ an toàn dữ liệu số.",
        studyLink: GOOGLE_FORM_LINKS.DEFAULT_STUDY,
        testLink: GOOGLE_FORM_LINKS.DEFAULT_TEST
    },
    {
        id: 'gs6-l3-u4',
        title: "Giải quyết vấn đề",
        description: "Kỹ năng xử lý sự cố công nghệ.",
        studyLink: GOOGLE_FORM_LINKS.DEFAULT_STUDY,
        testLink: GOOGLE_FORM_LINKS.DEFAULT_TEST
    },
    {
        id: 'gs6-l3-u5',
        title: "Tư duy lập trình",
        description: "Nền tảng logic và thuật toán cơ bản.",
        studyLink: GOOGLE_FORM_LINKS.DEFAULT_STUDY,
        testLink: GOOGLE_FORM_LINKS.DEFAULT_TEST
    }
];

/**
 * 4. CẤU TRÚC KẾT HỢP CUỐI CÙNG (DÙNG CHO TOÀN APP)
 */
export const ELEARNING_DATA: ElearningCategory[] = [
    {
        id: 'primary',
        title: "Tiểu học (Spark)",
        subtitle: "Bám sát chương trình IC3 Spark",
        levels: [
            {
                id: 'spark-level-1',
                title: "IC3 Spark Level 1",
                description: "Làm quen với máy tính và công nghệ",
                units: SPARK_LEVEL_1_UNITS
            },
            {
                id: 'spark-level-2',
                title: "IC3 Spark Level 2",
                description: "Ứng dụng máy tính trong học tập",
                units: SPARK_LEVEL_2_UNITS
            },
            {
                id: 'spark-level-3',
                title: "IC3 Spark Level 3",
                description: "An toàn mạng cho trẻ em",
                units: SPARK_LEVEL_3_UNITS
            }
        ]
    },
    {
        id: 'secondary',
        title: "THCS (GS6)",
        subtitle: "Bám sát chương trình IC3 GS6",
        levels: [
            {
                id: 'gs6-level-1',
                title: "IC3 GS6 Level 1",
                description: "Nền tảng về thiết bị và hệ điều hành",
                units: GS6_LEVEL_1_UNITS
            },
            {
                id: 'gs6-level-2',
                title: "IC3 GS6 Level 2",
                description: "Kỹ năng mạng và giao tiếp trực tuyến",
                units: GS6_LEVEL_2_UNITS
            },
            {
                id: 'gs6-level-3',
                title: "IC3 GS6 Level 3",
                description: "Xử lý văn bản và bảng tính nâng cao",
                units: GS6_LEVEL_3_UNITS
            }
        ]
    }
];
