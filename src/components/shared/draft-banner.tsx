"use client"

import { Info, X, Zap } from "lucide-react"

export function DraftBanner() {
    return (
        <div className="bg-[#fff9c4] border-b border-[#fbc02d] py-2 px-4 shadow-sm">
            <div className="container mx-auto max-w-7xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-[#fbc02d] p-1.5 rounded-full">
                        <Zap size={14} className="text-[#333] fill-current" />
                    </div>
                    <div>
                        <span className="font-bold text-[#333] text-sm md:text-base">
                            BẠN ĐANG XEM BẢN NHÁP (PREVIEW MODE)
                        </span>
                        <p className="text-[11px] md:text-xs text-[#666] font-medium leading-none mt-0.5">
                            Nội dung này chưa được xuất bản chính thức. Mọi thay đổi sẽ không hiển thị với khách hàng.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="hidden md:flex items-center gap-1.5 bg-black/5 px-2 py-1 rounded text-[11px] font-bold text-[#333]">
                        <Info size={12} />
                        LIVE PREVIEW ACTIVE
                    </div>
                </div>
            </div>
        </div>
    )
}
