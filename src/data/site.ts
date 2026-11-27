// Mock content taken from the design. There is no backend yet: edit these lists to change the site.

export const CONTACT = {
  hotline: '0938.830.098',
  hotlineTel: '+84938830098',
  email: 'info@erg.edu.vn',
  facebook: 'https://www.facebook.com/eduriseerg',
  zalo: 'https://zalo.me/0938830098',
  messenger: 'https://m.me/1599144906818434', // page id from the old site's floating contact
};

export type Program = { slug: string; title: string; short: string; text: string; icon: string };

// Old subdomains redirect to /chuong-trinh/<slug> (see public/_redirects and README).
export const PROGRAMS: Program[] = [
  { slug: 'tin-hoc-quoc-te', title: 'Tin học Quốc tế', short: 'MOS, IC3 GS6, IC3 Spark', text: 'Luyện thi chứng chỉ tin học quốc tế MOS, IC3 GS6, IC3 Spark.', icon: 'M12 3a9 9 0 1 0 0 18a9 9 0 0 0 0-18z M3 12h18 M12 3c3 3.5 3 14.5 0 18 M12 3c-3 3.5-3 14.5 0 18' },
  { slug: 'tin-hoc-quoc-gia', title: 'Tin học Quốc gia', short: 'CNTT cơ bản và nâng cao', text: 'Chứng chỉ CNTT cơ bản và nâng cao theo chuẩn kỹ năng sử dụng CNTT tại Việt Nam.', icon: 'M6 3h9l4 4v14H6z M14 3v5h5 M9 13h7 M9 17h7' },
  { slug: 'tin-hoc-thieu-nhi', title: 'Tin học Thiếu nhi', short: 'Scratch, Python cho trẻ', text: 'Lập trình Scratch, Python cho trẻ, phát triển tư duy logic và sáng tạo công nghệ.', icon: 'M8 8l-4 4l4 4 M16 8l4 4l-4 4 M13 6l-2 12' },
  { slug: 'cong-dan-so', title: 'Kỹ năng Công dân số', short: 'An toàn thông tin cho học sinh', text: 'Giáo dục kỹ năng công dân số và an toàn thông tin cho học sinh.', icon: 'M12 3l8 3v6c0 4.5-3.2 8-8 9c-4.8-1-8-4.5-8-9V6z M9 12l2 2l4-4' },
  { slug: 'dien-toan-dam-may', title: 'Điện toán đám mây', short: 'Nền tảng Cloud', text: 'Đào tạo nền tảng điện toán đám mây (Cloud).', icon: 'M7 18a4 4 0 0 1-.5-8A6 6 0 0 1 18 9.5A4.5 4.5 0 0 1 17.5 18z' },
  { slug: 'tri-tue-nhan-tao', title: 'Trí tuệ nhân tạo (AI)', short: 'AI và học máy ứng dụng', text: 'Hiểu AI, học máy và cách ứng dụng trí tuệ nhân tạo vào học tập, công việc.', icon: 'M12 3l2.2 5.8L20 11l-5.8 2.2L12 19l-2.2-5.8L4 11l5.8-2.2z M19 3v4 M17 5h4' },
];

export const FIELD_GROUPS = { cert: 'Chứng chỉ & kỹ năng cơ bản', prog: 'Lập trình & phát triển năng lực' } as const;

export type Field = { slug: string; group: keyof typeof FIELD_GROUPS; title: string; text: string; who: string; icon: string };

