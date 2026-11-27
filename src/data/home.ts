// Mock content taken from the design Main.dc.html. Edit these lists to change the home page.

export const STATS = [
  { value: '8+', label: 'Năm kinh nghiệm đào tạo' },
  { value: '90%+', label: 'Học sinh TH, THCS, THPT đạt chuẩn đầu ra' },
  { value: '100%', label: 'Khối Cao đẳng – Đại học đạt chuẩn đầu ra' },
];

// Seasonal hero badge + notice bar. 'none' is the default; the rest show only for their data-season.
export const SEASON_TEXT = [
  { key: 'none', tag: 'Thông báo', notice: 'Khóa bán trú hè 2026 tại ERG: Hè bứt phá – Kiến tạo tương lai' },
  { key: 'tet', tag: 'Xuân Đinh Mùi', notice: 'Lịch nghỉ Tết Đinh Mùi và khai giảng đầu xuân: [NGÀY NGHỈ – NGÀY KHAI GIẢNG]' },
  { key: 'noel', tag: 'Giáng sinh', notice: 'Giáng sinh tại ERG: [TÊN SỰ KIỆN – NGÀY TỔ CHỨC]' },
  { key: 'newyear', tag: 'Năm mới 2027', notice: 'Thông báo lịch nghỉ lễ: [NGÀY NGHỈ – NGÀY HỌC LẠI]' },
  { key: 'hungvuong', tag: 'Giỗ Tổ Hùng Vương', notice: 'Thông báo lịch nghỉ lễ: [NGÀY NGHỈ – NGÀY HỌC LẠI]' },
  { key: 'thongnhat', tag: 'Lễ 30/4 – 1/5', notice: 'Thông báo lịch nghỉ lễ: [NGÀY NGHỈ – NGÀY HỌC LẠI]' },
  { key: 'thieunhi', tag: 'Quốc tế Thiếu nhi 1/6', notice: 'Thông báo lịch nghỉ lễ: [NGÀY NGHỈ – NGÀY HỌC LẠI]' },
  { key: 'quockhanh', tag: 'Quốc khánh 2/9', notice: 'Thông báo lịch nghỉ lễ: [NGÀY NGHỈ – NGÀY HỌC LẠI]' },
  { key: 'trungthu', tag: 'Tết Trung thu', notice: 'Thông báo lịch nghỉ lễ: [NGÀY NGHỈ – NGÀY HỌC LẠI]' },
  { key: 'nhagiao', tag: 'Nhà giáo Việt Nam 20/11', notice: 'Thông báo lịch nghỉ lễ: [NGÀY NGHỈ – NGÀY HỌC LẠI]' },
];

export const ABOUT = [
  { title: 'Chất lượng Quốc tế', text: 'Chương trình chuẩn hóa, cấp chứng chỉ MOS, IC3 có giá trị toàn cầu.', icon: 'M12 3a5 5 0 1 0 0 10a5 5 0 0 0 0-10z M9 12.5L8 21l4-2l4 2l-1-8.5' },
  { title: 'Thực tiễn & Ứng dụng', text: 'Học đi đôi với hành, cam kết thành thạo kỹ năng ngay sau khóa học.', icon: 'M5 12l5 5l9-10' },
  { title: 'Công nghệ hiện đại', text: 'Hệ thống phòng máy, phần mềm cập nhật liên tục theo xu hướng 4.0.', icon: 'M3 5h18v11H3z M8 20h8 M12 16v4' },
];

