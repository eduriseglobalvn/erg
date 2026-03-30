"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { usePathname } from "next/navigation"
import {
    AudioWaveform,
    BookOpen,
    Bot,
    Command,
    Frame,
    GalleryVerticalEnd,
    Map,
    PieChart,
    Settings2,
    SquareTerminal,
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
    ChevronRight,
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
    Shield
} from "lucide-react"

import { NavUser } from "@/components/admin/nav-user"
import { TeamSwitcher } from "@/components/admin/team-switcher"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    useSidebar,
} from "@/components/admin/ui/sidebar"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/admin/ui/collapsible"
import { postsApi } from "@/services/posts.api"
import { cn } from "@/lib/utils"

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
        name: "Admin",
        email: "admin@congty.com",
        avatar: "/avatars/avatar.jpg",
    },
    teams: [
        {
            name: "EDURISE GLOBAL ADMIN", // Tên công ty hiển thị ở góc trên cùng
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
            url: "/admin/posts/create",
            icon: PenSquare,
            permission: "posts.create",
        },
        {
            title: "Bài nháp & Chờ xử lý", // Nơi chứa bài chưa đăng
            url: "/admin/posts/drafts",
            icon: FileEdit,
            permission: "posts.read",
        },
        {
            title: "Quản lý bài viết", // Menu này sẽ chứa các danh mục con
            url: "/admin/posts",
            icon: CheckCircle2,
            isActive: true, // Mặc định mở sẵn để dễ nhìn
            permission: "posts.read",
            items: [], // Sẽ được đổ từ API
        },
        {
            title: "Lấy bài viết từ web",
            url: "/admin/crawler",
            icon: Globe,
            permission: "crawler.read",
            items: [
                {
                    title: "Bảng tổng quan",
                    url: "/admin/crawler",
                    permission: "crawler.read",
                },
                {
                    title: "Nguồn RSS",
                    url: "/admin/crawler/rss",
                    permission: "crawler.read",
                },
                {
                    title: "Cấu hình Selector",
                    url: "/admin/crawler/configs",
                    permission: "crawler.manage",
                },
                {
                    title: "Lịch sử cào tin",
                    url: "/admin/crawler/history",
                    permission: "crawler.read",
                },
                {
                    title: "Hot Topics",
                    url: "/admin/crawler/trending",
                    permission: "crawler.read",
                },
                {
                    title: "Blacklist",
                    url: "/admin/crawler/blacklist",
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
                    url: "/admin/automation/review/raw",
                    permission: "crawler.read",
                },
                {
                    title: "Bài viết do AI tạo", // Thay cho "AI Draft Review"
                    url: "/admin/automation/review/ai",
                    permission: "posts.read",
                },
            ],
        },
        {
            title: "Bài viết tạm ẩn", // Hoặc "Kho lưu trữ"
            url: "/admin/posts/archived",
            icon: EyeOff, // Sử dụng icon con mắt bị gạch chéo (EyeOff) từ lucide-react
            permission: "posts.read",
        },
        {
            title: "Thùng rác", // Nơi chứa bài đã xóa
            url: "/admin/posts/trash",
            icon: Trash2,
            permission: "posts.delete",
        },
    ],

    // KHÓA HỌC (Thêm mới)
    navCourses: [
        {
            title: "Quản lý khóa học",
            url: "/admin/courses",
            icon: GraduationCap,
            permission: "courses.read",
        },
        {
            title: "E-Learning",
            url: "/admin/elearning",
            icon: BookOpen,
            permission: "courses.read",
        },
    ],

    // 3. QUẢN LÝ TUYỂN DỤNG
    navRecruitment: [
        {
            title: "Tin tuyển dụng",
            url: "/admin/recruitment/jobs",
            icon: Briefcase,
            permission: "recruitment.read",
        },
        {
            title: "Hồ sơ ứng viên",
            url: "/admin/recruitment/candidates",
            icon: Users,
            permission: "recruitment.read",
        },
        {
            title: "Lịch phỏng vấn",
            url: "/admin/recruitment/interviews",
            icon: UserCheck,
            permission: "recruitment.read",
        },
        {
            title: "Mẫu bài thi/Test",
            url: "/admin/recruitment/templates",
            icon: FileText,
            permission: "recruitment.read",
        },
    ],

    // 4. CẤU HÌNH HỆ THỐNG
    navSystem: [
        {
            title: "Người dùng",
            url: "/admin/users",
            icon: Users,
            permission: "users.read",
        },
        {
            title: "Phân quyền",
            url: "/admin/access-control",
            icon: Shield,
            permission: "roles.read",
        },
        {
            title: "Quản lý chuyên mục", // Categories
            url: "/admin/categories",
            icon: Library,
            permission: "categories.read",
        },
        {
            title: "Quản lý thẻ (Tags)",
            url: "/admin/tags",
            icon: Tags,
            permission: "tags.read",
        },
        {
            title: "Kho Ảnh & Video", // Media Library
            url: "/admin/media",
            icon: Image,
            permission: "media.read",
        },
        {
            title: "Cấu hình AI Keys", // Thay cho Cài đặt kết nối
            url: "/admin/settings/ai-keys",
            icon: Sparkles,
            permission: "settings.read",
        },
        {
            title: "Giám sát hệ thống",
            url: "/admin/monitoring",
            icon: Activity,
            permission: "settings.read",
        },
        {
            title: "Cài đặt chung",
            url: "/admin/settings",
            icon: Settings2,
            permission: "settings.read",
        },
        {
            title: "🤖 ERG Bot",
            url: "/admin/bot",
            icon: Bot,
            permission: "posts.read",
            items: [
                {
                    title: "Control Center",
                    url: "/admin/bot",
                    permission: "posts.read",
                },
                {
                    title: "Kết nối Bot",
                    url: "/admin/bot/link",
                    permission: "posts.read",
                },
            ],
        },
    ],

    // 5. QUẢN LÝ SEO & TRUYỀN THÔNG
    navSeo: [
        {
            title: "Danh mục SEO",
            url: "/admin/seo",
            icon: Search,
            permission: "seo.read",
            items: [
                {
                    title: "Dashboard",
                    url: "/admin/seo",
                    icon: PieChart,
                    permission: "seo.read",
                },
                {
                    title: "Auto-Linking",
                    url: "/admin/seo/keywords",
                    icon: LinkIcon,
                    permission: "seo.read",
                },
                {
                    title: "Theo dõi lỗi 404",
                    url: "/admin/seo/404s",
                    icon: Activity,
                    permission: "seo.read",
                },
                {
                    title: "Quản lý Redirects",
                    url: "/admin/seo/redirects",
                    icon: Shield,
                    permission: "seo.read",
                },
            ]
        }
    ]
}

