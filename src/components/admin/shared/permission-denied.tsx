import { ShieldAlert } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/admin/ui/button";

interface PermissionDeniedProps {
    requiredPermission?: string;
    message?: string;
    suggestContact?: string;
}

export function PermissionDenied({
    requiredPermission,
    message = "Bạn không có quyền truy cập trang này",
    suggestContact = "admin@erg.edu.vn",
}: PermissionDeniedProps) {
    return (
        <div className="flex h-[80vh] w-full flex-col items-center justify-center space-y-4 px-4 text-center">
            <div className="rounded-full bg-red-100 p-6 text-red-600 dark:bg-red-900/30 dark:text-red-500">
                <ShieldAlert className="h-16 w-16" strokeWidth={1.5} />
            </div>
            <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Truy Cập Bị Từ Chối</h1>
                <p className="text-muted-foreground max-w-[500px]">
                    {message}
                </p>

                {requiredPermission && (
                    <div className="mt-4 rounded-md border bg-muted/50 p-4">
                        <p className="text-sm font-medium">Quyền cần thiết:</p>
                        <code className="mt-1 block rounded bg-background px-2 py-1 text-xs font-semibold text-rose-500 shadow-sm border">
                            {requiredPermission}
                        </code>
                    </div>
                )}

                <div className="pt-4 text-sm text-muted-foreground">
                    Nếu bạn cho rằng đây là lỗi, vui lòng liên hệ{" "}
                    <a href={`mailto:${suggestContact}`} className="font-medium text-primary hover:underline">
                        {suggestContact}
                    </a>
                </div>
            </div>

            <div className="pt-6">
                <Button asChild>
                    <Link href="/admin">Quay lại Dashboard</Link>
                </Button>
            </div>
        </div>
    );
}
