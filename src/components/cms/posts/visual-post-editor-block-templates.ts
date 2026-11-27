import {
    Award,
    CalendarDays,
    CheckCircle2,
    Columns2,
    FileText,
    GalleryHorizontal,
    HelpCircle,
    Image as ImageIcon,
    LayoutTemplate,
    Link2,
    ListChecks,
    Quote,
    Rows3,
    Send,
    SquareStack,
    Table2,
    Video,
} from "lucide-react"
import type { BlockTemplate } from "./visual-post-editor-types"

export const blockTemplates: BlockTemplate[] = [
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
