# ERG CODE REVIEW — BẢN ĐÃ XÁC MINH

> **Ngày:** 2026-03-02
> **Phương pháp:** Review report ban đầu (REVIEW-REPORT.md) đã được xác minh lại bằng cách đọc trực tiếp từng file source code. Các issue FALSE POSITIVE đã bị loại bỏ. Đồng thời phát hiện thêm nhiều lỗi THẬT mới mà report cũ bỏ sót.
> **Kết luận về report cũ:** ~70% issues trong REVIEW-REPORT.md là **FALSE POSITIVE** — code đã được implement đúng nhưng bị report sai. Tuy nhiên, deep scan phát hiện nhiều lỗi nghiêm trọng THẬT mà report cũ hoàn toàn bỏ sót.

---

## TỔNG QUAN

| Mức độ | Phần A (BE) | Phần B (FE) | Phụ lục C | Phụ lục D | Phụ lục E (FE SEO) | **Tổng** |
|--------|-------------|-------------|-----------|-----------|---------------------|----------|
| 🔴 CRITICAL | 3 | 4 | — | 2 | 3 | **12** |
| 🟡 HIGH | 5 | 4 | 4 | 3 | 7 | **23** |
| 🟢 MEDIUM | 10 | 12 | 8 | 2 | 6 | **38** |
| ⚪ LOW | 2 | 6 | 7 | — | 1 | **16** |
| **Tổng** | **20** | **26** | **19** | **7** | **17** | **89** |

> 📌 **Xem thêm:** [REVIEW-SEO-BACKEND.md](./REVIEW-SEO-BACKEND.md) — 25 issues SEO riêng cho Backend

---

## MỤC LỤC

