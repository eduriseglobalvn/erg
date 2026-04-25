export interface ElearningUnit {
    id: string;
    title: string;
    description: string;
    studyLink: string;
    testLink?: string;
    orderLabel?: string;
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
        id: 'gs6-l1-bosung',
        title: "Chủ đề bổ sung",
        description: "Luyện tập bổ sung IC3 GS6 Level 1.",
        studyLink: "https://docs.google.com/forms/d/e/1FAIpQLScuK_wGJC8aXqZ0cJPNPCSslRkyPFHmpUApeLH0M_IKy-mI3w/viewform?usp=header",
        orderLabel: "+"
    },
    {
        id: 'gs6-l1-u1',
        title: "Phần 1",
        description: "Ôn luyện IC3 GS6 Level 1 — Phần 1.",
        studyLink: "https://docs.google.com/forms/d/e/1FAIpQLSd-tNzg1tSu6BIKt6_pKm6SyLomVP4tN-NEHipn0z_Q9_zDEw/viewform?usp=header",
        testLink: "https://docs.google.com/forms/d/e/1FAIpQLSdmuSB7JREQpES9miR9QznwIj-SbHFTn_VcPV2K-jZLh-Ql0g/viewform?usp=header"
    },
    {
        id: 'gs6-l1-u2',
        title: "Phần 2",
        description: "Ôn luyện IC3 GS6 Level 1 — Phần 2.",
        studyLink: "https://docs.google.com/forms/d/e/1FAIpQLSdftMlhuqn5piqRnFbdAGLZ6br1pY4LDYwYVx96SirGdzv40w/viewform?usp=header",
        testLink: "https://docs.google.com/forms/d/e/1FAIpQLSe8Nq_GL5MklINRaaV-29X7m79VIjEXvnAeO8iFYcGlI2APoA/viewform?usp=header"
    },
    {
        id: 'gs6-l1-u3',
        title: "Phần 3",
        description: "Ôn luyện IC3 GS6 Level 1 — Phần 3.",
        studyLink: "https://docs.google.com/forms/d/e/1FAIpQLSclY06gNvYXfKZbrW2kwgMrniJni87aApeQaFVkKJ02kf0sWg/viewform?usp=header",
        testLink: "https://docs.google.com/forms/d/e/1FAIpQLSdRMKAHBkqvj2VP7NebzyydA9bF96ZRiIjLVtA06N_4wR9KHw/viewform?usp=header"
    },
    {
        id: 'gs6-l1-u4',
        title: "Phần 4",
        description: "Ôn luyện IC3 GS6 Level 1 — Phần 4.",
        studyLink: "https://docs.google.com/forms/d/e/1FAIpQLSfvm4bHLdh-XZZp4dAM8MBh1OT6kX4qTQqupZ928kJHbHrRog/viewform?usp=header",
        testLink: "https://docs.google.com/forms/d/e/1FAIpQLSfje7PUGp8ba6DqXKHbalOooDrwBuxf2cjGssWHKyzJxPhYKA/viewform?usp=header"
    },
    {
        id: 'gs6-l1-u5',
        title: "Phần 5",
        description: "Ôn luyện IC3 GS6 Level 1 — Phần 5.",
        studyLink: "https://docs.google.com/forms/d/e/1FAIpQLScEPTkNAd0lnE5OakbJVpnwlun2nfAxIU9tG3cQOk4N2lXgmw/viewform?usp=header",
        testLink: "https://docs.google.com/forms/d/e/1FAIpQLSf1oHqqvPPdToUhrykcHUGNZ7G583dLUmSzRkJFs44ZsEvt8Q/viewform?usp=header"
    },
    {
        id: 'gs6-l1-u6',
        title: "Phần 6",
        description: "Ôn luyện IC3 GS6 Level 1 — Phần 6.",
        studyLink: "https://docs.google.com/forms/d/e/1FAIpQLScEHhc8sLI_nYGHvqqjpnwoa2tXYLeHNQ7I5lBDmk3_W95XhQ/viewform?usp=header",
        testLink: "https://docs.google.com/forms/d/e/1FAIpQLSemPBNnMlqPjk3AqvEiNZjA7YS-J7ljmTc5HENJiBqfRhfXTQ/viewform?usp=header"
    },
    {
        id: 'gs6-l1-u7',
        title: "Phần 7",
        description: "Ôn luyện IC3 GS6 Level 1 — Phần 7.",
        studyLink: "https://docs.google.com/forms/d/e/1FAIpQLSf1lEhL7gP40fUy6mxCLpY4izAE3-LQkq_aarP1NRcHZJDFaw/viewform?usp=header",
        testLink: "https://docs.google.com/forms/d/e/1FAIpQLSdZJDVeU6AmfykHK9d7BqzRZOf6tst5RAlKir64XkiEdxvA_A/viewform?usp=header"
    }
];

