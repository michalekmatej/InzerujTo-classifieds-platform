"use client";

import Link from "next/link";
import { ArrowLeft, Heart } from "lucide-react";

import FavoritesList from "@/components/favorites-list";

export default function FavoritesPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <Link
                    href="/"
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
                >
                    <ArrowLeft className="mr-1 h-4 w-4" />
                    Zpět na seznam
                </Link>

                <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-2xl font-bold">Oblíbené inzeráty</h1>
                    <Heart className="h-5 w-5 text-orange-600 fill-orange-600" />
                </div>
                <p className="text-muted-foreground">
                    Přehled inzerátů, které jste si uložili mezi oblíbené
                </p>
            </div>

            <FavoritesList />
        </div>
    );
}
