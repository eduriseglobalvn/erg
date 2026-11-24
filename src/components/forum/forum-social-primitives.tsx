"use client"

import { reactions } from "./forum-social-data"
import { cx, topReactionIcons } from "./forum-social-model"
import type { Post, ReactionKey } from "./forum-social-types"

export function Avatar({ label, className }: { label: string; className?: string }) {
    return (
        <div className={cx("flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-200 text-[12px] font-bold text-slate-700 ring-1 ring-black/5", className)}>
            {label}
        </div>
    );
}

export function ReactionBadge({ reactionMap }: { reactionMap: Partial<Record<ReactionKey, number>> }) {
    const icons = topReactionIcons(reactionMap);
    return (
        <span className="flex items-center">
            {icons.map((reaction, index) => (
                <span key={reaction.key} className="flex h-5 w-5 items-center justify-center rounded-full border border-white bg-white text-[13px] shadow-sm" style={{ marginLeft: index ? -5 : 0 }}>
                    {reaction.icon}
                </span>
            ))}
        </span>
    );
}

export function ReactionPicker({ onPick }: { onPick: (reaction: ReactionKey) => void }) {
    return (
        <div className="pointer-events-none absolute bottom-full left-0 z-20 mb-2 flex translate-y-2 gap-1 rounded-full bg-white px-2 py-1.5 opacity-0 shadow-[0_8px_24px_rgba(15,23,42,0.22)] ring-1 ring-black/5 transition-all duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
            {reactions.map((reaction, index) => (
                <button
                    key={reaction.key}
                    type="button"
                    className="h-10 w-10 rounded-full text-[28px] transition duration-150 hover:-translate-y-2 hover:scale-125 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1877f2]"
                    style={{ transitionDelay: `${index * 18}ms` }}
                    onClick={() => onPick(reaction.key)}
                    aria-label={reaction.label}
                >
                    {reaction.icon}
                </button>
            ))}
        </div>
    );
}

export function SocialImage({ variant, compact = false }: { variant: Post["image"]; compact?: boolean }) {
    if (variant === "discussion") {
        return (
            <div className={cx("relative overflow-hidden bg-[#dfe8fb]", compact ? "h-[230px]" : "h-[380px]")}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(24,119,242,0.18),transparent_24%),radial-gradient(circle_at_78%_30%,rgba(34,197,94,0.18),transparent_28%),linear-gradient(135deg,#eff6ff,#f8fafc)]" />
                <div className="absolute left-[8%] top-[16%] w-[48%] rounded-2xl bg-white p-5 shadow-xl">
                    <div className="mb-3 h-3 w-28 rounded-full bg-slate-200" />
                    <div className="space-y-2">
                        <div className="h-3 rounded-full bg-blue-100" />
                        <div className="h-3 w-5/6 rounded-full bg-blue-100" />
                        <div className="h-3 w-3/5 rounded-full bg-blue-100" />
                    </div>
                </div>
                <div className="absolute bottom-[14%] right-[8%] w-[42%] rounded-2xl bg-[#1877f2] p-5 text-white shadow-xl">
                    <p className="text-lg font-bold">Thảo luận nổi bật</p>
                    <p className="mt-2 text-sm text-white/85">Hỏi nhanh, trả lời gọn, lưu lại khi cần.</p>
                </div>
            </div>
        );
    }

    if (variant === "poll") {
        return (
            <div className={cx("bg-white px-5 py-5", compact ? "min-h-[220px]" : "min-h-[300px]")}>
                {["Nghe podcast", "Đọc bài ngắn", "Shadowing"].map((label, index) => (
                    <div key={label} className="mb-3 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                        <div className="flex items-center justify-between px-4 py-3 text-sm font-semibold">
                            <span>{label}</span>
                            <span>{[34, 22, 44][index]}%</span>
                        </div>
                        <div className="h-2 bg-slate-100">
                            <div className="h-full rounded-r-full bg-[#1877f2]" style={{ width: `${[34, 22, 44][index]}%` }} />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className={cx("relative overflow-hidden bg-[linear-gradient(135deg,#0f172a,#2563eb_48%,#c7d2fe)]", compact ? "h-[230px]" : "h-[360px]")}>
            <div className="absolute inset-x-[8%] bottom-[14%] rounded-2xl bg-white/92 p-5 shadow-2xl backdrop-blur">
                <p className="text-xl font-black text-slate-950">Workflow gọn hơn mỗi ngày</p>
                <p className="mt-2 text-sm text-slate-600">Một ví dụ mock cho bài viết dạng chia sẻ kinh nghiệm.</p>
            </div>
        </div>
    );
}
