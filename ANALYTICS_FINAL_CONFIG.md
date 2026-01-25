# ✅ Analytics Proxy - Final Configuration

**Cập nhật:** 2026-01-23 10:10 AM

---

## 🔄 Thay đổi chính

### 1. URL Path: `/api-proxy/*` → `/api/*`

**Lý do:** URL ngắn gọn và clean hơn

**Trước:**
```
/api-proxy/insight/session/begin
/api-proxy/insight/overview
```

**Sau:**
```
/api/insight/session/begin
/api/insight/overview
```

---

### 2. Environment Variables

**File mới:**
- `.env.development`
- `.env.production`

**Content:**
```bash
# .env.development
BACKEND_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000

# .env.production
BACKEND_URL=https://api.erg.edu.vn
NEXT_PUBLIC_API_URL=https://api.erg.edu.vn
```

---

### 3. next.config.ts

**Cập nhật line 8:**
```typescript
// TRƯỚC
const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// SAU
const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
```

**Cập nhật rewrites:**
```typescript
{
    source: '/api/:path*',  // Đã đổi từ /api-proxy/:path*
    destination: `${backendUrl}/api/:path*`,
}
```

---

### 4. analytics.api.ts

**Tất cả methods đổi URL:**

```typescript
// TRƯỚC
fetch('/api-proxy/insight/session/begin', ...)
httpClient('/api-proxy/insight/overview')

// SAU
fetch('/api/insight/session/begin', ...)
httpClient('/api/insight/overview')
```

---

### 5. use-page-tracking.ts

**Support cả visitId và sessionId:**

```typescript
// Backend có thể trả về sessionId HOẶC visitId
const id = response?.sessionId || response?.visitId;
if (id) {
    sessionIdRef.current = id;
}
```

---

## 🧪 Testing

### Test với curl

```bash
# Test overview
curl http://localhost:3001/api/insight/overview

# Test session begin
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"url":"http://localhost:3001/test","referrer":""}' \
  http://localhost:3001/api/insight/session/begin
```

### Test trong Browser

1. Mở Console
2. Vào trang bất kỳ
3. Xem log:
   ```
   [Tracker] Starting session: { url, referrer }
   [Tracker] Session started: 6972e59423d0b4ac9641e96b
   ```
4. Network tab:
   ```
   URL: http://localhost:3001/api/insight/session/begin
   Method: POST
   Status: 201 Created
   ```

---

## 📊 Request Flow

```
Frontend Browser
    ↓
    POST /api/insight/session/begin  (Same-Origin!)
    ↓
    Next.js Rewrites (đọc BACKEND_URL từ env)
    ↓
    POST http://localhost:3000/api/insight/session/begin
    ↓
    Backend Response: { visitId: "..." }
    ↑
    Frontend: ✅ Success
```

---

## 🔧 Configuration Summary

### Development
```
Frontend: http://localhost:3001
Backend: http://localhost:3000
Proxy: /api/* → http://localhost:3000/api/*
```

### Production
```
Frontend: https://erg.edu.vn
Backend: https://api.erg.edu.vn
Proxy: /api/* → https://api.erg.edu.vn/api/*
```

---

## ✅ Benefits

1. **Clean URLs:** `/api/*` thay vì `/api-proxy/*`
2. **Environment-based:** Dùng BACKEND_URL từ `.env` file
3. **Flexible:** Support cả `sessionId` và `visitId`
4. **Same-Origin:** Request vẫn bypass AdBlock 100%
5. **Production Ready:** Tự động dùng đúng backend URL

---

## 🚀 Deployment

**Development:**
```bash
yarn dev
# Tự động load .env.development
# BACKEND_URL=http://localhost:3000
```

**Production:**
```bash
yarn build
yarn start
# Tự động load .env.production
# BACKEND_URL=https://api.erg.edu.vn
```

---

## 📝 Files Updated

- ✅ `.env.development` (new)
- ✅ `.env.production` (new)
- ✅ `next.config.ts` (rewrites config)
- ✅ `src/services/analytics.api.ts` (all URLs)
- ✅ `src/hooks/use-page-tracking.ts` (support visitId/sessionId)

---

**Status:** ✅ READY TO TEST  
**Restart required:** Yes (dev server auto-restarted)
