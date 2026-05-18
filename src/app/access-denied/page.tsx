import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function AccessDeniedPage({
    searchParams,
}: {
    searchParams?: { portal?: string; email?: string };
}) {
    const portal = searchParams?.portal || "hệ thống ERG";
    const email = searchParams?.email || "";

    return (
        <main className="grid min-h-screen place-items-center bg-gradient-to-br from-blue-50 via-white to-red-50 px-4 py-10">
            <section className="w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
                <div className="grid md:grid-cols-[260px_1fr]">
                    <aside className="bg-[#00008b] p-8 text-white">
                        <img
                            alt="ERG"
                            className="h-12 w-fit rounded-lg bg-white px-3 py-2 object-contain"
                            src="https://media.erg.edu.vn/logo/erg.png"
                        />
                        <div className="mt-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15">
                            <ShieldAlert className="h-8 w-8" />
                        </div>
                        <p className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-white/60">Access denied</p>
                        <h1 className="mt-3 text-3xl font-black leading-tight">Không đủ quyền truy cập.</h1>
                    </aside>
                    <div className="p-8 sm:p-10">
                        <p className="text-sm font-black uppercase tracking-[0.18em] text-[#cc0022]">ERG permission</p>
                        <h2 className="mt-3 text-2xl font-black text-slate-950">Không thể vào {portal}</h2>
                        <p className="mt-4 text-sm leading-7 text-slate-600">
                            {email ? (
                                <>
                                    Tài khoản <span className="font-bold text-slate-950">{email}</span> đã đăng nhập thành
                                    công nhưng chưa được cấp quyền phù hợp.
                                </>
                            ) : (
                                "Tài khoản hiện tại chưa được cấp quyền phù hợp."
                            )}{" "}
                            Vui lòng liên hệ quản trị viên ERG để được cấp quyền theo vai trò hoặc đơn vị phụ trách.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link
                                href="/auth/login"
                                className="inline-flex h-12 items-center rounded-xl bg-[#00008b] px-5 text-sm font-black text-white"
                            >
                                Đăng nhập tài khoản khác
                            </Link>
                            <Link
                                href="/"
                                className="inline-flex h-12 items-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-black text-slate-700"
                            >
                                Về trang chủ
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