// Field cards on the home page use shorter copy than the field pages; slug links to /linh-vuc-dao-tao/<slug>.
export const HOME_FIELDS = [
  { slug: 'ic3-gs6', title: 'IC3 GS6', text: 'Chuẩn năng lực số quốc tế giúp học viên sử dụng máy tính, Internet và các công cụ công nghệ một cách tự tin, an toàn.', icon: 'M3 5h18v11H3z M8 20h8 M12 16v4' },
  { slug: 'mos', title: 'MOS', text: 'Chứng chỉ Tin học Văn phòng Quốc tế do Microsoft chứng nhận, thành thạo Word, Excel, PowerPoint.', icon: 'M12 3a5 5 0 1 0 0 10a5 5 0 0 0 0-10z M9 12.5L8 21l4-2l4 2l-1-8.5' },
  { slug: 'tin-hoc-co-ban-nang-cao', title: 'Tin học cơ bản & nâng cao', text: 'Theo chuẩn kỹ năng sử dụng công nghệ thông tin tại Việt Nam, gồm nền tảng cơ bản và các mô-đun nâng cao.', icon: 'M6 3h9l4 4v14H6z M14 3v5h5 M9 13h7 M9 17h7' },
  { slug: 'lien-ket-dao-tao', title: 'Chương trình liên kết đào tạo', text: 'Liên kết đào tạo tin học ngắn hạn, trung hạn và dài hạn theo nhu cầu trường học, doanh nghiệp và tổ chức.', icon: 'M8 12h8 M10 8H7a4 4 0 0 0 0 8h3 M14 8h3a4 4 0 0 1 0 8h-3' },
  { slug: 'lap-trinh-thieu-nhi', title: 'Lập trình thiếu nhi', text: 'Cho trẻ 5-15 tuổi, phát triển tư duy logic, giải quyết vấn đề và sáng tạo công nghệ qua Scratch, Python.', icon: 'M8 8l-4 4l4 4 M16 8l4 4l-4 4 M13 6l-2 12' },
  { slug: 'stem-robotics', title: 'STEM Robotics', text: 'Tích hợp khoa học, công nghệ, kỹ thuật và toán học qua thiết kế, lắp ráp và lập trình robot.', icon: 'M6 9h12v10H6z M12 9V5 M9.5 13v2 M14.5 13v2 M3 13v3 M21 13v3' },
  { slug: 'tri-tue-nhan-tao', title: 'Trí tuệ nhân tạo (AI)', text: 'Hiểu AI, học máy và cách ứng dụng trí tuệ nhân tạo vào học tập, công việc và sáng tạo sản phẩm.', icon: 'M12 3l2.2 5.8L20 11l-5.8 2.2L12 19l-2.2-5.8L4 11l5.8-2.2z M19 3v4 M17 5h4' },
  { slug: 'luyen-thi-hsg-tin-hoc', title: 'Luyện thi học sinh giỏi Tin học', text: 'Bồi dưỡng học sinh có năng lực tốt, tập trung thuật toán, cấu trúc dữ liệu và kỹ năng lập trình.', icon: 'M8 4h8v5a4 4 0 0 1-8 0z M8 6H5a3 3 0 0 0 3 4 M16 6h3a3 3 0 0 1-3 4 M12 13v4 M9 20h6' },
  { slug: 'tin-hoc-tre', title: 'Tin học trẻ Thành phố & Toàn quốc', text: 'Luyện thi Tin học trẻ từ cấp Thành phố đến Toàn quốc: thuật toán, sản phẩm số và trình bày bài thi.', icon: 'M5 21V4 M5 4h11l-2 4l2 4H5' },
  { slug: 'lap-trinh-thi-dau', title: 'Lập trình thi đấu (CP)', text: 'Rèn tốc độ giải bài, thuật toán, cấu trúc dữ liệu và tư duy tối ưu bằng Python, C++ hoặc Java.', icon: 'M13 3L5 13h6l-1 8l8-10h-6z' },
];

export const REASONS = [
  { no: '1', title: 'Đội ngũ giáo viên chất lượng cao', text: 'Giáo viên nhiều năm kinh nghiệm, chuyên môn vững vàng, tận tâm và luôn cập nhật phương pháp giảng dạy hiện đại.' },
  { no: '2', title: 'Chương trình chuẩn Quốc tế', text: 'Giáo trình biên soạn dựa trên tiêu chuẩn quốc tế, bám sát thực tiễn, giúp nắm vững kiến thức nền tảng.' },
  { no: '3', title: 'Cơ sở vật chất hiện đại', text: 'Phòng học trang bị đầy đủ thiết bị công nghệ, môi trường học tập tiện nghi, chuyên nghiệp và hiệu quả.' },
  { no: '4', title: 'Kiểm soát chất lượng chặt chẽ', text: 'Chương trình giảng dạy được giám sát theo lộ trình rõ ràng, đảm bảo chất lượng đồng đều.' },
  { no: '5', title: 'Chi phí hợp lý, nhiều ưu đãi', text: 'Học phí phù hợp, chính sách linh hoạt cùng nhiều chương trình học bổng dành cho học sinh.' },
];

export const HOME_NEWS = [
  { slug: 'khoa-ban-tru-he-2026', date: '18/5/2026', title: 'Khóa bán trú hè 2026 tại ERG: Hè bứt phá - Kiến tạo tương lai', text: 'Chương trình bán trú hè 2026 của ERG tích hợp 5 môn cốt lõi theo từng độ tuổi, kết hợp học thuật, công nghệ và các cột mốc đầu ra rõ ràng.' },
  { slug: 'tin-hoc-van-phong-ky-nang-bat-buoc', date: '16/5/2026', title: 'Tin học văn phòng – Kỹ năng bắt buộc trong thời đại số cùng ERG', text: 'Từ Word, Excel đến PowerPoint, ERG giúp người học xây nền kỹ năng tin học văn phòng bài bản, thực tế.' },
  { slug: 'hoc-tin-hoc-tu-som', date: '14/5/2026', title: 'Học Tin học từ sớm – Mở rộng tương lai số cùng ERG', text: 'Lộ trình học Tin học bài bản từ Tin học văn phòng, IC3, Scratch đến Python để từng bước làm chủ công nghệ.' },
];

export const QUOTES = [
  { text: 'Khóa học MOS tại ERG giúp mình tự tin hơn hẳn khi làm đồ án tốt nghiệp. Giảng viên rất nhiệt tình!', role: 'Sinh viên' },
  { text: 'Mình đã ứng dụng được ngay kiến thức Excel vào công việc kế toán hàng ngày. Cảm ơn ERG rất nhiều.', role: 'Nhân viên văn phòng' },
  { text: 'Môi trường học tập chuyên nghiệp, máy móc xịn. Mình sẽ giới thiệu bạn bè đến học.', role: 'Freelancer' },
];
