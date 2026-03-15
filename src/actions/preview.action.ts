'use server'

import { draftMode } from "next/headers";

export async function enablePreview(previewId: string, slug: string) {
    // Kích hoạt Draft Mode (Next.js sẽ tự set cookie)
    (await draftMode()).enable();

    // Trả về URL để client redirect
    const mainDomain = process.env.NEXT_PUBLIC_DOMAIN || "https://erg.edu.vn";
    return `${mainDomain}/tin-tuc/${slug}?previewId=${previewId}`;
}
