# Chi tiết THAY ĐỔI API — ERG Backend v2026-03

> File này ghi nhận **CHÍNH XÁC** những gì THAY ĐỔI ở cấp API (request/response) so với trước đây.
> Những thứ chỉ là backend-internal (performance, security) — FE không cần biết — sẽ ghi chú riêng.

---

## 1. Reviews — Breaking Change

### `POST /api/reviews` — Submit Review

**THAY ĐỔI:** Review mới luôn ở trạng thái `PENDING`, không publish ngay.

```typescript
// Request: KHÔNG THAY ĐỔI
body: {
  targetId: string;    // post/course/page ID
  targetType: string;   // 'post' | 'course' | 'page'
  rating: 1 | 2 | 3 | 4 | 5;
  content: string;
}

// Response TRƯỚC:
{ statusCode: 201, data: { id: "...", status: "PUBLISHED" } }

// Response SAU:
{ statusCode: 201, data: { id: "...", status: "PENDING" } }
// ⚠️ FE cần hiển thị: "Review của bạn đã được gửi và đang chờ duyệt"
```

**THAY ĐỔI:** Anti-spam — có thể nhận 429 Too Many Requests:

```typescript
// Khi bị chặn rate limit:
{ statusCode: 429, message: "Too many review submissions from this location." }
```

---

## 2. Auth — Rate Limiting Responses Mới

### `POST /api/auth/login`

**THAY ĐỔI:** Có thể bị chặn với HTTP 429:

```typescript
// Response khi bị rate limit:
{
  statusCode: 429,
  message: "Too many requests from IP 103.x.x.x. Try again in 847s."
  // hoặc
  message: "Too many login attempts from this location."
  error: "Rate limit exceeded"
  retryAfter: 847   // seconds
}
```

### `POST /api/auth/register`

**THAY ĐỔI:** Có thể bị chặn:

```typescript
// Bị rate limit (quá nhiều đăng ký từ cùng email hoặc IP):
{ statusCode: 429, message: "Too many requests for this account." }
```

### `POST /api/auth/verify-pin`

**THAY ĐỔI:** Giờ nhận thêm IP và User-Agent (BE dùng để log):

```typescript
// Request: KHÔNG THAY ĐỔI — BE tự lấy từ decorator
body: { email: string; pin: string }

// Response: THÊM ip/ua vào activity log — không ảnh hưởng response
```

### `POST /api/auth/forgot-password`, `POST /api/auth/reset-password`

**THAY ĐỔI:** Có thể bị 429:

```typescript
{ statusCode: 429, message: "Too many requests for this account." }
```

---

## 3. Analytics — IP Không Cần Gửi Nữa

### `POST /api/insight/session/begin`

**THAY ĐỔI:** Bỏ `ip` khỏi request body — BE tự extract IP từ headers.

```typescript
// Request TRƯỚC:
body: { url: string; ip: string; referrer?: string; entityId?: string; entityType?: string }

// Request SAU:
body: { url: string; referrer?: string; entityId?: string; entityType?: string }
// ✅ Bỏ: ip — BE tự lấy từ X-Forwarded-For / CF-Connecting-IP / req.ip

// Response: KHÔNG THAY ĐỔI
{ data: { visitId: string; sessionId: string } }
```

**THAY ĐỔI:** JWT token được VERIFY thay vì DECODE (bảo mật — không ảnh hưởng FE).

### `POST /api/insight/behavior`

**THAY ĐỔI:** Tương tự — không cần `ip`:

```typescript
// Request TRƯỚC: { eventType, metadata, sessionInternalId, ip? }
// Request SAU:  { eventType, metadata, sessionInternalId }
// ✅ Bỏ: ip
```

### `PUT /api/insight/session/:id/finish`

**THAY ĐỔI:** `duration` bị cap tối đa 3600 giây (1 tiếng):

```typescript
// Nếu FE gửi duration > 3600:
backend: cappedDuration = Math.min(duration, 3600)
// FE KHÔNG cần thay đổi gì — BE tự lo
```

---

