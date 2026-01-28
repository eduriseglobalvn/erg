# 🕵️ Hướng Dẫn Kiểm Tra Thay Đổi (SEO & Giao Diện)

Bạn có thể kiểm tra các tính năng mới theo các bước dưới đây:

## 1. Kiểm Tra Trang Chi Tiết Bài Viết (`/tin-tuc/[slug]`)
1.  **Truy cập:** Mở trình duyệt và vào một bài viết bất kỳ, ví dụ: `http://localhost:3000/tin-tuc/bai-viet-mau-slug` (Thay slug bằng một bài viết thật trong database của bạn).
2.  **Check Giao diện:**
    *   Đảm bảo bố cục chia làm 2 cột: Nội dung chính (Trái) và Sidebar (Phải).
    *   Breadcrumb hiển thị đúng: Trang chủ > Tin tức > Tiêu đề bài.
    *   Màu chủ đạo các nút/link phải là màu Xanh đậm (`#00008b`).
3.  **Check SEO Metadata (Quan trọng):**
    *   Chuột phải vào trang -> chọn **"View Page Source"** (Xem nguồn trang).
    *   Tìm kiếm (`Ctrl+F` hoặc `Cmd+F`) các thẻ sau:
        *   `<title>`: Phải khớp với Meta Title bạn nhập (hoặc title bài viết).
        *   `<meta name="description">`: Phải có nội dung mô tả.
        *   `<link rel="canonical">`: Phải trỏ về URL chuẩn.
        *   `application/ld+json`: Phải thấy khối script JSON chứa thông tin bài viết (`@type": "Article"`...).

## 2. Kiểm Tra Cấu Hình SEO trong Admin
1.  **Truy cập:** `http://localhost:3000/admin/posts/create` (hoặc Edit một bài cũ).
2.  **Sidebar Phải:** Cuộn xuống dưới cùng sidebar bên phải.
3.  **Kiểm tra:**
    *   Thấy mục **"Cấu hình SEO"**.
    *   Có các ô nhập: Meta Title, Meta Description, Focus Keyword, Schema Type.
    *   Thấy thanh **"Điểm SEO"** (Nếu bài viết đã có điểm từ backend trả về).
    *   Thử nhập dữ liệu và nhấn Lưu, sau đó reload lại để xem dữ liệu có được giữ nguyên không.

## 3. Kiểm Tra Sitemap Tự Động
1.  **Truy cập:** `http://localhost:3000/sitemap.xml`
2.  **Kết quả:**
    *   Bạn sẽ thấy một trang XML chứa danh sách các đường link (`<loc>...`).
    *   Danh sách này được lấy động từ Backend (nếu Backend API `/sitemap/data` hoạt động đúng).
    *   Nếu Backend lỗi, nó sẽ hiển thị sitemap fallback (chỉ có trang chủ và trang tin tức).

## 4. Kiểm Tra Màu Sắc Thương Hiệu (Primary Color)
*   Nhìn vào các nút bấm chính (Button), các đường link khi hover, hoặc active state trên Menu.
*   Chúng phải có màu **Xanh Dương Đậm (#00008b)** thay vì màu đen hoặc xanh nhạt mặc định trước kia.

---
**Lưu ý:** Nếu bạn vừa sửa code `.env`, hãy nhớ khởi động lại server (`Ctrl+C` rồi `yarn dev`) để Next.js nhận biến môi trường mới.
