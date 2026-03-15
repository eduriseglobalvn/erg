import { redirect } from "next/navigation";

export default function AccessControlPage() {
    // Redirect to roles page by default
    redirect("/admin/access-control/roles");
}
