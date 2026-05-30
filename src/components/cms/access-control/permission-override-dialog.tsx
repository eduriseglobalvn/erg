"use client";

import * as React from "react";
import { Check, ShieldAlert, X } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/cms/ui/dialog";
import { Button } from "@/components/cms/ui/button";
import { ScrollArea } from "@/components/cms/ui/scroll-area";
import { Badge } from "@/components/cms/ui/badge";

interface Permission {
    id: string;
    resource: string;
    action: string;
    description: string;
}

interface PermissionOverrideDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: any;
    availablePermissions: Permission[];
    onSave: (overrides: Record<string, 'ALLOW' | 'DENY'>) => void;
}

export function PermissionOverrideDialog({
    open,
    onOpenChange,
    user,
    availablePermissions,
    onSave,
}: PermissionOverrideDialogProps) {
    // Trạng thái local lưu trữ override. Key là permission id, value là ALLOW hoặc DENY
    const [overrides, setOverrides] = React.useState<Record<string, 'ALLOW' | 'DENY'>>({});

    // Mở form lên thì load overrides hiện tại từ user (nếu có backend trả về)
    React.useEffect(() => {
        if (open && user?.overrides) {
            setOverrides(user.overrides);
        } else {
            setOverrides({});
        }
    }, [open, user]);

    const handleSetOverride = (permId: string, type: 'ALLOW' | 'DENY') => {
        setOverrides(prev => {
            const next = { ...prev };
            // Nút bấm lại lần 2 để bỏ override
            if (next[permId] === type) {
                delete next[permId];
            } else {
                next[permId] = type;
            }
            return next;
        });
    };

    const handleSave = () => {
        onSave(overrides);
        onOpenChange(false);
    };

    // Nhóm permission theo resource
    const groupedPermissions = React.useMemo(() => {
        const groups: Record<string, Permission[]> = {};
        for (const p of availablePermissions) {
            if (!groups[p.resource]) groups[p.resource] = [];
            groups[p.resource].push(p);
        }
        return groups;
    }, [availablePermissions]);

    if (!user) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <ShieldAlert className="h-5 w-5 text-amber-500" />
                        Ghi đè quyền cho người dùng: {user.name}
                    </DialogTitle>
                    <DialogDescription>
                        Bạn đang gán quyền chặn/cho phép trực tiếp trên người dùng (bất kể Role của họ là gì).
                        Quyền ghi đè có độ ưu tiên cao nhất.
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="flex-1 pr-4 -mr-4 border rounded-md p-4 bg-muted/20">
                    <div className="space-y-6">
                        {Object.entries(groupedPermissions).map(([resource, perms]) => (
                            <div key={resource} className="space-y-3">
                                <h4 className="font-semibold text-sm uppercase text-slate-500 tracking-wider">
                                    Resource: {resource}
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {perms.map(p => {
                                        const currentOverride = overrides[p.id];
                                        return (
                                            <div
                                                key={p.id}
                                                className={`border rounded-lg p-3 text-sm flex flex-col justify-between gap-3 transition-colors ${currentOverride === 'ALLOW' ? 'border-green-300 bg-green-50' : currentOverride === 'DENY' ? 'border-red-300 bg-red-50' : 'bg-white'}`}
                                            >
                                                <div>
                                                    <div className="font-medium flex items-center gap-2">
                                                        {p.action}
                                                        {currentOverride && (
                                                            <Badge variant={currentOverride === 'ALLOW' ? 'default' : 'destructive'} className={currentOverride === 'ALLOW' ? 'bg-green-600' : ''}>
                                                                {currentOverride}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                                        {p.description}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2 justify-end">
                                                    <Button
                                                        size="sm"
                                                        variant={currentOverride === 'ALLOW' ? 'default' : 'outline'}
                                                        className={currentOverride === 'ALLOW' ? 'bg-green-600 hover:bg-green-700' : 'text-slate-500 border-slate-200'}
                                                        onClick={() => handleSetOverride(p.id, 'ALLOW')}
                                                    >
                                                        <Check className="h-3.5 w-3.5 mr-1" /> Cho phép
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant={currentOverride === 'DENY' ? 'destructive' : 'outline'}
                                                        className={currentOverride !== 'DENY' ? 'text-slate-500 border-slate-200' : ''}
                                                        onClick={() => handleSetOverride(p.id, 'DENY')}
                                                    >
                                                        <X className="h-3.5 w-3.5 mr-1" /> Chặn
                                                    </Button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>

                <DialogFooter className="mt-4 pt-4 border-t">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Hủy bỏ
                    </Button>
                    <Button onClick={handleSave}>Lưu cấu hình</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
