"use client"

import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Typography from '@tiptap/extension-typography'
import TextAlign from '@tiptap/extension-text-align'
// Extension quan trọng cho Code Block
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { common, createLowlight } from 'lowlight'

import { Toolbar } from './toolbar'

const lowlight = createLowlight(common)

export default function SimpleEditor({ content, onChange }: { content: string, onChange: (html: string) => void }) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3] },
                codeBlock: false, // Tắt mặc định để dùng cái xịn hơn bên dưới
            }),
            // Kích hoạt Code Block xịn (có màu mè)
            CodeBlockLowlight.configure({
                lowlight,
            }),
            Typography,
            Image.configure({ inline: true, allowBase64: true, HTMLAttributes: { class: 'rounded-lg border shadow-sm max-w-full my-4' } }),
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            TaskList,
            TaskItem.configure({ nested: true }),
            Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-primary underline cursor-pointer' } }),
            Placeholder.configure({ placeholder: 'Nhập nội dung bài viết...' }),
        ],
        content,
        editorProps: {
            attributes: {
                // CSS chuẩn để Code Block hiển thị nền tối
                class: 'prose prose-stone dark:prose-invert max-w-none focus:outline-none min-h-[60vh] text-lg leading-relaxed [&_pre]:bg-zinc-100 dark:[&_pre]:bg-zinc-900 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:font-mono [&_pre]:text-sm',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        immediatelyRender: false,
    })

    return (
        <div className="flex flex-col w-full relative border rounded-lg overflow-hidden bg-white dark:bg-[#191919] shadow-sm">
            <Toolbar editor={editor} />
            <div className="px-6 py-4" onClick={() => editor?.chain().focus().run()}>
                <EditorContent editor={editor} />
            </div>
        </div>
    )
}