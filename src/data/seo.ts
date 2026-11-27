// SEO brand and keyword lists, carried over from the old Next.js site (src/constants/seo.constants.ts).
export const BRAND = 'Trung Tâm Ngoại Ngữ - Tin Học ERG';
export const HOME_TITLE = `${BRAND} | Chứng chỉ MOS, IC3, Lập trình thiếu nhi, AI`;
export const OG_IMAGE = 'https://media.erg.edu.vn/logo/og-image.jpg';
export const LOGO = 'https://media.erg.edu.vn/logo/erg.png';

const main = [
  'trung tâm tin học', 'đào tạo tin học', 'tin học văn phòng', 'chứng chỉ MOS', 'chứng chỉ IC3', 'lập trình thiếu nhi',
  'giáo dục công nghệ', 'kỹ năng số', 'trung tâm tin học uy tín', 'học tin học văn phòng ở đâu', 'luyện thi MOS cấp tốc',
  'đào tạo công nghệ thông tin', 'tin học cho học sinh', 'chứng chỉ tin học quốc tế', 'kỹ năng máy tính', 'tin học ứng dụng',
  'edurise global', 'erg edu vn', 'trung tâm erg', 'tin học erg', 'ngoại ngữ tin học erg', 'erg learning',
  'trung tâm ngoại ngữ tin học erg', 'luyện thi chứng chỉ quốc tế', 'iig việt nam', 'đăng ký thi iig', 'trung tâm khảo thí iig',
  'lịch thi mos iig', 'địa điểm thi mos', 'học tin học văn phòng tphcm', 'lớp tin học cho người đi làm', 'khóa học tin học cấp tốc',
];

// Keyed by programme slug (/chuong-trinh/<slug>), plus 'main' and 'careers'.
export const KEYWORDS: Record<string, string[]> = {
  main,
  'tri-tue-nhan-tao': [
    'học AI cho học sinh', 'trí tuệ nhân tạo phổ thông', 'lập trình AI', 'tư duy máy tính', 'giáo dục AI', 'AI cho thiếu nhi',
    'ứng dụng AI', 'khóa học AI cơ bản', 'trí tuệ nhân tạo cho trẻ em', 'lập trình python ai', 'tương lai ngành AI', 'kiến thức AI',
    'đào tạo trí tuệ nhân tạo', 'khóa học ai erg', 'lớp học trí tuệ nhân tạo', 'ai căn bản', 'học machine learning',
    'ứng dụng ai trong công việc', 'chatgpt cho người đi làm', 'ai cho người bắt đầu', 'khóa học prompt engineering',
  ],
  'tin-hoc-quoc-te': [
    'chứng chỉ MOS', 'luyện thi MOS', 'tin học văn phòng quốc tế', 'chứng chỉ IC3 GS6', 'MOS Excel', 'MOS Word', 'MOS PowerPoint',
    'thi chứng chỉ MOS ở đâu', 'luyện thi IC3 cấp tốc', 'MOS 2019', 'MOS 365', 'học tin học văn phòng chuẩn quốc tế', 'certiportvietnam',
    'tin học MOS', 'bằng tin học quốc tế', 'tin học văn phòng cho sinh viên', 'luyện thi mos erg', 'thi ic3 tại erg',
    'trung tâm khảo thí certiport', 'đăng ký thi mos', 'thi mos excel', 'thi mos word', 'thi mos powerpoint', 'mos 2016', 'đề thi mos',
    'tự học mos', 'thi thử mos', 'chứng chỉ ic3 spark', 'tin học cơ bản ic3', 'luyện thi ic3', 'bằng tin học vô thời hạn',
  ],
  'tin-hoc-quoc-gia': [
    'chứng chỉ CNTT cơ bản', 'thông tư 03/2014', 'tin học quốc gia', 'luyện thi công chức tin học', 'chứng chỉ tin học bộ giáo dục',
    'chứng chỉ tin học theo thông tư 03', 'thi bằng tin học cơ bản', 'tin học văn phòng nâng cao', 'đào tạo tin học quốc gia',
    'bằng tin học mẫu mới', 'chứng chỉ ứng dụng công nghệ thông tin', 'chứng chỉ cntt erg', 'thi tin học thông tư 03 erg',
    'thi chứng chỉ công nghệ thông tin cơ bản', 'thi tin học nâng cao', 'bằng tin học bộ giáo dục', 'tin học thi công chức',
    'bằng a tin học', 'bằng b tin học', 'luyện thi tin học cấp tốc',
  ],
  'tin-hoc-thieu-nhi': [
    'lập trình scratch', 'lập trình python cho trẻ em', 'tin học thiếu nhi', 'tư duy logic', 'sáng tạo công nghệ', 'robotics thiếu nhi',
    'học lập trình sớm', 'khoa học máy tính cho bé', 'lớp học scratch online', 'phát triển tư duy cho trẻ', 'trại hè công nghệ',
    'bé học máy tính', 'lập trình cho bé erg', 'lớp học scratch erg', 'khóa học python cho trẻ em', 'tin học học đường',
    'kỹ năng số cho trẻ', 'giáo dục steam', 'robotics cho bé', 'lớp tin học hè', 'trại hè tin học',
  ],
  'cong-dan-so': [
    'công dân số', 'digital citizenship', 'an toàn mạng', 'kỹ năng số', 'định danh số', 'vắc xin số', 'quy tắc ứng xử trên mạng',
    'an toàn thông tin cho học sinh', 'kỹ năng dùng internet', 'văn hóa số', 'trách nhiệm trên không gian mạng', 'kỹ năng số erg',
    'an toàn trực tuyến', 'bảo vệ trẻ em trên mạng', 'kỹ năng sử dụng mạng xã hội', 'tư duy số',
  ],
  'dien-toan-dam-may': [
    'học AWS', 'học Azure', 'điện toán đám mây', 'devops cơ bản', 'cloud computing', 'kỹ sư hệ thống', 'chứng chỉ AWS', 'lộ trình devops',
    'hạ tầng đám mây', 'kiến trúc sư đám mây', 'triển khai cloud', 'khóa học cloud erg', 'aws azure erg', 'chứng chỉ cloud computing',
    'luyện thi chứng chỉ aws', 'học cloud computing tphcm',
  ],
  careers: [
    'tuyển dụng giáo viên tin học', 'việc làm giáo dục', 'tuyển dụng nhân sự', 'đại sứ giáo dục', 'đối tác trường học', 'tuyển dụng IT',
    'việc làm edtech', 'tuyển dụng cộng tác viên giáo dục', 'nhân sự edurise global', 'tuyển dụng erg', 'việc làm tại erg',
    'giáo viên tin học erg', 'tuyển dụng giảng viên tin học', 'tuyển thực tập sinh cntt',
  ],
};

// Which programme's keywords a /linh-vuc-dao-tao/<slug> page borrows; unlisted fields get the main list.
export const FIELD_PROGRAM: Record<string, string> = {
  'ic3-gs6': 'tin-hoc-quoc-te', mos: 'tin-hoc-quoc-te', 'tin-hoc-co-ban-nang-cao': 'tin-hoc-quoc-gia',
  'lap-trinh-thieu-nhi': 'tin-hoc-thieu-nhi', 'stem-robotics': 'tin-hoc-thieu-nhi', 'tri-tue-nhan-tao': 'tri-tue-nhan-tao',
};
