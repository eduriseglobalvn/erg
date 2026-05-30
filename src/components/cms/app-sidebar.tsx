"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { usePathname } from "next/navigation"
import {
    GalleryVerticalEnd,
    LayoutDashboard,
    PenSquare,
    FileEdit,
    CheckCircle2,
    Trash2,
    Sparkles,
    Globe,
    Inbox,
    Library,
    Tags,
    Image,
    Type,
    Building2,
    GraduationCap,
    Lightbulb, EyeOff,
    Briefcase,
    Users,
    UserCheck,
    FileText,
    Search,
    Link as LinkIcon,
    Activity,
    Shield,
    ShieldCheck,
    Bot,
    BookOpen,
    Settings2,
    PieChart
} from "lucide-react"

import { TeamSwitcher } from "@/components/cms/team-switcher"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/cms/ui/sidebar"
import { postsApi } from "@/services/posts.api"
import { usePermissions } from "@/hooks/use-permission"

const categoryIcons: Record<string, React.ElementType> = {
    "GraduationCap": GraduationCap,
    "Lightbulb": Lightbulb,
    "Building2": Building2,
    "PenSquare": PenSquare,
    "FileEdit": FileEdit,
    "CheckCircle2": CheckCircle2,
    "Trash2": Trash2,
    "Sparkles": Sparkles,
    "Globe": Globe,
    "Inbox": Inbox,
    "Library": Library,
    "Tags": Tags,
    "Image": Image,
    "Type": Type,
    "LayoutDashboard": LayoutDashboard,
    "BookOpen": BookOpen,
    "Bot": Bot,
}

