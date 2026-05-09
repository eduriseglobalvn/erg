"use client"

import { useEffect, useMemo, useState, type ComponentType, type ReactNode } from "react"
import dynamic from "next/dynamic"
import type { Content, Editor } from "@tiptap/core"
import type { Node as ProseMirrorNode } from "@tiptap/pm/model"
import {
    ArrowDown,
    ArrowLeft,
    ArrowUp,
    Award,
    Bot,
    CalendarDays,
    CheckCircle2,
    Columns2,
    Copy,
    FileText,
    GalleryHorizontal,
    HelpCircle,
    Image as ImageIcon,
    LayoutTemplate,
    Link2,
    ListChecks,
    Monitor,
    Palette,
    PanelRight,
    PanelRightClose,
    Quote,
    Rows3,
    Save,
    Search,
    Send,
    Settings2,
    Smartphone,
    Sparkles,
    SquareStack,
    Table2,
    Tablet,
    Trash2,
    Video,
    Wand2,
} from "lucide-react"
import { Badge } from "@/components/admin/ui/badge"
import { Button } from "@/components/admin/ui/button"
import { Input } from "@/components/admin/ui/input"
import { Label } from "@/components/admin/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/admin/ui/select"
import { Slider } from "@/components/admin/ui/slider"
import { Textarea } from "@/components/admin/ui/textarea"
import { PostSidebarTaxonomy } from "@/components/admin/shared/post-sidebar-taxonomy"
import { PostContentRenderer } from "@/components/shared/post-content-renderer"
import { cn } from "@/lib/utils"
import { localSeoAnalyzer } from "@/utils/local-seo"
import type { BlockNoteEditorBridge } from "@/components/admin/posts/blocknote-post-editor"

const SimpleEditor = dynamic(
    () => import("@/components/admin/shared/editor/tiptap-templates/simple/simple-editor").then(m => ({ default: m.SimpleEditor })),
    {
        ssr: false,
        loading: () => (
            <div className="flex h-full w-full items-center justify-center bg-white">
                <div className="h-72 w-full max-w-4xl animate-pulse rounded-2xl bg-zinc-100" />
            </div>
        ),
    }
)

const BlockNotePostEditor = dynamic(
    () => import("@/components/admin/posts/blocknote-post-editor"),
    {
        ssr: false,
        loading: () => (
            <div className="flex h-full w-full items-center justify-center bg-white">
                <div className="h-72 w-full max-w-4xl animate-pulse rounded-2xl bg-zinc-100" />
            </div>
        ),
    }
)

const AiWriterBar = dynamic(
    () => import("@/components/admin/shared/editor/tiptap-ui/ai-writer-bar").then(m => ({ default: m.AiWriterBar })),
    { ssr: false }
)

