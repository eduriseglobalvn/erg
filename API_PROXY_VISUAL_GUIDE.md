# 🎨 Visual Guide: API Proxy Architecture

## 📊 Before vs After

### ❌ BEFORE (Direct Backend Calls)

```
┌────────────────────────────────┐
│  Frontend (localhost:3001)     │
│                                │
│  • userApi.getMe()             │
│  • authApi.login()             │
│  • postsApi.getAll()           │
│  • analyticsApi.trackSession() │
│                                │
└────────┬───────────────────────┘
         │
         │ ❌ Cross-Origin Requests
         │ ❌ CORS Issues
         │ ❌ Blocked by AdBlock
         │
         ↓
┌────────┴───────────────────────┐
│  Backend (localhost:3000)      │
│                                │
│  • GET /api/users/me           │
│  • POST /api/auth/login        │
│  • GET /api/posts              │
│  • POST /api/insight/session   │
│                                │
└────────────────────────────────┘
```

**Problems:**
- ❌ CORS errors
- ❌ AdBlock blocks analytics
- ❌ Cross-origin security issues
- ❌ Need complex CORS config

---

### ✅ AFTER (Next.js Proxy)

```
┌────────────────────────────────────────────────────────┐
│  Frontend (localhost:3001)                             │
│                                                        │
│  • userApi.getMe()      → httpClient('/users/me')     │
│  • authApi.login()      → httpClient('/auth/login')   │
│  • postsApi.getAll()    → httpClient('/posts')        │
│  • analytics.track()    → fetch('/api/insight/...')   │
│                                                        │
└────────────┬───────────────────────────────────────────┘
             │
             │ ✅ Same-Origin!
             │ ✅ No CORS
             │ ✅ Bypass AdBlock
             ↓
┌────────────┴───────────────────────────────────────────┐
│  Next.js Server (localhost:3001)                       │
│                                                        │
│  Rewrites Engine:                                      │
│    source: /api/:path*                                 │
│    destination: BACKEND_URL/api/:path*                 │
│                                                        │
│  Transforms:                                           │
│    /api/users/me      → http://localhost:3000/api/...  │
│    /api/auth/login    → http://localhost:3000/api/...  │
│    /api/posts         → http://localhost:3000/api/...  │
│    /api/insight/...   → http://localhost:3000/api/...  │
│                                                        │
└────────────┬───────────────────────────────────────────┘
             │
             │ Backend Requests
             ↓
┌────────────┴───────────────────────────────────────────┐
│  Backend (localhost:3000)                              │
│                                                        │
│  • GET /api/users/me                                   │
│  • POST /api/auth/login                                │
│  • GET /api/posts                                      │
│  • POST /api/insight/session/begin                     │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Benefits:**
- ✅ Same-origin requests
- ✅ No CORS needed
- ✅ AdBlock bypassed
- ✅ Simple configuration

---

## 📈 Request Flow Diagram

```
┌─────────┐
│ Browser │
│  User   │
└────┬────┘
     │
     │ 1. Click "Login"
     ↓
┌────────────────────────────┐
│ React Component            │
│                            │
│ const login = async () => {│
│   await authApi.login()    │
│ }                          │
└────┬───────────────────────┘
     │
     │ 2. Call authApi.login({ email, password })
     ↓
┌────────────────────────────────────────┐
│ auth.api.ts                            │
│                                        │
│ httpClient('/auth/login', {            │
│   method: 'POST',                      │
│   body: JSON.stringify(data)           │
│ })                                     │
└────┬───────────────────────────────────┘
     │
     │ 3. httpClient transforms URL
     ↓
┌────────────────────────────────────────┐
│ http-client.ts                         │
│                                        │
│ const url = '/api/auth/login'         │
│ fetch(url, options)                    │
└────┬───────────────────────────────────┘
     │
     │ 4. fetch('/api/auth/login') - Same-Origin!
     ↓
┌────────────────────────────────────────┐
│ Browser Network                        │
│                                        │
│ Request URL: /api/auth/login           │
│ Request Domain: localhost:3001         │
│ Type: Same-Origin ✅                   │
└────┬───────────────────────────────────┘
     │
     │ 5. Next.js receives request
     ↓
