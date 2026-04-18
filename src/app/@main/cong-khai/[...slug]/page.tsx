import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

import { Search } from "lucide-react";
import { DisclosureDocumentCard, DisclosureDocumentFrame, DisclosureSidebar } from "@/components/public-disclosure";
import { SchemaScript } from "@/components/seo/schema-script";
import {
  getDisclosureDocument,
  getDisclosureSection,
} from "@/constants/public-disclosure";
import { resolveSiteContextFromHeaders } from "@/lib/site-context";
import { generateBreadcrumbItems } from "@/utils/seo/generate-breadcrumb";
import { generateFullMetadata } from "@/utils/seo/seo-metadata";

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function buildDocumentPath(sectionSlug: string, documentSlug: string) {
  return documentSlug === sectionSlug
    ? `/cong-khai/${sectionSlug}`
    : `/cong-khai/${sectionSlug}/${documentSlug}`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const headerList = await headers();
  const siteContext = resolveSiteContextFromHeaders(headerList);

  if (slug.length === 1) {
    const section = getDisclosureSection(slug[0]);
    if (!section) {
      return { title: "Công khai | ERG" };
    }

    const directDocument =
      section.documents.length === 1 && section.documents[0].slug === section.slug
        ? section.documents[0]
        : null;

    if (directDocument) {
      return generateFullMetadata({
        title: `${directDocument.title} | ERG`,
        description: directDocument.description,
        keywords: [section.label, directDocument.title, "công khai ERG"],
        path: buildDocumentPath(section.slug, directDocument.slug),
        host: siteContext.host,
        type: "article",
      });
    }

    return generateFullMetadata({
      title: `${section.label} | Công khai ERG`,
      description: section.description,
      keywords: [section.label, "cong khai erg"],
      path: `/cong-khai/${section.slug}`,
      host: siteContext.host,
    });
  }

  if (slug.length === 2) {
    const document = getDisclosureDocument(slug[0], slug[1]);
    if (!document) {
      return { title: "Công khai | ERG" };
    }

    return generateFullMetadata({
      title: `${document.title} | ERG`,
      description: document.description,
      keywords: [document.title, "công khai ERG", document.referenceCode],
      path: buildDocumentPath(document.sectionSlug, document.slug),
      host: siteContext.host,
      type: "article",
    });
  }

  return { title: "Công khai | ERG" };
}

