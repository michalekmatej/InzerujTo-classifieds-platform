import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ClassifiedForm from "@/components/classified-form";
import { getCurrentUser } from "@/lib/auth/session";
import { ClassifiedService } from "@/lib/db/models/classified";

interface EditClassifiedPageProps {
    params: {
        id: string;
    };
}

export default async function EditClassifiedPage({
    params,
}: EditClassifiedPageProps) {
    const { id } = await params;
    const user = await getCurrentUser();

    // Redirect to login if not authenticated
    if (!user) {
        redirect(`/login?redirect=/classifieds/${id}/edit`);
    }

    const classifiedsService = await ClassifiedService.getInstance();
    const classified = await classifiedsService.findById(id);

    // If classified doesn't exist, show 404
    if (!classified) {
        notFound();
    }

    // Only allow edit by the owner or admins
    if (classified.userId !== user.id && user.role !== "admin") {
        redirect(`/classifieds/${id}`);
    }

    return (
        <div className="container mx-auto max-w-3xl px-4 py-8">
            <div className="mb-6">
                <Link
                    href={`/classifieds/${id}`}
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="mr-1 h-4 w-4" />
                    Zpět na inzerát
                </Link>
            </div>
            <h1 className="mb-6 text-2xl font-bold">Upravit inzerát</h1>
            <ClassifiedForm userId={user.id} classified={classified} />
        </div>
    );
}
