import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  BrainCircuit,
  FileSpreadsheet,
  FileText,
  FolderKanban,
  Globe,
  Layout,
  LibraryBig,
  MessageSquareText,
  Presentation,
  Search,
  Sparkles,
  Users,
  Video,
  Zap,
} from "lucide-react";

export type CourseColor = "blue" | "red" | "indigo" | "emerald";

export type CourseModule = {
  name: string;
  href: string;
  icon: LucideIcon;
};

export type CourseProgram = {
  name: string;
  slug: string;
  color: CourseColor;
  badge: string;
  summary: string;
  href: string;
  items: CourseModule[];
};

export type CourseGroup = {
  title: string;
  description: string;
  programs: CourseProgram[];
};

export type QuickAccessItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  description: string;
};

export type ProgramDetail = {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  accent: CourseColor;
  stats: Array<{ label: string; value: string }>;
  modules: Array<{ title: string; detail: string; duration: string }>;
  resources: Array<{ title: string; type: string; detail: string }>;
  workflow: Array<{ title: string; detail: string }>;
  support: Array<{ title: string; detail: string }>;
};

export type HubCollection = {
  title: string;
  subtitle: string;
  metric: string;
  href: string;
  tags: string[];
};

export type CommunityChannel = {
  title: string;
  summary: string;
  cadence: string;
  href: string;
};

export type PortfolioStream = {
  title: string;
  summary: string;
  volume: string;
  href: string;
};

export type QuizTrack = {
  title: string;
  summary: string;
  questionCount: string;
  href: string;
};

export const COURSE_GROUPS: CourseGroup[] = [
  {
    title: "Chứng chỉ quốc tế",
    description: "Các chương trình cốt lõi dành cho lớp học tin học chuẩn Certiport.",
    programs: [
      {
        name: "IC3 GS6",
        slug: "ic3-gs6",
        color: "blue",
        badge: "Core",
        summary: "Bộ kỹ năng số nền tảng cho học sinh và giáo viên triển khai chương trình chính khóa.",
        href: "/chuong-trinh/ic3-gs6",
        items: [
          { name: "Computing Fundamentals", href: "/chuong-trinh/ic3-gs6#computing-fundamentals", icon: Zap },
          { name: "Key Applications", href: "/chuong-trinh/ic3-gs6#key-applications", icon: Layout },
          { name: "Living Online", href: "/chuong-trinh/ic3-gs6#living-online", icon: Globe },
        ],
      },
      {
        name: "IC3 Spark",
        slug: "ic3-spark",
        color: "red",
        badge: "Junior",
        summary: "Lộ trình nhập môn công nghệ nhẹ hơn cho nhóm học sinh nhỏ tuổi và lớp khởi động.",
        href: "/chuong-trinh/ic3-spark",
        items: [
          { name: "Digital Discovery", href: "/chuong-trinh/ic3-spark#digital-discovery", icon: Zap },
          { name: "Creative Projects", href: "/chuong-trinh/ic3-spark#creative-projects", icon: Layout },
          { name: "Online Safety", href: "/chuong-trinh/ic3-spark#online-safety", icon: Globe },
        ],
      },
      {
        name: "MOS Master",
        slug: "mos",
        color: "indigo",
        badge: "Office",
        summary: "Kho tài nguyên Word, Excel, PowerPoint phục vụ giảng dạy và luyện thi chứng chỉ văn phòng.",
        href: "/chuong-trinh/mos",
        items: [
          { name: "Word Specialist", href: "/chuong-trinh/mos#word-specialist", icon: FileText },
          { name: "Excel Specialist", href: "/chuong-trinh/mos#excel-specialist", icon: FileSpreadsheet },
          { name: "PowerPoint", href: "/chuong-trinh/mos#powerpoint", icon: Presentation },
        ],
      },
    ],
  },
  {
    title: "AI và kỹ năng mới",
    description: "Nhóm nội dung mở rộng để hệ thống còn tiếp tục thêm các khoá công nghệ mới sau này.",
    programs: [
      {
        name: "AI & Programming",
        slug: "tech",
        color: "emerald",
        badge: "New",
        summary: "Tài liệu AI ứng dụng, tư duy lập trình và các chuyên đề kỹ năng số cho giáo viên.",
        href: "/chuong-trinh/tech",
        items: [
          { name: "Scratch Programming", href: "/chuong-trinh/tech#scratch-programming", icon: BookOpen },
          { name: "Python for Beginners", href: "/chuong-trinh/tech#python-for-beginners", icon: BookOpen },
          { name: "AI Tools for Teachers", href: "/chuong-trinh/tech#ai-tools-for-teachers", icon: Sparkles },
        ],
      },
    ],
  },
];

