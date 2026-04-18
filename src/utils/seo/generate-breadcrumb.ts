export interface BreadcrumbItem {
    label: string;
    href?: string;
}

const SEGMENT_LABELS: Record<string, string> = {
    'tin-tuc': 'Tin tức',
    'khoa-hoc': 'Khóa học',
    'lien-he': 'Liên hệ',
    've-chung-toi': 'Về chúng tôi',
    'tuyendung': 'Tuyển dụng',
    'lo-trinh': 'Lộ trình',
    'doi-ngu-giao-vien': 'Đội ngũ giáo viên',
    'van-hoa': 'Văn hóa & Hoạt động',
    'danh-muc': 'Danh mục',
    'cong-khai': 'Công khai',
    'phap-ly': 'Pháp lý',
    'hoc-phi': 'Học phí',
    'kiem-dinh-chat-luong': 'Kiểm định chất lượng',
    'ke-hoach-giang-day': 'Kế hoạch giảng dạy',
    'chung-nhan-hoat-dong-chi-nhanh': 'Chứng nhận hoạt động chi nhánh',
};

/**
 * Tự động tạo Breadcrumb items từ URL path và page title (Tối ưu SEO - Limit 60 ký tự cho Post Title)
 */
export function generateBreadcrumbItems(
    pathname: string,
    pageTitle?: string,
    subdomainLabel: string = 'Trang chủ',
    categoryName?: string
) {
    const segments = pathname.split('/').filter(Boolean);
    const items: BreadcrumbItem[] = [{ label: subdomainLabel, href: '/' }];

    let currentPath = '';

    // Xử lý các segment trung gian
    segments.forEach((seg, i) => {
        currentPath += `/${seg}`;
        const isLast = i === segments.length - 1;

        // Nếu là chuyên mục được truyền vào (đi kèm với bài viết/khóa học)
        if (i === segments.length - 2 && categoryName) {
            items.push({
                label: categoryName,
                href: currentPath
            });
            return;
        }

        // Nếu là segment cuối và có pageTitle, dùng pageTitle (cắt ngắn 60 ký tự theo chuẩn Google SERP)
        let label = SEGMENT_LABELS[seg] || seg.replace(/-/g, ' ');
        if (isLast && pageTitle) {
            label = pageTitle.length > 60 ? pageTitle.substring(0, 57) + '...' : pageTitle;
        }

        // Chỉ thêm vào nếu không bị trùng với categoryName đã thêm trước đó
        if (!categoryName || i !== segments.length - 2) {
            items.push({
                label: label.charAt(0).toUpperCase() + label.slice(1),
                href: isLast ? undefined : currentPath
            });
        }
    });

    return items;
}
