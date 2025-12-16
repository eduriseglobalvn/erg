import { Course, NavItem, NewsItem, Teacher, Testimonial, RoadmapSection } from '@/mocks/types';
import { ShieldCheck, UserCheck, FileText, Monitor, Sun, MessageCircle } from 'lucide-react';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Trang chủ', path: '/' },
  { label: 'Giới thiệu', path: '/gioi-thieu' },
  { label: 'Khóa học', path: '/khoa-hoc' },
  { label: 'Lộ trình', path: '/lo-trinh' },
  { label: 'Đội ngũ giáo viên', path: '/giao-vien' },
  { label: 'Tin tức', path: '/tin-tuc' },
  { label: 'Liên hệ', path: '/lien-he' },
  { label: 'Tuyển dụng', path: '/tuyen-dung' },
];

export const HERO_SLIDES = [
  {
    image: '/unnamed.webp',
    title: 'Khơi dậy tiềm năng - Vươn tới thành công',
    subtitle: 'Môi trường giáo dục hiện đại, sáng tạo giúp học sinh phát triển toàn diện.',
  },
  {
    image: '/unnamed.webp',
    title: 'Đội ngũ giáo viên tâm huyết',
    subtitle: 'Chúng tôi đồng hành cùng sự phát triển của con em bạn.',
  },
];

export const COURSES: Course[] = [
  {
    id: 'c1',
    title: 'Tin Học văn phòng Cơ Bản',
    category: 'Tin học',
    grade: 'Mọi lứa tuổi',
    description: 'Thành thạo kỹ năng tin học văn phòng cần thiết cho học tập và công việc.',
    image: '/anhkhoahoc/gs6lv1.png',
    duration: '15 tuần - 45 buổi',
    students: 120,
    format: 'Online & Offline',
    curriculum: [
      'Giáo trình Máy tính cơ bản',
      'Giáo trình soạn thảo văn bản hành chính cơ bản',
      'Giáo Trình Bảng Tính Excel cơ bản',
      'Giáo trình Thuyết trình với PowerPoint'
    ]
  },
  {
    id: 'c2',
    title: 'Tin Học văn phòng nâng cao',
    category: 'Tin học',
    grade: 'THCS & Sinh viên',
    description: 'Thành thạo kỹ năng tin học văn phòng cần thiết cho học tập và công việc.',
    image: '/anhkhoahoc/gs6lv2.png',
    duration: '20 tuần - 60 buổi',
    students: 250,
    format: 'Offline',
    curriculum: [
      'Giáo trình Máy tính nâng cao',
      'Giáo trình Word nâng cao',
      'Giáo Trình Bảng Tính Excel Nâng Cao'
    ]
  },
  {
    id: 'c3',
    title: 'Tin Học văn phòng Chuyên Sâu',
    category: 'Tin học',
    grade: 'THCS & Sinh viên',
    description: 'Thành thạo kỹ năng tin học văn phòng cần thiết cho học tập và công việc.',
    image: '/anhkhoahoc/gs6lv3.png',
    duration: '3 tháng - 24 buổi',
    students: 85,
    format: 'Online & Offline',
    curriculum: [
      'Phương pháp tư duy số học',
      'Hình học trực quan sinh động',
      'Logic giải quyết vấn đề thực tế',
      'Luyện tập qua các trò chơi trí tuệ'
    ]
  },
  {
    id: 'c4',
    title: 'Tin Học Trẻ Em, Học Sinh',
    category: 'Tin học',
    grade: 'Lớp 10-12',
    description: 'Hệ thống kiến thức trọng tâm, chiến thuật làm bài thi hiệu quả.',
    image: '/anhkhoahoc/gs6lv3.png',
    duration: '4 tháng - 32 buổi',
    students: 90,
    format: 'Offline',
    curriculum: [
      'Giáo trình lập trình Scratch',
      'Giáo trình ứng dụng tin học cơ bản',
      'Giáo trình ứng dụng tin học nâng cao',
      'Giáo trình lập trình Python cho trẻ em'
    ]
  }
];

