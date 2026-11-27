// Mock content per programme group. Only `tin-hoc-quoc-te` has real copy from the design; the other groups use bracketed placeholders.
import { PROGRAMS, type Program } from '@/data/site';

export type Topic = 'all' | 'quocte' | 'mos' | 'mos3';
export type Course = {
  slug: string; title: string; level: string; text: string; facts: string; photo: string; tag: string; topic: Topic;
  heroFacts: { label: string; value: string }[];
  overviewTitle: string; overview: string; targets: string[];
  modules: { title: string; text: string }[];
  levels: { title: string; text: string }[];
  examIntro: string; benefits: string[];
  examRows: { label: string; value: string }[];
  faqs: { q: string; a: string }[];
};
export type Stage = { month: string; title: string; text: string; chips: string[] };
export type Teacher = { name: string; years: string; role: string; certs: string[]; quote: string };
export type Group = {
  topic: Topic;
  why: { title: string; text: string }[];
  whyEyebrow: string; whyTitle: string; whyText: string;
  coursesTitle: string;
  courses: Course[];
  steps: { month: string; title: string; text: string }[];
  stepsTitle: string; stepsText: string;
  certsTitle: string; certsHeading: string; certsText: string; certs: { title: string; text: string }[];
  ctaTitle: string; ctaText: string;
  roadmap: {
    title: string; text: string; eyebrow: string; heading: string; lead: string; stages: Stage[];
    rows: { stage: string; time: string; focus: string; check: string; out: string }[];
    ctaTitle: string; ctaText: string;
  };
  teachersHeading: string; teachersLead: string;
  teachers: Teacher[];
  standards: { title: string; text: string }[];
};

export const WHY_ICONS = [
  'M12 3a5 5 0 1 0 0 10a5 5 0 0 0 0-10z M9 12.5L8 21l4-2l4 2l-1-8.5',
  'M5 21V4 M5 4h11l-2 4l2 4H5',
  'M3 5h18v11H3z M8 20h8 M12 16v4',
  'M5 12l5 5l9-10',
];
export const STANDARD_ICONS = [
  WHY_ICONS[0],
  WHY_ICONS[2],
  'M12 3l8 3v6c0 4.5-3.2 8-8 9c-4.8-1-8-4.5-8-9V6z M9 12l2 2l4-4',
];

const teacher = (): Teacher => ({ name: '[TÊN GIÁO VIÊN]', years: '[SỐ NĂM]', role: '[CHỨC DANH]', certs: ['[CHỨNG CHỈ]', '[CHỨNG CHỈ]'], quote: '[CÂU TRÍCH / TRIẾT LÝ GIẢNG DẠY]' });
const teachers8 = () => Array.from({ length: 8 }, teacher);
const standards = (third: string) => [
  { title: 'Giảng viên chuyên gia', text: 'Đội ngũ giảng viên giàu kinh nghiệm thực chiến, có chứng chỉ sư phạm quốc tế và tận tâm với học viên.' },
  { title: 'Thực hành chuyên sâu', text: 'Thời lượng thực hành chiếm 70%, học trên dự án thực tế giúp học viên thành thạo kỹ năng ngay tại lớp.' },
  { title: 'Chứng chỉ uy tín', text: third },
];
const faqs = (first: { q: string; a: string }) => [
  first,
  { q: '[CÂU HỎI THƯỜNG GẶP 2]', a: '[CÂU TRẢ LỜI – ERG CUNG CẤP]' },
  { q: '[CÂU HỎI THƯỜNG GẶP 3]', a: '[CÂU TRẢ LỜI – ERG CUNG CẤP]' },
];

