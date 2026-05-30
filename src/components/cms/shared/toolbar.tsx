"use client"

import { type Editor } from '@tiptap/react'
import {
    Bold, Italic, Strikethrough, Code,
    AlignLeft, AlignCenter, AlignRight, AlignJustify,
    List, ListOrdered, CheckSquare, Quote,
    Image as ImageIcon, Link as LinkIcon,
    Undo, Redo, ChevronDown, Minus, Type,
    ListTree
} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/cms/ui/dropdown-menu"
import { Button } from "@/components/cms/ui/button"
import { useCallback } from 'react'

type ToolbarProps = {
    editor: Editor | null
}

export function Toolbar({ editor }: ToolbarProps) {
    // --- UTILS ---
    const addImage = useCallback(() => {
        if (!editor) return
        const url = window.prompt('URL hình ảnh:')
        if (url) editor.chain().focus().setImage({ src: url }).run()
    }, [editor])

    const setLink = useCallback(() => {
        if (!editor) return
        const previousUrl = editor.getAttributes('link').href
        const url = window.prompt('URL:', previousUrl)
        if (url === null) return
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run()
            return
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }, [editor])

    if (!editor) return null

    // Lấy label cho nút Heading Dropdown
    const getCurrentHeadingLabel = () => {
        if (editor.isActive('heading', { level: 1 })) return 'Heading 1'
        if (editor.isActive('heading', { level: 2 })) return 'Heading 2'
        if (editor.isActive('heading', { level: 3 })) return 'Heading 3'
        return 'Paragraph'
    }

    return (
        <div className="border-b flex flex-wrap items-center gap-1 p-1 sticky top-16 bg-white dark:bg-[#191919] z-40 transition-all">
            {/* 1. HISTORY */}
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
                <Undo className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
                <Redo className="w-4 h-4" />
            </Button>

            <div className="w-px h-5 bg-border mx-1" />

            {/* 2. HEADING DROPDOWN (Giống Demo) */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 gap-1 min-w-[100px] justify-between font-normal text-muted-foreground hover:text-foreground">
                        <span className="truncate text-xs">{getCurrentHeadingLabel()}</span>
                        <ChevronDown className="w-3 h-3 opacity-50" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                    <DropdownMenuItem onClick={() => editor.chain().focus().setParagraph().run()} className={editor.isActive('paragraph') ? 'bg-accent' : ''}>
                        <Type className="w-4 h-4 mr-2" /> Paragraph
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editor.isActive('heading', { level: 1 }) ? 'bg-accent' : ''}>
                        <h1 className="text-lg font-bold mr-2">H1</h1> Heading 1
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'bg-accent' : ''}>
                        <h2 className="text-base font-bold mr-2">H2</h2> Heading 2
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={editor.isActive('heading', { level: 3 }) ? 'bg-accent' : ''}>
                        <h3 className="text-sm font-bold mr-2">H3</h3> Heading 3
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Insert TOC Button */}
            <Button variant="ghost" size="icon" className="h-8 w-8" title="Chèn Mục lục" onClick={() => editor?.chain().focus().insertContent('<toc-node></toc-node>').run()}>
                <ListTree className="w-4 h-4" />
            </Button>

            <div className="w-px h-5 bg-border mx-1" />

            {/* 3. LIST DROPDOWN */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 gap-1 px-2" data-active={editor.isActive('bulletList') || editor.isActive('orderedList')}>
                        <List className="w-4 h-4" />
                        <ChevronDown className="w-3 h-3 opacity-50" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'bg-accent' : ''}>
                        <List className="w-4 h-4 mr-2" /> Bullet List
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'bg-accent' : ''}>
                        <ListOrdered className="w-4 h-4 mr-2" /> Ordered List
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => editor.chain().focus().toggleTaskList().run()} className={editor.isActive('taskList') ? 'bg-accent' : ''}>
                        <CheckSquare className="w-4 h-4 mr-2" /> Task List
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* 4. BASIC FORMAT */}
            <Button variant={editor.isActive('bold') ? "secondary" : "ghost"} size="icon" className="h-8 w-8" onClick={() => editor.chain().focus().toggleBold().run()}>
                <Bold className="w-4 h-4" />
            </Button>
            <Button variant={editor.isActive('italic') ? "secondary" : "ghost"} size="icon" className="h-8 w-8" onClick={() => editor.chain().focus().toggleItalic().run()}>
                <Italic className="w-4 h-4" />
            </Button>
            <Button variant={editor.isActive('codeBlock') ? "secondary" : "ghost"} size="icon" className="h-8 w-8" onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
                <Code className="w-4 h-4" />
            </Button>

            <div className="w-px h-5 bg-border mx-1" />

            {/* 5. MEDIA */}
            <Button variant={editor.isActive('link') ? "secondary" : "ghost"} size="icon" className="h-8 w-8" onClick={setLink}>
                <LinkIcon className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={addImage}>
                <ImageIcon className="w-4 h-4" />
            </Button>
            <Button variant={editor.isActive('blockquote') ? "secondary" : "ghost"} size="icon" className="h-8 w-8" onClick={() => editor.chain().focus().toggleBlockquote().run()}>
                <Quote className="w-4 h-4" />
            </Button>

        </div >
    )
}
