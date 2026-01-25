# 📊 TASK: Tích hợp Hệ thống Analytics

> **Mục tiêu**: Tích hợp API Analytics vào Frontend để thu thập dữ liệu người dùng và hiển thị Dashboard thống kê cho Admin.
> **Thư viện UI**: shadcn/ui Charts (dựa trên Recharts)
> **Backend API**: Đã hoàn thiện, xem chi tiết bên dưới.

---

## 📌 PHẦN 1: TRACKING (Trang User - Homepage, Courses, Posts...)

### Mục tiêu
Thu thập dữ liệu truy cập từ **mọi trang** để Backend có dữ liệu hiển thị Dashboard.

### API Endpoints

| Method | Endpoint | Auth | Body |
|--------|----------|------|------|
| POST | `/analytics/visits/start` | Optional (gửi token nếu có) | `{ url, referrer }` |
| PUT | `/analytics/visits/:id/end` | No | `{ duration }` (giây) |
| POST | `/analytics/events` | Optional | `{ eventType, metadata, sessionInternalId }` |

### Code mẫu: Hook `usePageTracking`

```typescript
// hooks/usePageTracking.ts
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation'; // hoặc useLocation (react-router)
import { api } from '@/lib/api';

export function usePageTracking() {
  const pathname = usePathname();
  const visitIdRef = useRef<string | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    const trackStart = async () => {
      startTimeRef.current = Date.now();
      try {
        const { data } = await api.post('/analytics/visits/start', {
          url: window.location.href,
          referrer: document.referrer || '',
        });
        visitIdRef.current = data.visitId;
      } catch (e) {
        console.warn('Analytics track failed:', e);
      }
    };

    const trackEnd = () => {
      if (!visitIdRef.current) return;
      const duration = Math.round((Date.now() - startTimeRef.current) / 1000);
      
      // Dùng sendBeacon để đảm bảo gửi được khi đóng tab
      const blob = new Blob([JSON.stringify({ duration })], { type: 'application/json' });
      navigator.sendBeacon(`/api/analytics/visits/${visitIdRef.current}/end`, blob);
    };

    trackStart();
    window.addEventListener('beforeunload', trackEnd);

    return () => {
      trackEnd(); // Cleanup khi route change
      window.removeEventListener('beforeunload', trackEnd);
    };
  }, [pathname]);
}
```

### Cách sử dụng
```typescript
// app/layout.tsx hoặc _app.tsx
'use client';
import { usePageTracking } from '@/hooks/usePageTracking';

export default function RootLayout({ children }) {
  usePageTracking(); // Gọi ở đây để track mọi trang
  return <html>...</html>;
}
```

### Tracking Events (Tùy chọn)
```typescript
// Khi user click button đăng ký khóa học
await api.post('/analytics/events', {
  eventType: 'course_register_click',
  metadata: { courseId: 'ielts-7-0' },
  sessionInternalId: localStorage.getItem('sessionId') || crypto.randomUUID(),
});
```

---

## 📌 PHẦN 2: ADMIN DASHBOARD (Trang /admin/dashboard)

### Mục tiêu
Hiển thị thống kê trực quan với **nhiều biểu đồ** thay vì DataTable. Sử dụng **shadcn/ui Charts**.

### API Endpoint

```
GET /analytics/dashboard?from=2026-01-15&to=2026-01-22
Authorization: Bearer <token>
Permission: system.logs
```

### Response Structure
```typescript
interface DashboardResponse {
  dateRange: { 
    current: { from: string, to: string },
    previous: { from: string, to: string }
  };
  summary: {
    totalVisits: { value: number, previous: number, growth: number };
    activeUsers: { value: number, previous: number, growth: number };
    newUsers: { value: number, previous: number, growth: number };
    avgDuration: { value: number, previous: number, growth: number };
    bounceRate: { value: number, previous: number, growth: number };
  };
  trafficChart: Array<{ label: string, mobile: number, desktop: number, total: number }>;
  locations: Array<{ city: string, country: string, count: number }>;
  devices: {
    types: Array<{ name: string, count: number, percentage: number }>;
    os: Array<{ name: string, count: number, percentage: number }>;
    browsers: Array<{ name: string, count: number, percentage: number }>;
  };
  peakHours: Array<{ hour: number, count: number }>;
  trafficSources: Array<{ source: string, count: number, percentage: number }>;
  content: {
    topCourses: Array<{ url: string, title: string, views: number }>;
    topPosts: Array<{ url: string, title: string, views: number }>;
  };
}
```

---

## 📌 PHẦN 3: LAYOUT DASHBOARD MỚI

### Bỏ DataTable, thay bằng Grid các Charts

```
┌─────────────────────────────────────────────────────────────────┐
│  [Total Visits]   [Active Users]   [New Users]   [Bounce Rate]  │  ← Summary Cards (giữ nguyên)
│   45,678 +12%      1,234 +8%        150 -5%        35% -2%       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    📈 AREA CHART: Traffic Over Time             │ ← Biểu đồ chính (Mobile vs Desktop)
│         [Line: Mobile] [Line: Desktop]                          │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────┐ ┌─────────────────────────┐ ┌─────────────────────────┐
│  🥧 PIE CHART           │ │  📊 BAR CHART           │ │  📍 BAR CHART           │
│  Device Types           │ │  Traffic Sources        │ │  Top Locations          │
│  (Mobile/Desktop/Tablet)│ │  (Direct/Google/FB)     │ │  (HCM/HN/ĐN...)         │
└─────────────────────────┘ └─────────────────────────┘ └─────────────────────────┘

┌─────────────────────────┐ ┌─────────────────────────┐ ┌─────────────────────────┐
│  ⏰ BAR CHART           │ │  🌐 PIE CHART           │ │  📱 PIE CHART           │
│  Peak Hours             │ │  Browsers               │ │  Operating Systems      │
│  (0h-23h)               │ │  (Chrome/Safari/FF)     │ │  (iOS/Android/Win)      │
└─────────────────────────┘ └─────────────────────────┘ └─────────────────────────┘

┌─────────────────────────────────────┐ ┌─────────────────────────────────────┐
│  🏆 HORIZONTAL BAR                  │ │  📰 HORIZONTAL BAR                  │
│  Top Courses                        │ │  Top Posts                          │
└─────────────────────────────────────┘ └─────────────────────────────────────┘
```

