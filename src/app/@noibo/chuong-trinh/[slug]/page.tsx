import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BrainCircuit, FolderKanban, LibraryBig, Users } from "lucide-react";

import { FLAT_PROGRAMS, getProgramDetailBySlug } from "@/components/noibo/noibo-data";
import {
  NoiboCardGrid,
  NoiboPageHero,
  NoiboSection,
  NoiboTimeline,
} from "@/components/noibo/noibo-page-shell";

export async function generateStaticParams() {
  return FLAT_PROGRAMS.map((program) => ({ slug: program.slug }));
}

export default async function NoiboProgramDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const detail = getProgramDetailBySlug(slug);

  if (!detail) {
    notFound();
  }

  return (
    <div className="bg-[#f8fafc] pb-24">
      <NoiboPageHero
        eyebrow={detail.eyebrow}
        title={detail.title}
        description={detail.description}
        stats={detail.stats}
        actions={[
          { label: "Mở kho học liệu", href: "/kho-hoc-lieu", icon: LibraryBig },
          { label: "Vào cộng đồng", href: "/cong-dong", icon: Users, variant: "secondary" },
        ]}
      />

      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <Link
          href="/chuong-trinh"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-slate-600 transition-all hover:-translate-x-0.5"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại danh mục chương trình
        </Link>
      </div>

      <NoiboSection
        eyebrow="Modules"
        title="Cấu trúc dạy học của chương trình."
        description="Mỗi track đều được chia thành những module có thời lượng rõ ràng, giúp giáo viên lên plan theo tuần hoặc theo mốc assessment."
      >
        <NoiboTimeline
          items={detail.modules.map((module) => ({
            title: module.title,
            detail: module.detail,
            meta: module.duration,
          }))}
        />
      </NoiboSection>

      <NoiboSection
        eyebrow="Resource Stack"
        title="Những gói tài nguyên bạn có thể lấy ngay để lên lớp."
        description="Không chỉ có slide, mỗi chương trình đều có nhiều lớp học liệu đi kèm để giáo viên dùng linh hoạt theo trình độ lớp và mục tiêu kiểm tra."
        tone="muted"
      >
        <NoiboCardGrid
          items={detail.resources.map((resource) => ({
            title: resource.title,
            description: resource.detail,
            meta: resource.type,
            href: "/kho-hoc-lieu",
          }))}
        />
      </NoiboSection>

      <NoiboSection
        eyebrow="Teaching Workflow"
        title="Workflow triển khai một buổi học trong Teacher Hub."
        description="Đây là luồng sử dụng khuyến nghị để giáo viên mở tài nguyên đúng thứ tự, tiết kiệm thời gian chuẩn bị và kiểm soát tốt hơn chất lượng buổi dạy."
      >
        <NoiboTimeline
          items={detail.workflow.map((step, index) => ({
            title: step.title,
            detail: step.detail,
            meta: `Pha ${index + 1}`,
          }))}
        />
      </NoiboSection>

      <NoiboSection
        eyebrow="Support Layer"
        title="Lớp hỗ trợ nội bộ để giáo viên không phải tự bơi."
        description="Mỗi chương trình còn có note cho mentor, checklist triển khai, file phản hồi và các gợi ý hỗ trợ lớp yếu hơn để đi cùng giáo viên trong suốt học kỳ."
        tone="dark"
      >
        <div className="grid gap-6 lg:grid-cols-2">
          {detail.support.map((support) => (
            <div key={support.title} className="rounded-[28px] border border-white/10 bg-white/5 p-6">
              <h3 className="text-3xl font-black tracking-tight text-white">{support.title}</h3>
              <p className="mt-3 text-sm leading-7 text-white/70">{support.detail}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {[
            { title: "Kho học liệu", href: "/kho-hoc-lieu", icon: LibraryBig },
            { title: "Portfolio bài giảng", href: "/portfolio", icon: FolderKanban },
            { title: "Quiz Bank", href: "/quizzes", icon: BrainCircuit },
          ].map((item) => {
            const ItemIcon = item.icon;
            return (
              <Link
                key={item.title}
                href={item.href}
                className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-black uppercase tracking-[0.18em] text-white transition-all hover:-translate-y-0.5 hover:bg-white/10"
              >
                <ItemIcon className="h-5 w-5" />
                {item.title}
              </Link>
            );
          })}
        </div>
      </NoiboSection>
    </div>
  );
}