const GS6_LEVEL_2_UNITS: ElearningUnit[] = [
    {
        id: 'gs6-l2-u1',
        title: "Phần 1",
        description: "Ôn luyện IC3 GS6 Level 2 — Phần 1.",
        studyLink: "https://docs.google.com/forms/d/e/1FAIpQLSc6-437cCnuUwFx252Mkj2853Zo5aod1rPkGqSrbpstfpn9-Q/viewform?usp=header",
        testLink: "https://docs.google.com/forms/d/e/1FAIpQLSfBFyXm1JENC6WVUf5e-OyT09gcFTKh1nZ2o5jfC-pRu6VkPQ/viewform?usp=header"
    },
    {
        id: 'gs6-l2-u2',
        title: "Phần 2",
        description: "Ôn luyện IC3 GS6 Level 2 — Phần 2.",
        studyLink: "https://docs.google.com/forms/d/e/1FAIpQLSc9PqLJ46iysQTkP9CJlzkpfh0_FpN-39U9n8NaJNX5rFVt2g/viewform?usp=header",
        testLink: "https://docs.google.com/forms/d/e/1FAIpQLSffkQaR8GoyTuJ_4gg8EjL1kfshjOSHKGKNcn0WoNCDXdNeWA/viewform?usp=header"
    },
    {
        id: 'gs6-l2-u3',
        title: "Phần 3",
        description: "Ôn luyện IC3 GS6 Level 2 — Phần 3.",
        studyLink: "https://docs.google.com/forms/d/e/1FAIpQLSeEYqpMQcGHuDkuvzXH1R6NisjcbS73JIleTbo46WVrasWM6w/viewform?usp=header",
        testLink: "https://docs.google.com/forms/d/e/1FAIpQLSfADD4HF00G1VQvSzFa0fm41aOyDhOXSx6FPwmw4h-g5Mp6qQ/viewform?usp=header"
    },
    {
        id: 'gs6-l2-u4',
        title: "Phần 4",
        description: "Ôn luyện IC3 GS6 Level 2 — Phần 4.",
        studyLink: "https://docs.google.com/forms/d/e/1FAIpQLSes6C4NEuQAkG4XtJFgujqmSo1_Ef1QAn_whYt5UH1dNoyFqQ/viewform?usp=header",
        testLink: "https://docs.google.com/forms/d/e/1FAIpQLSfhuklyDGoMV3HQUhqi78wpw5PnuW6dSPdFFm3H-P346J2lMg/viewform?usp=header"
    },
    {
        id: 'gs6-l2-u5',
        title: "Phần 5",
        description: "Ôn luyện IC3 GS6 Level 2 — Phần 5.",
        studyLink: "https://docs.google.com/forms/d/e/1FAIpQLSc-4-ZVe6uGW2XUGJbz57Mgo4n0IlnS_ILb85hUkqn8kzW5pw/viewform?usp=header",
        testLink: "https://docs.google.com/forms/d/e/1FAIpQLSe-LIZOOo9Gz_-D6G8rJlVJGmHt-hIfqkU9ppRBrt1d8ZXSqA/viewform?usp=header"
    },
    {
        id: 'gs6-l2-u6',
        title: "Phần 6",
        description: "Ôn luyện IC3 GS6 Level 2 — Phần 6.",
        studyLink: "https://docs.google.com/forms/d/e/1FAIpQLSc77699vuVDqv1ExJccZTG7NYpb1cDxiHK5awlBL8wKwTMRmw/viewform?usp=header",
        testLink: "https://docs.google.com/forms/d/e/1FAIpQLScpFiGF0b9Lmxvc-zq94sZhpvGv4iVMuIKxwUxb4x6_M5Q5ig/viewform?usp=header"
    },
    {
        id: 'gs6-l2-u7',
        title: "Phần 7",
        description: "Ôn luyện IC3 GS6 Level 2 — Phần 7.",
        studyLink: "https://docs.google.com/forms/d/e/1FAIpQLSdpI6USQ9mJU09Q2zmTesKIAVnrZCsMkKYL2jOWThAwSh6v_g/viewform?usp=header",
        testLink: "https://docs.google.com/forms/d/e/1FAIpQLSdo7LODAI-VLTSyWvetumk5GjamT5ArXBg1WAlzaethG4g-kw/viewform?usp=header"
    }
];

