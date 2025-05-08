"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import type { Classified } from "@/lib/types";
import { useAuth } from "@/lib/auth";
import { deleteClassified } from "@/lib/api";

interface ClassifiedActionsProps {
    classified: Classified;
}

export default function ClassifiedActions({
    classified,
}: ClassifiedActionsProps) {
    const { user } = useAuth();
    const { toast } = useToast();
    const router = useRouter();

    // Only show edit/delete if user is owner or admin
    const canModify =
        user && (user.id === classified.userId || user.role === "admin");

    if (!canModify) {
        return null;
    }

    const handleDelete = async () => {
        try {
            await deleteClassified(classified.id);
            toast({
                title: "Inzerát smazán",
                description: "Váš inzerát byl úspěšně smazán.",
            });
            router.push("/");
        } catch (error) {
            toast({
                title: "Chyba",
                description:
                    "Nepodařilo se smazat inzerát. Zkuste to prosím znovu.",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="flex gap-2">
            <Link
                href={`/classifieds/${classified.id}/edit`}
                className="flex-1"
            >
                <Button variant="outline" className="w-full">
                    <Pencil className="mr-2 h-4 w-4" />
                    Upravit
                </Button>
            </Link>

            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button
                        variant="outline"
                        className="flex-1 text-destructive hover:bg-destructive/10"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Smazat
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Jste si jistí?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tuto akci nelze vrátit zpět. Inzerát bude trvale
                            smazán.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Zrušit</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground"
                        >
                            Smazat
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
