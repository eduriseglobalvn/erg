"use client"

import { useState, useEffect, useRef } from "react"
import { EditorContent, EditorContext, useEditor, Extension } from "@tiptap/react"

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit"
import { TaskItem, TaskList } from "@tiptap/extension-list"
import { TextAlign } from "@tiptap/extension-text-align"
import { Typography } from "@tiptap/extension-typography"
import { Highlight } from "@tiptap/extension-highlight"
import { Subscript } from "@tiptap/extension-subscript"
import { Superscript } from "@tiptap/extension-superscript"
import { Selection } from "@tiptap/extensions"
import BubbleMenuExtension from '@tiptap/extension-bubble-menu'
import { TextStyle } from "@tiptap/extension-text-style"
import { FontFamily } from "@tiptap/extension-font-family"

// --- UI Primitives ---
import { Button } from "@/components/admin/shared/editor/tiptap-ui-primitive/button"
import { Spacer } from "@/components/admin/shared/editor/tiptap-ui-primitive/spacer"
import {
    Toolbar,
    ToolbarGroup,
    ToolbarSeparator,
} from "@/components/admin/shared/editor/tiptap-ui-primitive/toolbar"

// --- Tiptap Node ---
import { ImageNode } from "@/components/admin/shared/editor/tiptap-node/image-node/image-node-extension"
import { ImageUploadNode } from "@/components/admin/shared/editor/tiptap-node/image-upload-node/image-upload-node-extension"
import { HorizontalRule } from "@/components/admin/shared/editor/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension"
import { HeadingWithAnchor } from "@/components/admin/shared/editor/tiptap-extension/heading-with-anchor"
import { TableOfContentsNode } from "@/components/admin/shared/editor/tiptap-extension/table-of-contents-node"
import "@/components/admin/shared/editor/tiptap-node/blockquote-node/blockquote-node.scss"
import "@/components/admin/shared/editor/tiptap-node/code-block-node/code-block-node.scss"
import "@/components/admin/shared/editor/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss"
import "@/components/admin/shared/editor/tiptap-node/list-node/list-node.scss"
import "@/components/admin/shared/editor/tiptap-node/image-node/image-node.scss"
import "@/components/admin/shared/editor/tiptap-node/heading-node/heading-node.scss"
import "@/components/admin/shared/editor/tiptap-node/paragraph-node/paragraph-node.scss"

// --- Tiptap UI ---
import { HeadingDropdownMenu } from "@/components/admin/shared/editor/tiptap-ui/heading-dropdown-menu"
import { ImageUploadButton } from "@/components/admin/shared/editor/tiptap-ui/image-upload-button"
import { ListDropdownMenu } from "@/components/admin/shared/editor/tiptap-ui/list-dropdown-menu"
import { BlockquoteButton } from "@/components/admin/shared/editor/tiptap-ui/blockquote-button"
import { CodeBlockButton } from "@/components/admin/shared/editor/tiptap-ui/code-block-button"
import {
    ColorHighlightPopover,
    ColorHighlightPopoverContent,
    ColorHighlightPopoverButton,
} from "@/components/admin/shared/editor/tiptap-ui/color-highlight-popover"
import {
    LinkPopover,
    LinkContent,
    LinkButton,
} from "@/components/admin/shared/editor/tiptap-ui/link-popover"
import { MarkButton } from "@/components/admin/shared/editor/tiptap-ui/mark-button"
import { TextAlignButton } from "@/components/admin/shared/editor/tiptap-ui/text-align-button"
import { UndoRedoButton } from "@/components/admin/shared/editor/tiptap-ui/undo-redo-button"
// [NEW] Import AI Bubble Menu
import { AIBubbleMenu } from "@/components/admin/shared/editor/tiptap-ui/ai-bubble-menu"

// --- Icons ---
import { ArrowLeftIcon } from "@/components/admin/shared/editor/tiptap-icons/arrow-left-icon"
import { HighlighterIcon } from "@/components/admin/shared/editor/tiptap-icons/highlighter-icon"
import { LinkIcon } from "@/components/admin/shared/editor/tiptap-icons/link-icon"
import { ChevronDown, Loader2, Sparkles, ListTree } from "lucide-react"

