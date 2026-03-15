# ERG CODE REVIEW REPORT

> **Ngày review:** 2026-03-01
> **Reviewer:** Senior Engineer & Senior PO
> **Scope:** Toàn bộ codebase `erg` (Frontend) và `erg-backend` (Backend) sau khi agent triển khai theo PLAN-BACKEND.md và PLAN-FRONTEND.md
> **Mục tiêu:** Phát hiện lỗi, thiếu sót, vấn đề bảo mật, và đề xuất sửa chữa

---

## MỤC LỤC

- [Tổng quan](#tổng-quan)
- [PHẦN A: BACKEND (erg-backend)](#phần-a-backend-erg-backend)
  - [A1. Auth & RBAC](#a1-auth--rbac)
  - [A2. Courses & Content](#a2-courses--content)
  - [A3. Crawler & Pipeline](#a3-crawler--pipeline)
  - [A4. AI Content & API Keys](#a4-ai-content--api-keys)
  - [A5. SEO Engine](#a5-seo-engine)
  - [A6. Database & Config](#a6-database--config)
  - [A7. Startup & Performance](#a7-startup--performance)
- [PHẦN B: FRONTEND (erg)](#phần-b-frontend-erg)
  - [B1. Auth & User Management UI](#b1-auth--user-management-ui)
  - [B2. Permission Management UI](#b2-permission-management-ui)
  - [B3. Courses UI](#b3-courses-ui)
  - [B4. SEO UI](#b4-seo-ui)
  - [B5. Crawler UI](#b5-crawler-ui)
  - [B6. AI Writer UI](#b6-ai-writer-ui)
  - [B7. Code Quality & Types](#b7-code-quality--types)
- [BẢNG TỔNG HỢP ƯU TIÊN](#bảng-tổng-hợp-ưu-tiên)
- [HÀNH ĐỘNG TIẾP THEO](#hành-động-tiếp-theo)

---

## Tổng quan

| Metric | Backend | Frontend |
|--------|---------|----------|
| Issues CRITICAL | 5 | 4 |
| Issues HIGH | 6 | 7 |
| Issues MEDIUM | 5 | 8 |
| Issues LOW | 3 | 5 |
| **Tổng** | **19** | **24** |

**Đánh giá tổng thể:** Agent đã triển khai đúng kiến trúc và cấu trúc theo plan, nhưng có nhiều phần **chưa hoàn thiện** — đặc biệt là mock data chưa thay bằng API thật, entity chưa đăng ký đúng module, và guard chưa enforce logic GRANT/DENY. Cần fix toàn bộ issues CRITICAL và HIGH trước khi deploy.

---

## PHẦN A: BACKEND (erg-backend)

### A1. Auth & RBAC

#### 🔴 CRITICAL — A1.1: PermissionsGuard KHÔNG enforce UserPermission GRANT/DENY

**File:** `src/modules/access-control/guards/permissions.guard.ts`

**Vấn đề:** Guard hiện tại chỉ check permissions từ Role (ManyToMany). Entity `UserPermission` với cơ chế GRANT/DENY override **đã tạo nhưng KHÔNG được guard sử dụng**. Nghĩa là dù admin cấp/thu hồi quyền cho user cụ thể, guard vẫn chỉ nhìn vào role.

**Hậu quả:** Toàn bộ flow phân quyền chi tiết (Task 1.2.6 trong plan) **không hoạt động**.

**Fix cần làm:**
```typescript
// permissions.guard.ts - cần thêm logic:
// 1. Lấy permissions từ role (hiện có)
// 2. Lấy UserPermission records của user
// 3. Apply GRANT → thêm permission
// 4. Apply DENY → loại bỏ permission
// 5. Check required permissions against effective permissions
```

---

#### 🔴 CRITICAL — A1.2: Entity chưa đăng ký trong Module

**File:** `src/modules/access-control/access-control.module.ts`

**Vấn đề:** `MikroOrmModule.forFeature()` chỉ đăng ký `[Role, Permission, User]`, thiếu:
- `UserPermission`
- `PermissionGroup`

**Hậu quả:** Runtime injection error khi service inject repository của 2 entity này → crash khi gọi API phân quyền.

**Fix:**
```typescript
MikroOrmModule.forFeature([Role, Permission, User, PermissionGroup, UserPermission])
```

---

#### 🟡 HIGH — A1.3: JWT role hardcoded thành 'user'

**File:** `src/modules/auth/auth.service.ts` (khoảng line 366)

**Vấn đề:** Khi tạo JWT token, trường `role` luôn gán cứng `'user'` thay vì lấy role thực tế của user.

**Hậu quả:** Mọi user (kể cả Admin, Editor) đều có JWT role = 'user' → guard check role sẽ sai.

**Fix:** Lấy role từ user entity:
```typescript
role: user.roles?.getItems()?.[0]?.name || 'user'
```

---

#### 🟡 HIGH — A1.4: Không có delegation validation

**File:** `src/modules/access-control/access-control.service.ts`

**Vấn đề:** Khi admin A cấp quyền cho user B, không validate:
- Admin A có quyền đó không (không thể cấp quyền mình không có)
- User B đã có quyền đó chưa (tránh duplicate)
- Audit trail cho việc ai cấp quyền cho ai, khi nào

**Fix cần làm:** Thêm validation logic + audit log.

---

#### 🟡 HIGH — A1.5: Thiếu API endpoints quản lý permission trực tiếp

**File:** `src/modules/access-control/access-control.controller.ts`

**Vấn đề:** Controller thiếu các endpoints:
- `POST /users/:id/permissions` — Cấp/thu hồi permission cho user
- `GET /users/:id/effective-permissions` — Xem effective permissions (role + overrides)
- `GET /users/:id/permission-overrides` — Xem danh sách override GRANT/DENY

---

#### 🟢 MEDIUM — A1.6: Seed data đã tách đúng ✅

**File:** `src/scripts/seed.ts` + `access-control.service.ts`

**Trạng thái:** OK
- `onModuleInit()` chỉ gọi `ensureAdminExists()` (1 query check)
- Seed script riêng chạy bằng `yarn seed:admin`
- Admin account luôn được đảm bảo tồn tại

---

### A2. Courses & Content

#### 🔴 CRITICAL — A2.1: Thiếu CourseProgress entity

**Vấn đề:** Plan yêu cầu tracking tiến trình học (lesson completed, quiz score), nhưng entity `CourseProgress` **không tồn tại** trong `src/modules/courses/entities/`.

**Hậu quả:** Không thể track user đã học đến bài nào, hoàn thành bao nhiêu %.

**Fix:** Tạo entity CourseProgress với fields: `user`, `course`, `lesson`, `completedAt`, `progress_percent`.

---

#### 🟡 HIGH — A2.2: DTOs sử dụng `any`

**File:** `src/modules/courses/dto/`

**Vấn đề:** Các DTO dùng type `any` thay vì class-validator decorators → không validate input.

**Hậu quả:** API chấp nhận mọi data → nguy cơ injection, data corruption.

**Fix:** Tạo proper DTOs với `@IsString()`, `@IsNumber()`, `@IsOptional()`, etc.

---

#### 🟡 HIGH — A2.3: Thiếu UPDATE/PATCH operations cho courses

**File:** `src/modules/courses/courses.controller.ts`

**Vấn đề:** Chỉ có CREATE và GET, thiếu:
- `PATCH /courses/:id` — Update course info
- `PATCH /courses/:id/theme` — Update theme config
- `POST /courses/:id/lessons/reorder` — Reorder lessons (drag & drop)

---

### A3. Crawler & Pipeline

#### 🟢 MEDIUM — A3.1: Thiếu retry mechanism

**File:** `src/modules/crawler/processors/`

**Vấn đề:** Pipeline 5 bước (Discovery → Scrape → Process → SEO → Publish) **không có retry logic** khi 1 step fail.

**Fix:** Thêm BullMQ retry config:
```typescript
{ attempts: 3, backoff: { type: 'exponential', delay: 5000 } }
```

---

#### 🟢 MEDIUM — A3.2: Không có rate limiting cho crawler

**Vấn đề:** Crawler có thể fetch quá nhanh → bị block bởi target website hoặc gây tải cao.

**Fix:** Thêm configurable rate limit (requests/second) vào `ScraperConfig` entity.

---

### A4. AI Content & API Keys

#### 🔴 CRITICAL — A4.1: Encryption key default KHÔNG AN TOÀN

**File:** `src/modules/ai-content/services/api-key.service.ts`

**Vấn đề:**
```typescript
const ENCRYPTION_KEY = process.env.API_KEY_ENCRYPTION_KEY || 'a'.repeat(32);
```

Nếu env var không set, dùng `'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'` làm encryption key → **mọi API key lưu trong DB đều có thể decrypt dễ dàng**.

**Hậu quả:** Lộ tất cả API keys nếu DB bị breach.

**Fix:**
```typescript
const ENCRYPTION_KEY = process.env.API_KEY_ENCRYPTION_KEY;
if (!ENCRYPTION_KEY) throw new Error('API_KEY_ENCRYPTION_KEY environment variable is required');
```

---

#### 🔴 CRITICAL — A4.2: `reportError()` tìm key bằng encrypted value

**File:** `src/modules/ai-content/services/api-key.service.ts`

**Vấn đề:** Hàm `reportError()` nhận API key plaintext rồi search trong DB bằng value đã encrypt. Do encrypt dùng IV random, cùng 1 plaintext sẽ cho ra ciphertext khác nhau → **KHÔNG BAO GIỜ tìm thấy**.

**Hậu quả:** Error reporting cho API keys hoàn toàn không hoạt động → không biết key nào bị lỗi.

**Fix:** Search bằng key ID thay vì encrypted value, hoặc lưu hash (SHA-256) của plaintext key để lookup.

---

#### ✅ OK — A4.3: 12+ AI providers đã thêm đủ

**File:** `src/modules/ai-content/providers/`

**Trạng thái:** Tất cả providers trong plan đều đã implement (Gemini, Groq, Cerebras, SambaNova, DeepSeek, Mistral, Together, OpenRouter, Hyperbolic, Cohere, OpenAI, Claude) sử dụng `OpenAICompatibleClient` base.

---

### A5. SEO Engine

#### ✅ OK — A5.1: KeywordSuggestionService đã tạo

**File:** `src/modules/seo/services/keyword-suggestion.service.ts`

Google Autocomplete + AI expansion logic đã implement.

---

#### ✅ OK — A5.2: SearchEngineSubmissionService đã tạo

**File:** `src/modules/seo/services/search-engine-submission.service.ts`

Google Indexing API + IndexNow (Bing, Yandex) đã implement.

---

#### 🟢 MEDIUM — A5.3: Thiếu CocCoc submission rõ ràng

**Vấn đề:** Plan yêu cầu hỗ trợ CocCoc search engine (phổ biến ở VN), nhưng service chỉ có Google + IndexNow. CocCoc không dùng IndexNow protocol.

**Fix:** Thêm CocCoc webmaster verification + ping endpoint nếu có API.

---

### A6. Database & Config

#### 🔴 CRITICAL — A6.1: Thiếu 5 MongoDB entities trong config

**File:** `src/config/mikro-orm-mongo.config.ts`

**Vấn đề:** Config hiện tại:
```typescript
entities: [Visit, AnalyticsEvent, AuthActivityLog, CrawlHistory, RssFeed, ScraperConfig, Notification]
```

**Thiếu:**
1. `CrawlRawContent` — dùng trong crawler.service.ts, processors
2. `SeoScoreHistory` — dùng trong seo-dashboard.service.ts
3. `SearchEngineSubmissionLog` — dùng trong search-engine-submission.service.ts
4. `Review` — dùng trong interaction module
5. `Comment` — dùng trong interaction module

**Hậu quả:** Runtime injection error → crash khi các service này chạy.

**Fix:**
```typescript
import { CrawlRawContent } from '../modules/crawler/entities/crawl-raw-content.entity';
import { SeoScoreHistory } from '../modules/seo/entities/seo-score-history.entity';
import { SearchEngineSubmissionLog } from '../modules/seo/entities/search-engine-submission-log.entity';
import { Review } from '../modules/interaction/entities/review.entity';
import { Comment } from '../modules/interaction/entities/comment.entity';

entities: [
  Visit, AnalyticsEvent, AuthActivityLog, CrawlHistory, RssFeed,
  ScraperConfig, Notification,
  CrawlRawContent, SeoScoreHistory, SearchEngineSubmissionLog,
  Review, Comment
]
```

---

#### 🟢 MEDIUM — A6.2: Duplicate pattern trong MySQL config

**File:** `src/config/mikro-orm-mysql.config.ts`

```typescript
entitiesTs: [
  'src/modules/ai-content/**/*.entity.ts',
  'src/modules/ai-content/**/*.entity.ts',  // ← DUPLICATE
  ...
]
```

**Fix:** Xóa dòng duplicate.

---

#### 🟢 MEDIUM — A6.3: MongoDB debug mode luôn bật

**File:** `src/config/mikro-orm-mongo.config.ts`

```typescript
debug: true  // ← Nên là process.env.NODE_ENV === 'development'
```

**Hậu quả:** Log toàn bộ MongoDB queries trong production → performance hit + log noise.

---

### A7. Startup & Performance

#### 🟡 HIGH — A7.1: Chưa dùng SWC compiler

**File:** `nest-cli.json`

**Vấn đề:** Dùng TypeScript compiler mặc định. SWC nhanh hơn 2-3x.

**Fix:**
```json
{
  "compilerOptions": {
    "builder": "swc",
    "typeCheck": true
  }
}
```

---

#### 🟡 HIGH — A7.2: Tất cả 22 modules load eagerly

**File:** `src/app.module.ts`

**Vấn đề:** Modules nặng (CrawlerModule, AiContentModule, SeoModule) load ngay khi startup dù có thể chưa cần.

**Fix:** Dùng `LazyModuleLoader` cho các module không critical:
```typescript
@Module({
  imports: [
    // Critical - load ngay
    AuthModule, AccessControlModule, UsersModule,
    // Non-critical - lazy load khi cần
  ]
})
```

---

#### ⚪ LOW — A7.3: Thiếu TypeScript pre-commit check

Không có `tsc --noEmit` trong CI/CD hoặc pre-commit hook → type errors có thể lọt vào codebase.

---

---

## PHẦN B: FRONTEND (erg)

### B1. Auth & User Management UI

#### 🔴 CRITICAL — B1.1: ~80% mock data trong admin pages

**Các file bị ảnh hưởng:**
- `src/app/@admin/(dashboard)/admin/users/page.tsx` — Mock user list
- `src/app/@admin/(dashboard)/admin/courses/page.tsx` — MOCK_COURSES
- `src/app/@admin/(dashboard)/admin/seo/page.tsx` — Mock trend/distribution data
- `src/app/@admin/(dashboard)/admin/crawler/page.tsx` — MOCK_PIPELINES
- `src/app/@admin/(dashboard)/admin/settings/ai-keys/page.tsx` — Mock provider health

**Vấn đề:** Hầu hết admin pages dùng hardcoded mock data thay vì gọi API backend. Các API call thậm chí bị **comment out**.

**Hậu quả:** Admin dashboard hoàn toàn không functional — chỉ là UI demo.

**Fix:** Thay tất cả mock data bằng `useQuery()` + TanStack Query gọi API thật.

---

#### 🟡 HIGH — B1.2: Race condition trong usePermission hook

**File:** `src/hooks/use-permission.ts`

**Vấn đề:** `useState(false)` return `false` trước khi `useEffect` chạy xong → component render lần đầu luôn thấy "không có quyền", sau đó mới update.

**Hậu quả:** Flash of unauthorized content → UX kém, có thể redirect sai.

**Fix:** Thêm `loading` state, return `{ hasPermission, isLoading }`.

---

#### 🟡 HIGH — B1.3: Hardcoded setTimeout trong ProtectedRoute

**File:** `src/components/admin/shared/protected-route.tsx`

**Vấn đề:** `setTimeout(100ms)` để đợi permission check → fragile, không đáng tin cậy.

**Fix:** Dùng proper loading state thay vì setTimeout.

---

#### 🟢 MEDIUM — B1.4: Không có pagination

**Vấn đề:** User list, course list, post list không có pagination → performance issue khi data lớn.

---

#### ⚪ LOW — B1.5: Không có tests

Không có unit test hay integration test cho bất kỳ admin component nào.

---

### B2. Permission Management UI

#### 🟡 HIGH — B2.1: Thiếu Permission Override Dialog

**Vấn đề:** Plan yêu cầu dialog để admin GRANT/DENY specific permissions cho user, nhưng component này **chưa được implement**.

**Hậu quả:** Không có UI để sử dụng tính năng RBAC override (dù backend entity đã tạo).

---

#### ✅ OK — B2.2: PermissionGate component hoạt động tốt

**File:** `src/components/admin/shared/permission-gate.tsx`

AND/OR/single permission modes đã implement đúng.

---

#### ✅ OK — B2.3: Dynamic sidebar theo permissions

**File:** `src/components/admin/app-sidebar.tsx`

Menu items hiển thị/ẩn dựa trên user permissions — đã implement.

---

### B3. Courses UI

#### 🔴 CRITICAL — B3.1: courses.api.ts KHÔNG TỒN TẠI

**File:** `src/services/courses.api.ts` — **MISSING**

**Vấn đề:** File API client cho courses module **không tồn tại**. Admin course pages không có service layer để gọi backend.

**Fix:** Tạo `courses.api.ts` với CRUD operations.

---

#### 🟡 HIGH — B3.2: Không có drag & drop cho syllabus

**Vấn đề:**
- Package `@dnd-kit` **chưa install** trong `package.json`
- Syllabus reorder chỉ là placeholder text: "Mô phỏng: Editor Tiptap/Quill sẽ đặt ở đây"

**Fix:** `yarn add @dnd-kit/core @dnd-kit/sortable` + implement sortable lesson list.

---

#### 🟡 HIGH — B3.3: Course theme không persist

**File:** `src/app/@admin/(dashboard)/admin/courses/[id]/edit/components/course-theme-section.tsx`

**Vấn đề:** Theme selector và color picker hoạt động locally nhưng **không gọi API save** → mất data khi refresh.

---

#### 🟡 HIGH — B3.4: Thiếu KeywordSuggestionPanel trong Course Editor

**Vấn đề:** `KeywordSuggestionPanel` đã tạo cho post editor nhưng **CHƯA integrate vào course editor**.

**Requirement:** "Keyword suggestion tích hợp cả post editor VÀ course editor" — chưa đạt.

---

#### 🟢 MEDIUM — B3.5: Course JSON-LD Schema chưa tích hợp breadcrumb

**File:** `src/app/@tinhocquocte/khoa-hoc/[slug]/page.tsx`

Schema (line 66-87) và Breadcrumb component (line 101-107) tách rời → Google không nhận diện breadcrumb cho Rich Results.

---

#### 🟢 MEDIUM — B3.6: Duplicate `notFound()` check

**File:** `src/app/@tinhocquocte/khoa-hoc/[slug]/page.tsx` (line 63-64)

`if (!course) notFound();` gọi 2 lần liên tiếp.

---

### B4. SEO UI

#### 🟡 HIGH — B4.1: KeywordSuggestionPanel chỉ dùng mock data

**File:** `src/components/admin/shared/editor/keyword-suggestion-panel.tsx` (line 30-59)

**Vấn đề:** Comment ghi rõ: *"Tạm thời gọi API mock logic nếu backend chưa có"*. Dùng `setTimeout` thay vì gọi API thật.

**Fix:** Kết nối với `GET /api/seo/keywords/suggest?q=...` backend endpoint.

---

#### 🟡 HIGH — B4.2: SearchEngineMeta dùng placeholder verification codes

**File:** `src/components/seo/search-engine-meta.tsx` (line 1-13)

```
"your-google-verification-code"  // ← placeholder
```

Comment: *"Sắp tới sẽ fetch API cấu hình từ Backend theo subdomain"* — chưa implement.

**Fix:** Fetch verification codes từ backend SEO settings API.

---

#### 🟢 MEDIUM — B4.3: Không có per-subdomain robots.ts / sitemap.ts

**Vấn đề:** Chỉ có 1 global `robots.ts` và `sitemap.ts` cho toàn app. Plan yêu cầu mỗi subdomain (@tinhocquocte, @tinhocquocgia, @tuyendung) có riêng.

**Fix:** Tạo robots.ts + sitemap.ts trong mỗi parallel route slot.

---

#### 🟢 MEDIUM — B4.4: AI Search Summary Box quá đơn giản

**File:** `src/components/seo/ai-search-summary.tsx`

Chỉ hiển thị excerpt + table of contents. Thiếu:
- Key facts/takeaways boxes
- FAQ sections (FAQSchema)
- Structured data cho Google AI Overview

---

#### 🟢 MEDIUM — B4.5: SEO Dashboard dùng mock data

**File:** `src/app/@admin/(dashboard)/admin/seo/page.tsx`

Trend data, distribution data, top issues, worst posts — tất cả hardcoded.

---

#### ⚪ LOW — B4.6: Keyword Manager thiếu validation

Không validate keyword length (min/max), URL format, duplicate keywords.

---

### B5. Crawler UI

#### 🟢 MEDIUM — B5.1: Cron syntax hiển thị cho user

**File:** `src/components/admin/crawler/cron-editor.tsx` (line 179)

**Vấn đề:** Sau khi chọn preset, vẫn hiển thị raw cron `0 * * * *` → confusing cho non-tech users.

**Fix:** Hiển thị text thân thiện: "Mỗi giờ" thay vì "0 * * * *".

---

#### 🟢 MEDIUM — B5.2: Pipeline step labels bằng tiếng Anh

**File:** `src/components/admin/crawler/pipeline-status.tsx` (line 24-30)

```typescript
DISCOVER: 'Discover',  // → nên là 'Khám phá'
SCRAPE: 'Scrape',      // → 'Thu thập'
PROCESS: 'Process',    // → 'Xử lý'
```

Toàn bộ app bằng tiếng Việt, riêng phần này tiếng Anh.

---

#### ⚪ LOW — B5.3: AddRssWizard — "AI Clean & Rewrite" bị disabled

**File:** RSS wizard page (line 273)

Switch `disabled` — user không thể bật tính năng này. Cần enable hoặc giải thích tại sao disabled.

---

#### ⚪ LOW — B5.4: Pipeline status không real-time

Dùng mock data, không có WebSocket hoặc polling → status không auto-update.

---

### B6. AI Writer UI

#### 🟡 HIGH — B6.1: Provider selector không grouped

**File:** `src/app/@admin/(dashboard)/admin/settings/ai-keys/page.tsx` (line 273-282)

**Vấn đề:** Simple `<select>` không phân nhóm Free vs Paid. Plan yêu cầu `<optgroup>` grouped selector.

**Fix:**
```html
<optgroup label="Free Tier">
  <option value="gemini">Google Gemini (15 RPM / 1,500 RPD)</option>
  <option value="groq">Groq — Llama 3.3 (30 RPM / 14,400 RPD)</option>
</optgroup>
<optgroup label="Paid APIs">
  <option value="openai">OpenAI GPT-4o-mini</option>
  <option value="claude">Anthropic Claude Haiku</option>
</optgroup>
```

---

#### 🟢 MEDIUM — B6.2: Provider health dashboard chỉ mock

**File:** `src/app/@admin/(dashboard)/admin/settings/ai-keys/page.tsx` (line 382-438)

Comment: *"Tình trạng Providers (Minh họa)"* — confirms đây chỉ là demo.

---

#### 🟢 MEDIUM — B6.3: Thiếu cost estimation cho batch generation

Batch AI generate không show: tokens used, estimated cost, time taken.

---

#### ⚪ LOW — B6.4: Không có scheduled batch generation

Chỉ run ngay, không schedule chạy vào thời điểm cụ thể.

---

### B7. Code Quality & Types

#### 🔴 CRITICAL — B7.1: 21 lần dùng `any` type

**Các file tiêu biểu:**
- `src/app/@admin/(dashboard)/admin/crawler/page.tsx`: `status={p.status as any}`, `currentStep={p.step as any}`
- Nhiều component khác dùng `any` thay vì proper types

**Fix:** Tạo proper TypeScript interfaces cho tất cả data structures.

---

#### 🟢 MEDIUM — B7.2: Empty type files

**Files:**
- `src/types/common.tsx` — empty
- `src/types/job.tsx` — empty
- `src/types/index.tsx` — empty

Tạo rồi nhưng không viết nội dung.

---

#### 🟢 MEDIUM — B7.3: Recharts không lazy load

Import trực tiếp `recharts` (library lớn) thay vì `React.lazy()` → tăng bundle size.

---

#### ⚪ LOW — B7.4: Courses không có trong sitemap

`app/sitemap.ts` không include courses URLs.

---

#### ⚪ LOW — B7.5: Inconsistent loader patterns

Một số components dùng `<Loader2 className="animate-spin" />`, một số không có animation class.

---

---

## BẢNG TỔNG HỢP ƯU TIÊN

### 🔴 CRITICAL — Fix ngay (Block deployment)

| # | ID | Module | Mô tả | Files |
|---|-----|--------|--------|-------|
| 1 | A1.1 | BE RBAC | PermissionsGuard không enforce GRANT/DENY | `permissions.guard.ts` |
| 2 | A1.2 | BE RBAC | UserPermission, PermissionGroup chưa đăng ký module | `access-control.module.ts` |
| 3 | A4.1 | BE AI | Encryption key default = 'aaa...' | `api-key.service.ts` |
| 4 | A4.2 | BE AI | reportError() search bằng encrypted value → fail | `api-key.service.ts` |
| 5 | A6.1 | BE DB | 5 MongoDB entities thiếu trong config | `mikro-orm-mongo.config.ts` |
| 6 | B1.1 | FE All | ~80% admin pages dùng mock data | Multiple files |
| 7 | B3.1 | FE Courses | courses.api.ts không tồn tại | Missing file |
| 8 | B7.1 | FE Types | 21x `any` type assertions | Multiple files |
| 9 | A2.1 | BE Courses | CourseProgress entity thiếu | Missing file |

### 🟡 HIGH — Fix trước release

| # | ID | Module | Mô tả | Files |
|---|-----|--------|--------|-------|
| 1 | A1.3 | BE Auth | JWT role hardcoded 'user' | `auth.service.ts` |
| 2 | A1.4 | BE RBAC | Không validate delegation | `access-control.service.ts` |
| 3 | A1.5 | BE RBAC | Thiếu permission management endpoints | `access-control.controller.ts` |
| 4 | A2.2 | BE Courses | DTOs dùng `any` | `courses/dto/` |
| 5 | A2.3 | BE Courses | Thiếu UPDATE/PATCH operations | `courses.controller.ts` |
| 6 | A7.1 | BE Perf | Chưa dùng SWC compiler | `nest-cli.json` |
| 7 | A7.2 | BE Perf | 22 modules load eagerly | `app.module.ts` |
| 8 | B1.2 | FE Auth | Race condition usePermission | `use-permission.ts` |
| 9 | B1.3 | FE Auth | Hardcoded setTimeout ProtectedRoute | `protected-route.tsx` |
| 10 | B2.1 | FE RBAC | Thiếu Permission Override Dialog | Missing component |
| 11 | B3.2 | FE Courses | @dnd-kit chưa install + syllabus | `package.json` |
| 12 | B3.3 | FE Courses | Theme không persist | `course-theme-section.tsx` |
| 13 | B3.4 | FE Courses | Keyword suggestion thiếu trong course editor | Course edit page |
| 14 | B4.1 | FE SEO | Keyword suggestion dùng mock | `keyword-suggestion-panel.tsx` |
| 15 | B4.2 | FE SEO | Verification codes placeholder | `search-engine-meta.tsx` |
| 16 | B6.1 | FE AI | Provider selector không grouped | `ai-keys/page.tsx` |

### 🟢 MEDIUM — Fix khi có thời gian

| # | ID | Module | Mô tả |
|---|-----|--------|--------|
| 1 | A3.1 | BE Crawler | Thiếu retry mechanism |
| 2 | A3.2 | BE Crawler | Không rate limit |
| 3 | A5.3 | BE SEO | Thiếu CocCoc submission |
| 4 | A6.2 | BE DB | Duplicate pattern MySQL config |
| 5 | A6.3 | BE DB | MongoDB debug luôn bật |
| 6 | B1.4 | FE UX | Không pagination |
| 7 | B3.5 | FE SEO | JSON-LD chưa tích hợp breadcrumb |
| 8 | B3.6 | FE Code | Duplicate notFound() |
| 9 | B4.3 | FE SEO | Không per-subdomain robots/sitemap |
| 10 | B4.4 | FE SEO | AI Search Summary quá đơn giản |
| 11 | B4.5 | FE SEO | SEO Dashboard mock data |
| 12 | B5.1 | FE Crawler | Cron syntax cho non-tech user |
| 13 | B5.2 | FE Crawler | Pipeline labels tiếng Anh |
| 14 | B6.2 | FE AI | Provider health mock |
| 15 | B6.3 | FE AI | Thiếu cost estimation |
| 16 | B7.2 | FE Types | Empty type files |
| 17 | B7.3 | FE Perf | Recharts không lazy load |

### ⚪ LOW — Nice to have

| # | ID | Mô tả |
|---|-----|--------|
| 1 | A7.3 | Thiếu tsc --noEmit pre-commit |
| 2 | B1.5 | Không có tests |
| 3 | B5.3 | AI Rewrite switch disabled |
| 4 | B5.4 | Pipeline status không real-time |
| 5 | B6.4 | Không scheduled batch |
| 6 | B7.4 | Courses không trong sitemap |
| 7 | B7.5 | Inconsistent loader patterns |

---

## HÀNH ĐỘNG TIẾP THEO

### Sprint 1: Security & Data Integrity (Ưu tiên tuyệt đối)
1. Fix PermissionsGuard enforce GRANT/DENY logic (A1.1)
2. Đăng ký entities thiếu vào modules + configs (A1.2, A6.1)
3. Fix encryption key phải require env var (A4.1)
4. Fix reportError search bằng hash thay vì encrypted value (A4.2)
5. Fix JWT role lấy từ user entity (A1.3)

### Sprint 2: Core Functionality
1. Tạo courses.api.ts (B3.1)
2. Thay thế mock data bằng real API calls (B1.1)
3. Tạo CourseProgress entity (A2.1)
4. Tạo proper DTOs cho courses (A2.2)
5. Thêm CRUD endpoints còn thiếu (A2.3, A1.5)

### Sprint 3: Feature Completion
1. Fix usePermission race condition (B1.2)
2. Build Permission Override Dialog (B2.1)
3. Install @dnd-kit + implement syllabus drag & drop (B3.2)
4. Integrate KeywordSuggestionPanel vào course editor (B3.4)
5. Connect keyword suggestion tới backend API (B4.1)

### Sprint 4: Polish & Performance
1. Enable SWC compiler (A7.1)
2. Lazy load non-critical modules (A7.2)
3. Fix all `any` types (B7.1)
4. Group provider selector (B6.1)
5. Add pagination (B1.4)
6. Translate pipeline labels (B5.2)
7. Fix cron display for non-tech users (B5.1)

---

> **Ghi chú:** Report này tập trung vào các vấn đề phát hiện qua code review. Cần chạy `yarn build` cả 2 project và `yarn test` backend để phát hiện thêm lỗi runtime. Khuyến nghị setup CI/CD pipeline với type check + test coverage trước khi deploy production.
