"use client"

import { Bell, ChevronDown, Grid3X3, MessageCircle, Plus, Search } from "lucide-react"
import { currentUser, leftItems, navItems, shortcuts, stories, trends } from "./forum-social-data"
import { cx } from "./forum-social-model"
import { Avatar } from "./forum-social-primitives"

export function TopBar() {
    return (
        <header className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-[#d8dbe1] bg-white px-3 shadow-[0_1px_2px_rgba(15,23,42,0.08)]">
            <div className="flex min-w-0 flex-1 items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1877f2] text-[21px] font-black leading-none text-white">F</div>
                <div className="hidden h-10 w-[260px] items-center gap-2 rounded-full bg-[#f0f2f5] px-3 text-[#65676b] transition focus-within:ring-2 focus-within:ring-[#1877f2]/25 md:flex">
                    <Search size={18} />
                    <input className="min-w-0 flex-1 bg-transparent text-[15px] outline-none" placeholder="Tìm kiếm trong cộng đồng" />
                </div>
            </div>

            <nav className="absolute left-1/2 hidden h-full -translate-x-1/2 items-center gap-1 md:flex">
                {navItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <button key={item.label} type="button" className={cx("relative flex h-full w-[96px] items-center justify-center rounded-lg text-[#65676b] transition duration-200 hover:bg-[#f2f2f2] xl:w-[112px]", index === 0 && "text-[#1877f2]")} title={item.label}>
                            <Icon size={25} />
                            {index === 0 && <span className="absolute bottom-0 h-[3px] w-full rounded-t bg-[#1877f2]" />}
                        </button>
                    );
                })}
            </nav>

            <div className="flex flex-1 items-center justify-end gap-2">
                {[Grid3X3, MessageCircle, Bell].map((Icon, index) => (
                    <button key={index} type="button" className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#e4e6eb] transition duration-200 hover:bg-[#d8dadf] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1877f2]">
                        <Icon size={20} />
                        {index === 2 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#e41e3f] px-1 text-[12px] font-bold text-white">3</span>}
                    </button>
                ))}
                <Avatar label={currentUser.avatar} className="h-10 w-10 bg-[linear-gradient(135deg,#0f172a,#60a5fa)] text-white" />
            </div>
        </header>
    );
}

export function LeftRail() {
    return (
        <aside className="fixed left-0 top-14 hidden h-[calc(100vh-56px)] w-[340px] overflow-y-auto px-2 py-4 lg:block xl:w-[360px]">
            <div className="space-y-1">
                {leftItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <button key={item.label} type="button" className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-[15px] font-semibold transition duration-200 hover:bg-[#e4e6eb]">
                            {item.avatar ? <Avatar label={currentUser.avatar} className="h-9 w-9 bg-[linear-gradient(135deg,#111827,#60a5fa)] text-white" /> : <Icon size={27} className="text-[#1877f2]" />}
                            <span>{item.label}</span>
                        </button>
                    );
                })}
                <button type="button" className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-[15px] font-semibold transition duration-200 hover:bg-[#e4e6eb]">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e4e6eb]">
                        <ChevronDown size={18} />
                    </span>
                    Xem thêm
                </button>
            </div>

            <div className="my-3 h-px bg-[#ced0d4]" />
            <h2 className="px-2 pb-2 text-[17px] font-bold text-[#65676b]">Lối tắt của bạn</h2>
            <div className="space-y-1">
                {shortcuts.map((shortcut, index) => (
                    <button key={shortcut} type="button" className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-[15px] font-semibold transition duration-200 hover:bg-[#e4e6eb]">
                        <Avatar label={shortcut.slice(0, 2).toUpperCase()} className={cx("h-9 w-9 text-[10px]", index % 2 ? "bg-slate-200" : "bg-sky-100")} />
                        <span className="line-clamp-2">{shortcut}</span>
                    </button>
                ))}
            </div>
        </aside>
    );
}

