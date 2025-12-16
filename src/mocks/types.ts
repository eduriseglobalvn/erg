
export interface NavItem {
  label: string;
  path: string;
}

export interface Course {
  id: string;
  title: string;
  category: string;
  grade: string;
  description: string;
  image: string;
  duration: string;
  students: number;
  format?: string;
  curriculum?: string[];
}

export interface Teacher {
  id: string;
  name: string;
  subject: string;
  image: string;
  bio: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar: string;
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  summary: string;
  image: string;
}

export interface RoadmapSection {
  id: number;
  title: string;
  items: string[];
}

export interface JobItem {
    id: number;
    title: string;
    salary: string; // Mức lương: "8 - 20 triệu/tháng", "Thỏa thuận"
    quantity: string; // Số lượng: "1", "Không giới hạn"
    workSchedule: string; // Thời gian làm việc: "8h/ngày từ thứ Hai đến thứ Bảy"
    deadline: string; // Hạn nộp: "30/11/2024"
    requirements: string[]; // Điều kiện/yêu cầu công việc
    // Thông tin bổ sung để tạo độ chân thực
    location: string;
    descriptionShort: string;
    isUrgent: boolean;
}
export interface JobSummary {
    id: string;
    slug: string;
    title: string;
    salary: string;
    quantity: string;
    workSchedule: string;
    deadline: string;
    location: string; // Đã thêm location vào type này cho khớp với UI
    requirements: string[];
}

export interface JobDetail {
    employer: string;
    title: string;
    postDate: string;
    salary: string;
    quantity: string;
    workType: string;
    deadline: string;
    location: string;
    summary: string;
    jobDescription: string[];
    requirements: string[];
    benefits: string[];
    quickInfo: {
        location: string;
        position: string;
    };
}
export interface EmployerInfo {
    name: string;
    nameOfOrganization: string; //tên tổ chức
    tax: string;
    mainAddress: string;
    location: string;
    fieldOfActivity: string[];


}