const GS6_LEVEL_3_UNITS: ElearningUnit[] = [
    {
        id: 'gs6-l3-u1',
        title: "Phần 1",
        description: "Ôn luyện IC3 GS6 Level 3 — Phần 1. (UPDATED)",
        studyLink: "https://docs.google.com/forms/d/e/1FAIpQLSdgIi731nfyoyqbW4592LMcZO24zkAt-v9mDoW6k-AsXhnXWQ/viewform?usp=header",
        testLink: "https://docs.google.com/forms/d/e/1FAIpQLSfYACIHfj_SCwIq33OAoGj5GHw3luzzIMRg5_cNeGmlKSX3aA/viewform?usp=header"
    },
    {
        id: 'gs6-l3-u2',
        title: "Phần 2",
        description: "Ôn luyện IC3 GS6 Level 3 — Phần 2.",
        studyLink: "https://docs.google.com/forms/d/e/1FAIpQLSdxLidj28NusamjcAx50Xz9Iw6B73Ks942q2L0mPfI6g5A5zg/viewform?usp=header",
        testLink: "https://docs.google.com/forms/d/e/1FAIpQLSdQsb6HduCfNrck8qFh68gt8NFHBAhaK8iv7DVXbFKpO9kBbg/viewform?usp=header"
    },
    {
        id: 'gs6-l3-u3',
        title: "Phần 3",
        description: "Ôn luyện IC3 GS6 Level 3 — Phần 3.",
        studyLink: "https://docs.google.com/forms/d/e/1FAIpQLScmAd82MCOL_9pyUNjn4B2GzMPdcnVGTw86V57UmZnist0R7Q/viewform?usp=header",
        testLink: "https://docs.google.com/forms/d/e/1FAIpQLSeC8cB3S45htHARmDtnz-1S1TW5d2tT7kzETPWC-VbxXKXcLQ/viewform?usp=header"
    },
    {
        id: 'gs6-l3-u4',
        title: "Phần 4",
        description: "Ôn luyện IC3 GS6 Level 3 — Phần 4.",
        studyLink: "https://docs.google.com/forms/d/e/1FAIpQLScooBclWD-A4X3-cY2rVz2YpcXaHGcIijrgyftQ63i40GjOhw/viewform?usp=header",
        testLink: "https://docs.google.com/forms/d/e/1FAIpQLSeouApkIwQHa1xz-aaKlBgbhwtn4yAAjDM9R-jjBldGmUZHnA/viewform?usp=header"
    },
    {
        id: 'gs6-l3-u5',
        title: "Phần 5",
        description: "Ôn luyện IC3 GS6 Level 3 — Phần 5.",
        studyLink: "https://docs.google.com/forms/d/e/1FAIpQLSdJZVVzUom1pPEopNanyX7--oOy2g5fGMmGUbQBa6j6BteG2Q/viewform?usp=header",
        testLink: "https://docs.google.com/forms/d/e/1FAIpQLSe9H4Ei7Pn8A7G9BTA8K3omKQ6R3aSk74TZIb4F2tRBYtlW6g/viewform?usp=header"
    },
    {
        id: 'gs6-l3-u6',
        title: "Phần 6",
        description: "Ôn luyện IC3 GS6 Level 3 — Phần 6.",
        studyLink: "https://docs.google.com/forms/d/e/1FAIpQLSejUzivIfed1EAKGk-86rCWSqTQHY30nv9jdnb_N_kJgG06sw/viewform?usp=header",
        testLink: "https://docs.google.com/forms/d/e/1FAIpQLSf-WeW0_rXsWT0OUo3YspOFU0s0YF98ToBsqvfbvaGb_NLUMA/viewform?usp=header"
    },
    {
        id: 'gs6-l3-u7',
        title: "Phần 7",
        description: "Ôn luyện IC3 GS6 Level 3 — Phần 7.",
        studyLink: "https://docs.google.com/forms/d/e/1FAIpQLSeOQTvirqOAqA034wlwggFqE8hrPxuF1SfAXgLToqdHvKeQow/viewform?usp=header",
        testLink: "https://docs.google.com/forms/d/e/1FAIpQLSfbI3esKAWco1GxWhqwSlwEzBGzUcpga3keeUKHNbbTc8vgrg/viewform?usp=header"
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
