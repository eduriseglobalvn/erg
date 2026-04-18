import Link from "next/link";
import Image from "next/image";
import { Download, Calendar, GraduationCap, ShieldCheck } from "lucide-react";
import type { DisclosureDocument } from "@/constants/public-disclosure";

interface DisclosureDocumentCardProps {
  document: DisclosureDocument;
  href: string;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function DisclosureDocumentCard({ document, href }: DisclosureDocumentCardProps) {
  return (
    <article className="group overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:border-primary/20">
      <div className="flex flex-col md:flex-row">
        {/* Preview Image / Thumbnail */}
        <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-slate-100 md:w-[320px] md:aspect-auto">
          {document.thumbnailUrl ? (
            <Image
              src={document.thumbnailUrl}
              alt={document.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-8 text-slate-300">
              <GraduationCap size={64} strokeWidth={1} />
            </div>
          )}
          {/* Badge overlays */}
          <div className="absolute left-4 top-4">
             <span className="flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#253b99] shadow-sm backdrop-blur-sm">
               <ShieldCheck size={12} className="text-[#253b99]" />
               Tài liệu gốc
             </span>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex flex-1 flex-col p-6 md:p-8">
          <div className="flex flex-1 flex-col">
            <h2 className="text-xl font-bold leading-tight text-[#253b99] transition-colors md:text-2xl group-hover:text-primary">
              <Link href={href}>{document.title}</Link>
            </h2>

            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium text-slate-500">
              <span className="flex items-center gap-2">
                <Calendar size={16} className="text-slate-400" />
                {formatDate(document.publishedAt)}
              </span>
              {document.schoolYear && (
                <span className="flex items-center gap-2">
                  <GraduationCap size={16} className="text-slate-400" />
                  Năm học {document.schoolYear}
                </span>
              )}
            </div>

            <p className="mt-4 line-clamp-2 text-sm leading-7 text-slate-600 md:text-base">
              {document.shortDescription}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-6">
            <Link
              href={document.fileUrl || href}
              target={document.fileUrl ? "_blank" : undefined}
              className="flex items-center gap-2 text-sm font-bold text-red-600 transition-colors hover:text-red-700 underline-offset-4 hover:underline"
            >
              <Download size={18} />
              Tải File đính kèm
            </Link>

            <Link
              href={href}
              className="inline-flex h-11 items-center justify-center rounded-full bg-[#253b99] px-6 text-sm font-bold text-white shadow-md transition-all hover:bg-primary hover:-translate-y-0.5 active:translate-y-0"
            >
              Xem chi tiết
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