export default async function PublicDisclosureSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const headerList = await headers();
  const siteContext = resolveSiteContextFromHeaders(headerList);

  if (slug.length === 1) {
    const section = getDisclosureSection(slug[0]);
    if (!section) {
      notFound();
    }

    const directDocument =
      section.documents.length === 1 && section.documents[0].slug === section.slug
        ? section.documents[0]
        : null;

    if (directDocument) {
      return renderDocumentPage({
        siteContext,
        currentPath: buildDocumentPath(section.slug, directDocument.slug),
        sectionLabel: section.label,
        document: directDocument,
      });
    }

    const breadcrumbItems = generateBreadcrumbItems(
      `/cong-khai/${section.slug}`,
      section.label,
      "Trang chủ"
    );

    return (
      <>
        <SchemaScript
          type="BreadcrumbList"
          data={{ items: breadcrumbItems }}
          domain={siteContext.hostname}
        />

        <section className="bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)]">
          <div className="container mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
            <div className="grid gap-12 lg:grid-cols-[300px_minmax(0,1fr)]">
              <DisclosureSidebar currentPath={`/cong-khai/${section.slug}`} />

              <div>
                {/* Updated Header with Search - Matching User Sample */}
                <div
                  className={`relative rounded-[32px] border border-slate-200 bg-gradient-to-br ${section.accent} p-8 shadow-sm`}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.34em] text-slate-500">
                    {section.label}
                  </p>
                  <h1 className="mt-4 text-3xl font-black text-slate-950 md:text-5xl">
                    Danh mục: {section.label}
                  </h1>
                  <p className="mt-5 max-w-3xl text-sm leading-8 text-slate-600 md:text-lg">
                    {section.description}
                  </p>

                  {/* Search Bar matching screenshot */}
                  <div className="mt-10 flex flex-col gap-2 md:flex-row">
                    <div className="relative flex-1">
                       <input 
                         type="text" 
                         placeholder="Nhập từ khóa tìm kiếm trong chuyên mục này..." 
                         className="h-14 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/5"
                       />
                       <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                    </div>
                    <button className="h-14 rounded-xl bg-[#253b99] px-8 text-sm font-bold text-white transition-all hover:bg-primary active:scale-95">
                      Tìm kiếm
                    </button>
                  </div>
                </div>

                <div className="mt-8 grid gap-6">
                  {section.documents.map((document) => {
                    const href = buildDocumentPath(section.slug, document.slug);
                    return (
                      <DisclosureDocumentCard 
                        key={href} 
                        document={document} 
                        href={href} 
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  if (slug.length === 2) {
    const section = getDisclosureSection(slug[0]);
    const document = getDisclosureDocument(slug[0], slug[1]);
    if (!section || !document) {
      notFound();
    }

    return renderDocumentPage({
      siteContext,
      currentPath: buildDocumentPath(section.slug, document.slug),
      sectionLabel: section.label,
      document,
    });
  }

  notFound();
}

function renderDocumentPage({
  siteContext,
  currentPath,
  sectionLabel,
  document,
}: {
  siteContext: ReturnType<typeof resolveSiteContextFromHeaders>;
  currentPath: string;
  sectionLabel: string;
  document: NonNullable<ReturnType<typeof getDisclosureDocument>>;
}) {
  const breadcrumbItems = generateBreadcrumbItems(currentPath, document.title, "Trang chủ");

  return (
    <>
      <SchemaScript
        type="BreadcrumbList"
        data={{ items: breadcrumbItems }}
        domain={siteContext.hostname}
      />

      <section className="bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)]">
        <div className="container mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
          <div className="grid gap-12 lg:grid-cols-[300px_minmax(0,1fr)]">
            <DisclosureSidebar currentPath={currentPath} />

            <div>
              <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_24px_80px_-36px_rgba(15,23,42,0.35)]">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="max-w-3xl">
                    <p className="text-xs font-semibold uppercase tracking-[0.34em] text-sky-700">
                      {sectionLabel} · {document.heroKicker}
                    </p>
                    <h1 className="mt-4 text-4xl font-black leading-tight text-slate-950 md:text-5xl">
                      {document.title}
                    </h1>
                    <p className="mt-5 text-base leading-8 text-slate-600 md:text-lg">
                      {document.description}
                    </p>
                  </div>

                  <div className="min-w-[220px] rounded-[24px] border border-slate-100 bg-slate-50 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                      Mã tham chiếu
                    </p>
                    <p className="mt-2 text-xl font-black text-slate-900">{document.referenceCode}</p>
                    <div className="mt-4 space-y-2 text-sm text-slate-600">
                      <p>
                        <span className="font-medium text-slate-900">Công bố:</span>{" "}
                        {formatDate(document.publishedAt)}
                      </p>
                      <p>
                        <span className="font-medium text-slate-900">Hiệu lực:</span>{" "}
                        {formatDate(document.effectiveDate)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 grid gap-4 md:grid-cols-3">
                  {document.highlights.map((highlight) => (
                    <div key={highlight} className="rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4">
                      <p className="text-sm leading-7 text-slate-600">{highlight}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <DisclosureDocumentFrame document={document} />
              </div>

              <div className="mt-8 grid gap-5 md:grid-cols-3">
                <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                    Đơn vị ban hành
                  </p>
                  <p className="mt-3 text-base font-semibold leading-7 text-slate-900">
                    {document.issuingAuthority}
                  </p>
                </div>
                <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                    Chu kỳ rà soát
                  </p>
                  <p className="mt-3 text-base font-semibold leading-7 text-slate-900">
                    {document.reviewCycle}
                  </p>
                </div>
                <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                    Phạm vi tiếp cận
                  </p>
                  <p className="mt-3 text-base font-semibold leading-7 text-slate-900">
                    {document.accessScope}
                  </p>
                </div>
              </div>

              <div className="mt-8 grid gap-5 lg:grid-cols-3">
                {document.detailBlocks.map((block) => (
                  <article
                    key={block.heading}
                    className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                      {block.heading}
                    </p>
                    <p className="mt-4 text-sm leading-7 text-slate-600">{block.body}</p>
                  </article>
                ))}
              </div>

              <div className="mt-8 rounded-[28px] border border-slate-200 bg-slate-950 px-6 py-7 text-white shadow-[0_24px_80px_-36px_rgba(15,23,42,0.55)]">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                  Ghi chú phát hành
                </p>
                <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <p className="max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
                    Trang công khai này đã sẵn sàng để nối với tài liệu PDF thật. Khi bạn bổ sung file hoặc
                    document ID từ hệ thống quản trị, viewer sẽ tự dùng nguồn PDF thật mà không cần đổi lại giao diện.
                  </p>
                  <Link
                    href="/cong-khai"
                    className="inline-flex items-center justify-center rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-slate-950"
                  >
                    Quay lại trung tâm công khai
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
