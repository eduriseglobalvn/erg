"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import {
    LayoutDashboard,
    PenSquare,
    FileEdit,
    CheckCircle2,
    Trash2,
    Sparkles,
    Globe,
    Inbox,
    EyeOff,
    GraduationCap,
    BookOpen,
    Briefcase,
    Users,
    UserCheck,
    FileText,
    Search,
    Link as LinkIcon,
    Activity,
    Shield,
    Settings2,
    Library,
    Tags,
    Image,
    Bot,
    PieChart,
    ChevronRight,
} from "lucide-react"
import {
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSubItem,
    SidebarMenuSubButton,
    SidebarMenuSub,
    SidebarMenu,
    SidebarGroup,
    SidebarGroupLabel,
} from "@/components/admin/ui/sidebar"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/admin/ui/collapsible"
import { useSidebar } from "@/components/admin/ui/sidebar"
import { usePermissions } from "@/hooks/use-permission"
import { cn } from "@/lib/utils"

// --- CẤU HÌNH MENU (CÓ THỂ IMPORT TỪ app-sidebar.tsx) ---
const categoryIcons: Record<string, React.ElementType> = {
    "GraduationCap": GraduationCap,
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
    "LayoutDashboard": LayoutDashboard,
    "BookOpen": BookOpen,
    "Bot": Bot,
}

const hasPermission = (userPermissions: string[], permission?: string | null) => {
    if (!permission) return true;
    if (userPermissions.includes('*')) return true;
    return userPermissions.includes(permission);
};

// --- COMPONENT GROUP MENU ---
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
        if (url === "#") return false
        if (url === "/") {
            return pathname === "/" || pathname === ""
        }
        return pathname.startsWith(url)
    }

    const visibleItems = items.filter(item => hasPermission(userPermissions, item.permission));
    if (visibleItems.length === 0) return null;

    return (
        <SidebarGroup>
            {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
            <SidebarMenu>
                {visibleItems.map((item) => {
                    const visibleSubItems = item.items?.filter(sub => hasPermission(userPermissions, sub.permission)) || [];

                    return (
                        <Collapsible
                            key={item.title}
                            asChild
                            defaultOpen={item.isActive}
                            className="group/collapsible"
                        >
                            <SidebarMenuItem>
                                {visibleSubItems.length > 0 ? (
                                    <>
                                        <div className="flex items-center w-full relative">
                                            <SidebarMenuButton
                                                asChild
                                                tooltip={item.title}
                                                isActive={isItemActive(item.url)}
                                                className={cn("flex-1", !isCollapsed && "pr-10")}
                                            >
                                                <a href={item.url === "#" ? visibleSubItems[0].url : item.url}>
                                                    {item.icon && <item.icon />}
                                                    <span className="font-medium">{item.title}</span>
                                                </a>
                                            </SidebarMenuButton>

                                            {!isCollapsed && (
                                                <CollapsibleTrigger asChild>
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

interface AppSidebarNavProps {
    navContent: {
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
    navCourses: {
        title: string
        url: string
        icon?: React.ElementType
        isActive?: boolean
        permission?: string | null
        items?: any[]
    }[]
    navRecruitment: {
        title: string
        url: string
        icon?: React.ElementType
        permission?: string | null
        items?: any[]
    }[]
    navSeo: {
        title: string
        url: string
        icon?: React.ElementType
        permission?: string | null
        items?: any[]
    }[]
    navSystem: {
        title: string
        url: string
        icon?: React.ElementType
        permission?: string | null
        items?: any[]
    }[]
}

export function AppSidebarNav({ navContent, navCourses, navRecruitment, navSeo, navSystem }: AppSidebarNavProps) {
    const pathname = usePathname()
    const permissions = usePermissions()

    // Dashboard nav item (always shown)
    const navDashboard = [
        {
            title: "Dashboard",
            url: "/",
            icon: LayoutDashboard,
            isActive: true,
            permission: null,
        },
    ]

    return (
        <>
            {/* Dashboard */}
            <SidebarGroup>
                <SidebarMenu>
                    {navDashboard.filter(item => hasPermission(permissions, item.permission)).map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={pathname === item.url}
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

            {/* Content Management */}
            <NavMain items={navContent} label="Quản lý nội dung" pathname={pathname} userPermissions={permissions} />

            {/* Courses */}
            <NavMain items={navCourses} label="Học tập" pathname={pathname} userPermissions={permissions} />

            {/* Recruitment */}
            <NavMain items={navRecruitment} label="Quản lý tuyển dụng" pathname={pathname} userPermissions={permissions} />

            {/* SEO */}
            <NavMain items={navSeo} label="Tối ưu hóa SEO" pathname={pathname} userPermissions={permissions} />

            {/* System */}
            <NavMain items={navSystem} label="Hệ thống" pathname={pathname} userPermissions={permissions} />
        </>
    )
}
