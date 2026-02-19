import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

/**
 * Route Handler để kích hoạt Next.js Draft Mode
 * URL: /api/preview?id=...&slug=...&secret=...
 */
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const slug = searchParams.get("slug");
    const secret = searchParams.get("secret");

    // 1. Kiểm tra secret (Bảo mật)
    const PREVIEW_SECRET = process.env.PREVIEW_SECRET || "erg_preview_secret_2026";

    if (secret !== PREVIEW_SECRET || !id || !slug) {
        return new Response("Invalid request", { status: 401 });
    }

    // 2. Kích hoạt Draft Mode
    (await draftMode()).enable();

    // 3. Chuyển hướng về trang chi tiết bài viết kèm previewId
    // Page này nằm trong @main slot, URL thực tế là /tin-tuc/[slug]
    redirect(`/tin-tuc/${slug}?previewId=${id}`);
}
