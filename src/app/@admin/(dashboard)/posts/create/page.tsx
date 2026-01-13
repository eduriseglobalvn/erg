"use client"

import { SimpleEditor } from "@/components/admin/shared/editor/tiptap-templates/simple/simple-editor"
import { PostSidebar } from "@/components/admin/shared/post-sidebar"

export default function CreatePostPage() {
    return (
        // Container chính: Chiều cao = 100vh - Header (4rem/64px)
        <div className="flex h-[calc(100vh-4rem)] w-full bg-white dark:bg-[#191919] overflow-hidden">

            {/* CỘT EDITOR (Trái) */}
            <main className="flex-1 flex flex-col min-w-0 relative h-full">
                {/* Ở đây ta KHÔNG dùng overflow-y-auto nữa,
                   vì SimpleEditor bên trong đã tự xử lý việc cuộn nội dung rồi.
                   Ta chỉ cần truyền Title vào nếu muốn Title nằm ngoài vùng cuộn của Editor (như Header 2)
                   hoặc để SimpleEditor lo hết.
                */}

                {/* Nếu bạn muốn Tiêu đề to nằm TRÊN toolbar (không bị cuộn mất): */}
                <br/>

                {/* Phần Editor (Chứa Toolbar + Nội dung cuộn) */}
                <div className="flex-1 min-h-0 relative border-t">
                    <SimpleEditor />
                </div>
            </main>

            {/* CỘT SIDEBAR (Phải) */}
            <aside className="w-[350px] border-l hidden lg:block shrink-0 h-full overflow-hidden z-10 bg-gray-50/30">
                <PostSidebar />
            </aside>
        </div>
    )
}