// --- CẤU HÌNH DỮ LIỆU MENU (VIỆT HÓA) ---
const data = {
    user: {
        name: "CMS",
        email: "admin@congty.com",
        avatar: "/avatars/avatar.jpg",
    },
    teams: [
        {
            name: "EDURISE GLOBAL CMS", // Tên công ty hiển thị ở góc trên cùng
            logo: GalleryVerticalEnd,
            plan: "Hệ thống quản trị nội dung",
        },
    ],

    // 1. TRANG CHỦ (Bảng tổng quan)
    navDashboard: [
        {
            title: "Dashboard", // Thay cho "Dashboard"
            url: "/",
            icon: LayoutDashboard,
            isActive: true,
            permission: null,
        },
    ],

    // 2. KHU VỰC QUẢN LÝ BÀI VIẾT (Nơi làm việc chính)
    navContent: [
        {
            title: "Tạo bài viết mới", // Dễ hiểu hơn "Create Manual Post"
            url: "/posts/create",
            icon: PenSquare,
            permission: "posts.create",
        },
        {
            title: "Bài nháp & Chờ xử lý", // Nơi chứa bài chưa đăng
            url: "/posts/drafts",
            icon: FileEdit,
            permission: "posts.read",
        },
        {
            title: "Quản lý bài viết", // Menu này sẽ chứa các danh mục con
            url: "/posts",
            icon: CheckCircle2,
            isActive: true, // Mặc định mở sẵn để dễ nhìn
            permission: "posts.read",
            items: [], // Sẽ được đổ từ API
        },
        {
            title: "Lấy bài viết từ web",
            url: "/cms/crawler",
            icon: Globe,
            permission: "crawler.read",
            items: [
                {
                    title: "Bảng tổng quan",
                    url: "/cms/crawler",
                    permission: "crawler.read",
                },
                {
                    title: "Nguồn RSS",
                    url: "/crawler/rss",
                    permission: "crawler.read",
                },
                {
                    title: "Cấu hình Selector",
                    url: "/crawler/configs",
                    permission: "crawler.manage",
                },
                {
                    title: "Lịch sử cào tin",
                    url: "/crawler/history",
                    permission: "crawler.read",
                },
                {
                    title: "Hot Topics",
                    url: "/crawler/trending",
                    permission: "crawler.read",
                },
                {
                    title: "Blacklist",
                    url: "/crawler/blacklist",
                    permission: "system.settings",
                },
            ]
        },
        {
            title: "Duyệt tin đầu vào", // Nơi kiểm tra tin trước khi dùng
            url: "#",
            icon: Inbox,
            permission: "posts.update",
            items: [
                {
                    title: "Tin thô từ web khác", // Thay cho "Raw Scraper Review"
                    url: "/automation/review/raw",
                    permission: "crawler.read",
                },
                {
                    title: "Bài viết do AI tạo", // Thay cho "AI Draft Review"
                    url: "/automation/review/ai",
                    permission: "posts.read",
                },
            ],
        },
        {
            title: "Bài viết tạm ẩn", // Hoặc "Kho lưu trữ"
            url: "/posts/archived",
            icon: EyeOff, // Sử dụng icon con mắt bị gạch chéo (EyeOff) từ lucide-react
            permission: "posts.read",
        },
        {
            title: "Thùng rác", // Nơi chứa bài đã xóa
            url: "/posts/trash",
            icon: Trash2,
            permission: "posts.delete",
        },
    ],

    // KHÓA HỌC (Thêm mới)
    navCourses: [
        {
            title: "Quản lý khóa học",
            url: "/courses",
            icon: GraduationCap,
            permission: "courses.read",
        },
        {
            title: "E-Learning",
            url: "/elearning",
            icon: BookOpen,
            permission: "courses.read",
        },
    ],

    // 3. QUẢN LÝ TUYỂN DỤNG
    navRecruitment: [
        {
            title: "Tin tuyển dụng",
            url: "/recruitment/jobs",
            icon: Briefcase,
            permission: "recruitment.read",
        },
        {
            title: "Hồ sơ ứng viên",
            url: "/recruitment/candidates",
            icon: Users,
            permission: "recruitment.read",
        },
        {
            title: "Lịch phỏng vấn",
            url: "/recruitment/interviews",
            icon: UserCheck,
            permission: "recruitment.read",
        },
        {
            title: "Mẫu bài thi/Test",
            url: "/recruitment/templates",
            icon: FileText,
            permission: "recruitment.read",
        },
    ],

    // 4. CẤU HÌNH HỆ THỐNG
    navSystem: [
        {
            title: "Người dùng",
            url: "/users",
            icon: Users,
            permission: "users.read",
        },
        {
            title: "Hồ sơ Công khai",
            url: "/public-disclosure",
            icon: ShieldCheck,
            permission: "posts.read",
        },
        {
            title: "Phân quyền",
            url: "/access-control",
            icon: Shield,
            permission: "roles.read",
        },
        {
            title: "Quản lý chuyên mục", // Categories
            url: "/categories",
            icon: Library,
            permission: "categories.read",
        },
        {
            title: "Quản lý thẻ (Tags)",
            url: "/tags",
            icon: Tags,
            permission: "tags.read",
        },
        {
            title: "Kho Ảnh & Video", // Media Library
            url: "/cms/media",
            icon: Image,
            permission: "media.read",
        },
        {
            title: "AI API Keys",
            url: "/cms/settings/ai-keys",
            icon: Sparkles,
            permission: "api-keys.read",
        },
        {
            title: "Giám sát hệ thống",
            url: "/cms/monitoring",
            icon: Activity,
            permission: "settings.read",
        },
        {
            title: "Cài đặt chung",
            url: "/cms/settings",
            icon: Settings2,
            permission: "settings.read",
        },
        {
            title: "🤖 ERG Bot",
            url: "/cms/bot",
            icon: Bot,
            permission: "posts.read",
            items: [
                {
                    title: "Control Center",
                    url: "/cms/bot",
                    permission: "posts.read",
                },
                {
                    title: "Kết nối Bot",
                    url: "/cms/bot/link",
                    permission: "posts.read",
                },
            ],
        },
    ],

    // 5. QUẢN LÝ SEO & TRUYỀN THÔNG
    navSeo: [
        {
            title: "Danh mục SEO",
            url: "/cms/seo",
            icon: Search,
            permission: "seo.read",
            items: [
                {
                    title: "Dashboard",
                    url: "/cms/seo",
                    icon: PieChart,
                    permission: "seo.read",
                },
                {
                    title: "Auto-Linking",
                    url: "/cms/seo/keywords",
                    icon: LinkIcon,
                    permission: "seo.read",
                },
                {
                    title: "Theo dõi lỗi 404",
                    url: "/cms/seo/404s",
                    icon: Activity,
                    permission: "seo.read",
                },
                {
                    title: "Quản lý Redirects",
                    url: "/cms/seo/redirects",
                    icon: Shield,
                    permission: "seo.read",
                },
            ]
        }
    ]
}

// Sub-components
import { AppSidebarNav } from "@/components/cms/app-sidebar-nav"

// --- PHẦN CHÍNH CỦA THANH SIDEBAR ---
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname()
    const permissions = usePermissions()

    // Dynamic categories for "Quản lý bài viết"
    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: () => postsApi.getCategories()
    })

    const navContent = React.useMemo(() => {
        return data.navContent.map(item => {
            if (item.title === "Quản lý bài viết" && categories) {
                return {
                    ...item,
                    items: categories.map(cat => ({
                        title: cat.name,
                        url: `/posts/${cat.slug}`,
                        icon: cat.icon && categoryIcons[cat.icon] ? categoryIcons[cat.icon] : Library,
                        permission: "posts.read"
                    }))
                }
            }
            return item
        })
    }, [categories])

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <TeamSwitcher teams={data.teams} />
            </SidebarHeader>

            <SidebarContent>
                <AppSidebarNav
                    navContent={navContent}
                    navCourses={data.navCourses}
                    navRecruitment={data.navRecruitment}
                    navSeo={data.navSeo}
                    navSystem={data.navSystem}
                />
            </SidebarContent>

            <SidebarFooter />
            <SidebarRail />
        </Sidebar>
    )
}
