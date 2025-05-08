import { redirect } from "next/navigation";
import ClassifiedForm from "@/components/classified-form";
import { getCurrentUser } from "@/lib/auth";

export default async function NewClassifiedPage() {
    const user = await getCurrentUser();

    // Redirect to login if not authenticated
    if (!user) {
        redirect("/login?redirect=/classifieds/new");
    }

    return (
        <div className="container mx-auto max-w-3xl px-4 py-8">
            <h1 className="mb-6 text-2xl font-bold">Přidat nový inzerát</h1>
            <ClassifiedForm userId={user.id} />
        </div>
    );
}
