# FE Integration Guide — ERG Backend v2026-03

Mọi thay đổi từ phía BE mà FE cần biết để tích hợp.

---

## 1. Security & Anti-Abuse

### 1.1 Rate Limiting — 3-Layer Protection (NEW)

Backend có **SmartRateLimitGuard** chạy ở tầng application. FE **KHÔNG CẦN thay đổi gì** — BE tự chặn. Nhưng cần handle response `429`:

```typescript
// Interceptor Axios để handle rate limit
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 429) {
      const retryAfter = error.response.headers['retry-after'];
      const waitMs = retryAfter ? parseInt(retryAfter) * 1000 : 60_000;
      toast.error(`Quá nhiều yêu cầu. Vui lòng chờ ${Math.ceil(waitMs / 1000)}s`);
      return new Promise((resolve) =>
        setTimeout(() => resolve(axios.request(error.config)), waitMs)
      );
    }
    return Promise.reject(error);
  }
);
```

**Rate limit headers** — thêm vào **mọi response** khi endpoint có `@ApplyRateLimit`:

```
# Khi dùng perIp:
X-RateLimit-Limit: 30          // max requests trong window
X-RateLimit-Remaining: 27       // còn lại
X-RateLimit-Reset: 1742995200  // unix timestamp (giây)

# Khi dùng perUser:
X-RateLimit-User-Limit: 10
X-RateLimit-User-Remaining: 8
X-RateLimit-User-Reset: 1742995200

# Khi dùng perIpUser:
X-RateLimit-IpUser-Limit: 5
X-RateLimit-IpUser-Remaining: 3
X-RateLimit-IpUser-Reset: 1742995200
```

> Headers chỉ xuất hiện khi endpoint đó có khai báo `@ApplyRateLimit()`. Không phải endpoint nào cũng có đủ 3 loại — tùy vào config.

### 1.2 Auth — 3-Layer Login Protection

| Layer | Giới hạn | Ghi chú |
|-------|---------|---------|
| `perIp` | 30 lần / 15 phút / IP | Team 10 người cùng office OK |
| `perUser` | 10 lần / 15 phút / account | Chặn brute force 1 account |
| `perIpUser` | 5 lần / 15 phút / IP+account | Chặt nhất |

**FE cần hiển thị thông báo khi bị chặn:**

```typescript
// Khi login nhận 429
if (error.response?.data?.retryAfter) {
  const seconds = error.response.data.retryAfter;
  showMessage(`Đã đăng nhập sai quá nhiều lần. Thử lại sau ${seconds} giây.`);
} else if (error.response?.data?.message?.includes('Too many requests')) {
  showMessage('Quá nhiều yêu cầu. Vui lòng đợi một chút.');
}
```

### 1.3 Reviews — Anti-Spam (NEW)

- **Cooldown 60 giây** giữa 2 lần submit review cùng 1 IP + targetId
- **Duplicate check**: 1 user chỉ submit 1 review cho 1 item
- **Auto PENDING**: Tất cả reviews mới đều ở trạng thái `PENDING`, chờ duyệt

```typescript
// Response khi submit review
{
  statusCode: 201,
  data: {
    id: "...",
    status: "PENDING",  // ← MỚI: Luôn là PENDING
    message: "Review đã được gửi và đang chờ duyệt"
  }
}
```

### 1.4 Crawler — Protected by Auth + RBAC (NEW)

Tất cả `/api/crawler/**` endpoints giờ **yêu cầu JWT token** + permission:

| Permission | Allowed actions |
|------------|----------------|
| `posts.read` | Xem feeds, configs, history, stats |
| `posts.create` | Sync RSS, crawl URL, tạo feed |
| `posts.update` | Chỉnh sửa feed/config |
| `posts.delete` | Xóa feed/config |
| `system.settings` | Quản lý scraper configs |

---

## 2. Analytics (Major Changes)

### 2.1 JWT Token Anti-Spoof (SECURITY FIX)

**TRƯỚC (có lỗ hổng):** FE gửi token → BE `decode()` → lấy userId → không xác minh chữ ký

**SAU (bảo mật):** BE `verify()` token với secret → mới lấy userId

```typescript
// FE: KHÔNG thay đổi cách gọi
// Nhưng cần đảm bảo token trong Authorization header là token thật
headers: { Authorization: `Bearer ${accessToken}` }

// Nếu token hết hạn → server trả 401 → FE redirect login
if (error.response?.status === 401) {
  redirectToLogin();
}
```