// --- Hooks ---
import { useIsBreakpoint } from "@/hooks/use-breakpoint"

// --- Components ---
import { ThemeToggle } from "@/components/admin/shared/editor/tiptap-templates/simple/theme-toggle"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/admin/ui/dropdown-menu"

// --- Lib ---
import { handleImageUpload, MAX_FILE_SIZE } from "@/lib/tiptap-utils"

// --- Styles ---
import "@/components/admin/shared/editor/tiptap-templates/simple/simple-editor.scss"

// BỔ SUNG: Custom FontSize Extension
const FontSize = Extension.create({
    name: 'fontSize',
    addOptions() { return { types: ['textStyle'] } },
    addGlobalAttributes() {
        return [{
            types: this.options.types,
            attributes: {
                fontSize: {
                    default: null,
                    parseHTML: element => element.style.fontSize.replace(/['"]+/g, ''),
                    renderHTML: attributes => {
                        if (!attributes.fontSize) return {}
                        return { style: `font-size: ${attributes.fontSize}` }
                    },
                },
            },
        }]
    },
    addCommands() {
        return {
            setFontSize: (fontSize: string) => ({ chain }: any) => chain().setMark('textStyle', { fontSize }).run(),
            unsetFontSize: () => ({ chain }: any) => chain().setMark('textStyle', { fontSize: null }).run(),
        }
    },
})

const MainToolbarContent = ({
    onHighlighterClick,
    onLinkClick,
    isMobile,
    editor,
}: {
    onHighlighterClick: () => void
    onLinkClick: () => void
    isMobile: boolean
    editor: any
}) => {
    // CẬP NHẬT: Dữ liệu Font có thêm "Mặc định"
    const fonts = [
        { name: 'Mặc định', value: '' },
        { name: 'Inter', value: 'Inter, sans-serif' },
        { name: 'Lora (Serif)', value: 'Lora, serif' },
        { name: 'Mono', value: '"JetBrains Mono", monospace' },
        { name: 'Oswald', value: 'Oswald, sans-serif' },
    ]

    // CẬP NHẬT: Bảng Size chuẩn từ 8px - 72px
    const sizes = ['8px', '10px', '12px', '14px', '16px', '18px', '20px', '24px', '30px', '36px', '48px', '60px', '72px']

    if (!editor) return null

    // LOGIC CẬP NHẬT LABEL THEO TRẠNG THÁI ACTIVE
    const currentFontAttr = editor.getAttributes('textStyle').fontFamily
    const currentFont = fonts.find(f => f.value === currentFontAttr)?.name || (currentFontAttr ? 'Custom' : 'Mặc định')
    const currentSize = editor.getAttributes('textStyle').fontSize || '16px'

    return (
        <>
            <ToolbarGroup>
                <UndoRedoButton action="undo" />
                <UndoRedoButton action="redo" />
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup>
                {/* CẬP NHẬT: Heading hỗ trợ từ 1 - 6 */}
                <HeadingDropdownMenu levels={[1, 2, 3, 4, 5, 6]} portal={isMobile} />

                {/* Font Family Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button data-style="ghost" className="h-8 gap-1 px-2 font-normal min-w-[90px] justify-between border">
                            <span className="truncate text-[11px]">{currentFont}</span>
                            <ChevronDown className="h-3 w-3 opacity-50" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="max-h-60 overflow-y-auto">
                        {fonts.map((font) => (
                            <DropdownMenuItem
                                key={font.name}
                                onClick={() => font.value ? editor.chain().focus().setFontFamily(font.value).run() : editor.chain().focus().unsetFontFamily().run()}
                                style={{ fontFamily: font.value }}
                            >
                                {font.name}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Font Size Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button data-style="ghost" className="h-8 gap-1 px-2 font-normal min-w-[65px] justify-between border">
                            <span className="truncate text-[11px]">{currentSize}</span>
                            <ChevronDown className="h-3 w-3 opacity-50" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="max-h-60 overflow-y-auto">
                        {sizes.map((size) => (
                            <DropdownMenuItem key={size} onClick={() => editor.chain().focus().setFontSize(size).run()}>
                                {size}
                            </DropdownMenuItem>
                        ))}
                        <DropdownMenuItem onClick={() => editor.chain().focus().unsetFontSize().run()}>
                            Mặc định
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <ListDropdownMenu
                    types={["bulletList", "orderedList", "taskList"]}
                    portal={isMobile}
                />
                <BlockquoteButton />
                <CodeBlockButton />
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup>
                <MarkButton type="bold" />
                <MarkButton type="italic" />
                <MarkButton type="strike" />
                <MarkButton type="code" />
                <MarkButton type="underline" />
                {!isMobile ? (
                    <ColorHighlightPopover />
                ) : (
                    <ColorHighlightPopoverButton onClick={onHighlighterClick} />
                )}
                {!isMobile ? <LinkPopover /> : <LinkButton onClick={onLinkClick} />}
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup>
                <MarkButton type="superscript" />
                <MarkButton type="subscript" />
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup>
                <TextAlignButton align="left" />
                <TextAlignButton align="center" />
                <TextAlignButton align="right" />
                <TextAlignButton align="justify" />
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup>
                <ImageUploadButton text="Add" />
                <Button
                    data-style="ghost"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground border"
                    title="Chèn Mục lục"
                    onClick={() => editor.chain().focus().insertContent('<toc-node></toc-node>').run()}
                >
                    <ListTree className="h-4 w-4" />
                </Button>
            </ToolbarGroup>

            <Spacer />

            {isMobile && <ToolbarSeparator />}

            <ToolbarGroup>
                <ThemeToggle />
            </ToolbarGroup>
        </>
    )
}

const MobileToolbarContent = ({
    type,
    onBack,
}: {
    type: "highlighter" | "link"
    onBack: () => void
}) => (
    <>
        <ToolbarGroup>
            <Button data-style="ghost" onClick={onBack}>
                <ArrowLeftIcon className="tiptap-button-icon" />
                {type === "highlighter" ? (
                    <HighlighterIcon className="tiptap-button-icon" />
                ) : (
                    <LinkIcon className="tiptap-button-icon" />
                )}
            </Button>
        </ToolbarGroup>

        <ToolbarSeparator />

        {type === "highlighter" ? (
            <ColorHighlightPopoverContent />
        ) : (
            <LinkContent />
        )}
    </>
)

// [UPDATE] Thêm props title và onTitleChange
interface SimpleEditorProps {
    initialContent?: string;
    onEditorReady?: (editor: any) => void;
    onRefine?: (text: string, prompt: string) => Promise<string | null>;
    title?: string;
    onTitleChange?: (value: string) => void;
    isRefining?: boolean;
}

export function SimpleEditor({
    initialContent = "",
    onEditorReady,
    onRefine,
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
        },
        extensions: [
            StarterKit.configure({
                heading: false, // Tắt mặc định
                horizontalRule: false,
                link: {
                    openOnClick: false,
                    enableClickSelection: true,
                },
            }),
            HeadingWithAnchor.configure({
                levels: [1, 2, 3, 4, 5, 6],
            }),
            TableOfContentsNode,
            TextStyle,
            FontFamily,
            FontSize,
            HorizontalRule,
            TextAlign.configure({ types: ["heading", "paragraph"] }),
            TaskList,
            TaskItem.configure({ nested: true }),
            Highlight.configure({ multicolor: true }),
            ImageNode,
            Typography,
            Superscript,
            Subscript,
            Selection,
            ImageUploadNode.configure({
                accept: "image/*",
                maxSize: MAX_FILE_SIZE,
                limit: 3,
                upload: handleImageUpload,
                onError: (error) => console.error("Upload failed:", error),
            }),
            BubbleMenuExtension.configure({
                pluginKey: 'bubbleMenuAI',
            }),
        ],
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

                    <div className="max-w-[1100px] mx-auto px-12 pt-16 pb-32 min-h-full">

                        {/* [NEW] TEXTAREA TITLE - Cực mượt với Debounced Sync */}
                        {onTitleChange && (
                            <textarea
                                className="text-4xl font-extrabold w-full outline-none bg-transparent placeholder:text-gray-300 text-black dark:text-white mb-8 border-none p-0 focus:ring-0 resize-none overflow-hidden min-h-[50px] leading-tight text-center"
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