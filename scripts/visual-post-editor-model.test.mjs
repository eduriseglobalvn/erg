import { describe, expect, it } from "bun:test"

import { blockTemplates } from "../src/components/cms/posts/visual-post-editor-block-templates.ts"
import { createPreviewPost, filterBlockTemplates } from "../src/components/cms/posts/visual-post-editor-model.ts"

describe("visual post editor model", () => {
    it("filters block templates by category and normalized query", () => {
        const result = filterBlockTemplates(blockTemplates, "Media", "  video  ")

        expect(result.map((template) => template.id)).toEqual(["video"])
    })

    it("builds the preview model with stable fallbacks", () => {
        expect(createPreviewPost("", {})).toEqual({
            title: "Tiêu đề bài viết sẽ hiển thị tại đây",
            excerpt: "Mô tả ngắn của bài viết sẽ hiển thị ở khu vực public preview.",
            category: "ERG",
            thumbnailUrl: undefined,
        })
    })
})
