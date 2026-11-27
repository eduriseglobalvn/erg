# erg.edu.vn

Website tĩnh của ERG – Edurise Global, viết bằng [Astro](https://astro.build) và triển khai trên Cloudflare Pages. Không có SSR hay backend: nội dung là dữ liệu mẫu trong `src/data/*.ts`.

## Chạy local

Cần [Bun](https://bun.sh) 1.x.

```bash
bun install
bun run dev      # http://localhost:4321
bun run check    # kiểm tra kiểu và template
bun run build    # xuất HTML tĩnh vào dist/
bun run preview  # xem bản build
```

Xem thử giao diện lễ/Tết ở bất kỳ ngày nào: thêm `?season=tet` (hoặc `noel`, `newyear`, `hungvuong`, `thongnhat`, `thieunhi`, `quockhanh`, `trungthu`, `nhagiao`, `none`). Lựa chọn được nhớ trong tab khi chuyển trang; `?season=auto` để về theo ngày thật. Khách thường không cần tham số này: giao diện tự đổi theo ngày, từ 3 ngày trước dịp lễ đến hết ngày lễ.

## Cấu trúc

- `src/pages/`: mỗi file là một route.
- `src/layouts/Base.astro`: khung trang (SEO, header, footer, chọn mùa lễ).
- `src/components/`: header, footer, quả cầu 3D và component theo từng khu vực.
- `src/data/`: nội dung mẫu. Sửa ở đây để đổi nội dung trang. Hotline, Zalo, Messenger ở `site.ts`; tên thương hiệu, từ khóa SEO, ảnh chia sẻ ở `seo.ts`.
- `src/lib/season.ts`: lịch lễ. Ngày âm lịch (Tết, Giỗ Tổ, Trung thu) được tính tự động lúc build cho năm build −1 đến +10. Chỉ cần deploy lại ít nhất 10 năm một lần.

## Triển khai Vercel

`vercel.json` ép framework Astro, build `bun run build`, xuất `dist` và chứa các redirect đường dẫn (Vercel không đọc `public/_redirects`). Không cần chỉnh Framework Preset trong dashboard: `vercel.json` ghi đè. Biến môi trường cũ của Next.js trong project Vercel không còn dùng.

## Triển khai Cloudflare Pages

- Build command: `bun run build`
- Output directory: `dist`
- `public/_redirects` xử lý chuyển hướng theo đường dẫn (ví dụ `/co-hoi-nghe-nghiep` → `/tuyen-dung`).

Các subdomain cũ phải chuyển hướng 301 bằng **Bulk Redirects** trong Cloudflare dashboard (`_redirects` không xử lý được host khác):

| Nguồn | Đích |
|---|---|
| tinhocquocte.erg.edu.vn | https://erg.edu.vn/chuong-trinh/tin-hoc-quoc-te |
| tinhocquocgia.erg.edu.vn | https://erg.edu.vn/chuong-trinh/tin-hoc-quoc-gia |
| tinhocthieunhi.erg.edu.vn | https://erg.edu.vn/chuong-trinh/tin-hoc-thieu-nhi |
| congdanso.erg.edu.vn | https://erg.edu.vn/chuong-trinh/cong-dan-so |
| dientoandammay.erg.edu.vn | https://erg.edu.vn/chuong-trinh/dien-toan-dam-may |
| ai.erg.edu.vn | https://erg.edu.vn/chuong-trinh/tri-tue-nhan-tao |
| tuyendung.erg.edu.vn | https://erg.edu.vn/tuyen-dung |

Forum đã ngừng; CMS chuyển sang `erg-system`.

## Giới hạn hiện tại

- Mục "Điểm tin giáo dục" ở `/tin-tuc` lấy 12 bài mới nhất từ RSS Báo Giáo dục và Thời đại (`src/lib/eduFeed.ts`) **lúc build**. Workflow `.github/workflows/refresh-news.yml` gọi Deploy Hook của Cloudflare Pages lúc 6h, 12h, 18h (giờ VN) để build lại. Cài một lần: Cloudflare Pages → Settings → Builds & deployments → Deploy hooks → tạo hook cho nhánh production, rồi lưu URL vào GitHub secret `CF_PAGES_DEPLOY_HOOK`. GitHub chỉ chạy lịch trên nhánh mặc định và tạm dừng lịch nếu repo không có hoạt động 60 ngày. Có thể chạy tay ở tab Actions → Refresh news digest → Run workflow. Nếu RSS lỗi, build vẫn chạy và mục này để trống.
- Google Analytics (G-PF00V6RJDD) chỉ gửi số liệu khi chạy trên tên miền erg.edu.vn.
- Các form (liên hệ, ứng tuyển, tra cứu hồ sơ) chưa gửi đi đâu: chỉ hiện ghi chú gọi hotline. Cần một endpoint (ví dụ Cloudflare Pages Function) khi có backend.
- Ảnh thật chưa có ở nhiều chỗ, đang dùng khung giữ chỗ.
