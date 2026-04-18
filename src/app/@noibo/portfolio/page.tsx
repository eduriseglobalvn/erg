import { FolderKanban, LayoutTemplate, Presentation, Sparkles } from "lucide-react";

import { PORTFOLIO_STREAMS } from "@/components/noibo/noibo-data";
import {
  NoiboCardGrid,
  NoiboPageHero,
  NoiboSection,
  NoiboTimeline,
} from "@/components/noibo/noibo-page-shell";

export default function NoiboPortfolioPage() {
  return (
    <div className="bg-[#f8fafc] pb-24">
      <NoiboPageHero
        eyebrow="Teaching Portfolio"
        title="Portfolio bài giảng để giáo viên tái sử dụng và nâng cấp thật nhanh."
        description="Đây là khu showcase của Teacher Hub, nơi các deck mẫu, case study lớp học, template triển khai và tài liệu tham chiếu được lưu lại thành chuẩn thực hành dùng chung."
        stats={[
          { label: "Dòng portfolio", value: `${PORTFOLIO_STREAMS.length}` },
          { label: "Deck mẫu", value: "120+" },
          { label: "Templates", value: "64" },
        ]}
        actions={[
          { label: "Xem kho học liệu", href: "/kho-hoc-lieu", icon: FolderKanban },
          { label: "Vào cộng đồng", href: "/cong-dong", icon: Sparkles, variant: "secondary" },
        ]}
      />

      <NoiboSection
        eyebrow="Streams"
        title="Những nhánh portfolio chính trong nội bộ."
        description="Mỗi nhánh giải một bài toán khác nhau: tham chiếu nhanh bài giảng, học hỏi từ lớp thật hoặc nhân bản template để mở khóa mới."
      >
        <NoiboCardGrid
          items={PORTFOLIO_STREAMS.map((stream) => ({
            title: stream.title,
            description: stream.summary,
            meta: stream.volume,
            href: stream.href,
          }))}
        />
      </NoiboSection>

      <NoiboSection
        eyebrow="Assets"
        title="Một portfolio bài giảng tốt nên có gì?"
        description="Mình đóng gói theo đúng checklist mà giáo viên nội bộ thường cần trước khi chia sẻ cho cả đội."
        tone="muted"
      >
        <div className="grid gap-6 lg:grid-cols-3">
          {[
            { title: "Deck hoàn chỉnh", detail: "Bản trình chiếu đã qua dạy thử, có note nhịp giảng và điểm nhấn cần lưu ý.", icon: Presentation },
            { title: "Lesson map", detail: "Sơ đồ buổi dạy, các checkpoint, hoạt động nhóm và tiêu chí đánh giá cuối buổi.", icon: LayoutTemplate },
            { title: "Reflection & fixes", detail: "Điểm đã làm tốt, lỗi thường gặp và các chỉnh sửa sau mỗi vòng triển khai.", icon: Sparkles },
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
        eyebrow="Build Process"
        title="Quy trình phát triển một portfolio bài giảng dùng được lâu dài."
        description="Portfolio trong Teacher Hub không phải chỗ cất file tạm. Mỗi bài giảng được đẩy lên đều nên qua một quy trình đủ chặt để cả đội tái sử dụng về sau."
      >
        <NoiboTimeline
          items={[
            {
              title: "Draft bài giảng",
              detail: "Giáo viên tạo bản đầu tiên từ lesson kit, deck mẫu hoặc task file có sẵn.",
              meta: "Draft",
            },
            {
              title: "Review & dạy thử",
              detail: "Mentor hoặc đồng nghiệp xem nhanh flow bài giảng trước khi đưa vào lớp thật.",
              meta: "Review",
            },
            {
              title: "Chốt và nhân bản",
              detail: "Sau khi dạy thật, portfolio được cập nhật note và trở thành tài sản dùng chung của hệ thống.",
              meta: "Scale",
            },
          ]}
        />
      </NoiboSection>
    </div>
  );
}
