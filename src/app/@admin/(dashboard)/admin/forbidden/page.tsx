import Link from "next/link";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/admin/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/admin/ui/card";

export default function ForbiddenPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    // Extract the requested path or permission from URL if needed
    const returnUrl = searchParams.returnUrl as string || "/admin";
    const requiredPerm = searchParams.required as string || undefined;

    return (
        <div className="flex h-screen w-full items-center justify-center p-4 bg-slate-50">
            <Card className="max-w-md w-full shadow-lg border-red-100">
                <CardHeader className="text-center space-y-2">
                    <div className="flex justify-center mb-4">
                        <div className="h-20 w-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                            <ShieldAlert className="h-10 w-10" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-800">Truy cập bị từ chối</CardTitle>
                    <CardDescription className="text-base">
                        Bạn không có quyền truy cập vào trang này.
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-center text-sm text-slate-600">
                    <p>
                        Tài khoản của bạn thiếu quyền hạn cần thiết để xem nội dung hoặc thực hiện hành động này.
                    </p>
                    {requiredPerm && (
                        <div className="mt-4 p-3 bg-slate-100 rounded-md border border-slate-200 inline-block text-left">
                            <span className="font-semibold block mb-1">Mã quyền bị thiếu:</span>
                            <code className="text-red-500 bg-red-50 px-2 py-1 rounded">{requiredPerm}</code>
                        </div>
                    )}
                    <p className="mt-4 text-xs">
                        Nếu bạn cho rằng đây là lỗi, vui lòng liên hệ Quản trị viên hệ thống để được cấp quyền.
                    </p>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center border-t pt-6">
                    <Button variant="outline" asChild className="w-full sm:w-auto">
                        <Link href={returnUrl}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Quay lại
                        </Link>
                    </Button>
                    <Button asChild className="w-full sm:w-auto">
                        <Link href="/admin">
                            <Home className="mr-2 h-4 w-4" />
                            Trang chủ Dashboard
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
