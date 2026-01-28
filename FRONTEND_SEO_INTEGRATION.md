# PROMPT CHO TEAM FRONTEND (SEO INTEGRATION)

Dưới đây là hướng dẫn chi tiết (hoặc Prompt để đưa cho AI Coder làm Frontend) để tích hợp các API SEO mới từ Backend.

---

## 🚀 Context
Backend đã nâng cấp hệ thống SEO "Core-v2" với các tính năng:
1.  **Entity Post**: Đã có thêm `metaTitle`, `metaDescription`, `canonicalUrl`, `schemaType`, `seoScore`.
2.  **Sitemap API**: `GET /sitemap/data` trả về toàn bộ link bài viết, danh mục.
3.  **Analyzer**: Tự động chấm điểm SEO và sinh Meta khi tạo bài.

## 📋 Nhiệm Vụ Frontend (Checklist)

### 1. Hiển Thị Metadata Động (Next.js App Router)
**File**: `app/posts/[slug]/page.tsx`
Cập nhật function `generateMetadata`:

```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await getPostBySlug(params.slug); // API mới đã trả về full fields

  return {
    title: post.metaTitle || post.title, // Ưu tiên Meta Title
    description: post.metaDescription || post.excerpt,
    alternates: {
      canonical: post.canonicalUrl || `${process.env.NEXT_PUBLIC_DOMAIN}/posts/${post.slug}`,
    },
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      images: [
        {
          url: post.thumbnailUrl, // Backend đảm bảo đây là ảnh thật
          width: 1200,
          height: 630,
        }
      ],
      type: 'article',
    },
    keywords: post.keywords?.split(',') || [],
  };
}
```

### 2. Thêm Structured Data (JSON-LD)
**File**: `app/posts/[slug]/page.tsx`
Inject JSON-LD vào thẻ `<head>` để Google hiển thị Rich Snippets (Carousel, Article, v.v):

```tsx
// Trong Component
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': post.schemaType || 'Article', // Mặc định là Article nếu null
  headline: post.metaTitle || post.title,
  image: [post.thumbnailUrl],
  datePublished: post.publishedAt,
  dateModified: post.updatedAt,
  author: [{
      '@type': 'Person',
      name: post.author.fullName, // Hoặc field tương ứng
      url: post.author.socialLinks?.linkedin // Nếu có
  }]
};

return (
  <section>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
    {/* Content */}
  </section>
)
```

### 3. Tạo Sitemap Tự Động
**File**: `app/sitemap.ts` (Next.js)
Gọi API backend để render XML.

```typescript
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Gọi API backend mình vừa làm
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sitemap/data`);
  const data = await response.json();
  
  // Mapping dữ liệu từ BE sang chuẩn Sitemap Next.js
  return data.urls.map((item: any) => ({
    url: `${process.env.NEXT_PUBLIC_DOMAIN}${item.loc}`,
    lastModified: item.lastmod,
    changeFrequency: item.changefreq,
    priority: item.priority,
  }));
}
```

### 4. Admin Dashboard (Tạo Bài Viết)
Cập nhật form tạo/sửa bài viết (`PostForm.tsx`):
- **Hiển thị Điểm SEO**: Backend trả về `seoScore` (0-100). Hiển thị thanh progress bar màu (Đỏ < 50, Vàng < 80, Xanh > 80).
- **Trường Input SEO**: Thêm 1 tab/section "Cấu hình SEO" cho phép user sửa tay nếu muốn override tự động:
    - Input `Meta Title` (Placeholder = Title bài viết).
    - Input `Meta Description` (Placeholder = Auto generate).
    - Input `Focus Keyword`.
    - Dropdown `Schema Type` (Article/News/Blog).

---

## 💡 Lưu Ý Cho Dev AE
- API `/posts/:slug` hiện tại đã bao gồm tất cả fields mới (`seoScore`, `metaTitle`...). Không cần gọi thêm API phụ.
- Nếu post chưa có `seoScore` (bài cũ), hiển thị "N/A" hoặc chạy update lại để trigger tính điểm.