export const QUICK_ACCESS_NAV: QuickAccessItem[] = [
  {
    label: "Kho học liệu",
    href: "/kho-hoc-lieu",
    icon: LibraryBig,
    description: "Slide, worksheet và đề mô phỏng",
  },
  {
    label: "Cộng đồng",
    href: "/cong-dong",
    icon: Users,
    description: "Kết nối giảng viên và chia sẻ kinh nghiệm",
  },
  {
    label: "Portfolio",
    href: "/portfolio",
    icon: FolderKanban,
    description: "Bộ bài giảng và mẫu triển khai",
  },
  {
    label: "Quizzes",
    href: "/quizzes",
    icon: BrainCircuit,
    description: "Kho câu hỏi và bài đánh giá nhanh",
  },
];

export const FLAT_PROGRAMS = COURSE_GROUPS.flatMap((group) => group.programs);
export const TOTAL_LESSON_SHELVES = FLAT_PROGRAMS.reduce((total, program) => total + program.items.length, 0);

export const HUB_COLLECTIONS: HubCollection[] = [
  {
    title: "SmartLibrary môn MOS",
    subtitle: "Bộ slide, handout, template và bài luyện thi theo từng exam objective.",
    metric: "182 tài nguyên",
    href: "/kho-hoc-lieu",
    tags: ["Word", "Excel", "PowerPoint"],
  },
  {
    title: "Lesson Kit cho IC3",
    subtitle: "Giáo án theo tiết, worksheet, quiz warm-up và rubrics đánh giá.",
    metric: "96 lesson kits",
    href: "/kho-hoc-lieu",
    tags: ["GS6", "Spark", "Digital Literacy"],
  },
  {
    title: "AI Teaching Pack",
    subtitle: "Prompt mẫu, demo project và hướng dẫn áp dụng AI vào lớp học thật.",
    metric: "48 playbooks",
    href: "/chuong-trinh/tech",
    tags: ["AI", "Python", "Scratch"],
  },
];

export const COMMUNITY_CHANNELS: CommunityChannel[] = [
  {
    title: "Teacher Forum",
    summary: "Không gian hỏi đáp bài giảng, chia sẻ lesson learned và cách xử lý lớp học thực tế.",
    cadence: "Mỗi ngày",
    href: "/cong-dong",
  },
  {
    title: "Mentor Circle",
    summary: "Nhóm mentor nội bộ review giáo án, chấm thử mock exam và đồng hành cùng giáo viên mới.",
    cadence: "Hàng tuần",
    href: "/cong-dong",
  },
  {
    title: "Resource Swap",
    summary: "Tủ chia sẻ worksheet, template kiểm tra, visual aids và mini game dạy học.",
    cadence: "Liên tục",
    href: "/cong-dong",
  },
];