type PostMetadata = {
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

type SelectionAttrs = Record<string, string | number | boolean | null | undefined>
type EditorEngine = "canvas" | "blocknote"

export type EditorSelectionState =
    | {
        type: "image" | "section"
        attrs: SelectionAttrs
        pos: number
        nodeSize: number
    }
    | null

interface VisualPostEditorWorkspaceProps {
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

type BlockCategory = "Mẫu bài" | "Nội dung" | "Media" | "Bố cục" | "Giáo dục" | "Chuyển đổi" | "Tin tức" | "SEO/Trust"
type CoursePreset = "courseArticle" | "courseHero" | "requirementsImage" | "benefitBand" | "pricingOffer" | "infoCard"

type BlockTemplate = {
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

const blockTemplates: BlockTemplate[] = [
    {
        id: "course-article-preset",
        title: "Mẫu bài khóa học đầy đủ",
        description: "Dựng nhanh bài giống mẫu Edusa: hero, chữ + ảnh, nền xanh, lợi ích, bảng giá và CTA.",
        category: "Mẫu bài",
        icon: LayoutTemplate,
        preset: "courseArticle",
    },
    {
        id: "course-hero-split",
        title: "Hero khóa học + ảnh",
        description: "Hero xanh ERG có ảnh chứng chỉ, thông điệp lợi ích và CTA nổi bật.",
        category: "Mẫu bài",
        icon: Award,
        preset: "courseHero",
    },
    {
        id: "course-requirements-image",
        title: "Chữ trái + ảnh phải",
        description: "Layout chuẩn cho đoạn văn/bullet nằm cùng hàng với ảnh như bài mẫu.",
        category: "Mẫu bài",
        icon: Columns2,
        preset: "requirementsImage",
    },
    {
        id: "course-benefit-band",
        title: "Nền xanh + lợi ích",
        description: "Section nền xanh nhạt, chữ và ảnh nằm ngang hàng, tự xếp dọc trên mobile.",
        category: "Mẫu bài",
        icon: CheckCircle2,
        preset: "benefitBand",
    },
    {
        id: "course-pricing-offer",
        title: "Ảnh + bảng giá/CTA",
        description: "Khối ưu đãi: ảnh bên trái, card nội dung/giá/CTA bên phải.",
        category: "Mẫu bài",
        icon: SquareStack,
        preset: "pricingOffer",
    },
    {
        id: "course-info-card",
        title: "Card bullet nổi bật",
        description: "Card gọn để gom lý do chọn ERG, cam kết hoặc điều kiện tham gia.",
        category: "Mẫu bài",
        icon: ListChecks,
        preset: "infoCard",
    },
    {
        id: "hero",
        title: "Hero ERG",
        description: "Mở đầu nổi bật, có CTA và lời hứa giá trị.",
        category: "Bố cục",
        icon: LayoutTemplate,
        html: `
<section data-erg-block="hero" data-bg="brand" data-tone="dark" data-width="wide" data-accent="red" class="erg-block erg-block-hero">
  <p class="erg-eyebrow">ERG EDURISE GLOBAL</p>
  <h2>Khóa học và chương trình đào tạo tại ERG</h2>
  <p>Thiết kế phần mở đầu rõ lợi ích, có hình dung nhanh về kết quả học tập và dẫn người đọc tới hành động tiếp theo.</p>
  <p><a href="#dang-ky">Đăng ký tư vấn</a></p>
</section>
`,
    },
    {
        id: "rich-text",
        title: "Đoạn nội dung",
        description: "Heading, đoạn văn và nhịp đọc chuẩn bài viết.",
        category: "Nội dung",
        icon: FileText,
        html: `
<section data-erg-block="rich-text" data-bg="plain" data-tone="light" data-width="normal" data-accent="blue" class="erg-block erg-block-rich-text">
  <h2>Tiêu đề phần nội dung</h2>
  <p>Viết nội dung chính của phần này. Hãy tập trung vào một ý lớn, ngắn gọn và dễ quét đọc.</p>
</section>
`,
    },
    {
        id: "checklist",
        title: "Checklist",
        description: "Danh sách việc cần nhớ hoặc tiêu chí tham gia.",
        category: "Nội dung",
        icon: ListChecks,
        html: `
<section data-erg-block="checklist" data-bg="soft" data-tone="light" data-width="normal" data-accent="blue" class="erg-block erg-block-checklist">
  <h2>Những điểm cần chuẩn bị</h2>
  <ul data-type="taskList">
    <li data-checked="false"><label><input type="checkbox" /></label><div><p>Xác định mục tiêu học tập hoặc công việc cần cải thiện.</p></div></li>
    <li data-checked="false"><label><input type="checkbox" /></label><div><p>Chuẩn bị lịch học phù hợp để duy trì tiến độ.</p></div></li>
    <li data-checked="false"><label><input type="checkbox" /></label><div><p>Trao đổi với ERG để được gợi ý lộ trình phù hợp.</p></div></li>
  </ul>
</section>
`,
    },
    {
        id: "figure",
        title: "Ảnh/Figure",
        description: "Upload ảnh, thêm caption, alt và căn lề.",
        category: "Media",
        icon: ImageIcon,
        command: "image",
    },
    {
        id: "image-text",
        title: "Chữ trái + ảnh phải",
        description: "Tạo layout như mẫu: nội dung bên trái, ảnh minh họa bên phải.",
        category: "Bố cục",
        icon: Columns2,
        layoutCommand: "image-text-layout",
        layoutImagePosition: "right",
        html: `
<section data-erg-block="image-text" data-layout="text-image" data-bg="plain" data-tone="light" data-width="wide" data-accent="blue" class="erg-block erg-block-image-text">
  <div class="erg-block-copy">
    <p>Như vậy, để có được chứng chỉ tin học nâng cao bạn cần:</p>
    <ul>
      <li>Có kiến thức chuyên sâu về máy tính và thao tác nền tảng trong Tin học.</li>
      <li>Đạt 6 mô đun cơ bản và chọn nhóm mô đun nâng cao phù hợp.</li>
      <li>Được ERG tư vấn lộ trình học, luyện tập và hoàn thiện kỹ năng thực tế.</li>
    </ul>
  </div>
  <img src="https://media.erg.edu.vn/logo/erg.png" alt="ERG Edurise Global" data-caption="Hình minh họa chương trình tại ERG" data-align="center" data-width="460" />
</section>
`,
    },
    {
        id: "image-text-left",
        title: "Ảnh trái + chữ phải",
        description: "Đảo hướng layout khi bạn muốn ảnh mở đầu trước phần nội dung.",
        category: "Bố cục",
        icon: Columns2,
        layoutCommand: "image-text-layout",
        layoutImagePosition: "left",
        html: `
<section data-erg-block="image-text" data-layout="image-text" data-bg="plain" data-tone="light" data-width="wide" data-accent="blue" class="erg-block erg-block-image-text">
  <img src="https://media.erg.edu.vn/logo/erg.png" alt="ERG Edurise Global" data-caption="Hình minh họa chương trình tại ERG" data-align="center" data-width="460" />
  <div class="erg-block-copy">
    <p>ERG đồng hành cùng học viên trong quá trình xây dựng kỹ năng thực tế.</p>
    <ul>
      <li>Lộ trình rõ ràng, dễ theo dõi.</li>
      <li>Nội dung thực hành bám sát nhu cầu học tập và công việc.</li>
      <li>Đội ngũ ERG hỗ trợ trong từng giai đoạn học.</li>
    </ul>
  </div>
</section>
`,
    },
    {
        id: "cards",
        title: "Thẻ lợi ích",
        description: "Ba lợi ích dạng card, dễ đọc trên mobile.",
        category: "Bố cục",
        icon: SquareStack,
        html: `
<section data-erg-block="cards" data-bg="plain" data-tone="light" data-width="wide" data-accent="blue" class="erg-block erg-block-cards">
  <h2>Lợi ích nổi bật</h2>
  <ul>
    <li><strong>Lộ trình rõ ràng</strong><br />Nội dung được chia theo từng chặng, dễ theo dõi tiến độ.</li>
    <li><strong>Thực hành sát thực tế</strong><br />Bài tập và ví dụ gắn với nhu cầu học tập, công việc.</li>
    <li><strong>Hỗ trợ tận tâm</strong><br />Đội ngũ ERG đồng hành trong quá trình học và sau khóa học.</li>
  </ul>
</section>
`,
    },
    {
        id: "gallery",
        title: "Thư viện ảnh",
        description: "Cụm ảnh có chú thích, phù hợp hoạt động ERG.",
        category: "Media",
        icon: GalleryHorizontal,
        html: `
<section data-erg-block="gallery" data-bg="soft" data-tone="light" data-width="wide" data-accent="blue" class="erg-block erg-block-gallery">
  <h2>Hình ảnh chương trình</h2>
  <img src="https://media.erg.edu.vn/logo/erg.png" alt="ERG" data-caption="Hình ảnh hoạt động tại ERG" data-align="center" data-width="360" />
  <img src="https://media.erg.edu.vn/logo/erg.png" alt="ERG" data-caption="Không gian học tập và tư vấn tại ERG" data-align="center" data-width="360" />
</section>
`,
    },
    {
        id: "quote",
        title: "Trích dẫn",
        description: "Nhấn mạnh thông điệp hoặc nhận xét quan trọng.",
        category: "Nội dung",
        icon: Quote,
        html: `
<section data-erg-block="quote" data-bg="ink" data-tone="dark" data-width="normal" data-accent="red" class="erg-block erg-block-quote">
  <blockquote>
    <p>ERG tập trung vào trải nghiệm học tập rõ ràng, thực tế và có thể áp dụng ngay.</p>
  </blockquote>
</section>
`,
    },
    {
        id: "faq",
        title: "FAQ",
        description: "Câu hỏi thường gặp để giảm do dự trước khi đăng ký.",
        category: "Nội dung",
        icon: HelpCircle,
        html: `
<section data-erg-block="faq" data-bg="plain" data-tone="light" data-width="normal" data-accent="blue" class="erg-block erg-block-faq">
  <h2>Câu hỏi thường gặp</h2>
  <h3>Ai phù hợp với chương trình này?</h3>
  <p>Học viên, sinh viên hoặc người đi làm muốn nâng cao kỹ năng và cần lộ trình rõ ràng.</p>
  <h3>ERG hỗ trợ gì trong quá trình học?</h3>
  <p>Đội ngũ tư vấn và giảng viên đồng hành để người học hiểu nội dung, luyện tập và theo dõi tiến độ.</p>
</section>
`,
    },
    {
        id: "video",
        title: "Video giới thiệu",
        description: "Embed video hoặc đặt khung media cho nội dung sau.",
        category: "Media",
        icon: Video,
        html: `
<section data-erg-block="video" data-bg="ink" data-tone="dark" data-width="wide" data-accent="red" class="erg-block erg-block-video">
  <h2>Video giới thiệu ERG</h2>
  <p>Dán liên kết video hoặc thay phần khung này bằng embed khi cần.</p>
  <div class="erg-video-placeholder">Khu vực video 16:9</div>
</section>
`,
    },
    {
        id: "compare",
        title: "Bảng so sánh",
        description: "So sánh chương trình, lợi ích hoặc lựa chọn.",
        category: "Bố cục",
        icon: Table2,
        html: `
<section data-erg-block="compare" data-bg="plain" data-tone="light" data-width="wide" data-accent="blue" class="erg-block erg-block-table">
  <h2>So sánh lựa chọn học tập</h2>
  <table>
    <thead><tr><th>Tiêu chí</th><th>Tự học</th><th>Học cùng ERG</th></tr></thead>
    <tbody>
      <tr><td>Lộ trình</td><td>Tự tìm kiếm</td><td>Có cấu trúc rõ ràng</td></tr>
      <tr><td>Phản hồi</td><td>Ít hoặc không có</td><td>Được hỗ trợ theo tiến độ</td></tr>
      <tr><td>Thực hành</td><td>Dễ rời rạc</td><td>Bài tập bám mục tiêu</td></tr>
    </tbody>
  </table>
</section>
`,
    },
    {
        id: "timeline",
        title: "Lộ trình",
        description: "Các bước học hoặc quy trình tư vấn.",
        category: "Giáo dục",
        icon: Rows3,
        html: `
<section data-erg-block="timeline" data-bg="soft" data-tone="light" data-width="wide" data-accent="blue" class="erg-block erg-block-timeline">
  <h2>Lộ trình học đề xuất</h2>
  <ol>
    <li><strong>Khởi động</strong><br />Đánh giá mục tiêu và nền tảng hiện tại.</li>
    <li><strong>Học trọng tâm</strong><br />Tập trung vào kiến thức và bài thực hành cần thiết.</li>
    <li><strong>Ứng dụng</strong><br />Hoàn thiện bài tập, tổng kết và định hướng bước tiếp theo.</li>
  </ol>
</section>
`,
    },
    {
        id: "certificate",
        title: "Chứng chỉ/Kết quả",
        description: "Nêu đầu ra, chứng chỉ hoặc thành quả sau khóa học.",
        category: "Giáo dục",
        icon: Award,
        html: `
<section data-erg-block="certificate" data-bg="plain" data-tone="light" data-width="wide" data-accent="red" class="erg-block erg-block-certificate">
  <h2>Kết quả sau chương trình</h2>
  <ul>
    <li>Nắm được kiến thức cốt lõi theo mục tiêu học tập.</li>
    <li>Có sản phẩm/bài tập thực hành để tự đánh giá năng lực.</li>
    <li>Được ERG tư vấn lộ trình tiếp theo khi cần.</li>
  </ul>
</section>
`,
    },
    {
        id: "schedule",
        title: "Lịch khai giảng",
        description: "Trình bày lịch học, ca học hoặc mốc đăng ký.",
        category: "Giáo dục",
        icon: CalendarDays,
        html: `
<section data-erg-block="schedule" data-bg="soft" data-tone="light" data-width="normal" data-accent="red" class="erg-block erg-block-schedule">
  <h2>Lịch khai giảng dự kiến</h2>
  <p><strong>Ca tối:</strong> 18:30 - 20:30, phù hợp học viên đi làm.</p>
  <p><strong>Cuối tuần:</strong> linh hoạt theo lịch tư vấn của ERG.</p>
</section>
`,
    },
    {
        id: "cta",
        title: "CTA đăng ký",
        description: "Kêu gọi tư vấn, liên hệ hoặc nhận lộ trình.",
        category: "Chuyển đổi",
        icon: Send,
        html: `
<section data-erg-block="cta" data-bg="brand" data-tone="dark" data-width="wide" data-accent="red" class="erg-block erg-block-cta">
  <h2>Sẵn sàng bắt đầu cùng ERG?</h2>
  <p>Để lại thông tin để đội ngũ tư vấn liên hệ và gợi ý lộ trình phù hợp.</p>
  <p><a href="/lien-he">Liên hệ ERG</a></p>
</section>
`,
    },
    {
        id: "links",
        title: "Liên kết liên quan",
        description: "Gợi ý bài viết, khóa học hoặc trang nội bộ.",
        category: "Chuyển đổi",
        icon: Link2,
        html: `
<section data-erg-block="links" data-bg="plain" data-tone="light" data-width="normal" data-accent="blue" class="erg-block erg-block-links">
  <h2>Nội dung liên quan</h2>
  <ul>
    <li><a href="/tin-tuc">Xem thêm tin tức từ ERG</a></li>
    <li><a href="/lien-he">Nhận tư vấn chương trình phù hợp</a></li>
  </ul>
</section>
`,
    },
    {
        id: "hero-image",
        title: "Hero ảnh nền",
        description: "Mở đầu bài viết bằng ảnh, tiêu đề lớn và CTA.",
        category: "Bố cục",
        icon: ImageIcon,
        html: `
<section data-erg-block="hero-image" data-bg="ink" data-tone="dark" data-width="wide" data-accent="red" class="erg-block erg-block-hero-image">
  <img src="https://media.erg.edu.vn/logo/erg.png" alt="ERG Edurise Global" data-caption="" data-align="center" data-width="100%" />
  <p class="erg-eyebrow">CÂU CHUYỆN ERG</p>
  <h2>Tiêu đề lớn thu hút người đọc ngay từ màn đầu</h2>
  <p>Thêm một đoạn mô tả ngắn để người đọc hiểu lợi ích chính trước khi cuộn xuống.</p>
  <p><a href="#noi-dung">Khám phá ngay</a></p>
</section>
`,
    },
    {
        id: "cover-story",
        title: "Cover story",
        description: "Dạng mở bài tạp chí, hợp bài sự kiện hoặc câu chuyện.",
        category: "Tin tức",
        icon: LayoutTemplate,
        html: `
<section data-erg-block="cover-story" data-bg="plain" data-tone="light" data-width="wide" data-accent="red" class="erg-block erg-block-cover-story">
  <p class="erg-eyebrow">Tin nổi bật</p>
  <h2>ERG tạo dấu ấn mới trong hành trình giáo dục số</h2>
  <p class="erg-lead">Một đoạn sapo giàu cảm xúc, giúp bài viết có chất báo chí và dẫn người đọc vào câu chuyện chính.</p>
</section>
`,
    },
    {
        id: "callout",
        title: "Callout/Thông báo",
        description: "Nhấn mạnh ghi chú, cảnh báo hoặc thông tin quan trọng.",
        category: "Nội dung",
        icon: CheckCircle2,
        html: `
<section data-erg-block="callout" data-bg="warm" data-tone="light" data-width="normal" data-accent="gold" class="erg-block erg-block-callout">
  <h2>Lưu ý quan trọng</h2>
  <p>Đặt thông tin cần người đọc chú ý tại đây, ví dụ hạn đăng ký, điều kiện tham gia hoặc quyền lợi đặc biệt.</p>
</section>
`,
    },
    {
        id: "table-of-contents",
        title: "Mục lục nhanh",
        description: "Tạo khung điều hướng nội dung dài.",
        category: "Nội dung",
        icon: Rows3,
        html: `
<section data-erg-block="toc-card" data-bg="soft" data-tone="light" data-width="normal" data-accent="blue" class="erg-block erg-block-toc-card">
  <h2>Trong bài viết này</h2>
  <ol>
    <li><a href="#phan-1">Tổng quan chương trình</a></li>
    <li><a href="#phan-2">Lợi ích nổi bật</a></li>
    <li><a href="#phan-3">Cách đăng ký</a></li>
  </ol>
</section>
`,
    },
    {
        id: "gallery-3",
        title: "Gallery 3 ảnh",
        description: "Bố cục ảnh 3 cột cho sự kiện, lớp học, hoạt động.",
        category: "Media",
        icon: GalleryHorizontal,
        html: `
<section data-erg-block="gallery-3" data-bg="soft" data-tone="light" data-width="wide" data-accent="blue" class="erg-block erg-block-gallery erg-block-gallery-3">
  <h2>Khoảnh khắc tại ERG</h2>
  <img src="https://media.erg.edu.vn/logo/erg.png" alt="Hoạt động ERG 1" data-caption="Hoạt động 1" data-align="center" data-width="320" />
  <img src="https://media.erg.edu.vn/logo/erg.png" alt="Hoạt động ERG 2" data-caption="Hoạt động 2" data-align="center" data-width="320" />
  <img src="https://media.erg.edu.vn/logo/erg.png" alt="Hoạt động ERG 3" data-caption="Hoạt động 3" data-align="center" data-width="320" />
</section>
`,
    },
    {
        id: "download",
        title: "File/Download",
        description: "Khối tải tài liệu, brochure hoặc biểu mẫu.",
        category: "Media",
        icon: FileText,
        html: `
<section data-erg-block="download" data-bg="plain" data-tone="light" data-width="normal" data-accent="blue" class="erg-block erg-block-download">
  <h2>Tải tài liệu chương trình</h2>
  <p>Đính kèm brochure, đề cương hoặc biểu mẫu để người đọc tải về.</p>
  <p><a href="/lien-he">Nhận tài liệu từ ERG</a></p>
</section>
`,
    },
    {
        id: "steps",
        title: "Quy trình từng bước",
        description: "Hướng dẫn người đọc đi qua 3-5 bước rõ ràng.",
        category: "Bố cục",
        icon: ListChecks,
        html: `
<section data-erg-block="steps" data-bg="soft" data-tone="light" data-width="wide" data-accent="blue" class="erg-block erg-block-steps">
  <h2>Quy trình đăng ký</h2>
  <ol>
    <li><strong>Gửi thông tin</strong><br />Để lại nhu cầu học tập hoặc tư vấn.</li>
    <li><strong>Nhận lộ trình</strong><br />ERG gợi ý chương trình phù hợp.</li>
    <li><strong>Bắt đầu học</strong><br />Theo dõi tiến độ và nhận hỗ trợ trong quá trình học.</li>
  </ol>
</section>
`,
    },
    {
        id: "stats",
        title: "Stats/KPI",
        description: "Hiển thị số liệu nổi bật để tăng độ tin cậy.",
        category: "SEO/Trust",
        icon: SquareStack,
        html: `
<section data-erg-block="stats" data-bg="brand" data-tone="dark" data-width="wide" data-accent="red" class="erg-block erg-block-stats">
  <h2>Những con số nổi bật</h2>
  <ul>
    <li><strong>10+</strong><br />Chương trình đào tạo</li>
    <li><strong>100%</strong><br />Lộ trình rõ ràng</li>
    <li><strong>24/7</strong><br />Kênh hỗ trợ học viên</li>
  </ul>
</section>
`,
    },
    {
        id: "testimonial",
        title: "Cảm nhận học viên",
        description: "Quote có tên, vai trò và nội dung nổi bật.",
        category: "SEO/Trust",
        icon: Quote,
        html: `
<section data-erg-block="testimonial" data-bg="plain" data-tone="light" data-width="normal" data-accent="red" class="erg-block erg-block-testimonial">
  <blockquote>
    <p>Chương trình tại ERG giúp tôi hiểu rõ mục tiêu học tập và tự tin hơn khi thực hành.</p>
  </blockquote>
  <p><strong>Học viên ERG</strong><br />Chia sẻ sau chương trình</p>
</section>
`,
    },
    {
        id: "teacher-profile",
        title: "Giảng viên/Profile",
        description: "Giới thiệu giảng viên, chuyên gia hoặc đội ngũ.",
        category: "Giáo dục",
        icon: Award,
        html: `
<section data-erg-block="teacher-profile" data-bg="plain" data-tone="light" data-width="wide" data-accent="blue" class="erg-block erg-block-profile">
  <img src="https://media.erg.edu.vn/logo/erg.png" alt="Đội ngũ ERG" data-caption="" data-align="center" data-width="240" />
  <h2>Đội ngũ đồng hành tại ERG</h2>
  <p>Giới thiệu ngắn về giảng viên, kinh nghiệm, phong cách hỗ trợ học viên và giá trị khác biệt.</p>
</section>
`,
    },
    {
        id: "curriculum",
        title: "Chương trình học",
        description: "Bố cục module/buổi học cho bài khóa học.",
        category: "Giáo dục",
        icon: Rows3,
        html: `
<section data-erg-block="curriculum" data-bg="soft" data-tone="light" data-width="wide" data-accent="blue" class="erg-block erg-block-curriculum">
  <h2>Nội dung chương trình</h2>
  <ol>
    <li><strong>Module 1:</strong> Nền tảng và mục tiêu học tập.</li>
    <li><strong>Module 2:</strong> Thực hành theo tình huống thực tế.</li>
    <li><strong>Module 3:</strong> Tổng kết, đánh giá và định hướng tiếp theo.</li>
  </ol>
</section>
`,
    },
    {
        id: "pricing",
        title: "Gói khóa học",
        description: "Trình bày gói học, quyền lợi và CTA.",
        category: "Chuyển đổi",
        icon: SquareStack,
        html: `
<section data-erg-block="pricing" data-bg="plain" data-tone="light" data-width="wide" data-accent="red" class="erg-block erg-block-pricing">
  <h2>Gói tư vấn phù hợp</h2>
  <ul>
    <li><strong>Cơ bản</strong><br />Tư vấn lộ trình và nội dung học tập.</li>
    <li><strong>Nâng cao</strong><br />Theo sát tiến độ, thực hành và đánh giá kết quả.</li>
    <li><strong>Doanh nghiệp</strong><br />Thiết kế chương trình riêng theo nhu cầu tổ chức.</li>
  </ul>
</section>
`,
    },
    {
        id: "contact-card",
        title: "Thẻ liên hệ",
        description: "Gom hotline, Zalo, địa chỉ và CTA trong một khối.",
        category: "Chuyển đổi",
        icon: Send,
        html: `
<section data-erg-block="contact-card" data-bg="ink" data-tone="dark" data-width="normal" data-accent="red" class="erg-block erg-block-contact-card">
  <h2>Liên hệ ERG</h2>
  <p>Cần tư vấn nhanh? Đội ngũ ERG luôn sẵn sàng hỗ trợ bạn chọn lộ trình phù hợp.</p>
  <p><a href="/lien-he">Gửi yêu cầu tư vấn</a></p>
</section>
`,
    },
    {
        id: "related-posts",
        title: "Bài viết liên quan",
        description: "Khối gợi ý nội dung đọc tiếp.",
        category: "Tin tức",
        icon: Link2,
        html: `
<section data-erg-block="related-posts" data-bg="soft" data-tone="light" data-width="wide" data-accent="blue" class="erg-block erg-block-related">
  <h2>Đọc thêm từ ERG</h2>
  <ul>
    <li><a href="/tin-tuc">Tin tức và hoạt động mới nhất</a></li>
    <li><a href="/khoa-hoc">Các chương trình đào tạo</a></li>
    <li><a href="/lien-he">Nhận tư vấn lộ trình học</a></li>
  </ul>
</section>
`,
    },
    {
        id: "divider",
        title: "Ngăn cách/Spacer",
        description: "Tạo nhịp thở giữa các section dài.",
        category: "Bố cục",
        icon: Rows3,
        html: `
<section data-erg-block="divider" data-bg="plain" data-tone="light" data-width="normal" data-accent="blue" class="erg-block erg-block-divider">
  <hr />
</section>
`,
    },
    {
        id: "news-highlight",
        title: "Tin tức nổi bật",
        description: "Khối highlight cho điểm tin, thông báo hoặc hoạt động.",
        category: "Tin tức",
        icon: FileText,
        html: `
<section data-erg-block="news-highlight" data-bg="plain" data-tone="light" data-width="wide" data-accent="red" class="erg-block erg-block-news-highlight">
  <p class="erg-eyebrow">Điểm tin ERG</p>
  <h2>Tiêu đề tin tức nổi bật</h2>
  <p>Tóm tắt nhanh sự kiện hoặc thông báo, giúp người đọc nắm ý chính trước khi xem chi tiết.</p>
</section>
`,
    },
    {
        id: "pros-cons",
        title: "Ưu điểm / Lưu ý",
        description: "Hai cột phân tích rõ lợi ích và điều cần cân nhắc.",
        category: "Bố cục",
        icon: Columns2,
        html: `
<section data-erg-block="pros-cons" data-bg="plain" data-tone="light" data-width="wide" data-accent="blue" class="erg-block erg-block-pros-cons">
  <h2>Điểm nổi bật và lưu ý</h2>
  <ul>
    <li><strong>Điểm nổi bật</strong><br />Lộ trình rõ, nội dung thực tế, đội ngũ hỗ trợ sát sao.</li>
    <li><strong>Lưu ý</strong><br />Người học cần duy trì lịch thực hành đều đặn để đạt kết quả tốt.</li>
  </ul>
</section>
`,
    },
    {
        id: "author-note",
        title: "Ghi chú biên tập",
        description: "Thêm lời nhắn của ERG hoặc note từ người biên tập.",
        category: "Tin tức",
        icon: Quote,
        html: `
<section data-erg-block="author-note" data-bg="warm" data-tone="light" data-width="normal" data-accent="gold" class="erg-block erg-block-author-note">
  <h2>Ghi chú từ ERG</h2>
  <p>Thêm nhận định, lời nhắn hoặc bối cảnh để bài viết có giọng nói gần gũi hơn.</p>
</section>
`,
    },
]

const blockCategories = ["Tất cả", "Mẫu bài", "Nội dung", "Media", "Bố cục", "Giáo dục", "Chuyển đổi", "Tin tức", "SEO/Trust"] as const

const previewModes = [
    { id: "desktop", label: "Desktop", icon: Monitor, width: "w-full", frame: "rounded-2xl" },
    { id: "tablet", label: "Tablet", icon: Tablet, width: "max-w-[760px]", frame: "rounded-[28px]" },
    { id: "mobile", label: "Mobile", icon: Smartphone, width: "max-w-[390px]", frame: "rounded-[32px]" },
] as const

const bgOptions = [
    { value: "plain", label: "Trắng", className: "bg-white" },
    { value: "soft", label: "Xanh nhạt", className: "bg-blue-50" },
    { value: "course-hero", label: "Hero xanh", className: "bg-[#07559f]" },
    { value: "brand", label: "Xanh ERG", className: "bg-[#00008b]" },
    { value: "ink", label: "Đen xanh", className: "bg-slate-950" },
    { value: "warm", label: "Ấm nhẹ", className: "bg-amber-50" },
]

const accentOptions = [
    { value: "blue", label: "Xanh", className: "bg-[#00008b]" },
    { value: "red", label: "Đỏ", className: "bg-[#cc0022]" },
    { value: "green", label: "Xanh lá", className: "bg-emerald-500" },
    { value: "gold", label: "Vàng", className: "bg-amber-400" },
]

const widthOptions = [
    { value: "normal", label: "Chuẩn" },
    { value: "wide", label: "Rộng" },
    { value: "full", label: "Tràn ngang" },
]

export function VisualPostEditorWorkspace({
    mode,
    postId,
    title,
    onTitleChange,
    initialContent = "",
    content,
    onContentChange,
    onStructuredContentChange,
    postMetadata,
    onMetadataChange,
    onSave,
    onSaveDraft,
    isSaving,
    isGenerating,
    aiProgress = 0,
    onStartAi,
    onRefine,
    onEditorReady,
}: VisualPostEditorWorkspaceProps) {
    const [editor, setEditor] = useState<Editor | null>(null)
    const [editorEngine, setEditorEngine] = useState<EditorEngine>("canvas")
    const [blockNoteBridge, setBlockNoteBridge] = useState<BlockNoteEditorBridge | null>(null)
    const [selectionState, setSelectionState] = useState<EditorSelectionState>(null)
    const [panelOpen, setPanelOpen] = useState(false)
    const [rightTab, setRightTab] = useState<"preview" | "settings" | "seo" | "block">("preview")
    const [previewMode, setPreviewMode] = useState<typeof previewModes[number]["id"]>("desktop")
    const [showAiInput, setShowAiInput] = useState(false)
    const [showBlocks, setShowBlocks] = useState(true)
    const [blockQuery, setBlockQuery] = useState("")
    const [blockCategory, setBlockCategory] = useState<typeof blockCategories[number]>("Tất cả")

    const previewConfig = previewModes.find(item => item.id === previewMode) || previewModes[0]
    const currentContent = content || initialContent
    const publishLabel = mode === "edit" ? "Cập nhật bài viết" : "Đăng bài viết"
    const statusLabel = (postMetadata.status || "draft").toLowerCase()
    const canInsertBlock = editorEngine === "canvas" ? !!editor : !!blockNoteBridge
    const isInputVisible = showAiInput || isGenerating

    const filteredBlocks = useMemo(() => {
        const query = blockQuery.trim().toLowerCase()
        return blockTemplates.filter(template => {
            const matchesCategory = blockCategory === "Tất cả" || template.category === blockCategory
            const matchesQuery = !query
                || template.title.toLowerCase().includes(query)
                || template.description.toLowerCase().includes(query)
                || template.category.toLowerCase().includes(query)
            return matchesCategory && matchesQuery
        })
    }, [blockCategory, blockQuery])

    const previewPost = useMemo(() => ({
        title: title || "Tiêu đề bài viết sẽ hiển thị tại đây",
        excerpt: postMetadata.excerpt || "Mô tả ngắn của bài viết sẽ hiển thị ở khu vực public preview.",
        category: "ERG",
        thumbnailUrl: postMetadata.thumbnailUrl,
    }), [postMetadata.excerpt, postMetadata.thumbnailUrl, title])

    const handleEditorReady = (instance: Editor) => {
        setEditor(instance)
        onEditorReady?.(instance)
        onContentChange(instance.getHTML())
    }

    useEffect(() => {
        if (editor) {
            onEditorReady?.(editor)
        }
    }, [editor, onEditorReady])

    const handleEngineChange = (engine: EditorEngine) => {
        setEditorEngine(engine)
        setPanelOpen(false)
        setSelectionState(null)
        if (engine === "canvas") {
            onStructuredContentChange?.(null)
        }
    }

    const handleBlockNoteReady = (bridge: BlockNoteEditorBridge | null) => {
        setBlockNoteBridge(bridge)
        if (bridge) {
            onContentChange(bridge.getHTML())
            onStructuredContentChange?.(bridge.getBlocks())
        }
    }

    const openPanel = (tab: typeof rightTab) => {
        setRightTab(tab)
        setPanelOpen(true)
    }

    const textNode = (text: string, marks?: Array<Record<string, unknown>>) => ({
        type: "text",
        text,
        ...(marks ? { marks } : {}),
    })

    const paragraphNode = (content: string | Array<Record<string, unknown>>) => ({
        type: "paragraph",
        content: typeof content === "string" ? [textNode(content)] : content,
    })

    const headingNode = (level: number, text: string) => ({
        type: "heading",
        attrs: { level },
        content: [textNode(text)],
    })

    const bulletListNode = (items: Array<string | Array<Record<string, unknown>>>) => ({
        type: "bulletList",
        content: items.map(item => ({
            type: "listItem",
            content: [paragraphNode(typeof item === "string" ? item : item)],
        })),
    })

    const createSectionBlock = ({
        block,
        className,
        bg = "plain",
        tone = "light",
        width = "wide",
        accent = "blue",
        content: sectionContent,
    }: {
        block: string
        className: string
        bg?: string
        tone?: string
        width?: string
        accent?: string
        content: Array<Record<string, unknown>>
    }) => ({
        type: "ergSectionBlock",
        attrs: {
            dataErgBlock: block,
            class: className,
            dataBg: bg,
            dataTone: tone,
            dataWidth: width,
            dataAccent: accent,
        },
        content: sectionContent,
    })

    const createImageTextBlock = (
        imagePosition: "left" | "right",
        variant: "default" | "courseHero" | "requirementsImage" | "benefitBand" | "pricingOffer" = "default"
    ) => {
        const base = {
            src: "/util/cnttnc.jpg",
            alt: "Chứng chỉ ứng dụng công nghệ thông tin nâng cao tại ERG",
            caption: "Hình minh họa chương trình tại ERG",
            imagePosition,
            imageWidth: 44,
            dataBg: "plain",
            dataTone: "light",
            dataWidth: "wide",
            dataAccent: "blue",
            dataVariant: variant,
        }

        if (variant === "courseHero") {
            return {
                type: "imageTextBlock",
                attrs: {
                    ...base,
                    imagePosition: "left",
                    imageWidth: 42,
                    dataBg: "course-hero",
                    dataTone: "dark",
                    dataWidth: "full",
                    dataAccent: "red",
                    caption: "Chứng chỉ ứng dụng CNTT nâng cao",
                },
                content: [
                    headingNode(2, "Khóa học Chứng chỉ Ứng dụng CNTT Nâng Cao tại ERG"),
                    bulletListNode([
                        [textNode("ERG cam kết tỷ lệ đậu cao", [{ type: "bold" }]), textNode(" với lộ trình học rõ ràng.")],
                        [textNode("Giảng viên nhiều năm kinh nghiệm", [{ type: "bold" }]), textNode(", chuyên môn sát nhu cầu thực tế.")],
                        [textNode("Hỗ trợ đăng ký thi, nhận chứng chỉ", [{ type: "bold" }]), textNode(" và đồng hành trong quá trình học.")],
                        [textNode("Cam kết học lại + thi lại miễn phí 100%", [{ type: "bold" }]), textNode(" khi không đạt điều kiện.")],
                    ]),
                    paragraphNode([
                        textNode("Đăng ký ngay", [{ type: "link", attrs: { href: "#dang-ky", target: null, rel: null } }]),
                    ]),
                ],
            }
        }

        if (variant === "benefitBand") {
            return {
                type: "imageTextBlock",
                attrs: {
                    ...base,
                    src: "/util/mos.jpg",
                    alt: "Lợi ích chứng chỉ tin học nâng cao tại ERG",
                    caption: "Chứng chỉ và năng lực ứng dụng thực tế",
                    dataBg: "soft",
                    imageWidth: 46,
                    dataVariant: "benefit",
                },
                content: [
                    headingNode(2, "Lợi ích của Chứng chỉ Ứng dụng CNTT Nâng Cao"),
                    bulletListNode([
                        [textNode("Thành thạo Microsoft Office 365", [{ type: "bold" }]), textNode(" và các công cụ làm việc phổ biến.")],
                        [textNode("Nâng cao kỹ năng trình chiếu, xử lý dữ liệu và bảo mật thông tin", [{ type: "bold" }]), textNode(".")],
                        [textNode("Có nền tảng để hoàn thiện hồ sơ học tập, tuyển dụng hoặc thăng tiến", [{ type: "bold" }]), textNode(".")],
                    ]),
                ],
            }
        }

        if (variant === "pricingOffer") {
            return {
                type: "imageTextBlock",
                attrs: {
                    ...base,
                    imagePosition: "left",
                    src: "/util/cnttnc.jpg",
                    alt: "Ưu đãi khóa học chứng chỉ CNTT nâng cao tại ERG",
                    caption: "Chứng chỉ ứng dụng CNTT nâng cao",
                    dataBg: "soft",
                    dataAccent: "red",
                    imageWidth: 48,
                    dataVariant: "offer",
                },
                content: [
                    headingNode(2, "Bảng giá ưu đãi khóa học Chứng chỉ Ứng dụng CNTT Nâng Cao"),
                    paragraphNode("Cam kết tỷ lệ đậu cao trong lần thi đầu tiên, học và thi lại miễn phí khi chưa đạt chứng chỉ."),
                    paragraphNode([
                        textNode("Giá gốc: 2.000.000đ  ", [{ type: "strike" }]),
                        textNode("1.650.000đ", [{ type: "bold" }]),
                    ]),
                    paragraphNode([
                        textNode("Đăng ký ngay", [{ type: "link", attrs: { href: "#dang-ky", target: null, rel: null } }]),
                    ]),
                ],
            }
        }

        return {
            type: "imageTextBlock",
            attrs: {
                ...base,
                src: variant === "requirementsImage" ? "/util/spark.jpg" : base.src,
                alt: variant === "requirementsImage"
                    ? "Yêu cầu tham gia chương trình tin học nâng cao tại ERG"
                    : base.alt,
                dataVariant: variant,
            },
            content: [
                paragraphNode(imagePosition === "right"
                    ? "Như vậy, để có được chứng chỉ tin học nâng cao bạn cần:"
                    : "ERG đồng hành cùng học viên trong quá trình xây dựng kỹ năng thực tế."
                ),
                bulletListNode([
                    "Có kiến thức chuyên sâu về máy tính và thao tác nền tảng trong Tin học.",
                    "Đạt các mô đun cơ bản và lựa chọn nhóm mô đun nâng cao phù hợp.",
                    "Được ERG tư vấn lộ trình học, luyện tập và hoàn thiện kỹ năng thực tế.",
                ]),
            ],
        }
    }

    const createCoursePresetContent = (preset: CoursePreset) => {
        const infoCard = createSectionBlock({
            block: "course-info-card",
            className: "erg-block erg-block-course-info-card",
            bg: "plain",
            width: "normal",
            accent: "blue",
            content: [
                headingNode(2, "Tại sao nên chọn Chứng chỉ Ứng dụng CNTT Nâng Cao tại ERG?"),
                paragraphNode([
                    textNode("ERG cam kết giúp "),
                    textNode("học viên thi đậu với tỷ lệ cao", [{ type: "bold" }]),
                    textNode(". Tối ưu hóa thời gian, "),
                    textNode("thi là đạt", [{ type: "bold" }]),
                    textNode("."),
                ]),
                bulletListNode([
                    "Hệ thống bài giảng chi tiết, cụ thể, ngắn gọn và dễ hiểu.",
                    "Mọi đối tượng đều có thể bắt đầu từ nền tảng hiện tại.",
                    "Hỗ trợ đăng ký thi, nhận chứng chỉ và giao chứng chỉ tận nơi khi có nhu cầu.",
                ]),
            ],
        })

        const intro = createSectionBlock({
            block: "course-intro",
            className: "erg-block erg-block-rich-text erg-block-course-intro",
            bg: "plain",
            width: "wide",
            accent: "blue",
            content: [
                headingNode(2, "Chứng chỉ Ứng dụng CNTT Nâng Cao là gì?"),
                paragraphNode([
                    textNode("Chứng chỉ Ứng dụng công nghệ thông tin Nâng Cao", [{ type: "bold" }]),
                    textNode(" là chứng chỉ tin học được đào tạo theo yêu cầu của chuẩn kỹ năng sử dụng CNTT nâng cao."),
                ]),
                paragraphNode("Để đạt chứng chỉ, học viên cần có nền tảng tin học cơ bản và hoàn thành nhóm mô đun nâng cao phù hợp với mục tiêu học tập hoặc công việc."),
            ],
        })

        const cta = createSectionBlock({
            block: "cta",
            className: "erg-block erg-block-cta",
            bg: "brand",
            tone: "dark",
            width: "wide",
            accent: "red",
            content: [
                headingNode(2, "Sẵn sàng bắt đầu cùng ERG?"),
                paragraphNode("Để lại thông tin để đội ngũ tư vấn liên hệ và gợi ý lộ trình phù hợp."),
                paragraphNode([
                    textNode("Liên hệ ERG", [{ type: "link", attrs: { href: "/lien-he", target: null, rel: null } }]),
                ]),
            ],
        })

        switch (preset) {
            case "courseArticle":
                return [
                    createImageTextBlock("left", "courseHero"),
                    intro,
                    createImageTextBlock("right", "requirementsImage"),
                    createImageTextBlock("right", "benefitBand"),
                    infoCard,
                    createImageTextBlock("left", "pricingOffer"),
                    cta,
                ]
            case "courseHero":
                return [createImageTextBlock("left", "courseHero")]
            case "requirementsImage":
                return [createImageTextBlock("right", "requirementsImage")]
            case "benefitBand":
                return [createImageTextBlock("right", "benefitBand")]
            case "pricingOffer":
                return [createImageTextBlock("left", "pricingOffer")]
            case "infoCard":
                return [infoCard]
            default:
                return []
        }
    }

    const createCoursePresetHtml = (preset: CoursePreset) => {
        const hero = `
<section data-erg-block="image-text" data-editor-node="image-text" data-layout="image-text" data-bg="course-hero" data-tone="dark" data-width="full" data-accent="red" data-variant="courseHero" data-image-width="42" class="erg-block erg-block-image-text" style="--erg-image-column: 42%">
  <figure class="erg-figure"><img src="/util/cnttnc.jpg" alt="Chứng chỉ ứng dụng CNTT nâng cao tại ERG" data-caption="Chứng chỉ ứng dụng CNTT nâng cao" data-align="center" data-width="100%" /><figcaption>Chứng chỉ ứng dụng CNTT nâng cao</figcaption></figure>
  <div class="erg-block-copy">
    <h2>Khóa học Chứng chỉ Ứng dụng CNTT Nâng Cao tại ERG</h2>
    <ul>
      <li><strong>ERG cam kết tỷ lệ đậu cao</strong> với lộ trình học rõ ràng.</li>
      <li><strong>Giảng viên nhiều năm kinh nghiệm</strong>, chuyên môn sát nhu cầu thực tế.</li>
      <li><strong>Hỗ trợ đăng ký thi, nhận chứng chỉ</strong> và đồng hành trong quá trình học.</li>
    </ul>
    <p><a href="#dang-ky">Đăng ký ngay</a></p>
  </div>
</section>`
        const requirements = `
<section data-erg-block="image-text" data-editor-node="image-text" data-layout="text-image" data-bg="plain" data-tone="light" data-width="wide" data-accent="blue" data-variant="requirementsImage" data-image-width="44" class="erg-block erg-block-image-text" style="--erg-image-column: 44%">
  <div class="erg-block-copy">
    <p>Như vậy, để có được chứng chỉ tin học nâng cao bạn cần:</p>
    <ul>
      <li>Có kiến thức chuyên sâu về máy tính và thao tác nền tảng trong Tin học.</li>
      <li>Đạt các mô đun cơ bản và lựa chọn nhóm mô đun nâng cao phù hợp.</li>
      <li>Được ERG tư vấn lộ trình học, luyện tập và hoàn thiện kỹ năng thực tế.</li>
    </ul>
  </div>
  <figure class="erg-figure"><img src="/util/spark.jpg" alt="Yêu cầu tham gia chương trình tin học nâng cao tại ERG" data-caption="Hình minh họa chương trình tại ERG" data-align="center" data-width="100%" /><figcaption>Hình minh họa chương trình tại ERG</figcaption></figure>
</section>`
        const benefit = `
<section data-erg-block="image-text" data-editor-node="image-text" data-layout="text-image" data-bg="soft" data-tone="light" data-width="wide" data-accent="blue" data-variant="benefit" data-image-width="46" class="erg-block erg-block-image-text" style="--erg-image-column: 46%">
  <div class="erg-block-copy">
    <h2>Lợi ích của Chứng chỉ Ứng dụng CNTT Nâng Cao</h2>
    <ul>
      <li><strong>Thành thạo Microsoft Office 365</strong> và các công cụ làm việc phổ biến.</li>
      <li><strong>Nâng cao kỹ năng trình chiếu, xử lý dữ liệu và bảo mật thông tin</strong>.</li>
      <li><strong>Có nền tảng để hoàn thiện hồ sơ học tập, tuyển dụng hoặc thăng tiến</strong>.</li>
    </ul>
  </div>
  <figure class="erg-figure"><img src="/util/mos.jpg" alt="Lợi ích chứng chỉ tin học nâng cao tại ERG" data-caption="Chứng chỉ và năng lực ứng dụng thực tế" data-align="center" data-width="100%" /><figcaption>Chứng chỉ và năng lực ứng dụng thực tế</figcaption></figure>
</section>`
        const pricing = `
<section data-erg-block="image-text" data-editor-node="image-text" data-layout="image-text" data-bg="soft" data-tone="light" data-width="wide" data-accent="red" data-variant="offer" data-image-width="48" class="erg-block erg-block-image-text" style="--erg-image-column: 48%">
  <figure class="erg-figure"><img src="/util/cnttnc.jpg" alt="Ưu đãi khóa học chứng chỉ CNTT nâng cao tại ERG" data-caption="Chứng chỉ ứng dụng CNTT nâng cao" data-align="center" data-width="100%" /><figcaption>Chứng chỉ ứng dụng CNTT nâng cao</figcaption></figure>
  <div class="erg-block-copy">
    <h2>Bảng giá ưu đãi khóa học Chứng chỉ Ứng dụng CNTT Nâng Cao</h2>
    <p>Cam kết tỷ lệ đậu cao trong lần thi đầu tiên, học và thi lại miễn phí khi chưa đạt chứng chỉ.</p>
    <p><s>Giá gốc: 2.000.000đ</s> <strong>1.650.000đ</strong></p>
    <p><a href="#dang-ky">Đăng ký ngay</a></p>
  </div>
</section>`
        const infoCard = `
<section data-erg-block="course-info-card" data-bg="plain" data-tone="light" data-width="normal" data-accent="blue" class="erg-block erg-block-course-info-card">
  <h2>Tại sao nên chọn Chứng chỉ Ứng dụng CNTT Nâng Cao tại ERG?</h2>
  <p>ERG cam kết giúp <strong>học viên thi đậu với tỷ lệ cao</strong>. Tối ưu hóa thời gian, <strong>thi là đạt</strong>.</p>
  <ul>
    <li>Hệ thống bài giảng chi tiết, cụ thể, ngắn gọn và dễ hiểu.</li>
    <li>Mọi đối tượng đều có thể bắt đầu từ nền tảng hiện tại.</li>
    <li>Hỗ trợ đăng ký thi, nhận chứng chỉ và giao chứng chỉ tận nơi khi có nhu cầu.</li>
  </ul>
</section>`

        switch (preset) {
            case "courseArticle":
                return `${hero}
<section data-erg-block="course-intro" data-bg="plain" data-tone="light" data-width="wide" data-accent="blue" class="erg-block erg-block-rich-text erg-block-course-intro">
  <h2>Chứng chỉ Ứng dụng CNTT Nâng Cao là gì?</h2>
  <p><strong>Chứng chỉ Ứng dụng công nghệ thông tin Nâng Cao</strong> là chứng chỉ tin học được đào tạo theo yêu cầu của chuẩn kỹ năng sử dụng CNTT nâng cao.</p>
  <p>Để đạt chứng chỉ, học viên cần có nền tảng tin học cơ bản và hoàn thành nhóm mô đun nâng cao phù hợp với mục tiêu học tập hoặc công việc.</p>
</section>
${requirements}
${benefit}
${infoCard}
${pricing}
<section data-erg-block="cta" data-bg="brand" data-tone="dark" data-width="wide" data-accent="red" class="erg-block erg-block-cta">
  <h2>Sẵn sàng bắt đầu cùng ERG?</h2>
  <p>Để lại thông tin để đội ngũ tư vấn liên hệ và gợi ý lộ trình phù hợp.</p>
  <p><a href="/lien-he">Liên hệ ERG</a></p>
</section>`
            case "courseHero":
                return hero
            case "requirementsImage":
                return requirements
            case "benefitBand":
                return benefit
            case "pricingOffer":
                return pricing
            case "infoCard":
                return infoCard
            default:
                return ""
        }
    }

    const getTopLevelInsertPos = () => {
        if (!editor) return null

        const { doc, selection } = editor.state
        let insertPos = doc.content.size

        doc.forEach((node: ProseMirrorNode, offset: number) => {
            const end = offset + node.nodeSize
            if (selection.from >= offset && selection.from <= end) {
                insertPos = end
            }
        })

        return insertPos
    }

    const insertTopLevelContent = (contentToInsert: unknown) => {
        if (!editor) return

        const insertPos = getTopLevelInsertPos()
        if (insertPos === null) return

        editor.chain().focus().insertContentAt(insertPos, contentToInsert as Content).run()
    }

    const insertTemplate = (template: BlockTemplate) => {
        if (editorEngine === "blocknote") {
            if (!blockNoteBridge) return
            if (template.preset) {
                blockNoteBridge.insertHtml(createCoursePresetHtml(template.preset))
                return
            }
            if (template.command === "image") {
                blockNoteBridge.insertImagePlaceholder()
                return
            }
            if (template.layoutCommand === "image-text-layout") {
                blockNoteBridge.insertImageTextLayout(template.layoutImagePosition ?? "right")
                return
            }
            if (template.html) {
                blockNoteBridge.insertHtml(template.html)
            }
            return
        }

        if (!editor) return
        if (template.preset) {
            insertTopLevelContent(createCoursePresetContent(template.preset))
            return
        }
        if (template.command === "image") {
            editor.chain().focus().setImageUploadNode().run()
            return
        }
        if (template.layoutCommand === "image-text-layout") {
            insertTopLevelContent(createImageTextBlock(template.layoutImagePosition ?? "right"))
            return
        }
        if (template.html) {
            insertTopLevelContent(template.html)
        }
    }

    const insertImageTextLayoutShortcut = (imagePosition: "left" | "right") => {
        const template = blockTemplates.find(item =>
            item.layoutCommand === "image-text-layout"
            && item.layoutImagePosition === imagePosition
        )
        if (template) {
            insertTemplate(template)
        }
    }

    const insertPresetShortcut = (preset: CoursePreset) => {
        const template = blockTemplates.find(item => item.preset === preset)
        if (template) {
            insertTemplate(template)
        }
    }

    const updateSelectedNode = (attrs: SelectionAttrs) => {
        if (!editor || !selectionState) return
        const { state, view } = editor
        const node = state.doc.nodeAt(selectionState.pos)
        if (!node) return

        const tr = state.tr.setNodeMarkup(selectionState.pos, undefined, {
            ...node.attrs,
            ...attrs,
        })
        view.dispatch(tr)
        editor.commands.focus()
        setSelectionState({
            ...selectionState,
            attrs: {
                ...selectionState.attrs,
                ...attrs,
            },
        })
    }

    const deleteSelectedNode = () => {
        if (!editor || !selectionState) return
        editor.chain().focus().deleteRange({
            from: selectionState.pos,
            to: selectionState.pos + selectionState.nodeSize,
        }).run()
        setSelectionState(null)
    }

    const duplicateSelectedNode = () => {
        if (!editor || !selectionState) return
        const { state, view } = editor
        const node = state.doc.nodeAt(selectionState.pos)
        if (!node) return
        const tr = state.tr.insert(selectionState.pos + node.nodeSize, node.copy(node.content))
        view.dispatch(tr.scrollIntoView())
        editor.commands.focus()
    }

    const moveSelectedSection = (direction: "up" | "down") => {
        if (!editor || !selectionState || selectionState.type !== "section") return
        const { state, view } = editor
        const blocks: Array<{ pos: number; nodeSize: number }> = []
        state.doc.forEach((node: ProseMirrorNode, offset: number) => {
            blocks.push({ pos: offset, nodeSize: node.nodeSize })
        })

        const index = blocks.findIndex(block => block.pos === selectionState.pos)
        if (index === -1) return
        const targetIndex = direction === "up" ? index - 1 : index + 1
        if (targetIndex < 0 || targetIndex >= blocks.length) return

        const selected = blocks[index]
        const target = blocks[targetIndex]
        const slice = state.doc.slice(selected.pos, selected.pos + selected.nodeSize)
        let tr = state.tr.delete(selected.pos, selected.pos + selected.nodeSize)
        const insertPos = direction === "up"
            ? target.pos
            : target.pos + target.nodeSize - selected.nodeSize
        tr = tr.insert(insertPos, slice.content)
        view.dispatch(tr.scrollIntoView())
        editor.commands.focus()
    }

    return (
        <div className="relative flex h-[calc(100vh-4rem)] w-full flex-col overflow-hidden bg-white">
            <header className="flex h-14 shrink-0 items-center justify-between border-b bg-white px-4">
                <div className="flex min-w-0 items-center gap-3">
                    <Button variant="ghost" size="icon-sm" type="button" onClick={() => history.back()} title="Quay lại">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={showBlocks ? "secondary" : "outline"}
                        size="sm"
                        type="button"
                        onClick={() => setShowBlocks(value => !value)}
                    >
                        <Wand2 className="h-4 w-4" />
                        Blocks
                    </Button>
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <h1 className="truncate text-sm font-semibold text-zinc-950">
                                {mode === "edit" ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}
                            </h1>
                            <Badge variant="outline" className="rounded-md bg-zinc-50 px-1.5 text-[10px] uppercase text-zinc-500">
                                {statusLabel}
                            </Badge>
                        </div>
                        <p className="truncate text-xs text-zinc-500">
                            Canvas WYSIWYG rộng hơn, panel mở khi cần để xem trước, SEO hoặc chỉnh block.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="hidden items-center rounded-lg border bg-zinc-100 p-1 text-xs font-bold text-zinc-600 lg:flex">
                        <button
                            type="button"
                            onClick={() => handleEngineChange("canvas")}
                            className={cn(
                                "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 transition",
                                editorEngine === "canvas" ? "bg-white text-blue-700 shadow-sm" : "hover:text-zinc-900"
                            )}
                        >
                            <LayoutTemplate className="h-3.5 w-3.5" />
                            Canvas ERG
                        </button>
                        <button
                            type="button"
                            onClick={() => handleEngineChange("blocknote")}
                            className={cn(
                                "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 transition",
                                editorEngine === "blocknote" ? "bg-white text-violet-700 shadow-sm" : "hover:text-zinc-900"
                            )}
                        >
                            <SquareStack className="h-3.5 w-3.5" />
                            BlockNote
                        </button>
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={() => openPanel("preview")}>
                        <Monitor className="h-4 w-4" />
                        Xem trước
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => openPanel("settings")}>
                        <Settings2 className="h-4 w-4" />
                        Cài đặt
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => openPanel("seo")}>
                        <PanelRight className="h-4 w-4" />
                        SEO
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => openPanel("block")}>
                        <Bot className="h-4 w-4" />
                        Khối
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={onSaveDraft || onSave} disabled={isSaving}>
                        <Save className="h-4 w-4" />
                        Lưu nháp
                    </Button>
                    <Button type="button" size="sm" className="bg-zinc-950 text-white hover:bg-zinc-800" onClick={onSave} disabled={isSaving}>
                        <Send className="h-4 w-4" />
                        {isSaving ? "Đang lưu..." : publishLabel}
                    </Button>
                </div>
            </header>

            <div className={cn("grid min-h-0 flex-1 gap-0 transition-[grid-template-columns] duration-300", showBlocks ? "grid-cols-[280px_minmax(0,1fr)]" : "grid-cols-[0px_minmax(0,1fr)]")}>
                <aside className={cn("min-h-0 overflow-hidden border-r bg-white transition-opacity", showBlocks ? "opacity-100" : "pointer-events-none opacity-0")}>
                    <div className="flex h-full min-w-[280px] flex-col">
                        <div className="border-b px-4 py-3">
                            <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
                                <Wand2 className="h-4 w-4 text-primary" />
                                Thư viện block
                            </div>
                            <p className="mt-1 text-xs leading-5 text-zinc-500">
                                Thêm section như Notion, sau đó chọn khối để chỉnh màu, width và thứ tự.
                            </p>
                            <div className="relative mt-3">
                                <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                                <Input
                                    value={blockQuery}
                                    onChange={(event) => setBlockQuery(event.target.value)}
                                    placeholder="Tìm hero, gallery, FAQ..."
                                    className="h-9 pl-9 text-sm"
                                />
                            </div>
                            <div className="mt-3 grid grid-cols-2 gap-2">
                                <Button
                                    type="button"
                                    variant="default"
                                    size="sm"
                                    className="col-span-2 justify-start bg-zinc-950 text-xs text-white hover:bg-zinc-800"
                                    onClick={() => insertPresetShortcut("courseArticle")}
                                    disabled={!canInsertBlock}
                                    title="Chèn trọn bộ bố cục giống bài Edusa/ERG"
                                >
                                    <LayoutTemplate className="h-4 w-4" />
                                    Tạo mẫu bài khóa học
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="justify-start text-xs"
                                    onClick={() => insertImageTextLayoutShortcut("right")}
                                    disabled={!canInsertBlock}
                                    title="Chèn chữ bên trái, ảnh bên phải"
                                >
                                    <Columns2 className="h-4 w-4" />
                                    Chữ | ảnh
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="justify-start text-xs"
                                    onClick={() => insertImageTextLayoutShortcut("left")}
                                    disabled={!canInsertBlock}
                                    title="Chèn ảnh bên trái, chữ bên phải"
                                >
                                    <Columns2 className="h-4 w-4" />
                                    Ảnh | chữ
                                </Button>
                            </div>
                        </div>

                        <div className="flex gap-1 overflow-x-auto border-b px-3 py-2">
                            {blockCategories.map(category => (
                                <button
                                    key={category}
                                    type="button"
                                    onClick={() => setBlockCategory(category)}
                                    className={cn(
                                        "shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition",
                                        blockCategory === category
                                            ? "bg-zinc-950 text-white"
                                            : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                                    )}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>

                        <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
                            {filteredBlocks.map((template) => {
                                const Icon = template.icon
                                return (
                                    <button
                                        key={template.id}
                                        type="button"
                                        className="group flex w-full items-start gap-3 rounded-xl border border-transparent p-3 text-left transition hover:border-blue-100 hover:bg-blue-50/70"
                                        onClick={() => insertTemplate(template)}
                                        disabled={!canInsertBlock}
                                    >
                                        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600 transition group-hover:bg-white group-hover:text-primary">
                                            <Icon className="h-4 w-4" />
                                        </span>
                                        <span className="min-w-0">
                                            <span className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
                                                {template.title}
                                                <span className="rounded-full bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-500">
                                                    {template.category}
                                                </span>
                                            </span>
                                            <span className="mt-0.5 block text-xs leading-5 text-zinc-500">{template.description}</span>
                                        </span>
                                    </button>
                                )
                            })}
                        </div>

                        <div className="border-t p-3">
                            <Button type="button" variant="outline" className="w-full justify-start" onClick={() => setShowAiInput(true)}>
                                <Sparkles className="h-4 w-4 text-violet-600" />
                                AI Writer
                            </Button>
                        </div>
                    </div>
                </aside>

                <main className="relative min-h-0 bg-[#fbfcfe]">
                    {editorEngine === "canvas" ? (
                        <SimpleEditor
                            key={`canvas-${mode}-${postId || "new"}`}
                            initialContent={currentContent}
                            onEditorReady={handleEditorReady}
                            onRefine={onRefine}
                            title={title}
                            onTitleChange={onTitleChange}
                            onContentChange={(html) => {
                                onStructuredContentChange?.(null)
                                onContentChange(html)
                            }}
                            onSelectionChange={(selection) => {
                                setSelectionState(selection)
                            }}
                        />
                    ) : (
                        <BlockNotePostEditor
                            key={`blocknote-${mode}-${postId || "new"}`}
                            title={title}
                            onTitleChange={onTitleChange}
                            initialContent={currentContent}
                            onContentChange={onContentChange}
                            onBlocksChange={(blocks) => onStructuredContentChange?.(blocks)}
                            onBridgeReady={handleBlockNoteReady}
                        />
                    )}

                    {editorEngine === "canvas" && selectionState?.type === "section" && (
                        <div className="pointer-events-none absolute bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-full border bg-white/95 px-3 py-2 text-xs font-semibold text-zinc-600 shadow-lg backdrop-blur">
                            Đang chọn khối: {String(selectionState.attrs.dataErgBlock || "section")} · mở tab Khối để chỉnh màu, xóa hoặc di chuyển
                        </div>
                    )}

                    {isInputVisible && onStartAi && (
                        <AiWriterBar
                            isGenerating={!!isGenerating}
                            progress={aiProgress}
                            onStart={onStartAi}
                            onClose={() => setShowAiInput(false)}
                        />
                    )}
                </main>
            </div>

            {panelOpen && (
                <aside className="absolute bottom-5 right-5 top-20 z-40 flex w-[min(520px,calc(100vw-2rem))] flex-col overflow-hidden rounded-xl border bg-white shadow-2xl">
                    <div className="border-b bg-white p-3">
                        <div className="flex items-center justify-between gap-3">
                            <div className="grid flex-1 grid-cols-4 gap-1 rounded-xl bg-zinc-100 p-1">
                                <PanelTab active={rightTab === "preview"} onClick={() => setRightTab("preview")} icon={Monitor} label="Xem" />
                                <PanelTab active={rightTab === "settings"} onClick={() => setRightTab("settings")} icon={Settings2} label="Cài đặt" />
                                <PanelTab active={rightTab === "seo"} onClick={() => setRightTab("seo")} icon={PanelRight} label="SEO" />
                                <PanelTab active={rightTab === "block"} onClick={() => setRightTab("block")} icon={Bot} label="Khối" />
                            </div>
                            <Button type="button" variant="ghost" size="icon-sm" onClick={() => setPanelOpen(false)} title="Đóng panel">
                                <PanelRightClose className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="min-h-0 flex-1 overflow-y-auto bg-[#f7f8fb]">
                        {rightTab === "preview" && (
                            <PreviewPanel
                                previewMode={previewMode}
                                setPreviewMode={setPreviewMode}
                                previewConfig={previewConfig}
                                previewPost={previewPost}
                                currentContent={currentContent}
                            />
                        )}

                        {rightTab === "settings" && (
                            <SettingsPanel
                                postId={postId}
                                title={title}
                                currentContent={currentContent}
                                postMetadata={postMetadata}
                                onMetadataChange={onMetadataChange}
                            />
                        )}

                        {rightTab === "seo" && (
                            <LiveSeoPanel
                                title={title}
                                content={currentContent}
                                postMetadata={postMetadata}
                                onMetadataChange={onMetadataChange}
                            />
                        )}

                        {rightTab === "block" && (
                            <BlockInspector
                                selection={selectionState}
                                onChange={updateSelectedNode}
                                onDelete={deleteSelectedNode}
                                onDuplicate={duplicateSelectedNode}
                                onMove={moveSelectedSection}
                            />
                        )}
                    </div>
                </aside>
            )}
        </div>
    )
}

function PanelTab({
    active,
    onClick,
    icon: Icon,
    label,
}: {
    active: boolean
    onClick: () => void
    icon: ComponentType<{ className?: string }>
    label: string
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "flex h-9 items-center justify-center gap-1.5 rounded-lg text-xs font-semibold transition",
                active ? "bg-white text-zinc-950 shadow-sm" : "text-zinc-500 hover:text-zinc-950"
            )}
        >
            <Icon className="h-3.5 w-3.5" />
            {label}
        </button>
    )
}

function PreviewPanel({
    previewMode,
    setPreviewMode,
    previewConfig,
    previewPost,
    currentContent,
}: {
    previewMode: typeof previewModes[number]["id"]
    setPreviewMode: (value: typeof previewModes[number]["id"]) => void
    previewConfig: typeof previewModes[number]
    previewPost: { title: string; excerpt: string; category: string; thumbnailUrl?: string | null }
    currentContent: string
}) {
    return (
        <div className="p-4">
            <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">Live preview</p>
                    <h2 className="mt-1 text-lg font-bold text-zinc-950">Bản xem trước public</h2>
                    <p className="mt-1 text-sm leading-6 text-zinc-500">
                        Dùng renderer public và cập nhật theo nội dung đang soạn.
                    </p>
                </div>
                <div className="flex rounded-xl border bg-white p-1">
                    {previewModes.map((item) => {
                        const Icon = item.icon
                        return (
                            <button
                                key={item.id}
                                type="button"
                                title={item.label}
                                onClick={() => setPreviewMode(item.id)}
                                className={cn(
                                    "flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500",
                                    previewMode === item.id && "bg-zinc-950 text-white"
                                )}
                            >
                                <Icon className="h-4 w-4" />
                            </button>
                        )
                    })}
                </div>
            </div>

            <div className={cn("mx-auto transition-all", previewConfig.width)}>
                <div className={cn("overflow-hidden border bg-white shadow-sm", previewConfig.frame)}>
                    <div className="flex h-9 items-center gap-1.5 border-b bg-zinc-50 px-3">
                        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                        <span className="ml-2 truncate rounded-md bg-white px-2 py-1 text-[10px] font-medium text-zinc-500">
                            erg.edu.vn/tin-tuc/preview
                        </span>
                    </div>

                    <article className="max-h-[calc(100vh-220px)] overflow-y-auto bg-white">
                        {previewPost.thumbnailUrl && (
                            <div className="aspect-[16/9] bg-zinc-100">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={previewPost.thumbnailUrl} alt="" className="h-full w-full object-cover" />
                            </div>
                        )}
                        <div className={cn("p-6", previewMode !== "mobile" && "md:p-8")}>
                            <div className="mb-4 flex flex-wrap items-center gap-2 text-xs font-medium text-zinc-500">
                                <span className="rounded-md bg-blue-50 px-2 py-1 text-blue-700">{previewPost.category}</span>
                                <span>Bản nháp trực tiếp</span>
                            </div>
                            <h2 className={cn("font-black leading-tight text-zinc-950", previewMode === "mobile" ? "text-3xl" : "text-4xl")}>
                                {previewPost.title}
                            </h2>
                            {previewPost.excerpt && (
                                <p className="mt-4 text-base leading-7 text-zinc-600">{previewPost.excerpt}</p>
                            )}
                            <div className="mt-8">
                                <PostContentRenderer content={currentContent} />
                            </div>
                        </div>
                    </article>
                </div>
            </div>
        </div>
    )
}

function SettingsPanel({
    postId,
    title,
    currentContent,
    postMetadata,
    onMetadataChange,
}: {
    postId?: string
    title: string
    currentContent: string
    postMetadata: PostMetadata
    onMetadataChange: (data: Partial<PostMetadata>) => void
}) {
    const wordCount = useMemo(() => {
        const text = currentContent.replace(/<[^>]+>/g, " ").trim()
        return text ? text.split(/\s+/).length : 0
    }, [currentContent])

    return (
        <div className="space-y-4 p-4">
            <SectionCard title="Tổng quan bài viết" description="Thông tin nhanh để kiểm soát trước khi lưu hoặc xuất bản.">
                <div className="grid grid-cols-3 gap-2">
                    <Metric label="ID" value={postId ? "Đã có" : "Bài mới"} />
                    <Metric label="Từ" value={`${wordCount}`} />
                    <Metric label="Trạng thái" value={postMetadata.status || "draft"} />
                </div>
            </SectionCard>

            <SectionCard title="Phân loại & ảnh đại diện" description="Nhóm nội dung, trạng thái và thumbnail dùng cho card tin tức.">
                <PostSidebarTaxonomy post={postMetadata} onUpdate={onMetadataChange} />
            </SectionCard>

            <SectionCard title="Tóm tắt hiển thị" description="Sapo và slug phục vụ danh sách tin, preview và chia sẻ.">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-xs font-bold">Slug</Label>
                        <Input
                            value={postMetadata.slug || ""}
                            placeholder="tu-dong-tao-tu-tieu-de"
                            onChange={(event) => onMetadataChange({ slug: event.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-bold">Mô tả ngắn</Label>
                        <Textarea
                            value={postMetadata.excerpt || ""}
                            placeholder={`Tóm tắt bài "${title || "chưa có tiêu đề"}"...`}
                            className="min-h-24"
                            onChange={(event) => onMetadataChange({ excerpt: event.target.value })}
                        />
                    </div>
                </div>
            </SectionCard>
        </div>
    )
}

function LiveSeoPanel({
    title,
    content,
    postMetadata,
    onMetadataChange,
}: {
    title: string
    content: string
    postMetadata: PostMetadata
    onMetadataChange: (data: Partial<PostMetadata>) => void
}) {
    const keyword = postMetadata.keywords || postMetadata.focusKeyword || ""
    const metaDescription = postMetadata.metaDescription || postMetadata.excerpt || ""
    const analysis = useMemo(
        () => localSeoAnalyzer(content, postMetadata.metaTitle || title, metaDescription, keyword, postMetadata.slug || ""),
        [content, keyword, metaDescription, postMetadata.metaTitle, postMetadata.slug, title]
    )

    const scoreTone = analysis.overallScore >= 80
        ? "text-emerald-600 bg-emerald-50 border-emerald-100"
        : analysis.overallScore >= 55
            ? "text-amber-600 bg-amber-50 border-amber-100"
            : "text-red-600 bg-red-50 border-red-100"

    return (
        <div className="space-y-4 p-4">
            <div className={cn("rounded-2xl border p-4", scoreTone)}>
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-70">SEO live</p>
                        <h2 className="mt-1 text-xl font-black">{analysis.overallScore}/100</h2>
                        <p className="mt-1 text-sm opacity-80">Chấm điểm ngay khi đang soạn, không cần lưu nháp.</p>
                    </div>
                    <div
                        className="grid h-16 w-16 place-items-center rounded-full border-4 border-current bg-white text-lg font-black"
                        style={{ opacity: 0.95 }}
                    >
                        {analysis.overallScore}
                    </div>
                </div>
            </div>

            <SectionCard title="Meta SEO" description="Tối ưu cách Google và mạng xã hội hiển thị bài viết.">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label className="text-xs font-bold">Meta title</Label>
                            <span className={cn("text-xs font-semibold", analysis.titleAnalysis.length > 70 ? "text-red-500" : "text-zinc-500")}>
                                {analysis.titleAnalysis.length}/70
                            </span>
                        </div>
                        <Input
                            value={postMetadata.metaTitle || ""}
                            placeholder={title || "Tiêu đề bài viết"}
                            onChange={(event) => onMetadataChange({ metaTitle: event.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label className="text-xs font-bold">Meta description</Label>
                            <span className={cn("text-xs font-semibold", analysis.metaAnalysis.length > 160 ? "text-red-500" : "text-zinc-500")}>
                                {analysis.metaAnalysis.length}/160
                            </span>
                        </div>
                        <Textarea
                            value={postMetadata.metaDescription || ""}
                            placeholder="Mô tả ngắn gọn, có từ khóa chính và lý do người đọc nên mở bài."
                            className="min-h-24"
                            onChange={(event) => onMetadataChange({ metaDescription: event.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-bold">Từ khóa chính</Label>
                        <Input
                            value={postMetadata.keywords || ""}
                            placeholder="Ví dụ: khóa học CNTT nâng cao"
                            onChange={(event) => onMetadataChange({ keywords: event.target.value })}
                        />
                    </div>
                </div>
            </SectionCard>

            <SectionCard title="Phân tích nội dung" description="Các chỉ số được tính trực tiếp từ HTML đang soạn.">
                <div className="grid grid-cols-2 gap-2">
                    <Metric label="Số từ" value={`${analysis.contentAnalysis.wordCount}`} />
                    <Metric label="H2/H3" value={`${analysis.contentAnalysis.headingStructure.h2}/${analysis.contentAnalysis.headingStructure.h3}`} />
                    <Metric label="Ảnh có alt" value={`${analysis.technicalAnalysis.imageAltTags.withAlt}/${analysis.technicalAnalysis.imageAltTags.total}`} />
                    <Metric label="Liên kết nội bộ" value={`${analysis.technicalAnalysis.internalLinks}`} />
                </div>
            </SectionCard>

            <SectionCard title="Gợi ý cải thiện" description="Ưu tiên những điểm tác động trực tiếp tới bài đang soạn.">
                <div className="space-y-2">
                    {analysis.suggestions.length > 0 ? analysis.suggestions.map((suggestion) => (
                        <div key={suggestion} className="flex gap-2 rounded-xl border bg-white p-3 text-sm leading-6 text-zinc-600">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                            <span>{suggestion}</span>
                        </div>
                    )) : (
                        <div className="flex gap-2 rounded-xl border bg-emerald-50 p-3 text-sm leading-6 text-emerald-700">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                            Nội dung đang ổn. Tiếp tục kiểm tra ảnh, internal link và CTA trước khi xuất bản.
                        </div>
                    )}
                </div>
            </SectionCard>

            <SectionCard title="Kỹ thuật SEO" description="Các tùy chọn nâng cao cho crawler và schema.">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-xs font-bold">Canonical URL</Label>
                        <Input
                            value={postMetadata.canonicalUrl || ""}
                            placeholder="https://erg.edu.vn/tin-tuc/..."
                            onChange={(event) => onMetadataChange({ canonicalUrl: event.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-bold">Schema type</Label>
                        <Input
                            value={postMetadata.schemaType || "Article"}
                            placeholder="Article"
                            onChange={(event) => onMetadataChange({ schemaType: event.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <label className="flex items-center gap-2 rounded-xl border bg-white p-3 text-sm">
                            <input
                                type="checkbox"
                                checked={!!postMetadata.noindex}
                                onChange={(event) => onMetadataChange({ noindex: event.target.checked })}
                            />
                            noindex
                        </label>
                        <label className="flex items-center gap-2 rounded-xl border bg-white p-3 text-sm">
                            <input
                                type="checkbox"
                                checked={!!postMetadata.nofollow}
                                onChange={(event) => onMetadataChange({ nofollow: event.target.checked })}
                            />
                            nofollow
                        </label>
                    </div>
                </div>
            </SectionCard>
        </div>
    )
}

function BlockInspector({
    selection,
    onChange,
    onDelete,
    onDuplicate,
    onMove,
}: {
    selection: EditorSelectionState
    onChange: (attrs: SelectionAttrs) => void
    onDelete: () => void
    onDuplicate: () => void
    onMove: (direction: "up" | "down") => void
}) {
    if (!selection) {
        return (
            <div className="flex min-h-[420px] flex-col items-center justify-center p-6 text-center">
                <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-white shadow-sm">
                    <Palette className="h-6 w-6 text-zinc-400" />
                </div>
                <p className="text-sm font-semibold text-zinc-900">Chọn một khối trong canvas</p>
                <p className="mt-2 max-w-xs text-sm leading-6 text-zinc-500">
                    Khi chọn section hoặc ảnh, panel này sẽ hiện màu nền, kích thước, căn lề và thao tác xóa/nhân bản/di chuyển.
                </p>
            </div>
        )
    }

    if (selection.type === "image") {
        return <ImageInspector selection={selection} onChange={onChange} onDelete={onDelete} />
    }

    const isImageTextSection = selection.attrs.dataErgBlock === "image-text" || selection.attrs.dataEditorNode === "image-text" || !!selection.attrs.src
    const imagePosition = selection.attrs.imagePosition === "left" || selection.attrs.dataLayout === "image-text" ? "left" : "right"
    const imageWidth = Number.parseInt(String(selection.attrs.imageWidth || selection.attrs.dataImageWidth || 44), 10)
    const normalizedImageWidth = Number.isFinite(imageWidth) ? Math.min(Math.max(imageWidth, 30), 60) : 44

    return (
        <div className="space-y-4 p-4">
            <SectionCard title="Khối đang chọn" description={`Loại khối: ${String(selection.attrs.dataErgBlock || "section")}`}>
                <div className="grid grid-cols-2 gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => onMove("up")}>
                        <ArrowUp className="h-4 w-4" />
                        Lên
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => onMove("down")}>
                        <ArrowDown className="h-4 w-4" />
                        Xuống
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={onDuplicate}>
                        <Copy className="h-4 w-4" />
                        Nhân bản
                    </Button>
                    <Button type="button" variant="destructive" size="sm" onClick={onDelete}>
                        <Trash2 className="h-4 w-4" />
                        Xóa khối
                    </Button>
                </div>
            </SectionCard>

            {isImageTextSection && (
                <SectionCard title="Ảnh và chữ cùng hàng" description="Dùng phần này để đặt ảnh trái/phải và chỉnh tỷ lệ cột ảnh như Word/Google Docs.">
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-2">
                            <Button
                                type="button"
                                variant={imagePosition === "left" ? "default" : "outline"}
                                size="sm"
                                onClick={() => onChange({ imagePosition: "left", dataLayout: "image-text" })}
                            >
                                <PanelRight className="h-4 w-4 rotate-180" />
                                Ảnh trái
                            </Button>
                            <Button
                                type="button"
                                variant={imagePosition === "right" ? "default" : "outline"}
                                size="sm"
                                onClick={() => onChange({ imagePosition: "right", dataLayout: "text-image" })}
                            >
                                <PanelRight className="h-4 w-4" />
                                Ảnh phải
                            </Button>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label className="text-xs font-bold">Tỷ lệ cột ảnh</Label>
                                <span className="text-xs font-semibold text-zinc-500">{normalizedImageWidth}%</span>
                            </div>
                            <Slider
                                value={[normalizedImageWidth]}
                                min={30}
                                max={60}
                                step={2}
                                onValueChange={(value) => onChange({ imageWidth: value[0], dataImageWidth: value[0] })}
                            />
                        </div>
                    </div>
                </SectionCard>
            )}

            <SectionCard title="Màu nền" description="Đổi nền của section mà public renderer vẫn giữ nguyên.">
                <div className="grid grid-cols-2 gap-2">
                    {bgOptions.map(option => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => onChange({ dataBg: option.value })}
                            className={cn(
                                "flex items-center gap-2 rounded-xl border bg-white p-2 text-sm font-semibold text-zinc-700 transition hover:border-zinc-400",
                                selection.attrs.dataBg === option.value && "border-zinc-950 ring-2 ring-zinc-950/10"
                            )}
                        >
                            <span className={cn("h-6 w-6 rounded-lg border", option.className)} />
                            {option.label}
                        </button>
                    ))}
                </div>
            </SectionCard>

            <SectionCard title="Tone chữ & chiều rộng" description="Dùng cho các block nền tối, hero hoặc section cần rộng hơn bài thường.">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-xs font-bold">Tone chữ</Label>
                        <Select
                            value={String(selection.attrs.dataTone || "light")}
                            onValueChange={(value) => onChange({ dataTone: value })}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="light">Sáng</SelectItem>
                                <SelectItem value="dark">Tối</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-bold">Chiều rộng khối</Label>
                        <div className="grid grid-cols-3 gap-2">
                            {widthOptions.map(option => (
                                <Button
                                    key={option.value}
                                    type="button"
                                    variant={selection.attrs.dataWidth === option.value ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => onChange({ dataWidth: option.value })}
                                >
                                    {option.label}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            </SectionCard>

            <SectionCard title="Màu nhấn" description="Áp dụng cho eyebrow, nút CTA, viền nhấn và chi tiết phụ.">
                <div className="grid grid-cols-2 gap-2">
                    {accentOptions.map(option => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => onChange({ dataAccent: option.value })}
                            className={cn(
                                "flex items-center gap-2 rounded-xl border bg-white p-2 text-sm font-semibold text-zinc-700 transition hover:border-zinc-400",
                                selection.attrs.dataAccent === option.value && "border-zinc-950 ring-2 ring-zinc-950/10"
                            )}
                        >
                            <span className={cn("h-6 w-6 rounded-lg", option.className)} />
                            {option.label}
                        </button>
                    ))}
                </div>
            </SectionCard>
        </div>
    )
}

function ImageInspector({
    selection,
    onChange,
    onDelete,
}: {
    selection: NonNullable<EditorSelectionState>
    onChange: (attrs: SelectionAttrs) => void
    onDelete: () => void
}) {
    const attrs = selection.attrs
    const widthValue = Number.parseInt(String(attrs.width || attrs.dataWidth || 100), 10)
    const normalizedWidth = Number.isFinite(widthValue) ? Math.min(Math.max(widthValue, 30), 100) : 100

    return (
        <div className="space-y-4 p-4">
            <SectionCard title="Ảnh trong bài viết" description="Các thuộc tính này được dùng lại ở public renderer.">
                {typeof attrs.src === "string" && attrs.src && (
                    <div className="mb-4 overflow-hidden rounded-xl border bg-zinc-50">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={attrs.src} alt={String(attrs.alt || "")} className="max-h-52 w-full object-contain" />
                    </div>
                )}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-xs font-bold">Alt text</Label>
                        <Input
                            value={String(attrs.alt || "")}
                            placeholder="Mô tả nội dung ảnh cho SEO/accessibility"
                            onChange={(event) => onChange({ alt: event.target.value })}
                        />
                        {!attrs.alt && <p className="text-xs font-medium text-amber-600">Ảnh đang thiếu alt text.</p>}
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-bold">Caption</Label>
                        <Textarea
                            value={String(attrs.caption || "")}
                            placeholder="Chú thích hiển thị bên dưới ảnh"
                            onChange={(event) => onChange({ caption: event.target.value })}
                            className="min-h-20"
                        />
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label className="text-xs font-bold">Độ rộng</Label>
                            <span className="text-xs font-semibold text-zinc-500">{normalizedWidth}%</span>
                        </div>
                        <Slider
                            value={[normalizedWidth]}
                            min={30}
                            max={100}
                            step={5}
                            onValueChange={(value) => onChange({ width: `${value[0]}%` })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-bold">Căn lề</Label>
                        <div className="grid grid-cols-4 gap-2">
                            {[
                                ["left", "Trái"],
                                ["center", "Giữa"],
                                ["right", "Phải"],
                                ["full", "Full"],
                            ].map(([value, label]) => (
                                <Button
                                    key={value}
                                    type="button"
                                    variant={attrs.align === value ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => onChange({ align: value })}
                                >
                                    {label}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <Button type="button" variant="destructive" className="w-full" onClick={onDelete}>
                        <Trash2 className="h-4 w-4" />
                        Xóa ảnh
                    </Button>
                </div>
            </SectionCard>
        </div>
    )
}

function SectionCard({
    title,
    description,
    children,
}: {
    title: string
    description?: string
    children: ReactNode
}) {
    return (
        <section className="rounded-2xl border bg-white p-4 shadow-sm">
            <div className="mb-4">
                <h3 className="text-sm font-bold text-zinc-950">{title}</h3>
                {description && <p className="mt-1 text-xs leading-5 text-zinc-500">{description}</p>}
            </div>
            {children}
        </section>
    )
}

function Metric({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-xl border bg-zinc-50 p-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-400">{label}</p>
            <p className="mt-1 truncate text-sm font-black text-zinc-950">{value}</p>
        </div>
    )
}
