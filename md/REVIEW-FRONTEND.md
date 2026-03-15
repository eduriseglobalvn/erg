# ERG Frontend - Review & Optimization Plan

> **Reviewer:** Senior Developer & PO
> **Ngày review:** 2026-03-02
> **Scope:** erg (Next.js 16+ Frontend)
> **File gốc:** REVIEW-OPTIMIZATION-PLAN.md

---

## MỤC LỤC

1. [Admin Dashboard cho Hidden Content](#1-admin-dashboard-cho-hidden-content)
2. [AI Post Creation - Template Selection UI](#2-ai-post-creation---template-selection-ui)
3. [API Key Dashboard UI](#3-api-key-dashboard-ui)
4. [Notification System - Frontend Updates](#4-notification-system---frontend-updates)
5. [Bảo mật & Tối ưu hiệu suất Frontend](#5-bảo-mật--tối-ưu-hiệu-suất-frontend)

---

## 1. ADMIN DASHBOARD CHO HIDDEN CONTENT

> Liên quan: REVIEW-BACKEND.md Mục 3 (Dịch vụ Crawl ẩn)

### 1.1. Yêu cầu

- Trang Admin quản lý nội dung crawl ẩn (không hiển thị trên public site)
- Chỉ hiển thị khi user có permission `posts.manage_hidden`
- Cho phép xem, chuyển sang category công khai, xóa

### 1.2. Thiết kế trang `/admin/hidden-content`

```
Trang Admin: /admin/hidden-content
├── Tabs:
│   ├── Tips & Mẹo        (filter: hiddenType='tips')
│   ├── Tài liệu TK       (filter: hiddenType='reference')
│   └── Scrape Pool        (filter: hiddenType='scrape-pool')
├── Actions:
│   ├── Xem nội dung gốc
│   ├── Chuyển sang Category công khai (rewrite + publish)
│   ├── Xóa vĩnh viễn
│   └── Đánh dấu đã dùng / chưa dùng
└── Filters: Theo nguồn, theo ngày, theo trạng thái
```

### 1.3. Implementation

```
File mới: erg/src/app/@admin/[locale]/hidden-content/page.tsx
```

```typescript
// Sử dụng API endpoints từ backend:
// GET  /api/posts/hidden?hiddenType=tips&page=1&limit=20
// POST /api/posts/:id/promote  { targetCategoryId, rewrite?: boolean }

// Component structure:
// - HiddenContentPage (main page)
//   ├── HiddenContentTabs (tabs cho từng hiddenType)
//   ├── HiddenContentTable (danh sách bài viết)
//   │   ├── Columns: Tiêu đề, Nguồn, Ngày cào, Trạng thái
//   │   └── Actions: Xem | Promote | Xóa
//   ├── PromoteDialog (chọn category công khai + option rewrite bằng AI)
//   └── ContentPreviewDialog (xem nội dung gốc)
```

### 1.4. Bảo mật UI

- Route chỉ render khi `hasPermission('posts.manage_hidden')` = true
- Nếu không có permission → redirect về `/admin`
- Menu sidebar chỉ hiển thị mục "Hidden Content" khi có permission

### 1.5. Checklist

- [ ] Tạo page `/@admin/[locale]/hidden-content/page.tsx`
- [ ] Tạo components: `HiddenContentTabs`, `HiddenContentTable`, `PromoteDialog`
- [ ] Thêm API service functions trong `services/posts.ts`
- [ ] Thêm menu item "Hidden Content" vào sidebar (có permission check)
- [ ] Thêm permission check trong layout/middleware

---

## 2. AI POST CREATION - TEMPLATE SELECTION UI

> Liên quan: REVIEW-BACKEND.md Mục 4 (AI tạo Post chuyên nghiệp)

### 2.1. Yêu cầu

Hiện tại trang tạo AI post chỉ có input keyword. Cần thêm chọn template để AI tạo nội dung theo style phù hợp.

### 2.2. Templates có sẵn (từ Backend)

| Template | Mô tả | Max Images | Word Count |
|----------|--------|------------|------------|
| `informative` | Bài viết thông tin | 4 | 800-1200 |
| `howto` | Hướng dẫn thực hành | 6 | 1000-1500 |
| `listicle` | Danh sách Top N | 3 | 600-1000 |
| `news` | Tin tức / Sự kiện | 2 | 500-800 |

### 2.3. UI Design

```
┌────────────────────────────────────────────┐
│  Tạo bài viết AI                           │
├────────────────────────────────────────────┤
│                                            │
│  Keyword/Topic: [________________]         │
│                                            │
│  Chuyên mục:    [▼ Chọn category  ]        │
│                                            │
│  Template:                                 │
│  ┌──────────┐ ┌──────────┐                 │
│  │ 📝       │ │ 📋       │                 │
│  │ Thông tin│ │ Hướng dẫn│                 │
│  │ 800-1200w│ │ 1000-1500│                 │
│  │ 4 ảnh    │ │ 6 ảnh    │                 │
│  └──────────┘ └──────────┘                 │
│  ┌──────────┐ ┌──────────┐                 │
│  │ 🏆       │ │ 📰       │                 │
│  │ Top N    │ │ Tin tức  │                 │
│  │ 600-1000w│ │ 500-800w │                 │
│  │ 3 ảnh    │ │ 2 ảnh    │                 │
│  └──────────┘ └──────────┘                 │
│                                            │
│  [  ] Auto-publish khi hoàn tất            │
│                                            │
│  [ Tạo bài viết ]                          │
│                                            │
└────────────────────────────────────────────┘
```

### 2.4. Implementation

```
File cần sửa: erg/src/app/@admin/[locale]/posts/ai-batch/page.tsx (hoặc tương đương)
```

```typescript
// Template selector component
const templates = [
  { id: 'informative', name: 'Thông tin', icon: '📝', desc: '800-1200 từ, 4 ảnh' },
  { id: 'howto', name: 'Hướng dẫn', icon: '📋', desc: '1000-1500 từ, 6 ảnh' },
  { id: 'listicle', name: 'Top N', icon: '🏆', desc: '600-1000 từ, 3 ảnh' },
  { id: 'news', name: 'Tin tức', icon: '📰', desc: '500-800 từ, 2 ảnh' },
];

// Gửi kèm template khi tạo job:
// POST /api/ai-content/generate { topic, categoryId, template: 'informative', autoPublish }
```

### 2.5. Checklist

- [ ] Tạo `TemplateSelector` component (grid cards)
- [ ] Sửa AI batch page thêm template selection
- [ ] Gửi `template` parameter trong API call
- [ ] Hiển thị template đã chọn trong job progress/history

---

## 3. API KEY DASHBOARD UI

> Liên quan: REVIEW-BACKEND.md Mục 6 (Quản lý API Key thông minh)

### 3.1. Yêu cầu

Dashboard tổng quan sức khỏe tất cả API keys, cho phép admin test và kích hoạt lại keys.

### 3.2. UI Design

```
┌──────────────────────────────────────────────────────┐
│  API Key Dashboard                                    │
├──────────────────────────────────────────────────────┤
│                                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐           │
│  │  Active   │  │ R.Limited │  │  Error   │  Alerts  │
│  │    12     │  │     3     │  │    1     │   ⚠️ 2   │
│  │  🟢      │  │  🟡       │  │  🔴     │          │
│  └──────────┘  └──────────┘  └──────────┘           │
│                                                      │
│  ⚠️ Provider GROQ chỉ còn 1 key hoạt động           │
│  📊 Key "Gemini Pro" đã dùng 1200/1500 RPD (80%)    │
│                                                      │
│  ┌────────────────────────────────────────────────┐  │
│  │ Provider │ Label    │ Status │ Usage  │ Actions│  │
│  ├──────────┼──────────┼────────┼────────┼────────┤  │
│  │ Gemini   │ Main Key │ 🟢    │ 80/30  │ Test   │  │
│  │ Groq     │ Free #1  │ 🟡 RL │ 30/30  │ Test   │  │
│  │ OpenAI   │ Pro Key  │ 🔴 ERR│ 0/30   │ React. │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### 3.3. Implementation

```
File mới: erg/src/app/@admin/[locale]/settings/ai-keys/dashboard/page.tsx
```

```typescript
// API endpoints sử dụng:
// GET  /api/ai-content/keys/dashboard   → Tổng quan
// POST /api/ai-content/keys/:id/test    → Test key
// POST /api/ai-content/keys/:id/reactivate → Kích hoạt lại

// Components:
// - KeyDashboardPage
//   ├── KeyStatsCards (Active, Rate Limited, Error counts)
//   ├── AlertsBanner (cảnh báo provider hết key, key gần hết quota)
//   ├── KeysTable (grouped by provider)
//   │   ├── StatusBadge (green/yellow/red)
//   │   ├── UsageBar (progress bar RPD usage)
//   │   └── ActionButtons (Test, Reactivate, Edit)
//   └── KeyTestDialog (kết quả test: latency, success/fail)
```

### 3.4. Checklist

- [ ] Tạo page `/@admin/[locale]/settings/ai-keys/dashboard/page.tsx`
- [ ] Tạo components: `KeyStatsCards`, `AlertsBanner`, `KeysTable`, `KeyTestDialog`
- [ ] Thêm API service functions trong `services/ai-content.ts`
- [ ] Auto-refresh dashboard mỗi 60 giây
- [ ] Thêm link vào Settings sidebar menu

---

## 4. NOTIFICATION SYSTEM - FRONTEND UPDATES

> Liên quan: REVIEW-BACKEND.md Mục 8 (Cải thiện Notification cho Jobs)

### 4.1. Hiện trạng `NotificationBell.tsx`

- Dropdown với icon mapping theo type
- Polling 30 giây
- Mark as read, delete
- **Thiếu:** Priority indicator, action buttons, new notification types

### 4.2. Cập nhật Types

```typescript
// File cần sửa: erg/src/types/notification.ts

export enum NotificationType {
    AI_POST_COMPLETED = 'AI_POST_COMPLETED',
    AI_POST_FAILED = 'AI_POST_FAILED',
    AI_BATCH_COMPLETED = 'AI_BATCH_COMPLETED',       // MỚI
    CRAWL_COMPLETED = 'CRAWL_COMPLETED',
    CRAWL_FAILED = 'CRAWL_FAILED',
    CRAWL_BATCH_COMPLETED = 'CRAWL_BATCH_COMPLETED',
    SYSTEM_ALERT = 'SYSTEM_ALERT',                   // MỚI
    SYSTEM_CRITICAL = 'SYSTEM_CRITICAL',              // MỚI
    KEY_EXPIRED = 'KEY_EXPIRED',                      // MỚI
    KEY_QUOTA_WARNING = 'KEY_QUOTA_WARNING',           // MỚI
    SEO_COMPLETED = 'SEO_COMPLETED',                  // MỚI
    SEO_FAILED = 'SEO_FAILED',                        // MỚI
}

export enum NotificationPriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    CRITICAL = 'CRITICAL',
}

export interface Notification {
    id: string
    userId: string
    type: NotificationType
    status: NotificationStatus
    priority: NotificationPriority        // MỚI
    title: string
    message: string
    metadata?: Record<string, any>
    actionUrl?: string                    // MỚI
    actions?: { label: string; url: string; type: 'link' | 'api' }[]  // MỚI
    readAt?: string
    createdAt: string
    updatedAt: string
}
```

### 4.3. Cập nhật NotificationBell Component

```typescript
// File cần sửa: erg/src/components/admin/NotificationBell.tsx

// 1. Thêm icons cho types mới
import { Bell, CheckCircle, XCircle, Globe, AlertTriangle,
         Shield, Key, Search, Zap } from "lucide-react"

const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
        case NotificationType.AI_POST_COMPLETED:
            return <CheckCircle className="h-5 w-5 text-green-500" />
        case NotificationType.AI_POST_FAILED:
            return <XCircle className="h-5 w-5 text-red-500" />
        case NotificationType.AI_BATCH_COMPLETED:
            return <Zap className="h-5 w-5 text-purple-500" />
        case NotificationType.CRAWL_COMPLETED:
            return <Globe className="h-5 w-5 text-blue-500" />
        case NotificationType.CRAWL_FAILED:
            return <AlertTriangle className="h-5 w-5 text-orange-500" />
        case NotificationType.CRAWL_BATCH_COMPLETED:
            return <CheckCircle className="h-5 w-5 text-blue-500" />
        case NotificationType.SYSTEM_ALERT:
            return <Shield className="h-5 w-5 text-yellow-500" />
        case NotificationType.SYSTEM_CRITICAL:
            return <Shield className="h-5 w-5 text-red-600 animate-pulse" />
        case NotificationType.KEY_EXPIRED:
        case NotificationType.KEY_QUOTA_WARNING:
            return <Key className="h-5 w-5 text-orange-500" />
        case NotificationType.SEO_COMPLETED:
            return <Search className="h-5 w-5 text-green-500" />
        case NotificationType.SEO_FAILED:
            return <Search className="h-5 w-5 text-red-500" />
        default:
            return <Bell className="h-5 w-5 text-gray-500" />
    }
}

// 2. Priority indicator (viền trái)
const getPriorityBorder = (priority?: string) => {
    switch (priority) {
        case 'CRITICAL': return 'border-l-4 border-l-red-500'
        case 'HIGH': return 'border-l-4 border-l-orange-500'
        case 'MEDIUM': return 'border-l-4 border-l-yellow-400'
        default: return ''
    }
}

// 3. Action buttons trong NotificationItem
const NotificationItem = ({ notification }: NotificationItemProps) => {
    return (
        <div className={cn(
            "group relative p-4 border-b transition-all hover:bg-muted/50 cursor-pointer",
            isUnread ? "bg-blue-50 border-blue-200" : "bg-white border-gray-200",
            getPriorityBorder(notification.priority),
        )}>
            {/* Icon + Content */}
            <div className="flex gap-3">
                {getNotificationIcon(notification.type)}
                <div className="flex-1">
                    <p className="font-medium text-sm">{notification.title}</p>
                    <p className="text-xs text-muted-foreground">{notification.message}</p>
                </div>
            </div>

            {/* Action buttons */}
            {notification.actions && notification.actions.length > 0 && (
                <div className="flex gap-2 mt-2 ml-8">
                    {notification.actions.map((action, idx) => (
                        <Button
                            key={idx}
                            variant="outline"
                            size="sm"
                            className="h-6 text-xs"
                            onClick={(e) => {
                                e.stopPropagation()
                                router.push(action.url)
                            }}
                        >
                            {action.label}
                        </Button>
                    ))}
                </div>
            )}
        </div>
    )
}
```

### 4.4. Notification Flow (Frontend)

```
┌─────────────────────────────────────────────────────────────────┐
│               Frontend NotificationBell                          │
│                                                                  │
│  🔴 CRITICAL  → Viền đỏ + pulse animation                      │
│  🟠 HIGH      → Viền cam                                        │
│  🟡 MEDIUM    → Viền vàng                                       │
│  ⚪ LOW       → Không viền đặc biệt                             │
│                                                                  │
│  Action Buttons: [Xem bài] [Thử lại] [Xem logs]                │
│  Click notification → Navigate tới actionUrl                     │
│  Polling: 30 giây                                                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 4.5. Checklist

- [ ] Cập nhật `notification.ts` types (enums + interface)
- [ ] Thêm icons mới vào `NotificationBell.tsx` (7 types mới)
- [ ] Thêm priority border indicator
- [ ] Thêm action buttons vào notification items
- [ ] Navigate tới `actionUrl` khi click notification
- [ ] Test: Nhận notification thành công/thất bại từ AI post + crawl

---

## 5. BẢO MẬT & TỐI ƯU HIỆU SUẤT FRONTEND

### 5.1. Cải thiện bảo mật Frontend

#### A. CSRF Protection (Liên quan: REVIEW-BACKEND.md Mục 1)

**Hiện trạng:** Frontend gửi request đến backend mà không có CSRF token.

**Đề xuất:**
```typescript
// File: erg/src/lib/api-client.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true, // Include cookies in cross-origin requests
});

// Interceptor để thêm CSRF token nếu cần
apiClient.interceptors.request.use(
  (config) => {
    const csrfToken = localStorage.getItem('csrf-token');
    if (csrfToken) {
      config.headers['X-CSRF-Token'] = csrfToken;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
```

#### B. XSS Prevention

**Hiện trạng:** Các component có thể render nội dung HTML từ API mà không sanitize.

**Đề xuất:**
```typescript
// File: erg/src/utils/sanitize-html.ts
import DOMPurify from 'dompurify';

export const sanitizeHTML = (html: string) => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    ALLOWED_ATTR: [],
  });
};

// Trong components:
<div dangerouslySetInnerHTML={{ __html: sanitizeHTML(content) }} />
```

#### C. Content Security Policy (CSP) headers

**Hiện trạng:** Frontend không áp dụng CSP headers.

**Đề xuất:**
```typescript
// File: erg/next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://*.erg.edu.vn;"
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '0',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

### 5.2. Tối ưu hiệu suất

#### A. Lazy Loading Images & Components

**Hiện trạng:** Nhiều hình ảnh và component được load ngay từ đầu.

**Đề xuất:**
```typescript
// File: erg/src/components/common/LazyImage.tsx
import { useState, useEffect } from 'react';
import Image from 'next/image';

const LazyImage = ({ src, alt, ...props }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const element = document.querySelector(`[data-lazy-img="${src}"]`);
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, [src]);

  return (
    <div data-lazy-img={src}>
      {isVisible && (
        <Image
          src={src}
          alt={alt}
          {...props}
          onLoad={() => setHasLoaded(true)}
          className={`${hasLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity`}
        />
      )}
    </div>
  );
};

export default LazyImage;
```

#### B. Caching Strategy

**Hiện trạng:** Không có chiến lược caching rõ ràng.

**Đề xuất:**
```typescript
// File: erg/src/hooks/useCachedQuery.ts
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

export const useCachedQuery = <TData, TError>(
  key: string[],
  queryFn: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<TData, TError>({
    queryKey: key,
    queryFn,
    staleTime: 5 * 60 * 1000, // 5 phút
    cacheTime: 10 * 60 * 1000, // 10 phút
    retry: 1,
    ...options,
  });
};
```

#### C. Bundle Analysis & Code Splitting

**Hiện trạng:** Không có công cụ phân tích bundle.

**Đề xuất:**
```javascript
// Package.json thêm scripts:
{
  "scripts": {
    "analyze": "ANALYZE=true next build",
  },
  "devDependencies": {
    "@next/bundle-analyzer": "^14.0.0"
  }
}

// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);
```

### 5.3. Checklist triển khai Mục 5

- [ ] Thêm CSRF protection vào API client
- [ ] Áp dụng DOMPurify cho nội dung HTML từ API
- [ ] Cấu hình CSP headers trong next.config.js
- [ ] Tạo LazyImage component
- [ ] Tạo useCachedQuery hook
- [ ] Cài đặt bundle analyzer
- [ ] Tối ưu code splitting cho các trang nặng
- [ ] Thêm helmet hoặc tương tự để quản lý meta tags an toàn

---

## TỔNG KẾT FRONTEND

### Danh sách pages/components mới

| # | Item | File | Effort |
|---|------|------|--------|
| 1 | Hidden Content Admin Page | `@admin/[locale]/hidden-content/page.tsx` | 4h |
| 2 | Template Selector Component | `components/admin/TemplateSelector.tsx` | 2h |
| 3 | AI Key Dashboard Page | `@admin/[locale]/settings/ai-keys/dashboard/page.tsx` | 3h |
| 4 | NotificationBell Updates | `components/admin/NotificationBell.tsx` | 2h |
| 5 | Notification Types Update | `types/notification.ts` | 30m |
| 6 | Security & Performance improvements | `lib/api-client.ts`, `utils/sanitize-html.ts`, `next.config.js`, `hooks/useCachedQuery.ts`, etc. | 6h |

**Tổng estimated effort Frontend: ~17 giờ**

### Thứ tự ưu tiên

1. 🔴 **NotificationBell Updates** — Ảnh hưởng trực tiếp UX admin, cần sync với backend Mục 8
2. 🟡 **Template Selector** — Cải thiện AI post creation UX
3. 🟡 **API Key Dashboard** — Quan trọng cho monitoring, cần backend Mục 6
4. 🟡 **Security & Performance** — Nâng cao chất lượng ứng dụng
5. 🟢 **Hidden Content Page** — Phụ thuộc backend Mục 3 hoàn thành trước