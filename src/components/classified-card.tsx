"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { cs } from "date-fns/locale";
import { Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Classified } from "@/lib/types";
import { useFavorites } from "@/lib/favorites";

interface ClassifiedCardProps {
    classified: Classified;
}

export default function ClassifiedCard({ classified }: ClassifiedCardProps) {
    const { id, title, price, category, location, createdAt, imageUrl } =
        classified;
    const { isFavorite, toggleFavorite } = useFavorites();
    const [isHovered, setIsHovered] = useState(false);

    const formattedDate = formatDistanceToNow(new Date(createdAt), {
        addSuffix: true,
        locale: cs,
    });

    // Handler to toggle favorite with proper event handling
    const handleFavoriteToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(classified);
    };

    return (
        <Link href={`/classifieds/${id}`} className="h-full block">
            <Card
                className="overflow-hidden transition-all hover:shadow-md h-full flex flex-col"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="relative aspect-square">
                    <Image
                        src={
                            imageUrl || "/placeholder.svg?height=300&width=300"
                        }
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-300"
                        style={{
                            transform: isHovered ? "scale(1.05)" : "scale(1)",
                        }}
                    />
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2 bg-background/80 backdrop-blur-sm"
                        onClick={handleFavoriteToggle}
                    >
                        <Heart
                            className={`h-5 w-5 ${
                                isFavorite(id)
                                    ? "fill-orange-600 text-orange-600"
                                    : "text-muted-foreground"
                            }`}
                        />
                    </Button>
                </div>
                <CardContent className="p-4 flex-grow">
                    <div className="mb-2 flex items-start justify-between gap-2">
                        <h3 className="line-clamp-2 font-medium hover:underline">
                            {title}
                        </h3>
                        <span className="whitespace-nowrap text-lg font-bold text-orange-600">
                            {price.toLocaleString()} Kč
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline">{category}</Badge>
                        <span className="text-xs text-muted-foreground">
                            {location}
                        </span>
                    </div>
                </CardContent>
                <CardFooter className="border-t p-4 text-xs text-muted-foreground mt-auto">
                    Přidáno {formattedDate}
                </CardFooter>
            </Card>
        </Link>
    );
}
