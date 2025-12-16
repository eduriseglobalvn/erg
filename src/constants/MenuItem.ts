// src/constants/menu.ts

// 1. CẤU HÌNH DOMAIN (Giữ nguyên logic cũ)
const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'erg.edu.local';
const isDev = process.env.NODE_ENV === 'development';
const PROTOCOL = isDev ? 'http' : 'https';
const PORT = isDev ? ':3000' : '';

const getSubdomainLink = (subdomain: string, path: string = "") => {
    if (!subdomain) return `${PROTOCOL}://${ROOT_DOMAIN}${PORT}${path}`;
    return `${PROTOCOL}://${subdomain}.${ROOT_DOMAIN}${PORT}${path}`;
};

// 2. ĐỊNH NGHĨA DỮ LIỆU CÁC CHƯƠNG TRÌNH ĐÀO TẠO (Source of Truth)
// Đây là nơi duy nhất bạn cần cập nhật khi có môn học mới
export const TRAINING_PROGRAMS = [
    { label: "Tin học Quốc tế", subdomain: "tinhocquocte" },
    { label: "Tin học Quốc gia", subdomain: "tinhocquocgia" },
    { label: "Tin học Thiếu nhi", subdomain: "tinhocthieunhi" },
    { label: "Điện toán đám mây", subdomain: "dientoandammay" },
    { label: "Trí tuệ nhân tạo (AI)", subdomain: "ai" },
    { label: "Giáo dục kỹ năng công dân số", subdomain: "congdanso" },
    // Sau này thêm AWS thì chỉ cần thêm dòng này:
    // { label: "Chứng chỉ AWS", subdomain: "aws" },
];

// 3. EXPORT DANH SÁCH SUBDOMAIN CHO PROXY DÙNG
// Kết quả sẽ là mảng: ['mos', 'tinhocquocte', 'tinhoc', 'english', 'python', 'ielts']
export const VALID_SUBDOMAINS = TRAINING_PROGRAMS.map(p => p.subdomain);

// 4. TẠO MENU ITEMS CHO FRONTEND
export const MAIN_MENU_ITEMS = [
    {
        label: "VỀ ERG",
        path: "/ve-erg",
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