function placeholderCourse(p: Program, slug: string, over: Partial<Course> = {}): Course {
  return {
    slug, title: '[Tên khóa học]', level: '[Đối tượng]', text: '[Mô tả ngắn khóa học]', facts: '[Thông tin nhanh]', photo: 'Ảnh: lớp học', tag: p.title, topic: 'all',
    heroFacts: [{ label: 'Đối tượng', value: '[ĐỐI TƯỢNG]' }, { label: 'Cấp độ', value: '[CẤP ĐỘ]' }, { label: 'Thời lượng', value: '[THỜI LƯỢNG]' }, { label: 'Học phí', value: '[HỌC PHÍ]' }],
    overviewTitle: '[Tiêu đề tổng quan khóa học]', overview: '[Mô tả tổng quan khóa học]',
    targets: ['[ĐỐI TƯỢNG HỌC VIÊN 1]', '[ĐỐI TƯỢNG HỌC VIÊN 2]', '[ĐỐI TƯỢNG HỌC VIÊN 3]'],
    modules: [1, 2, 3].map((i) => ({ title: `[Mô-đun ${i}]`, text: '[Mô tả mô-đun]' })),
    levels: [1, 2, 3].map((i) => ({ title: `[Cấp độ ${i}]`, text: '[Mô tả cấp độ]' })),
    examIntro: '[Thông tin kỳ thi và chứng chỉ – ERG cung cấp]', benefits: ['[Quyền lợi 1]', '[Quyền lợi 2]', '[Quyền lợi 3]'],
    examRows: [{ label: 'Đơn vị cấp chứng chỉ', value: '[ĐƠN VỊ CẤP]' }, { label: 'Lệ phí thi', value: '[LỆ PHÍ THI]' }, { label: 'Lịch thi gần nhất', value: '[NGÀY THI]' }],
    faqs: faqs({ q: '[CÂU HỎI THƯỜNG GẶP 1]', a: '[CÂU TRẢ LỜI – ERG CUNG CẤP]' }),
    ...over,
  };
}

function placeholderGroup(p: Program): Group {
  const stages: Stage[] = [1, 2, 3, 4].map((i) => ({ month: '[THỜI GIAN]', title: `[Giai đoạn ${i}]`, text: '[Mô tả giai đoạn]', chips: ['[Nội dung]'] }));
  return {
    topic: 'all',
    why: WHY_ICONS.map((_, i) => ({ title: `[Lý do ${i + 1}]`, text: '[Mô tả lý do]' })),
    whyEyebrow: 'Vì sao chọn chương trình', whyTitle: '[Tiêu đề điểm nổi bật]', whyText: p.text,
    coursesTitle: '[Tiêu đề nhóm khóa học]',
    courses: [placeholderCourse(p, 'khoa-hoc-1', { text: p.short })],
    steps: stages.map(({ month, title, text }) => ({ month, title, text })),
    stepsTitle: '[Tiêu đề lộ trình]', stepsText: '[Mô tả lộ trình]',
    certsTitle: 'Chứng chỉ và kỳ thi', certsHeading: '[Tiêu đề chứng chỉ]', certsText: '[Mô tả chứng chỉ và kỳ thi – ERG cung cấp]',
    certs: [1, 2, 3].map((i) => ({ title: `[Chứng chỉ ${i}]`, text: '[Mô tả chứng chỉ]' })),
    ctaTitle: 'Kiểm tra năng lực đầu vào miễn phí', ctaText: 'ERG tư vấn lộ trình cá nhân hóa theo độ tuổi, nền tảng và mục tiêu chứng chỉ của bạn.',
    roadmap: {
      title: `Lộ trình đào tạo ${p.title}`, text: '[Mô tả lộ trình đào tạo]', eyebrow: '[Số mốc] trong lộ trình', heading: '[Tiêu đề lộ trình]', lead: '[Mô tả mục tiêu từng giai đoạn]', stages,
      rows: [1, 2, 3, 4].map((i) => ({ stage: `[Giai đoạn ${i}]`, time: '[THỜI GIAN]', focus: '[TRỌNG TÂM]', check: '[ĐÁNH GIÁ]', out: '[KẾT QUẢ ĐẦU RA]' })),
      ctaTitle: 'Nhận lộ trình phù hợp với con bạn', ctaText: 'ERG kiểm tra năng lực đầu vào miễn phí và tư vấn lộ trình cá nhân hóa theo độ tuổi và mục tiêu chứng chỉ.',
    },
    teachersHeading: `Giáo viên ${p.title}`, teachersLead: '[Giới thiệu đội ngũ giáo viên của nhóm chương trình]',
    teachers: teachers8(),
    standards: standards('[Mô tả chứng chỉ – ERG cung cấp]'),
  };
}

