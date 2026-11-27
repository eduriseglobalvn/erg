import type { ComponentType } from "react"
import type { Editor } from "@tiptap/core"

export type PostMetadata = {
    id?: string
    slug?: string
    excerpt?: string
    categoryId?: string
    thumbnailUrl?: string | null
    status?: string
    seoScore?: number
    metaTitle?: string
    metaDescription?: string
    keywords?: string
    schemaType?: string
    focusKeyword?: string
    canonicalUrl?: string
    noindex?: boolean
    nofollow?: boolean
    updatedAt?: string
}

export type SelectionAttrs = Record<string, string | number | boolean | null | undefined>
export type EditorEngine = "canvas" | "blocknote"

export type EditorSelectionState =
    | {
        type: "image" | "section"
        attrs: SelectionAttrs
        pos: number
        nodeSize: number
    }
    | null

export interface VisualPostEditorWorkspaceProps {
    mode: "create" | "edit"
    postId?: string
    title: string
    onTitleChange: (value: string) => void
    initialContent?: string
    content: string
    onContentChange: (html: string) => void
    onStructuredContentChange?: (blocks: unknown[] | null) => void
    postMetadata: PostMetadata
    onMetadataChange: (data: Partial<PostMetadata>) => void
    onSave: () => void
    onSaveDraft?: () => void
    isSaving?: boolean
    isGenerating?: boolean
    aiProgress?: number
    onStartAi?: (topic: string) => void
    onRefine?: (text: string, prompt: string) => Promise<string | null>
    onEditorReady?: (editor: Editor) => void
}

export type BlockCategory = "Mẫu bài" | "Nội dung" | "Media" | "Bố cục" | "Giáo dục" | "Chuyển đổi" | "Tin tức" | "SEO/Trust"
export type CoursePreset = "courseArticle" | "courseHero" | "requirementsImage" | "benefitBand" | "pricingOffer" | "infoCard"

export type BlockTemplate = {
    id: string
    title: string
    description: string
    category: BlockCategory
    icon: ComponentType<{ className?: string }>
    html?: string
    command?: "image"
    preset?: CoursePreset
    layoutCommand?: "image-text-layout"
    layoutImagePosition?: "left" | "right"
}