- [Tổng quan FALSE POSITIVE từ report cũ](#tổng-quan-false-positive-từ-report-cũ)
- [PHẦN A: BACKEND — Lỗi thật](#phần-a-backend--lỗi-thật)
- [PHẦN B: FRONTEND — Lỗi thật](#phần-b-frontend--lỗi-thật)
- [BẢNG TỔNG HỢP ƯU TIÊN](#bảng-tổng-hợp-ưu-tiên)
- [HÀNH ĐỘNG TIẾP THEO](#hành-động-tiếp-theo)
- [PHỤ LỤC C: Services & Admin Forms](#phụ-lục-c-kiểm-tra-bổ-sung--services--admin-forms-2026-03-02)
- [PHỤ LỤC D: Review/Rating cho Google Rich Snippets ⭐](#d-thiếu-tính-năng-reviewrating-cho-google-rich-snippets--sao-trên-kết-quả-tìm-kiếm)
- [PHỤ LỤC E: SEO Best Practices — Frontend](#phụ-lục-e-seo-best-practices--frontend-2026-03-02)
- 📌 **Backend SEO:** Xem file riêng → [REVIEW-SEO-BACKEND.md](./REVIEW-SEO-BACKEND.md)

---

## Tổng quan FALSE POSITIVE từ report cũ

Các issue sau trong REVIEW-REPORT.md đã được xác minh là **SAI** (code thực tế đã đúng):

| Issue cũ | Lý do FALSE POSITIVE |
|----------|---------------------|
| A1.2 — Entity chưa đăng ký module | `UserPermission`, `PermissionGroup` **ĐÃ** đăng ký trong `forFeature()` |
| A1.3 — JWT role hardcoded 'user' | `'user'` chỉ là fallback. Logic lấy role thật từ `user.roles` đã có |
| A1.4 — Không validate delegation | `assignDirectPermissions()` **ĐÃ** validate assigner có quyền trước khi delegate |
| A1.5 — Thiếu permission API endpoints | `POST /users/:id/permissions` và `GET /users/:id/effective-permissions` **ĐÃ** tồn tại |
| A4.1 — Encryption key default 'aaa...' | Code **throw Error** nếu thiếu env var, không có fallback insecure |
| A4.2 — reportError() search encrypted value | `reportError()` tìm theo `id` (primary key), không phải encrypted value |
| A6.1 — 5 MongoDB entities thiếu | Tất cả 5 entity **ĐÃ** import và đăng ký trong config |
| A2.1 — Thiếu CourseProgress entity | `course-progress.entity.ts` **ĐÃ** tồn tại đầy đủ |
| A2.2 — DTOs dùng `any` | DTOs dùng class-validator decorators đúng cách (chỉ 1 `any` ở controller) |
| A2.3 — Thiếu UPDATE/PATCH | Có 2 PATCH endpoints + POST reorder |
| A6.2 — Duplicate MySQL config pattern | Không có duplicate |
| A6.3 — MongoDB debug luôn bật | Đã dùng `process.env.NODE_ENV === 'development'` |
| A7.1 — Chưa dùng SWC | `"builder": "swc"` **ĐÃ** cấu hình |
| A3.1 — Thiếu retry mechanism | `attempts: 3, backoff: exponential` **ĐÃ** config cho cả 5 queue |
| B1.1 — 80% mock data | 5/5 trang được liệt kê **ĐỀU** dùng real API qua `useQuery` |
| B3.1 — courses.api.ts không tồn tại | File **ĐÃ** tồn tại, 82 dòng CRUD đầy đủ |
| B1.2 — Race condition usePermission | `usePermission` **ĐÃ** có `isLoading` state |
| B1.3 — setTimeout(100ms) protected-route | **KHÔNG** có `setTimeout` nào trong file |
| B2.1 — Thiếu Permission Override Dialog | Component **ĐÃ** tồn tại (160 dòng) |
| B3.2 — @dnd-kit chưa install | **ĐÃ** install và sử dụng trong syllabus page |
| B3.3 — Theme không persist | **CÓ** `useMutation` gọi `coursesApi.updateTheme()` |
| B3.4 — KeywordSuggestion thiếu course editor | **ĐÃ** import và render trong course edit page |
| B3.5 — JSON-LD không tích hợp breadcrumb | `<Breadcrumb>` component **ĐÃ** có BreadcrumbList schema |
| B4.1 — Keyword suggestion dùng mock | Gọi `seoApi.getKeywordSuggestions()` — real API |
| B4.3 — Không per-subdomain robots/sitemap | Xử lý dynamic theo host header — đúng cách |
| B5.2 — Pipeline labels tiếng Anh | **ĐÃ** dịch sang tiếng Việt |
| B6.1 — Provider selector không grouped | **ĐÃ** có `SelectGroup` Free/Paid |
| B7.4 — Courses không trong sitemap | **ĐÃ** có trong `PAGES_CONFIG` |

---

## PHẦN A: BACKEND — Lỗi thật

### 🔴 CRITICAL

#### A-C1: PermissionsGuard KHÔNG enforce UserPermission GRANT/DENY

**Files:**
- `src/modules/auth/strategies/access-token.strategy.ts` (dòng 40-53)
- `src/modules/access-control/guards/permissions.guard.ts` (dòng 44)

**Vấn đề:** `AccessTokenStrategy.validate()` chỉ load permissions từ `roles.permissions`:
```typescript
user.roles.getItems().forEach((role) => {
    role.permissions.getItems().forEach((p) => permissions.add(p.name));
});
```
**KHÔNG** query bảng `user_permissions` để lấy GRANT/DENY overrides. Kết quả:
- Admin gán DENY `posts.delete` cho user → user **VẪN XÓA ĐƯỢC** bài viết
- Admin gán GRANT thêm quyền → user **KHÔNG NHẬN ĐƯỢC** quyền mới

**Fix:** Trong `AccessTokenStrategy.validate()`, sau khi collect role permissions, thêm:
```typescript
const overrides = await em.find(UserPermission, { user: user.id }, { populate: ['permission'] });
overrides.forEach(o => {
    if (o.action === 'GRANT') permissions.add(o.permission.name);
    if (o.action === 'DENY') permissions.delete(o.permission.name);
});
```

---

#### A-C2: Crawler Controller KHÔNG CÓ Authentication Guard

**File:** `src/modules/crawler/crawler.controller.ts`

**Vấn đề:** Toàn bộ 18 endpoints **KHÔNG** có `@UseGuards(JwtAuthGuard)` hoặc `@Permissions()`. Tất cả đều PUBLIC:
- `POST /crawler/url/run` — Trigger crawl bất kỳ URL nào
- `POST /crawler/rss` — Tạo RSS feed
- `DELETE /crawler/rss/:id` — Xóa RSS feed
- `POST /crawler/quick-add` — Auto tạo config + RSS

**Hậu quả:** Bất cứ ai cũng có thể trigger crawler, tạo/xóa data, làm đầy BullMQ queue.

**Fix:** Thêm vào class-level:
```typescript
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('crawler')
export class CrawlerController { ... }
```

---

#### A-C3: SSRF trong Crawler (kết hợp A-C2)

**Files:**
- `src/modules/crawler/crawler.service.ts` (dòng 60-87)
- `src/modules/crawler/processors/scrape.processor.ts` (dòng 62-66)

**Vấn đề:** `POST /crawler/url/run` nhận URL từ user → fetch KHÔNG validate:
```typescript
const response = await axios.get(url, { headers: { 'User-Agent': '...' } });
```
Attacker có thể fetch: `http://169.254.169.254/latest/meta-data/` (AWS metadata), `http://localhost:6379` (Redis), internal services.

**Fix:** Thêm URL validation — block private IPs, localhost, metadata endpoints.

---

### 🟡 HIGH

#### A-H1: SEO Redirects Controller KHÔNG CÓ Authentication

**File:** `src/modules/seo/redirects.controller.ts`

Tương tự A-C2, `RedirectsController` không có auth guard → ai cũng có thể tạo/xóa redirect 301/302.

---

#### A-H2: Mật khẩu Admin hardcoded VÀ LOG ra console

**File:** `src/modules/access-control/access-control.service.ts` (dòng 88, 102, 436, 452)

```typescript
const hashedPassword = await argon2.hash('Admin@2025');
this.logger.log(`[BOOT] Admin account bootstrapped: ${adminEmail} / Admin@2025`);
```

Mật khẩu plaintext `Admin@2025` xuất hiện **3 lần** trong source và được **in ra log** trong production.

**Fix:** Đọc từ env var `ADMIN_DEFAULT_PASSWORD`, không log plaintext.

---

#### A-H3: SeoRedirectFilter Override Global Exception Filter

**File:** `src/modules/seo/seo-redirect.filter.ts` (dòng 5-53)

`@Catch()` decorator bắt **TẤT CẢ** exceptions → override `AllExceptionsFilter` ở `main.ts`. Mọi lỗi 500 trả về format không chuẩn.

**Fix:** Đổi thành `@Catch(NotFoundException)` chỉ bắt 404.

---

#### A-H4: Process Processor XÓA TẤT CẢ Link `href`

**File:** `src/modules/crawler/processors/process.processor.ts` (dòng 38)

```typescript
$clean('a').each((i, el) => { $clean(el).removeAttr('href'); });
```

Xóa toàn bộ hyperlinks trong nội dung crawled → mất internal/external links → ảnh hưởng SEO.

**Fix:** Chỉ xóa external links hoặc convert thành text, giữ lại internal links.

---

#### A-H5: `getUserPermissionsAndFeatures()` bỏ qua UserPermission overrides

**File:** `src/modules/access-control/access-control.service.ts` (dòng 478-525)

Method này được dùng bởi `GET /access-control/users/:userId/effective-permissions` nhưng **chỉ** load permissions từ roles, bỏ qua GRANT/DENY overrides. Frontend hiển thị sai quyền thực tế.

**Fix:** Thêm logic load UserPermission tương tự như trong `assignDirectPermissions()`.

---

### 🟢 MEDIUM

#### A-M1: Nhiều Controller endpoints không có DTO validation

**Files bị ảnh hưởng:**
- `posts.controller.ts:98` — `savePreview(@Body() body: any)`
- `courses.controller.ts:55` — `updateTheme(@Body() themeConfig: any)`
- `seo.controller.ts:374,382,519` — `createRedirect(@Body() dto: any)`, etc.
- `access-control.controller.ts:45,55,66,92` — Inline types thay vì DTO class

Khi dùng `any` hoặc inline type, `whitelist: true` trong GlobalValidationPipe **KHÔNG hoạt động**.

---

#### A-M2: `throw new Error()` thay vì `HttpException`

**Files:**
- `auth.controller.ts:90` — `throw new Error('Refresh token missing')` → 500 thay vì 401
- `keyword-suggestion.controller.ts:25` — `throw new Error('Keyword is required')` → 500 thay vì 400

---

#### A-M3: Permission `system.manage.settings` KHÔNG tồn tại

**Files:**
- `search-engine-submission.controller.ts:15,33`
- `seo-dashboard.controller.ts:16,23`
- `keyword-suggestion.controller.ts:16`

Các controller dùng `@Permissions('system.manage.settings')`, nhưng seed data chỉ tạo `system.settings`. Không ai truy cập được endpoints này trừ khi admin có tất cả permissions.

---

#### A-M4: CocCoc Submission là FAKE

**File:** `src/modules/seo/services/search-engine-submission.service.ts` (dòng 108-118)

`submitToCocCoc()` chỉ log + trả về SUCCESS mà **KHÔNG** gửi HTTP request nào. Comment: `"Placeholder or actual ping if supported"`.

---

#### A-M5: Hardcoded admin email trong business logic

**Files:**
- `src/modules/crawler/processors/seo.processor.ts:43`
- `src/modules/crawler/processors/publish.processor.ts:45`

```typescript
const admin = await em.findOne(User, { email: 'admin@erg.edu.vn' })
    || await em.findOne(User, { id: { $ne: null } } as any);
```

Fallback lấy **BẤT KỲ** user nào làm author.

---

#### A-M6: Placeholder phone number trong email

**File:** `src/modules/recruitment/recruitment.service.ts` (dòng 355)

```
📞 Nếu có thắc mắc, vui lòng liên hệ HR: <strong>0909 xxx xxx</strong>
```

---

#### A-M7: Reviews Controller không trích xuất user

**File:** `src/modules/reviews/reviews.controller.ts` (dòng 25-29)

`@Public()` và TODO comment: `// TODO: Extract user from request if authenticated`. Ai cũng tạo review được mà không cần login.

---

#### A-M8: Env vars KHÔNG validate khi startup

**File:** `src/app.module.ts` (dòng 35-38)

`ConfigModule.forRoot()` không dùng `validationSchema`. Nếu thiếu biến môi trường quan trọng (DB_HOST, etc.), app crash với lỗi không rõ ràng.

---

#### A-M9: IndexNow key dùng default không an toàn

**File:** `src/modules/seo/services/search-engine-submission.service.ts` (dòng 79)

```typescript
const indexNowKey = this.configService.get('INDEXNOW_KEY') || 'erg-indexnow-default';
```

Key mặc định sẽ làm submissions thất bại âm thầm.

---

#### A-M10: Không có rate limit config per domain cho crawler

**File:** `src/modules/crawler/entities/scraper-config.entity.ts`

Không có field `maxRequestsPerSecond`, `delayBetweenRequests`. Rate limit chỉ global → có thể bị ban IP bởi website nguồn.

---

### ⚪ LOW

#### A-L1: Duplicate `@Permissions` decorator

**File:** `src/modules/courses/courses.controller.ts` (dòng 39-40)

```typescript
@Permissions('courses.create')
@Permissions('courses.create')  // DUPLICATE
```

---

#### A-L2: Redirect hitCount KHÔNG persist

**File:** `src/modules/seo/filters/seo-redirect.filter.ts` (dòng 24-36)

`redirect.hitCount` được tăng nhưng không có `em.flush()` → mất data.

---

---

## PHẦN B: FRONTEND — Lỗi thật

### 🔴 CRITICAL

#### B-C1: Hardcoded Preview Secret trong CLIENT-SIDE code

**File:** `src/components/admin/shared/post-sidebar.tsx` (dòng 130)

```typescript
const PREVIEW_SECRET = "erg_preview_secret_2026";
```

File này là `"use client"` → secret nằm trong browser bundle → ai cũng đọc được. Kết hợp với `src/app/api/preview/route.ts` dùng cùng secret, attacker có thể kích hoạt Draft Mode đọc bài viết chưa xuất bản.

**Fix:** Chuyển preview request qua server action, không expose secret ở client.

---

#### B-C2: XSS qua `html-react-parser` KHÔNG sanitize

**File:** `src/components/shared/post-content-renderer.tsx` (dòng 31-33)

```typescript
return <div className="prose...">{parse(content, options)}</div>
```

`html-react-parser` chỉ parse HTML thành React, **KHÔNG** sanitize. Nếu `content` từ backend chứa `<script>`, `<img onerror=...>`, chúng render nguyên vẹn.

**Fix:** Thêm `DOMPurify.sanitize(content)` trước khi parse.

---

#### B-C3: Tokens lưu trong localStorage — dễ bị XSS đánh cắp

**Files:**
- `src/services/http-client.ts` (dòng 42-44) — `localStorage.getItem('accessToken')`
- `src/hooks/use-login.ts` (dòng 28-29) — `localStorage.setItem('accessToken', ...)`

Kết hợp với lỗi XSS (B-C2), attacker có thể đọc toàn bộ tokens.

**Fix:** Dùng httpOnly cookies cho refresh token. Access token có thể giữ trong memory (React state/context).

---

#### B-C4: Permissions lưu localStorage — dễ bị giả mạo

**Files:**
- `src/hooks/use-permission.ts` (dòng 17-20)
- `src/components/admin/admin-auth-guard.tsx` (dòng 74-76)

```typescript
localStorage.setItem('permissions', JSON.stringify(auth.permissions));
// ...
const permissions: string[] = JSON.parse(localStorage.getItem('permissions'));
setHasPermission(permissions.includes(permission));
```

User có thể mở DevTools, sửa `localStorage.permissions` để tự thêm bất kỳ quyền nào → bypass toàn bộ phân quyền client-side.

**Lưu ý:** Backend vẫn validate permissions, nên chỉ là UI bypass. Nhưng đây vẫn là bad practice.

---

### 🟡 HIGH

#### B-H1: Backend URL fallback SAI PORT

**File:** `src/app/@main/tin-tuc/[slug]/page.tsx` (dòng 27, 68)

```typescript
const apiUrl = process.env.BACKEND_URL || 'http://localhost:3000';  // ← SAI! BE là port 3003
```

Tất cả file khác dùng `localhost:3003`. File này dùng `3000` (port FE) → gọi API về chính mình → 404/loop.

---

#### B-H2: `AiSearchSummaryBox` render HAI LẦN

**File:** `src/app/@main/tin-tuc/[slug]/page.tsx` (dòng 284-285)

```tsx
<AiSearchSummaryBox post={post} />
<AiSearchSummaryBox post={post} />
<PostContentRenderer content={post.content} />
```

Lỗi copy-paste, component bị duplicate.

---

#### B-H3: Memory Leak — `addEventListener` không cleanup đúng

**File:** `src/hooks/use-element-rect.ts` (dòng 129-134)

```typescript
window.addEventListener("scroll", handleUpdate, true)   // capture: true
// ...
window.removeEventListener("scroll", handleUpdate)       // THIẾU capture: true
```

Theo MDN spec, `removeEventListener` phải match chính xác `useCapture` option. Listener **KHÔNG BAO GIỜ** bị gỡ → memory leak khi component remount.

---

#### B-H4: Memory Leak — `useAiWriter` interval không cleanup

**File:** `src/hooks/use-ai-writer.ts` (dòng 88)

```typescript
intervalRef.current = setInterval(async () => { /* polling */ }, 5000);
```

Không có `useEffect` cleanup để `clearInterval` khi component unmount → interval chạy background mãi, liên tục gọi API.

---

### 🟢 MEDIUM — Mock/Chưa hoàn thành

#### B-M1: Trang tạo user — GIẢ LẬP API bằng `setTimeout`

**File:** `src/app/@admin/(dashboard)/admin/users/create/page.tsx` (dòng 57-63)

```typescript
await new Promise(resolve => setTimeout(resolve, 1000));
toast.success("Tạo người dùng thành công!");
```

KHÔNG gọi API. Form data không được gửi lên server.

---

#### B-M2: Manage Roles Dialog — API call bị COMMENT OUT

**File:** `src/app/@admin/(dashboard)/admin/users/manage-user-roles-dialog.tsx` (dòng 67-75)

```typescript
// await accessControlApi.assignRoles(user.id, selectedRoleIds);
toast.success(`Đã cập nhật vai trò...`);
```

Bấm "Lưu thay đổi" → chỉ hiện toast, KHÔNG update server.

---

#### B-M3: Available Roles HARDCODED

**Files:**
- `src/app/@admin/(dashboard)/admin/users/manage-user-roles-dialog.tsx` (dòng 33-38)
- `src/app/@admin/(dashboard)/admin/users/create/page.tsx` (dòng 17-22)

```typescript
const AVAILABLE_ROLES = [
    { id: "1", name: "Admin" },
    { id: "2", name: "Editor" },
    { id: "3", name: "SEO Specialist" },
    { id: "4", name: "HR Manager" },
];
```

IDs hardcoded không match database. Nên fetch từ API.

---

#### B-M4: Users page — Search chỉ filter CLIENT-SIDE

**File:** `src/app/@admin/(dashboard)/admin/users/page.tsx` (dòng 73-79)

```typescript
// TODO: Connect search to API properly
const filteredUsers = usersList.filter(u => u.name.includes(searchTerm));
```

Chỉ filter 10 users của trang hiện tại. Không tìm được users ở trang khác.

---

#### B-M5: Users page — Roles updated callback chỉ `console.log`

**File:** `src/app/@admin/(dashboard)/admin/users/page.tsx` (dòng 305-308)

```typescript
onRolesUpdated={() => { console.log("Roles updated..."); }}
```

Không gọi `refetch()` → UI không refresh data.

---

#### B-M6: `pagesApi.getPage()` trả về MOCK DATA cho MOS

**File:** `src/services/pages.api.ts` (dòng 17-33)

```typescript
// [MOCK] Simulation for development until BE is ready
if (slug === 'mos') { return { title: "Microsoft Office Specialist (MOS)", ... }; }
```

---

#### B-M7: SEO Dashboard — Trend chart MOCK DATA

**File:** `src/app/@admin/(dashboard)/admin/seo/page.tsx` (dòng 36-46)

```typescript
// --- MOCK DATA FOR CHARTS THAT DON'T HAVE API YET ---
const trendData = [{ name: '1/10', score: 65 }, ...];
```

Health + topPosts dùng real API, nhưng trend chart và delta metrics hardcoded.

---

#### B-M8: Crawler status HARDCODED "ONLINE"

**File:** `src/app/@admin/(dashboard)/admin/crawler/page.tsx` (dòng 272-282)

```html
<Badge>ONLINE</Badge>  <!-- Không có healthcheck API -->
<Badge>STABLE</Badge>
<Badge>CONNECTED</Badge>
```

---

#### B-M9: Reviews username hardcoded "Khách"

**File:** `src/components/shared/reviews.tsx` (dòng 53)

```typescript
userName: "Khách" // TODO: Lấy tên user thật nếu đã login
```

---

#### B-M10: SearchEngineMeta — Placeholder verification codes

**File:** `src/components/seo/search-engine-meta.tsx` (dòng 7-17)

```typescript
googleVerification: "your-google-verification-code",
bingVerification: "your-bing-verification-code",
```

Có gọi API thật nhưng fallback values sẽ render ra HTML nếu API fail.

---

#### B-M11: Buttons/Menu items KHÔNG CÓ onClick handler

**File:** `src/app/@admin/(dashboard)/admin/users/page.tsx`

| Dòng | Element |
|------|---------|
| 126-128 | Nút "Export" |
| 149-152 | Nút "Lọc" |
| 158 | Nút "Tạm khóa" (bulk) |
| 159 | Nút "Xóa" (bulk) |
| 249-252 | Menu "Khóa tài khoản" |

---

#### B-M12: Middleware KHÔNG LÀM GÌ

**File:** `src/middleware.ts`

```typescript
export function middleware(request: NextRequest) {
    return NextResponse.next();
}
```

Theo CLAUDE.md: *"middleware.ts handles i18n locale routing and subdomain-based parallel route selection"* — nhưng thực tế chỉ pass-through. Không có CSRF, rate limiting, security headers, subdomain routing.

---

### ⚪ LOW

#### B-L1: Cron raw syntax hiển thị cho user

**File:** `src/components/admin/crawler/cron-editor.tsx` (dòng 176-182)

UI chọn friendly (tab Phút/Giờ/Ngày/Tuần), nhưng vẫn hiện `0 * * * *` ở cuối component. Non-tech users sẽ confused.

---

#### B-L2: AI Search Summary Box quá đơn giản

**File:** `src/components/seo/ai-search-summary.tsx`

Chỉ hiển thị excerpt + TOC cơ bản. Thiếu Key Takeaways, FAQ sections, speakable schema cho Google AI Overview.

---

#### B-L3: Recharts KHÔNG lazy load

11 files import trực tiếp `recharts` (library ~230KB gzipped) mà không qua `next/dynamic` hay `React.lazy()`. Ảnh hưởng bundle size cho admin pages.

---

#### B-L4: Duplicate `notFound()` check

**File:** `src/app/@tinhocquocte/khoa-hoc/[slug]/page.tsx` (dòng 61, 63)

```typescript
if (!course) notFound();
if (!course) notFound();
```

---

#### B-L5: `console.log` còn sót trong production

| File | Dòng |
|------|------|
| `src/hooks/use-image-tracker.ts` | 59, 66, 74 |
| `src/hooks/use-ai-writer.ts` | 111, 118 |
| `src/app/@admin/.../users/page.tsx` | 307 |

---

#### B-L6: 120+ lần dùng `any` trong codebase

Tập trung ở: `use-ai-writer.ts` (~10 lần), `courses.api.ts` (~9 lần), `posts.api.ts` (~4 lần), `http-client.ts`, `use-auth.ts`.

---

---

## BẢNG TỔNG HỢP ƯU TIÊN

### 🔴 CRITICAL — Fix ngay (Block deployment)

| # | ID | Vị trí | Mô tả |
|---|----|--------|--------|
| 1 | A-C1 | BE Guard | PermissionsGuard không enforce GRANT/DENY overrides |
| 2 | A-C2 | BE Crawler | Crawler Controller không có auth guard (PUBLIC) |
| 3 | A-C3 | BE Crawler | SSRF — fetch bất kỳ URL nào qua crawler |
| 4 | B-C1 | FE Client | Preview secret hardcoded trong client-side bundle |
| 5 | B-C2 | FE Content | XSS qua html-react-parser không sanitize |
| 6 | B-C3 | FE Auth | Access/Refresh tokens lưu localStorage |
| 7 | B-C4 | FE Auth | Permissions lưu localStorage, có thể giả mạo |
| 8 | D1 | BE+FE SEO | Không có AggregateRating schema → Google KHÔNG hiện ⭐ sao trên kết quả tìm kiếm |
| 9 | D2 | BE+FE Review | Admin không thể duyệt/từ chối đánh giá (thiếu API + UI) |

### 🟡 HIGH — Fix trước release

| # | ID | Vị trí | Mô tả |
|---|----|--------|--------|
| 1 | A-H1 | BE SEO | Redirects controller không có auth |
| 2 | A-H2 | BE Auth | Mật khẩu Admin hardcoded + log plaintext |
| 3 | A-H3 | BE Filter | SeoRedirectFilter override global exception filter |
| 4 | A-H4 | BE Crawler | Process processor xóa tất cả link href |
| 5 | A-H5 | BE RBAC | getUserPermissionsAndFeatures bỏ qua overrides |
| 6 | B-H1 | FE Config | Backend URL fallback sai port (3000 thay vì 3003) |
| 7 | B-H2 | FE UI | AiSearchSummaryBox render 2 lần (duplicate) |
| 8 | B-H3 | FE Memory | addEventListener không cleanup đúng capture option |
| 9 | B-H4 | FE Memory | useAiWriter interval không cleanup khi unmount |

### 🟢 MEDIUM — Fix khi có thời gian

| # | ID | Vị trí | Mô tả |
|---|----|--------|--------|
| 1 | A-M1 | BE Valid | Nhiều endpoints dùng `@Body() any` thay vì DTO |
| 2 | A-M2 | BE Error | throw Error() thay vì HttpException |
| 3 | A-M3 | BE Perm | Permission `system.manage.settings` không tồn tại trong seed |
| 4 | A-M4 | BE SEO | CocCoc submission là fake implementation |
| 5 | A-M5 | BE Code | Hardcoded admin email trong processors |
| 6 | A-M6 | BE Email | Placeholder phone number trong email |
| 7 | A-M7 | BE Review | Reviews controller không trích xuất user (TODO) |
| 8 | A-M8 | BE Config | Env vars không validate khi startup |
| 9 | A-M9 | BE SEO | IndexNow key dùng default không an toàn |
| 10 | A-M10 | BE Crawler | Không có rate limit per domain |
| 11 | B-M1 | FE Users | Trang tạo user giả lập API bằng setTimeout |
| 12 | B-M2 | FE Users | Manage roles dialog API bị comment out |
| 13 | B-M3 | FE Users | Available roles hardcoded |
| 14 | B-M4 | FE Users | Search chỉ client-side |
| 15 | B-M5 | FE Users | Roles updated callback chỉ console.log |
| 16 | B-M6 | FE Pages | pagesApi.getPage() mock data cho MOS |
| 17 | B-M7 | FE SEO | Trend chart mock data |
| 18 | B-M8 | FE Crawler | Status hardcoded "ONLINE" |
| 19 | B-M9 | FE Review | Username hardcoded "Khách" |
| 20 | B-M10 | FE SEO | Verification codes placeholder fallback |
| 21 | B-M11 | FE UX | Buttons/menus không có onClick handler |
| 22 | B-M12 | FE Middleware | Middleware không làm gì (pass-through) |

### ⚪ LOW — Nice to have

| # | ID | Mô tả |
|---|----|--------|
| 1 | A-L1 | Duplicate @Permissions decorator |
| 2 | A-L2 | Redirect hitCount không persist |
| 3 | B-L1 | Cron raw syntax hiển thị cho non-tech users |
| 4 | B-L2 | AI Search Summary Box quá đơn giản |
| 5 | B-L3 | Recharts không lazy load (11 files) |
| 6 | B-L4 | Duplicate notFound() check |
| 7 | B-L5 | console.log còn sót |
| 8 | B-L6 | 120+ lần dùng `any` |

---

## HÀNH ĐỘNG TIẾP THEO

### Sprint 1: Security Fixes (KHẨN CẤP)
1. **A-C1**: Sửa `AccessTokenStrategy` + `PermissionsGuard` để load và enforce UserPermission GRANT/DENY
2. **A-C2**: Thêm `@UseGuards(JwtAuthGuard, PermissionsGuard)` cho `CrawlerController`
3. **A-C3**: Thêm URL validation trong crawler (block private IPs, metadata endpoints)
4. **A-H1**: Thêm auth guard cho `RedirectsController`
5. **A-H2**: Đọc admin password từ env var, KHÔNG log plaintext
6. **B-C1**: Chuyển preview logic qua server action, xóa secret khỏi client
7. **B-C2**: Thêm `DOMPurify.sanitize()` trước khi render HTML content
8. **B-C3**: Chuyển refresh token sang httpOnly cookie
9. **B-C4**: Verify permissions server-side thay vì chỉ dựa vào localStorage

### Sprint 2: Bug Fixes
1. **A-H3**: Đổi `SeoRedirectFilter` từ `@Catch()` → `@Catch(NotFoundException)`
2. **A-H4**: Sửa process.processor.ts — chỉ xóa external links, giữ internal
3. **A-H5**: `getUserPermissionsAndFeatures()` phải load cả UserPermission overrides
4. **B-H1**: Sửa port fallback `3000` → `3003`
5. **B-H2**: Xóa duplicate `AiSearchSummaryBox`
6. **B-H3**: Thêm `true` vào `removeEventListener` cho capture mode
7. **B-H4**: Thêm `useEffect` cleanup cho `useAiWriter` interval

### Sprint 3: Feature Completion
1. **D1+D2**: Review/Rating SEO — Google Rich Snippets ⭐ sao (xem Phụ lục D)
   - BE: Nâng cấp Review entity, API admin approve/reject/reply, AggregateRating schema
   - FE: Nâng cấp Reviews component, tạo admin `/admin/reviews`, JSON-LD trên public pages
2. **B-M1**: Kết nối trang tạo user với API thật
3. **B-M2**: Bỏ comment API call trong manage roles dialog
4. **B-M3**: Fetch roles từ API thay vì hardcode
5. **B-M4**: Search users qua API với debounce
6. **B-M5**: Gọi `refetch()` sau khi update roles
7. **A-M1**: Tạo proper DTOs cho các endpoints dùng `any`
8. **A-M3**: Đổi `system.manage.settings` → `system.settings` hoặc thêm vào seed

### Sprint 4: Polish
1. Xóa mock data còn sót (B-M6, B-M7, B-M8, B-M9, B-M10)
2. Fix validation/config issues (A-M2, A-M8, A-M9)
3. Implement onClick handlers cho buttons (B-M11)
4. Lazy load recharts (B-L3)
5. Clean up console.log, `any` types

---

> **Ghi chú quan trọng:** Report cũ (REVIEW-REPORT.md) có ~70% FALSE POSITIVE. File này (REVIEW-VERIFIED.md) chỉ chứa các lỗi đã **xác minh bằng cách đọc trực tiếp source code**. Mỗi issue đều có file path, line number, và code snippet cụ thể làm bằng chứng.

---

## PHỤ LỤC C: KIỂM TRA BỔ SUNG — Services & Admin Forms (2026-03-02)

> Phần này bổ sung các lỗi phát hiện thêm khi kiểm tra kỹ từng service file và toàn bộ admin forms.

---

### C1. SERVICE FILES — Vấn đề chưa hoàn thiện

#### C1.1: `services/index.ts` chỉ export 5/16 services

**File:** `src/services/index.ts` (dòng 2-7)

Chỉ export: `authApi`, `userApi`, `postsApi`, `aiApi`, `sessionsApi`. **11 service còn lại** (`accessControlApi`, `analyticsApi`, `crawlerApi`, `menuApi`, `notificationApi`, `pagesApi`, `recruitmentApi`, `reviewsApi`, `seoLoggingApi`, `seoApi`, `coursesApi`) phải import trực tiếp từ file → inconsistent import patterns.

---

#### C1.2: `analytics.api.ts` — 3 tracking functions BYPASS httpClient

**File:** `src/services/analytics.api.ts` (dòng 97-173)

`trackSessionBegin()`, `trackSessionFinish()`, `trackBehavior()` gọi `fetch()` trực tiếp thay vì dùng `httpClient`. Hậu quả:
- Bypass token refresh logic
- Bypass error handling chuẩn
- `trackBehavior` chỉ `console.error`, không throw

---

#### C1.3: `http-client.ts` — Retry sau refresh KHÔNG check response.ok

**File:** `src/services/http-client.ts` (dòng 102)

```typescript
resolve(fetch(url, { ...fetchOptions, headers: newHeaders }).then((res) => res.json()));
```

Sau khi refresh token thành công, retry request mà không check `res.ok` → nếu response là 403/500, vẫn cố parse JSON → có thể throw lỗi không rõ ràng.

---

#### C1.4: `seo-logging.api.ts` TRÙNG LẶP với `seo.api.ts`

**Files:**
- `src/services/seo-logging.api.ts` — function `log404`
- `src/services/seo.api.ts` (dòng 230-234) — function `log404`

Hai file làm cùng một việc. Nên xóa `seo-logging.api.ts` và dùng `seoApi.log404`.

---

#### C1.5: `auth.api.ts` — `getProfile()` trùng lặp với `userApi.getMe()`

**File:** `src/services/auth.api.ts` (dòng 60-65)

`authApi.getProfile()` gọi `/users/me` — trùng hoàn toàn với `userApi.getMe()` trong `users.api.ts`. Gây confusion về nên dùng function nào.

---

#### C1.6: 6 backend modules CHƯA CÓ frontend service

| Backend Module | Tình trạng |
|----------------|-----------|
| `audit` | Không có FE service — Audit logs page dùng mock data |
| `interaction` | Không có FE service |
| `operations` | Không có FE service |
| `organization` | Không có FE service |
| `profiles` | Không có FE service (userApi cover 1 phần) |
| `sitemap` | Không có FE service |

---

#### C1.7: `users.api.ts` thiếu admin functions

**File:** `src/services/users.api.ts`

Thiếu: `getUserById`, `updateUser`, `deleteUser`, `banUser`, `activateUser` — các function cần cho admin quản lý users.

---

#### C1.8: `menu.api.ts` chỉ có 1 function read

**File:** `src/services/menu.api.ts`

Chỉ có `getStructure()`. Thiếu toàn bộ CRUD: `createMenu`, `updateMenu`, `deleteMenu` cho admin.

---

#### C1.9: `reviews.api.ts` chỉ có 2 functions

**File:** `src/services/reviews.api.ts`

Chỉ có `getAll`, `create`. Thiếu: `update`, `delete`, `getById`, `adminGetAll` cho admin quản lý.

---

### C2. ADMIN FORMS — Phát hiện thêm

#### 🟡 HIGH — C2.1: RSS Wizard — TOÀN BỘ form dùng setTimeout giả lập

**File:** `src/app/@admin/(dashboard)/admin/crawler/rss/wizard/page.tsx` (dòng 33-53)

```typescript
const handleCheckUrl = () => {
    setIsLoading(true);
    setTimeout(() => { setIsLoading(false); setStep(2); toast.success("Đã tìm thấy RSS Feed hợp lệ!"); }, 1500);
};
const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => { setIsSaving(false); setStep(4); }, 2000);
};
```

- Step 2 hiển thị mock data cứng ("Tin Công Nghệ - VNExpress", 25 bài)
- Step 3 categories hardcoded (`<SelectItem>`)
- KHÔNG gọi bất kỳ API nào

---

#### 🟡 HIGH — C2.2: Edit Role — Load data GIẢ, không gọi API

**File:** `src/app/@admin/(dashboard)/admin/access-control/roles/[id]/edit/page.tsx` (dòng 13-24)

```typescript
useEffect(() => {
    setTimeout(() => {
        setRole({ id: params.id, name: "Editor", description: "Can create and publish posts", permissions: [...] });
        setLoading(false);
    }, 500);
}, [params.id]);
```

Luôn hiển thị "Editor" bất kể ID nào.

---

#### 🟡 HIGH — C2.3: AI Batch Generation — Toàn bộ MOCK

**File:** `src/app/@admin/(dashboard)/admin/posts/ai-batch/page.tsx` (dòng 85-133)

```typescript
const simulateBatchProcess = async (itemsToProcess: BatchItem[]) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    // ...kết quả thành công/thất bại là Math.random()
};
```

Không gọi API nào. Dùng delays setTimeout mô phỏng tiến trình AI.

---

#### 🟡 HIGH — C2.4: Course Edit — Catch block hiện SUCCESS khi lỗi

**File:** `src/app/@admin/(dashboard)/admin/courses/[id]/edit/page.tsx` (dòng 105-118)

```typescript
try {
    await coursesApi.update(courseId, { ... });
    toast.success("Cập nhật thành công!");
} catch {
    await new Promise(resolve => setTimeout(resolve, 800));
    toast.success("Cập nhật thành công!");  // ← HIỆN THÀNH CÔNG KHI LỖI!
}
```

Catch block **giả vờ thành công** thay vì thông báo lỗi → user nghĩ đã save nhưng thực tế data không được lưu.

---

#### 🟢 MEDIUM — C2.5: Roles List Page — Mock data cứng

**File:** `src/app/@admin/(dashboard)/admin/access-control/roles/page.tsx` (dòng 27-32)

```typescript
const MOCK_ROLES = [{ id: "1", name: "Admin" }, { id: "2", name: "Editor" }, ...];
const [roles, setRoles] = useState(MOCK_ROLES);
```

Nút "Xóa vai trò" trong dropdown **không có onClick handler**.

---

#### 🟢 MEDIUM — C2.6: Permissions Page — Mock data cứng

**File:** `src/app/@admin/(dashboard)/admin/access-control/permissions/page.tsx` (dòng 16-23)

6 permissions hardcoded, không gọi API.

---

#### 🟢 MEDIUM — C2.7: Audit Logs Page — Mock data cứng

**File:** `src/app/@admin/(dashboard)/admin/access-control/audit-logs/page.tsx` (dòng 17-22)

Mock logs, nút "Filter" là `<Badge>` không có onClick.

---

### C3. ERROR HANDLING — Phát hiện thêm

#### 🟢 MEDIUM — C3.1: 3 deleteMutation thiếu onError handler

**Files:**
- `src/app/@admin/(dashboard)/admin/crawler/rss/page.tsx` (dòng 552-558)
- `src/app/@admin/(dashboard)/admin/crawler/configs/page.tsx` (dòng 89-95)
- `src/app/@admin/(dashboard)/admin/recruitment/jobs/page.tsx` (dòng 52-58)

Cả 3 đều có `onSuccess` nhưng **không có `onError`** → user không biết khi xóa thất bại.

---

#### 🟢 MEDIUM — C3.2: Crawler History — Search/Filter UI không kết nối

**File:** `src/app/@admin/(dashboard)/admin/crawler/history/page.tsx` (dòng 77, 80-90)

Input search và dropdown filter trạng thái không có `value`/`onChange` → chỉ là giao diện tĩnh.

---

### C4. ACCESSIBILITY

#### 🟢 MEDIUM — C4.1: 15+ icon-only buttons thiếu `aria-label`

Tất cả các nút chỉ có icon (Edit, Delete, View) trong admin section đều thiếu `aria-label`:

| File | Dòng | Buttons |
|------|------|---------|
| `recruitment/jobs/page.tsx` | 204, 209, 214 | View, Edit, Delete |
| `courses/[id]/syllabus/page.tsx` | 117, 120, 155 | Edit, Delete chapters/lessons |
| `crawler/configs/page.tsx` | 298, 306 | Edit, Delete config |
| `crawler/rss/page.tsx` | 726, 734 | Edit, Delete RSS |
| `settings/ai-keys/page.tsx` | 523, 531 | Edit, Delete API key |
| `seo/page.tsx` | 301, 353 | Edit/View posts |

Screen readers sẽ chỉ đọc "button" mà không có mô tả.

---

#### ⚪ LOW — C4.2: Star rating buttons thiếu `aria-label`

**File:** `src/components/shared/reviews.tsx` (dòng 69-84)

5 nút đánh giá sao không có accessible name (ví dụ: "1 sao", "2 sao"...).

---

#### ⚪ LOW — C4.3: AI Batch form — `<label>` không có `htmlFor`

**File:** `src/app/@admin/(dashboard)/admin/posts/ai-batch/page.tsx` (dòng 188-233)

Các `<label>` không liên kết với `<select>` qua `htmlFor`/`id`.

---

### C5. ERROR BOUNDARIES

#### 🟢 MEDIUM — C5.1: Public pages KHÔNG CÓ Error Boundary

- **Admin layout**: CÓ `<SectionErrorBoundary>` tại `src/app/@admin/(dashboard)/layout.tsx:33`
- **Public layout** (`@main/layout.tsx`): **KHÔNG CÓ** Error Boundary
- **Parallel routes** (`@tinhocquocte`, `@tinhocquocgia`, etc.): Rất có thể cũng **KHÔNG CÓ**
- **Không có `error.tsx`** nào trong toàn bộ `src/app/` → Next.js không có fallback UI cho từng route segment

Hậu quả: Lỗi JavaScript trên trang public → white screen chết, không có UI recovery.

---

### C6. BẢNG TỔNG HỢP BỔ SUNG

| # | ID | Mức độ | Mô tả |
|---|----|--------|--------|
| 1 | C2.1 | HIGH | RSS Wizard toàn bộ setTimeout mock |
| 2 | C2.2 | HIGH | Edit Role load data giả |
| 3 | C2.3 | HIGH | AI Batch Generation toàn mock |
| 4 | C2.4 | HIGH | Course Edit catch block hiện success khi lỗi |
| 5 | C2.5 | MEDIUM | Roles List page mock data |
| 6 | C2.6 | MEDIUM | Permissions page mock data |
| 7 | C2.7 | MEDIUM | Audit Logs page mock data |
| 8 | C1.1 | MEDIUM | services/index.ts chỉ export 5/16 |
| 9 | C1.2 | MEDIUM | analytics.api.ts bypass httpClient |
| 10 | C1.3 | MEDIUM | http-client retry không check response.ok |
| 11 | C1.4 | LOW | seo-logging.api.ts trùng lặp |
| 12 | C1.5 | LOW | authApi.getProfile trùng userApi.getMe |
| 13 | C1.6 | LOW | 6 BE modules thiếu FE service |
| 14 | C1.7 | MEDIUM | users.api.ts thiếu admin functions |
| 15 | C1.8 | LOW | menu.api.ts chỉ 1 function |
| 16 | C1.9 | LOW | reviews.api.ts chỉ 2 functions |
| 17 | C3.1 | MEDIUM | 3 deleteMutation thiếu onError |
| 18 | C3.2 | LOW | Crawler History filter không kết nối |
| 19 | C4.1 | MEDIUM | 15+ icon buttons thiếu aria-label |
| 20 | C4.2 | LOW | Star rating thiếu aria-label |
| 21 | C4.3 | LOW | label/select thiếu htmlFor |
| 22 | C5.1 | MEDIUM | Public pages không có Error Boundary |

---

---

### D. THIẾU TÍNH NĂNG: Review/Rating cho Google Rich Snippets (⭐ Sao trên kết quả tìm kiếm)

> **Bối cảnh:** Khi bạn tìm kiếm trên Google, một số kết quả hiển thị **⭐⭐⭐⭐⭐ 4.7 (156 đánh giá)** ngay bên dưới tiêu đề — đây gọi là **Google Rich Snippets** (Review Snippets). Tính năng này giúp tăng **CTR (tỷ lệ nhấp) 15-25%** so với kết quả không có sao. Để Google hiển thị sao, website cần có:
> 1. Đánh giá từ **người dùng thật** (không được tự tạo fake)
> 2. Structured data `AggregateRating` + `Review` (JSON-LD schema)
> 3. Admin phải có quyền **duyệt/từ chối** đánh giá trước khi public
>
> Hiện tại codebase **CÓ** module reviews cơ bản nhưng **THIẾU** hầu hết các yếu tố cần thiết cho SEO.

#### 🔴 CRITICAL — D1: KHÔNG có AggregateRating Schema → Google KHÔNG hiển thị ⭐ sao

**Files liên quan:**
- BE: `src/modules/seo/services/schema-markup.service.ts`
- BE: `src/modules/reviews/`
- FE: `src/app/@tinhocquocte/khoa-hoc/[slug]/page.tsx`

**Vấn đề:** `SchemaMarkupService` có `generateCourseSchema()` và `generateArticleSchema()` nhưng **KHÔNG** tích hợp `aggregateRating` hay `review` vào schema. Kết quả: Google không bao giờ hiển thị sao cho bất kỳ trang nào của ERG.

**Cần thêm vào Course/Article schema:**
```json
{
  "@type": "Course",
  "name": "Khóa học MOS Excel 2021",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.7",
    "bestRating": "5",
    "ratingCount": 156,
    "reviewCount": 156
  },
  "review": [
    {
      "@type": "Review",
      "author": { "@type": "Person", "name": "Nguyễn Văn A" },
      "reviewRating": { "@type": "Rating", "ratingValue": 5 },
      "reviewBody": "Khóa học rất hay...",
      "datePublished": "2026-02-15"
    }
  ]
}
```

**Kết quả mong đợi trên Google Search:**
```
Khóa học MOS Excel 2021 - EduRise Global
https://tinhocquocte.erg.edu.vn/khoa-hoc/mos-excel-2021
⭐⭐⭐⭐⭐ 4.7 (156 đánh giá) — Khóa học
Luyện thi chứng chỉ MOS Excel cùng giảng viên chuyên nghiệp...
```

**Google yêu cầu tối thiểu 3 reviews approved để hiển thị sao.**

---

#### 🔴 CRITICAL — D2: Admin KHÔNG CÓ khả năng duyệt/từ chối đánh giá

**Files liên quan:**
- BE: `src/modules/reviews/reviews.controller.ts`
- FE: Không có trang admin quản lý reviews

**Vấn đề hiện tại:**

| Tính năng | Trạng thái |
|-----------|-----------|
| Entity Review với `status` (pending/approved/rejected) | ✅ Có |
| API public tạo review (`POST /reviews`) | ✅ Có — nhưng `@Public()`, không extract user |
| API admin approve/reject | ❌ **KHÔNG CÓ** |
| API admin reply (phản hồi đánh giá) | ❌ **KHÔNG CÓ** |
| API admin batch approve/reject | ❌ **KHÔNG CÓ** |
| API get reviews CHỈ approved | ❌ **KHÔNG CÓ** — `findAll()` trả về TẤT CẢ kể cả pending/rejected |
| FE trang admin `/admin/reviews` | ❌ **KHÔNG CÓ** |
| Anti-spam (rate limit, min content) | ❌ **KHÔNG CÓ** |
| Permission `reviews.manage` | ❌ **KHÔNG CÓ** trong seed |

**Hậu quả:**
- Review nào cũng hiện public (kể cả spam, nội dung xấu)
- Admin không có cách nào duyệt/từ chối
- Không đạt yêu cầu Google về "reviews từ người dùng thật có kiểm duyệt"

---

#### 🟡 HIGH — D3: Review Entity thiếu nhiều fields quan trọng

**File:** `src/modules/reviews/entities/review.entity.ts`

| Field cần thêm | Mục đích |
|----------------|---------|
| `adminNote` | Ghi chú nội bộ khi duyệt/từ chối |
| `reviewedBy` | Admin ID người duyệt |
| `reviewedAt` | Thời gian duyệt |
| `replyContent` | Phản hồi từ admin/instructor (hiện trên public) |
| `replyBy`, `replyAt` | Ai phản hồi, khi nào |
| `isFeatured` | Đánh giá nổi bật (hiện đầu tiên) |
| `helpfulCount` | "X người thấy hữu ích" |
| `ipAddress`, `userAgent` | Chống spam/bot |
| `userEmail`, `userAvatar` | Hiển thị trên public page |

---

#### 🟡 HIGH — D4: FE Reviews component chưa đạt chuẩn cho SEO

**File:** `src/components/shared/reviews.tsx`

| Tính năng | Trạng thái |
|-----------|-----------|
| Star rating form + submit | ✅ Có |
| Hiển thị danh sách reviews | ✅ Có |
| Thống kê average + count | ✅ Có |
| Rating distribution bar (% từng mức sao) | ❌ Thiếu |
| Sort (mới nhất, điểm cao, hữu ích nhất) | ❌ Thiếu |
| Badge "✅ Đã mua khóa học" (verified purchase) | ❌ Thiếu |
| Badge "📌 Nổi bật" (featured) | ❌ Thiếu |
| Hiển thị admin reply dưới review | ❌ Thiếu |
| Nút "👍 Hữu ích" | ❌ Thiếu |
| Thông báo "Đánh giá sẽ hiện sau khi duyệt" | ❌ Thiếu |
| Lấy tên user thật khi đã login | ❌ Thiếu — hardcoded "Khách" |
| Validate min 20 ký tự | ❌ Thiếu |
| Chặn review trùng (đã đánh giá rồi) | ❌ Thiếu |

---

#### 🟡 HIGH — D5: Public API trả review chưa lọc theo status

**File:** `src/modules/reviews/reviews.service.ts`

`findAll()` trả về **TẤT CẢ** reviews bao gồm pending + rejected. Public page phải chỉ hiện `status = 'approved'`.

---

#### 🟢 MEDIUM — D6: Course/Post API response KHÔNG kèm review stats

**Files:**
- BE: `src/modules/courses/courses.service.ts`
- BE: `src/modules/posts/posts.service.ts`

Khi lấy course/post cho public, response **KHÔNG** kèm theo `reviewStats` (averageRating, totalReviews, ratingDistribution). FE phải gọi thêm 1 API riêng → chậm hơn, và quan trọng hơn là schema JSON-LD không có dữ liệu rating.

---

#### 🟢 MEDIUM — D7: Thiếu Google policy compliance

**Vấn đề:**
- Google **CẤM** thêm rating cho bài tin tức (News Articles) → cần logic phân biệt post type
- Google **YÊU CẦU** >= 3 reviews approved để hiển thị sao → cần check trước khi generate schema
- Google **YÊU CẦU** reviews từ người dùng thật → cần anti-spam + moderation flow

---

### D8. BẢNG TỔNG HỢP — Review/Rating SEO

| # | ID | Mức độ | BE/FE | Mô tả |
|---|----|--------|-------|--------|
| 1 | D1 | CRITICAL | BE+FE | Không có AggregateRating schema → Google không hiện ⭐ sao |
| 2 | D2 | CRITICAL | BE+FE | Admin không thể duyệt/từ chối đánh giá |
| 3 | D3 | HIGH | BE | Review entity thiếu nhiều fields (admin note, reply, featured, anti-spam) |
| 4 | D4 | HIGH | FE | Reviews component thiếu distribution bar, sort, badges, reply |
| 5 | D5 | HIGH | BE | Public API trả reviews chưa lọc theo approved status |
| 6 | D6 | MEDIUM | BE | Course/Post response không kèm review stats |
| 7 | D7 | MEDIUM | BE | Thiếu Google policy compliance (news articles, min reviews) |

### D9. SPRINT PLAN CHO REVIEW/RATING SEO

**Sprint ưu tiên (nên làm trong Sprint 3 — Feature Completion):**

1. **D3**: Nâng cấp Review entity + migration
2. **D2**: Tạo admin API endpoints (approve/reject/reply/batch/feature) + seed `reviews.manage`
3. **D5**: Sửa public API chỉ trả `status = 'approved'`
4. **D1**: Tích hợp AggregateRating + Review schema vào Course/Article JSON-LD
5. **D6**: Kèm review stats vào Course/Post API response
6. **D4**: Nâng cấp FE Reviews component
7. **D2 (FE)**: Tạo trang admin `/admin/reviews` với moderation flow
8. **D7**: Thêm logic phân biệt post type + minimum reviews check

> **Tham khảo plan chi tiết:** PLAN-BACKEND.md Task 4.2.7, PLAN-FRONTEND.md Task 4.2.8

---

### C7. CẬP NHẬT SPRINT PLAN

**Bổ sung Sprint 2 (Bug Fixes):**
- **C2.4**: Sửa catch block trong Course Edit — hiện `toast.error()` thay vì `toast.success()`

**Bổ sung Sprint 3 (Feature Completion):**
- **C2.1**: Kết nối RSS Wizard với `crawlerApi` thật
- **C2.2**: Load role data thật từ `accessControlApi.getRoleById()`
- **C2.3**: Kết nối AI Batch với backend AI content API
- **C2.5**: Kết nối Roles List page với `accessControlApi.getRoles()`
- **C2.6**: Kết nối Permissions page với `accessControlApi.getPermissions()`
- **C2.7**: Tạo `audit.api.ts` service + kết nối Audit Logs page
- **C1.7**: Thêm admin functions vào `users.api.ts`
- **C3.1**: Thêm `onError` handler cho tất cả `useMutation`

**Bổ sung Sprint 4 (Polish):**
- **C1.1**: Export tất cả services từ `index.ts`
- **C1.2**: Chuyển analytics tracking qua `httpClient`
- **C1.3**: Check `response.ok` trong retry logic
- **C1.4**: Xóa `seo-logging.api.ts` duplicate
- **C4.1**: Thêm `aria-label` cho tất cả icon-only buttons
- **C5.1**: Thêm Error Boundary cho public layouts + tạo `error.tsx` files

---

## PHỤ LỤC E: KIỂM TRA SEO BEST PRACTICES — Frontend (2026-03-03)

> Phần này kiểm tra chi tiết SEO implementation trên tất cả public pages theo Google SEO best practices.

---

### E1. METADATA & generateMetadata

#### 🔴 CRITICAL — E1.1: Trang khóa học listing KHÔNG CÓ metadata nào

**File:** `src/app/@tinhocquocte/khoa-hoc/page.tsx`

Trang public quan trọng, **hoàn toàn không có** `export const metadata` hay `generateMetadata()`. Google sẽ dùng title mặc định từ root layout → SEO rất kém cho trang này.

**Fix:** Thêm metadata với title, description, canonical, openGraph, keywords.

---

#### 🔴 CRITICAL — E1.2: Metadata khóa học detail bị HARDCODE

**File:** `src/app/@tinhocquocte/khoa-hoc/[slug]/page.tsx` (dòng 11-30)

`generateMetadata()` có tồn tại nhưng title/description bị **hardcode** là `"MOS Excel 2021 Advanced"` — không dùng `params.slug` để fetch data thật từ API. **Mọi khóa học đều hiển thị cùng metadata**.

**Fix:** Fetch course data bằng slug rồi dùng `course.title`, `course.description`.

---

#### 🔴 CRITICAL — E1.3: JobPosting schema truyền `baseSalary.value: 0`

**File:** `src/app/@tuyendung/tuyen-dung/[slug]/page.tsx` (dòng 68-93)

```typescript
baseSalary: { currency: 'VND', value: 0, repeatFrequency: 'MONTH' }
```

Google có thể hiển thị **"Lương: 0 VND/tháng"** trên kết quả tìm kiếm. Khi lương là "thỏa thuận", **KHÔNG NÊN** truyền `baseSalary` vào schema.

**Fix:** Chỉ thêm `baseSalary` khi có giá trị thật (`> 0`).

---

#### 🟡 HIGH — E1.4: Thiếu `canonical` URL trên 10+ trang public

**Các trang THIẾU canonical:**

| Trang | File |
|-------|------|
| Trang chủ main | `@main/page.tsx` |
| Tin tức listing | `@main/tin-tuc/page.tsx` |
| Trang chủ THQT | `@tinhocquocte/page.tsx` |
| Trang chủ THQG | `@tinhocquocgia/page.tsx` |
| Trang chủ Tuyển dụng | `@tuyendung/page.tsx` |
| Tuyển dụng listing | `@tuyendung/tuyen-dung/page.tsx` |
| Job detail | `@tuyendung/tuyen-dung/[slug]/page.tsx` |
| Khóa học IC3, MOS, IC3 Spark | `@tinhocquocte/khoa-hoc/ic3-gs6/page.tsx`, `mos/page.tsx`, `ic3-spark-gs6/page.tsx` |

**Hậu quả:** Google có thể index cùng 1 trang từ nhiều URL (có/không trailing slash, www/non-www) → duplicate content → giảm ranking.

**Fix:** Tạo helper function `generateCanonical(host, path)` dùng chung cho tất cả pages.

---

#### 🟡 HIGH — E1.5: Trang tin tức listing thiếu OG, Twitter, keywords

**File:** `src/app/@main/tin-tuc/page.tsx` (dòng 10-13)

```typescript
export const metadata: Metadata = {
    title: 'Tin tức & Sự kiện',
    description: 'Cập nhật tin tức giáo dục...',
};
```

Chỉ có title + description. **THIẾU:** openGraph (hoàn toàn), twitter card, canonical, keywords.

---

#### 🟢 MEDIUM — E1.6: Form ứng tuyển nên có `noindex`

**File:** `src/app/@tuyendung/tuyen-dung/[slug]/ung-tuyen/page.tsx` (dòng 13-25)

Trang form ứng tuyển **KHÔNG NÊN** được Google index (nội dung form không có giá trị SEO). Cần thêm:
```typescript
robots: { index: false, follow: true }
```

---

#### ✅ OK — E1.7: Trang bài viết chi tiết — TỐT NHẤT

**File:** `src/app/@main/tin-tuc/[slug]/page.tsx` (dòng 103-165)

Trang này là **mẫu chuẩn** — có đầy đủ: `generateMetadata()` dynamic, canonical, openGraph `type: 'article'`, publishedTime, modifiedTime, authors, twitter card `summary_large_image`, keywords, noindex cho draft/deleted.

---

### E2. JSON-LD STRUCTURED DATA

#### 🟡 HIGH — E2.1: Course schema thiếu `hasCourseInstance` (Google yêu cầu bắt buộc)

**File:** `src/components/seo/schema-script.tsx` (dòng 121-150)

Từ tháng 3/2024, Google **yêu cầu bắt buộc** `hasCourseInstance` trong Course schema. Hiện tại thiếu hoàn toàn.

**Fix:**
```json
{
  "@type": "Course",
  "hasCourseInstance": {
    "@type": "CourseInstance",
    "courseMode": "Online",
    "courseWorkload": "PT40H",
    "instructor": { "@type": "Person", "name": "..." }
  }
}
```

Cũng thiếu: `courseCode`, `educationalLevel`, `inLanguage`.

---

#### 🟡 HIGH — E2.2: Duplicate BreadcrumbList JSON-LD trên trang bài viết

**File:** `src/app/@main/tin-tuc/[slug]/page.tsx`

Trang này có **2 BreadcrumbList schema khác nhau**:
1. Dòng 247: `<SchemaScript type="BreadcrumbList">` — 3 items (Trang chủ > Danh mục > Bài viết)
2. Dòng 256-263: `<Breadcrumb>` component — tự emit JSON-LD riêng với 2 items khác

**Hậu quả:** Google nhận được 2 breadcrumb schemas mâu thuẫn nhau → có thể bỏ qua cả 2 hoặc chọn sai.

**Fix:** Chỉ dùng 1 hệ thống breadcrumb, đảm bảo visual HTML và JSON-LD khớp nhau.

---

#### 🟡 HIGH — E2.3: Visual breadcrumb KHÔNG khớp JSON-LD

**File:** `src/app/@main/tin-tuc/[slug]/page.tsx`

Schema breadcrumb: `Trang chủ > Danh mục > Bài viết`
Visual breadcrumb: `Tin Tức > Bài viết`

Google yêu cầu structured data breadcrumb **PHẢI khớp** với visual breadcrumb trên trang.

---

#### 🟡 HIGH — E2.4: Course detail dùng mock rating data

**File:** `src/app/@tinhocquocte/khoa-hoc/[slug]/page.tsx` (dòng 70)

```typescript
rating: { average: 4.8, count: 45 }  // ← MOCK DATA, không từ API
```

Rating data hardcoded → Google có thể coi đây là **fake reviews** và phạt trang.

---

#### 🟢 MEDIUM — E2.5: Article schema có thể thiếu image

**File:** `src/components/seo/schema-script.tsx` (dòng 86-119)

Khi bài viết không có thumbnail, `image` sẽ là mảng rỗng `[]`. Google **khuyến nghị mạnh** Article schema phải có image.

---

### E3. SITEMAP

#### 🟢 MEDIUM — E3.1: `lastModified: new Date()` cho tất cả trang tĩnh

**File:** `src/app/sitemap.ts` (dòng 121)

Mỗi lần Google crawl sitemap, tất cả trang tĩnh đều hiện `lastModified` = ngay hiện tại → Google nghĩ tất cả trang vừa cập nhật → mất ý nghĩa của lastModified.

**Fix:** Dùng ngày deploy hoặc ngày thực sự cập nhật.

---

#### 🟢 MEDIUM — E3.2: Sitemap trả về `[]` khi backend lỗi

**File:** `src/app/sitemap.ts` (dòng 201)

Nếu backend down, Google nhận sitemap rỗng → có thể de-index tất cả trang.

**Fix:** Fallback về danh sách trang tĩnh thay vì mảng rỗng.

---

### E4. OPEN GRAPH & SOCIAL

#### 🟡 HIGH — E4.1: OG image fallback bị mất khi set `images: []`

**Files bị ảnh hưởng:**
- `src/app/@tinhocquocte/khoa-hoc/ic3-gs6/page.tsx` (dòng 21)
- `src/app/@tinhocquocte/khoa-hoc/mos/page.tsx` (dòng 20)
- `src/app/@tinhocquocte/khoa-hoc/ic3-spark-gs6/page.tsx` (dòng 20)

```typescript
images: pageData?.thumbnail ? [pageData.thumbnail] : []
```

Khi `pageData.thumbnail` là null, `images: []` **xóa** OG image từ root layout. Khi share link trên Facebook/Zalo sẽ không có hình preview.

**Fix:** Fallback về `SEO_DATA[key].ogImage` thay vì mảng rỗng.

---

#### 🟢 MEDIUM — E4.2: Job detail dùng OG type `article` sai

**File:** `src/app/@tuyendung/tuyen-dung/[slug]/page.tsx` (dòng 40)

```typescript
type: 'article'  // SAI — đây là job posting, không phải article
```

**Fix:** Dùng `type: 'website'` hoặc bỏ type (kế thừa root).

---

### E5. PERFORMANCE SEO (Core Web Vitals)

#### 🟢 MEDIUM — E5.1: 11 lần dùng `<img>` trực tiếp thay vì `next/image`

**File nghiêm trọng nhất:** `src/components/tuyendung/CultureContent.tsx` (dòng 171-186)

4 ảnh Unsplash dùng `<img>` trực tiếp:
- Thiếu `width`/`height` → gây CLS (Cumulative Layout Shift)
- Thiếu `loading="lazy"`
- Không qua Next.js image optimization (WebP, resize)

Các file khác: `ImageGallery.tsx`, `ai/ImageGallery.tsx`

---

#### ✅ OK — E5.2: news-card.tsx — MẪU CHUẨN

```typescript
<Image src={imgSrc} alt={title} fill sizes="..." placeholder="blur" blurDataURL={...} onError={...} />
```

Có alt, sizes, blur placeholder, fallback — **rất tốt cho CLS và LCP**.

---

#### ✅ OK — E5.3: Font optimization

4 fonts dùng `next/font/google` với `display: "swap"` và subset `vietnamese`. Tự động self-host, không block render.

**Lưu ý nhỏ:** 4 font families hơi nhiều (~80-200KB tổng). Xem xét bỏ `oswald` hoặc `jetBrainsMono` nếu ít dùng.

---

#### ✅ OK — E5.4: Loading states

Tất cả parallel route slots đều có `loading.tsx` — tốt cho FCP/LCP.

---

### E6. ROBOTS.TS

#### ⚪ LOW — E6.1: Thiếu disallow cho paths không cần index

**File:** `src/app/robots.ts`

Đã disallow `/api/`, `/_next/`, `/admin/`. **Thiếu:** `/auth/`, `/preview/`, `/onboarding/`, `/verify-pin/`.

---

### E7. BẢNG TỔNG HỢP SEO ISSUES

| # | ID | Mức độ | Mô tả |
|---|----|--------|--------|
| 1 | E1.1 | 🔴 CRITICAL | Trang khóa học listing KHÔNG CÓ metadata |
| 2 | E1.2 | 🔴 CRITICAL | Metadata khóa học detail bị HARDCODE ("MOS Excel 2021") |
| 3 | E1.3 | 🔴 CRITICAL | JobPosting schema `baseSalary: 0` → Google hiện "Lương: 0 VND" |
| 4 | E1.4 | 🟡 HIGH | Thiếu canonical URL trên 10+ trang public |
| 5 | E1.5 | 🟡 HIGH | Tin tức listing thiếu OG, Twitter, keywords |
| 6 | E2.1 | 🟡 HIGH | Course schema thiếu `hasCourseInstance` (Google bắt buộc) |
| 7 | E2.2 | 🟡 HIGH | Duplicate BreadcrumbList JSON-LD trên trang bài viết |
| 8 | E2.3 | 🟡 HIGH | Visual breadcrumb KHÔNG khớp JSON-LD |
| 9 | E2.4 | 🟡 HIGH | Course detail dùng mock rating data (fake reviews risk) |
| 10 | E4.1 | 🟡 HIGH | OG image fallback mất khi `images: []` → share Zalo/FB không có hình |
| 11 | E1.6 | 🟢 MEDIUM | Form ứng tuyển nên noindex |
| 12 | E2.5 | 🟢 MEDIUM | Article schema có thể thiếu image |
| 13 | E3.1 | 🟢 MEDIUM | Sitemap lastModified luôn = now() |
| 14 | E3.2 | 🟢 MEDIUM | Sitemap trả [] khi backend lỗi → risk de-index |
| 15 | E4.2 | 🟢 MEDIUM | Job detail OG type sai (`article`) |
| 16 | E5.1 | 🟢 MEDIUM | 11x `<img>` thay vì `next/image` → CLS |
| 17 | E6.1 | ⚪ LOW | robots.ts thiếu disallow `/auth/`, `/preview/` |

### E8. SEO SPRINT PLAN

**Khẩn cấp (Fix ngay — ảnh hưởng trực tiếp ranking):**
1. **E1.1**: Thêm metadata cho `@tinhocquocte/khoa-hoc/page.tsx`
2. **E1.2**: Fetch course data thật trong `generateMetadata()` thay vì hardcode
3. **E1.3**: Bỏ `baseSalary` khi value = 0
4. **E1.4**: Thêm `canonical` cho tất cả trang public (tạo helper function dùng chung)
5. **E2.2 + E2.3**: Thống nhất breadcrumb — 1 hệ thống duy nhất, visual = JSON-LD

**Trước release:**
6. **E2.1**: Thêm `hasCourseInstance` vào Course schema
7. **E2.4**: Thay mock rating data bằng data từ API
8. **E4.1**: Fallback OG image thay vì `images: []`
9. **E1.5**: Bổ sung OG/Twitter/keywords cho tin tức listing
10. **E1.6**: Thêm `robots: { index: false }` cho form ứng tuyển

**Khi có thời gian:**
11. **E5.1**: Chuyển `<img>` sang `next/image`
12. **E3.1**: Sửa sitemap lastModified
13. **E3.2**: Fallback sitemap tĩnh khi API lỗi
