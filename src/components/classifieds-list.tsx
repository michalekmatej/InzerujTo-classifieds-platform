"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import ClassifiedCard from "@/components/classified-card";
import { getClassifieds } from "@/lib/api";
import type { Classified } from "@/lib/types";

export default function ClassifiedsList() {
    const [classifieds, setClassifieds] = useState<Classified[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const searchParams = useSearchParams();

    const category = searchParams.get("category");
    const query = searchParams.get("q");

    useEffect(() => {
        const fetchClassifieds = async () => {
            setIsLoading(true);
            try {
                const data = await getClassifieds({ category, query });
                setClassifieds(data);
            } catch (error) {
                console.error("Failed to fetch classifieds:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchClassifieds();
    }, [category, query]);

    if (isLoading) {
        return (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="h-[300px] rounded-lg bg-muted animate-pulse"
                    ></div>
                ))}
            </div>
        );
    }

    if (classifieds.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                <h3 className="text-lg font-medium">
                    Žádné inzeráty nenalezeny
                </h3>
                <p className="text-sm text-muted-foreground">
                    Zkuste změnit vyhledávací kritéria nebo filtry
                </p>
            </div>
        );
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {classifieds.map((classified) => (
                <ClassifiedCard key={classified.id} classified={classified} />
            ))}
        </div>
    );
}
