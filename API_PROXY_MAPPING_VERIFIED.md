# 🗺️ API Proxy Mapping (Final Verified)

Dưới đây là bảng ánh xạ (mapping) cách Next.js Proxy xử lý các requests từ Frontend đến Backend.

**Base Config:**
- **Frontend Prefix:** `/api/*`
- **Backend URL:** `http://localhost:3000` (Dev) hoặc `https://api.erg.edu.vn` (Prod)

---

## 1. Analytics & Insight (New Backend)
**Quy tắc:** Giữ nguyên prefix `/api/insight`

| Service | Frontend Call | Proxy Destination | Backend Endpoint | Status |
|---------|---------------|-------------------|------------------|--------|
| Analytics | `/api/insight/session` | → | `/api/insight/session` | ✅ Correct |
| Analytics | `/api/insight/behavior` | → | `/api/insight/behavior` | ✅ Correct |
| Analytics | `/api/insight/overview` | → | `/api/insight/overview` | ✅ Correct |
| Analytics | `/api/insight/stats` | → | `/api/insight/stats` | ✅ Correct |

---

## 2. Legacy Services (Old Backend)
**Quy tắc:** Bỏ prefix `/api` (Chuyển `/api/zzz` thành `/zzz`)

### 🔐 Auth Service (`auth.api.ts`)
| Frontend Call | Proxy Destination | Backend Endpoint | Status |
|---------------|-------------------|------------------|--------|
| `/api/auth/login` | → | `/auth/login` | ✅ Correct |
| `/api/auth/register` | → | `/auth/register` | ✅ Correct |
| `/api/auth/refresh` | → | `/auth/refresh` | ✅ Correct |
| `/api/auth/logout` | → | `/auth/logout` | ✅ Correct |
| `/api/auth/forgot-password` | → | `/auth/forgot-password` | ✅ Correct |

### 👤 User Service (`users.api.ts`)
| Frontend Call | Proxy Destination | Backend Endpoint | Status |
|---------------|-------------------|------------------|--------|
| `/api/users/me` | → | `/users/me` | ✅ Correct |
| `/api/users/me/sessions` | → | `/users/me/sessions` | ✅ Correct |
| `/api/users/onboarding` | → | `/users/onboarding` | ✅ Correct |

### 📝 Posts Service (`posts.api.ts`)
| Frontend Call | Proxy Destination | Backend Endpoint | Status |
|---------------|-------------------|------------------|--------|
| `/api/posts` | → | `/posts` | ✅ Correct |
| `/api/posts/123` | → | `/posts/123` | ✅ Correct |

### 🔑 Sessions Service (`sessions.api.ts`)
| Frontend Call | Proxy Destination | Backend Endpoint | Status |
|---------------|-------------------|------------------|--------|
| `/api/sessions/current` | → | `/sessions/current` | ✅ Correct |

### 🤖 AI Service (`ai.api.ts`)
| Frontend Call | Proxy Destination | Backend Endpoint | Status |
|---------------|-------------------|------------------|--------|
| `/api/ai-content/generate` | → | `/ai-content/generate` | ✅ Correct |
| `/api/ai-content/status` | → | `/ai-content/status` | ✅ Correct |

---

## ⚙️ Next.js Config Verification

File: `next.config.ts`

```typescript
async rewrites() {
    return [
        // 1. Priority Rule: Insight API (KEEP /api prefix)
        {
            source: '/api/insight/:path*',
            destination: `${backendUrl}/api/insight/:path*`, 
        },

        // 2. Fallback Rule: All other APIs (REMOVE /api prefix)
        {
            source: '/api/:path*',
            destination: `${backendUrl}/:path*`, 
        },
    ];
}
```

## 🧪 Cách Test Nhanh

1. **Test Insight:**
   `curl http://localhost:3001/api/insight/overview`  
   → Forward to `http://localhost:3000/api/insight/overview`

2. **Test Auth:**
   `curl -X POST http://localhost:3001/api/auth/login`  
   → Forward to `http://localhost:3000/auth/login`

---
**Kết luận:** Cấu hình hiện tại đã **CHÍNH XÁC** với cấu trúc source code hiện tại.
