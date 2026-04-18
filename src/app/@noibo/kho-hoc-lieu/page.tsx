import { Download, Filter, LibraryBig, Search, Video } from "lucide-react";

import { HUB_COLLECTIONS } from "@/components/noibo/noibo-data";
import {
  NoiboCardGrid,
  NoiboPageHero,
  NoiboSection,
  NoiboTimeline,
} from "@/components/noibo/noibo-page-shell";

export default function NoiboLibraryPage() {
  return (
    <div className="bg-[#f8fafc] pb-24">
      <NoiboPageHero
        eyebrow="SmartLibrary"
        title="Kho học liệu tập trung cho toàn bộ giáo viên ERG."
        description="Từ deck trình chiếu, worksheet, task file, demo video đến mock exam, mọi tài nguyên đều được gom lại theo đúng logic sử dụng trong Teacher Hub."
        stats={[
          { label: "Bộ sưu tập", value: "18" },
          { label: "Tài nguyên", value: "2.7k+" },
          { label: "Format", value: "Slides / Docs / Quiz" },
        ]}
        actions={[
          { label: "Tìm tài nguyên", href: "/kho-hoc-lieu", icon: Search },
          { label: "Mở chương trình", href: "/chuong-trinh", icon: LibraryBig, variant: "secondary" },
        ]}
      />

      <NoiboSection
        eyebrow="Collections"
        title="Những tủ tài nguyên quan trọng nhất trong hệ thống."
        description="Mỗi collection được đóng gói theo ngữ cảnh dùng thật để giáo viên có thể mở vào và lấy ngay thứ cần cho buổi dạy."
      >
        <NoiboCardGrid
          items={HUB_COLLECTIONS.map((collection) => ({
            title: collection.title,
            description: collection.subtitle,
            meta: collection.metric,
            href: collection.href,
            tags: collection.tags,
          }))}
        />
      </NoiboSection>

      <NoiboSection
        eyebrow="Asset Types"
        title="Kho học liệu không chỉ có slide."
        description="Ở đây mình mở rộng nội dung đủ cho một giáo viên chuẩn bị trước, dạy trên lớp và follow-up sau buổi học."
        tone="muted"
      >
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {[
            { title: "Deck trình chiếu", detail: "Bản full, bản rút gọn và note nhịp giảng dành cho giáo viên.", icon: LibraryBig },
            { title: "Worksheet & Handout", detail: "Bài tập in sẵn, phiếu hoạt động nhóm và assignment về nhà.", icon: Download },
            { title: "Demo video", detail: "Video thao tác, clip giải đề và recording mẫu cho phần khó.", icon: Video },
            { title: "Mock exam", detail: "Đề mô phỏng, đáp án, phân tích lỗi và scoring checklist.", icon: Filter },
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
        eyebrow="Usage Flow"
        title="Một quy trình lấy học liệu nhanh trước khi lên lớp."
        description="Đây là flow khuyến nghị để giáo viên mới vào hệ thống vẫn có thể chuẩn bị bài dạy trong một vòng thao tác ngắn."
      >
        <NoiboTimeline
          items={[
            {
              title: "Chọn chương trình và module",
              detail: "Bắt đầu từ track chính, xác định đúng objective và năng lực của lớp ở tuần hiện tại.",
              meta: "01",
            },
            {
              title: "Lọc theo format",
              detail: "Lấy đúng deck, worksheet, video hoặc mock exam cần dùng, tránh tải thừa tài nguyên.",
              meta: "02",
            },
            {
              title: "Gắn vào bài giảng thực tế",
              detail: "Đưa tài nguyên sang portfolio của riêng bạn hoặc đẩy tiếp sang quiz/community để tối ưu thêm.",
              meta: "03",
            },
          ]}
        />
      </NoiboSection>
    </div>
  );
}
