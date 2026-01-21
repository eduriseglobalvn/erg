"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2, ArrowRight, UserCircle, Camera, Upload } from "lucide-react"
import Image from "next/image" // Import Image của Next.js

import { cn } from "@/lib/utils"
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

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            router.push("/auth/login");
            return;
        }

        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const userObj = JSON.parse(storedUser);
                setFormData(prev => ({
                    ...prev,
                    fullName: userObj.fullName || "",
                    phone: userObj.phone || "",
                    // Nếu user đã có avatar cũ thì hiển thị luôn
                    // avatarUrl: userObj.avatarUrl || ""
                }));
                if (userObj.avatarUrl) {
                    setAvatarPreview(userObj.avatarUrl);
                }
            } catch (e) {
                console.error("Error parsing user data", e);
            }
        }
    }, [router]);

    const handleSkip = () => {
        toast.info("Bạn có thể cập nhật hồ sơ sau trong phần Cài đặt");
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
            // [TODO: Upload Avatar]
            // Ở đây bạn sẽ gọi API upload ảnh lên R2/S3 trước
            // const uploadRes = await uploadApi.upload(avatarFile);
            // const finalAvatarUrl = uploadRes.url;

            // Tạm thời mình bỏ qua bước upload file thật và gửi thông tin text trước
            const payload = {
                ...formData,
                isProfileCompleted: true,
                // avatarUrl: finalAvatarUrl // Khi nào có API upload thì uncomment dòng này
            };

            const updatedUser = await userApi.updateProfile(payload);

            // Cập nhật LocalStorage
            const currentUser = localStorage.getItem("user");
            if (currentUser) {
                const userObj = JSON.parse(currentUser);
                localStorage.setItem("user", JSON.stringify({ ...userObj, ...updatedUser }));
            }

            toast.success("Hồ sơ đã được cập nhật!");
            router.push("/")
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