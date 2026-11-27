import { Monitor, Smartphone, Tablet } from "lucide-react"

export const blockCategories = ["Tất cả", "Mẫu bài", "Nội dung", "Media", "Bố cục", "Giáo dục", "Chuyển đổi", "Tin tức", "SEO/Trust"] as const

export const previewModes = [
    { id: "desktop", label: "Desktop", icon: Monitor, width: "w-full", frame: "rounded-2xl" },
    { id: "tablet", label: "Tablet", icon: Tablet, width: "max-w-[760px]", frame: "rounded-[28px]" },
    { id: "mobile", label: "Mobile", icon: Smartphone, width: "max-w-[390px]", frame: "rounded-[32px]" },
] as const

export const bgOptions = [
    { value: "plain", label: "Trắng", className: "bg-white" },
    { value: "soft", label: "Xanh nhạt", className: "bg-blue-50" },
    { value: "course-hero", label: "Hero xanh", className: "bg-[#07559f]" },
    { value: "brand", label: "Xanh ERG", className: "bg-[#00008b]" },
    { value: "ink", label: "Đen xanh", className: "bg-slate-950" },
    { value: "warm", label: "Ấm nhẹ", className: "bg-amber-50" },
]

export const accentOptions = [
    { value: "blue", label: "Xanh", className: "bg-[#00008b]" },
    { value: "red", label: "Đỏ", className: "bg-[#cc0022]" },
    { value: "green", label: "Xanh lá", className: "bg-emerald-500" },
    { value: "gold", label: "Vàng", className: "bg-amber-400" },
]

export const widthOptions = [
    { value: "normal", label: "Chuẩn" },
    { value: "wide", label: "Rộng" },
    { value: "full", label: "Tràn ngang" },
]