// --- HÀM KIỂM TRA QUYỀN ---
const hasPermission = (userPermissions: string[], permission?: string | null) => {
    if (!permission) return true;
    if (userPermissions.includes('*')) return true; // Admin có mọi quyền
    return userPermissions.includes(permission);
};

// --- COMPONENT GROUP MENU CHÍNH (Dùng cho Quản lý bài viết, Công cụ tự động) ---
function NavMain({
    items,
    label,
    pathname,
    userPermissions,
}: {
    items: {
        title: string
        url: string
        icon?: React.ElementType
        isActive?: boolean
        permission?: string | null
        items?: {
            title: string
            url: string
            icon?: React.ElementType
            permission?: string | null
        }[]
    }[]
    label?: string
    pathname?: string
    userPermissions: string[]
}) {
    const { state } = useSidebar()
    const isCollapsed = state === "collapsed"

    const isItemActive = (url: string) => {
        if (!pathname) return false
        if (url === "#") return false // Collapsible items không được active
        if (url === "/") {
            return pathname === "/" || pathname === ""
        }
        return pathname.startsWith(url)
    }

    // Filter root items
    const visibleItems = items.filter(item => hasPermission(userPermissions, item.permission));

    if (visibleItems.length === 0) return null;

    return (
        <SidebarGroup>
            {/* Hiển thị tên nhóm menu (ví dụ: QUẢN LÝ NỘI DUNG) */}
            {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
            <SidebarMenu>
                {visibleItems.map((item) => {
                    // Filter sub-items
                    const visibleSubItems = item.items?.filter(sub => hasPermission(userPermissions, sub.permission)) || [];

                    return (
                        <Collapsible
                            key={item.title}
                            asChild
                            defaultOpen={item.isActive}
                            className="group/collapsible"
                        >
                            <SidebarMenuItem>
                                {/* KIỂM TRA: Nếu mục này có menu con (items) và còn it nhất 1 item được hiển thị */}
                                {visibleSubItems.length > 0 ? (
                                    <>
                                        {/* SPLIT BUTTON: Giao diện liền mạch, Active State chuẩn */}
                                        <div className="flex items-center w-full relative">
                                            <SidebarMenuButton
                                                asChild
                                                tooltip={item.title}
                                                isActive={isItemActive(item.url)} // ✅ Thêm Active State cho Parent
                                                className={cn("flex-1", !isCollapsed && "pr-10")} // Chừa chỗ cho mũi tên khi mở rộng
                                            >
                                                <a href={item.url === "#" ? visibleSubItems[0].url : item.url}>
                                                    {item.icon && <item.icon />}
                                                    <span className="font-medium">{item.title}</span>
                                                </a>
                                            </SidebarMenuButton>

                                            {/* BIẾN MẤT KHI THU NHỎ SIDEBAR */}
                                            {!isCollapsed && (
                                                <CollapsibleTrigger asChild>
                                                    {/* Nút Toggle: Size đại (40px box, 28px icon) */}
                                                    <button className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 flex items-center justify-center rounded-md text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 z-20 transition-all focus-visible:outline-none">
                                                        <ChevronRight className="h-7 w-7 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                                        <span className="sr-only">Toggle</span>
                                                    </button>
                                                </CollapsibleTrigger>
                                            )}
                                        </div>
                                        <CollapsibleContent>
                                            <SidebarMenuSub>
                                                {visibleSubItems.map((subItem) => (
                                                    <SidebarMenuSubItem key={subItem.title}>
                                                        <SidebarMenuSubButton
                                                            asChild
                                                            isActive={isItemActive(subItem.url)}
                                                        >
                                                            <a href={subItem.url}>
                                                                {subItem.icon && <subItem.icon className="mr-2 h-4 w-4" />}
                                                                <span>{subItem.title}</span>
                                                            </a>
                                                        </SidebarMenuSubButton>
                                                    </SidebarMenuSubItem>
                                                ))}
                                            </SidebarMenuSub>
                                        </CollapsibleContent>
                                    </>
                                ) : (
                                    /* TRƯỜNG HỢP KHÁC: Nếu không có menu con, chỉ là link thường */
                                    <SidebarMenuButton
                                        asChild
                                        tooltip={item.title}
                                        isActive={isItemActive(item.url)}
                                    >
                                        <a href={item.url}>
                                            {item.icon && <item.icon />}
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                )}
                            </SidebarMenuItem>
                        </Collapsible>
                    )
                })}
            </SidebarMenu >
        </SidebarGroup >
    )
}

import { usePermissions } from "@/hooks/use-permission"
import { useAuth } from "@/hooks/use-auth"

// --- PHẦN CHÍNH CỦA THANH SIDEBAR ---
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname() // Hook để lấy URL hiện tại
    const permissions = usePermissions() // Lấy quyền hiện tại sử dụng hook usePermissions

    const { data: auth, isLoading } = useAuth()

    // Tạo user object chuẩn bị cho UI
    const user = {
        name: auth?.user?.fullName || "Admin",
        email: auth?.user?.email || "admin@congty.com",
        avatar: auth?.user?.avatarUrl || "/avatars/avatar.jpg",
    }

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
                        url: `/admin/posts/${cat.slug}`,
                        icon: cat.icon && categoryIcons[cat.icon] ? categoryIcons[cat.icon] : Library,
                        permission: "posts.read"
                    }))
                }
            }
            return item
        })
    }, [categories])

    // Helper function để check active state
    const isItemActive = (url: string) => {
        if (!pathname) return false
        if (url === "/") {
            return pathname === "/" || pathname === ""
        }
        return pathname.startsWith(url)
    }

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                {/* Phần chọn team/công ty ở trên cùng */}
                <TeamSwitcher teams={data.teams} />
            </SidebarHeader>

            <SidebarContent>
                {/* 1. Khu vực Bảng tổng quan */}
                <SidebarGroup>
                    <SidebarMenu>
                        {data.navDashboard.filter(item => hasPermission(permissions, item.permission)).map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={isItemActive(item.url)}
                                    tooltip={item.title}
                                >
                                    <a href={item.url}>
                                        <item.icon />
                                        <span>{item.title}</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>

                {/* 2. Nhóm Quản lý bài viết */}
                <NavMain items={navContent} label="Quản lý nội dung" pathname={pathname} userPermissions={permissions} />

                {/* Khóa học */}
                <NavMain items={data.navCourses} label="Học tập" pathname={pathname} userPermissions={permissions} />

                {/* 2.5 Nhóm Quản lý Tuyển dụng */}
                <NavMain items={data.navRecruitment} label="Quản lý tuyển dụng" pathname={pathname} userPermissions={permissions} />

                {/* 3. Nhóm Quản lý SEO */}
                <NavMain items={data.navSeo} label="Tối ưu hóa SEO" pathname={pathname} userPermissions={permissions} />

                {/* 4. Nhóm Cài đặt hệ thống */}
                <NavMain items={data.navSystem} label="Hệ thống" pathname={pathname} userPermissions={permissions} />

            </SidebarContent>

            <SidebarFooter>
                {/* Thông tin người dùng - ĐÃ LOẠI BỎ THEO YÊU CẦU */}
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}