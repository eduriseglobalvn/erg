// src/constants/menu.ts

// 1. CẤU HÌNH DOMAIN (Giữ nguyên)
const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'erg.edu.local';
const isDev = process.env.NODE_ENV === 'development';
const PROTOCOL = isDev ? 'http' : 'https';
const PORT = isDev ? ':3000' : '';

export const getSubdomainLink = (subdomain: string, path: string = "") => {
    if (!subdomain) return `${PROTOCOL}://${ROOT_DOMAIN}${PORT}${path}`;
    return `${PROTOCOL}://${subdomain}.${ROOT_DOMAIN}${PORT}${path}`;
};

// 2. DATA CHƯƠNG TRÌNH ĐÀO TẠO (Giữ nguyên)
export const TRAINING_PROGRAMS = [
    { label: "Tin học Quốc tế", subdomain: "tinhocquocte" },
    { label: "Tin học Quốc gia", subdomain: "tinhocquocgia" },
    { label: "Tin học Thiếu nhi", subdomain: "tinhocthieunhi" },
    { label: "Giáo dục kỹ năng công dân số", subdomain: "congdanso" },
    { label: "Điện toán đám mây", subdomain: "dientoandammay" },
    { label: "Trí tuệ nhân tạo (AI)", subdomain: "ai" },
];

// --- THÊM MỚI: CÁC SUBDOMAIN KHÁC (Không thuộc menu đào tạo) ---
// Đây là nơi bạn định nghĩa các trang chức năng như Tuyển dụng, Admin, v.v.
export const FUNCTIONAL_SUBDOMAINS = [
    { label: "Tuyển dụng", subdomain: "tuyendung" },
];

// 3. EXPORT DANH SÁCH SUBDOMAIN (CẬP NHẬT)
// Gộp cả Đào tạo và Chức năng vào để Proxy cho phép truy cập
export const VALID_SUBDOMAINS = [
    ...TRAINING_PROGRAMS.map(p => p.subdomain),
    ...FUNCTIONAL_SUBDOMAINS.map(p => p.subdomain)
];

// --- THÊM MỚI: HELPER LINKS ---
// Export sẵn link để dùng trong code cho tiện
export const RECRUITMENT_LINK = getSubdomainLink("tuyendung");


// 4. MENU ITEMS (Giữ nguyên hoặc cập nhật nếu cần)
export const MAIN_MENU_ITEMS = [
    // ... (Code cũ của bạn)
    // Lưu ý: Không cần map FUNCTIONAL_SUBDOMAINS vào menu con của "Lĩnh vực đào tạo"
    // nên code cũ của bạn vẫn đúng logic.
    {
        label: "GIỚI THIỆU",
        path: "/cau-chuyen-cua-erg",
        children: [
            { label: "Câu chuyện của ERG", path: "/cau-chuyen-cua-erg" },
            { label: "Giá trị cốt lõi", path: "/gia-tri-cot-loi" },
            { label: "Tầm nhìn & Sứ mệnh", path: "/tam-nhin-su-menh" },
            { label: "Đội ngũ lãnh đạo", path: "/doi-ngu-lanh-dao" },
            { label: "Đối tác chiến lược", path: "/doi-tac" },
        ]
    },
    {
        label: "LĨNH VỰC ĐÀO TẠO",
        path: "/linh-vuc-dao-tao",
        children: TRAINING_PROGRAMS.map(program => ({
            label: program.label,
            path: getSubdomainLink(program.subdomain)
        }))
    },
    { label: "TIN TỨC", path: "/tin-tuc" },
    { label: "CƠ HỘI NGHỀ NGHIỆP", path: "/co-hoi-nghe-nghiep" },
    { label: "LIÊN HỆ", path: "/lien-he" },
];
export const THQT_MENU_ITEMS = [
    {
        label: "GIỚI THIỆU",
        path: "/gioi-thieu",
    },
    {
        label: "LỘ TRÌNH",
        path: "/lo-trinh",
    },
    {
        label: "KHÓA HỌC",
        path: "/khoa-hoc",
        children: [
            { label: "MOS", path: "/khoa-hoc/mos" },
            { label: "IC3 GS6", path: "/khoa-hoc/ic3-gs6" },
            { label: "IC3 Spark GS6 ", path: "/khoa-hoc/ic3-spark-gs6" },
        ]
    },
    {
        label: "ĐỘI NGŨ GIÁO VIÊN",
        path: "/doi-ngu-giao-vien",
    },
    { label: "TIN TỨC", path: "/tin-tuc" },
    { label: "LIÊN HỆ", path: "/lien-he" },

]
export const THQG_MENU_ITEMS = [
    {
        label: "GIỚI THIỆU",
        path: "/gioi-thieu",
    },
    {
        label: "LỘ TRÌNH",
        path: "/lo-trinh",
    },
    {
        label: "KHÓA HỌC",
        path: "/khoa-hoc",
        children: [
            { label: "Công nghệ thông tin cơ bản", path: "/khoa-hoc/cntt-co-ban" },
            { label: "Công nghệ thông tin nâng cao", path: "/khoa-hoc/cntt-nang-cao" },
        ]
    },
    {
        label: "ĐỘI NGŨ GIÁO VIÊN",
        path: "/doi-ngu-giao-vien",
    },
    { label: "TIN TỨC", path: "/tin-tuc" },
    { label: "LIÊN HỆ", path: "/lien-he" },

]

export const CDS_MENU_ITEMS = [
    {
        label: "GIỚI THIỆU",
        path: "/gioi-thieu",
    },
    {
        label: "LỘ TRÌNH",
        path: "/lo-trinh",
    },
    // {
    //     label: "KHÓA HỌC",
    //     path: "/khoa-hoc",
    //     children: [
    //         { label: "Công nghệ thông tin cơ bản", path: "/khoa-hoc/cntt-co-ban" },
    //         { label: "Công nghệ thông tin nâng cao", path: "/khoa-hoc/cntt-nang-cao" },
    //     ]
    // },
    // {
    //     label: "ĐỘI NGŨ GIÁO VIÊN",
    //     path: "/doi-ngu-giao-vien",
    // },
    { label: "TÀI LIỆU", path: "/tai-lieu" },
    { label: "TIN TỨC", path: "/tin-tuc" },
    { label: "LIÊN HỆ", path: "/lien-he" },

]

export const TUYEN_DUNG_MENU_ITEMS = [
    {
        label: "GIỚI THIỆU",
        path: "/gioi-thieu",
    },
    {
        label: "TUYỂN DỤNG",
        path: "/tuyen-dung",
    },
    {
        label: "VĂN HÓA",
        path: "/van-hoa",
    },
    {
        label: "CHÍNH SÁCH NHÂN SỰ",
        path: "/chinh-sach",
    },
    { label: "LIÊN HỆ", path: "/lien-he" },

]