export const TEACHERS: Teacher[] = [
  {
    id: 't1',
    name: 'Ngô Xuân Trúc',
    subject: 'Tin học',
    image: '/teacher/ngoxuantruc.png',
    bio: '10 năm kinh nghiệm giảng dạy tại các trường chuyên, tác giả nhiều đầu sách tham khảo.',
  },
  {
    id: 't2',
    name: 'Trần Tướng Tuấn',
    subject: 'Tin học',
    image: '/teacher/trantuongtuan.jpg',
    bio: 'IELTS 8.5, phương pháp giảng dạy hiện đại, truyền cảm hứng.',
  },
  {
    id: 't3',
    name: 'Trần Quốc Vương',
    subject: 'Tin học',
    image: '/teacher/tranquocvuong.jpg',
    bio: 'Chuyên gia luyện thi Olympic, nhiệt huyết và tận tâm với học sinh.',
  },
  {
    id: 't4',
    name: 'Trần Thanh Nhã',
    subject: 'Tin học',
    image: '/teacher/tranthanhnha.png',
    bio: 'Chuyên gia luyện thi Olympic, nhiệt huyết và tận tâm với học sinh.',
  },
];

// export const TESTIMONIALS: Testimonial[] = [
//   {
//     id: 'ts1',
//     name: 'Phạm Minh H',
//     role: 'Học sinh lớp 12',
//     content: 'Nhờ thầy cô tại ERG, em đã tự tin hơn rất nhiều và đỗ vào trường đại học mơ ước.',
//     avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
//   },
//   {
//     id: 'ts2',
//     name: 'Chị Nguyễn Thu Thảo',
//     role: 'Phụ huynh',
//     content: 'Môi trường học tập rất tốt, cơ sở vật chất hiện đại. Tôi rất yên tâm khi gửi con theo học tại đây.',
//     avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
//   },
// ];

export const NEWS: NewsItem[] = [
  {
    id: 'n1',
    title: 'Lễ tổng kết năm học 2023-2024',
    date: '25/05/2024',
    summary: 'Một năm học đầy cảm xúc và thành công rực rỡ của thầy và trò hệ thống giáo dục ERG.',
    image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'n2',
    title: 'Khai giảng khóa luyện thi cấp tốc',
    date: '01/06/2024',
    summary: 'Chuẩn bị hành trang tốt nhất cho kỳ thi chuyển cấp quan trọng sắp tới.',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'n3',
    title: 'Hội thảo: Đồng hành cùng con vào lớp 10',
    date: '15/06/2024',
    summary: 'Chia sẻ kinh nghiệm, giải đáp thắc mắc cho phụ huynh và học sinh.',
    image: 'https://images.unsplash.com/photo-1544531696-32269279a071?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
];
export const ROADMAP_DATA: RoadmapSection[] = [
  {
    id: 1,
    title: '1. CHƯƠNG TRÌNH CHO NGƯỜI MỚI BẮT ĐẦU',
    items: [
      'Máy tính cơ bản cho người mới bắt đầu',
      'Soạn thảo văn bản Word cơ bản',
      'Bảng tính Excel cơ bản'
    ]
  },
  {
    id: 2,
    title: '2. TIN HỌC VĂN PHÒNG CƠ BẢN',
    items: [
      'Máy tính cơ bản',
      'Soạn thảo văn bản hành chính',
      'Excel cơ bản',
      'Thuyết trình với PowerPoint'
    ]
  },
  {
    id: 3,
    title: '3. TIN HỌC VĂN PHÒNG NÂNG CAO',
    items: [
      'Máy tính nâng cao',
      'Word nâng cao',
      'Excel nâng cao'
    ]
  },
  {
    id: 4,
    title: '4. TIN HỌC VĂN PHÒNG CHUYÊN SÂU',
    items: [
      'Excel chuyên sâu',
      'Lập trình VBA Excel',
      'Tổng hợp & phân tích dữ liệu với Pivot Table',
      'Power Query'
    ]
  },
  {
    id: 5,
    title: '5. TIN HỌC TRẺ EM – HỌC SINH',
    items: [
      'Lập trình Scratch',
      'Ứng dụng tin học cơ bản',
      'Ứng dụng tin học nâng cao',
      'Lập trình Python cho trẻ em'
    ]
  },
  {
    id: 6,
    title: '6. TIN HỌC QUỐC TẾ',
    items: [
      'Chương trình được xây dựng theo chuẩn IC3-Spark, IC3 và MOS, giúp học sinh đủ năng lực thi chứng chỉ quốc tế.'
    ]
  }
];
export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'ts1',
    name: 'Phạm Minh H',
    role: 'Học sinh lớp 12',
    content: 'Nhờ thầy cô tại ERG, em đã tự tin hơn rất nhiều và đỗ vào trường đại học mơ ước. Môi trường học tập rất thân thiện và chuyên nghiệp.',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'ts2',
    name: 'Chị Nguyễn Thu Thảo',
    role: 'Phụ huynh học sinh',
    content: 'Tôi rất yên tâm khi gửi con theo học tại ERG. Các con không chỉ được học kiến thức mà còn được rèn luyện kỹ năng mềm rất tốt.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'ts3',
    name: 'Lê Văn Nam',
    role: 'Sinh viên ĐH Bách Khoa',
    content: 'Khóa học Excel chuyên sâu đã giúp mình xử lý dữ liệu nhanh chóng, phục vụ rất tốt cho đồ án tốt nghiệp và công việc sau này.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'ts4',
    name: 'Lê Văn Linh',
    role: 'Sinh viên ĐH Kinh Tế',
    content: 'Khóa học Excel chuyên sâu đã giúp mình xử lý dữ liệu nhanh chóng, phục vụ rất tốt cho đồ án tốt nghiệp và công việc sau này.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
  },
];
export const TRAINING_GOALS = [
  'Thành thạo kỹ năng máy tính và tin học văn phòng',
  'Tăng năng suất làm việc và khả năng ứng dụng thực tế',
  'Chuẩn bị kiến thức vững chắc để thi chứng chỉ quốc tế',
  'Phát triển tư duy và kỹ năng công nghệ cho học sinh'
];

