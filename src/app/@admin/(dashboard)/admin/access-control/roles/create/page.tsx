import { RoleForm } from "../role-form";
import { ProtectedRoute } from "@/components/admin/shared/protected-route";

export default function CreateRolePage() {
    return (
        <ProtectedRoute permission="roles.create">
            <RoleForm />
        </ProtectedRoute>
    );
}
