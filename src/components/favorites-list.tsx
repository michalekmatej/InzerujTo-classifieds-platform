"use client";

import { useEffect, useState } from "react";
import { useFavorites } from "@/lib/favorites";
import ClassifiedCard from "@/components/classified-card";

export default function FavoritesList() {
    const { favorites } = useFavorites();
    const [mounted, setMounted] = useState(false);

    // prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
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
