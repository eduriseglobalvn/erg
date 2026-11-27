import type { CoursePreset } from "./visual-post-editor-types"

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

export const createImageTextBlock = (
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

export const createCoursePresetContent = (preset: CoursePreset) => {
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

export const createCoursePresetHtml = (preset: CoursePreset) => {
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
