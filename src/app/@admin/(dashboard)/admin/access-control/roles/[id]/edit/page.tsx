"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { accessControlApi } from "@/services/access-control.api";
import { RoleForm } from "../../role-form";
import { ProtectedRoute } from "@/components/admin/shared/protected-route";

// Mock fetching
export default function EditRolePage() {
    const params = useParams();
    const id = params.id as string;

    // Fetch data từ API
    const { data: roleRes, isLoading, error } = useQuery({
        queryKey: ['roles', id],
        queryFn: () => accessControlApi.getRoleById(id),
    });

    const roleData = (roleRes as any)?.data || roleRes;

    if (isLoading) return <ProtectedRoute permission="roles.update"><div className="p-8">Đang tải dữ liệu...</div></ProtectedRoute>;
    if (error || !roleData) return <ProtectedRoute permission="roles.update"><div className="p-8 text-red-500">Không tìm thấy vai trò</div></ProtectedRoute>;

    const formattedRole = {
        id: roleData.id || roleData._id,
        name: roleData.name,
        description: roleData.description,
        permissions: roleData.permissions?.map((p: any) => typeof p === 'string' ? p : p.id) || [],
    };

    return (
        <ProtectedRoute permission="roles.update">
            <RoleForm initialData={formattedRole} isEdit />
        </ProtectedRoute>
    );
}
