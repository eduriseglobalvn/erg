// src/constants/menu.ts

// 1. CẤU HÌNH DOMAIN (Giữ nguyên logic cũ)
const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'erg.edu.local';
const isDev = process.env.NODE_ENV === 'development';
const PROTOCOL = isDev ? 'http' : 'https';
const PORT = isDev ? ':3000' : '';

export const getSubdomainLink = (subdomain: string, path: string = "") => {
    if (!subdomain) return `${PROTOCOL}://${ROOT_DOMAIN}${PORT}${path}`;
    return `${PROTOCOL}://${subdomain}.${ROOT_DOMAIN}${PORT}${path}`;
};

// 2. ĐỊNH NGHĨA DỮ LIỆU CÁC CHƯƠNG TRÌNH ĐÀO TẠO (Source of Truth)
// Đây là nơi duy nhất bạn cần cập nhật khi có môn học mới
export const TRAINING_PROGRAMS = [
    { label: "Tin học Quốc tế", subdomain: "tinhocquocte" },
    { label: "Tin học Quốc gia", subdomain: "tinhocquocgia" },
    { label: "Tin học Thiếu nhi", subdomain: "tinhocthieunhi" },
    { label: "Giáo dục kỹ năng công dân số", subdomain: "congdanso" },
    { label: "Điện toán đám mây", subdomain: "dientoandammay" },
    { label: "Trí tuệ nhân tạo (AI)", subdomain: "ai" },
    // Sau này thêm AWS thì chỉ cần thêm dòng này:
    // { label: "Chứng chỉ AWS", tinhocquocte: "aws" },
];

// 3. EXPORT DANH SÁCH SUBDOMAIN CHO PROXY DÙNG
// Kết quả sẽ là mảng: ['mos', 'tinhocquocte', 'tinhoc', 'english', 'python', 'ielts']
export const VALID_SUBDOMAINS = TRAINING_PROGRAMS.map(p => p.subdomain);

// 4. TẠO MENU ITEMS CHO FRONTEND
export const MAIN_MENU_ITEMS = [
    {
        label: "GIỚI THIỆU",
        path: "/gioi-thieu",
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
        // Tự động map từ mảng TRAINING_PROGRAMS ở trên
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
            { label: "MOS", path: "/khoa-hoc//mos" },
            { label: "IC3 GS6", path: "/khoa-hoc/ic3-gs6" },
            { label: "IC3 GS6 Spark", path: "/khoa-hoc/ic3-gs6-spark" },
        ]
    },
    {
        label: "ĐỘI NGŨ GIÁO VIÊN",
        path: "/doi-ngu-giao-vien",
    },
    { label: "TIN TỨC", path: "/tin-tuc" },
    { label: "LIÊN HỆ", path: "/lien-he" },

]