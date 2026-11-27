import { FIELDS, FIELD_GROUPS } from '@/data/site';

export type FieldDetail = {
  badge: string;
  h1: string;
  photoAlt: string;
  photoLabel: string;
  heading: string;
  overview: string;
  highlights: string[];
  audience: string[];
  modules: { title: string; text: string }[];
  outcomes: string[];
  assessment: string;
  faq: { q: string; a: string }[];
  facts: { k: string; v: string }[];
};

const mos: FieldDetail = {
  badge: 'Chứng chỉ MOS',
  h1: 'MOS – Microsoft Office Specialist',
  photoAlt: 'Ảnh minh họa chứng chỉ MOS',
  photoLabel: 'Ảnh: chứng chỉ Microsoft Office Specialist',
  heading: 'MOS là gì?',
  overview: 'MOS (Microsoft Office Specialist) là chứng chỉ Tin học Văn phòng Quốc tế, đánh giá năng lực sử dụng bộ công cụ Microsoft Office. Chứng chỉ này ngày càng phổ biến vì hỗ trợ trực tiếp cho học tập, tốt nghiệp, tuyển dụng và hiệu suất công việc.',
  highlights: [
    'Chuẩn kỹ năng văn phòng quốc tế trên Word, Excel và PowerPoint.',
    'Bài học đi thẳng vào thao tác thực tế, hạn chế lý thuyết rời rạc.',
    'Phù hợp với nhu cầu ra trường, đi làm và nâng cao năng suất cá nhân.',
  ],
  audience: [
    'Học sinh, sinh viên cần chứng chỉ tin học văn phòng.',
    'Nhân viên văn phòng muốn tăng tốc xử lý công việc.',
    'Ứng viên cần lợi thế trong hồ sơ tuyển dụng.',
  ],
  modules: [
    { title: 'Word', text: 'Định dạng tài liệu, bảng, tham chiếu và xuất bản.' },
    { title: 'Excel', text: 'Công thức, hàm, biểu đồ, lọc và phân tích dữ liệu.' },
    { title: 'PowerPoint', text: 'Bố cục slide, hình ảnh, biểu đồ và trình chiếu.' },
  ],
  outcomes: [
    'Soạn thảo tài liệu chuyên nghiệp bằng Word.',
    'Xử lý bảng tính, hàm, biểu đồ và dữ liệu bằng Excel.',
    'Thiết kế bài trình chiếu rõ ràng, thuyết phục bằng PowerPoint.',
  ],
  assessment: 'Học viên được luyện theo ngân hàng bài tập thao tác, thi thử và nhận phản hồi chi tiết trước khi thi chứng chỉ.',
  faq: [
    { q: 'MOS phù hợp với ai?', a: 'Học sinh, sinh viên cần chứng chỉ tin học văn phòng. Nhân viên văn phòng muốn tăng tốc xử lý công việc. Ứng viên cần lợi thế trong hồ sơ tuyển dụng.' },
    { q: 'Học MOS tại ERG nhận được gì?', a: 'Soạn thảo tài liệu chuyên nghiệp bằng Word. Xử lý bảng tính, hàm, biểu đồ và dữ liệu bằng Excel. Thiết kế bài trình chiếu rõ ràng, thuyết phục bằng PowerPoint.' },
    { q: 'Làm sao để được tư vấn chương trình MOS?', a: 'Phụ huynh và học viên có thể liên hệ ERG qua Zalo 0938.830.098 để được tư vấn lộ trình phù hợp với mục tiêu, độ tuổi và nền tảng hiện tại.' },
  ],
  facts: [
    { k: 'Chứng chỉ', v: 'Microsoft Office Specialist' },
    { k: 'Nhóm', v: FIELD_GROUPS.cert },
    { k: 'Nội dung', v: 'Word · Excel · PowerPoint' },
    { k: 'Thời lượng', v: '[THỜI LƯỢNG]' },
    { k: 'Học phí', v: '[HỌC PHÍ]' },
    { k: 'Khai giảng', v: '[NGÀY KHAI GIẢNG]' },
  ],
};

// Other fields: real title/text/who/group from FIELDS; the rest is a bracketed placeholder until content is supplied.
const placeholder = (f: (typeof FIELDS)[number]): FieldDetail => ({
  badge: f.title,
  h1: f.title,
  photoAlt: `Ảnh minh họa ${f.title}`,
  photoLabel: `Ảnh: ${f.title}`,
  heading: `${f.title} là gì?`,
  overview: f.text,
  highlights: ['[Điểm nổi bật 1]', '[Điểm nổi bật 2]', '[Điểm nổi bật 3]'],
  audience: [f.who, '[Đối tượng 2]', '[Đối tượng 3]'],
  modules: [1, 2, 3].map((n) => ({ title: `[Mô-đun ${n}]`, text: `[Nội dung mô-đun ${n}]` })),
  outcomes: ['[Kết quả đầu ra 1]', '[Kết quả đầu ra 2]', '[Kết quả đầu ra 3]'],
  assessment: '[Nội dung đánh giá & chuẩn đầu ra]',
  faq: [
    { q: `${f.title} phù hợp với ai?`, a: f.who },
    { q: `Học ${f.title} tại ERG nhận được gì?`, a: '[Nội dung trả lời]' },
    { q: `Làm sao để được tư vấn chương trình ${f.title}?`, a: 'Phụ huynh và học viên có thể liên hệ ERG qua Zalo 0938.830.098 để được tư vấn lộ trình phù hợp với mục tiêu, độ tuổi và nền tảng hiện tại.' },
  ],
  facts: [
    { k: 'Chứng chỉ', v: '[TÊN CHỨNG CHỈ]' },
    { k: 'Nhóm', v: FIELD_GROUPS[f.group] },
    { k: 'Nội dung', v: '[NỘI DUNG]' },
    { k: 'Thời lượng', v: '[THỜI LƯỢNG]' },
    { k: 'Học phí', v: '[HỌC PHÍ]' },
    { k: 'Khai giảng', v: '[NGÀY KHAI GIẢNG]' },
  ],
});

export const FIELD_DETAILS: Record<string, FieldDetail> = Object.fromEntries(
  FIELDS.map((f) => [f.slug, f.slug === 'mos' ? mos : placeholder(f)]),
);