## 4. Crawler — Cần JWT Token

### TẤT CẢ `/api/crawler/**` Endpoints

**THAY ĐỔI:** Trước đây có thể gọi không cần auth. Giờ **BẮT BUỘC JWT token**:

```typescript
// Tất cả crawler endpoints cần header:
headers: { Authorization: `Bearer ${accessToken}` }

// Nếu không có token hoặc hết hạn:
{ statusCode: 401, message: "Unauthorized" }
```

| Endpoint | Permission cần |
|----------|---------------|
| `GET /crawler/rss/peek/:id` | `posts.read` |
| `POST /crawler/rss/trigger` | `posts.create` |
| `POST /crawler/url/run` | `posts.create` |
| `POST /crawler/rss` | `posts.create` |
| `PATCH /crawler/rss/:id` | `posts.update` |
| `DELETE /crawler/rss/:id` | `posts.delete` |
| `GET /crawler/configs` | `system.settings` |
| `POST /crawler/configs` | `system.settings` |
| `PATCH /crawler/configs/:id` | `system.settings` |
| `DELETE /crawler/configs/:id` | `system.settings` |

---

## 5. AI Content Generation — SEO Score Mới

### `POST /api/ai-content/generate`

**THAY ĐỔI:** AI generation giờ tính SEO score thật (trước đây luôn là 0):

```typescript
// Khi job hoàn thành, response từ:
// GET /api/ai-content/status/:jobId

// TRƯỚC:
{ status: "completed", seoScore: 0, readabilityScore: 0, keywordDensity: 0 }

// SAU:
{ status: "completed", seoScore: 72, readabilityScore: 65, keywordDensity: 2.3 }
// ✅ Score được tính từ content thật
```

---

## 6. Health Endpoints — MỚI

### `GET /api/health` — Liveness Probe (NEW)

```typescript
// Response:
{
  status: "ok",
  timestamp: "2026-03-26T00:00:00.000Z",
  uptime: 3600,
  instance: "erg-backend-1",
  memory: { used: 120, total: 512, unit: "MB" },
  version: "1.0.0"
}
```

### `GET /api/ready` — Readiness Probe (NEW)

```typescript
// Response:
{
  status: "ready",   // hoặc "degraded" nếu có service down
  timestamp: "2026-03-26T00:00:00.000Z",
  checks: { app: true, db: true, redis: true }
}
```

> FE: Không ảnh hưởng — chỉ dùng cho monitoring/DevOps

---

## 7. Rate Limit Headers — MỚI Trong Mọi Response

**THAY ĐỔI:** Tất cả responses từ BE giờ có thêm headers:

```
# perIp — luôn có khi endpoint có rate limit:
X-RateLimit-Limit: 30
X-RateLimit-Remaining: 27
X-RateLimit-Reset: 1742995200

# perUser — có khi endpoint có khai báo perUser:
X-RateLimit-User-Limit: 10
X-RateLimit-User-Remaining: 8
X-RateLimit-User-Reset: 1742995200

# perIpUser — có khi endpoint có khai báo perIpUser:
X-RateLimit-IpUser-Limit: 5
X-RateLimit-IpUser-Remaining: 3
X-RateLimit-IpUser-Reset: 1742995200
```

> Headers xuất hiện tùy theo config của endpoint — không phải endpoint nào cũng đủ 3 loại.

> FE có thể đọc headers này để hiển thị "còn X requests" cho user nếu muốn.

---

## 8. Global HTTP 429 Handling

### Khi BE trả 429:

```typescript
// Từ Nginx layer (không có body chi tiết):
HTTP 429 (empty body)

// Từ App layer SmartRateLimitGuard:
{
  statusCode: 429,
  message: "Too many requests from IP x.x.x.x. Try again in Xs.",
  error: "Rate limit exceeded",
  retryAfter: 847
}
```

**FE nên handle:**

