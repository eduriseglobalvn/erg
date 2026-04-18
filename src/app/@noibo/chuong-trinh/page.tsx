import Link from "next/link";
import { ArrowRight, BookOpenCheck, FolderOpenDot, Sparkles } from "lucide-react";

import {
  COURSE_GROUPS,
  FLAT_PROGRAMS,
  HUB_COLLECTIONS,
  TOTAL_LESSON_SHELVES,
} from "@/components/noibo/noibo-data";
import {
  NoiboCardGrid,
  NoiboPageHero,
  NoiboSection,
  NoiboTimeline,
} from "@/components/noibo/noibo-page-shell";

export default function NoiboProgramsPage() {
  return (
    <div className="bg-[#f8fafc] pb-24">
      <NoiboPageHero
        eyebrow="Program Navigator"
        title="Bản đồ chương trình dành cho toàn bộ Teacher Hub."
        description="Từ chứng chỉ quốc tế đến các chuyên đề AI mới, mỗi chương trình đều có đầy đủ giáo án, lesson kits, mock exam, worksheet và playbook triển khai dành cho giáo viên ERG."
        stats={[
          { label: "Chương trình", value: `${FLAT_PROGRAMS.length}` },
          { label: "Nhóm nội dung", value: `${COURSE_GROUPS.length}` },
          { label: "Tủ học liệu", value: `${TOTAL_LESSON_SHELVES}+` },
        ]}
        actions={[
          { label: "Mở kho học liệu", href: "/kho-hoc-lieu", icon: FolderOpenDot },
          { label: "Xem quiz bank", href: "/quizzes", icon: BookOpenCheck, variant: "secondary" },
        ]}
      />

      <NoiboSection
        eyebrow="Tracks"
        title="Mỗi chương trình là một workspace giảng dạy hoàn chỉnh."
        description="Thay vì chỉ liệt kê tên khóa học, Teacher Hub gom theo từng track để giáo viên mở vào là thấy ngay lộ trình, module, tài liệu mẫu và checklist dạy học."
      >
        <div className="space-y-10">
          {COURSE_GROUPS.map((group) => (
            <div key={group.title} className="space-y-5 rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm shadow-slate-200/40 lg:p-8">
              <div className="flex flex-col gap-3 border-b border-slate-100 pb-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#cc0022]">{group.title}</p>
                  <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900">{group.description}</h2>
                </div>
                <span className="inline-flex rounded-full bg-slate-50 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                  {group.programs.length} tracks
                </span>
              </div>

              <NoiboCardGrid
                items={group.programs.map((program) => ({
                  title: program.name,
                  description: program.summary,
                  meta: program.badge,
                  href: program.href,
                  tags: program.items.map((item) => item.name),
                }))}
              />
            </div>
          ))}
        </div>
      </NoiboSection>

      <NoiboSection
        eyebrow="Execution Flow"
        title="Cách giáo viên thường dùng hệ chương trình trong thực tế."
        description="Mình đóng gói lại theo đúng nhịp sử dụng thật trong đội ngũ nội bộ: chọn track, lấy bộ lesson kit, triển khai trên lớp rồi quay lại tối ưu bằng quiz và cộng đồng."
        tone="muted"
      >
        <NoiboTimeline
          items={[
            {
              title: "Chọn track phù hợp",
              detail: "Mở trang chương trình để chọn đúng lộ trình IC3, MOS hay AI theo nhóm học viên và mục tiêu học kỳ.",
              meta: "Step 1",
            },
            {
              title: "Lấy bộ lesson kit",
              detail: "Mỗi track đều có giáo án, deck trình chiếu, worksheet, quiz warm-up và mock exam đi kèm.",
              meta: "Step 2",
            },
            {
              title: "Dạy, đo và cải tiến",
              detail: "Kết hợp quiz bank, portfolio showcase và phản hồi từ cộng đồng để cải tiến bài dạy liên tục.",
              meta: "Step 3",
            },
          ]}
        />
      </NoiboSection>

      <NoiboSection
        eyebrow="Cross Resources"
        title="Các kho tài nguyên đi kèm xuyên suốt mọi chương trình."
        description="Bên cạnh từng track riêng lẻ, giáo viên còn có một lớp tài nguyên dùng chung để triển khai nhanh hơn ở nhiều ngữ cảnh lớp học."
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

        <div className="mt-10 flex flex-col gap-4 rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm shadow-slate-200/40 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#cc0022]">Teacher Hub Navigator</p>
            <h3 className="mt-3 text-3xl font-black tracking-tight text-slate-900">Muốn đi thẳng vào từng chương trình?</h3>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
              Bạn có thể mở từng track để xem đầy đủ module, bộ tài nguyên, workflow giảng dạy và hỗ trợ nội bộ cho riêng môn đó.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {FLAT_PROGRAMS.map((program) => (
              <Link
                key={program.slug}
                href={program.href}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[11px] font-black uppercase tracking-[0.16em] text-[#00008b] transition-all hover:-translate-y-0.5 hover:bg-white"
              >
                {program.name}
                <ArrowRight className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </div>
      </NoiboSection>

      <NoiboSection
        eyebrow="Next Step"
        title="Đi tiếp sang kho học liệu, portfolio và cộng đồng."
        description="Bộ menu nội bộ không còn là menu tĩnh nữa. Từ đây bạn có thể đi tiếp tới các khu chức năng chi tiết hơn để lấy đúng thứ mình cần cho một buổi dạy."
        tone="dark"
      >
        <div className="grid gap-6 lg:grid-cols-3">
          {[
            { title: "Kho học liệu", detail: "Mở thư viện tài nguyên theo môn, format và mục tiêu giảng dạy.", href: "/kho-hoc-lieu" },
            { title: "Portfolio", detail: "Xem showcase bài giảng, deck mẫu và template đang dùng trong hệ thống.", href: "/portfolio" },
            { title: "Cộng đồng", detail: "Trao đổi với mentor, đăng câu hỏi và chia sẻ bài giảng cho cả đội.", href: "/cong-dong" },
          ].map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="rounded-[28px] border border-white/10 bg-white/5 p-6 transition-all hover:-translate-y-1 hover:bg-white/10"
            >
              <div className="inline-flex rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white/70">
                <Sparkles className="mr-2 h-3.5 w-3.5" />
                Continue
              </div>
              <h3 className="mt-5 text-3xl font-black tracking-tight text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-white/70">{item.detail}</p>
            </Link>
          ))}
        </div>
      </NoiboSection>
    </div>
  );
}