---

## 📌 PHẦN 4: CODE MẪU SHADCN/UI CHARTS

### 4.1 Cài đặt
```bash
npx shadcn-ui@latest add chart
```

### 4.2 Area Chart (Traffic Mobile vs Desktop)
```tsx
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend } from "@/components/ui/chart";

const chartConfig = {
  mobile: { label: "Mobile", color: "hsl(var(--chart-1))" },
  desktop: { label: "Desktop", color: "hsl(var(--chart-2))" },
};

export function TrafficChart({ data }: { data: TrafficDataPoint[] }) {
  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="label" tickLine={false} />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend />
        <Area type="monotone" dataKey="mobile" stackId="1" fill="var(--color-mobile)" stroke="var(--color-mobile)" />
        <Area type="monotone" dataKey="desktop" stackId="1" fill="var(--color-desktop)" stroke="var(--color-desktop)" />
      </AreaChart>
    </ChartContainer>
  );
}
```

### 4.3 Pie Chart (Device Types)
```tsx
import { Pie, PieChart, Cell } from "recharts";

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))"];

export function DevicePieChart({ data }: { data: DeviceTypeStat[] }) {
  return (
    <ChartContainer config={{}} className="h-[250px]">
      <PieChart>
        <Pie data={data} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <ChartTooltip content={<ChartTooltipContent />} />
      </PieChart>
    </ChartContainer>
  );
}
```

### 4.4 Bar Chart Horizontal (Top Locations)
```tsx
import { Bar, BarChart, XAxis, YAxis } from "recharts";

export function LocationsChart({ data }: { data: LocationStat[] }) {
  return (
    <ChartContainer config={{ count: { label: "Visits", color: "hsl(var(--chart-1))" } }} className="h-[250px]">
      <BarChart data={data} layout="vertical">
        <XAxis type="number" />
        <YAxis dataKey="city" type="category" width={100} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="count" fill="var(--color-count)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
```

### 4.5 Bar Chart (Peak Hours)
```tsx
export function PeakHoursChart({ data }: { data: PeakHour[] }) {
  const formattedData = data.map(d => ({ ...d, label: `${d.hour}:00` }));
  
  return (
    <ChartContainer config={{ count: { label: "Visits", color: "hsl(var(--chart-4))" } }} className="h-[200px]">
      <BarChart data={formattedData}>
        <XAxis dataKey="label" />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  );
}
```

---

## 📌 PHẦN 5: CHECKLIST

### Tracking (User Pages)
- [ ] Tạo hook `usePageTracking`
- [ ] Gọi hook trong layout chính (track mọi trang)
- [ ] Test: Vào các trang, check MongoDB có dữ liệu Visit mới
- [ ] (Optional) Track events: click đăng ký, xem video...

### Dashboard (Admin)
- [ ] Tạo page `/admin/dashboard` (hoặc cập nhật existing)
- [ ] Gọi API `GET /analytics/dashboard` với date range
- [ ] **Xóa DataTable** ở phần dưới Dashboard
- [ ] Thêm **Summary Cards** với % growth (xanh/đỏ)
- [ ] Thêm **Area Chart**: Traffic Mobile vs Desktop
- [ ] Thêm **Pie Chart**: Device Types
- [ ] Thêm **Bar Chart**: Traffic Sources
- [ ] Thêm **Bar Chart Horizontal**: Top Locations
- [ ] Thêm **Bar Chart**: Peak Hours (24h)
- [ ] Thêm **Pie Chart**: Browsers
- [ ] Thêm **Pie Chart**: Operating Systems
- [ ] Thêm **Horizontal Bar**: Top Courses
- [ ] Thêm **Horizontal Bar**: Top Posts
- [ ] Thêm **Date Range Picker** để chọn thời gian

---

## 📌 LƯU Ý QUAN TRỌNG

1. **Từ ảnh UI hiện tại**: Bỏ hoàn toàn phần **DataTable bên dưới** (Outline, Past Performance...). Thay bằng Grid các Charts.

2. **Summary Cards**: Giữ nguyên 4 cards trên cùng nhưng thay đổi:
   - "Total Revenue" → "Total Visits"
   - "New Customers" → "New Users"
   - "Active Accounts" → "Active Users"
   - "Growth Rate" → "Bounce Rate" (hoặc giữ nguyên)

3. **Date Picker**: Thêm component chọn Date Range (7 days, 30 days, 3 months, custom).

4. **Loading States**: Mỗi chart cần có Skeleton khi đang load.

5. **Permission Check**: Dashboard chỉ hiển thị cho user có quyền `system.logs`.

---

**Deadline**: [Điền vào]
**Contact Backend**: [Tên BE dev]
