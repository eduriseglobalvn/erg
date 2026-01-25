# YÊU CẦU API ANALYTICS CHO FRONTEND (DASHBOARD)

## 1. Tổng quan
Frontend cần hiển thị biểu đồ theo dõi lượng truy cập (Traffic Analytics) phân loại theo thiết bị (Desktop/Mobile) trên Dashboard Admin. Chức năng này giúp Admin hiểu rõ hành vi người dùng để tối ưu hóa trải nghiệm.

## 2. Yêu cầu chi tiết về API

### 2.1. Middleware Tracking (Logging)
Backend cần implement một Middleware hoặc Interceptor để tự động log thông tin của mọi request **GET Public** (ví dụ: truy cập trang chủ, bài viết...).

**Dữ liệu cần log vào Database (Table `visitor_logs`):**
- **IP Address**: Để xác định Unique Visitor (có thể hash để bảo mật).
- **User Agent**: Để parse ra loại thiết bị (Mobile, Tablet, Desktop) và trình duyệt.
- **Path**: URL được truy cập (ví dụ: `/`, `/posts/abc`).
- **Timestamp**: Thời gian truy cập.

### 2.2. API Endpoint cho Dashboard Chart

**Endpoint:** `GET /analytics/visitors`

**Query Parameters:**
- `range`: Khoảng thời gian (ví dụ: `7d`, `30d`, `90d`).
- `startDate` (optional): `YYYY-MM-DD`
- `endDate` (optional): `YYYY-MM-DD`

**Logic xử lý:**
1. Lọc các log trong khoảng thời gian yêu cầu.
2. Group by `Date` (ngày).
3. Trong mỗi ngày, Group by `Device Type` (Desktop vs Mobile).
4. Count số lượng unique visitor (hoặc page views).

**Response Format (JSON):**

```json
{
  "statusCode": 200,
  "message": "Get visitors analytics successfully",
  "data": [
    {
      "date": "2024-04-01",
      "desktop": 150,
      "mobile": 220
    },
    {
      "date": "2024-04-02",
      "desktop": 180,
      "mobile": 190
    },
    // ... dữ liệu các ngày tiếp theo
  ]
}
```

## 3. Tech Stack gợi ý (NestJS)
- **User-Agent Parser**: Sử dụng thư viện như `ua-parser-js` để phân loại thiết bị từ header `user-agent`.
- **Database Index**: Đánh index cho cột `timestamp` để query nhanh.
- **Caching**: Nên cache kết quả response (Redis) với TTL khoảng 5-10 phút để giảm tải cho DB khi Dashboard được refresh liên tục.
