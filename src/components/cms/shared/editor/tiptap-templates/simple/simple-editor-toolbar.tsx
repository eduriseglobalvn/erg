"use client"

import { Button } from "@/components/cms/shared/editor/tiptap-ui-primitive/button"
import { Spacer } from "@/components/cms/shared/editor/tiptap-ui-primitive/spacer"
import { ToolbarGroup, ToolbarSeparator } from "@/components/cms/shared/editor/tiptap-ui-primitive/toolbar"
import { HeadingDropdownMenu } from "@/components/cms/shared/editor/tiptap-ui/heading-dropdown-menu"
import { ImageUploadButton } from "@/components/cms/shared/editor/tiptap-ui/image-upload-button"
import { ListDropdownMenu } from "@/components/cms/shared/editor/tiptap-ui/list-dropdown-menu"
import { BlockquoteButton } from "@/components/cms/shared/editor/tiptap-ui/blockquote-button"
import { CodeBlockButton } from "@/components/cms/shared/editor/tiptap-ui/code-block-button"
import { ColorHighlightPopover, ColorHighlightPopoverContent, ColorHighlightPopoverButton } from "@/components/cms/shared/editor/tiptap-ui/color-highlight-popover"
import { LinkPopover, LinkContent, LinkButton } from "@/components/cms/shared/editor/tiptap-ui/link-popover"
import { MarkButton } from "@/components/cms/shared/editor/tiptap-ui/mark-button"
import { TextAlignButton } from "@/components/cms/shared/editor/tiptap-ui/text-align-button"
import { UndoRedoButton } from "@/components/cms/shared/editor/tiptap-ui/undo-redo-button"
import { ArrowLeftIcon } from "@/components/cms/shared/editor/tiptap-icons/arrow-left-icon"
import { HighlighterIcon } from "@/components/cms/shared/editor/tiptap-icons/highlighter-icon"
import { LinkIcon } from "@/components/cms/shared/editor/tiptap-icons/link-icon"
import { ThemeToggle } from "./theme-toggle"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/cms/ui/dropdown-menu"
import { ChevronDown, ListTree } from "lucide-react"

export const MainToolbarContent = ({
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
                <ImageUploadButton text="Ảnh" />
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

export const MobileToolbarContent = ({
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
