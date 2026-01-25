# 🐛 Debug: Login 404 Issue

**Issue:** Login API returning 404 Not Found  
**URL thực tế:** `http://admin.erg.edu.local:3001/login/api/auth/login`  
**URL mong đợi:** `http://admin.erg.edu.local:3001/api/auth/login`

---

## 🔍 Root Cause

**Vấn đề:** URL bị thêm `/login` prefix → `/login/api/auth/login`

**Nguyên nhân:** Logic transform URL trong `httpClient.ts` có thể không đủ rõ ràng

---

## ✅ Giải pháp

### 1. Cập nhật httpClient.ts

**Logic mới (rõ ràng hơn):**

```typescript
// Transform endpoint to always start with /api/
let url: string;
if (endpoint.startsWith('/api/')) {
    // Already has /api/ prefix → keep as is
    url = endpoint;
} else if (endpoint.startsWith('/')) {
    // Has / but not /api/ → add /api prefix
    url = `/api${endpoint}`;
} else {
    // No leading / → add /api/ prefix
    url = `/api/${endpoint}`;
}

console.log('[httpClient] Endpoint:', endpoint, '→ URL:', url);
```

**Ví dụ:**
```
Input: '/auth/login'     → Output: '/api/auth/login' ✅
Input: 'auth/login'      → Output: '/api/auth/login' ✅
Input: '/api/auth/login' → Output: '/api/auth/login' ✅
```

### 2. URL là Absolute Path

Với `/api/auth/login`, browser sẽ request đến:
```
Current page: http://admin.erg.edu.local:3001/login
Request URL:  http://admin.erg.edu.local:3001/api/auth/login ✅
```

**NOT:**
```
Request URL: http://admin.erg.edu.local:3001/login/api/auth/login ❌
```

---

## 🧪 Testing

### 1. Clear browser cache
```
Cmd+Shift+R (Mac) hoặc Ctrl+Shift+R (Windows)
```

### 2. Check Console logs
Mở DevTools Console, bạn sẽ thấy:
```
[httpClient] Endpoint: /auth/login → URL: /api/auth/login
```

### 3. Check Network tab
Request URL should be:
```
http://admin.erg.edu.local:3001/api/auth/login
```

---

## 📋 Debug Checklist

- [x] Cập nhật httpClient.ts với logic rõ ràng hơn
- [x] Thêm console.log để debug
- [ ] Clear browser cache & reload
- [ ] Test login lại
- [ ] Check Network tab xem URL đúng chưa
- [ ] Nếu vẫn lỗi, check Next.js rewrites config

---

## 🔧 If Still 404

**Kiểm tra Next.js rewrites:**

```typescript
// next.config.ts
async rewrites() {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3000';
    
    return [
        {
            source: '/api/:path*',
            destination: `${backendUrl}/api/:path*`,
        },
    ];
}
```

**Test rewrites:**
```bash
curl http://localhost:3001/api/auth/ping
```

Should forward to:
```
http://localhost:3000/api/auth/ping
```

---

## 📝 Expected Console Log

```
[httpClient] Endpoint: /auth/login → URL: /api/auth/login
POST /api/auth/login
Request URL: http://admin.erg.edu.local:3001/api/auth/login
Status: 200 OK (hoặc 401 nếu sai mật khẩu)
```

---

**Next step:** Reload browser và test login lại!
