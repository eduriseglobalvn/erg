// src/proxy.ts
import { NextRequest, NextResponse } from "next/server";
import { VALID_SUBDOMAINS } from "@/constants/MenuItem"; // Nhớ check đúng đường dẫn file menu

export default function proxy(request: NextRequest) {
    const url = request.nextUrl;

    // 1. Lấy Hostname và Root Domain từ Env
    let hostname = request.headers.get("host") || "";
    // Fallback 'localhost' để tránh lỗi nếu quên set env ở dev
    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost';

    // 2. Xử lý Port (Quan trọng cho môi trường Dev)
    // Ví dụ: "erg.edu.local:3000" -> "erg.edu.local"
    if (hostname.includes(":")) {
        hostname = hostname.split(":")[0];
    }

    // 3. Logic Tách Subdomain (Universal)
    let subdomain = "";

    // Case A: Đang chạy localhost thuần (không map domain)
    if (hostname === 'localhost') {
        subdomain = "";
    }
    // Case B: Vào trang chủ (vd: erg.edu.local HOẶC beta.erg.edu.vn)
    else if (hostname === rootDomain) {
        subdomain = "";
    }
        // Case C: Vào Subdomain (vd: ai.erg.edu.local HOẶC ai.beta.erg.edu.vn)
    // Logic: Kiểm tra xem hostname có kết thúc bằng rootDomain không
    else if (hostname.endsWith(`.${rootDomain}`)) {
        // Cắt bỏ phần đuôi domain gốc đi, giữ lại phần đầu
        // vd: ai.erg.edu.local -> bỏ ".erg.edu.local" -> còn "ai"
        subdomain = hostname.replace(`.${rootDomain}`, "");
    }

    const searchParams = request.nextUrl.searchParams.toString();
    const path = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ""}`;

    // --- LOGIC ROUTING (Giữ nguyên) ---

    // 1. Nếu Subdomain hợp lệ -> Rewrite về folder tương ứng
    if (VALID_SUBDOMAINS.includes(subdomain)) {
        // Console log để bạn dễ debug ở dưới local
        // console.log(`[Proxy] Rewrite: ${subdomain}.${rootDomain} -> /${subdomain}${path}`);
        return NextResponse.rewrite(new URL(`/${subdomain}${path}`, request.url));
    }

    // 2. Trang chủ hoặc www -> Giữ nguyên (vào folder app/page.tsx)
    if (!subdomain || subdomain === 'www') {
        return NextResponse.rewrite(new URL(`${path === '/' ? '' : path}`, request.url));
    }

    // 3. Subdomain lạ -> Redirect về trang chủ
    return NextResponse.rewrite(new URL('/', request.url));
}


export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)',
    ],
};