"use client";

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/lib/favorites";
import { getClassifiedById } from "@/lib/api";
import { useEffect, useState } from "react";
import type { Classified } from "@/lib/types";

interface FavoriteButtonProps {
    classifiedId: string;
}

export default function FavoriteButton({ classifiedId }: FavoriteButtonProps) {
    const { isFavorite, toggleFavorite } = useFavorites();
    const [classified, setClassified] = useState<Classified | null>(null);

    useEffect(() => {
        const fetchClassified = async () => {
            try {
                const data = await getClassifiedById(classifiedId);
                setClassified(data);
            } catch (error) {
                console.error("Failed to fetch classified:", error);
            }
        };

        fetchClassified();
    }, [classifiedId]);

    if (!classified) {
        return null;
    }

    return (
        <Button
            variant="outline"
            size="icon"
            onClick={() => toggleFavorite(classified)}
            className="h-10 w-10"
        >
            <Heart
                className={`h-5 w-5 ${
                    isFavorite(classifiedId)
                        ? "fill-orange-600 text-orange-600"
                        : ""
                }`}
            />
            <span className="sr-only">
                {isFavorite(classifiedId)
                    ? "Odebrat z oblíbených"
                    : "Přidat do oblíbených"}
            </span>
        </Button>
    );
}
