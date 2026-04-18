import Link from "next/link";

import { PUBLIC_DISCLOSURE_SECTIONS } from "@/constants/public-disclosure";

interface DisclosureSidebarProps {
  currentPath?: string;
}

export function DisclosureSidebar({ currentPath = "/cong-khai" }: DisclosureSidebarProps) {
  return (
    <aside className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
        Công khai
      </p>
      <h2 className="mt-3 text-2xl font-bold text-slate-900">Danh mục tài liệu</h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        Truy cập nhanh các đầu mục công khai dành cho phụ huynh, học viên và đối tác tra cứu.
      </p>

      <div className="mt-6 space-y-4">
        <Link
          href="/cong-khai"
          className={`block rounded-2xl border px-4 py-3 text-sm font-semibold transition-colors ${
            currentPath === "/cong-khai"
              ? "border-primary bg-primary text-white"
              : "border-slate-200 text-slate-700 hover:border-primary/30 hover:bg-slate-50"
          }`}
        >
          Tổng quan công khai
        </Link>

        {PUBLIC_DISCLOSURE_SECTIONS.map((section) => {
          const sectionPath = `/cong-khai/${section.slug}`;
          const isSectionActive =
            currentPath === sectionPath || currentPath.startsWith(`${sectionPath}/`);

          return (
            <div key={section.slug} className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3">
              <Link
                href={sectionPath}
                className={`block rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
                  isSectionActive ? "bg-white text-primary shadow-sm" : "text-slate-800 hover:bg-white"
                }`}
              >
                {section.label}
              </Link>

              <div className="mt-2 space-y-1">
                {section.documents.map((document) => {
                  const documentPath =
                    document.slug === section.slug
                      ? sectionPath
                      : `/cong-khai/${section.slug}/${document.slug}`;
                  const isActive = currentPath === documentPath;

                  return (
                    <Link
                      key={documentPath}
                      href={documentPath}
                      className={`block rounded-xl px-3 py-2 text-sm leading-5 transition-colors ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-slate-600 hover:bg-white hover:text-slate-900"
                      }`}
                    >
                      {document.menuLabel}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
