# 🗺️ Cập Nhật Cấu Trúc Sitemap & Subdomains (Gửi Backend Team)

Frontend Team đã hoàn tất việc quét toàn bộ cấu trúc URL của hệ thống (bao gồm các Subdomain). Để Sitemap hiển thị đầy đủ và giúp Google hiểu cấu trúc phân tầng (Hierarchical) của ERG, Backend cần cập nhật API `/sitemap/data` để trả về danh sách URL đầy đủ (bao gồm cả Domain).

## 1. Yêu Cầu API Sitemap (Quan Trọng)
Hiện tại API `/sitemap/data` đang trả về `loc` dưới dạng relative path (ví dụ `/tin-tuc`). Điều này **KHÔNG ĐỦ** vì hệ thống chạy trên nhiều Subdomain khác nhau.

**Yêu cầu Backend trả về Full Absolute URL**:
```json
{
  "data": {
    "urls": [
      { "loc": "https://erg.edu.vn/tin-tuc", "changefreq": "daily", "priority": 0.8 },
      { "loc": "https://ai.erg.edu.vn/khoa-hoc", "changefreq": "weekly", "priority": 0.9 },
      { "loc": "https://tinhocquocte.erg.edu.vn/lo-trinh", "changefreq": "monthly", "priority": 0.7 }
    ]
  }
}
```

## 2. Danh Sách URL Tĩnh (Static Pages)
Dưới đây là danh sách các trang tĩnh đã được Frontend triển khai. Backend cần thêm các URL này vào DB hoặc cấu hình cứng để trả về trong Sitemap.

### 🌐 Main Domain (`https://erg.edu.vn`)
- `https://erg.edu.vn/` (Trang chủ)
- `https://erg.edu.vn/tin-tuc` (Tin tức tổng hợp)
- `https://erg.edu.vn/lien-he`
- `https://erg.edu.vn/gioi-thieu/tam-nhin-su-menh`
- `https://erg.edu.vn/gioi-thieu/gia-tri-cot-loi`
- `https://erg.edu.vn/gioi-thieu/cau-chuyen-cua-erg`
- `https://erg.edu.vn/gioi-thieu/doi-ngu-lanh-dao`
- `https://erg.edu.vn/linh-vuc-dao-tao`
- `https://erg.edu.vn/doi-tac`
- `https://erg.edu.vn/co-hoi-nghe-nghiep`

### 🤖 Subdomain AI (`https://ai.erg.edu.vn`)
- `https://ai.erg.edu.vn/`
- `https://ai.erg.edu.vn/tin-tuc`
- `https://ai.erg.edu.vn/khoa-hoc`
- `https://ai.erg.edu.vn/doi-ngu-giao-vien`
- `https://ai.erg.edu.vn/lien-he`

### 🌏 Subdomain Tin Học Quốc Tế (`https://tinhocquocte.erg.edu.vn`)
- `https://tinhocquocte.erg.edu.vn/`
- `https://tinhocquocte.erg.edu.vn/gioi-thieu`
- `https://tinhocquocte.erg.edu.vn/lo-trinh`
- `https://tinhocquocte.erg.edu.vn/khoa-hoc`
- `https://tinhocquocte.erg.edu.vn/khoa-hoc/mos`
- `https://tinhocquocte.erg.edu.vn/khoa-hoc/ic3-gs6`
- `https://tinhocquocte.erg.edu.vn/khoa-hoc/ic3-spark-gs6`
- `https://tinhocquocte.erg.edu.vn/tin-tuc`
- `https://tinhocquocte.erg.edu.vn/doi-ngu-giao-vien`
- `https://tinhocquocte.erg.edu.vn/lien-he`

### 🇻🇳 Subdomain Tin Học Quốc Gia (`https://tinhocquocgia.erg.edu.vn`)
- `https://tinhocquocgia.erg.edu.vn/`
- `https://tinhocquocgia.erg.edu.vn/lo-trinh`
- `https://tinhocquocgia.erg.edu.vn/khoa-hoc`
- `https://tinhocquocgia.erg.edu.vn/tin-tuc`
- `https://tinhocquocgia.erg.edu.vn/doi-ngu-giao-vien`
- `https://tinhocquocgia.erg.edu.vn/lien-he`

### 👶 Subdomain Tin Học Thiếu Nhi (`https://tinhocthieunhi.erg.edu.vn`)
- `https://tinhocthieunhi.erg.edu.vn/`
- `https://tinhocthieunhi.erg.edu.vn/khoa-hoc`
- `https://tinhocthieunhi.erg.edu.vn/khoa-hoc/lap-trinh-scratch`
- `https://tinhocthieunhi.erg.edu.vn/khoa-hoc/lap-trinh-python-thieu-nhi`
- `https://tinhocthieunhi.erg.edu.vn/tin-tuc`
- `https://tinhocthieunhi.erg.edu.vn/doi-ngu-giao-vien`
- `https://tinhocthieunhi.erg.edu.vn/lien-he`

### 👥 Subdomain Công Dân Số (`https://congdanso.erg.edu.vn`)
- `https://congdanso.erg.edu.vn/`
- `https://congdanso.erg.edu.vn/lo-trinh`
- `https://congdanso.erg.edu.vn/tin-tuc`
- `https://congdanso.erg.edu.vn/lien-he`

### ☁️ Subdomain Điện Toán Đám Mây (`https://dientoandammay.erg.edu.vn`)
- `https://dientoandammay.erg.edu.vn/`

### 💼 Subdomain Tuyển Dụng (`https://tuyendung.erg.edu.vn`)
- `https://tuyendung.erg.edu.vn/`
- `https://tuyendung.erg.edu.vn/tuyen-dung` (Danh sách việc làm)
- `https://tuyendung.erg.edu.vn/chinh-sach`
- `https://tuyendung.erg.edu.vn/van-hoa`
- `https://tuyendung.erg.edu.vn/lien-he`

## 3. Cấu Trúc Hierarchical (Cây Thư Mục trên Google)
Để Google hiển thị Sitelinks dạng cây thư mục, ngoài Sitemap chuẩn, Frontend đã tích hợp:
1.  **JSON-LD BreadcrumbList**: Đã có trong code frontend.
2.  **Navigation rõ ràng**: Menu phân cấp.

Yêu cầu Backend đảm bảo khi trả về Sitemap:
*   **Categories**: Cần gán đúng URL category vào bài viết (ví dụ: `https://ai.erg.edu.vn/tin-tuc/bai-viet-a` thay vì chỉ để ở domain chính nếu bài viết đó thuộc chuyên mục AI).
*   **Last Modified**: Luôn cập nhật field này chính xác để Google biết khi nào crawl lại.
