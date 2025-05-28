"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ClassifiedsList from "@/components/classifieds-list";
import CategoryFilter from "@/components/category-filter";
import SearchSkeleton from "@/components/search-skeleton";
import { useDebounce } from "@/hooks/use-debounce";

export default function HomePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
    const [showMobileCategories, setShowMobileCategories] = useState(false);

    // Use our custom debounce hook
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateSearchQuery(searchTerm);
    };

    // Update the URL with the search query
    const updateSearchQuery = (query: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (query) {
            params.set("q", query);
        } else {
            params.delete("q");
        }

        router.push(`/?${params.toString()}`);
    };

    // Apply debounced search
    useEffect(() => {
        if (debouncedSearchTerm !== searchParams.get("q")) {
            updateSearchQuery(debouncedSearchTerm);
        }
    }, [debouncedSearchTerm, searchParams]);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:items-center">
                    <div>
                        <h1 className="text-3xl font-bold">
                            Najděte, co potřebujete
                        </h1>
                        <p className="text-muted-foreground md:mt-2 md:-mb-6">
                            Prohlížejte všechny dostupné inzeráty
                        </p>
                    </div>
                    <Link href="/classifieds/new">
                        <Button className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700">
                            Přidat inzerát
                        </Button>
                    </Link>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4 md:flex-row md:items-center md:ml-auto"
                >
                    <div className="relative flex-1 flex">
                        <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Hledat inzeráty..."
                            className="pl-8 flex-1 md:min-w-[300px]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Button
                            type="submit"
                            className="ml-2"
                            variant="secondary"
                        >
                            Hledat
                        </Button>
                    </div>
                </form>

                {/* Mobile button to toggle categories */}
                <div className="md:hidden">
                    <Button
                        variant="outline"
                        className="w-full flex justify-between items-center"
                        onClick={() =>
                            setShowMobileCategories(!showMobileCategories)
                        }
                    >
                        <span>Kategorie</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={`w-4 h-4 transition-transform ${
                                showMobileCategories ? "rotate-180" : ""
                            }`}
                        >
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </Button>

                    {/* Mobile categories - displayed only when the button is clicked */}
                    {showMobileCategories && (
                        <div className="mt-3">
                            <Suspense fallback={<SearchSkeleton />}>
                                <CategoryFilter isMobile={true} />
                            </Suspense>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-[240px_1fr]">
                    {/* Desktop categories - hidden on mobile devices */}
                    <div className="hidden md:block">
                        <Suspense fallback={<SearchSkeleton />}>
                            <CategoryFilter />
                        </Suspense>
                    </div>

                    {/* List of classifieds */}
                    <div className="col-span-1 md:col-span-1">
                        <Suspense fallback={<SearchSkeleton />}>
                            <ClassifiedsList />
                        </Suspense>
                    </div>
                </div>
            </div>
        </div>
    );
}