export const PORTFOLIO_STREAMS: PortfolioStream[] = [
  {
    title: "Portfolio bài giảng theo module",
    summary: "Bộ bài giảng mẫu đã qua review, dùng để tham chiếu cách triển khai từng buổi học.",
    volume: "120 decks",
    href: "/portfolio",
  },
  {
    title: "Showcase lớp học",
    summary: "Case study từ lớp thật: mở bài, hoạt động nhóm, đánh giá cuối buổi và phản hồi học viên.",
    volume: "37 showcases",
    href: "/portfolio",
  },
  {
    title: "Template học liệu dùng chung",
    summary: "Mẫu giáo án, checklist, rubric và báo cáo tiến độ để nhân bản nhanh sang khóa mới.",
    volume: "64 templates",
    href: "/portfolio",
  },
];

export const QUIZ_TRACKS: QuizTrack[] = [
  {
    title: "Quiz Bank IC3",
    summary: "Ngân hàng câu hỏi warm-up, exit ticket và mock test cho từng strand của IC3.",
    questionCount: "1,240 câu",
    href: "/quizzes",
  },
  {
    title: "Quiz Bank MOS",
    summary: "Bộ câu hỏi kỹ thuật, bài tập thao tác và đề mô phỏng theo objective chính thức.",
    questionCount: "980 câu",
    href: "/quizzes",
  },
  {
    title: "AI & Coding Checks",
    summary: "Quick checks cho Scratch, Python căn bản và AI literacy theo hoạt động trên lớp.",
    questionCount: "410 câu",
    href: "/quizzes",
  },
];

