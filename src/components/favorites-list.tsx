"use client";

import { useEffect, useState } from "react";
import { useFavorites } from "@/lib/favorites";
import ClassifiedCard from "@/components/classified-card";
import { Skeleton } from "@/components/ui/skeleton";

export default function FavoritesList() {
    const { favorites, isLoading } = useFavorites();
    const [mounted, setMounted] = useState(false);

    // prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    if (isLoading) {
        return (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="rounded-lg border p-4">
                        <Skeleton className="h-40 w-full rounded-md" />
                        <div className="mt-4 space-y-3">
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-5 w-1/4" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (favorites.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                <h3 className="text-lg font-medium">Zatím žádné oblíbené</h3>
                <p className="text-sm text-muted-foreground">
                    Uložte si inzeráty mezi oblíbené a zobrazí se zde.
                </p>
            </div>
        );
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {favorites.map((classified) => (
                <ClassifiedCard key={classified.id} classified={classified} />
            ))}
        </div>
    );
}