export const FIELDS: Field[] = [
  { slug: 'ic3-gs6', group: 'cert', title: 'IC3 GS6', text: 'Chuẩn năng lực số quốc tế giúp học viên sử dụng máy tính, Internet và các công cụ công nghệ một cách tự tin, an toàn.', who: 'Học sinh THCS, THPT cần nền tảng tin học chuẩn quốc tế.', icon: 'M3 5h18v11H3z M8 20h8 M12 16v4' },
  { slug: 'mos', group: 'cert', title: 'MOS', text: 'Chứng chỉ Tin học Văn phòng Quốc tế do Microsoft chứng nhận, giúp học viên thành thạo Word, Excel, PowerPoint trong học tập và công việc.', who: 'Học sinh, sinh viên cần chứng chỉ tin học văn phòng.', icon: 'M12 3a5 5 0 1 0 0 10a5 5 0 0 0 0-10z M9 12.5L8 21l4-2l4 2l-1-8.5' },
  { slug: 'tin-hoc-co-ban-nang-cao', group: 'cert', title: 'Tin học cơ bản & nâng cao', text: 'Chương trình theo chuẩn kỹ năng sử dụng công nghệ thông tin tại Việt Nam, gồm nền tảng cơ bản và các mô-đun nâng cao.', who: 'Học viên cần chứng chỉ CNTT phục vụ hồ sơ học tập hoặc thi tuyển.', icon: 'M6 3h9l4 4v14H6z M14 3v5h5 M9 13h7 M9 17h7' },
  { slug: 'lien-ket-dao-tao', group: 'cert', title: 'Chương trình liên kết đào tạo', text: 'Các chương trình liên kết đào tạo tin học ngắn hạn, trung hạn và dài hạn, linh hoạt theo nhu cầu trường học, doanh nghiệp và tổ chức.', who: 'Trường học muốn bổ sung chương trình tin học chuẩn hóa.', icon: 'M8 12h8 M10 8H7a4 4 0 0 0 0 8h3 M14 8h3a4 4 0 0 1 0 8h-3' },
  { slug: 'lap-trinh-thieu-nhi', group: 'prog', title: 'Lập trình thiếu nhi', text: 'Chương trình lập trình cho trẻ 5-15 tuổi, giúp phát triển tư duy logic, giải quyết vấn đề và sáng tạo công nghệ qua Scratch, Python.', who: 'Trẻ từ 5-15 tuổi mới bắt đầu tiếp cận công nghệ.', icon: 'M8 8l-4 4l4 4 M16 8l4 4l-4 4 M13 6l-2 12' },
  { slug: 'stem-robotics', group: 'prog', title: 'STEM Robotics', text: 'Giáo dục tích hợp khoa học, công nghệ, kỹ thuật và toán học thông qua thiết kế, lắp ráp và lập trình robot.', who: 'Học sinh yêu thích robot, lắp ráp và công nghệ.', icon: 'M6 9h12v10H6z M12 9V5 M9.5 13v2 M14.5 13v2 M3 13v3 M21 13v3' },
  { slug: 'tri-tue-nhan-tao', group: 'prog', title: 'Trí tuệ nhân tạo (AI)', text: 'Chương trình giúp học viên hiểu AI, học máy và cách ứng dụng trí tuệ nhân tạo vào học tập, công việc và sáng tạo sản phẩm.', who: 'Học sinh muốn tiếp cận AI sớm và đúng nền tảng.', icon: 'M12 3l2.2 5.8L20 11l-5.8 2.2L12 19l-2.2-5.8L4 11l5.8-2.2z M19 3v4 M17 5h4' },
  { slug: 'luyen-thi-hsg-tin-hoc', group: 'prog', title: 'Luyện thi học sinh giỏi Tin học', text: 'Lộ trình bồi dưỡng học sinh có năng lực tốt, tập trung thuật toán, cấu trúc dữ liệu và kỹ năng lập trình thi học sinh giỏi.', who: 'Học sinh có định hướng thi học sinh giỏi Tin học.', icon: 'M8 4h8v5a4 4 0 0 1-8 0z M8 6H5a3 3 0 0 0 3 4 M16 6h3a3 3 0 0 1-3 4 M12 13v4 M9 20h6' },
  { slug: 'tin-hoc-tre', group: 'prog', title: 'Tin học trẻ Cấp Thành phố & Toàn Quốc', text: 'Lộ trình luyện thi Tin học trẻ từ cấp Thành phố đến Toàn Quốc, giúp học sinh rèn thuật toán, xây dựng sản phẩm số và trình bày bài thi thuyết phục.', who: 'Học sinh tiểu học, THCS, THPT có định hướng thi Tin học trẻ các cấp.', icon: 'M5 21V4 M5 4h11l-2 4l2 4H5' },
  { slug: 'lap-trinh-thi-dau', group: 'prog', title: 'Lập trình thi đấu (CP)', text: 'Lộ trình lập trình thi đấu giúp học viên rèn tốc độ giải bài, thuật toán, cấu trúc dữ liệu và tư duy tối ưu bằng Python, C++ hoặc Java.', who: 'Học sinh đã có nền tảng lập trình cơ bản và muốn học sâu thuật toán.', icon: 'M13 3L5 13h6l-1 8l8-10h-6z' },
];

export type NavKey = 'home' | 'about' | 'programs' | 'news' | 'careers' | 'contact';

export const NAV: { key: NavKey; label: string; href: string; caret: boolean }[] = [
  { key: 'about', label: 'Giới thiệu', href: '/gioi-thieu/cau-chuyen-cua-erg', caret: true },
  { key: 'programs', label: 'Chương trình đào tạo', href: '/linh-vuc-dao-tao', caret: true },
  { key: 'news', label: 'Tin tức', href: '/tin-tuc', caret: false },
  { key: 'careers', label: 'Tuyển dụng', href: '/tuyen-dung', caret: false },
];

// Offices shown on the contact page.
export const PLACES = [
  { name: 'Trụ sở chính', address: 'Số 83B, Đường Hoàng Sa, Phường Tân Định, TP. Hồ Chí Minh', hotline: '0938.830.098', tel: 'tel:0938830098', email: 'info@erg.edu.vn', hours: '' },
  { name: 'Chi nhánh – ERG Academy', address: 'Số 21 Đường Huỳnh Văn Một, Phú Thạnh, TP. Hồ Chí Minh', hotline: '0938.830.098', tel: 'tel:0938830098', email: 'daotao@erg.edu.vn', hours: 'Giờ làm việc: Thứ Hai - Thứ Bảy, 07:30 - 21:00' },
];