### 2.2 IP Extraction (Cloudflare + Nginx)

Backend tự động lấy IP thực từ headers. FE **KHÔNG CẦN gửi IP** trong body:

```typescript
// TRƯỚC: FE gửi ip trong body
body: { url: '/posts/xxx', ip: '103.x.x.x' }  // ← KHÔNG CẦN NỮA

// SAU: FE chỉ gửi
body: { url: '/posts/xxx', referrer: document.referrer }
```

### 2.3 Duration Cap — Max 1 giờ (SECURITY)

`PUT /api/insight/session/:id/finish` — backend cap `duration` tối đa 3600 giây. FE không cần thay đổi.

### 2.4 Dashboard Stats — MongoDB Aggregation (PERFORMANCE)

`GET /api/insight/stats` và `GET /api/insight/overview` giờ dùng MongoDB aggregation — response shape giữ nguyên, performance cải thiện.

---

## 3. Auth Flow Changes

### 3.1 Login — 3-Layer Rate Limit Response

```typescript
// Khi bị chặn, response có dạng:
{
  statusCode: 429,
  message: 'Too many login attempts from this location. Please try a different device or wait.',
  error: 'Rate limit exceeded',
  retryAfter: 847   // seconds
}
```

### 3.2 Password Change — Sessions Bị Revoke

Khi user đổi password → **TẤT CẢ sessions bị xóa** (DB + Redis cache). User phải đăng nhập lại trên mọi thiết bị.

```typescript
// FE nên handle: sau khi đổi password thành công
// → Clear local token
// → Redirect về login với message
{ message: "Đổi mật khẩu thành công. Vui lòng đăng nhập lại." }
```

### 3.3 User Block/Ban — Sessions Bị Revoke

Khi admin block/ban user → sessions bị xóa → user bị đẩy ra logout.

---

## 4. SEO — Real Analysis (NEW)

### 4.1 `analyze()` giờ trả về Score Thật

**TRƯỚC:**
```json
{ "score": 0, "readabilityScore": 0, "keywordDensity": 0 }
```

**SAU:**
```json
{
  "score": 72,
  "readabilityScore": 68,
  "keywordDensity": 2.3
}
```

**Cách tính score:**
- Content length: 0-30 điểm
- Keyword density: 0-30 điểm (tối ưu 1.5-3.5%)
- Headings structure: 0-20 điểm (H2≥3 + H3≥2 = max)
- Readability: 0-20 điểm (Flesch 60-80 = max)

**FE cần update UI hiển thị score thật** thay vì hardcoded 0.

### 4.2 AI Content Generation — `seoScore` Được Tính

Khi AI tạo content xong, backend tự động tính SEO score:

```typescript
// AI generation result giờ có:
{
  seoScore: 72,           // ← MỚI: được tính từ analyze()
  readabilityScore: 68,   // ← MỚI
  keywordDensity: 2.3     // ← MỚI
}
```

---

## 5. N+1 Fixes — Performance Improvements

### 5.1 Crawler — Batch Processing

`POST /api/crawler/rss/:id/sync` giờ:
- Batch query history + posts thay vì loop
- Bulk add queue items thay vì từng cái
- **Response time cải thiện đáng kể cho feeds > 20 items**

### 5.2 GSC Sync — Bulk Upsert

`POST /api/seo/gsc/sync` giờ dùng `persist()` + `flush()` batch thay vì insert/update tuần tự.

---

## 6. Swagger — Production Disabled

**Swagger UI chỉ available trong development (`NODE_ENV != production`)**

```typescript
// Development: http://localhost:3003/api-docs ✅
// Production: http://erg.edu.vn/api-docs → 403 Forbidden ❌
```

FE/DevOps: **Không có thay đổi cần thiết**, chỉ cần biết Swagger bị ẩn trên production.

---

## 7. Health Check Endpoints (NEW)

Hai endpoints mới cho monitoring:

| Endpoint | Purpose | Auth |
|----------|---------|------|
| `GET /api/health` | Liveness probe (Docker, Nginx) | Public |
| `GET /api/ready` | Readiness probe (DB + Redis check) | Public |

```json
// GET /api/health
{
  "status": "ok",
  "timestamp": "2026-03-26T00:00:00.000Z",
  "uptime": 3600,
  "instance": "erg-backend-1",
  "memory": { "used": 120, "total": 512, "unit": "MB" },
  "version": "1.0.0"
}

// GET /api/ready
{
  "status": "ready",
  "timestamp": "2026-03-26T00:00:00.000Z",
  "checks": { "app": true, "db": true, "redis": true }
}
```

