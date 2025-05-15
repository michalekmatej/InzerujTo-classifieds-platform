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
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchClassified = async () => {
            setIsLoading(true);
            try {
                const data = await getClassifiedById(classifiedId);
                setClassified(data);
            } catch (error) {
                console.error("Failed to fetch classified:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchClassified();
    }, [classifiedId]);

    // Handler to toggle favorite with proper event handling
    const handleFavoriteToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        if (classified) {
            toggleFavorite(classified);
        }
    };

    // if (!classified || isLoading) {
    //     return (
    //         <Button variant="outline" size="icon" className="h-10 w-10" disabled>
    //             <Heart className="h-5 w-5" />
    //             <span className="sr-only">Loading...</span>
    //         </Button>
    //     );
    // }

    return (
        <Button
            variant="outline"
            size="icon"
            onClick={handleFavoriteToggle}
            className="h-10 w-10"
            disabled={isLoading}
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
