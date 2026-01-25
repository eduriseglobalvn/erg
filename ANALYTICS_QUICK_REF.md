# 🚀 Analytics Quick Reference

## Backend Endpoints (Copy & Paste)

```typescript
// ==================== USER TRACKING (Public) ====================

// 1. Start Session
POST /api/insight/session/begin
Body: { url: string, referrer: string }
Response: { sessionId: string, timestamp: string }

// 2. Finish Session  
PUT /api/insight/session/:id/finish
Body: { duration: number }
Response: 200 OK

// 3. Track Behavior (Optional)
POST /api/insight/behavior
Body: { sessionId?: string, eventType: string, eventData?: object }
Response: 200 OK


// ==================== ADMIN DASHBOARD (Protected) ====================

// 4. Overview Summary
GET /api/insight/overview?from=2026-01-15&to=2026-01-22
Auth: Bearer token
Response: { 
  totalVisits: number, 
  activeUsers: number, 
  newUsers: number, 
  totalPosts: number 
}

// 5. Traffic Stats
GET /api/insight/stats?range=7d|30d|90d
Auth: Bearer token
Response: { 
  data: [
    { date: string, desktop: number, mobile: number }
  ]
}
```

---

## Frontend Usage

### Auto-Tracking (đã tích hợp sẵn)
```tsx
// Không cần làm gì, tracking tự động hoạt động!
// Hook usePageTracking đã được tích hợp vào RootLayout
```

### Manual Event Tracking
```tsx
import { analyticsApi } from '@/services/analytics.api';

// Track custom event
await analyticsApi.trackBehavior({
  eventType: 'button_click',
  eventData: { buttonId: 'enroll-course' }
});
```

### Dashboard Data
```tsx
import { analyticsApi } from '@/services/analytics.api';

// Get overview
const overview = await analyticsApi.getOverview();
// { totalVisits, activeUsers, newUsers, totalPosts }

// Get traffic stats
const stats = await analyticsApi.getStats('7d');
// { data: [{ date, desktop, mobile }] }
```

---

## Testing

### Test User Tracking
1. Mở Console: `Cmd+Option+J` (Mac) 
2. Vào bất kỳ trang nào (không phải Admin)
3. Xem log:
   ```
   [Tracker] Starting session: { url: "...", referrer: "..." }
   [Tracker] Session started: sess_xxx
   ```
4. Đóng tab hoặc reload
5. Xem log:
   ```
   [Tracker] Finishing session: { sessionId: "sess_xxx", duration: 45 }
   ```

### Test Dashboard
1. Login Admin → Dashboard
2. Mở Network tab
3. Xem requests:
   - `/api/insight/overview` ✅
   - `/api/insight/stats?range=90d` ✅

---

## Files

| File | Mục đích |
|------|----------|
| `src/services/analytics.api.ts` | API methods |
| `src/hooks/use-page-tracking.ts` | Auto-tracking logic |
| `src/components/analytics-tracker.tsx` | Wrapper component |
| `src/components/admin/dashboard/stats-cards.tsx` | Summary cards |
| `src/components/admin/dashboard/visitors-chart.tsx` | Traffic chart |
| `ANALYTICS_API_FINAL.md` | Full documentation |
| `ANALYTICS_INTEGRATION_COMPLETED.md` | Summary report |

---

## Environment

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

## Debug Commands

```bash
# Check if files exist
ls -la src/services/analytics.api.ts
ls -la src/hooks/use-page-tracking.ts
ls -la src/components/analytics-tracker.tsx

# Search for tracking logs
# (Open browser Console and search for "[Tracker]")
```

---

**✅ Ready to use!**
