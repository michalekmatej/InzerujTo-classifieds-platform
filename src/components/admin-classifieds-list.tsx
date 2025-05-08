"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { cs } from "date-fns/locale";
import { Pencil, Trash2, Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import type { Classified } from "@/lib/types";
import { deleteClassified } from "@/lib/api";

interface AdminClassifiedsListProps {
    classifieds: Classified[];
}

export default function AdminClassifiedsList({
    classifieds,
}: AdminClassifiedsListProps) {
    const [items, setItems] = useState(classifieds);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { toast } = useToast();

    const handleDelete = async () => {
        if (!selectedId) return;

        try {
            await deleteClassified(selectedId);
            setItems(items.filter((item) => item.id !== selectedId));
            toast({
                title: "Inzerát smazán",
                description: "Inzerát byl úspěšně smazán.",
            });
        } catch (error) {
            toast({
                title: "Chyba",
                description:
                    "Nepodařilo se smazat inzerát. Zkuste to prosím znovu.",
                variant: "destructive",
            });
        } finally {
            setIsDialogOpen(false);
            setSelectedId(null);
        }
    };

    const openDeleteDialog = (id: string) => {
        setSelectedId(id);
        setIsDialogOpen(true);
    };

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                <h3 className="text-lg font-medium">
                    Nenalezeny žádné inzeráty
                </h3>
                <p className="text-sm text-muted-foreground">
                    Na platformě zatím nejsou žádné inzeráty.
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">Obrázek</TableHead>
                            <TableHead>Název</TableHead>
                            <TableHead>Uživatel</TableHead>
                            <TableHead>Kategorie</TableHead>
                            <TableHead>Cena</TableHead>
                            <TableHead>Přidáno</TableHead>
                            <TableHead className="text-right">Akce</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.map((classified) => (
                            <TableRow key={classified.id}>
                                <TableCell>
                                    <div className="relative h-16 w-16 overflow-hidden rounded-md">
                                        <Image
                                            src={
                                                classified.imageUrl ||
                                                "/placeholder.svg?height=64&width=64"
                                            }
                                            alt={classified.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium">
                                    <Link
                                        href={`/classifieds/${classified.id}`}
                                        className="hover:underline"
                                    >
                                        {classified.title}
                                    </Link>
                                </TableCell>
                                <TableCell>{classified.userId}</TableCell>
                                <TableCell>
                                    <Badge variant="outline">
                                        {classified.category}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {classified.price.toLocaleString()} Kč
                                </TableCell>
                                <TableCell>
                                    {formatDistanceToNow(
                                        new Date(classified.createdAt),
                                        { addSuffix: true, locale: cs }
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Link
                                            href={`/classifieds/${classified.id}`}
                                        >
                                            <Button variant="ghost" size="sm">
                                                <Eye className="h-4 w-4" />
                                                <span className="sr-only">
                                                    Zobrazit
                                                </span>
                                            </Button>
                                        </Link>
                                        <Link
                                            href={`/classifieds/${classified.id}/edit`}
                                        >
                                            <Button variant="ghost" size="sm">
                                                <Pencil className="h-4 w-4" />
                                                <span className="sr-only">
                                                    Upravit
                                                </span>
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                openDeleteDialog(classified.id)
                                            }
                                            className="text-destructive hover:bg-destructive/10"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            <span className="sr-only">
                                                Smazat
                                            </span>
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
        </>
    );
}
