
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




export type JobStatusType = 'hot' | 'new' | 'urgent' | 'expired' | 'normal';

export interface JobItem {
    id: number;
    title: string;
    salary: string;
    quantity: string;
    workSchedule: string;
    deadline: string;
    requirements: string[];
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
    location: string;
    requirements: string[];
    status: JobStatusType; // <--- THÊM DÒNG NÀY
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
    status: JobStatusType; // <--- THÊM DÒNG NÀY
}

export interface EmployerInfo {
    name: string;
    nameOfOrganization: string;
    tax: string;
    mainAddress: string;
    location: string;
    fieldOfActivity: string[];
}