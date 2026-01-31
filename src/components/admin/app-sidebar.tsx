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
    FileText
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
        },
    ],

    // 2. KHU VỰC QUẢN LÝ BÀI VIẾT (Nơi làm việc chính)
    navContent: [
        {
            title: "Tạo bài viết mới", // Dễ hiểu hơn "Create Manual Post"
            url: "/admin/posts/create",
            icon: PenSquare,
        },
        {
            title: "Bài nháp & Chờ xử lý", // Nơi chứa bài chưa đăng
            url: "/admin/posts/drafts",
            icon: FileEdit,
        },
        {
            title: "Quản lý bài viết", // Menu này sẽ chứa các danh mục con
            url: "/admin/posts",
            icon: CheckCircle2,
            isActive: true, // Mặc định mở sẵn để dễ nhìn
            items: [], // Sẽ được đổ từ API
        },
        {
            title: "Lấy bài viết từ web",
            url: "/admin/crawler",
            icon: Globe,
            items: [
                {
                    title: "Bảng tổng quan",
                    url: "/admin/crawler",
                },
                {
                    title: "Nguồn RSS",
                    url: "/admin/crawler/rss",
                },
                {
                    title: "Cấu hình Selector",
                    url: "/admin/crawler/configs",
                },
                {
                    title: "Lịch sử cào tin",
                    url: "/admin/crawler/history",
                },
            ]
        },
        {
            title: "Duyệt tin đầu vào", // Nơi kiểm tra tin trước khi dùng
            url: "#",
            icon: Inbox,
            items: [
                {
                    title: "Tin thô từ web khác", // Thay cho "Raw Scraper Review"
                    url: "/admin/automation/review/raw",
                },
                {
                    title: "Bài viết do AI tạo", // Thay cho "AI Draft Review"
                    url: "/admin/automation/review/ai",
                },
            ],
        },
        {
            title: "Bài viết tạm ẩn", // Hoặc "Kho lưu trữ"
            url: "/admin/posts/archived",
            icon: EyeOff, // Sử dụng icon con mắt bị gạch chéo (EyeOff) từ lucide-react
        },
        {
            title: "Thùng rác", // Nơi chứa bài đã xóa
            url: "/admin/posts/trash",
            icon: Trash2,
        },
    ],

    // 3. QUẢN LÝ TUYỂN DỤNG
    navRecruitment: [
        {
            title: "Tin tuyển dụng",
            url: "/admin/recruitment/jobs",
            icon: Briefcase,
        },
        {
            title: "Hồ sơ ứng viên",
            url: "/admin/recruitment/candidates",
            icon: Users,
        },
        {
            title: "Lịch phỏng vấn",
            url: "/admin/recruitment/interviews",
            icon: UserCheck,
        },
        {
            title: "Mẫu bài thi/Test",
            url: "/admin/recruitment/templates",
            icon: FileText,
        },
    ],

    // 4. CẤU HÌNH HỆ THỐNG
    navSystem: [
        {
            title: "Quản lý chuyên mục", // Categories
            url: "/admin/categories",
            icon: Library,
        },
        {
            title: "Quản lý thẻ (Tags)",
            url: "/admin/tags",
            icon: Tags,
        },
        {
            title: "Kho Ảnh & Video", // Media Library
            url: "/admin/media",
            icon: Image,
        },
        {
            title: "Cấu hình AI Keys", // Thay cho Cài đặt kết nối
            url: "/admin/settings/ai-keys",
            icon: Sparkles,
        },
    ]
}

// --- COMPONENT GROUP MENU CHÍNH (Dùng cho Quản lý bài viết, Công cụ tự động) ---
function NavMain({
    items,
    label,
    pathname
}: {
    items: {
        title: string
        url: string
        icon?: React.ElementType
        isActive?: boolean
        items?: {
            title: string
            url: string
            icon?: React.ElementType
        }[]
    }[]
    label?: string
    pathname?: string
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

    return (
        <SidebarGroup>
            {/* Hiển thị tên nhóm menu (ví dụ: QUẢN LÝ NỘI DUNG) */}
            {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
            <SidebarMenu>
                {items.map((item) => (
                    <Collapsible
                        key={item.title}
                        asChild
                        defaultOpen={item.isActive}
                        className="group/collapsible"
                    >
                        <SidebarMenuItem>
                            {/* KIỂM TRA: Nếu mục này có menu con (items) */}
                            {item.items?.length ? (
                                <>
                                    {/* SPLIT BUTTON: Giao diện liền mạch, Active State chuẩn */}
                                    <div className="flex items-center w-full relative">
                                        <SidebarMenuButton
                                            asChild
                                            tooltip={item.title}
                                            isActive={isItemActive(item.url)} // ✅ Thêm Active State cho Parent
                                            className={cn("flex-1", !isCollapsed && "pr-10")} // Chừa chỗ cho mũi tên khi mở rộng
                                        >
                                            <a href={item.url}>
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
                                            {item.items.map((subItem) => (
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
                ))
                }
            </SidebarMenu >
        </SidebarGroup >
    )
}

// --- PHẦN CHÍNH CỦA THANH SIDEBAR ---
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname() // Hook để lấy URL hiện tại

    const [user, setUser] = React.useState({
        name: "Admin",
        email: "admin@congty.com",
        avatar: "/avatars/avatar.jpg",
    })

    React.useEffect(() => {
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
            try {
                const parsed = JSON.parse(storedUser)
                setUser({
                    name: parsed.fullName || "Admin",
                    email: parsed.email || "admin@congty.com",
                    avatar: parsed.avatarUrl || "/avatars/avatar.jpg",
                })
            } catch (e) { }
        }
    }, [])

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
                        icon: cat.icon ? categoryIcons[cat.icon] : Library,
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
                        {data.navDashboard.map((item) => (
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
                <NavMain items={navContent} label="Quản lý nội dung" pathname={pathname} />

                {/* 2.5 Nhóm Quản lý Tuyển dụng */}
                <NavMain items={data.navRecruitment} label="Quản lý tuyển dụng" pathname={pathname} />

                {/* 4. Nhóm Cài đặt hệ thống */}
                <SidebarGroup>
                    <SidebarGroupLabel>Hệ thống</SidebarGroupLabel>
                    <SidebarMenu>
                        {data.navSystem.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    asChild
                                    tooltip={item.title}
                                    isActive={isItemActive(item.url)}
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

            </SidebarContent>

            <SidebarFooter>
                {/* Thông tin người dùng - ĐÃ LOẠI BỎ THEO YÊU CẦU */}
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}