export const ABOUT_TABS = [
  { key: 'story', label: 'Câu chuyện của ERG', href: '/gioi-thieu/cau-chuyen-cua-erg' },
  { key: 'values', label: 'Giá trị cốt lõi', href: '/gioi-thieu/gia-tri-cot-loi' },
  { key: 'vision', label: 'Tầm nhìn & Sứ mệnh', href: '/gioi-thieu/tam-nhin-su-menh' },
  { key: 'leaders', label: 'Đội ngũ lãnh đạo', href: '/gioi-thieu/doi-ngu-lanh-dao' },
  { key: 'partners', label: 'Đối tác chiến lược', href: '/gioi-thieu/doi-tac' },
] as const;
export type AboutKey = (typeof ABOUT_TABS)[number]['key'];

export const NAME_PARTS = [
  { word: 'Edu', color: 'var(--navy)', label: 'Education - Giáo dục', text: 'Nền tảng cốt lõi, nơi tri thức được truyền tải bằng sự tận tâm và phương pháp sư phạm hiện đại.' },
  { word: 'Rise', color: 'var(--red)', label: 'Rise - Vươn tầm', text: 'Sự phát triển không ngừng, khát vọng vươn lên và đổi mới sáng tạo để thích ứng với thế giới biến động.' },
  { word: 'Global', color: 'var(--navy)', label: 'Global - Toàn cầu', text: 'Tầm nhìn quốc tế, đưa tiêu chuẩn giáo dục toàn cầu đến với người học Việt Nam.' },
];

export const FEATURES = [
  { title: 'Tiên phong', text: 'Luôn đi đầu trong việc áp dụng các công nghệ phương pháp giáo dục mới vào giảng dạy.', icon: 'M12 3l2.2 5.8L20 11l-5.8 2.2L12 19l-2.2-5.8L4 11l5.8-2.2z' },
  { title: 'Tâm huyết', text: 'Đội ngũ giáo viên không chỉ là người truyền đạt kiến thức mà còn là người truyền lửa đam mê.', icon: 'M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.500-7 10-7 10z' },
  { title: 'Đột phá', text: 'Tạo ra những bước nhảy vọt về năng lực số cho học viên, mở ra cánh cửa sự nghiệp tương lai.', icon: 'M13 3L5 13h6l-1 8l8-10h-6z' },
];

export const VALUES = [
  { title: 'Trách nhiệm xã hội', text: 'ERG đóng góp vào sự phát triển bền vững của xã hội thông qua các chương trình đào tạo quốc tế, nâng cao kỹ năng công nghệ cho cộng đồng.', icon: 'M12 3a9 9 0 1 0 0 18a9 9 0 0 0 0-18z M3 12h18 M12 3c3 3.5 3 14.5 0 18 M12 3c-3 3.5-3 14.5 0 18' },
  { title: 'Chất lượng vượt trội', text: 'ERG cam kết mang lại những sản phẩm và dịch vụ với chất lượng tốt nhất thông qua việc đảm bảo tỷ lệ thành công tối ưu và trải nghiệm dịch vụ vượt trội.', icon: 'M12 3a5 5 0 1 0 0 10a5 5 0 0 0 0-10z M9 12.5L8 21l4-2l4 2l-1-8.5' },
  { title: 'Hợp tác đồng hành', text: 'ERG xây dựng một môi trường làm việc đội nhóm, nơi mọi người cùng nhau chia sẻ kiến thức, kinh nghiệm và cùng nhau phát triển.', icon: 'M8 12h8 M10 8H7a4 4 0 0 0 0 8h3 M14 8h3a4 4 0 0 1 0 8h-3' },
  { title: 'Khách hàng là trung tâm', text: 'ERG đặt lợi ích và sự hài lòng của khách hàng làm ưu tiên hàng đầu trên các khía cạnh về sự thấu hiểu, cải tiến chất lượng, minh bạch hóa, giữ đúng cam kết.', icon: 'M12 3l8 3v6c0 4.5-3.2 8-8 9c-4.8-1-8-4.5-8-9V6z M9 12l2 2l4-4' },
  { title: 'Sáng tạo đổi mới', text: 'Công nghệ không chỉ là công cụ, mà là động lực để chuyển hóa giáo dục. ERG thúc đẩy tinh thần đổi mới trong từng giải pháp, khuyến khích tư duy sáng tạo.', icon: 'M12 3l2.2 5.8L20 11l-5.8 2.2L12 19l-2.2-5.8L4 11l5.8-2.2z M19 3v4 M17 5h4' },
];

export const VISION_TAGS = ['Chuẩn hóa quốc tế', 'Học tập trọn đời', 'Cộng đồng tri thức', 'Đổi mới sáng tạo'];

export const LEADERS = [
  { aria: 'Ảnh chân dung lãnh đạo', cap: 'Ảnh: chân dung lãnh đạo', name: '[HỌ VÀ TÊN LÃNH ĐẠO]', title: '[CHỨC VỤ]', bio: '[GIỚI THIỆU NGẮN: quá trình công tác, lĩnh vực chuyên môn và vai trò tại ERG.]', quote: '“[TRÍCH DẪN / TRIẾT LÝ GIÁO DỤC CỦA LÃNH ĐẠO]”' },
  { aria: 'Ảnh chân dung', cap: 'Ảnh: chân dung', name: '[HỌ VÀ TÊN]', title: '[CHỨC VỤ]', bio: '[TIỂU SỬ NGẮN 1–2 CÂU]', quote: '' },
  { aria: 'Ảnh chân dung', cap: 'Ảnh: chân dung', name: '[HỌ VÀ TÊN]', title: '[CHỨC VỤ]', bio: '[TIỂU SỬ NGẮN 1–2 CÂU]', quote: '' },
  { aria: 'Ảnh chân dung', cap: 'Ảnh: chân dung', name: '[HỌ VÀ TÊN]', title: '[CHỨC VỤ]', bio: '[TIỂU SỬ NGẮN 1–2 CÂU]', quote: '' },
];

export const PARTNERS = [
  { name: 'Microsoft', note: 'Chứng chỉ MOS' },
  { name: 'Certiport', note: 'Chứng chỉ IC3' },
  { name: '[TÊN ĐỐI TÁC]', note: 'Tổ chức giáo dục' },
  { name: '[TÊN ĐỐI TÁC]', note: 'Tổ chức giáo dục' },
  { name: '[TÊN ĐỐI TÁC]', note: 'Doanh nghiệp công nghệ' },
  { name: '[TÊN ĐỐI TÁC]', note: 'Doanh nghiệp công nghệ' },
  { name: '[TÊN ĐỐI TÁC]', note: 'Trường học liên kết' },
  { name: '[TÊN ĐỐI TÁC]', note: 'Trường học liên kết' },
];