---

## 8. Global Response Format — Unchanged

Tất cả responses vẫn wrap trong `ApiResponse<T>`:

```typescript
// Response structure (KHÔNG THAY ĐỔI)
{
  statusCode: 200,
  message: 'Success message',
  data: { ... }
}

// Error responses (KHÔNG THAY ĐỔI)
{
  statusCode: 400,
  message: 'Error description',
  error: 'Bad Request'
}
```

---

## 9. Nginx Layer (Infrastructure)

Đã setup rate limiting ở tầng Nginx:

| Endpoint Pattern | Limit |
|-----------------|-------|
| `/api/auth/(login\|register\|...)` | 2 req/s burst 10 |
| `/api/auth/(refresh\|logout)` | 5 req/s burst 20 |
| `/api/posts\|recruitment\|...` (read) | 30 req/s burst 50 |
| `/api/insight/session\|behavior` | 30 req/s burst 100 |
| `/api/posts/images` (upload) | 5 req/s burst 10 |
| `/api/health` | Exempt (no limit) |

**FE cần handle 429 từ Nginx (không có retry-after header):**

```typescript
// Nginx trả 429 không có body chi tiết
if (error.response?.status === 429) {
  toast.error('Quá nhiều yêu cầu. Vui lòng chờ vài giây.');
  return retryWithBackoff(request, maxRetries: 3);
}
```

---

## 10. Axios Interceptor Đầy Đủ (FE cần implement)

```typescript
// src/api/interceptors/response.interceptor.ts
import axios from 'axios';

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;

    // 1. Rate limit — retry với backoff
    if (response?.status === 429) {
      const retryAfter = response.headers['retry-after'];
      const waitMs = retryAfter
        ? parseInt(retryAfter) * 1000
        : 60_000;

      toast.error(`Quá nhiều yêu cầu. Vui lòng chờ ${Math.ceil(waitMs / 1000)}s`);

      config._retryCount = (config._retryCount || 0) + 1;
      if (config._retryCount < 3) {
        await new Promise((r) => setTimeout(r, waitMs));
        return axios(config);
      }
    }

    // 2. 401 — refresh token hoặc logout
    if (response?.status === 401) {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const { data } = await axios.post('/api/auth/refresh');
          localStorage.setItem('access_token', data.data.accessToken);
          config.headers['Authorization'] = `Bearer ${data.data.accessToken}`;
          return axios(config);
        } catch {
          localStorage.clear();
          window.location.href = '/login?expired=1';
        }
      }
    }

    // 3. 500 server error
    if (response?.status >= 500) {
      toast.error('Lỗi server. Vui lòng thử lại sau.');
    }

    return Promise.reject(error);
  }
);
```

---

## 11. TÓM TẮT — BREAKING CHANGES

| # | Change | Breaking? | Action Required |
|---|--------|-----------|----------------|
| 1 | Reviews luôn PENDING | ⚠️ | FE hiển thị "đang chờ duyệt" |
| 2 | Login có thể bị 429 | ⚠️ | Handle 429 + retry message |
| 3 | Swagger ẩn prod | ✅ | Dùng Postman/Swagger local |
| 4 | Health endpoints mới | ✅ | Update monitoring configs |
| 5 | IP không cần gửi trong analytics body | ✅ | Bỏ `ip` field khỏi body |
| 6 | SEO score thật thay vì 0 | ✅ | Update score display UI |
| 7 | Crawler cần JWT | ⚠️ | Đảm bảo token hợp lệ |
| 8 | Password change → logout mọi device | ⚠️ | Clear token + redirect login |

---

## 12. Migration Checklist for FE

```markdown
## Pre-Deploy FE Checklist

- [ ] Thêm interceptor handle HTTP 429 (rate limit)
- [ ] Thêm interceptor handle HTTP 401 (auto refresh + logout)
- [ ] Cập nhật review UI: hiển thị "PENDING" sau khi submit
- [ ] Bỏ `ip` field khỏi analytics track body
- [ ] Cập nhật SEO score display: hiển thị số thật (0-100)
- [ ] Gỡ Swagger URL khỏi production bookmarks
- [ ] Thêm `/api/health` vào monitoring tool
- [ ] Test login 3 lần liên tiếp → kiểm tra 429 response
- [ ] Test đổi password → verify logout mọi device
```
