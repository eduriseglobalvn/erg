# Analytics API Integration - Final Version

**Cập nhật lần cuối:** 2026-01-23

## 📍 Endpoints Backend (FINAL)

### User Tracking (Public - Tránh AdBlock)

#### 1. **POST** `/api/insight/session/begin`
**Mục đích:** Bắt đầu tracking session khi user vào trang

**Request Body:**
```json
{
  "url": "https://erg.edu.vn/courses/python-advanced",
  "referrer": "https://google.com"
}
```

**Response:**
```json
{
  "sessionId": "sess_abc123xyz",
  "timestamp": "2026-01-23T09:40:00.000Z"
}
```

---

#### 2. **PUT** `/api/insight/session/:id/finish`
**Mục đích:** Kết thúc session và ghi nhận duration

**URL Params:** `sessionId` (string)

**Request Body:**
```json
{
  "duration": 125
}
```

**Response:** 200 OK (No body required)

**Note:** Frontend sử dụng `navigator.sendBeacon` để đảm bảo request được gửi ngay cả khi user đóng tab.

---

#### 3. **POST** `/api/insight/behavior`
**Mục đích:** Track các hành vi tùy chỉnh của user (click, scroll, etc.)

**Request Body:**
```json
{
  "sessionId": "sess_abc123xyz",
  "eventType": "button_click",
  "eventData": {
    "buttonId": "enroll-now",
    "courseName": "Python Advanced"
  }
}
```

**Response:** 200 OK

---

### Admin Dashboard

#### 4. **GET** `/api/insight/overview`
**Mục đích:** Lấy tổng quan dashboard (summary cards)

**Query Params (Optional):**
- `from`: Date string (ISO format)
- `to`: Date string (ISO format)

**Response:**
```json
{
  "statusCode": 200,
  "message": "success",
  "data": {
    "totalVisits": 15420,
    "activeUsers": 342,
    "newUsers": 89,
    "totalPosts": 127
  }
}
```

**Frontend Usage:** `StatsCards` component

---

#### 5. **GET** `/api/insight/stats`
**Mục đích:** Lấy dữ liệu biểu đồ traffic theo thời gian

**Query Params:**
- `range`: "7d" | "30d" | "90d" (default: "7d")

**Response:**
```json
{
  "statusCode": 200,
  "message": "success",
  "data": [
    {
      "date": "2026-01-16",
      "desktop": 145,
      "mobile": 89
    },
    {
      "date": "2026-01-17",
      "desktop": 158,
      "mobile": 102
    }
    // ... more data points
  ]
}
```

**Frontend Usage:** `VisitorsChart` component

---

## 🔧 Frontend Implementation

### Files Modified

1. **`src/services/analytics.api.ts`**
   - `trackSessionBegin()` - POST /api/insight/session/begin
   - `trackSessionFinish()` - PUT /api/insight/session/:id/finish
   - `trackBehavior()` - POST /api/insight/behavior
   - `getOverview()` - GET /api/insight/overview
   - `getStats()` - GET /api/insight/stats

2. **`src/hooks/use-page-tracking.ts`**
   - Tự động track session begin/finish
   - Skip tracking trên Admin domain

3. **`src/components/analytics-tracker.tsx`**
   - Wrapper component sử dụng `usePageTracking` hook
   - Được tích hợp vào `RootLayout`

4. **`src/components/admin/dashboard/visitors-chart.tsx`**
   - Hiển thị traffic chart từ `getStats()`

5. **`src/components/admin/dashboard/stats-cards.tsx`**
   - Hiển thị summary cards từ `getOverview()`

### Files Removed

- ❌ **`src/components/adblock-detector.tsx`** - Đã xóa hoàn toàn
- ❌ **AdBlockDetector logic** - Không cần popup nữa vì endpoint đã bypass AdBlock

---

## 🎯 How It Works

### User Tracking Flow

1. **User vào trang:**
   - `usePageTracking` hook tự động gọi `trackSessionBegin()`
   - Backend trả về `sessionId`
   - Frontend lưu `sessionId` trong memory (useRef)

2. **User tương tác:**
   - (Optional) Frontend có thể gọi `trackBehavior()` để track events

3. **User rời trang:**
   - Hook gọi `trackSessionFinish(sessionId, duration)`
   - Sử dụng `navigator.sendBeacon` để đảm bảo data được gửi

### Admin Dashboard Flow

1. **Admin mở Dashboard:**
   - `StatsCards` gọi `getOverview()` → Hiển thị summary
   - `VisitorsChart` gọi `getStats("90d")` → Hiển thị traffic chart

2. **Admin đổi time range:**
   - Chart tự động gọi lại `getStats()` với range mới

---

## 🚫 AdBlock Strategy

**Giải pháp:** Endpoint được đặt tên để **TRÁNH** AdBlock

- ✅ Sử dụng `/api/insight/*` thay vì `/api/analytics/*`
- ✅ Sử dụng `session` thay vì `visit` hoặc `track`
- ✅ Sử dụng `behavior` thay vì `event`
- ✅ **KHÔNG** cần popup yêu cầu tắt AdBlock

**Keywords TRÁNH:**
- ❌ analytics
- ❌ tracking
- ❌ pixel
- ❌ beacon
- ❌ ga (Google Analytics)

---

## 📝 Environment Variables

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000
# or
NEXT_PUBLIC_API_URL=https://api.erg.edu.vn
```

---

## ✅ Checklist

- [x] Xóa popup AdBlock Detector
- [x] Cập nhật analytics.api.ts với endpoint mới
- [x] Cập nhật usePageTracking hook
- [x] Cập nhật VisitorsChart component
- [x] Cập nhật StatsCards component
- [x] Test tracking flow (session begin/finish)
- [ ] Backend implement các endpoint mới
- [ ] Test trên production

---

## 🐛 Debug Tips

**Kiểm tra tracking có hoạt động:**
1. Mở DevTools Console
2. Vào trang bất kỳ
3. Xem log: `[Tracker] Starting session: { url, referrer }`
4. Reload trang hoặc đóng tab
5. Xem log: `[Tracker] Finishing session: { sessionId, duration }`

**Kiểm tra dashboard:**
1. Login vào Admin
2. Mở Network tab
3. Reload dashboard
4. Xem requests:
   - `GET /api/insight/overview`
   - `GET /api/insight/stats?range=90d`
