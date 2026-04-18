"use client";

import { FileText, ShieldCheck } from "lucide-react";

import { PdfViewer } from "@/components/shared/pdf-viewer";
import type { DisclosureDocument } from "@/constants/public-disclosure";

interface DisclosureDocumentFrameProps {
  document: DisclosureDocument;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function DisclosureDocumentFrame({ document }: DisclosureDocumentFrameProps) {
  const hasPdfSource = Boolean(document.documentId || document.fileUrl);

  if (hasPdfSource) {
    return (
      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_80px_-32px_rgba(15,23,42,0.35)]">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
              {document.heroKicker}
            </p>
            <h2 className="mt-1 text-lg font-semibold text-slate-900">{document.title}</h2>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
            <ShieldCheck className="h-3.5 w-3.5" />
            Tài liệu PDF
          </span>
        </div>
        <div className="h-[72vh] min-h-[640px]">
          <PdfViewer
            documentId={document.documentId}
            fileUrl={document.fileUrl}
            title={document.title}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_80px_-32px_rgba(15,23,42,0.35)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
            {document.heroKicker}
          </p>
          <h2 className="mt-1 text-lg font-semibold text-slate-900">{document.title}</h2>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700">
          <FileText className="h-3.5 w-3.5" />
          Bản trình bày công khai
        </span>
      </div>

      <div className="bg-[radial-gradient(circle_at_top_right,_rgba(245,158,11,0.24),_transparent_34%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)] px-4 py-6 md:px-8 md:py-8">
        <div className="mx-auto max-w-4xl rounded-[32px] border border-[#e9d8b4] bg-[#f6e4bb] p-4 shadow-[0_30px_60px_-30px_rgba(15,23,42,0.4)] md:p-6">
          <div className="rounded-[28px] bg-white px-6 py-8 shadow-[inset_0_0_0_1px_rgba(184,134,11,0.12)] md:px-12 md:py-14">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500 md:text-sm">
                {document.cover.eyebrow}
              </p>
              <p className="mt-4 text-base font-semibold uppercase tracking-[0.24em] text-[#274690] md:text-lg">
                {document.cover.issuedBy}
              </p>
              <h3 className="mt-8 text-3xl font-black uppercase leading-tight text-[#8c4b14] md:text-5xl">
                {document.cover.title}
              </h3>
              <p className="mt-6 text-sm leading-7 text-slate-600 md:text-lg md:leading-8">
                {document.cover.subtitle}
              </p>
              <div className="mt-10 grid gap-4 border-y border-dashed border-[#d5b978] py-6 text-left md:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Mã công bố
                  </p>
                  <p className="mt-2 text-base font-semibold text-slate-900">{document.referenceCode}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Hiệu lực
                  </p>
                  <p className="mt-2 text-base font-semibold text-slate-900">
                    {formatDate(document.effectiveDate)}
                  </p>
                </div>
              </div>
              <p className="mt-10 text-sm italic text-[#274690] md:text-base">
                {document.cover.footer}
              </p>
              <p className="mt-3 text-xs uppercase tracking-[0.2em] text-slate-400">
                Cập nhật ngày {formatDate(document.publishedAt)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