```typescript
// Axios interceptor
if (error.response?.status === 429) {
  const retryAfter = error.response.headers['retry-after'];
  const waitMs = retryAfter
    ? parseInt(retryAfter) * 1000
    : 60_000; // fallback 60s

  toast.error(`Quá nhiều yêu cầu. Vui lòng chờ ${Math.ceil(waitMs / 1000)}s.`);
  // Có thể retry tự động sau:
  // setTimeout(() => retryRequest(error.config), waitMs);
}
```

---

## 9. CORS — Không Thay Đổi

CORS config giữ nguyên. FE vẫn gửi requests như cũ.

---

## 10. Swagger — Ẩn Trên Production

**THAY ĐỔI:**

```
Development: http://localhost:3003/api-docs     ✅ Hoạt động
Production:  https://erg.edu.vn/api-docs         ❌ 403 Forbidden
```

FE/Dev: Không cần thay đổi gì — chỉ cần biết Swagger không có trên production.

---

## 11. Password Change — Sessions Bị Revoke

**THAY ĐỔI:** Khi user đổi password → tất cả sessions bị xóa → user phải đăng nhập lại trên mọi thiết bị.

```typescript
// FE nên handle: sau khi đổi password thành công
// → Clear local token
// → Redirect về login với message
{ message: "Đổi mật khẩu thành công. Vui lòng đăng nhập lại." }
```

---

## 12. Session /api/sessions/current — Không Thay ĐỔI

Endpoint này **không thay đổi gì**. FE vẫn dùng bình thường.

---

## TÓM TẮT — BREAKING CHANGES

| # | API | Type | Action Required |
|---|-----|------|----------------|
| 1 | `POST /reviews` | ⚠️ | Hiển thị "PENDING" sau submit |
| 2 | `POST /auth/login` | ⚠️ | Handle HTTP 429 + retry message |
| 3 | `POST /auth/register` | ⚠️ | Handle HTTP 429 |
| 4 | `POST /insight/session/begin` | ✅ | Bỏ `ip` khỏi body |
| 5 | `POST /insight/behavior` | ✅ | Bỏ `ip` khỏi body |
| 6 | `PUT /insight/session/:id/finish` | ✅ | Backend tự cap duration ≤ 3600s |
| 7 | `GET /api/health` | ✅ | Mới — cho monitoring |
| 8 | `GET /api/ready` | ✅ | Mới — cho monitoring |
| 9 | `GET /api/ai-content/status/:id` | ✅ | SEO score giờ có giá trị thật |
| 10 | `/api/crawler/**` | ⚠️ | Cần JWT + permission |
| 11 | Response headers | ✅ | Có thêm `X-RateLimit-*` |
| 12 | Swagger URL | ✅ | Ẩn trên production |
| 13 | `PUT /users/me/password` | ⚠️ | Sau thành công → logout mọi device |

**Legend:**
- ⚠️ = Breaking change — cần FE thay đổi code
- ✅ = Non-breaking — FE có thể tận dụng hoặc không cần quan tâm

---

## 14. Go Backend Parity (Monolith Integration)

**THAY ĐỔI:** Go Monolith (`erg-go`) giờ trả về response đồng nhất với NestJS Backend Gateway.

### Global Response Envelope

Tất cả responses từ Go hiện tại đều có cấu trúc:
```typescript
{
  statusCode: number;
  message: string;
  data: T | null;
  errors: any;
  timestamp: string;
  path: string;
  requestId: string;
}
```

### CamelCase Migration

**QUAN TRỌNG:** Tất cả JSON tags trong Go đã được chuyển từ `snake_case` sang `camelCase`.

```typescript
// TRƯỚC:
{ "user_id": "...", "full_name": "...", "access_token": "..." }

// SAU:
{ "userId": "...", "fullName": "...", "accessToken": "..." }
```

### Pagination Standard

Các endpoint danh sách trong Go hiện trả về:
```typescript
{
  data: {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }
}
```

### Trending Module Auth

**THAY ĐỔI:** Các routes `/api/trending/*` giờ yêu cầu JWT Token:
```typescript
headers: { Authorization: `Bearer ${accessToken}` }
```

> FE: Sử dụng `httpClient` chuẩn sẽ tự động tương thích với các thay đổi này.
