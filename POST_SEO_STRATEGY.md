# Chiến lược SEO cho các trang bài viết ERG

Bản tài liệu này tóm tắt các kỹ thuật SEO cần triển khai cho các trang chi tiết bài viết (`/tin-tuc/[slug]`) để tối ưu hóa khả năng hiển thị trên Google và mạng xã hội.

## 1. Metadata Động (Dynamic Metadata)
Hiện tại trang web mới chỉ hiển thị metadata tĩnh. Cần triển khai hàm `generateMetadata` trong Next.js để:
- **Tiêu đề (Title):** Tự động là `[Tiêu đề bài viết] | ERG Edurise Global`.
- **Mô tả (Description):** Lấy từ phần `excerpt` (sapo) của bài viết.
- **Hình ảnh Social (OG Image):** Sử dụng chính ảnh `thumbnail` của bài viết để khi chia sẻ lên Zalo/Facebook sẽ hiển thị card thu nhỏ có ảnh.

## 2. Dữ liệu cấu trúc (Structured Data - JSON-LD)
Cần chèn đoạn mã JSON-LD chuẩn `Article` vào mỗi bài viết. Điều này giúp Google:
- Hiểu bài viết thuộc thể loại News/Blog.
- Hiển thị ngày đăng, tác giả trên kết quả tìm kiếm.
- Tăng cơ hội xuất hiện trong mục "Tin tức hàng đầu" (Top Stories).

## 3. SEO Ngữ nghĩa (Semantic SEO)
- Đảm bảo thẻ `H1` duy nhất cho tiêu đề bài viết.
- Các tiêu đề phụ `H2`, `H3` phải tuân thủ phân cấp logic.
- Ảnh bài viết phải có thuộc tính `alt` (mô tả ảnh).

## 4. URL Chính tắc (Canonical URL)
Đảm bảo mỗi bài viết chỉ có một đường dẫn duy nhất, tránh tình trạng duplicate content (trùng lặp nội dung) nếu truy cập từ nhiều đường link khác nhau.

---
*Tài liệu này được soạn thảo để phục vụ việc tối ưu hóa website Edurise Global.*
