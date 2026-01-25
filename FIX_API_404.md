# 🐛 Fix: 404 on API Calls (Removing /api prefix)

**Cập nhật:** 2026-01-23 10:30 AM

---

## 🔍 Vấn đề

API Login trả về **404 Not Found**.

**Nguyên nhân:**
- Proxy config cũ: `/api/:path*` → `BACKEND_URL/api/:path*`
- Request: `/api/auth/login`
- Forward đến: `http://localhost:3000/api/auth/login`
- **Backend thực tế:** `http://localhost:3000/auth/login` (Không có prefix `/api`)

---

## ✅ Giải pháp

**Cập nhật `next.config.ts`:**

```typescript
// TRƯỚC (Sai)
destination: `${backendUrl}/api/:path*`

// SAU (Đúng)
destination: `${backendUrl}/:path*`
```

---

## 🔄 Request Flow Mới

**1. Auth/User APIs:**
```
Frontend: /api/auth/login
Path captured: auth/login
Destination: http://localhost:3000/auth/login ✅
```

**2. Analytics APIs:**
```
Frontend: /api/insight/session
Path captured: insight/session
Destination: http://localhost:3000/insight/session
```
(*Lưu ý: Backend Analytics cần đảm bảo endpoint là `/insight/...` hoặc nếu backend analytics có `/api` thì cần điều chỉnh lại*)

---

## 🧪 Testing

1. Restart server (`yarn dev` auto restart)
2. Login lại
3. Check Network tab:
   - Request: `/api/auth/login`
   - Status: 200 OK (hoặc 401 nếu sai pass) chứ không phải 404.

Hãy reload browser và thử lại! 🚀
