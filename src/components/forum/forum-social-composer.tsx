"use client"

import { Film, Image as ImageIcon, Laugh } from "lucide-react"
import { currentUser } from "./forum-social-data"
import { Avatar } from "./forum-social-primitives"

export function Composer({ value, onChange, onSubmit }: { value: string; onChange: (value: string) => void; onSubmit: () => void }) {
    return (
        <section className="rounded-xl bg-white p-3 shadow-sm">
            <div className="flex gap-2">
                <Avatar label={currentUser.avatar} className="bg-[linear-gradient(135deg,#111827,#60a5fa)] text-white" />
                <input
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === "Enter") onSubmit();
                    }}
                    placeholder={`${currentUser.name} ơi, bạn muốn chia sẻ gì?`}
                    className="h-10 min-w-0 flex-1 rounded-full bg-[#f0f2f5] px-4 text-[15px] outline-none transition hover:bg-[#e4e6eb] focus:bg-[#e4e6eb] focus:ring-2 focus:ring-[#1877f2]/20"
                />
                <button type="button" onClick={onSubmit} className="rounded-full bg-[#1877f2] px-4 text-sm font-bold text-white transition duration-200 hover:bg-[#166fe5] disabled:opacity-50" disabled={!value.trim()}>
                    Đăng
                </button>
            </div>
            <div className="mt-3 grid grid-cols-3 border-t border-[#e4e6eb] pt-2">
                {[
                    ["Video trực tiếp", Film, "text-[#f3425f]"],
                    ["Ảnh/video", ImageIcon, "text-[#45bd62]"],
                    ["Cảm xúc", Laugh, "text-[#f7b928]"],
                ].map(([label, Icon, color]) => {
                    const ActionIcon = Icon as typeof Film;
                    return (
                        <button key={String(label)} type="button" className="flex h-10 items-center justify-center gap-2 rounded-lg text-[15px] font-semibold text-[#65676b] transition duration-200 hover:bg-[#f2f2f2]">
                            <ActionIcon size={22} className={String(color)} />
                            <span className="hidden sm:inline">{String(label)}</span>
                        </button>
                    );
                })}
            </div>
        </section>
    );
}
