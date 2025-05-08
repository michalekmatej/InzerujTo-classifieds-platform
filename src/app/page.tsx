import { Suspense } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ClassifiedsList from "@/components/classifieds-list";
import CategoryFilter from "@/components/category-filter";
import SearchSkeleton from "@/components/search-skeleton";

export default function HomePage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold">
                        Najděte, co potřebujete
                    </h1>
                    <p className="text-muted-foreground">
                        Procházejte tisíce inzerátů
                    </p>
                </div>

                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Hledat inzeráty..."
                            className="pl-8"
                        />
                    </div>
                    <Link href="/classifieds/new">
                        <Button className="w-full md:w-auto bg-orange-600 hover:bg-orange-700">
                            Přidat inzerát
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-[240px_1fr]">
                    <div className="order-2 md:order-1">
                        <Suspense fallback={<SearchSkeleton />}>
                            <CategoryFilter />
                        </Suspense>
                    </div>
                    <div className="order-1 md:order-2">
                        <Suspense fallback={<SearchSkeleton />}>
                            <ClassifiedsList />
                        </Suspense>
                    </div>
                </div>
            </div>
        </div>
    );
}