const quocte: Group = (() => {
  const p = PROGRAMS[0];
  const ic3 = (slug: string, title: string, level: string, text: string, facts: string, photo: string, certs: string[]) =>
    placeholderCourse(p, slug, {
      title, level, text, facts, photo, tag: 'Tin học quốc tế', topic: 'quocte',
      heroFacts: [{ label: 'Đối tượng', value: level }, { label: 'Cấp độ', value: facts }, { label: 'Thời lượng', value: '[THỜI LƯỢNG]' }, { label: 'Học phí', value: '[HỌC PHÍ]' }],
      overviewTitle: title, overview: text,
      levels: certs.map((c) => ({ title: c, text: '[Mô tả cấp độ]' })),
      examRows: [{ label: 'Đơn vị cấp chứng chỉ', value: 'Certiport (Hoa Kỳ)' }, { label: 'Lệ phí thi', value: '[LỆ PHÍ THI]' }, { label: 'Lịch thi gần nhất', value: '[NGÀY THI]' }],
    });
  const mos: Course = {
    slug: 'mos', title: 'Microsoft Office Specialist (MOS)', level: 'THPT & Đại học',
    text: 'Chứng chỉ tin học văn phòng quốc tế do Microsoft cấp, có giá trị sử dụng trên toàn cầu.',
    facts: 'Word · Excel · PowerPoint · Outlook · Access', photo: 'Ảnh: lớp học MOS', tag: 'Tin học văn phòng', topic: 'mos',
    heroFacts: [{ label: 'Đối tượng', value: 'THPT & Đại học' }, { label: 'Cấp độ', value: 'Specialist · Expert · Master' }, { label: 'Thời lượng', value: '[THỜI LƯỢNG]' }, { label: 'Học phí', value: '[HỌC PHÍ]' }],
    overviewTitle: 'Làm chủ bộ công cụ văn phòng của Microsoft',
    overview: 'MOS xác nhận kỹ năng sử dụng thành thạo từng ứng dụng văn phòng. Học viên học theo từng mô-đun, luyện thi trên phần mềm giả lập và thi chứng chỉ ngay tại ERG.',
    targets: ['Học sinh THPT và sinh viên cần chứng chỉ tin học văn phòng quốc tế.', 'Sinh viên cần đáp ứng chuẩn đầu ra tin học của nhà trường.', 'Người đi làm muốn ứng dụng Word, Excel, PowerPoint hiệu quả hơn trong công việc.', '[ĐỐI TƯỢNG BỔ SUNG – ERG XÁC NHẬN]'],
    modules: [
      { title: 'MOS Word', text: 'Soạn thảo, định dạng và xử lý văn bản chuyên nghiệp.' },
      { title: 'MOS Excel', text: 'Tính toán, phân tích và trình bày dữ liệu hiệu quả.' },
      { title: 'MOS PowerPoint', text: 'Thiết kế bài trình chiếu ấn tượng và trực quan.' },
      { title: 'MOS Outlook', text: 'Quản lý email, lịch biểu và thông tin cá nhân.' },
      { title: 'MOS Access', text: 'Hệ quản trị cơ sở dữ liệu, xây dựng và quản lý dữ liệu chuyên nghiệp.' },
    ],
    levels: [
      { title: 'MOS Specialist', text: 'Chứng chỉ cơ bản cho từng ứng dụng. Xác nhận kỹ năng sử dụng thành thạo.' },
      { title: 'MOS Expert', text: 'Cấp độ nâng cao dành cho Word và Excel, cho các tác vụ chuyên sâu.' },
      { title: 'MOS Master', text: 'Chứng chỉ cao nhất, dành cho người hoàn thành đủ 4 bài thi theo yêu cầu.' },
    ],
    examIntro: 'Chứng chỉ MOS có ba cấp độ. Lịch thi, lệ phí thi và hình thức thi do ERG thông báo theo từng đợt.',
    benefits: ['Ưu tiên xét tuyển Đại học', 'Chuẩn đầu ra sinh viên', 'Ứng dụng thực tế trong công việc'],
    examRows: [{ label: 'Đơn vị cấp chứng chỉ', value: 'Microsoft' }, { label: 'Lệ phí thi', value: '[LỆ PHÍ THI]' }, { label: 'Lịch thi gần nhất', value: '[NGÀY THI]' }],
    faqs: faqs({ q: 'MOS Master cần những điều kiện gì?', a: 'MOS Master là chứng chỉ cao nhất, dành cho người hoàn thành đủ 4 bài thi theo yêu cầu.' }),
  };
  return {
    topic: 'quocte',
    why: [
      { title: 'Chuẩn quốc tế do Certiport cấp', text: 'Chứng chỉ được công nhận toàn cầu, là thước đo năng lực công nghệ rõ ràng cho học sinh và người đi làm.' },
      { title: 'Lộ trình theo năm học', text: 'Chương trình học kỳ 1, học kỳ 2 theo khung chuẩn của bộ môn Tin học quốc tế, có mốc đánh giá rõ ràng.' },
      { title: 'Làm quen phần mềm thi Gmetrix', text: 'Học sinh thao tác trên phần mềm giả lập thi để chuẩn bị tâm lý vững vàng trước kỳ thi thật.' },
      { title: 'Kiểm tra đầu vào miễn phí', text: 'Kiểm tra năng lực đầu vào miễn phí và tư vấn lộ trình cá nhân hóa trước khi đăng ký.' },
    ],
    whyEyebrow: 'Vì sao chọn chương trình', whyTitle: 'Chứng chỉ chuẩn Certiport, lộ trình theo năm học',
    whyText: 'Học viên được dẫn dắt từng bước: học chương trình, làm quen phần mềm thi, đánh giá năng lực hai lần rồi luyện thi nước rút trước kỳ thi chứng chỉ.',
    coursesTitle: 'Ba chứng chỉ, ba độ tuổi',
    courses: [
      mos,
      ic3('ic3-gs6', 'IC3 GS6', 'THCS', 'Chuẩn hóa năng lực công nghệ thông tin theo tiêu chuẩn toàn cầu mới nhất do Certiport (Hoa Kỳ) cấp.', '3 cấp độ · 7 chuyên đề trọng tâm', 'Ảnh: lớp học IC3 GS6', ['IC3 GS6 – Level 1', 'IC3 GS6 – Level 2', 'IC3 GS6 – Level 3']),
      ic3('ic3-spark-gs6', 'IC3 Spark GS6', 'Tiểu học', 'Chứng chỉ tin học quốc tế khởi đầu cho trẻ em, xây nền tảng công nghệ đúng đắn và an toàn từ bậc Tiểu học.', '6 – 11 tuổi · Offline / Online', 'Ảnh: lớp học IC3 Spark', ['IC3 Spark GS6 – Level 1', 'IC3 Spark GS6 – Level 2']),
    ],
    steps: [
      { month: 'Tháng 9 – 10', title: 'Khởi động năm học', text: 'Bắt đầu giảng dạy nội dung chương trình học kỳ 1 theo khung chuẩn.' },
      { month: 'Tháng 11 – 12', title: 'Làm quen công cụ thi và đánh giá lần 1', text: 'Làm quen Gmetrix, ôn luyện đề chuẩn và phân loại năng lực.' },
      { month: 'Tháng 1 – đầu tháng 3', title: 'Chương trình học kỳ 2 và đánh giá lần 2', text: 'Tiếp tục chương trình, tổng kiểm tra kiến thức toàn diện.' },
      { month: 'Tháng 3 – 5', title: 'Luyện thi nước rút và thi chứng chỉ', text: 'Phân loại, tổng ôn, thi thử vào tháng 4 và thi chứng chỉ vào tháng 5.' },
    ],
    stepsTitle: 'Từ khởi động năm học đến kỳ thi tháng 5', stepsText: 'Bốn giai đoạn chính trong một năm học. Xem chi tiết từng mốc ở trang lộ trình.',
    certsTitle: 'Chứng chỉ và kỳ thi', certsHeading: 'Thi chứng chỉ quốc tế ngay tại ERG',
    certsText: 'Học viên luyện thi trên phần mềm giả lập Gmetrix, được kiểm tra năng lực định kỳ và thi chứng chỉ vào tháng 5. Chứng chỉ do Microsoft và Certiport (Hoa Kỳ) cấp, có giá trị toàn cầu.',
    certs: [
      { title: 'MOS Specialist · Expert · Master', text: 'Ba cấp độ, từ chứng chỉ cơ bản từng ứng dụng đến Master khi hoàn thành đủ 4 bài thi.' },
      { title: 'IC3 GS6 – Level 1, 2, 3', text: 'Bảy chuyên đề năng lực số, do Certiport (Hoa Kỳ) cấp, giá trị vĩnh viễn trên toàn cầu.' },
      { title: 'IC3 Spark GS6 – Level 1, 2', text: 'Khái niệm cơ bản và kỹ năng thực hành dành cho học sinh Tiểu học.' },
    ],
    ctaTitle: 'Kiểm tra năng lực đầu vào miễn phí', ctaText: 'ERG tư vấn lộ trình cá nhân hóa theo độ tuổi, nền tảng và mục tiêu chứng chỉ của bạn.',
    roadmap: {
      title: 'Lộ trình đào tạo Tin học Quốc tế theo năm học',
      text: 'Học chương trình học kỳ 1 và học kỳ 2, làm quen phần mềm thi Gmetrix, đánh giá hai lần, luyện thi nước rút và thi chứng chỉ vào tháng 5.',
      eyebrow: 'Chín mốc trong một năm học', heading: 'Từ tháng 9 đến kỳ thi tháng 5',
      lead: 'Mỗi giai đoạn có mục tiêu và đầu ra riêng, giúp học sinh và phụ huynh theo dõi được tiến độ chuẩn bị cho kỳ thi chứng chỉ.',
      stages: [
        { month: 'Tháng 9 – 10', title: 'Khởi động năm học', text: 'Bắt đầu giảng dạy nội dung chương trình học kỳ 1 theo khung chương trình chuẩn của bộ môn Tin học quốc tế.', chips: ['Chương trình học kỳ 1', 'Khung chuẩn'] },
        { month: 'Tháng 11', title: 'Làm quen công cụ thi', text: 'Học sinh làm quen, nắm rõ thao tác phần mềm giả lập thi Gmetrix để chuẩn bị tâm lý vững vàng.', chips: ['Gmetrix', 'Tâm lý thi'] },
        { month: 'Tháng 12', title: 'Đánh giá lần 1', text: 'Ôn luyện đề chuẩn. Kiểm tra đánh giá năng lực, phân loại học sinh để có phương án bồi dưỡng phù hợp.', chips: ['Đề chuẩn', 'Phân loại học sinh'] },
        { month: 'Tháng 1 – 2', title: 'Chương trình học kỳ 2', text: 'Tiếp tục giảng dạy nội dung chương trình học kỳ 2 theo khung chương trình chuẩn của bộ môn Tin học quốc tế.', chips: ['Chương trình học kỳ 2'] },
        { month: 'Đầu tháng 3', title: 'Đánh giá lần 2', text: 'Tổng kiểm tra kiến thức toàn diện. Phân loại học sinh lần cuối trước khi bước vào giai đoạn luyện thi nước rút.', chips: ['Tổng kiểm tra', 'Phân loại lần cuối'] },
        { month: 'Giữa tháng 3', title: 'Phân loại', text: 'Bước đầu của giai đoạn nước rút: xếp nhóm học sinh theo năng lực để ôn luyện đúng trọng tâm.', chips: ['Nước rút', 'Theo năng lực'] },
        { month: 'Cuối tháng 3', title: 'Tổng ôn', text: 'Hệ thống lại toàn bộ kiến thức và kỹ năng cần thiết cho bài thi chứng chỉ.', chips: ['Nước rút', 'Hệ thống kiến thức'] },
        { month: 'Tháng 4', title: 'Thi thử', text: 'Thi thử trên môi trường giả lập để làm quen áp lực phòng thi trước kỳ thi chính thức.', chips: ['Nước rút', 'Môi trường giả lập'] },
        { month: 'Tháng 5', title: 'Thi chứng chỉ', text: 'Học sinh dự thi chứng chỉ quốc tế MOS, IC3 GS6 hoặc IC3 Spark GS6 theo chuẩn Certiport.', chips: ['MOS', 'IC3 GS6', 'IC3 Spark GS6'] },
      ],
      rows: [
        { stage: 'Học kỳ 1', time: 'Tháng 9 – 12', focus: 'Chương trình học kỳ 1, làm quen Gmetrix', check: 'Đánh giá lần 1 (tháng 12)', out: 'Nền tảng kiến thức và phân loại học sinh' },
        { stage: 'Học kỳ 2', time: 'Tháng 1 – đầu tháng 3', focus: 'Chương trình học kỳ 2', check: 'Đánh giá lần 2 (đầu tháng 3)', out: 'Nắm chắc toàn bộ chương trình' },
        { stage: 'Luyện thi nước rút', time: 'Giữa tháng 3 – tháng 4', focus: 'Phân loại, tổng ôn, thi thử', check: 'Thi thử (tháng 4)', out: 'Sẵn sàng cho kỳ thi chứng chỉ' },
        { stage: 'Thi chứng chỉ', time: 'Tháng 5', focus: 'Dự thi MOS, IC3 GS6 hoặc IC3 Spark GS6', check: 'Kỳ thi chính thức', out: 'Chứng chỉ quốc tế do Microsoft hoặc Certiport cấp' },
      ],
      ctaTitle: 'Nhận lộ trình phù hợp với con bạn', ctaText: 'ERG kiểm tra năng lực đầu vào miễn phí và tư vấn lộ trình cá nhân hóa theo độ tuổi và mục tiêu chứng chỉ.',
    },
    teachersHeading: 'Giáo viên luyện thi IC3 GS6, IC3 Spark và MOS',
    teachersLead: 'Gặp gỡ đội ngũ giáo viên ERG phụ trách luyện thi IC3 GS6, IC3 Spark và MOS, đồng hành cùng học viên từ làm quen công cụ thi đến khi hoàn thành chứng chỉ quốc tế.',
    teachers: teachers8(),
    standards: standards('Hỗ trợ thi và cấp các chứng chỉ Quốc tế (MOS, IC3) và Quốc gia, có giá trị trọn đời trên toàn cầu.'),
  };
})();

export const GROUPS: Record<string, Group> = Object.fromEntries(
  PROGRAMS.map((p) => [p.slug, p.slug === 'tin-hoc-quoc-te' ? quocte : placeholderGroup(p)]),
);
export const programOf = (slug: string) => PROGRAMS.find((p) => p.slug === slug)!;
