import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { cs } from "date-fns/locale";
import { Pencil } from "lucide-react";

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
import type { Classified } from "@/lib/types";

interface DashboardClassifiedsListProps {
    classifieds: Classified[];
}

export default function DashboardClassifiedsList({
    classifieds,
}: DashboardClassifiedsListProps) {
    if (classifieds.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                <h3 className="text-lg font-medium">
                    Žádné inzeráty nenalezeny
                </h3>
                <p className="text-sm text-muted-foreground">
                    Zatím jste nepřidali žádné inzeráty.
                </p>
                <Link href="/classifieds/new" className="mt-4">
                    <Button className="bg-orange-600 hover:bg-orange-700">
                        Přidat první inzerát
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[80px]">Obrázek</TableHead>
                        <TableHead>Název</TableHead>
                        <TableHead>Kategorie</TableHead>
                        <TableHead>Cena</TableHead>
                        <TableHead>Přidáno</TableHead>
                        <TableHead className="text-right">Akce</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {classifieds.map((classified) => (
                        <TableRow key={classified.id}>
                            <TableCell>
                                <div className="relative h-16 w-16 overflow-hidden rounded-md">
                                    <Image
                                        src={
                                            (classified.images && classified.images[0] && classified.images[0].url) ||
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
                                <Link
                                    href={`/classifieds/${classified.id}/edit`}
                                >
                                    <Button variant="ghost" size="sm">
                                        <Pencil className="mr-2 h-4 w-4" />
                                        Upravit
                                    </Button>
                                </Link>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
