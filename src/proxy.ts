// src/proxy.ts
import { NextRequest, NextResponse } from "next/server";
// Import danh sách subdomain hợp lệ từ file menu
import { VALID_SUBDOMAINS } from "@/constants/MenuItem";

export default function proxy(request: NextRequest) {
    const url = request.nextUrl;
    let hostname = request.headers.get("host") || "";
    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN;

    if (hostname.includes(":")) {
        hostname = hostname.split(":")[0];
    }

    let subdomain = "";
    if (hostname.includes(rootDomain!) && hostname !== rootDomain) {
        subdomain = hostname.replace(`.${rootDomain}`, "");
    }

    const searchParams = request.nextUrl.searchParams.toString();
    const path = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ""}`;

    // --- LOGIC TỰ ĐỘNG (DYNAMIC) ---
    // Kiểm tra xem subdomain có nằm trong danh sách đã định nghĩa bên menu không
    if (VALID_SUBDOMAINS.includes(subdomain)) {
        // Nếu có, tự động rewrite về folder tương ứng
        // Ví dụ: subdomain "python" -> rewrite về /app/python
        return NextResponse.rewrite(new URL(`/${subdomain}${path}`, request.url));
    }

    // Trang chủ (www hoặc không có subdomain)
    if (!subdomain || subdomain === 'www') {
        return NextResponse.rewrite(new URL(`${path === '/' ? '' : path}`, request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)',
    ],
};