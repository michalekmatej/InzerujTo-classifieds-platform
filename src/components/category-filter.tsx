"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { getCategories } from "@/lib/api";
import { useEffect, useState } from "react";
import type { Category, CategoryWithCount } from "@/lib/types";

interface CategoryFilterProps {
    isMobile?: boolean;
}

export default function CategoryFilter({
    isMobile = false,
}: CategoryFilterProps) {
    const [categories, setCategories] = useState<CategoryWithCount[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(true);

    const router = useRouter();
    const searchParams = useSearchParams();
    const selectedCategory = searchParams.get("category");

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

    const handleCategoryChange = (categorySlug: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (categorySlug === selectedCategory) {
            params.delete("category");
        } else {
            params.set("category", categorySlug);
        }

        router.push(`/?${params.toString()}`);
    };

    // Zobrazení při načítání
    if (isLoading) {
        if (isMobile) {
            return (
                <div className="p-2 space-y-2">
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            className="h-8 w-full animate-pulse rounded bg-muted"
                        ></div>
                    ))}
                </div>
            );
        }

        return (
            <div className="space-y-4 rounded-lg border p-4">
                <div className="h-6 w-24 animate-pulse rounded bg-muted"></div>
                <Separator />
                <div className="space-y-2">
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="h-6 animate-pulse rounded bg-muted"
                        ></div>
                    ))}
                </div>
            </div>
        );
    }

    // Mobilní verze kategorií
    if (isMobile) {
        return (
            <div className="rounded-lg border p-4">
                <h3 className="font-medium mb-3">Kategorie</h3>
                <div className="space-y-2">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className="flex items-center space-x-2"
                        >
                            <Checkbox
                                id={`mobile-category-${category.id}`}
                                checked={selectedCategory === category.slug}
                                onCheckedChange={() =>
                                    handleCategoryChange(category.slug)
                                }
                            />
                            <Label
                                htmlFor={`mobile-category-${category.id}`}
                                className="flex w-full cursor-pointer justify-between text-sm"
                            >
                                <span>{category.name}</span>
                                <span className="text-muted-foreground">
                                    ({category.count})
                                </span>
                            </Label>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Desktop verze - zobrazení s možností rozbalení/sbalení
    return (
        <div className="rounded-lg border p-4">
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CollapsibleTrigger asChild>
                    <Button
                        variant="ghost"
                        className="flex w-full justify-between p-0 hover:bg-transparent"
                    >
                        <span className="font-medium">Kategorie</span>
                        <ChevronDown
                            className={`h-4 w-4 transition-transform ${
                                isOpen ? "rotate-180" : ""
                            }`}
                        />
                    </Button>
                </CollapsibleTrigger>
                {isOpen && <Separator className="my-4" /> }
                <CollapsibleContent className="space-y-2">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className="flex items-center space-x-2"
                        >
                            <Checkbox
                                id={`category-${category.id}`}
                                checked={selectedCategory === category.slug}
                                onCheckedChange={() =>
                                    handleCategoryChange(category.slug)
                                }
                            />
                            <Label
                                htmlFor={`category-${category.id}`}
                                className="flex w-full cursor-pointer justify-between text-sm"
                            >
                                <span>{category.name}</span>
                                <span className="text-muted-foreground">
                                    ({category.count})
                                </span>
                            </Label>
                        </div>
                    ))}
                </CollapsibleContent>
            </Collapsible>
        </div>
    );
}
