"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2, ArrowRight, UserCircle, Camera, Upload } from "lucide-react"
import Image from "next/image" // Import Image của Next.js

import { cn } from "@/lib/utils"
import { hasLoggedInCookie } from "@/lib/client-session"
import { userApi } from "@/services/users.api"
import { Button } from "@/components/admin/ui/button"
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter
} from "@/components/admin/ui/card"
import { Input } from "@/components/admin/ui/input"
import { Label } from "@/components/admin/ui/label"
import { Textarea } from "@/components/admin/ui/textarea"

interface OnboardingFormData {
    phone: string;
    fullName: string;
    bio: string;
    address: string;
}

export default function OnboardingPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    // State form
    const [formData, setFormData] = useState<OnboardingFormData>({
        phone: "",
        fullName: "",
        bio: "",
        address: ""
    })

    // [MỚI] State quản lý Avatar
    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const hasFetched = useRef(false);

    useEffect(() => {
        const fetchUserData = async () => {
            // Prevent double fetch in React Strict Mode
            if (hasFetched.current) return;
            hasFetched.current = true;

            if (!hasLoggedInCookie()) {
                router.push("/auth/login");
                return;
            }

            // 1. Kiểm tra nhanh trong localStorage xem đã có data (vừa save lúc login/otp) chưa
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                try {
                    const userObj = JSON.parse(storedUser);

                    // [QUAN TRỌNG] Nếu đã hoàn thành hồ sơ -> Redirect về Dashboard ngay
                    if (userObj.isProfileCompleted) {
                        router.push("/");
                        return;
                    }

                    if (userObj.fullName) {
                        setFormData(prev => ({
                            ...prev,
                            fullName: userObj.fullName || "",
                            phone: userObj.phone || userObj.phoneNumber || "",
                            bio: userObj.bio || "",
                            address: userObj.address || ""
                        }));
                        if (userObj.avatarUrl) setAvatarPreview(userObj.avatarUrl);

                        // Nếu data đã đủ (có tên và sđt) thì SKIP fetch để tránh gọi /me dư thừa
                        // Vì AuthGuard đã vừa fetch mới nhất rồi
                        if (userObj.fullName || userObj.phone) {
                            return;
                        }
                    }
                } catch (e) { }
            }

            try {
                // 2. Chỉ gọi API nếu thực sự cần reset data hoặc localStorage lỗi
                const res: any = await userApi.getMe();
                const userObj = res.data || res;

                // [MỚI] Check status pending tại đây luôn cho chắc
                // if (userObj.status === 'pending') {
                //     toast.warning("Tài khoản chưa kích hoạt");
                //     router.push(`/verify-pin?email=${encodeURIComponent(userObj.email)}&mode=activation`);
                //     return;
                // }

                setFormData(prev => ({
                    ...prev,
                    fullName: userObj.fullName || "",
                    phone: userObj.phone || userObj.phoneNumber || "",
                    bio: userObj.bio || "",
                    address: userObj.address || ""
                }));

                if (userObj.avatarUrl) {
                    setAvatarPreview(userObj.avatarUrl);
                }
            } catch (error) {
                console.error("Failed to fetch user data", error);

                // Fallback: nếu lỗi API thì thử lấy từ localStorage (option)
                const storedUser = localStorage.getItem("user");
                if (storedUser) {
                    try {
                        const userObj = JSON.parse(storedUser);
                        setFormData(prev => ({
                            ...prev,
                            fullName: userObj.fullName || "",
                        }));
                    } catch (e) {
                        // ignore
                    }
                }
            }
        };

        fetchUserData();
    }, [router]);

    const handleSkip = () => {
        // Lưu cờ vào sessionStorage (sẽ mất khi đóng tab/browser)
        sessionStorage.setItem("skipOnboarding", "true");
        toast.info("Đã bỏ qua tạm thời. Bạn có thể cập nhật sau.");
        router.push("/");
    }

    // [MỚI] Hàm xử lý khi click vào Avatar -> Mở cửa sổ chọn file
    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    }

    // [MỚI] Hàm xử lý khi chọn file xong
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate cơ bản (VD: chỉ ảnh dưới 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Ảnh quá lớn! Vui lòng chọn ảnh dưới 5MB.");
            return;
        }

        // Tạo URL preview
        const objectUrl = URL.createObjectURL(file);
        setAvatarPreview(objectUrl);
        setAvatarFile(file);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            // Tạo FormData để gửi lên server
            const payload = new FormData();
            payload.append("fullName", formData.fullName);
            payload.append("phone", formData.phone);
            payload.append("bio", formData.bio);
            // payload.append("address", formData.address); // Backend chưa có field này trong DTO onboarding, check lại nếu cần

            if (avatarFile) {
                payload.append("avatar", avatarFile);
            }

            // Gọi API Onboarding
            const updatedUser = await userApi.onboarding(payload);

            // Cập nhật lại LocalStorage với thông tin mới nhất từ server trả về
            const currentUserStr = localStorage.getItem("user");
            let newUserData = updatedUser;

            // Đảm bảo cờ isProfileCompleted luôn là true sau khi update thành công
            if (!newUserData.isProfileCompleted) {
                newUserData = { ...newUserData, isProfileCompleted: true };
            }

            if (currentUserStr) {
                const currentUser = JSON.parse(currentUserStr);
                localStorage.setItem("user", JSON.stringify({ ...currentUser, ...newUserData }));
            } else {
                localStorage.setItem("user", JSON.stringify(newUserData));
            }

            toast.success("Hồ sơ đã được cập nhật!");
            // Full reload để AdminAuthGuard fetch lại data mới nhất từ server clean nhất
            window.location.href = "/";
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Cập nhật thất bại");
        } finally {
            setIsLoading(false)
        }
    }

    const handleChange = (field: keyof OnboardingFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
            <Card className="w-full max-w-lg shadow-xl border-t-4 border-t-primary">
                <CardHeader className="text-center space-y-2">
                    {/* --- KHU VỰC AVATAR --- */}
                    <div className="flex justify-center mb-4 relative">
                        {/* Input ẩn để chọn file */}
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />

                        <div
                            className="relative group cursor-pointer"
                            onClick={handleAvatarClick} // Thêm sự kiện Click vào đây
                            title="Nhấn để đổi ảnh đại diện"
                        >
                            <div className="w-24 h-24 rounded-full border-2 border-dashed border-slate-300 hover:border-primary transition-colors overflow-hidden flex items-center justify-center bg-slate-100">
                                {avatarPreview ? (
                                    // Nếu có ảnh preview thì hiện ảnh
                                    <img
                                        src={avatarPreview}
                                        alt="Avatar Preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    // Nếu chưa có thì hiện icon
                                    <UserCircle className="w-16 h-16 text-slate-400" />
                                )}
                            </div>

                            {/* Icon Camera nhỏ ở góc */}
                            <div className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full shadow-md group-hover:scale-110 transition-transform">
                                <Camera className="w-4 h-4" />
                            </div>
                        </div>
                    </div>

                    <CardTitle className="text-2xl font-bold text-slate-800">Hoàn tất hồ sơ</CardTitle>
                    <CardDescription className="text-base">
                        Chào mừng bạn! Hãy cập nhật thông tin để chúng tôi phục vụ bạn tốt hơn.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} id="onboarding-form" className="space-y-5">

                        <div className="grid gap-2">
                            <Label htmlFor="fullName">Họ và tên</Label>
                            <Input
                                id="fullName"
                                placeholder="Nguyễn Văn A"
                                value={formData.fullName}
                                onChange={(e) => handleChange("fullName", e.target.value)}
                                disabled={isLoading}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="phone">Số điện thoại <span className="text-red-500">*</span></Label>
                            <Input
                                id="phone"
                                type="tel"
                                placeholder="0912 xxx xxx"
                                value={formData.phone}
                                onChange={(e) => handleChange("phone", e.target.value)}
                                disabled={isLoading}
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="address">Địa chỉ liên hệ</Label>
                            <Input
                                id="address"
                                placeholder="Hà Nội, Việt Nam"
                                value={formData.address}
                                onChange={(e) => handleChange("address", e.target.value)}
                                disabled={isLoading}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="bio">Giới thiệu ngắn</Label>
                            <Textarea
                                id="bio"
                                placeholder="Tôi là giáo viên bộ môn..."
                                className="resize-none min-h-[80px]"
                                value={formData.bio}
                                onChange={(e) => handleChange("bio", e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                    </form>
                </CardContent>

                <CardFooter className="flex flex-col sm:flex-row justify-between gap-3 pt-2 pb-6 px-6">
                    <Button
                        variant="ghost"
                        onClick={handleSkip}
                        disabled={isLoading}
                        className="w-full sm:w-auto order-2 sm:order-1 text-slate-500 hover:text-slate-800"
                    >
                        Bỏ qua bước này
                    </Button>

                    <Button
                        type="submit"
                        form="onboarding-form"
                        disabled={isLoading}
                        className="w-full sm:flex-1 order-1 sm:order-2 bg-primary hover:bg-primary/90"
                    >
                        {isLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <>Hoàn tất & Vào Dashboard <ArrowRight className="ml-2 h-4 w-4" /></>
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
