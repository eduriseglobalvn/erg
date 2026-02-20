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
};

/**
 * Tự động tạo Breadcrumb items từ URL path và page title
 */
export function generateBreadcrumbItems(pathname: string, pageTitle?: string, subdomainLabel: string = 'Trang chủ') {
    const segments = pathname.split('/').filter(Boolean);
    const items: BreadcrumbItem[] = [{ label: subdomainLabel, href: '/' }];

    let currentPath = '';
    segments.forEach((seg, i) => {
        currentPath += `/${seg}`;
        const isLast = i === segments.length - 1;

        // Nếu là segment cuối và có pageTitle, dùng pageTitle
        // Nếu không, tra cứu trong SEGMENT_LABELS hoặc dùng chính segment đó
        let label = SEGMENT_LABELS[seg] || seg.replace(/-/g, ' ');
        if (isLast && pageTitle) {
            label = pageTitle;
        }

        items.push({
            label: label.charAt(0).toUpperCase() + label.slice(1),
            href: isLast ? undefined : currentPath
        });
    });

    return items;
}