export const PROGRAM_DETAILS: ProgramDetail[] = [
  {
    slug: "ic3-gs6",
    title: "IC3 GS6 Teaching Hub",
    eyebrow: "Digital Literacy Core",
    description: "Toàn bộ giáo án, slide, bài tập thực hành, câu hỏi warm-up và mock exam cho lộ trình IC3 GS6, tối ưu cho việc dạy theo tuần và theo năng lực.",
    accent: "blue",
    stats: [
      { label: "Lesson Packs", value: "36" },
      { label: "Mock Exams", value: "12" },
      { label: "Worksheet Sets", value: "58" },
    ],
    modules: [
      { title: "Computing Fundamentals", detail: "Cấu trúc máy tính, hệ điều hành, dữ liệu và tư duy thao tác căn bản.", duration: "4 tuần" },
      { title: "Key Applications", detail: "Soạn thảo, bảng tính, trình chiếu và kỹ năng xử lý tác vụ văn phòng.", duration: "5 tuần" },
      { title: "Living Online", detail: "Khai thác Internet, an toàn số, tìm kiếm thông tin và quyền riêng tư.", duration: "3 tuần" },
    ],
    resources: [
      { title: "Deck bài giảng theo tuần", type: "Slides", detail: "Mỗi tuần có bản full deck, bản rút gọn và gợi ý nhịp nói cho giáo viên." },
      { title: "Worksheet phân tầng", type: "Worksheets", detail: "Bộ bài tập chia theo lớp mạnh, lớp trung bình và nhóm cần hỗ trợ thêm." },
      { title: "Bộ đề mock & review", type: "Assessments", detail: "Đề luyện theo objective, rubric chấm nhanh và file phân tích lỗi thường gặp." },
    ],
    workflow: [
      { title: "Mở buổi học", detail: "Warm-up 5 phút bằng flash quiz hoặc demo tình huống số trong đời sống." },
      { title: "Dạy trọng tâm", detail: "Triển khai slide chính, hoạt động cặp đôi và checkpoint giữa buổi." },
      { title: "Khóa buổi học", detail: "Exit ticket, assignment về nhà và gợi ý tài liệu tự học tiếp theo." },
    ],
    support: [
      { title: "Coach notes", detail: "Ghi chú cho giáo viên về cách giải thích khái niệm khó, ví dụ gần gũi và câu hỏi phụ trợ." },
      { title: "Parent update template", detail: "Mẫu cập nhật tiến độ học tập để gửi phụ huynh hoặc điều phối viên." },
    ],
  },
  {
    slug: "ic3-spark",
    title: "IC3 Spark Classroom Lab",
    eyebrow: "Junior Digital Skills",
    description: "Kho hoạt động nhập môn công nghệ cho nhóm học sinh nhỏ tuổi với nhiều trò chơi lớp học, project mini và visual worksheet dễ triển khai.",
    accent: "red",
    stats: [
      { label: "Mini Projects", value: "24" },
      { label: "Visual Worksheets", value: "42" },
      { label: "Class Games", value: "18" },
    ],
    modules: [
      { title: "Digital Discovery", detail: "Làm quen thiết bị, thao tác cơ bản, thuật ngữ công nghệ dễ hiểu.", duration: "3 tuần" },
      { title: "Creative Projects", detail: "Hoạt động kể chuyện số, trình bày trực quan và project nhóm nhỏ.", duration: "4 tuần" },
      { title: "Online Safety", detail: "Nhận biết rủi ro mạng, ứng xử đúng và xây dựng thói quen số tích cực.", duration: "2 tuần" },
    ],
    resources: [
      { title: "Lesson storyboard", type: "Teaching Guide", detail: "Storyboard từng buổi với mục tiêu, đạo cụ cần chuẩn bị và thời lượng hoạt động." },
      { title: "Printable cards", type: "Printables", detail: "Flashcard, matching game và visual prompts dùng trực tiếp trong lớp." },
      { title: "Reflection sheet", type: "Student Reflection", detail: "Phiếu phản hồi sau tiết học giúp học sinh tự kể lại điều vừa làm được." },
    ],
    workflow: [
      { title: "Ice-breaker", detail: "Khởi động bằng trò chơi nhận diện biểu tượng, thiết bị hoặc thao tác đơn giản." },
      { title: "Hands-on demo", detail: "Giáo viên demo thật trên màn hình lớn, học sinh thực hành theo nhịp ngắn." },
      { title: "Gallery walk", detail: "Cuối buổi học sinh trình bày sản phẩm và giáo viên chốt lại kỹ năng đạt được." },
    ],
    support: [
      { title: "Classroom management", detail: "Mẹo chia nhóm, kiểm soát nhịp lớp và giữ sự tập trung của học sinh nhỏ tuổi." },
      { title: "Remedial pack", detail: "Gói học liệu đơn giản hơn cho các em cần thời gian làm quen thao tác máy tính." },
    ],
  },
  {
    slug: "mos",
    title: "MOS Master Resource Center",
    eyebrow: "Office Productivity Track",
    description: "Trung tâm bài giảng MOS dành cho Word, Excel và PowerPoint với bộ task file, scoring guide và portfolio ứng dụng thực tế cho người học.",
    accent: "indigo",
    stats: [
      { label: "Practice Files", value: "210" },
      { label: "Demo Videos", value: "64" },
      { label: "Exam Maps", value: "15" },
    ],
    modules: [
      { title: "Word Specialist", detail: "Định dạng tài liệu, styles, references và xử lý văn bản chuyên nghiệp.", duration: "4 tuần" },
      { title: "Excel Specialist", detail: "Công thức, biểu đồ, phân tích dữ liệu và các tình huống spreadsheet thực tế.", duration: "5 tuần" },
      { title: "PowerPoint", detail: "Thiết kế bài trình bày, layout, motion cơ bản và storytelling bằng slide.", duration: "3 tuần" },
    ],
    resources: [
      { title: "Task file banks", type: "Practice Files", detail: "Kho file thao tác theo chủ đề: hành chính, kinh doanh, báo cáo, giáo dục." },
      { title: "Scoring checklist", type: "Evaluation", detail: "Checklist chấm nhanh từng objective để giáo viên phản hồi ngay tại lớp." },
      { title: "Capstone projects", type: "Projects", detail: "Bài tập lớn cuối chặng để học viên gom kỹ năng thành sản phẩm thực tế." },
    ],
    workflow: [
      { title: "Skill breakdown", detail: "Mỗi buổi chia objective thành micro-skill để học viên thấy tiến bộ rõ ràng." },
      { title: "Live correction", detail: "So sánh file đúng/sai và hướng dẫn mẹo tránh lỗi thao tác thường gặp." },
      { title: "Capstone reflection", detail: "Chốt lại bằng portfolio task gắn với ngữ cảnh học tập hoặc công việc." },
    ],
    support: [
      { title: "Exam-day kit", detail: "Bộ lưu ý trước ngày thi, checklist thiết bị và mẹo phân bổ thời gian làm bài." },
      { title: "Office scenarios", detail: "Tình huống ứng dụng vào môi trường văn phòng để tăng tính thực tiễn." },
    ],
  },
  {
    slug: "tech",
    title: "AI & Programming Studio",
    eyebrow: "Future Skills Lab",
    description: "Không gian phát triển chuyên đề AI, Scratch, Python và tư duy dự án để giáo viên có thể dạy nhanh, cập nhật và ứng dụng ngay vào lớp học công nghệ.",
    accent: "emerald",
    stats: [
      { label: "Prompt Kits", value: "52" },
      { label: "Coding Labs", value: "28" },
      { label: "Project Briefs", value: "19" },
    ],
    modules: [
      { title: "Scratch Programming", detail: "Tư duy thuật toán căn bản, logic khối lệnh và mini game classroom-ready.", duration: "4 tuần" },
      { title: "Python for Beginners", detail: "Biến, điều kiện, vòng lặp và các bài lab nhập môn có kiểm thử nhanh.", duration: "5 tuần" },
      { title: "AI Tools for Teachers", detail: "Ứng dụng AI vào thiết kế bài giảng, feedback học viên và tạo học liệu nhanh.", duration: "2 tuần" },
    ],
    resources: [
      { title: "Prompt library", type: "AI Resources", detail: "Kho prompt theo vai trò: soạn giáo án, làm rubric, tạo worksheet và phản hồi bài làm." },
      { title: "Coding labs", type: "Hands-on Labs", detail: "Bài lab có input/output mẫu, checklist debug và extension challenge." },
      { title: "Project showcase", type: "Project Archive", detail: "Kho sản phẩm mẫu và khung đánh giá để triển khai project-based learning." },
    ],
    workflow: [
      { title: "Demo first", detail: "Bắt đầu bằng sản phẩm hoàn chỉnh để học viên thấy mục tiêu cuối buổi." },
      { title: "Build together", detail: "Dẫn từng bước có checkpoint ngắn để tránh lớp bị hụt theo nhịp." },
      { title: "Remix & extend", detail: "Mỗi buổi đều có gợi ý nâng cấp cho nhóm học nhanh hơn." },
    ],
    support: [
      { title: "Safe AI policy", detail: "Hướng dẫn sử dụng AI có trách nhiệm, trích dẫn rõ nguồn và kiểm tra độ tin cậy." },
      { title: "Facilitator notes", detail: "Note cho giáo viên về các lỗi code phổ biến và cách gỡ ngay tại lớp." },
    ],
  },
];

export const NOIBO_STATS = [
  { label: "Chứng chỉ hỗ trợ", value: "09+" },
  { label: "File trình chiếu chuẩn", value: "2.5k+" },
  { label: "Teacher packs", value: "360+" },
];

export const NOIBO_HERO_ACTIONS = [
  { label: "Khám phá chương trình", href: "/chuong-trinh", icon: Search },
  { label: "Mở portfolio", href: "/portfolio", icon: FolderKanban },
];

export const NOIBO_COMMUNITY_HIGHLIGHTS = [
  "Q&A theo môn và theo chứng chỉ",
  "Lịch mentor review bài giảng hàng tuần",
  "Kho topic thảo luận về vận hành lớp học",
];

export function getProgramBySlug(slug: string) {
  return COURSE_GROUPS.flatMap((group) => group.programs).find((program) => program.slug === slug);
}

export function getProgramDetailBySlug(slug: string) {
  return PROGRAM_DETAILS.find((program) => program.slug === slug);
}
