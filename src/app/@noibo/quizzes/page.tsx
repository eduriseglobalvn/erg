import { BrainCircuit, ChartColumn, CircleCheckBig, ClipboardList } from "lucide-react";

import { QUIZ_TRACKS } from "@/components/noibo/noibo-data";
import {
  NoiboCardGrid,
  NoiboPageHero,
  NoiboSection,
  NoiboTimeline,
} from "@/components/noibo/noibo-page-shell";

export default function NoiboQuizzesPage() {
  return (
    <div className="bg-[#f8fafc] pb-24">
      <NoiboPageHero
        eyebrow="Assessment Hub"
        title="Quiz bank để kiểm tra nhanh, mock thi thật và đo tiến bộ học viên."
        description="Teacher Hub gom toàn bộ warm-up quiz, exit ticket, quiz giữa buổi, đề mô phỏng và checklist chấm nhanh thành một khu assessment thống nhất cho giáo viên."
        stats={[
          { label: "Quiz tracks", value: `${QUIZ_TRACKS.length}` },
          { label: "Câu hỏi", value: "2.6k+" },
          { label: "Mock sets", value: "34" },
        ]}
        actions={[
          { label: "Mở kho học liệu", href: "/kho-hoc-lieu", icon: ClipboardList },
          { label: "Vào chương trình", href: "/chuong-trinh", icon: BrainCircuit, variant: "secondary" },
        ]}
      />

      <NoiboSection
        eyebrow="Quiz Tracks"
        title="Mỗi track có ngân hàng đánh giá riêng."
        description="Câu hỏi không bị trộn lẫn vô tổ chức nữa. Mỗi chương trình được tách quiz bank riêng để giáo viên chọn đúng năng lực cần kiểm tra."
      >
        <NoiboCardGrid
          items={QUIZ_TRACKS.map((track) => ({
            title: track.title,
            description: track.summary,
            meta: track.questionCount,
            href: track.href,
          }))}
        />
      </NoiboSection>

      <NoiboSection
        eyebrow="Assessment Types"
        title="Các loại bài đánh giá có trong hệ thống."
        description="Một bài dạy tốt thường cần nhiều lớp kiểm tra: mở bài, checkpoint giữa buổi, củng cố cuối buổi và bài mô phỏng cuối chặng."
        tone="muted"
      >
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {[
            { title: "Warm-up quiz", detail: "Khởi động 3-5 phút để gọi lại kiến thức cũ.", icon: BrainCircuit },
            { title: "Checkpoint", detail: "Bộ câu hỏi ngắn giữa buổi học để chặn sớm phần chưa hiểu.", icon: CircleCheckBig },
            { title: "Exit ticket", detail: "Đánh giá cuối buổi và xác định ai cần hỗ trợ tiếp theo.", icon: ClipboardList },
            { title: "Mock exam", detail: "Bài mô phỏng gần với kỳ thi thật, có báo cáo objective.", icon: ChartColumn },
          ].map((item) => {
            const ItemIcon = item.icon;
            return (
              <div key={item.title} className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm shadow-slate-200/30">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-[#00008b]">
                  <ItemIcon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-2xl font-black tracking-tight text-slate-900">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-500">{item.detail}</p>
              </div>
            );
          })}
        </div>
      </NoiboSection>

      <NoiboSection
        eyebrow="Assessment Flow"
        title="Một vòng đánh giá đủ để giáo viên theo dõi tiến bộ."
        description="Quiz bank được thiết kế để đi kèm lesson kit chứ không đứng riêng, nên bạn có thể dùng ngay trong flow vận hành lớp học."
      >
        <NoiboTimeline
          items={[
            {
              title: "Lấy quiz đúng module",
              detail: "Chọn đúng module của chương trình để tránh kiểm tra lệch nội dung đang dạy.",
              meta: "01",
            },
            {
              title: "Chấm và nhìn lỗi nhanh",
              detail: "Dùng rubric hoặc answer map để chấm nhanh, xác định objective nào lớp đang yếu.",
              meta: "02",
            },
            {
              title: "Quay lại lesson kit",
              detail: "Từ kết quả quiz, giáo viên quay lại học liệu hoặc portfolio để bổ trợ phần còn hổng.",
              meta: "03",
            },
          ]}
        />
      </NoiboSection>
    </div>
  );
}
