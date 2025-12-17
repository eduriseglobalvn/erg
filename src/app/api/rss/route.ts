import { NextResponse } from 'next/server';

export async function GET() {
    // Bỏ qua lỗi SSL nếu server đích dùng chứng chỉ tự ký hoặc cũ
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    const RSS_URL = 'https://giaoduc.edu.vn/feed/';

    try {
        const response = await fetch(RSS_URL, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            },
            next: { revalidate: 300 } // Cache 5 phút
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: `Lỗi kết nối nguồn tin: ${response.status}` },
                { status: response.status }
            );
        }

        const xmlData = await response.text();

        return new NextResponse(xmlData, {
            status: 200,
            headers: {
                'Content-Type': 'application/xml; charset=utf-8',
                // Cache ở phía browser/CDN
                'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=59',
            },
        });

    } catch (error) {
        console.error('RSS Fetch Error:', error);
        return NextResponse.json(
            { error: 'Không thể lấy dữ liệu RSS' },
            { status: 500 }
        );
    }
}