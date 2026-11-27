// The design shows only bracketed placeholders for openings; replace with real data from the recruitment system.
export interface Job {
  slug: string;
  title: string;
  dept: string;
  type: string;
  place: string;
  deadline: string;
  salary: string;
  headcount: string;
  summary: string;
  desc: string[];
  reqs: string[];
  bens: string[];
}

const base = {
  title: '[VỊ TRÍ TUYỂN DỤNG]',
  dept: '[BỘ PHẬN]',
  type: '[HÌNH THỨC]',
  place: '[ĐỊA ĐIỂM]',
  deadline: '[HẠN NỘP]',
  salary: '[MỨC LƯƠNG]',
  headcount: '[SỐ LƯỢNG]',
  summary: '[TÓM TẮT VỊ TRÍ]',
  desc: ['[MÔ TẢ CÔNG VIỆC 1]', '[MÔ TẢ CÔNG VIỆC 2]', '[MÔ TẢ CÔNG VIỆC 3]'],
  reqs: ['[YÊU CẦU ỨNG VIÊN 1]', '[YÊU CẦU ỨNG VIÊN 2]', '[YÊU CẦU ỨNG VIÊN 3]'],
  bens: ['[QUYỀN LỢI 1]', '[QUYỀN LỢI 2]', '[QUYỀN LỢI 3]'],
};

export const JOBS: Job[] = [1, 2, 3, 4].map((n) => ({ ...base, slug: `vi-tri-tuyen-dung-${n}` }));

export const HIRING_STEPS = [
  { no: '1', title: 'Ứng tuyển', text: 'Ứng viên tìm hiểu vị trí và gửi hồ sơ CV.', textDetail: 'Gửi hồ sơ CV qua biểu mẫu trực tuyến.' },
  { no: '2', title: 'Sàng lọc hồ sơ', text: 'Bộ phận tuyển dụng chọn ứng viên phù hợp.', textDetail: 'Bộ phận tuyển dụng chọn ứng viên phù hợp.' },
  { no: '3', title: 'Kiểm tra năng lực', text: 'Đánh giá tư duy logic và kiến thức chuyên môn.', textDetail: 'Trực tuyến hoặc trực tiếp.' },
  { no: '4', title: 'Phỏng vấn', text: 'Gặp gỡ trực tiếp để đánh giá mức độ phù hợp.', textDetail: 'Gặp gỡ trực tiếp để đánh giá mức độ phù hợp.' },
  { no: '5', title: 'Thỏa thuận hợp đồng', text: 'Trao đổi chi tiết về lương và phúc lợi.', textDetail: 'Trao đổi chi tiết về lương và phúc lợi.' },
  { no: '6', title: 'Hoàn thiện hồ sơ', text: 'Nộp giấy tờ cần thiết để chính thức gia nhập.', textDetail: 'Nộp giấy tờ cần thiết để chính thức gia nhập.' },
];
