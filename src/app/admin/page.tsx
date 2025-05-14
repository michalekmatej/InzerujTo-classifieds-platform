import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { getClassifieds } from "@/lib/api";
import AdminClassifiedsList from "@/components/admin-classifieds-list";

export default async function AdminPage() {
    const user = await getCurrentUser();

    // Redirect if not admin
    if (!user || user.role !== "admin") {
        redirect("/");
    }

    const classifieds = await getClassifieds();

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Administrátorský panel</h1>
                <p className="text-muted-foreground">
                    Správa všech inzerátů na platformě
                </p>
            </div>

            <AdminClassifiedsList classifieds={classifieds} />
        </div>
    );
}
