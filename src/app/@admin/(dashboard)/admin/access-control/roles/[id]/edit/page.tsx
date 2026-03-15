"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { accessControlApi } from "@/services/access-control.api";
import { RoleForm } from "../../role-form";

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

    if (isLoading) return <div className="p-8">Đang tải dữ liệu...</div>;
    if (error || !roleData) return <div className="p-8 text-red-500">Không tìm thấy vai trò</div>;

    const formattedRole = {
        id: roleData.id || roleData._id,
        name: roleData.name,
        description: roleData.description,
        permissions: roleData.permissions?.map((p: any) => typeof p === 'string' ? p : p.id) || [],
    };

    return <RoleForm initialData={formattedRole} isEdit />;
}