┌────────────────────────────────────────┐
│ Next.js Rewrites (next.config.ts)     │
│                                        │
│ Match: /api/:path*                     │
│ Rewrite to:                            │
│   http://localhost:3000/api/auth/login│
└────┬───────────────────────────────────┘
     │
     │ 6. Forward to backend
     ↓
┌────────────────────────────────────────┐
│ Backend API (localhost:3000)           │
│                                        │
│ POST /api/auth/login                   │
│ Validate credentials                   │
│ Generate tokens                        │
└────┬───────────────────────────────────┘
     │
     │ 7. Response
     ↓
┌────────────────────────────────────────┐
│ Response                               │
│                                        │
│ {                                      │
│   "accessToken": "...",                │
│   "refreshToken": "...",               │
│   "user": { ... }                      │
│ }                                      │
└────┬───────────────────────────────────┘
     │
     │ 8. Response back through Next.js
     ↓
┌────────────────────────────────────────┐
│ Frontend Component                     │
│                                        │
│ localStorage.setItem('accessToken')    │
│ router.push('/dashboard')              │
└────────────────────────────────────────┘
```

---

## 🔄 Environment-Based Backend URL

```
┌─────────────────────────────────────┐
│ Development (.env.development)      │
│                                     │
│ BACKEND_URL=http://localhost:3000   │
└───────────┬─────────────────────────┘
            │
            │ yarn dev
            ↓
┌───────────┴─────────────────────────┐
│ Next.js Rewrites                    │
│                                     │
│ /api/* → localhost:3000/api/*       │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Production (.env.production)        │
│                                     │
│ BACKEND_URL=https://api.erg.edu.vn  │
└───────────┬─────────────────────────┘
            │
            │ yarn build && yarn start
            ↓
┌───────────┴─────────────────────────┐
│ Next.js Rewrites                    │
│                                     │
│ /api/* → api.erg.edu.vn/api/*       │
└─────────────────────────────────────┘
```

---

## 🌐 Production Architecture

```
┌─────────────────────────────────────────────────┐
│ USER BROWSER (anywhere in the world)           │
│                                                 │
│ https://erg.edu.vn                              │
└────────────┬────────────────────────────────────┘
             │
             │ All requests to /api/*
             ↓
┌────────────┴────────────────────────────────────┐
│ CDN / Edge Network                              │
│                                                 │
│ • Cache static assets                           │
│ • Route /api/* to Next.js server                │
└────────────┬────────────────────────────────────┘
             │
             ↓
┌────────────┴────────────────────────────────────┐
│ Next.js Server (erg.edu.vn)                     │
│                                                 │
│ Rewrites:                                       │
│   /api/* → https://api.erg.edu.vn/api/*         │
│                                                 │
│ Security:                                       │
│   • Rate limiting                               │
│   • Request validation                          │
│   • Header forwarding                           │
└────────────┬────────────────────────────────────┘
             │
             │ Backend API calls
             ↓
┌────────────┴────────────────────────────────────┐
│ Backend API Server (api.erg.edu.vn)             │
│                                                 │
│ • Process business logic                        │
│ • Database operations                           │
│ • Return JSON responses                         │
└─────────────────────────────────────────────────┘
```

---

## 🎯 Key Points

### 1. httpClient Transformation
```javascript
// Input from service
httpClient('/users/me')

// httpClient transforms
const url = '/api/users/me'

// Browser sees
fetch('/api/users/me')  // Same-origin!

// Next.js rewrites
http://localhost:3000/api/users/me

// Backend receives
GET /api/users/me
```

### 2. All Services Covered
```
✅ auth.api.ts      → /api/auth/*
✅ users.api.ts     → /api/users/*
✅ posts.api.ts     → /api/posts/*
✅ analytics.api.ts → /api/insight/*
✅ sessions.api.ts  → /api/sessions/*
✅ ai.api.ts        → /api/ai/*
```

### 3. Automatic Benefits
```
✅ Same-Origin Policy ✅
✅ No CORS needed ✅
✅ AdBlock bypass ✅
✅ Simpler security ✅
✅ Better performance ✅
```

---

## 🚀 Summary

**ONE CHANGE, GLOBAL IMPACT:**

```
http-client.ts (1 file changed)
        ↓
All API services benefit automatically
        ↓
100% Same-Origin architecture
```

**DONE!** 🎉