export function RightRail() {
    return (
        <aside className="fixed right-[max(16px,calc((100vw-1920px)/2+24px))] top-14 hidden h-[calc(100vh-56px)] w-[360px] overflow-y-auto px-3 py-5 2xl:block">
            <section className="rounded-xl bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-[17px] font-bold text-[#65676b]">Đang nổi bật</h2>
                    <button type="button" className="text-[14px] font-semibold text-[#1877f2]">Làm mới</button>
                </div>
                <div className="space-y-1">
                    {trends.map((trend, index) => (
                        <button key={trend.title} type="button" className="flex w-full items-start gap-3 rounded-lg p-2 text-left transition duration-200 hover:bg-[#f2f2f2]">
                            <span className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#e7f3ff] text-[#1877f2]">{index + 1}</span>
                            <span>
                                <span className="block font-semibold leading-5">{trend.title}</span>
                                <span className="block text-[13px] text-[#65676b]">{trend.meta}</span>
                            </span>
                        </button>
                    ))}
                </div>
            </section>

            <section className="mt-3 rounded-xl bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-[17px] font-bold text-[#65676b]">Gợi ý kết nối</h2>
                    <button type="button" className="text-[14px] font-semibold text-[#1877f2]">Xem tất cả</button>
                </div>
                <div className="space-y-3">
                    {[
                        { name: "Bảo Trân", avatar: "BT", mutual: "7 bạn chung" },
                        { name: "Minh Quân", avatar: "MQ", mutual: "Cùng 3 nhóm" },
                    ].map((person) => (
                        <div key={person.name} className="flex items-center gap-3 rounded-lg p-2 transition duration-200 hover:bg-[#f2f2f2]">
                            <Avatar label={person.avatar} className="h-13 w-13 bg-slate-300" />
                            <div className="min-w-0 flex-1">
                                <p className="font-semibold">{person.name}</p>
                                <p className="text-[13px] text-[#65676b]">{person.mutual}</p>
                                <div className="mt-2 flex gap-2">
                                    <button type="button" className="rounded-md bg-[#1877f2] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#166fe5]">Kết nối</button>
                                    <button type="button" className="rounded-md bg-[#e4e6eb] px-4 py-2 text-sm font-bold transition hover:bg-[#d8dadf]">Ẩn</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="mt-3 rounded-xl bg-white p-4 shadow-sm">
                <h2 className="mb-3 text-[17px] font-bold text-[#65676b]">Đang hoạt động</h2>
                <div className="grid grid-cols-5 gap-2">
                    {["LH", "TK", "BN", "HN", "TV", "QH", "MP", "AK", "TH", "GB"].map((avatar) => (
                        <div key={avatar} className="relative">
                            <Avatar label={avatar} className="h-10 w-10 bg-slate-200" />
                            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-[#31a24c]" />
                        </div>
                    ))}
                </div>
            </section>
        </aside>
    );
}

export function StoryStrip() {
    return (
        <section className="grid grid-cols-4 gap-2">
            {stories.map((story) => (
                <button key={story.name} type="button" className={cx("relative h-[150px] overflow-hidden rounded-xl bg-gradient-to-br p-3 text-left text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md", story.color)}>
                    <Avatar label={story.avatar} className="h-10 w-10 border-2 border-white bg-white/90 text-slate-700" />
                    {story.mine && (
                        <span className="absolute left-10 top-10 flex h-7 w-7 items-center justify-center rounded-full border-4 border-white bg-[#1877f2]">
                            <Plus size={15} />
                        </span>
                    )}
                    <span className="absolute inset-x-3 bottom-3 text-[13px] font-bold leading-4 drop-shadow">{story.name}</span>
                </button>
            ))}
        </section>
    );
}

export function FeedTabs() {
    return (
        <section className="grid grid-cols-3 rounded-xl bg-white p-1 shadow-sm">
            {["Dành cho bạn", "Đang theo dõi", "Mới nhất"].map((label, index) => (
                <button key={label} type="button" className={cx("h-10 rounded-lg text-[14px] font-bold transition duration-200", index === 0 ? "bg-[#e7f3ff] text-[#1877f2]" : "text-[#65676b] hover:bg-[#f2f2f2]")}>
                    {label}
                </button>
            ))}
        </section>
    );
}
