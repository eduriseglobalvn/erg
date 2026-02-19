"use client"

import * as React from "react"
import { Bell, CheckCircle, XCircle, Globe, AlertTriangle, X, Check } from "lucide-react"
import { useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import { vi } from "date-fns/locale"
import { useNotifications } from "@/hooks/useNotifications"
import { Notification, NotificationType, NotificationStatus } from "@/types/notification"
import { Button } from "@/components/admin/ui/button"
import { Badge } from "@/components/admin/ui/badge"
import { ScrollArea } from "@/components/admin/ui/scroll-area"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/admin/ui/dropdown-menu"
import { cn } from "@/lib/utils"

const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
        case NotificationType.AI_POST_COMPLETED:
            return <CheckCircle className="h-5 w-5 text-green-500" />
        case NotificationType.AI_POST_FAILED:
            return <XCircle className="h-5 w-5 text-red-500" />
        case NotificationType.CRAWL_COMPLETED:
            return <Globe className="h-5 w-5 text-blue-500" />
        case NotificationType.CRAWL_FAILED:
            return <AlertTriangle className="h-5 w-5 text-orange-500" />
        case NotificationType.CRAWL_BATCH_COMPLETED:
            return <CheckCircle className="h-5 w-5 text-blue-500" />
        default:
            return <Bell className="h-5 w-5 text-gray-500" />
    }
}

interface NotificationItemProps {
    notification: Notification
    onMarkAsRead: (id: string) => void
    onDelete: (id: string) => void
    onNavigate: (postId?: string) => void
}

const NotificationItem = ({ notification, onMarkAsRead, onDelete, onNavigate }: NotificationItemProps) => {
    const isUnread = notification.status === NotificationStatus.UNREAD

    const handleClick = () => {
        if (isUnread) {
            onMarkAsRead(notification.id)
        }
        if (notification.metadata?.postId) {
            onNavigate(notification.metadata.postId)
        }
    }

    return (
        <div
            className={cn(
                "group relative p-4 border-b transition-all hover:bg-muted/50 cursor-pointer",
                isUnread ? "bg-blue-50 border-blue-200" : "bg-white border-gray-200"
            )}
            onClick={handleClick}
        >
            <div className="flex gap-3">
                <div className="flex-shrink-0 mt-0.5">
                    {getNotificationIcon(notification.type)}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <h4 className={cn(
                            "text-sm",
                            isUnread ? "font-semibold text-gray-900" : "font-medium text-gray-700"
                        )}>
                            {notification.title}
                        </h4>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                            onClick={(e) => {
                                e.stopPropagation()
                                onDelete(notification.id)
                            }}
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    </div>

                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {notification.message}
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-gray-400">
                            {formatDistanceToNow(new Date(notification.createdAt), {
                                addSuffix: true,
                                locale: vi
                            })}
                        </span>

                        {notification.metadata?.title && (
                            <span className="text-xs text-gray-500 truncate">
                                • {notification.metadata.title}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export function NotificationBell() {
    const router = useRouter()
    const [isOpen, setIsOpen] = React.useState(false)
    const { notifications, unreadCount, loading, markAsRead, markAllAsRead, deleteNotification } = useNotifications(true, 30000)

    const handleNavigate = (postId?: string) => {
        if (postId) {
            router.push(`/admin/posts/${postId}`)
            setIsOpen(false)
        }
    }

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <Badge
                            className="absolute -top-1 -right-1 h-5 min-w-[20px] flex items-center justify-center p-0 px-1 bg-red-500 hover:bg-red-600 text-white border-2 border-white text-xs animate-pulse"
                        >
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-[400px] p-0 bg-popover shadow-xl border border-border">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b bg-muted/30">
                    <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4 text-primary" />
                        <h3 className="font-semibold text-sm">Thông báo</h3>
                        {unreadCount > 0 && (
                            <Badge variant="secondary" className="text-xs">
                                {unreadCount} mới
                            </Badge>
                        )}
                    </div>

                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs text-blue-600 hover:text-blue-700"
                            onClick={() => markAllAsRead()}
                        >
                            <Check className="h-3 w-3 mr-1" />
                            Đánh dấu tất cả
                        </Button>
                    )}
                </div>

                {/* Content */}
                <ScrollArea className="h-[500px]">
                    {loading ? (
                        <div className="flex items-center justify-center h-48">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : (notifications || []).length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-48 text-center px-4">
                            <Bell className="h-12 w-12 text-gray-300 mb-3" />
                            <p className="text-sm text-gray-500 font-medium">Không có thông báo</p>
                            <p className="text-xs text-gray-400 mt-1">Bạn sẽ nhận thông báo khi có bài viết mới</p>
                        </div>
                    ) : (
                        <div>
                            {(notifications || []).map((notification) => (
                                <NotificationItem
                                    key={notification.id}
                                    notification={notification}
                                    onMarkAsRead={markAsRead}
                                    onDelete={deleteNotification}
                                    onNavigate={handleNavigate}
                                />
                            ))}
                        </div>
                    )}
                </ScrollArea>

                {/* Footer */}
                {(notifications || []).length > 0 && (
                    <div className="p-3 border-t bg-muted/30">
                        <Button
                            variant="ghost"
                            className="w-full h-8 text-xs text-primary hover:text-primary/80"
                            onClick={() => {
                                router.push('/admin/notifications')
                                setIsOpen(false)
                            }}
                        >
                            Xem tất cả thông báo
                        </Button>
                    </div>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
