"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Grid } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import SearchSkeleton from "@/components/search-skeleton";
import { getCategories } from "@/lib/api";
import type { Category, CategoryWithCount } from "@/lib/types";

export default function CategoriesPage() {
    const router = useRouter();
    const [categories, setCategories] = useState<CategoryWithCount[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            setIsLoading(true);
            try {
                const data = await getCategories();
                setCategories(data ? data : []);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                        className="h-8 w-8"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h1 className="text-3xl font-bold">Kategorie</h1>
                </div>

                <p className="text-muted-foreground">
                    Procházejte inzeráty podle kategorií
                </p>

                {isLoading ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {[...Array(6)].map((_, i) => (
                            <div
                                key={i}
                                className="h-32 animate-pulse rounded-lg bg-muted"
                            ></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                href={`/?category=${category.slug}`}
                            >
                                <Card className="h-full overflow-hidden transition-all hover:shadow-md">
                                    <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                                        <div className="mb-4 rounded-full bg-muted p-3">
                                            <Grid className="h-6 w-6" />
                                        </div>
                                        <h2 className="mb-1 text-xl font-medium">
                                            {category.name}
                                        </h2>
                                        <p className="text-sm text-muted-foreground">
                                            {category.count}{" "}
                                            {category.count === 1
                                                ? "inzerát"
                                                : category.count > 1 &&
                                                  category.count < 5
                                                ? "inzeráty"
                                                : "inzerátů"}
                                        </p>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