export const WHY_CHOOSE_US = [
  {
    icon: ShieldCheck,
    title: 'Chương trình học bài bản',
    description: 'Lộ trình học được thiết kế chuyên nghiệp, từ cơ bản đến nâng cao, bám sát các tiêu chuẩn quốc tế hoặc nhu cầu thực tế',
    color: 'bg-blue-500'
  },
  {
    icon: UserCheck,
    title: 'Giáo viên chuyên môn cao',
    description: 'Đội ngũ giáo viên là chuyên gia, có kinh nghiệm thực tế, giúp bạn học được kiến thức sát với công việc.',
    color: 'bg-blue-500'
  },
  {
    icon: FileText,
    title: 'Tăng cơ hội việc làm và thăng tiến',
    description: 'Kỹ năng tin học, đặc biệt là tin học văn phòng (Word, Excel, PowerPoint) và các chứng chỉ quốc tế (MOS, IC3) là yêu cầu cơ bản của các công việc',
    color: 'bg-blue-500'
  },
  {
    icon: Monitor,
    title: 'Cơ sở vật chất hiện đại',
    description: 'Được cung cấp máy tính và các trang thiết bị học tập phù hợp, tiện nghi.',
    color: 'bg-blue-500'
  },
  {
    icon: Sun,
    title: 'Thời gian học linh hoạt',
    description: 'Cho phép bạn lựa chọn hoặc tự sắp xếp lịch học phù hợp với thời gian rảnh, không làm ảnh hưởng đến công việc hoặc tập hiện tại.',
    color: 'bg-blue-500'
  },
  {
    icon: MessageCircle,
    title: 'Hỗ trợ và tương tác',
    description: 'Dễ dàng trao đổi, hỏi đáp và nhận được sự hỗ trợ nhiệt tình từ giáo viên và trung tâm trong suốt quá trình học, thậm chí cả sau khi kết thúc khóa học.',
    color: 'bg-blue-500'
  }
];