"use client"

import { useEffect, useRef, useState } from "react"
import { EditorContent, EditorContext, useEditor } from "@tiptap/react"
import { NodeSelection } from "@tiptap/pm/state"
import { Loader2 } from "lucide-react"
import { Toolbar } from "@/components/cms/shared/editor/tiptap-ui-primitive/toolbar"
import { AIBubbleMenu } from "@/components/cms/shared/editor/tiptap-ui/ai-bubble-menu"
import { useIsBreakpoint } from "@/hooks/use-breakpoint"
import { createSimpleEditorExtensions } from "./simple-editor-extensions"
import { MainToolbarContent, MobileToolbarContent } from "./simple-editor-toolbar"
import type { SimpleEditorProps } from "./simple-editor-types"

export function SimpleEditorShell({
    initialContent = "",
    onEditorReady,
    onRefine,
    onContentChange,
    onSelectionChange,
    title = "",
    onTitleChange,
    isRefining
}: SimpleEditorProps) {
    const isMobile = useIsBreakpoint()
    const [mobileView, setMobileView] = useState<"main" | "highlighter" | "link">(
        "main"
    )

    // [OPTIMIZATION] Dùng local state để gõ title mượt hơn
    const [localTitle, setLocalTitle] = useState(title);
    const syncTimeoutRef = useRef<any>(null);

    const emitSelection = (editor: any) => {
        if (!onSelectionChange) return;
        const { selection } = editor.state;

        if (selection instanceof NodeSelection && selection.node?.type?.name === "image") {
            onSelectionChange({
                type: "image",
                attrs: selection.node.attrs,
                pos: selection.from,
                nodeSize: selection.node.nodeSize,
            });
            return;
        }

        if (selection instanceof NodeSelection && selection.node?.type?.name === "ergSectionBlock") {
            onSelectionChange({
                type: "section",
                attrs: selection.node.attrs,
                pos: selection.from,
                nodeSize: selection.node.nodeSize,
            });
            return;
        }

        if (selection instanceof NodeSelection && selection.node?.type?.name === "imageTextBlock") {
            onSelectionChange({
                type: "section",
                attrs: selection.node.attrs,
                pos: selection.from,
                nodeSize: selection.node.nodeSize,
            });
            return;
        }

        const { $from } = selection;
        for (let depth = $from.depth; depth > 0; depth -= 1) {
            const node = $from.node(depth);
            if (node.type.name === "ergSectionBlock") {
                onSelectionChange({
                    type: "section",
                    attrs: node.attrs,
                    pos: $from.before(depth),
                    nodeSize: node.nodeSize,
                });
                return;
            }
            if (node.type.name === "imageTextBlock") {
                onSelectionChange({
                    type: "section",
                    attrs: node.attrs,
                    pos: $from.before(depth),
                    nodeSize: node.nodeSize,
                });
                return;
            }
        }

        onSelectionChange(null);
    };

    // Đồng bộ ngược từ Prop vào Local State 
    // Chỉ cập nhật khi tiêu đề thực sự khác biệt (để AI có thể đổ dữ liệu vào)
    useEffect(() => {
        if (title !== localTitle && title !== "") {
            setLocalTitle(title);
        }
    }, [title]);

    // [NEW] Debounced sync lên cha để tránh giật lag toàn bộ trang
    const debouncedSyncTitle = (val: string) => {
        if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
        syncTimeoutRef.current = setTimeout(() => {
            if (onTitleChange) onTitleChange(val);
        }, 1000); // Tăng lên 1s để gõ cho sướng, không làm phiền trang mẹ quá nhiều
    };

    // Dọn dẹp timeout
    useEffect(() => {
        return () => {
            if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
        };
    }, []);

    const editor = useEditor({
        immediatelyRender: false,
        editorProps: {
            attributes: {
                autocomplete: "off",
                autocorrect: "off",
                autocapitalize: "off",
                "aria-label": "Main content area, start typing to enter text.",
                class: "simple-editor",
            },
        },
        onCreate({ editor }) {
            if (onEditorReady) onEditorReady(editor);
            onContentChange?.(editor.getHTML());
            emitSelection(editor);
        },
        onUpdate({ editor }) {
            onContentChange?.(editor.getHTML());
            emitSelection(editor);
        },
        onSelectionUpdate({ editor }) {
            emitSelection(editor);
        },
        extensions: createSimpleEditorExtensions(),
        content: initialContent,
    })

    return (
        <div className="simple-editor-wrapper flex flex-col w-full h-full relative bg-white dark:bg-[#191919]">
            <EditorContext.Provider value={{ editor }}>

                {/* TOOLBAR Ở TRÊN CÙNG (Sticky mặc định do Flex Layout) */}
                <div className="shrink-0 border-b z-50 relative bg-white dark:bg-[#191919]">
                    <Toolbar className="w-full">
                        {mobileView === "main" ? (
                            <MainToolbarContent
                                onHighlighterClick={() => setMobileView("highlighter")}
                                onLinkClick={() => setMobileView("link")}
                                isMobile={isMobile}
                                editor={editor}
                            />
                        ) : (
                            <MobileToolbarContent
                                type={mobileView === "highlighter" ? "highlighter" : "link"}
                                onBack={() => setMobileView("main")}
                            />
                        )}
                    </Toolbar>
                </div>

                {/* VÙNG SCROLL CHỨA CẢ TITLE VÀ EDITOR */}
                <div className="flex-1 overflow-y-auto scroll-smooth relative">
                    {/* Refining Overlay */}
                    {isRefining && (
                        <div className="absolute inset-0 z-[60] bg-white/50 dark:bg-zinc-900/50 backdrop-blur-[1px] flex items-center justify-center">
                            <div className="flex flex-col items-center gap-2 bg-white dark:bg-zinc-800 p-4 rounded-xl shadow-2xl border animate-in fade-in zoom-in duration-200">
                                <Loader2 className="h-8 w-8 text-purple-600 animate-spin" />
                                <span className="text-sm font-medium text-purple-600">AI đang xử lý văn bản...</span>
                            </div>
                        </div>
                    )}

                    {editor && onRefine && (
                        <AIBubbleMenu editor={editor} onRefine={onRefine} />
                    )}

                    <div className="mx-auto min-h-full w-full max-w-[1280px] px-8 pt-10 pb-32">

                        {/* [NEW] TEXTAREA TITLE - Cực mượt với Debounced Sync */}
                        {onTitleChange && (
                            <textarea
                                className="mb-6 min-h-[50px] w-full resize-none overflow-hidden border-none bg-transparent p-0 text-left text-4xl font-extrabold leading-tight text-black outline-none placeholder:text-gray-300 focus:ring-0 dark:text-white"
                                placeholder="Tiêu đề bài viết..."
                                value={localTitle}
                                rows={1}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setLocalTitle(val); // HIỂN THỊ CỰC NHANH (KHÔNG DELAY)
                                    debouncedSyncTitle(val); // Đợi gõ xong mới báo lên cha

                                    // Auto resize height
                                    e.target.style.height = 'auto';
                                    e.target.style.height = e.target.scrollHeight + 'px';
                                }}
                                onBlur={() => {
                                    // Khi blur thì sync ngay lập tức để đảm bảo dữ liệu mới nhất
                                    if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
                                    onTitleChange(localTitle);
                                }}
                                onFocus={(e) => {
                                    e.target.style.height = 'auto';
                                    e.target.style.height = e.target.scrollHeight + 'px';
                                }}
                            />
                        )}

                        <EditorContent
                            editor={editor}
                            role="presentation"
                            className="simple-editor-content"
                        />
                    </div>
                </div>

            </EditorContext.Provider>
        </div>
    )
}

