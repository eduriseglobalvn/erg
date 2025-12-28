# ERG - EduRise Global Platform

> **"Khơi nguồn trí tuệ – Dẫn lối tương lai"**

Chào mừng đến với mã nguồn chính thức của **ERG (EduRise Global)**. Đây là nền tảng giáo dục tiên phong kết hợp công nghệ, cung cấp các giải pháp giáo dục thông minh và lộ trình đào tạo chuyên sâu (Cloud DevOps, Chuyển đổi số, v.v.).

## 🌟 Giới thiệu

ERG ra đời với sứ mệnh biến công nghệ trở thành cầu nối bền vững giữa tri thức và con người. Tên gọi ERG đại diện cho:
*   **Edu (Education)**: Giáo dục là nền tảng cốt lõi.
*   **Rise (Vươn tầm)**: Khát vọng đổi mới và phát triển không ngừng.
*   **Global (Toàn cầu)**: Tầm nhìn và tiêu chuẩn quốc tế.

## 🛠 Công nghệ sử dụng

Dự án được xây dựng trên nền tảng công nghệ hiện đại, tối ưu cho hiệu năng và trải nghiệm người dùng:

-   **Framework**: Next.js 16+ (App Router)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS
-   **Icons**: Lucide React
-   **Runtime**: Node.js v20.19.4

## 🚀 Cài đặt và Chạy Local

Để chạy dự án trên máy cá nhân, vui lòng thực hiện các bước sau:

1.  **Clone repository:**
    ```bash
    git clone <your-repo-url>
    cd erg
    ```

2.  **Cài đặt dependencies:**
    ```bash
    yarn install
    # hoặc nếu dùng npm:
    npm install
    ```

3.  **Cấu hình Môi trường (Multi-domain):**

    Dự án hỗ trợ chạy Multi-domain. Để môi trường dev hoạt động đúng với các subdomain, bạn cần cấu hình như sau:

    -   Tạo file `.env.local` tại thư mục gốc dự án:
        ```env
        NEXT_PUBLIC_ROOT_DOMAIN=localhost:3000
        ```
    -   **Lưu ý:** Trình duyệt hiện đại hỗ trợ sẵn subdomain trên localhost (ví dụ: `app.localhost:3000`), nên bạn thường không cần sửa file hosts.
    -   Nếu muốn giả lập domain production (ví dụ: `erg.local`), hãy thêm vào file hosts (`/etc/hosts` hoặc `C:\Windows\System32\drivers\etc\hosts`):
        ```text
        127.0.0.1 erg.local
        127.0.0.1 app.erg.local
        ```
        Và cập nhật `.env.local` thành: `NEXT_PUBLIC_ROOT_DOMAIN=erg.local:3000`.

4.  **Chạy môi trường phát triển:**
    ```bash
    yarn dev
    # hoặc nếu dùng npm:
    npm run dev
    ```
    Truy cập http://localhost:3000 để xem kết quả.

## 📦 Quy trình Deploy (CI/CD)

Dự án sử dụng **GitHub Actions** để tự động hóa quy trình triển khai lên hosting cPanel thông qua giao thức FTP.

### Workflow: `Deploy Next.js to cPanel`

Quy trình sẽ tự động kích hoạt khi có code mới được push vào nhánh `production`.

1.  **Build**:
    -   Sử dụng Node.js v20.19.4.
    -   Chạy `npm run build` để tạo bản build production (chế độ Standalone).
2.  **Prepare**:
    -   Đóng gói `standalone`, `static`, và `public` assets.
    -   Tạo file `deploy.js` entry point cho Node server.
    -   Nén toàn bộ thành `build.zip`.
3.  **Deploy**:
    -   Upload `build.zip` lên server qua FTP.
    -   Trigger script giải nén (`unzip.php`) trên server để hoàn tất cập nhật.

## 📂 Cấu trúc dự án

-   `src/app`: Mã nguồn chính (Next.js App Router).
    -   `(main)/cau-chuyen-cua-erg`: Trang giới thiệu về ERG.
-   `src/components`: Các UI components tái sử dụng (ví dụ: `RoadmapSection`).
-   `.github/workflows`: Cấu hình CI/CD pipeline.

---
© 2024 ERG Workspace. All rights reserved.
