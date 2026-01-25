"use client"

import * as React from "react"
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
    Lightbulb, EyeOff
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
} from "@/components/admin/ui/sidebar"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/admin/ui/collapsible"

// --- CẤU HÌNH DỮ LIỆU MENU (VIỆT HÓA) ---
const data = {
    user: {
        name: "Admin",
        email: "admin@congty.com",
        avatar: "/avatars/avatar.jpg",
    },
    teams: [
        {
            name: "Công Ty ABC", // Tên công ty hiển thị ở góc trên cùng
            logo: GalleryVerticalEnd,
            plan: "Gói Doanh Nghiệp",
        },
        {
            name: "Dự Án Phụ",
            logo: AudioWaveform,
            plan: "Khởi nghiệp",
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
            url: "/posts/create",
            icon: PenSquare,
        },
        {
            title: "Bài nháp & Chờ xử lý", // Nơi chứa bài chưa đăng
            url: "/admin/posts/drafts",
            icon: FileEdit,
        },
        {
            title: "Quản lý bài viết", // Menu này sẽ chứa các danh mục con
            url: "#",
            icon: CheckCircle2,
            isActive: true, // Mặc định mở sẵn để dễ nhìn
            items: [
                {
                    title: "Tin Giáo dục",
                    url: "/admin/posts/published/education",
                    icon: GraduationCap,
                },
                {
                    title: "Mẹo & Thủ thuật",
                    url: "/admin/posts/published/tips",
                    icon: Lightbulb,
                },
                {
                    title: "Hoạt động công ty",
                    url: "/admin/posts/published/company",
                    icon: Building2,
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

    // 3. CÔNG CỤ TỰ ĐỘNG (AI & Lấy tin)
    navAutomation: [
        {
            title: "Tạo bài viết bằng AI", // Thay cho "AI Generator"
            url: "/admin/automation/ai-generate",
            icon: Sparkles,
        },
        {
            title: "Lấy bài viết từ web", // Thay cho "Web Crawler" cho dễ hiểu
            url: "/admin/automation/crawler",
            icon: Globe,
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
    ],

    // 4. CẤU HÌNH HỆ THỐNG
    navSystem: [
        {
            title: "Quản lý chuyên mục", // Categories
            url: "/admin/taxonomy/categories",
            icon: Library,
        },
        {
            title: "Quản lý thẻ (Tags)",
            url: "/admin/taxonomy/tags",
            icon: Tags,
        },
        {
            title: "Kho Ảnh & Video", // Media Library
            url: "/admin/media",
            icon: Image,
        },
        {
            title: "Cài đặt kết nối", // Settings
            url: "/admin/settings",
            icon: Settings2,
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
    // Helper để check active state
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
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton tooltip={item.title}>
                                            {item.icon && <item.icon />}
                                            <span>{item.title}</span>
                                            {/* Mũi tên xoay khi đóng mở */}
                                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
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
                ))}
            </SidebarMenu>
        </SidebarGroup>
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

    // Helper function để check active state
    const isItemActive = (url: string) => {
        if (url === "/") {
            return pathname === "/" || pathname === ""
        }
        return pathname?.startsWith(url) || false
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
                <NavMain items={data.navContent} label="Quản lý nội dung" pathname={pathname} />

                {/* 3. Nhóm Công cụ tự động */}
                <NavMain items={data.navAutomation} label="Công cụ tự động" pathname={pathname} />

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
                {/* Thông tin người dùng ở dưới cùng */}
                <NavUser user={user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}