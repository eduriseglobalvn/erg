import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";

import { DisclosureSidebar, DisclosureDocumentCard } from "@/components/public-disclosure";
import { SchemaScript } from "@/components/seo/schema-script";
import {
  PUBLIC_DISCLOSURE_SECTIONS,
  getAllDisclosureDocuments,
} from "@/constants/public-disclosure";
import { resolveSiteContextFromHeaders } from "@/lib/site-context";
import { generateFullMetadata } from "@/utils/seo/seo-metadata";

export async function generateMetadata(): Promise<Metadata> {
  const headerList = await headers();
  const siteContext = resolveSiteContextFromHeaders(headerList);

  return generateFullMetadata({
    title: "Công khai | ERG",
    description:
      "Trung tâm công khai của ERG gồm hồ sơ pháp lý, học phí, kiểm định chất lượng và kế hoạch giảng dạy được trình bày minh bạch, dễ tra cứu.",
    keywords: [
      "cong khai erg",
      "phap ly erg",
      "hoc phi erg",
      "kiem dinh chat luong erg",
      "ke hoach giang day erg",
    ],
    path: "/cong-khai",
    host: siteContext.host,
  });
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default async function PublicDisclosureIndexPage() {
  const headerList = await headers();
  const siteContext = resolveSiteContextFromHeaders(headerList);
  const documents = getAllDisclosureDocuments();

  return (
    <>
      <SchemaScript
        type="BreadcrumbList"
        data={{
          items: [
            { label: "Trang chủ", href: "/" },
            { label: "Công khai" },
          ],
        }}
        domain={siteContext.hostname}
      />

      <section className="bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)]">
        <div className="container mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
          <div className="grid gap-12 lg:grid-cols-[300px_minmax(0,1fr)]">
            <DisclosureSidebar currentPath="/cong-khai" />

            <div>
              {/* Premium Hero Section */}
              <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_24px_80px_-36px_rgba(15,23,42,0.3)]">
                <div className="relative bg-[#253b99] px-8 py-12 text-white">
                  <div className="relative z-10">
                    <p className="text-xs font-bold uppercase tracking-[0.4em] text-white/60">
                      Transparency & Integrity
                    </p>
                    <h1 className="mt-6 text-4xl font-black leading-tight md:text-5xl">
                      Trung tâm <br /> Công khai ERG
                    </h1>
                    <p className="mt-6 max-w-2xl text-base leading-8 text-white/80 md:text-lg">
                      Chúng tôi cam kết minh bạch mọi thông tin pháp lý, tài chính và chất lượng đào tạo. 
                      Tại đây bạn có thể tra cứu và tải về các văn bản, chứng nhận chính thức mới nhất.
                    </p>
                  </div>
                  {/* Decorative element */}
                  <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
                  <div className="absolute -bottom-10 right-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
                </div>

                <div className="grid divide-y divide-slate-100 md:grid-cols-3 md:divide-x md:divide-y-0">
                  <div className="p-8">
                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">
                      Chuyên mục
                    </p>
                    <p className="mt-2 text-3xl font-black text-[#253b99]">
                      {PUBLIC_DISCLOSURE_SECTIONS.length}
                    </p>
                  </div>
                  <div className="p-8">
                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">
                      Tổng số tài liệu
                    </p>
                    <p className="mt-2 text-3xl font-black text-[#253b99]">{documents.length}</p>
                  </div>
                  <div className="p-8">
                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">
                      Cập nhật mới nhất
                    </p>
                    <p className="mt-2 text-xl font-black text-slate-900">
                      {formatDate(documents[0]?.publishedAt || new Date().toISOString())}
                    </p>
                  </div>
                </div>
              </div>

              {/* Latest Documents Grid */}
              <div className="mt-16">
                <div className="flex items-center justify-between border-b border-slate-200 pb-6 mb-8">
                  <h2 className="text-2xl font-black text-slate-950 uppercase tracking-tight">
                    Tài liệu công bố mới nhất
                  </h2>
                  <div className="h-1 w-20 bg-primary" />
                </div>

                <div className="grid gap-8">
                  {documents.map((doc) => {
                    const href = `/cong-khai/${doc.sectionSlug}/${doc.slug === doc.sectionSlug ? "" : doc.slug}`;
                    return (
                      <DisclosureDocumentCard 
                        key={`${doc.sectionSlug}-${doc.slug}`} 
                        document={doc} 
                        href={href} 
                      />
                    );
                  })}
                </div>
              </div>

              {/* Browse by Section */}
              <div className="mt-16">
                <div className="flex items-center justify-between border-b border-slate-200 pb-6 mb-8">
                  <h2 className="text-2xl font-black text-slate-950 uppercase tracking-tight">
                    Duyệt theo chuyên mục
                  </h2>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  {PUBLIC_DISCLOSURE_SECTIONS.map((section) => (
                    <Link 
                      key={section.slug}
                      href={`/cong-khai/${section.slug}`}
                      className={`group flex items-center justify-between overflow-hidden rounded-[24px] border border-slate-200 bg-white p-6 transition-all hover:border-primary/30 hover:shadow-lg`}
                    >
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-primary transition-colors">
                          {section.documents.length} tài liệu
                        </p>
                        <h3 className="mt-2 text-xl font-bold text-slate-900 group-hover:text-[#253b99] transition-colors">{section.label}</h3>
                      </div>
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-all group-hover:bg-[#253b99] group-hover:text-white group-hover:rotate-[-45deg]">
                        →
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
